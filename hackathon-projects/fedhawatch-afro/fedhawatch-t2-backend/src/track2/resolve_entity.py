import re
from typing import Optional

from track2.db.db import get_connection


def norm(s: str) -> str:
    s = (s or "").strip().lower()
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"^(hon\.?|dr\.?|prof\.?|sen\.?)\s+", "", s)
    s = s.replace("’", "'")
    s = re.sub(r"[^\w\s'-]", "", s)
    return s.strip()


def resolve_entity_id(name: str, entity_type: Optional[str] = None) -> Optional[str]:
    """
    Resolve a messy human name to an entity_id using:
    1. exact match on entities.normalized_name
    2. exact match on entity_aliases.alias_normalized
    3. fallback contains match on entities / aliases
    """
    target = norm(name)
    if not target:
        return None

    conn = get_connection()
    cur = conn.cursor()

    # 1. Exact match on canonical entity name
    if entity_type:
        cur.execute(
            """
            SELECT entity_id
            FROM entities
            WHERE normalized_name=? AND entity_type=?
            LIMIT 1
            """,
            (target, entity_type),
        )
    else:
        cur.execute(
            """
            SELECT entity_id
            FROM entities
            WHERE normalized_name=?
            LIMIT 1
            """,
            (target,),
        )

    row = cur.fetchone()
    if row:
        conn.close()
        return row["entity_id"]

    # 2. Exact match on alias
    if entity_type:
        cur.execute(
            """
            SELECT a.entity_id
            FROM entity_aliases a
            JOIN entities e ON e.entity_id = a.entity_id
            WHERE a.alias_normalized=? AND e.entity_type=?
            LIMIT 1
            """,
            (target, entity_type),
        )
    else:
        cur.execute(
            """
            SELECT entity_id
            FROM entity_aliases
            WHERE alias_normalized=?
            LIMIT 1
            """,
            (target,),
        )

    row = cur.fetchone()
    if row:
        conn.close()
        return row["entity_id"]

    # 3. Fallback loose contains match on entities
    if entity_type:
        cur.execute(
            """
            SELECT entity_id, normalized_name
            FROM entities
            WHERE entity_type=?
            """,
            (entity_type,),
        )
    else:
        cur.execute("SELECT entity_id, normalized_name FROM entities")

    best = None
    for r in cur.fetchall():
        nn = r["normalized_name"] or ""
        if target in nn or nn in target:
            best = r["entity_id"]
            break

    if best:
        conn.close()
        return best

    # 4. Fallback loose contains match on aliases
    if entity_type:
        cur.execute(
            """
            SELECT a.entity_id, a.alias_normalized
            FROM entity_aliases a
            JOIN entities e ON e.entity_id = a.entity_id
            WHERE e.entity_type=?
            """,
            (entity_type,),
        )
    else:
        cur.execute("SELECT entity_id, alias_normalized FROM entity_aliases")

    for r in cur.fetchall():
        an = r["alias_normalized"] or ""
        if target in an or an in target:
            best = r["entity_id"]
            break

    conn.close()
    return best


if __name__ == "__main__":
    tests = [
        ("Edwin Watenya Sifuna", "candidate"),
        ("Edwin Sifuna", "candidate"),
        ("Sen. Edwin Sifuna", "candidate"),
        ("Orange Democratic Movement", "party"),
    ]

    for name, etype in tests:
        print(name, "->", resolve_entity_id(name, etype))