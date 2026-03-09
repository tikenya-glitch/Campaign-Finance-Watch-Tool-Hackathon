import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'nurulens.db');

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS campaign_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_name TEXT NOT NULL,
    political_party TEXT NOT NULL,
    position_running_for TEXT,
    constituency TEXT NOT NULL,
    county TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    account_holder TEXT NOT NULL,
    campaign_start_date TEXT,
    campaign_end_date TEXT,
    ad_campaigns TEXT,
    billboards TEXT,
    convoys TEXT,
    merchandise TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK(verification_status IN ('pending', 'verified', 'rejected', 'requires_review', 'incomplete')),
    submitted_at TEXT DEFAULT (datetime('now')),
    verified_at TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS campaign_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_account_id INTEGER NOT NULL,
    document_type TEXT NOT NULL CHECK(document_type IN ('bank_statement', 'donation_report', 'campaign_finance_declaration', 'other')),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_format TEXT NOT NULL,
    uploaded_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (campaign_account_id) REFERENCES campaign_accounts(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_campaign_accounts_status ON campaign_accounts(verification_status);
  CREATE INDEX IF NOT EXISTS idx_campaign_documents_account ON campaign_documents(campaign_account_id);
`);

// Add public activities columns (migration for existing DBs)
['ad_campaigns', 'billboards', 'convoys', 'merchandise'].forEach((col) => {
  try {
    db.exec(`ALTER TABLE campaign_accounts ADD COLUMN ${col} TEXT`);
  } catch {
    // Column may already exist
  }
});

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'requires_review' | 'incomplete';
export type DocumentType = 'bank_statement' | 'donation_report' | 'campaign_finance_declaration' | 'other';

export interface CampaignAccount {
  id: number;
  candidate_name: string;
  political_party: string;
  position_running_for: string | null;
  constituency: string;
  county: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  campaign_start_date: string | null;
  campaign_end_date: string | null;
  ad_campaigns: string | null;
  billboards: string | null;
  convoys: string | null;
  merchandise: string | null;
  verification_status: VerificationStatus;
  submitted_at: string;
  verified_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignDocument {
  id: number;
  campaign_account_id: number;
  document_type: DocumentType;
  file_name: string;
  file_path: string;
  file_format: string;
  uploaded_at: string;
}

export { db };
