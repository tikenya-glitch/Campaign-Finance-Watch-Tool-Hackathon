import hashlib
import re
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Iterable, Optional
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

from track2.db.db import get_connection, init_db


USER_AGENT = "FedhaWatchTrack2/0.1 (Ubuntu; document-discovery)"
TIMEOUT = 25


@dataclass(frozen=True)
class DiscoveredDoc:
    title_guess: str
    source_org_guess: str
    source_page_url: str
    download_url: str
    content_type: str
    size_bytes: int
    sha256: str


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _is_pdf_url(url: str) -> bool:
    return url.lower().endswith(".pdf")


def _guess_source_org(url: str) -> str:
    host = urlparse(url).netloc.lower()
    if "orpp" in host:
        return "ORPP"
    if "kenyalaw" in host or "new.kenyalaw.org" in host:
        return "GAZETTE"
    if "iebc" in host:
        return "IEBC"
    return "OTHER"


def _safe_title(text: str) -> str:
    text = re.sub(r"\s+", " ", (text or "").strip())
    return text[:200] if text else "Untitled document"


def _head_pdf_metadata(session: requests.Session, url: str) -> tuple[str, int]:
    """
    Fetch headers (or a small range GET fallback) to confirm pdf-ish content type and size.
    """
    try:
        r = session.head(url, allow_redirects=True, timeout=TIMEOUT)
        ct = (r.headers.get("Content-Type") or "").split(";")[0].strip().lower()
        size = r.headers.get("Content-Length")
        size_int = int(size) if size and size.isdigit() else -1
        return ct, size_int
    except requests.RequestException:
        # Fallback to a small ranged GET
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


def _sha256_of_url(session: requests.Session, url: str, max_bytes: int = 5_000_000) -> str:
    """
    Compute SHA256 by streaming the first `max_bytes` bytes. For manifest verification,
    this is enough to fingerprint the doc even if huge.
    """
    h = hashlib.sha256()
    read = 0
    with session.get(url, stream=True, allow_redirects=True, timeout=TIMEOUT) as r:
        r.raise_for_status()
        for chunk in r.iter_content(chunk_size=64 * 1024):
            if not chunk:
                continue
            if read + len(chunk) > max_bytes:
                chunk = chunk[: max_bytes - read]
            h.update(chunk)
            read += len(chunk)
            if read >= max_bytes:
                break
    return h.hexdigest()


def _insert_manifest(doc: DiscoveredDoc) -> None:
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
            _now_iso(),
            doc.content_type,
            doc.size_bytes,
            doc.sha256,
            None,
            "PENDING_REVIEW",
            None,
        ),
    )

    conn.commit()
    conn.close()


def discover_orpp_downloads(
    session: requests.Session,
    base_url: str = "https://orpp.or.ke/downloads/",
    limit: int = 50,
) -> int:
    """
    Crawl ORPP downloads page and collect direct PDF links.
    """
    found = 0
    r = session.get(base_url, timeout=TIMEOUT)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "lxml")

    for a in soup.select("a[href]"):
        href = a.get("href", "").strip()
        if not href:
            continue
        abs_url = urljoin(base_url, href)
        if not _is_pdf_url(abs_url):
            continue

        ct, size = _head_pdf_metadata(session, abs_url)
        # Some servers may send octet-stream for pdfs; allow it if URL endswith .pdf
        if ct not in ("application/pdf", "application/octet-stream", ""):
            continue

        title = _safe_title(a.get_text(" ", strip=True)) or _safe_title(abs_url.split("/")[-1])
        sha = _sha256_of_url(session, abs_url)

        doc = DiscoveredDoc(
            title_guess=title,
            source_org_guess=_guess_source_org(abs_url),
            source_page_url=base_url,
            download_url=abs_url,
            content_type=ct or "application/pdf",
            size_bytes=size,
            sha256=sha,
        )
        _insert_manifest(doc)
        found += 1
        if found >= limit:
            break

    return found


def main(limit: int = 50) -> None:
    init_db()
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})
    n = discover_orpp_downloads(session=session, limit=limit)
    print(f"Discovery complete. Added {n} ORPP PDF(s) to manifest as PENDING_REVIEW.")


if __name__ == "__main__":
    main()