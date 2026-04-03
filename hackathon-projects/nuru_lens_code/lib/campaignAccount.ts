import { db, type CampaignAccount, type VerificationStatus, type DocumentType } from './db';

export function createCampaignAccount(data: {
  candidate_name: string;
  political_party: string;
  position_running_for?: string;
  constituency: string;
  county: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  campaign_start_date?: string;
  campaign_end_date?: string;
  ad_campaigns?: string;
  billboards?: string;
  convoys?: string;
  merchandise?: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO campaign_accounts (
      candidate_name, political_party, position_running_for,
      constituency, county, bank_name, account_number, account_holder,
      campaign_start_date, campaign_end_date, ad_campaigns, billboards, convoys, merchandise
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.candidate_name,
    data.political_party,
    data.position_running_for ?? null,
    data.constituency,
    data.county,
    data.bank_name,
    data.account_number,
    data.account_holder,
    data.campaign_start_date ?? null,
    data.campaign_end_date ?? null,
    data.ad_campaigns ?? null,
    data.billboards ?? null,
    data.convoys ?? null,
    data.merchandise ?? null
  );
  return result.lastInsertRowid as number;
}

export function getCampaignAccount(id: number): CampaignAccount | undefined {
  const stmt = db.prepare('SELECT * FROM campaign_accounts WHERE id = ?');
  return stmt.get(id) as CampaignAccount | undefined;
}

export function getAllCampaignAccounts(): CampaignAccount[] {
  const stmt = db.prepare('SELECT * FROM campaign_accounts ORDER BY submitted_at DESC');
  return stmt.all() as CampaignAccount[];
}

export function updateVerificationStatus(
  id: number,
  status: VerificationStatus,
  notes?: string
): void {
  const verified_at = status === 'verified' ? new Date().toISOString() : null;
  const stmt = db.prepare(`
    UPDATE campaign_accounts
    SET verification_status = ?, verified_at = ?, notes = COALESCE(?, notes), updated_at = datetime('now')
    WHERE id = ?
  `);
  stmt.run(status, verified_at, notes ?? null, id);
}

export function addCampaignDocument(data: {
  campaign_account_id: number;
  document_type: DocumentType;
  file_name: string;
  file_path: string;
  file_format: string;
}): number {
  const stmt = db.prepare(`
    INSERT INTO campaign_documents (campaign_account_id, document_type, file_name, file_path, file_format)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.campaign_account_id,
    data.document_type,
    data.file_name,
    data.file_path,
    data.file_format
  );
  return result.lastInsertRowid as number;
}

export function getDocumentsByAccountId(campaign_account_id: number) {
  const stmt = db.prepare('SELECT * FROM campaign_documents WHERE campaign_account_id = ? ORDER BY uploaded_at DESC');
  return stmt.all(campaign_account_id);
}
