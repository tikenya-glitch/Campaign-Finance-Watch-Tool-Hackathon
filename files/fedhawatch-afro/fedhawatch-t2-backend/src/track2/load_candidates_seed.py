import csv
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from track2.db.db import get_connection

CSV_PATH = Path("data/candidates_seed.csv")

PERIOD_START = "2024-07-01"
PERIOD_END = "2025-06-30"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def norm(s: str) -> str:
    s = (s or "").strip().lower()
    s = re.sub(r"\s+", " ", s)
    # remove common titles
    s = re.sub(r"^(hon\.?|dr\.?|prof\.?)\s+", "", s)
    # drop punctuation-ish
    s = s.replace("’", "'")
    s = re.sub(r"[^\w\s'-]", "", s)
    return s.strip()


def slugify(s: str, max_len: int = 80) -> str:
    s = norm(s)
    s = re.sub(r"[^a-z0-9]+", "_", s).strip("_")
    return s[:max_len] if s else "unknown"


def candidate_entity_id(name: str, constituency: str = "", ward: str = "") -> str:
    # include location hints to reduce collisions
    base = slugify(name)
    loc = "_".join([p for p in [slugify(constituency, 40), slugify(ward, 40)] if p])
    if loc:
        return f"cand_{base}_{loc}"[:100]
    return f"cand_{base}"[:100]


def find_party_entity_id(cur, party_name: str) -> Optional[str]:
    if not party_name:
        return None
    pn = norm(party_name)

    # 1) exact normalized match in entities
    cur.execute(
        """
        SELECT entity_id
        FROM entities
        WHERE entity_type='party' AND normalized_name=?
        LIMIT 1
        """,
        (pn,),
    )
    r = cur.fetchone()
    if r:
        return r["entity_id"]

    # 2) fallback: loose contains match (MVP)
    cur.execute(
        """
        SELECT entity_id, normalized_name
        FROM entities
        WHERE entity_type='party'
        """,
    )
    best = None
    for row in cur.fetchall():
        nn = row["normalized_name"] or ""
        if pn and pn in nn:
            best = row["entity_id"]
            break
    return best


def upsert_entity(cur, entity_id: str, entity_type: str, display_name: str,
                  county: str = "", constituency: str = "", ward: str = "") -> None:
    cur.execute(
        """
        INSERT OR REPLACE INTO entities
        (entity_id, entity_type, display_name, normalized_name, country, county, constituency, ward, created_at)
        VALUES (?, ?, ?, ?, 'KE', ?, ?, ?, ?)
        """,
        (
            entity_id,
            entity_type,
            display_name.strip(),
            norm(display_name),
            county.strip() or None,
            constituency.strip() or None,
            ward.strip() or None,
            now_iso(),
        ),
    )


def add_alias(cur, entity_id: str, alias: str, source: str) -> None:
    alias = (alias or "").strip()
    if not alias:
        return
    cur.execute(
        """
        INSERT OR IGNORE INTO entity_aliases
        (alias_id, entity_id, alias, alias_normalized, source)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            str(uuid.uuid4()),
            entity_id,
            alias,
            norm(alias),
            source,
        ),
    )


def upsert_affiliation(cur, candidate_id: str, party_id: Optional[str], source: str) -> None:
    cur.execute(
        """
        INSERT OR REPLACE INTO affiliations
        (affiliation_id, candidate_entity_id, party_entity_id, period_start, period_end, source_url, doc_id, page_number)
        VALUES (?, ?, ?, ?, ?, ?, NULL, NULL)
        """,
        (
            str(uuid.uuid4()),
            candidate_id,
            party_id,
            PERIOD_START,
            PERIOD_END,
            source,
        ),
    )


def main():
    if not CSV_PATH.exists():
        raise SystemExit(f"Missing CSV: {CSV_PATH}")

    conn = get_connection()
    cur = conn.cursor()

    added_candidates = 0
    linked = 0
    independents = 0

    with CSV_PATH.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        required = {"candidate_name", "party_name", "county", "constituency", "ward", "is_independent"}
        if set(reader.fieldnames or []) != required:
            raise SystemExit(
                f"CSV header must be exactly:\n{','.join(required)}\n"
                f"Got:\n{reader.fieldnames}"
            )

        for row in reader:
            name = (row["candidate_name"] or "").strip()
            party_name = (row["party_name"] or "").strip()
            county = (row["county"] or "").strip()
            constituency = (row["constituency"] or "").strip()
            ward = (row["ward"] or "").strip()
            is_ind = (row["is_independent"] or "").strip().lower() in {"true", "1", "yes", "y"}

            if not name:
                continue

            cand_id = candidate_entity_id(name, constituency, ward)

            upsert_entity(cur, cand_id, "candidate", name, county, constituency, ward)
            add_alias(cur, cand_id, name, "seed_csv")

            party_id = None
            if is_ind:
                independents += 1
            else:
                party_id = find_party_entity_id(cur, party_name)
                if party_id:
                    linked += 1
                else:
                    # Party not found in entities, still create candidate but mark unlinked
                    party_id = None

            upsert_affiliation(cur, cand_id, party_id, "seed_csv")
            added_candidates += 1

    conn.commit()
    conn.close()

    print(f"Loaded {added_candidates} candidate(s) from {CSV_PATH}")
    print(f"Linked to party: {linked}")
    print(f"Independents: {independents}")


if __name__ == "__main__":
    main()