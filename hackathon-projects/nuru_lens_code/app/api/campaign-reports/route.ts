import { NextResponse } from 'next/server';
import { createReport, getAllReports } from '@/lib/campaignPulse';
import type { EventType } from '@/lib/campaignPulse';

const VALID_TYPES: EventType[] = ['rally', 'convoy', 'posters', 'door_to_door', 'giveaways', 'intimidation'];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const since = parseInt(url.searchParams.get('since') ?? '24', 10);
    const reports = getAllReports(since);
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Failed to fetch campaign reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type, latitude, longitude, description, evidence_url, device_hash } = body;

    if (!event_type || !VALID_TYPES.includes(event_type)) {
      return NextResponse.json({ error: 'Invalid event_type' }, { status: 400 });
    }
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json({ error: 'latitude and longitude required' }, { status: 400 });
    }
    if (latitude < -5 || latitude > 5 || longitude < 33 || longitude > 43) {
      return NextResponse.json({ error: 'Coordinates must be within Kenya' }, { status: 400 });
    }

    const id = createReport({
      event_type,
      latitude,
      longitude,
      description,
      evidence_url,
      device_hash,
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error('Failed to create campaign report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
