/**
 * riskScoring.js
 * Computes a composite Campaign Risk Score (0–100) for each candidate,
 * broken into five interpretable sub-scores.
 *
 * Weights:
 *  Donor Concentration  30%
 *  Corporate Influence  25%
 *  Cross-Party Funding  20%
 *  Spending Spike       15%
 *  Geographic Spread    10%
 */

// ── Sector risk multipliers ──────────────────────────────────────────────
// Sectors with direct procurement / policy exposure receive higher multipliers.
const SECTOR_RISK = {
  telecommunications: 1.4,
  banking:            1.3,
  finance:            1.25,
  construction:       1.5,
  real_estate:        1.2,
  manufacturing:      1.1,
  agriculture:        0.9,
  transport:          1.1,
  consumer_goods:     1.0,
  hospitality:        0.8,
  default:            1.0,
};

function sectorRisk(sector) {
  return SECTOR_RISK[sector] ?? SECTOR_RISK.default;
}

// ── Sub-score 1: Donor Concentration ───────────────────────────────────
function scoreDonorConcentration(candidateDonations, total) {
  const donorTotals = {};
  for (const d of candidateDonations) {
    donorTotals[d.donor_id] = (donorTotals[d.donor_id] ?? 0) + d.amount;
  }
  const shares = Object.values(donorTotals)
    .map((a) => a / total)
    .sort((a, b) => b - a);

  const maxShare = shares[0] ?? 0;
  const top3Share = shares.slice(0, 3).reduce((s, v) => s + v, 0);

  // Base: linear on max-share; bonus for top-3 concentration
  return Math.min(100, maxShare * 100 + top3Share * 30);
}

// ── Sub-score 2: Corporate Influence ───────────────────────────────────
function scoreCorporateInfluence(candidateDonations, donorMap, total) {
  let corporateAmount = 0;
  let weightedRisk = 0;

  for (const d of candidateDonations) {
    const donor = donorMap[d.donor_id];
    if (!donor || donor.type !== 'corporate') continue;
    corporateAmount += d.amount;
    weightedRisk += d.amount * sectorRisk(donor.sector);
  }

  if (corporateAmount === 0) return 0;

  const pct = corporateAmount / total;
  const avgSectorRisk = weightedRisk / corporateAmount;
  const sectorBonus = avgSectorRisk >= 1.3 ? 25 : avgSectorRisk >= 1.1 ? 12 : 0;

  return Math.min(100, pct * 80 + sectorBonus);
}

// ── Sub-score 3: Cross-Party Influence ─────────────────────────────────
// Counts donors that also fund candidates from other parties.
function scoreCrossParty(candidateDonations, candidateParty, allDonations, candidateMap) {
  let crossPartyAmount = 0;
  let crossPartyDonors = 0;

  const uniqueDonorIds = [...new Set(candidateDonations.map((d) => d.donor_id))];

  for (const donorId of uniqueDonorIds) {
    // All parties this donor funds across the entire dataset
    const partiesThisDonorFunds = new Set(
      allDonations
        .filter((d) => d.donor_id === donorId)
        .map((d) => candidateMap[d.candidate_id]?.party)
        .filter(Boolean)
    );

    if (partiesThisDonorFunds.size >= 2) {
      crossPartyDonors += 1;
      // Amount this cross-party donor gave to THIS candidate
      crossPartyAmount += candidateDonations
        .filter((d) => d.donor_id === donorId)
        .reduce((s, d) => s + d.amount, 0);
    }
  }

  const crossPartyPct = crossPartyAmount / candidateDonations.reduce((s, d) => s + d.amount, 0);
  return Math.min(100, crossPartyDonors * 15 + crossPartyPct * 40);
}

// ── Sub-score 4: Spending Spike ─────────────────────────────────────────
// z-score of the largest monthly donation total relative to the campaign average.
function scoreSpendingSpike(candidateDonations) {
  if (candidateDonations.length < 2) return 0;

  // Aggregate by year-month
  const monthly = {};
  for (const d of candidateDonations) {
    const key = d.date.slice(0, 7); // "YYYY-MM"
    monthly[key] = (monthly[key] ?? 0) + d.amount;
  }

  const values = Object.values(monthly);
  if (values.length < 2) return 0;

  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  const std = Math.sqrt(variance);
  if (std === 0) return 0;

  const maxZ = Math.max(...values.map((v) => (v - mean) / std));
  return Math.min(100, Math.max(0, maxZ * 25));
}

// ── Sub-score 5: Geographic Spread ─────────────────────────────────────
// Donors from counties other than the candidate's home county.
function scoreGeographicSpread(candidateDonations, donorMap, candidateCounty, total) {
  const outsideCounties = new Set();
  let outsideAmount = 0;

  for (const d of candidateDonations) {
    const donor = donorMap[d.donor_id];
    if (!donor) continue;
    if (donor.county !== candidateCounty) {
      outsideCounties.add(donor.county);
      outsideAmount += d.amount;
    }
  }

  const outsidePct = outsideAmount / total;
  return Math.min(100, outsideCounties.size * 20 + outsidePct * 30);
}

// ── Composite score ─────────────────────────────────────────────────────
const WEIGHTS = {
  donorConcentration:  0.30,
  corporateInfluence:  0.25,
  crossParty:          0.20,
  spendingSpike:       0.15,
  geographicSpread:    0.10,
};

export function computeAllRiskScores(candidates, donations, donors) {
  const donorMap    = Object.fromEntries(donors.map((d) => [d.id, d]));
  const candidateMap = Object.fromEntries(candidates.map((c) => [c.id, c]));

  return candidates.map((candidate) => {
    const myDonations = donations.filter((d) => d.candidate_id === candidate.id);

    if (myDonations.length === 0) {
      const zero = { donorConcentration: 0, corporateInfluence: 0, crossParty: 0, spendingSpike: 0, geographicSpread: 0 };
      return { candidateId: candidate.id, total: 0, subScores: zero, monthlyTotals: {} };
    }

    const total = myDonations.reduce((s, d) => s + d.amount, 0);

    const subScores = {
      donorConcentration: Math.round(scoreDonorConcentration(myDonations, total)),
      corporateInfluence: Math.round(scoreCorporateInfluence(myDonations, donorMap, total)),
      crossParty:         Math.round(scoreCrossParty(myDonations, candidate.party, donations, candidateMap)),
      spendingSpike:      Math.round(scoreSpendingSpike(myDonations)),
      geographicSpread:   Math.round(scoreGeographicSpread(myDonations, donorMap, candidate.county, total)),
    };

    const composite = Math.round(
      subScores.donorConcentration  * WEIGHTS.donorConcentration +
      subScores.corporateInfluence  * WEIGHTS.corporateInfluence +
      subScores.crossParty          * WEIGHTS.crossParty +
      subScores.spendingSpike       * WEIGHTS.spendingSpike +
      subScores.geographicSpread    * WEIGHTS.geographicSpread
    );

    // Build monthly totals for timeline chart
    const monthlyTotals = {};
    for (const d of myDonations) {
      const key = d.date.slice(0, 7);
      monthlyTotals[key] = (monthlyTotals[key] ?? 0) + d.amount;
    }

    return { candidateId: candidate.id, total, subScores, composite, monthlyTotals };
  });
}

// ── Risk level label ────────────────────────────────────────────────────
export function riskLevel(score) {
  if (score >= 75) return 'high';
  if (score >= 50) return 'elevated';
  if (score >= 25) return 'medium';
  return 'low';
}

export function riskColor(score) {
  if (score >= 75) return '#ef4444';
  if (score >= 50) return '#f97316';
  if (score >= 25) return '#eab308';
  return '#22c55e';
}

export const WEIGHTS_INFO = WEIGHTS;
