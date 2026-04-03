import hashlib
import re
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import List, Set, Tuple
from urllib.parse import urljoin, urlparse, parse_qs

import requests
from bs4 import BeautifulSoup

from track2.db.db import init_db, get_connection

USER_AGENT = "FedhaWatchTrack2/0.1 (Ubuntu; candidate-discovery)"
TIMEOUT = 25

# Where we search for candidate lists / notices
SEARCH_QUERIES = [
    # IEBC candidate list / nomination / gazette notice mentions
    "site:iebc.or.ke candidates list pdf",
    "site:iebc.or.ke nomination list pdf",
    "site:iebc.or.ke gazette notice candidates pdf",
    # Kenya Law Gazette PDFs sometimes host relevant notices
    "site:new.kenyalaw.org Kenya Gazette candidates list pdf",
    "site:kenyalaw.org Kenya Gazette candidates list pdf",
    "site:new.kenyalaw.org IEBC candidates Gazette pdf",
]

# Hard limit so we don’t crawl the entire internet like a bored raccoon
MAX_SEARCH_RESULTS_PER_QUERY = 8
MAX_PDFS_TOTAL = 30


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
    u = url.lower()
    return u.endswith(".pdf") or "pdf" in u and (".pdf?" in u or ".pdf#" in u)


def _guess_source_org(url: str) -> str:
    host = urlparse(url).netloc.lower()
    if "iebc" in host:
        return "IEBC"
    if "kenyalaw" in host:
        return "GAZETTE"
    return "OTHER"


def _safe_title(text: str) -> str:
    text = re.sub(r"\s+", " ", (text or "").strip())
    return text[:200] if text else "Untitled document"


def _head_pdf_metadata(session: requests.Session, url: str) -> Tuple[str, int]:
    try:
        r = session.head(url, allow_redirects=True, timeout=TIMEOUT)
        ct = (r.headers.get("Content-Type") or "").split(";")[0].strip().lower()
        size = r.headers.get("Content-Length")
        size_int = int(size) if size and size.isdigit() else -1
        return ct, size_int
    except requests.RequestException:
        # Fallback to ranged GET
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
            "Discovered via web search (candidate-related). Verify relevance before approval.",
        ),
    )

    conn.commit()
    conn.close()


def duckduckgo_html_search(session: requests.Session, query: str, max_results: int) -> List[str]:
    """
    Uses DuckDuckGo HTML endpoint (no API key) and returns result URLs.
    """
    url = "https://duckduckgo.com/html/"
    r = session.get(url, params={"q": query}, timeout=TIMEOUT)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "lxml")

    out = []
    for a in soup.select("a.result__a[href]"):
        href = a.get("href", "").strip()
        if not href:
            continue

        # DuckDuckGo often uses redirect URLs like:
        # /l/?kh=-1&uddg=<encoded real url>
        if "duckduckgo.com/l/" in href or href.startswith("/l/"):
            parsed = urlparse(href)
            qs = parse_qs(parsed.query)
            if "uddg" in qs and qs["uddg"]:
                href = qs["uddg"][0]

        out.append(href)
        if len(out) >= max_results:
            break

    # Deduplicate while preserving order
    seen = set()
    cleaned = []
    for u in out:
        if u in seen:
            continue
        seen.add(u)
        cleaned.append(u)
    return cleaned


def extract_pdf_links_from_page(session: requests.Session, page_url: str) -> List[Tuple[str, str]]:
    """
    Returns list of (pdf_url, link_text) from a web page.
    """
    try:
        r = session.get(page_url, timeout=TIMEOUT)
        r.raise_for_status()
    except requests.RequestException:
        return []

    soup = BeautifulSoup(r.text, "lxml")
    pdfs = []
    for a in soup.select("a[href]"):
        href = (a.get("href") or "").strip()
        if not href:
            continue
        abs_url = urljoin(page_url, href)
        if _is_pdf_url(abs_url):
            text = _safe_title(a.get_text(" ", strip=True))
            pdfs.append((abs_url, text))

    # Also catch plain-text PDF URLs in the HTML (some sites embed them)
    html = r.text
    for m in re.finditer(r"https?://[^\s\"']+\.pdf(?:\?[^\s\"']*)?", html, flags=re.IGNORECASE):
        pdfs.append((m.group(0), "PDF (inline link)"))

    # Deduplicate
    seen = set()
    out = []
    for u, t in pdfs:
        if u in seen:
            continue
        seen.add(u)
        out.append((u, t))
    return out


def discover_candidate_docs(limit_total: int = MAX_PDFS_TOTAL) -> int:
    init_db()

    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})

    discovered: Set[str] = set()
    added = 0

    for q in SEARCH_QUERIES:
        if added >= limit_total:
            break

        print(f"[search] {q}")
        try:
            result_pages = duckduckgo_html_search(session, q, MAX_SEARCH_RESULTS_PER_QUERY)
        except requests.RequestException as e:
            print(f"  search failed: {e}")
            continue

        for page_url in result_pages:
            if added >= limit_total:
                break

            # Crawl the result page and pick up PDF links
            pdf_links = extract_pdf_links_from_page(session, page_url)
            if not pdf_links:
                continue

            for pdf_url, link_text in pdf_links:
                if added >= limit_total:
                    break
                if pdf_url in discovered:
                    continue
                discovered.add(pdf_url)

                # Confirm metadata and fingerprint
                try:
                    ct, size = _head_pdf_metadata(session, pdf_url)
                    if ct and ct not in ("application/pdf", "application/octet-stream"):
                        # Not a PDF-ish response; skip
                        continue

                    sha = _sha256_of_url(session, pdf_url)

                    title_guess = link_text if link_text and link_text != "PDF (inline link)" else _safe_title(pdf_url.split("/")[-1])

                    doc = DiscoveredDoc(
                        title_guess=title_guess or "Candidate-related PDF",
                        source_org_guess=_guess_source_org(pdf_url),
                        source_page_url=page_url,
                        download_url=pdf_url,
                        content_type=ct or "application/pdf",
                        size_bytes=size,
                        sha256=sha,
                    )
                    _insert_manifest(doc)
                    added += 1
                    print(f"  [+] pdf: {pdf_url}")

                except requests.RequestException:
                    continue

    print(f"Candidate discovery complete. Added {added} PDF(s) to manifest as PENDING_REVIEW.")
    return added


def main():
    discover_candidate_docs()


if __name__ == "__main__":
    main()