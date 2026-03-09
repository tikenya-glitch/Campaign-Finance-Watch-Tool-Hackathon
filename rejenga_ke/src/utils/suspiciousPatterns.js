/**
 * suspiciousPatterns.js
 * Heuristic rules to flag potentially suspicious donor behaviour.
 *
 * Rules applied:
 *  1. Funds 3+ candidates   → "Broad candidate reach"
 *  2. Funds candidates from 2+ competing parties → "Cross-party financing"
 *  3. Single donation ≥ KES 4,000,000 → "Unusually large donation"
 *  4. Total donations ≥ KES 10,000,000 → "Exceptional total spend"
 */

export function detectSuspiciousPatterns(donors, donations, candidates) {
  const candidateMap = Object.fromEntries(candidates.map((c) => [c.id, c]));

  // Group donations per donor
  const donorDonations = {};
  for (const donation of donations) {
    if (!donorDonations[donation.donor_id]) donorDonations[donation.donor_id] = [];
    donorDonations[donation.donor_id].push(donation);
  }

  const flags = {}; // donor_id → { reasons: string[], riskLevel: 'high'|'medium' }

  for (const donor of donors) {
    const donorGifts = donorDonations[donor.id] ?? [];
    const reasons = [];

    // Rule 1: funds 3+ candidates
    const uniqueCandidates = new Set(donorGifts.map((d) => d.candidate_id));
    if (uniqueCandidates.size >= 3) {
      reasons.push(`Donated to ${uniqueCandidates.size} candidates`);
    }

    // Rule 2: cross-party financing
    const parties = new Set(
      [...uniqueCandidates]
        .map((cid) => candidateMap[cid]?.party)
        .filter(Boolean)
    );
    if (parties.size >= 2) {
      reasons.push(`Funds ${parties.size} competing parties (${[...parties].join(', ')})`);
    }

    // Rule 3: single large donation
    const maxDonation = Math.max(...donorGifts.map((d) => d.amount), 0);
    if (maxDonation >= 4_000_000) {
      reasons.push(`Single donation of KES ${(maxDonation / 1_000_000).toFixed(1)}M`);
    }

    // Rule 4: exceptional total spend
    const totalSpend = donorGifts.reduce((s, d) => s + d.amount, 0);
    if (totalSpend >= 10_000_000) {
      reasons.push(`Total spend KES ${(totalSpend / 1_000_000).toFixed(1)}M`);
    }

    if (reasons.length > 0) {
      flags[donor.id] = {
        donor,
        reasons,
        totalAmount: totalSpend,
        candidateCount: uniqueCandidates.size,
        riskLevel: reasons.length >= 3 ? 'high' : 'medium',
      };
    }
  }

  return flags;
}
