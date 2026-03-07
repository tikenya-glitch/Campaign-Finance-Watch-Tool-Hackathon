import argparse
import hashlib
import re
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import List, Set, Tuple
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

from track2.db.db import init_db, get_connection

USER_AGENT = "FedhaWatchTrack2/0.1 (Ubuntu; seed-manifest)"
TIMEOUT = 25
MAX_FINGERPRINT_BYTES = 5_000_000


@dataclass(frozen=True)
class SeededDoc:
    title_guess: str
    source_org_guess: str
    source_page_url: str
    download_url: str
    content_type: str
    size_bytes: int
    sha256: str


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def is_pdf_url(url: str) -> bool:
    u = url.lower()
    return u.endswith(".pdf") or ".pdf?" in u or ".pdf#" in u


def safe_title(text: str) -> str:
    text = re.sub(r"\s+", " ", (text or "").strip())
    return text[:200] if text else "Untitled document"


def head_metadata(session: requests.Session, url: str) -> Tuple[str, int]:
    try:
        r = session.head(url, allow_redirects=True, timeout=TIMEOUT)
        ct = (r.headers.get("Content-Type") or "").split(";")[0].strip().lower()
        size = r.headers.get("Content-Length")
        size_int = int(size) if size and size.isdigit() else -1
        return ct, size_int
    except requests.RequestException:
        headers = {"Range": "bytes=0-1023"}
        r = session.get(url, headers=headers, allow_redirects=True, timeout=TIMEOUT)
        ct = (r.headers.get("Content-Type") or "").split(";")[0].strip().lower()
        size = r.headers.get("Content-Range") or r.headers.get("Content-Length")
        size_int = -1
        if size:
            m = re.search(r"/(\d+)$", size)
            if m:
                size_int = int(m.group(1))
            elif size.isdigit():
                size_int = int(size)
        return ct, size_int


def sha256_partial(session: requests.Session, url: str) -> str:
    h = hashlib.sha256()
    read = 0
    with session.get(url, stream=True, allow_redirects=True, timeout=TIMEOUT) as r:
        r.raise_for_status()
        for chunk in r.iter_content(chunk_size=64 * 1024):
            if not chunk:
                continue
            if read + len(chunk) > MAX_FINGERPRINT_BYTES:
                chunk = chunk[: MAX_FINGERPRINT_BYTES - read]
            h.update(chunk)
            read += len(chunk)
            if read >= MAX_FINGERPRINT_BYTES:
                break
    return h.hexdigest()


def extract_pdf_links(session: requests.Session, page_url: str) -> List[Tuple[str, str]]:
    """
    Returns list of (pdf_url, link_text)
    """
    r = session.get(page_url, timeout=TIMEOUT)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "lxml")

    pdfs = []
    for a in soup.select("a[href]"):
        href = (a.get("href") or "").strip()
        if not href:
            continue
        abs_url = urljoin(page_url, href)
        if is_pdf_url(abs_url):
            text = safe_title(a.get_text(" ", strip=True))
            pdfs.append((abs_url, text))

    # Also detect inline PDF URLs
    for m in re.finditer(r"https?://[^\s\"']+\.pdf(?:\?[^\s\"']*)?", r.text, flags=re.IGNORECASE):
        pdfs.append((m.group(0), "PDF (inline link)"))

    # Dedup preserve order
    seen: Set[str] = set()
    out = []
    for u, t in pdfs:
        if u in seen:
            continue
        seen.add(u)
        out.append((u, t))
    return out


def insert_manifest(doc: SeededDoc) -> None:
    conn = get_connection()
    cur = conn.cursor()

    doc_id = str(uuid.uuid4())
    cur.execute(
        """
        INSERT OR IGNORE INTO document_manifest
        (doc_id, title_guess, source_org_guess, source_page_url, download_url,
         retrieved_at, content_type, size_bytes, sha256, local_path, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            doc_id,
            doc.title_guess,
            doc.source_org_guess,
            doc.source_page_url,
            doc.download_url,
            now_iso(),
            doc.content_type,
            doc.size_bytes,
            doc.sha256,
            None,
            "PENDING_REVIEW",
            "Seeded by user (official URL). Verify relevance before approval.",
        ),
    )

    conn.commit()
    conn.close()


def main():
    parser = argparse.ArgumentParser(description="Seed candidate/finance document discovery from official URLs.")
    parser.add_argument("--source", required=True, help="Source org guess e.g. IEBC, GAZETTE, ORPP")
    parser.add_argument("--url", action="append", required=True, help="A URL to a PDF or a page containing PDF links. Repeatable.")
    args = parser.parse_args()

    init_db()

    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})

    added = 0

    for u in args.url:
        u = u.strip()
        if not u:
            continue

        # If user gives a PDF directly
        if is_pdf_url(u):
            ct, size = head_metadata(session, u)
            sha = sha256_partial(session, u)
            title = safe_title(urlparse(u).path.split("/")[-1])
            insert_manifest(
                SeededDoc(
                    title_guess=title,
                    source_org_guess=args.source.upper(),
                    source_page_url=u,  # for a direct PDF, source page is itself
                    download_url=u,
                    content_type=ct or "application/pdf",
                    size_bytes=size,
                    sha256=sha,
                )
            )
            added += 1
            print(f"[+] Seeded PDF: {u}")
            continue

        # Otherwise treat as a page and extract PDFs from it
        try:
            pdf_links = extract_pdf_links(session, u)
        except requests.RequestException as e:
            print(f"[!] Failed to fetch page {u}: {e}")
            continue

        if not pdf_links:
            print(f"[!] No PDF links found on: {u}")
            continue

        for pdf_url, link_text in pdf_links:
            try:
                ct, size = head_metadata(session, pdf_url)
                if ct and ct not in ("application/pdf", "application/octet-stream"):
                    continue
                sha = sha256_partial(session, pdf_url)
                title = link_text if link_text and link_text != "PDF (inline link)" else safe_title(urlparse(pdf_url).path.split("/")[-1])

                insert_manifest(
                    SeededDoc(
                        title_guess=title,
                        source_org_guess=args.source.upper(),
                        source_page_url=u,
                        download_url=pdf_url,
                        content_type=ct or "application/pdf",
                        size_bytes=size,
                        sha256=sha,
                    )
                )
                added += 1
                print(f"[+] Seeded from page: {pdf_url}")
            except requests.RequestException:
                continue

    print(f"Seeding complete. Added {added} doc(s) to manifest as PENDING_REVIEW.")


if __name__ == "__main__":
    main()