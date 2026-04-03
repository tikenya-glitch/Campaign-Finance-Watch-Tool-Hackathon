import csv
import uuid
from pathlib import Path
from datetime import datetime

from track2.db.db import get_connection
from track2.resolve_entity import resolve_entity_id

CSV_PATH = Path("data/crowd_observations.csv")


def main():
    if not CSV_PATH.exists():
        raise SystemExit(f"Missing CSV: {CSV_PATH}")

    conn = get_connection()
    cur = conn.cursor()

    inserted = 0

    with CSV_PATH.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            entity_name = (row["entity_name"] or "").strip()
            asset_type = (row["asset_type"] or "").strip()
            quantity = int(row["quantity"] or 0)
            county = (row["county"] or "").strip()
            timestamp = row["timestamp"]
            duration_value = int(row["duration_value"] or 0)
            duration_unit = row["duration_unit"]
            confidence = float(row["confidence"] or 0)
            source_url = row["source_url"]

            entity_id = resolve_entity_id(entity_name)

            if not entity_id:
                print(f"Skipping unknown entity: {entity_name}")
                continue

            obs_id = str(uuid.uuid4())
            cluster_id = f"crowd_{entity_id}_{asset_type}_{timestamp}"

            cur.execute(
                """
                INSERT OR IGNORE INTO observed_assets
                (obs_id, entity_id, asset_type, quantity, county, timestamp,
                 duration_value, duration_unit, lat, lon, image_phash,
                 exif_json, confidence, cluster_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, ?, ?, ?)
                """,
                (
                    obs_id,
                    entity_id,
                    asset_type,
                    quantity,
                    county,
                    timestamp,
                    duration_value,
                    duration_unit,
                    None,
                    confidence,
                    cluster_id,
                ),
            )

            inserted += 1

    conn.commit()
    conn.close()

    print(f"Inserted {inserted} crowd observation(s) from {CSV_PATH}")


if __name__ == "__main__":
    main()