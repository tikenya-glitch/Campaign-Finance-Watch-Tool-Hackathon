import pdfplumber

from track2.db.db import get_connection


def extract_text_from_approved_pdfs():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT doc_id, local_path
        FROM document_manifest
        WHERE status='APPROVED'
        AND local_path IS NOT NULL
    """)

    docs = cur.fetchall()

    for d in docs:
        doc_id = d["doc_id"]
        path = d["local_path"]

        print(f"Extracting: {doc_id} -> {path}")

        with pdfplumber.open(path) as pdf:
            for i, page in enumerate(pdf.pages, start=1):
                text = page.extract_text() or ""
                method = "PARSE"
                confidence = 1.0 if text.strip() else 0.2

                cur.execute("""
                    INSERT INTO raw_extracted_rows
                    (doc_id, page_number, text, extraction_method, extraction_confidence)
                    VALUES (?, ?, ?, ?, ?)
                """, (doc_id, i, text, method, confidence))

    conn.commit()
    conn.close()
    print("Extraction complete.")


if __name__ == "__main__":
    extract_text_from_approved_pdfs()