import re
from track2.db.db import get_connection

DOC_ID = "074bf3ef-0a56-4c77-a22b-ce35ea204adf"
PAGE_NUMBER = 111

# Same regex used in parse_ppf_allocations.py
line_re = re.compile(
    r"^\s*(\d+)\s+(\d+)\s+(.+?)\s+([\d,]+|-)\s+([\d,]+|-)\s+([\d,]+|-)\s+([\d,]+|-)\s*$"
)

def main():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT text FROM raw_extracted_rows WHERE doc_id=? AND page_number=?",
        (DOC_ID, PAGE_NUMBER),
    )
    row = cur.fetchone()
    if not row:
        raise SystemExit("No text found for that doc/page")

    text = row["text"]
    lines = text.splitlines()

    matched = []
    unmatched = []

    for ln in lines:
        ln_stripped = ln.strip()
        if not ln_stripped:
            continue

        m = line_re.match(ln_stripped)
        if m:
            matched.append(ln_stripped)
        else:
            # Keep only lines that look like they might be table rows (start with a number)
            if re.match(r"^\d+\s+\d+\s+", ln_stripped):
                unmatched.append(ln_stripped)

    print("=== MATCHED ROWS ===")
    for ln in matched:
        print(ln)

    print("\n=== UNMATCHED (POSSIBLE BROKEN ROWS) ===")
    for ln in unmatched:
        print(ln)

    conn.close()

if __name__ == "__main__":
    main()