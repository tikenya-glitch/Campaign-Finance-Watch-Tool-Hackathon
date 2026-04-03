import csv
from pathlib import Path

from track2.db.db import get_connection

CSV_PATH = Path("data/entity_media_seed.csv")


def main():
    if not CSV_PATH.exists():
        raise SystemExit(f"Missing CSV: {CSV_PATH}")

    conn = get_connection()
    cur = conn.cursor()

    updated = 0

    with CSV_PATH.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        required = {"display_name", "logo_url", "profile_photo_url"}
        if set(reader.fieldnames or []) != required:
            raise SystemExit(
                "CSV header mismatch.\n"
                f"Expected: {sorted(required)}\n"
                f"Got: {reader.fieldnames}"
            )

        for row in reader:
            display_name = (row["display_name"] or "").strip()
            logo_url = (row["logo_url"] or "").strip() or None
            profile_photo_url = (row["profile_photo_url"] or "").strip() or None

            if not display_name:
                continue

            cur.execute(
                """
                UPDATE entities
                SET logo_url = ?, profile_photo_url = ?
                WHERE display_name = ?
                """,
                (logo_url, profile_photo_url, display_name),
            )

            updated += cur.rowcount

    conn.commit()
    conn.close()

    print(f"Updated media fields for {updated} entity row(s).")


if __name__ == "__main__":
    main()