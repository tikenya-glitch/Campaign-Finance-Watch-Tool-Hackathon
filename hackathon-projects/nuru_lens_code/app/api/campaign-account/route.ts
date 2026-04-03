import { NextResponse } from 'next/server';
import { createCampaignAccount, getAllCampaignAccounts } from '@/lib/campaignAccount';

export async function GET() {
  try {
    const accounts = getAllCampaignAccounts();
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Failed to fetch campaign accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign accounts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      candidate_name,
      political_party,
      position_running_for,
      constituency,
      county,
      bank_name,
      account_number,
      account_holder,
      campaign_start_date,
      campaign_end_date,
      ad_campaigns,
      billboards,
      convoys,
      merchandise,
    } = body;

    if (
      !candidate_name ||
      !political_party ||
      !constituency ||
      !county ||
      !bank_name ||
      !account_number ||
      !account_holder
    ) {
      return NextResponse.json(
        { error: 'Missing required fields: candidate_name, political_party, constituency, county, bank_name, account_number, account_holder' },
        { status: 400 }
      );
    }

    const id = createCampaignAccount({
      candidate_name,
      political_party,
      position_running_for,
      constituency,
      county,
      bank_name,
      account_number,
      account_holder,
      campaign_start_date,
      campaign_end_date,
      ad_campaigns,
      billboards,
      convoys,
      merchandise,
    });

    const account = (await import('@/lib/campaignAccount')).getCampaignAccount(Number(id));
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error('Failed to create campaign account:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign account' },
      { status: 500 }
    );
  }
}
