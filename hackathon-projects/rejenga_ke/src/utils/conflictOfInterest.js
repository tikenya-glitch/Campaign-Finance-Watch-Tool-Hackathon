/**
 * conflictOfInterest.js
 * Identifies potential conflicts of interest where a donor's sector
 * overlaps with decision-making areas controlled by the funded candidate.
 *
 * Does NOT accuse anyone of corruption — flags situations where
 * financial relationships could create incentives for policy favouritism.
 */

import { explainConflict } from './explainableAI';

// Responsibilities associated with each donor sector
const SECTOR_INTERESTS = {
  telecommunications: ['telecommunications_policy', 'infrastructure', 'procurement'],
  banking:            ['finance', 'fiscal_policy', 'procurement'],
  finance:            ['finance', 'fiscal_policy'],
  construction:       ['infrastructure', 'procurement', 'urban_planning'],
  real_estate:        ['urban_planning', 'procurement', 'land_policy'],
  manufacturing:      ['procurement', 'infrastructure'],
  agriculture:        ['agriculture', 'land_policy'],
  transport:          ['infrastructure', 'procurement'],
  consumer_goods:     [],
  hospitality:        ['tourism'],
};

// Risk level by sector
const SECTOR_COI_RISK = {
  construction:       'high',
  real_estate:        'high',
  telecommunications: 'high',
  banking:            'high',
  finance:            'medium',
  manufacturing:      'medium',
  transport:          'medium',
  agriculture:        'medium',
  consumer_goods:     'low',
  hospitality:        'low',
};

// Minimum donation amount to flag (avoid flagging token amounts)
const MIN_FLAG_AMOUNT = 500_000;

export function detectConflictsOfInterest(donations, donors, candidates) {
  const donorMap     = Object.fromEntries(donors.map((d) => [d.id, d]));
  const candidateMap = Object.fromEntries(candidates.map((c) => [c.id, c]));

  const conflicts = [];

  for (const donation of donations) {
    if (donation.amount < MIN_FLAG_AMOUNT) continue;

    const donor     = donorMap[donation.donor_id];
    const candidate = candidateMap[donation.candidate_id];
    if (!donor || !candidate) continue;

    // Only consider corporate donors and individuals who are government contractors
    const isRelevantDonor =
      donor.type === 'corporate' ||
      (donor.type === 'individual' && donor.is_government_contractor) ||
      donor.type === 'organization';
    if (!isRelevantDonor) continue;

    const sectorInterests     = SECTOR_INTERESTS[donor.sector] ?? [];
    const candidateResponsibilities = candidate.responsibilities ?? [];

    // Find overlapping areas
    const overlap = sectorInterests.filter((interest) =>
      candidateResponsibilities.includes(interest)
    );

    if (overlap.length === 0) continue;

    const coi_risk = SECTOR_COI_RISK[donor.sector] ?? 'low';
    if (coi_risk === 'low') continue;

    conflicts.push({
      id:           `coi-${donation.id}`,
      donationId:   donation.id,
      donor,
      candidate,
      amount:       donation.amount,
      date:         donation.date,
      overlap,
      risk:         coi_risk,
      explanation:  explainConflict(donor, candidate, overlap),
      // Extra flag if donor is a government contractor
      contractorFlag: donor.is_government_contractor,
    });
  }

  // Deduplicate: keep highest-amount donation per (donor, candidate) pair
  const seen = new Set();
  return conflicts
    .sort((a, b) => b.amount - a.amount)
    .filter((c) => {
      const key = `${c.donor.id}-${c.candidate.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => (a.risk === 'high' ? -1 : 1));
}
