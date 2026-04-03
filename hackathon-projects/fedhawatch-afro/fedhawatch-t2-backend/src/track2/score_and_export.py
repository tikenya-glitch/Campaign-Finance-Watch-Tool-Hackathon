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


def risk_label(
    gap_pct: Optional[float],
    reporting_status: str,
    has_observations: bool
) -> Tuple[str, str]:

    if reporting_status == "NOT_FILED":
        return "USI", "No Disclosure Filed"

    if not has_observations:
        return "INSUFFICIENT_DATA", "Not enough observations yet"

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
        SELECT entity_id, metric, period_start, period_end,
               declared_amount_kes, reconciliation_status,
               declared_confidence, chosen_source_org,
               alternatives_json
        FROM canonical_declared
        WHERE metric='ppf_allocation_total_kes'
    """)

    declared_rows = cur.fetchall()

    declared_by_entity = {r["entity_id"]: r for r in declared_rows}

    cur.execute("""
        SELECT entity_id, asset_type, quantity, county,
               timestamp, duration_value, duration_unit,
               confidence, cluster_id
        FROM observed_assets
    """)

    obs_rows = cur.fetchall()

    shadow_by_entity: Dict[str, Dict] = {}

    for r in obs_rows:

        entity_id = r["entity_id"]
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

        if entity_id not in shadow_by_entity:
            shadow_by_entity[entity_id] = {
                "shadow_spend": 0.0,
                "drivers": {}
            }

        shadow_by_entity[entity_id]["shadow_spend"] += cost

        shadow_by_entity[entity_id]["drivers"][asset_type] = (
            shadow_by_entity[entity_id]["drivers"].get(asset_type, 0.0) + cost
        )

    entity_ids = set(declared_by_entity.keys()) | set(shadow_by_entity.keys())

    candidates: List[Dict] = []

    for entity_id in sorted(entity_ids):

        declared = declared_by_entity.get(entity_id)
        shadow_info = shadow_by_entity.get(entity_id, {"shadow_spend": 0.0, "drivers": {}})

        reported_spend = int(declared["declared_amount_kes"]) if declared else None
        shadow_spend = int(round(shadow_info["shadow_spend"]))

        reporting_status = "FILED" if declared else "NOT_FILED"

        has_observations = shadow_spend > 0

        gap_pct: Optional[float] = None

        if reporting_status == "FILED" and has_observations:
            denom = max(reported_spend or 0, EPSILON)
            gap_pct = ((shadow_spend - (reported_spend or 0)) / denom) * 100.0

        risk_level, label = risk_label(gap_pct, reporting_status, has_observations)

        drivers_sorted = sorted(
            shadow_info["drivers"].items(),
            key=lambda x: x[1],
            reverse=True
        )

        drivers = [k for k, _ in drivers_sorted[:5]]

        sources = []
        reconciliation_status = None

        if declared:
            reconciliation_status = declared["reconciliation_status"]

            try:
                alts = json.loads(declared["alternatives_json"] or "[]")

                for a in alts[:5]:
                    sources.append({
                        "source_org": a.get("source_org"),
                        "source_url": a.get("source_url"),
                        "doc_id": a.get("doc_id"),
                        "page_number": a.get("page_number"),
                    })

            except Exception:
                pass

        name_clean = entity_id.replace("party_", "").replace("_", " ").title()

        candidates.append({
            "entity_id": entity_id,
            "name": name_clean,
            "party": name_clean,
            "county": None,
            "reported_spend_kes": reported_spend,
            "shadow_spend_kes": shadow_spend,
            "gap_percent": None if gap_pct is None else round(gap_pct, 2),
            "risk_level": risk_level,
            "label": label,
            "confidence_overall": None,
            "drivers": drivers,
            "reconciliation_status": reconciliation_status,
            "sources": sources,
            "reporting_status": reporting_status,
        })

    payload = {
        "generated_at": datetime.now(UTC).isoformat(),
        "period_start": "2024-07-01",
        "period_end": "2025-06-30",
        "candidates": candidates,
    }

    OUT_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    conn.close()

    print(f"Exported {len(candidates)} candidate record(s) to {OUT_PATH}")


if __name__ == "__main__":
    main()