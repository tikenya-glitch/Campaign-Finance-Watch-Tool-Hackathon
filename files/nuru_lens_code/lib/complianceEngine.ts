import type { Candidate, DonationRecord, AlertItem } from './mockData';
import { mockCandidates, mockDonations } from './mockData';

/**
 * Compliance checks (PRD §11):
 * - Overspending: total_spent > spending_limit
 * - Donation spike: rapid increase in donation volume
 * - Clustered donations: repeated donations from same source
 * - Missing disclosure: incomplete reporting (simplified here via badge/score)
 */

function runOverspendingChecks(candidates: Candidate[]): AlertItem[] {
  const alerts: AlertItem[] = [];
  for (const c of candidates) {
    if (c.fundsSpent > c.spendingLimit) {
      alerts.push({
        id: `overspend-${c.id}`,
        candidateId: c.id,
        candidateName: c.name,
        alertType: 'overspending',
        severity: 'high',
        message: `Spending (KES ${c.fundsSpent.toLocaleString()}) exceeds legal limit (KES ${c.spendingLimit.toLocaleString()}) by KES ${(c.fundsSpent - c.spendingLimit).toLocaleString()}.`,
        createdAt: c.lastUpdated,
      });
    }
  }
  return alerts;
}

function runClusteredDonationChecks(
  candidates: Candidate[],
  donations: DonationRecord[]
): AlertItem[] {
  const alerts: AlertItem[] = [];
  const byCandidateAndDonor = new Map<string, Map<string, DonationRecord[]>>();
  for (const d of donations) {
    const key = d.candidateId;
    if (!byCandidateAndDonor.has(key)) byCandidateAndDonor.set(key, new Map());
    const byDonor = byCandidateAndDonor.get(key)!;
    const donorKey = d.donorName;
    if (!byDonor.has(donorKey)) byDonor.set(donorKey, []);
    byDonor.get(donorKey)!.push(d);
  }
  for (const [candidateId, byDonor] of byCandidateAndDonor) {
    for (const [, records] of byDonor) {
      if (records.length >= 2) {
        const total = records.reduce((s, r) => s + r.amount, 0);
        const candidate = candidates.find((c) => c.id === candidateId);
        if (candidate) {
          alerts.push({
            id: `clustered-${candidateId}-${records[0].donorName.replace(/\s/g, '-')}`,
            candidateId,
            candidateName: candidate.name,
            alertType: 'clustered_donations',
            severity: 'medium',
            message: `Multiple donations from same source (${records.length} entries, total KES ${total.toLocaleString()}).`,
            createdAt: records[records.length - 1].date,
          });
          break; // one alert per candidate for clustering
        }
      }
    }
  }
  return alerts;
}

function runDonationSpikeChecks(
  _candidates: Candidate[],
  donations: DonationRecord[]
): AlertItem[] {
  // Simplified: group by candidate and date, flag if one day has >50% of candidate's donations
  const alerts: AlertItem[] = [];
  const byCandidate = new Map<string, DonationRecord[]>();
  for (const d of donations) {
    const list = byCandidate.get(d.candidateId) ?? [];
    list.push(d);
    byCandidate.set(d.candidateId, list);
  }
  for (const [candidateId, list] of byCandidate) {
    const byDate = new Map<string, number>();
    for (const d of list) {
      byDate.set(d.date, (byDate.get(d.date) ?? 0) + d.amount);
    }
    const total = list.reduce((s, r) => s + r.amount, 0);
    if (total === 0) continue;
    for (const [date, amount] of byDate) {
      if (amount / total >= 0.5 && list.length >= 2) {
        const candidate = mockCandidates.find((c) => c.id === candidateId);
        if (candidate) {
          alerts.push({
            id: `spike-${candidateId}-${date}`,
            candidateId,
            candidateName: candidate.name,
            alertType: 'donation_spike',
            severity: 'medium',
            message: `Unusual concentration of donations on ${date} (KES ${amount.toLocaleString()}).`,
            createdAt: date,
          });
          break;
        }
      }
    }
  }
  return alerts;
}

function runMissingDisclosureChecks(candidates: Candidate[]): AlertItem[] {
  const alerts: AlertItem[] = [];
  for (const c of candidates) {
    if (c.badge === 'none' || c.transparencyScore < 50) {
      alerts.push({
        id: `disclosure-${c.id}`,
        candidateId: c.id,
        candidateName: c.name,
        alertType: 'missing_disclosure',
        severity: c.badge === 'none' ? 'high' : 'low',
        message: `Incomplete or missing financial disclosure (transparency score: ${c.transparencyScore}%).`,
        createdAt: c.lastUpdated,
      });
    }
  }
  return alerts;
}

export function runComplianceChecks(): AlertItem[] {
  const all: AlertItem[] = [];
  all.push(...runOverspendingChecks(mockCandidates));
  all.push(...runClusteredDonationChecks(mockCandidates, mockDonations));
  all.push(...runDonationSpikeChecks(mockCandidates, mockDonations));
  all.push(...runMissingDisclosureChecks(mockCandidates));
  // Dedupe by id and sort by severity (high first) then date (newest first)
  const byId = new Map(all.map((a) => [a.id, a]));
  const ordered = Array.from(byId.values()).sort((a, b) => {
    const sev = { high: 0, medium: 1, low: 2 };
    if (sev[a.severity] !== sev[b.severity]) return sev[a.severity] - sev[b.severity];
    return b.createdAt.localeCompare(a.createdAt);
  });
  return ordered;
}
