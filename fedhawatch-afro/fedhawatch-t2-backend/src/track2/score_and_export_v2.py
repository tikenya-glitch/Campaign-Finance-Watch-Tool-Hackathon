import json
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from datetime import datetime, UTC

from track2.db.db import get_connection

OUT_PATH = Path("outputs/fedhawatch2_contract.json")
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

GREEN_MIN = -20.0
GREEN_MAX = 20.0
YELLOW_MAX = 50.0
EPSILON = 1000

POSITION_THRESHOLDS = {
    "President": 5_000_000,
    "Governor": 4_000_000,
    "Senator": 2_500_000,
    "Women Rep": 2_500_000,
    "MP": 1_500_000,
    "MCA": 500_000,
    None: 2_500_000,
}


@dataclass
class PriceProxy:
    asset_type: str
    price_per_unit_kes: int
    unit: str


def load_price_proxies(cur) -> Dict[str, PriceProxy]:
    cur.execute("SELECT asset_type, price_per_unit_kes, unit FROM asset_price_proxy")
    proxies = {}
    for r in cur.fetchall():
        proxies[r["asset_type"]] = PriceProxy(
            asset_type=r["asset_type"],
            price_per_unit_kes=int(r["price_per_unit_kes"]),
            unit=r["unit"],
        )
    return proxies


def duration_multiplier(proxy_unit: str, duration_value: int, duration_unit: str) -> float:
    duration_value = int(duration_value or 0)
    duration_unit = (duration_unit or "").lower().strip()

    if proxy_unit == "per_event":
        return 1.0

    if proxy_unit == "per_30_days":
        if duration_unit == "day":
            return max(duration_value, 1) / 30.0
        if duration_unit == "month":
            return max(duration_value, 1)
        return 1.0

    if proxy_unit == "per_day":
        if duration_unit == "day":
            return float(max(duration_value, 1))
        return 1.0

    return 1.0


def comparison_threshold(entity_type: str, position: Optional[str]) -> int:
    if entity_type == "party":
        return 5_000_000
    return POSITION_THRESHOLDS.get(position, 2_500_000)


def risk_label(
    gap_pct: Optional[float],
    reporting_status: str,
    has_observations: bool,
    reported_spend: Optional[int],
    shadow_spend: int,
    entity_type: str,
    position: Optional[str],
) -> Tuple[str, str]:
    if reporting_status == "NOT_FILED" and has_observations:
        return "USI", "No disclosure filed"
    if reporting_status == "NOT_FILED" and not has_observations:
        return "INSUFFICIENT_DATA", "Not enough observations to determine risk level"
    if not has_observations:
        return "INSUFFICIENT_DATA", "Not enough observations to determine risk level"

    min_threshold = comparison_threshold(entity_type, position)
    if reported_spend is not None and shadow_spend < min_threshold:
        return "INSUFFICIENT_DATA", "Not enough observations to determine risk level"

    assert gap_pct is not None

    if GREEN_MIN <= gap_pct <= GREEN_MAX:
        return "GREEN", "Within expected range"
    if GREEN_MAX < gap_pct <= YELLOW_MAX:
        return "YELLOW", "Transparency concern"
    if gap_pct > YELLOW_MAX:
        return "RED", "Unexplained expenditure spike detected"
    return "BLUE", "Underutilization anomaly — reported spend far exceeds observed activity"


def explain_drivers(
    risk_level: str,
    reporting_status: str,
    drivers_breakdown: Dict[str, int],
    shadow_spend: int,
    reported_spend: Optional[int],
) -> List[str]:
    if reporting_status == "NOT_FILED" and shadow_spend > 0:
        lines = ["No disclosure filed — shadow budget observed"]
    elif not drivers_breakdown:
        lines = ["No significant observed campaign activity yet"]
    else:
        lines = []

    sorted_drivers = sorted(drivers_breakdown.items(), key=lambda x: x[1], reverse=True)

    for driver, amount in sorted_drivers[:3]:
        if driver == "billboard":
            lines.append(f"Billboard activity estimated at KES {amount:,}")
        elif driver == "rally":
            lines.append(f"Rally logistics estimated at KES {amount:,}")
        elif driver == "campaign_vehicle":
            lines.append(f"Campaign vehicle activity estimated at KES {amount:,}")
        elif driver.endswith("_ads"):
            platform = driver.replace("_ads", "").upper()
            lines.append(f"{platform} ad activity estimated at KES {amount:,}")
        else:
            lines.append(f"{driver.replace('_', ' ').title()} estimated at KES {amount:,}")

    if reporting_status == "FILED" and reported_spend is not None and shadow_spend > reported_spend and risk_level in {"YELLOW", "RED"}:
        lines.append("Observed campaign activity exceeds declared spending")

    if reporting_status == "FILED" and reported_spend is not None and shadow_spend < reported_spend and risk_level == "BLUE":
        lines.append("Declared spend far exceeds observed activity")

    return lines[:3] if lines else ["No major anomaly drivers available"]


def main():
    conn = get_connection()
    cur = conn.cursor()
    proxies = load_price_proxies(cur)

    cur.execute("""
        SELECT entity_id, entity_type, display_name, position, county, constituency, ward
        FROM entities
        WHERE country='KE'
    """)
    entities = cur.fetchall()

    cur.execute("""
        SELECT entity_id, metric, period_start, period_end,
               declared_amount_kes, reconciliation_status,
               chosen_source_org, alternatives_json
        FROM canonical_declared
    """)
    declared_rows = cur.fetchall()

    declared_by_entity: Dict[str, dict] = {}
    for r in declared_rows:
        eid = r["entity_id"]
        if eid not in declared_by_entity:
            declared_by_entity[eid] = {}
        declared_by_entity[eid][r["metric"]] = r

    shadow_by_entity: Dict[str, Dict] = {}

    cur.execute("""
        SELECT entity_id, asset_type, quantity, duration_value,
               duration_unit, confidence
        FROM observed_assets
    """)
    obs_rows = cur.fetchall()

    for r in obs_rows:
        eid = r["entity_id"]
        asset_type = r["asset_type"]
        qty = int(r["quantity"] or 0)
        conf = float(r["confidence"] or 0.0)
        duration_value = int(r["duration_value"] or 0)
        duration_unit = r["duration_unit"] or ""

        proxy = proxies.get(asset_type)
        if not proxy:
            continue

        mult = duration_multiplier(proxy.unit, duration_value, duration_unit)
        cost = proxy.price_per_unit_kes * qty * mult * conf

        if eid not in shadow_by_entity:
            shadow_by_entity[eid] = {"shadow_spend": 0.0, "drivers": {}}

        shadow_by_entity[eid]["shadow_spend"] += cost
        shadow_by_entity[eid]["drivers"][asset_type] = (
            shadow_by_entity[eid]["drivers"].get(asset_type, 0.0) + cost
        )

    cur.execute("""
        SELECT entity_id, platform, amount_kes, confidence
        FROM digital_spend
    """)
    digital_rows = cur.fetchall()

    for r in digital_rows:
        eid = r["entity_id"]
        platform = (r["platform"] or "DIGITAL").upper()
        amount = int(r["amount_kes"] or 0)
        conf = float(r["confidence"] or 0.0)

        weighted = amount * conf
        driver_name = f"{platform.lower()}_ads"

        if eid not in shadow_by_entity:
            shadow_by_entity[eid] = {"shadow_spend": 0.0, "drivers": {}}

        shadow_by_entity[eid]["shadow_spend"] += weighted
        shadow_by_entity[eid]["drivers"][driver_name] = (
            shadow_by_entity[eid]["drivers"].get(driver_name, 0.0) + weighted
        )

    records: List[Dict] = []

    for e in entities:
        eid = e["entity_id"]
        etype = e["entity_type"]
        name = e["display_name"]
        position = e["position"]

        declared_row = None
        reported_metric = None
        if eid in declared_by_entity:
            reported_metric = list(declared_by_entity[eid].keys())[0]
            declared_row = declared_by_entity[eid][reported_metric]

        reported_spend = int(declared_row["declared_amount_kes"]) if declared_row else None
        reporting_status = "FILED" if declared_row else "NOT_FILED"

        shadow_info = shadow_by_entity.get(eid, {"shadow_spend": 0.0, "drivers": {}})
        shadow_spend = int(round(shadow_info["shadow_spend"]))
        has_observations = shadow_spend > 0

        gap_pct = None
        if reporting_status == "FILED" and has_observations:
            denom = max(reported_spend or 0, EPSILON)
            gap_pct = ((shadow_spend - (reported_spend or 0)) / denom) * 100.0

        risk_level_value, label = risk_label(
            gap_pct,
            reporting_status,
            has_observations,
            reported_spend,
            shadow_spend,
            etype,
            position,
        )

        drivers_sorted = sorted(
            shadow_info["drivers"].items(),
            key=lambda x: x[1],
            reverse=True
        )
        drivers_breakdown = {k: int(round(v)) for k, v in drivers_sorted}
        driver_text = explain_drivers(
            risk_level_value,
            reporting_status,
            drivers_breakdown,
            shadow_spend,
            reported_spend,
        )

        party_entity_id = None
        if etype == "candidate":
            cur.execute("""
                SELECT party_entity_id
                FROM affiliations
                WHERE candidate_entity_id=?
                LIMIT 1
            """, (eid,))
            row = cur.fetchone()
            if row:
                party_entity_id = row["party_entity_id"]

        reconciliation_status = None
        chosen_source_org = None
        sources = []

        if declared_row:
            reconciliation_status = declared_row["reconciliation_status"]
            chosen_source_org = declared_row["chosen_source_org"]

            try:
                alternatives = json.loads(declared_row["alternatives_json"] or "[]")
                for alt in alternatives:
                    sources.append({
                        "source_org": alt.get("source_org"),
                        "source_url": alt.get("source_url"),
                        "doc_id": alt.get("doc_id"),
                        "page_number": alt.get("page_number"),
                    })
            except Exception:
                pass

        cur.execute("""
            SELECT platform, source_url
            FROM digital_spend
            WHERE entity_id=?
        """, (eid,))
        for row in cur.fetchall():
            sources.append({
                "source_org": row["platform"],
                "source_url": row["source_url"],
                "doc_id": None,
                "page_number": None,
            })

        # Ensure all source objects have required keys
        normalized_sources = []
        for s in sources:
            normalized_sources.append({
                "source_org": s.get("source_org"),
                "source_url": s.get("source_url"),
                "doc_id": s.get("doc_id"),
                "page_number": s.get("page_number"),
            })

        records.append({
            "entity_id": eid,
            "entity_type": etype,
            "display_name": name,
            "party_entity_id": party_entity_id,
            "county": e["county"],
            "constituency": e["constituency"],
            "ward": e["ward"],
            "reported_spend_kes": reported_spend,
            "reported_metric": reported_metric,
            "shadow_spend_kes": shadow_spend,
            "gap_percent": None if gap_pct is None else round(gap_pct, 1),
            "risk_level": risk_level_value,
            "label": label,
            "drivers": driver_text,
            "reconciliation_status": reconciliation_status,
            "chosen_source_org": chosen_source_org,
            "sources": normalized_sources,
            "reporting_status": reporting_status
        })

    payload = {
        "generated_at": datetime.now(UTC).isoformat(),
        "period_start": "2024-07-01",
        "period_end": "2025-06-30",
        "entities": records,
    }

    OUT_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    conn.close()

    print(f"Exported {len(records)} entity record(s) to {OUT_PATH}")


if __name__ == "__main__":
    main()