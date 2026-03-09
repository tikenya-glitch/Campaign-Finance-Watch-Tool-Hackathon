import { NextResponse } from 'next/server';
import { getSummary } from '@/lib/campaignPulse';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const since = parseInt(searchParams.get('since') ?? '24', 10);
    const summary = getSummary(since);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Failed to fetch campaign summary:', error);
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
  }
}
