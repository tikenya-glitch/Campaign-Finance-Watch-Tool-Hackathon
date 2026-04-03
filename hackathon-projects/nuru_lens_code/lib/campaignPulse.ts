import { db } from './db';

export type EventType =
  | 'rally'
  | 'convoy'
  | 'posters'
  | 'door_to_door'
  | 'giveaways'
  | 'intimidation';

const EVENT_TYPES: EventType[] = [
  'rally',
  'convoy',
  'posters',
  'door_to_door',
  'giveaways',
  'intimidation',
];

db.exec(`
  CREATE TABLE IF NOT EXISTS campaign_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL CHECK(event_type IN ('rally', 'convoy', 'posters', 'door_to_door', 'giveaways', 'intimidation')),
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    description TEXT,
    evidence_url TEXT,
    device_hash TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_campaign_reports_type ON campaign_reports(event_type);
  CREATE INDEX IF NOT EXISTS idx_campaign_reports_created ON campaign_reports(created_at);
`);

export interface CampaignReport {
  id: number;
  event_type: EventType;
  latitude: number;
  longitude: number;
  description: string | null;
  evidence_url: string | null;
  device_hash: string | null;
  created_at: string;
}

export interface CampaignCluster {
  cluster_id: string;
  event_type: EventType;
  center_lat: number;
  center_lng: number;
  report_count: number;
  confidence_score: number;
  reports: CampaignReport[];
  last_updated: string;
}

const DEG_PER_200M = 0.0018; // ~200m at Kenya latitude
const TIME_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

function roundToCluster(lat: number, lng: number): string {
  const rlat = Math.round(lat / DEG_PER_200M) * DEG_PER_200M;
  const rlng = Math.round(lng / DEG_PER_200M) * DEG_PER_200M;
  return `${rlat.toFixed(5)}_${rlng.toFixed(5)}`;
}

function confidenceScore(
  reportCount: number,
  hasEvidence: number,
  _reporterRep: number,
  _locationAcc: number
): number {
  const reportScore = Math.min(reportCount * 15, 35);
  const evidenceScore = hasEvidence > 0 ? 25 : 0;
  const repScore = 25;
  const locScore = 15;
  return Math.round(reportScore + evidenceScore + repScore + locScore);
}

export function createReport(data: {
  event_type: EventType;
  latitude: number;
  longitude: number;
  description?: string;
  evidence_url?: string;
  device_hash?: string;
}): number {
  const stmt = db.prepare(`
    INSERT INTO campaign_reports (event_type, latitude, longitude, description, evidence_url, device_hash)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.event_type,
    data.latitude,
    data.longitude,
    data.description ?? null,
    data.evidence_url ?? null,
    data.device_hash ?? null
  );
  return result.lastInsertRowid as number;
}

export function getAllReports(sinceHours = 24): CampaignReport[] {
  const stmt = db.prepare(`
    SELECT * FROM campaign_reports
    WHERE datetime(created_at) >= datetime('now', ?)
    ORDER BY created_at DESC
  `);
  return stmt.all(`-${sinceHours} hours`) as CampaignReport[];
}

export function getClusters(sinceHours = 24): CampaignCluster[] {
  const reports = getAllReports(sinceHours);
  const byKey = new Map<string, CampaignReport[]>();

  for (const r of reports) {
    const key = `${r.event_type}_${roundToCluster(r.latitude, r.longitude)}`;
    const list = byKey.get(key) ?? [];
    list.push(r);
    byKey.set(key, list);
  }

  const clusters: CampaignCluster[] = [];
  for (const [key, list] of byKey) {
    const eventType = list[0].event_type;
    const centerLat = list.reduce((s, x) => s + x.latitude, 0) / list.length;
    const centerLng = list.reduce((s, x) => s + x.longitude, 0) / list.length;
    const hasEvidence = list.filter((r) => r.evidence_url).length;
    const conf = confidenceScore(list.length, hasEvidence, 1, 1);
    const lastUpdated = list.reduce((a, r) => (r.created_at > a ? r.created_at : a), list[0].created_at);
    clusters.push({
      cluster_id: key,
      event_type: eventType,
      center_lat: centerLat,
      center_lng: centerLng,
      report_count: list.length,
      confidence_score: conf,
      reports: list,
      last_updated: lastUpdated,
    });
  }
  return clusters.sort((a, b) => b.report_count - a.report_count);
}

export function getClusterById(clusterId: string): CampaignCluster | undefined {
  const clusters = getClusters(168);
  return clusters.find((c) => c.cluster_id === clusterId);
}

export function getSummary(sinceHours = 24): Record<EventType, number> {
  const reports = getAllReports(sinceHours);
  const summary: Record<string, number> = {
    rally: 0,
    convoy: 0,
    posters: 0,
    door_to_door: 0,
    giveaways: 0,
    intimidation: 0,
  };
  for (const r of reports) {
    summary[r.event_type] = (summary[r.event_type] ?? 0) + 1;
  }
  return summary as Record<EventType, number>;
}

export function seedCampaignReports(): void {
  const count = db.prepare('SELECT COUNT(*) as c FROM campaign_reports').get() as { c: number };
  if (count.c > 0) return;

  const coords: [number, number][] = [
    [-1.2921, 36.8219],
    [-1.2856, 36.8142],
    [-1.3012, 36.8298],
    [-0.3031, 35.0941],
    [0.5167, 35.2833],
    [-4.0437, 39.6682],
  ];
  const types: EventType[] = ['rally', 'convoy', 'posters', 'door_to_door', 'giveaways'];

  for (let i = 0; i < 40; i++) {
    const [lat, lng] = coords[i % coords.length];
    const jitter = (Math.random() - 0.5) * 0.005;
    createReport({
      event_type: types[i % types.length],
      latitude: lat + jitter,
      longitude: lng + jitter,
      description: i % 3 === 0 ? 'Observed campaign activity' : undefined,
      evidence_url: i % 4 === 0 ? 'https://example.com/photo.jpg' : undefined,
      device_hash: `device_${i}`,
    });
  }
}

// Run seed on first load
seedCampaignReports();
