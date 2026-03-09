import { NextResponse } from 'next/server';
import { getCampaignAccount, updateVerificationStatus } from '@/lib/campaignAccount';
import type { VerificationStatus } from '@/lib/db';

const VALID_STATUSES: VerificationStatus[] = ['pending', 'verified', 'rejected', 'requires_review', 'incomplete'];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const account = getCampaignAccount(Number(id));
    if (!account) {
      return NextResponse.json({ error: 'Campaign account not found' }, { status: 404 });
    }

    const body = await request.json();
    const { verification_status, notes } = body;

    if (!verification_status || !VALID_STATUSES.includes(verification_status)) {
      return NextResponse.json(
        { error: `Invalid verification_status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    updateVerificationStatus(Number(id), verification_status, notes);
    const updated = getCampaignAccount(Number(id));
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to verify campaign account:', error);
    return NextResponse.json(
      { error: 'Failed to update verification status' },
      { status: 500 }
    );
  }
}
