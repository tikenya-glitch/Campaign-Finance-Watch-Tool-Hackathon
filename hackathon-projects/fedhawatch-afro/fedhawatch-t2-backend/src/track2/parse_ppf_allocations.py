import re
import uuid
from datetime import datetime, timezone

from track2.db.db import get_connection


DOC_ID = "074bf3ef-0a56-4c77-a22b-ce35ea204adf"
PAGE_NUMBER = 111

PERIOD_START = "2024-07-01"
PERIOD_END = "2025-06-30"

METRIC_TOTAL = "ppf_allocation_total_kes"
SOURCE_ORG = "ORPP"
SOURCE_URL = "https://orpp.or.ke/wp-content/uploads/2026/02/ORPP-ANNUAL-REPORT-fy-24-25-compressed.pdf"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def normalize_party_name(name: str) -> str:
    name = re.sub(r"\s+", " ", name.strip())
    # Clean trailing punctuation artifacts
    return name.strip(" .")


def make_entity_id(party_name: str) -> str:
    # Stable ID based on normalized name
    slug = re.sub(r"[^a-z0-9]+", "_", party_name.lower()).strip("_")
    return "party_" + slug[:80]


def parse_amount(s: str) -> int:
    s = s.replace(",", "").strip()
    if s == "-" or s == "":
        return 0
    return int(s)


def is_footer_or_noise(line: str) -> bool:
    l = line.strip().lower()
    if not l:
        return True
    if l in {"orpp", "annual report"}:
        return True
    if "annual report" in l:
        return True
    # page footer like: "100" or "2024|2025"
    if re.fullmatch(r"\d{1,3}", l):
        return True
    if re.fullmatch(r"\d{4}\|\d{4}", l):
        return True
    return False


def main():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT text
        FROM raw_extracted_rows
        WHERE doc_id=? AND page_number=?
        """,
        (DOC_ID, PAGE_NUMBER),
    )
    row = cur.fetchone()
    if not row:
        raise SystemExit(f"No extracted text found for doc_id={DOC_ID} page={PAGE_NUMBER}")

    lines = row["text"].splitlines()

    # Row pattern: SNo, Code, Name (possibly wrapped), then 4 numeric columns
    row_re = re.compile(
        r"^\s*(\d+)\s+(\d+)\s+(.+?)\s+([\d,]+|-)\s+([\d,]+|-)\s+([\d,]+|-)\s+([\d,]+|-)\s*$"
    )

    inserted = 0
    i = 0

    while i < len(lines):
        line = lines[i].strip()

        if is_footer_or_noise(line):
            i += 1
            continue

        m = row_re.match(line)
        if not m:
            i += 1
            continue

        sno = m.group(1)
        code = m.group(2)
        name_part = m.group(3).strip()

        ppf70 = parse_amount(m.group(4))
        ppf15 = parse_amount(m.group(5))
        ppf10 = parse_amount(m.group(6))
        total = parse_amount(m.group(7))

        # Check next line for wrapped continuation of party name
        name_cont = ""
        if i + 1 < len(lines):
            nxt = lines[i + 1].strip()

            # Continuation line should NOT start with "number number" (new row),
            # and should not be footer/noise.
            if (not row_re.match(nxt)) and (not re.match(r"^\d+\s+\d+\s+", nxt)) and (not is_footer_or_noise(nxt)):
                # Treat as continuation of party name
                name_cont = nxt
                i += 1  # consume continuation line

        full_name = normalize_party_name(f"{name_part} {name_cont}".strip())
        entity_id = make_entity_id(full_name)

        # Insert TOTAL claim (MVP)
        claim_id = str(uuid.uuid4())
        cur.execute(
            """
            INSERT OR REPLACE INTO claims
            (claim_id, entity_type, entity_name_raw, entity_id, metric,
             period_start, period_end, amount_kes,
             source_org, source_url, doc_id, page_number,
             extraction_confidence, published_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                claim_id,
                "party",
                full_name,
                entity_id,
                METRIC_TOTAL,
                PERIOD_START,
                PERIOD_END,
                total,
                SOURCE_ORG,
                SOURCE_URL,
                DOC_ID,
                PAGE_NUMBER,
                0.9,
                now_iso(),
            ),
        )

        # OPTIONAL: also store the breakdowns as claims (uncomment if you want)
        # for metric, amount in [
        #     ("ppf_allocation_70_kes", ppf70),
        #     ("ppf_allocation_15_kes", ppf15),
        #     ("ppf_allocation_10_kes", ppf10),
        # ]:
        #     claim_id2 = str(uuid.uuid4())
        #     cur.execute(
        #         """
        #         INSERT OR REPLACE INTO claims
        #         (claim_id, entity_type, entity_name_raw, entity_id, metric,
        #          period_start, period_end, amount_kes,
        #          source_org, source_url, doc_id, page_number,
        #          extraction_confidence, published_date)
        #         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        #         """,
        #         (
        #             claim_id2,
        #             "party",
        #             full_name,
        #             entity_id,
        #             metric,
        #             PERIOD_START,
        #             PERIOD_END,
        #             amount,
        #             SOURCE_ORG,
        #             SOURCE_URL,
        #             DOC_ID,
        #             PAGE_NUMBER,
        #             0.9,
        #             now_iso(),
        #         ),
        #     )

        inserted += 1
        i += 1

    conn.commit()
    conn.close()
    print(f"Inserted {inserted} PPF allocation total claim(s) with wrapped-name handling.")


if __name__ == "__main__":
    main()