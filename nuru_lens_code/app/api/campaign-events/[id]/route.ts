import { NextResponse } from 'next/server';
import { getClusterById } from '@/lib/campaignPulse';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cluster = getClusterById(decodeURIComponent(id));
    if (!cluster) {
      return NextResponse.json({ error: 'Event cluster not found' }, { status: 404 });
    }
    return NextResponse.json(cluster);
  } catch (error) {
    console.error('Failed to fetch campaign event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}
