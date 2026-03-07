import os
import requests
from pathlib import Path

from track2.db.db import get_connection

DOWNLOAD_DIR = Path("data/raw_pdfs")
DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)

USER_AGENT = "FedhaWatchTrack2/0.1"
TIMEOUT = 30


def fetch_approved():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT doc_id, download_url
        FROM document_manifest
        WHERE status='APPROVED'
        AND local_path IS NULL
    """)

    rows = cur.fetchall()

    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})

    for r in rows:
        doc_id = r["doc_id"]
        url = r["download_url"]

        filename = f"{doc_id}.pdf"
        filepath = DOWNLOAD_DIR / filename

        print(f"Downloading {url}")

        resp = session.get(url, timeout=TIMEOUT)
        resp.raise_for_status()

        with open(filepath, "wb") as f:
            f.write(resp.content)

        cur.execute("""
            UPDATE document_manifest
            SET local_path=?
            WHERE doc_id=?
        """, (str(filepath), doc_id))

    conn.commit()
    conn.close()

    print("Download stage complete.")


if __name__ == "__main__":
    fetch_approved()