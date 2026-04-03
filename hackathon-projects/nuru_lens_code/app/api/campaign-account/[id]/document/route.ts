import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getCampaignAccount, addCampaignDocument } from '@/lib/campaignAccount';
import type { DocumentType } from '@/lib/db';

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');
const ALLOWED_TYPES = ['bank_statement', 'donation_report', 'campaign_finance_declaration', 'other'];
const ALLOWED_EXTENSIONS = ['.pdf', '.csv', '.xlsx', '.xls', '.png', '.jpg', '.jpeg'];

function getFileExtension(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  return ext || '.bin';
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accountId = Number(id);
    const account = getCampaignAccount(accountId);
    if (!account) {
      return NextResponse.json({ error: 'Campaign account not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const document_type = formData.get('document_type') as DocumentType | null;

    if (!file || !document_type) {
      return NextResponse.json(
        { error: 'Missing file or document_type' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(document_type)) {
      return NextResponse.json(
        { error: `Invalid document_type. Must be one of: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    const ext = getFileExtension(file.name);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` },
        { status: 400 }
      );
    }

    const accountDir = path.join(UPLOAD_DIR, String(accountId));
    if (!fs.existsSync(accountDir)) {
      fs.mkdirSync(accountDir, { recursive: true });
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${safeName}`;
    const filePath = path.join(accountDir, fileName);
    const relativePath = path.join('data', 'uploads', String(accountId), fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    const docId = addCampaignDocument({
      campaign_account_id: accountId,
      document_type,
      file_name: file.name,
      file_path: relativePath,
      file_format: ext.slice(1),
    });

    return NextResponse.json(
      { id: docId, file_name: file.name, document_type, uploaded_at: new Date().toISOString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to upload document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
