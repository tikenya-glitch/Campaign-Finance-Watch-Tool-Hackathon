import json
import uuid

from track2.db.db import get_connection

# Authority order (locked)
AUTHORITY = ["ORPP", "GAZETTE", "IEBC", "OTHER"]

# Declared reconciliation tolerance (locked for declared numbers)
TOLERANCE_PCT = 2.0


def within_tolerance(a: int, b: int) -> bool:
    if a == 0 and b == 0:
        return True
    # avoid divide by zero
    denom = max(abs(a), abs(b), 1)
    return (abs(a - b) / denom) * 100.0 <= TOLERANCE_PCT


def main():
    conn = get_connection()
    cur = conn.cursor()

    # Group claims by entity/metric/period
    cur.execute("""
        SELECT entity_id, metric, period_start, period_end
        FROM claims
        GROUP BY entity_id, metric, period_start, period_end
    """)
    groups = cur.fetchall()

    inserted = 0

    for g in groups:
        entity_id = g["entity_id"]
        metric = g["metric"]
        period_start = g["period_start"]
        period_end = g["period_end"]

        cur.execute("""
            SELECT amount_kes, source_org, source_url, doc_id, page_number, extraction_confidence
            FROM claims
            WHERE entity_id=? AND metric=? AND period_start=? AND period_end=?
        """, (entity_id, metric, period_start, period_end))
        claims = cur.fetchall()
        if not claims:
            continue

        # Sort claims by authority order
        claims_sorted = sorted(
            claims,
            key=lambda r: AUTHORITY.index(r["source_org"]) if r["source_org"] in AUTHORITY else len(AUTHORITY)
        )

        # Check if there are multiple consistent values (cluster within tolerance)
        values = [int(r["amount_kes"]) for r in claims_sorted]
        chosen = None
        status = None

        if len(values) == 1:
            chosen = claims_sorted[0]
            status = "CONSISTENT"
        else:
            # See if all values are mutually within tolerance
            consistent = True
            for i in range(len(values)):
                for j in range(i + 1, len(values)):
                    if not within_tolerance(values[i], values[j]):
                        consistent = False
                        break
                if not consistent:
                    break

            if consistent:
                # Choose median by value (simple)
                values_sorted = sorted(values)
                median_val = values_sorted[len(values_sorted)//2]
                # Pick the first claim that matches median (or closest)
                chosen = min(claims_sorted, key=lambda r: abs(int(r["amount_kes"]) - median_val))
                status = "CONSISTENT"
            else:
                # Authority override: pick the highest authority source
                chosen = claims_sorted[0]
                status = "AUTHORITY_OVERRIDE"

        declared_amount = int(chosen["amount_kes"])
        chosen_source = chosen["source_org"]

        # Confidence scoring (simple version)
        if chosen_source == "ORPP" and len(claims) > 1:
            declared_conf = 1.0
        elif chosen_source == "ORPP":
            declared_conf = 0.9
        elif chosen_source == "GAZETTE":
            declared_conf = 0.8
        elif chosen_source == "IEBC":
            declared_conf = 0.7
        else:
            declared_conf = 0.5

        alternatives = [
            {
                "amount_kes": int(r["amount_kes"]),
                "source_org": r["source_org"],
                "source_url": r["source_url"],
                "doc_id": r["doc_id"],
                "page_number": r["page_number"],
                "extraction_confidence": float(r["extraction_confidence"] or 0.0),
            }
            for r in claims_sorted
        ]

        canon_id = str(uuid.uuid4())
        cur.execute("""
            INSERT OR REPLACE INTO canonical_declared
            (canon_id, entity_id, metric, period_start, period_end,
             declared_amount_kes, reconciliation_status, declared_confidence,
             chosen_source_org, alternatives_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            canon_id,
            entity_id,
            metric,
            period_start,
            period_end,
            declared_amount,
            status,
            declared_conf,
            chosen_source,
            json.dumps(alternatives),
        ))

        inserted += 1

    conn.commit()
    conn.close()
    print(f"Reconciled {inserted} group(s) into canonical_declared.")


if __name__ == "__main__":
    main()