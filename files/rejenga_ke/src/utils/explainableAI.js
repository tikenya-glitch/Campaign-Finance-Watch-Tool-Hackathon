/**
 * explainableAI.js
 * Generates natural-language explanations for every risk sub-score and alert.
 * Returns strings suitable for display directly in the UI.
 */

import { formatKES } from './dataHelpers';

// ── Sub-score explanations ───────────────────────────────────────────────

export function explainDonorConcentration(score, candidateDonations, donors) {
  if (!candidateDonations.length) return 'No donations recorded for this campaign.';

  const donorMap = Object.fromEntries(donors.map((d) => [d.id, d]));
  const total = candidateDonations.reduce((s, d) => s + d.amount, 0);

  const donorTotals = {};
  for (const d of candidateDonations) {
    donorTotals[d.donor_id] = (donorTotals[d.donor_id] ?? 0) + d.amount;
  }
  const top = Object.entries(donorTotals).sort((a, b) => b[1] - a[1])[0];
  if (!top) return '';
  const topDonorName = donorMap[top[0]]?.name ?? 'Unknown';
  const topPct = Math.round((top[1] / total) * 100);

  if (score >= 70)
    return `${topDonorName} contributes ${topPct}% of total campaign funding (${formatKES(top[1])}). Campaigns with extreme dependence on a single source face heightened influence risk — the donor may expect policy favours in return for their outsized support.`;
  if (score >= 40)
    return `${topDonorName} is the largest donor at ${topPct}% of funding. While not dominant, this concentration creates leverage and warrants monitoring for potential policy alignment.`;
  return `Campaign funding is spread across multiple donors. ${topDonorName} is the largest contributor at ${topPct}%, which does not indicate undue concentration.`;
}

export function explainCorporateInfluence(score, candidateDonations, donors) {
  if (!candidateDonations.length) return 'No donations recorded.';

  const donorMap = Object.fromEntries(donors.map((d) => [d.id, d]));
  const total = candidateDonations.reduce((s, d) => s + d.amount, 0);
  const corpDonations = candidateDonations.filter((d) => donorMap[d.donor_id]?.type === 'corporate');
  const corpTotal = corpDonations.reduce((s, d) => s + d.amount, 0);
  const corpPct = Math.round((corpTotal / total) * 100);
  const sectors = [...new Set(corpDonations.map((d) => donorMap[d.donor_id]?.sector).filter(Boolean))];

  if (score >= 70)
    return `Corporate entities provide ${corpPct}% of campaign funding (${formatKES(corpTotal)}), including companies in ${sectors.join(', ')}. High corporate involvement — especially from regulated or government-facing industries — raises serious concerns about policy favouritism and regulatory capture.`;
  if (score >= 40)
    return `Corporate donors account for ${corpPct}% of total funding. Key sectors represented include ${sectors.join(', ')}, which may hold regulatory interests tied to decisions made by this candidate if elected.`;
  return `Corporate funding represents ${corpPct}% of the campaign, a modest level that does not indicate dominant corporate influence at this stage.`;
}

export function explainCrossParty(score, candidateDonations, allDonations, donors, candidateMap) {
  if (!candidateDonations.length) return 'No donations recorded.';

  const donorMap = Object.fromEntries(donors.map((d) => [d.id, d]));
  const uniqueDonorIds = [...new Set(candidateDonations.map((d) => d.donor_id))];
  let crossPartyCount = 0;
  const crossPartyNames = [];
  const crossPartySet = new Set();

  for (const donorId of uniqueDonorIds) {
    const parties = new Set(
      allDonations
        .filter((d) => d.donor_id === donorId)
        .map((d) => candidateMap[d.candidate_id]?.party)
        .filter(Boolean)
    );
    if (parties.size >= 2) {
      crossPartyCount++;
      crossPartyNames.push(donorMap[donorId]?.name ?? donorId);
      [...parties].forEach((p) => crossPartySet.add(p));
    }
  }

  if (crossPartyCount === 0)
    return 'All donors to this campaign give exclusively within aligned party lines, suggesting conventional partisan support.';

  if (score >= 70)
    return `${crossPartyCount} donor${crossPartyCount > 1 ? 's' : ''} — including ${crossPartyNames.slice(0, 2).join(', ')} — fund candidates across ${crossPartySet.size} competing parties (${[...crossPartySet].join(', ')}). This pattern strongly suggests these donors are seeking to maintain political influence regardless of election outcomes, a hallmark of transactional political financing.`;

  return `${crossPartyCount} donor${crossPartyCount > 1 ? 's' : ''} also fund candidates from other parties. This cross-party giving warrants monitoring for attempts to cultivate influence across the political spectrum.`;
}

export function explainSpendingSpike(score, monthlyTotals) {
  const entries = Object.entries(monthlyTotals).sort((a, b) => a[0].localeCompare(b[0]));
  if (entries.length < 2) return 'Insufficient timeline data to detect spending anomalies.';

  const values = entries.map(([, v]) => v);
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const maxEntry = entries.reduce((best, e) => (e[1] > best[1] ? e : best), entries[0]);
  const maxMonth = maxEntry[0];
  const maxAmount = maxEntry[1];

  const [year, month] = maxMonth.split('-');
  const monthName = new Date(Number(year), Number(month) - 1).toLocaleString('en-KE', {
    month: 'long',
    year: 'numeric',
  });

  if (score >= 50)
    return `A significant funding surge was detected in ${monthName} (${formatKES(maxAmount)}), which is ${Math.round((maxAmount / mean) * 100 - 100)}% above the campaign's monthly average. Sudden spikes — particularly near election periods — may indicate coordinated injection of funds or last-minute influence attempts.`;
  if (score >= 25)
    return `Moderate variation detected in campaign finance activity. The highest single month was ${monthName} at ${formatKES(maxAmount)}, approximately ${Math.round(maxAmount / mean)}x the monthly average. This is worth monitoring but does not yet constitute an anomaly.`;
  return `Campaign finance activity shows a consistent, gradual pattern over time. No unusual surges were detected that would suggest coordinated or last-minute financial influence.`;
}

export function explainGeographicSpread(score, candidateDonations, donors, candidateCounty) {
  if (!candidateDonations.length) return 'No donations recorded.';
  const donorMap = Object.fromEntries(donors.map((d) => [d.id, d]));
  const total = candidateDonations.reduce((s, d) => s + d.amount, 0);
  const outsideCounties = new Set();
  let outsideAmount = 0;

  for (const d of candidateDonations) {
    const donor = donorMap[d.donor_id];
    if (donor && donor.county !== candidateCounty) {
      outsideCounties.add(donor.county);
      outsideAmount += d.amount;
    }
  }

  const pct = Math.round((outsideAmount / total) * 100);
  const counties = [...outsideCounties].join(', ');

  if (score >= 60)
    return `${pct}% of campaign funding (${formatKES(outsideAmount)}) originates from donors in ${outsideCounties.size} counties outside ${candidateCounty}: ${counties}. This wide geographic spread suggests a coordinated multi-county influence network beyond the candidate's immediate constituency.`;
  if (score >= 30)
    return `A portion of funding (${pct}%) comes from outside ${candidateCounty}, specifically from ${counties}. Some external financial support is normal, but expanding cross-county networks warrant attention.`;
  return `Most campaign funding originates from within or near ${candidateCounty}, reflecting a locally grounded funding base with limited external influence.`;
}

// ── Anomaly detection explanation for timeline ───────────────────────────

export function explainTimelineAnomaly(month, value, mean, zScore) {
  const [year, mo] = month.split('-');
  const monthName = new Date(Number(year), Number(mo) - 1).toLocaleString('en-KE', {
    month: 'long',
    year: 'numeric',
  });

  return `In ${monthName}, total donations reached ${formatKES(value)}, which is ${zScore.toFixed(1)} standard deviations above the campaign average. This spike exceeds statistical norms and may indicate a coordinated influx of funds, possibly timed to influence campaign activity ahead of a critical political period.`;
}

// ── Conflict of interest explanation ─────────────────────────────────────

export function explainConflict(donor, candidate, overlappingInterests) {
  const sector = donor.sector?.replace(/_/g, ' ') ?? 'unknown sector';
  const interests = overlappingInterests.map((i) => i.replace(/_/g, ' ')).join(', ');

  return `${donor.name}, a ${sector} entity${donor.is_government_contractor ? ' and active government contractor' : ''}, donated to ${candidate.name} who would oversee ${interests} decisions if elected as ${candidate.position} of ${candidate.county} County. This financial relationship could create incentives for policy favouritism in areas directly relevant to the donor's business.`;
}
