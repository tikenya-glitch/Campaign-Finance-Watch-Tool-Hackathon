import { NextResponse } from 'next/server';
import { getClusters } from '@/lib/campaignPulse';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const since = parseInt(searchParams.get('since') ?? '24', 10);
    const clusters = getClusters(since);
    const payload = clusters.map((c) => ({
      cluster_id: c.cluster_id,
      event_type: c.event_type,
      center_lat: c.center_lat,
      center_lng: c.center_lng,
      report_count: c.report_count,
      confidence_score: c.confidence_score,
      last_updated: c.last_updated,
    }));
    return NextResponse.json(payload);
  } catch (error) {
    console.error('Failed to fetch campaign clusters:', error);
    return NextResponse.json({ error: 'Failed to fetch clusters' }, { status: 500 });
  }
}
