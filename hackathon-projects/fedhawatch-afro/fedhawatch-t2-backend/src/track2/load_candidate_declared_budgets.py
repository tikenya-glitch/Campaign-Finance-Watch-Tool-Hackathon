import csv
import re
import uuid
from pathlib import Path

from track2.db.db import get_connection

CSV_PATH = Path("data/candidate_declared_budgets.csv")
METRIC = "candidate_declared_budget_kes"
SOURCE_ORG_DEFAULT = "OTHER"


def norm(s: str) -> str:
    s = (s or "").strip().lower()
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"^(hon\.?|dr\.?|prof\.?)\s+", "", s)
    s = s.replace("’", "'")
    s = re.sub(r"[^\w\s'-]", "", s)
    return s.strip()


def slugify(s: str, max_len: int = 80) -> str:
    s = norm(s)
    s = re.sub(r"[^a-z0-9]+", "_", s).strip("_")
    return s[:max_len] if s else "unknown"


def candidate_entity_id(name: str, constituency: str = "", ward: str = "") -> str:
    base = slugify(name)
    loc = "_".join([p for p in [slugify(constituency, 40), slugify(ward, 40)] if p])
    if loc:
        return f"cand_{base}_{loc}"[:100]
    return f"cand_{base}"[:100]


def guess_source_org(url: str) -> str:
    u = (url or "").lower()
    if "orpp" in u:
        return "ORPP"
    if "kenyalaw" in u or "gazette" in u:
        return "GAZETTE"
    if "iebc" in u:
        return "IEBC"
    return SOURCE_ORG_DEFAULT


def main():
    if not CSV_PATH.exists():
        raise SystemExit(f"Missing CSV: {CSV_PATH}")

    conn = get_connection()
    cur = conn.cursor()

    inserted = 0

    with CSV_PATH.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        required = {
            "candidate_name",
            "constituency",
            "ward",
            "amount_kes",
            "period_start",
            "period_end",
            "source_url",
            "confidence",
        }

        if set(reader.fieldnames or []) != required:
            raise SystemExit(
                "CSV header mismatch.\n"
                f"Expected: {sorted(required)}\n"
                f"Got: {reader.fieldnames}"
            )

        for row in reader:
            candidate_name = (row["candidate_name"] or "").strip()
            constituency = (row["constituency"] or "").strip()
            ward = (row["ward"] or "").strip()
            amount_raw = (row["amount_kes"] or "").strip()
            period_start = (row["period_start"] or "").strip()
            period_end = (row["period_end"] or "").strip()
            source_url = (row["source_url"] or "").strip()
            confidence_raw = (row["confidence"] or "").strip()

            if not candidate_name:
                continue

            try:
                amount_kes = int(amount_raw.replace(",", ""))
            except ValueError:
                raise SystemExit(f"Invalid amount_kes for candidate '{candidate_name}': {amount_raw}")

            try:
                extraction_confidence = float(confidence_raw)
            except ValueError:
                raise SystemExit(f"Invalid confidence for candidate '{candidate_name}': {confidence_raw}")

            entity_id = candidate_entity_id(candidate_name, constituency, ward)

            # Ensure candidate exists in entities
            cur.execute(
                """
                INSERT OR IGNORE INTO entities
                (entity_id, entity_type, display_name, normalized_name, country, county, constituency, ward, created_at)
                VALUES (?, 'candidate', ?, ?, 'KE', NULL, ?, ?, datetime('now'))
                """,
                (
                    entity_id,
                    candidate_name,
                    norm(candidate_name),
                    constituency or None,
                    ward or None,
                ),
            )

            claim_id = str(uuid.uuid4())
            cur.execute(
                """
                INSERT OR REPLACE INTO claims
                (claim_id, entity_type, entity_name_raw, entity_id, metric,
                 period_start, period_end, amount_kes, source_org, source_url,
                 doc_id, page_number, extraction_confidence, published_date)
                VALUES (?, 'candidate', ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, datetime('now'))
                """,
                (
                    claim_id,
                    candidate_name,
                    entity_id,
                    METRIC,
                    period_start,
                    period_end,
                    amount_kes,
                    guess_source_org(source_url),
                    source_url,
                    extraction_confidence,
                ),
            )

            inserted += 1

    conn.commit()
    conn.close()

    print(f"Inserted {inserted} candidate declared budget claim(s) from {CSV_PATH}")


if __name__ == "__main__":
    main()