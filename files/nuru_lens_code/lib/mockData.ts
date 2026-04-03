// --- Types (aligned with PRD) ---

export type ComplianceStatus = 'compliant' | 'violation' | 'pending';

export interface FundingSource {
  source: string;
  amount: number;
  percent: number;
}

export interface DonationRecord {
  id: string;
  candidateId: string;
  donorName: string;
  amount: number;
  date: string;
  source: string;
}

export interface AlertItem {
  id: string;
  candidateId: string;
  candidateName: string;
  alertType: 'overspending' | 'donation_spike' | 'clustered_donations' | 'missing_disclosure';
  severity: 'high' | 'medium' | 'low';
  message: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  constituency: string;
  county: string;
  fundsRaised: number;
  fundsSpent: number;
  spendingLimit: number;
  transparencyScore: number;
  complianceStatus: ComplianceStatus;
  badge: 'verified' | 'partial' | 'none';
  fundingBreakdown: FundingSource[];
  lastUpdated: string;
}

// --- Mock candidates (with spending limits & compliance) ---

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    party: 'Progressive Party',
    constituency: 'Westlands',
    county: 'Nairobi',
    fundsRaised: 2_500_000,
    fundsSpent: 1_800_000,
    spendingLimit: 2_000_000,
    transparencyScore: 95,
    complianceStatus: 'compliant',
    badge: 'verified',
    fundingBreakdown: [
      { source: 'Individual donations', amount: 1_200_000, percent: 48 },
      { source: 'Party allocation', amount: 800_000, percent: 32 },
      { source: 'Fundraisers', amount: 500_000, percent: 20 },
    ],
    lastUpdated: '2026-03-01',
  },
  {
    id: '2',
    name: 'Bob Smith',
    party: 'Unity Alliance',
    constituency: 'Kilimani',
    county: 'Nairobi',
    fundsRaised: 1_800_000,
    fundsSpent: 1_600_000,
    spendingLimit: 2_000_000,
    transparencyScore: 78,
    complianceStatus: 'compliant',
    badge: 'partial',
    fundingBreakdown: [
      { source: 'Individual donations', amount: 1_000_000, percent: 56 },
      { source: 'Party allocation', amount: 500_000, percent: 28 },
      { source: 'Other', amount: 300_000, percent: 16 },
    ],
    lastUpdated: '2026-02-28',
  },
  {
    id: '3',
    name: 'Carol Davis',
    party: 'Independent',
    constituency: 'Langata',
    county: 'Nairobi',
    fundsRaised: 1_200_000,
    fundsSpent: 1_400_000,
    spendingLimit: 1_500_000,
    transparencyScore: 45,
    complianceStatus: 'violation',
    badge: 'none',
    fundingBreakdown: [
      { source: 'Individual donations', amount: 900_000, percent: 75 },
      { source: 'Other', amount: 300_000, percent: 25 },
    ],
    lastUpdated: '2026-02-15',
  },
  {
    id: '4',
    name: 'David Ochieng',
    party: 'Coalition for Change',
    constituency: 'Kisumu Central',
    county: 'Kisumu',
    fundsRaised: 3_100_000,
    fundsSpent: 2_900_000,
    spendingLimit: 3_000_000,
    transparencyScore: 82,
    complianceStatus: 'compliant',
    badge: 'verified',
    fundingBreakdown: [
      { source: 'Individual donations', amount: 1_500_000, percent: 48 },
      { source: 'Party allocation', amount: 1_000_000, percent: 32 },
      { source: 'Fundraisers', amount: 600_000, percent: 20 },
    ],
    lastUpdated: '2026-03-02',
  },
  {
    id: '5',
    name: 'Grace Wanjiku',
    party: 'People\'s Alliance',
    constituency: 'Dagoretti South',
    county: 'Nairobi',
    fundsRaised: 950_000,
    fundsSpent: 1_100_000,
    spendingLimit: 1_200_000,
    transparencyScore: 52,
    complianceStatus: 'violation',
    badge: 'partial',
    fundingBreakdown: [
      { source: 'Individual donations', amount: 700_000, percent: 74 },
      { source: 'Other', amount: 250_000, percent: 26 },
    ],
    lastUpdated: '2026-02-20',
  },
];

// --- Mock donations (for spike / clustered detection) ---

export const mockDonations: DonationRecord[] = [
  { id: 'd1', candidateId: '3', donorName: 'Anonymous', amount: 200_000, date: '2026-02-10', source: 'Other' },
  { id: 'd2', candidateId: '3', donorName: 'Anonymous', amount: 150_000, date: '2026-02-11', source: 'Other' },
  { id: 'd3', candidateId: '3', donorName: 'Anonymous', amount: 180_000, date: '2026-02-12', source: 'Other' },
  { id: 'd4', candidateId: '5', donorName: 'J. Kamau', amount: 300_000, date: '2026-02-18', source: 'Individual' },
  { id: 'd5', candidateId: '5', donorName: 'J. Kamau', amount: 250_000, date: '2026-02-19', source: 'Individual' },
];

// --- Helpers ---

export function getCandidateById(id: string): Candidate | undefined {
  return mockCandidates.find((c) => c.id === id);
}

export function getTopCandidates(): Candidate[] {
  return [...mockCandidates].sort((a, b) => b.transparencyScore - a.transparencyScore);
}

export function getCandidatesByCounty(county: string): Candidate[] {
  if (!county || county === 'all') return mockCandidates;
  return mockCandidates.filter((c) => c.county === county);
}

export function getCandidatesByConstituency(constituency: string): Candidate[] {
  if (!constituency || constituency === 'all') return mockCandidates;
  return mockCandidates.filter((c) => c.constituency === constituency);
}

export function getUniqueCounties(): string[] {
  const set = new Set(mockCandidates.map((c) => c.county));
  return Array.from(set).sort();
}

export function getUniqueConstituencies(): string[] {
  const set = new Set(mockCandidates.map((c) => c.constituency));
  return Array.from(set).sort();
}

// Mock monthly funding trend (for dashboard viz)
export const mockMonthlyTrend: { month: string; raised: number; spent: number }[] = [
  { month: 'Oct 2025', raised: 1_200_000, spent: 800_000 },
  { month: 'Nov 2025', raised: 2_100_000, spent: 1_500_000 },
  { month: 'Dec 2025', raised: 2_800_000, spent: 2_200_000 },
  { month: 'Jan 2026', raised: 3_500_000, spent: 2_900_000 },
  { month: 'Feb 2026', raised: 4_200_000, spent: 3_400_000 },
  { month: 'Mar 2026', raised: 5_500_000, spent: 4_200_000 },
];
