import sqlite3
from pathlib import Path

DB_PATH = Path("fedhawatch_track2.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS document_manifest (
        doc_id TEXT PRIMARY KEY,
        title_guess TEXT,
        source_org_guess TEXT,
        source_page_url TEXT,
        download_url TEXT UNIQUE,
        retrieved_at TEXT,
        content_type TEXT,
        size_bytes INTEGER,
        sha256 TEXT,
        local_path TEXT,
        status TEXT,
        notes TEXT
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS raw_extracted_rows (
        row_id INTEGER PRIMARY KEY AUTOINCREMENT,
        doc_id TEXT,
        page_number INTEGER,
        text TEXT,
        extraction_method TEXT,
        extraction_confidence REAL
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS claims (
        claim_id TEXT PRIMARY KEY,
        entity_type TEXT,
        entity_name_raw TEXT,
        entity_id TEXT,
        metric TEXT,
        period_start TEXT,
        period_end TEXT,
        amount_kes INTEGER,
        source_org TEXT,
        source_url TEXT,
        doc_id TEXT,
        page_number INTEGER,
        extraction_confidence REAL,
        published_date TEXT
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS canonical_declared (
        canon_id TEXT PRIMARY KEY,
        entity_id TEXT,
        metric TEXT,
        period_start TEXT,
        period_end TEXT,
        declared_amount_kes INTEGER,
        reconciliation_status TEXT,
        declared_confidence REAL,
        chosen_source_org TEXT,
        alternatives_json TEXT
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS observed_assets (
        obs_id TEXT PRIMARY KEY,
        entity_id TEXT,
        asset_type TEXT,
        quantity INTEGER,
        county TEXT,
        timestamp TEXT,
        duration_value INTEGER,
        duration_unit TEXT,
        lat REAL,
        lon REAL,
        image_phash TEXT,
        exif_json TEXT,
        confidence REAL,
        cluster_id TEXT
    )
    """)

    conn.commit()
    conn.close()