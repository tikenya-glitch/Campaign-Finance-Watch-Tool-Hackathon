import json
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from datetime import datetime, UTC

from track2.db.db import get_connection

OUT_PATH = Path("outputs/fedhawatch_contract.json")
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

GREEN_MIN = -20.0
GREEN_MAX = 20.0
YELLOW_MAX = 50.0
EPSILON = 1000

# Comparison thresholds by electoral scale
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
    # No disclosure + observed spend => true USI
    if reporting_status == "NOT_FILED" and has_observations:
        return "USI", "No Disclosure Filed"

    # No disclosure + no observed spend => insufficient data
    if reporting_status == "NOT_FILED" and not has_observations:
        return "INSUFFICIENT_DATA", "No disclosure and no observed activity yet"

    if not has_observations:
        return "INSUFFICIENT_DATA", "Not enough observations yet"

    # Position-aware coverage threshold before comparison
    min_threshold = comparison_threshold(entity_type, position)
    if reported_spend is not None and shadow_spend < min_threshold:
        return "INSUFFICIENT_DATA", f"Observed coverage too low for comparison (< {min_threshold:,} KES)"

    assert gap_pct is not None

    if GREEN_MIN <= gap_pct <= GREEN_MAX:
        return "GREEN", "Within expected range"
    if GREEN_MAX < gap_pct <= YELLOW_MAX:
        return "YELLOW", "Transparency concern"
    if gap_pct > YELLOW_MAX:
        return "RED", "Unexplained Expenditure Spike"
    return "BLUE", "Underutilization anomaly"


def main():
    conn = get_connection()
    cur = conn.cursor()
    proxies = load_price_proxies(cur)

    cur.execute("""
        SELECT entity_id, entity_type, display_name, position, county, constituency, ward, logo_url, profile_photo_url
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

    # observed assets
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

    # digital ads
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
        drivers = [k for k, _ in drivers_sorted[:5]]
        drivers_breakdown = {k: int(round(v)) for k, v in drivers_sorted}

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

        # add digital spend source URLs too
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

        records.append({
            "entity_id": eid,
            "entity_type": etype,
            "display_name": name,
            "position": position,
            "party_entity_id": party_entity_id,
            "county": e["county"],
            "constituency": e["constituency"],
            "ward": e["ward"],
            "logo_url": e["logo_url"],
            "profile_photo_url": e["profile_photo_url"],
            "reported_spend_kes": reported_spend,
            "reported_metric": reported_metric,
            "shadow_spend_kes": shadow_spend,
            "gap_percent": None if gap_pct is None else round(gap_pct, 2),
            "risk_level": risk_level_value,
            "label": label,
            "drivers": drivers,
            "drivers_breakdown": drivers_breakdown,
            "reconciliation_status": reconciliation_status,
            "chosen_source_org": chosen_source_org,
            "sources": sources,
            "reporting_status": reporting_status
        })

    summary = {
        "total_entities": len(records),
        "total_parties": sum(1 for r in records if r["entity_type"] == "party"),
        "total_candidates": sum(1 for r in records if r["entity_type"] == "candidate"),
        "total_shadow_spend_kes": sum(r["shadow_spend_kes"] or 0 for r in records),
        "risk_counts": {
            "GREEN": sum(1 for r in records if r["risk_level"] == "GREEN"),
            "YELLOW": sum(1 for r in records if r["risk_level"] == "YELLOW"),
            "RED": sum(1 for r in records if r["risk_level"] == "RED"),
            "BLUE": sum(1 for r in records if r["risk_level"] == "BLUE"),
            "USI": sum(1 for r in records if r["risk_level"] == "USI"),
            "INSUFFICIENT_DATA": sum(1 for r in records if r["risk_level"] == "INSUFFICIENT_DATA"),
        }
    }

    payload = {
        "generated_at": datetime.now(UTC).isoformat(),
        "period_start": "2024-07-01",
        "period_end": "2025-06-30",
        "summary": summary,
        "entities": records,
    }

    OUT_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    conn.close()

    print(f"Exported {len(records)} entity record(s) to {OUT_PATH}")


if __name__ == "__main__":
    main()