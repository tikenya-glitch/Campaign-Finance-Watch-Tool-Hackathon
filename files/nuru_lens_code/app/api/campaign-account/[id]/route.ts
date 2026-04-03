import { NextResponse } from 'next/server';
import { getCampaignAccount } from '@/lib/campaignAccount';
import { getDocumentsByAccountId } from '@/lib/campaignAccount';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const account = getCampaignAccount(Number(id));
    if (!account) {
      return NextResponse.json({ error: 'Campaign account not found' }, { status: 404 });
    }
    const documents = getDocumentsByAccountId(account.id);
    return NextResponse.json({ ...account, documents });
  } catch (error) {
    console.error('Failed to fetch campaign account:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign account' },
      { status: 500 }
    );
  }
}
