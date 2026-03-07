/**
 * dataHelpers.js
 * Core data transformation utilities for InfluenceTracker.
 * Converts raw JSON records into structures ready for deck.gl layers and D3 graphs.
 */

// ----- Formatting helpers ------------------------------------------------

export function formatKES(amount) {
  if (amount >= 1_000_000) {
    return `KES ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `KES ${(amount / 1_000).toFixed(0)}K`;
  }
  return `KES ${amount.toLocaleString()}`;
}

// ----- Party colour mapping ----------------------------------------------

export const PARTY_COLORS = {
  UDA:     [79, 142, 247],   // blue
  ODM:     [249, 115, 22],   // orange
  Jubilee: [168, 85, 247],   // purple
  Wiper:   [34, 197, 94],    // green
  KANU:    [234, 179, 8],    // yellow
  PDR:     [239, 68, 68],    // red
  default: [156, 163, 175],  // grey
};

export function partyColor(party) {
  return PARTY_COLORS[party] ?? PARTY_COLORS.default;
}

export function partyColorHex(party) {
  const [r, g, b] = partyColor(party);
  return `rgb(${r},${g},${b})`;
}

// ----- Donor type colour mapping ----------------------------------------

export const DONOR_TYPE_COLORS = {
  corporate:    [79, 142, 247],   // blue
  individual:   [249, 115, 22],   // orange
  organization: [168, 85, 247],   // purple
};

export function donorTypeColor(type) {
  return DONOR_TYPE_COLORS[type] ?? [156, 163, 175];
}

export function donorTypeColorHex(type) {
  const [r, g, b] = donorTypeColor(type);
  return `rgb(${r},${g},${b})`;
}

// ----- Build enriched arc data for deck.gl ArcLayer ---------------------

/**
 * Each arc record contains source (donor) and target (candidate) positions
 * plus metadata for tooltips and styling.
 */
export function buildArcData(donations, donors, candidates) {
  const donorMap = Object.fromEntries(donors.map((d) => [d.id, d]));
  const candidateMap = Object.fromEntries(candidates.map((c) => [c.id, c]));

  return donations.reduce((acc, donation) => {
    const donor = donorMap[donation.donor_id];
    const candidate = candidateMap[donation.candidate_id];
    if (!donor || !candidate) return acc;

    acc.push({
      id: donation.id,
      // deck.gl expects [lng, lat]
      sourcePosition: [donor.location.lng, donor.location.lat],
      targetPosition: [candidate.location.lng, candidate.location.lat],
      amount: donation.amount,
      date: donation.date,
      donor,
      candidate,
      // Width proportional to amount — normalised between 2 and 12
      width: 2 + (donation.amount / 5_000_000) * 10,
      // Color driven by donor type
      color: donorTypeColor(donor.type),
    });
    return acc;
  }, []);
}

// ----- Build heatmap data -----------------------------------------------

/**
 * Returns one point per county with a weight proportional to total donations
 * flowing to candidates in that county.
 */
export function buildHeatmapData(donations, candidates) {
  const candidateMap = Object.fromEntries(candidates.map((c) => [c.id, c]));

  // Aggregate total donations per county
  const countyTotals = {};
  for (const donation of donations) {
    const candidate = candidateMap[donation.candidate_id];
    if (!candidate) continue;
    countyTotals[candidate.county] = (countyTotals[candidate.county] ?? 0) + donation.amount;
  }

  // One heatmap point per candidate county (use candidate location)
  const seenCounties = new Set();
  const points = [];
  for (const candidate of candidates) {
    if (seenCounties.has(candidate.county)) continue;
    seenCounties.add(candidate.county);
    const weight = countyTotals[candidate.county] ?? 0;
    if (weight > 0) {
      points.push({
        position: [candidate.location.lng, candidate.location.lat],
        weight,
        county: candidate.county,
      });
    }
  }
  return points;
}

// ----- Build scatter plot data for donors / candidates ------------------

export function buildDonorScatterData(donors) {
  return donors.map((d) => ({
    ...d,
    position: [d.location.lng, d.location.lat],
    color: donorTypeColor(d.type),
    radius: 10000 + (d.total_donations / 15_000_000) * 40000,
  }));
}

export function buildCandidateScatterData(candidates) {
  return candidates.map((c) => ({
    ...c,
    position: [c.location.lng, c.location.lat],
    color: partyColor(c.party),
    radius: 12000,
  }));
}

// ----- County funding summary -------------------------------------------

export function buildCountySummary(donations, donors, candidates) {
  const donorMap = Object.fromEntries(donors.map((d) => [d.id, d]));
  const candidateMap = Object.fromEntries(candidates.map((c) => [c.id, c]));

  const summary = {}; // county → { total, topDonors: Map, candidates: Set }

  for (const donation of donations) {
    const donor = donorMap[donation.donor_id];
    const candidate = candidateMap[donation.candidate_id];
    if (!donor || !candidate) continue;

    const county = candidate.county;
    if (!summary[county]) {
      summary[county] = { county, total: 0, donorAmounts: {}, candidates: new Set() };
    }
    summary[county].total += donation.amount;
    summary[county].donorAmounts[donor.name] =
      (summary[county].donorAmounts[donor.name] ?? 0) + donation.amount;
    summary[county].candidates.add(candidate.name);
  }

  // Convert to serialisable form
  return Object.values(summary).map((s) => ({
    county: s.county,
    total: s.total,
    topDonors: Object.entries(s.donorAmounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, amount]) => ({ name, amount })),
    candidates: [...s.candidates],
  }));
}

// ----- Network graph data for D3 ----------------------------------------

/**
 * Builds nodes and links for the D3 force graph.
 * Scope: all entities related to a selected donor or candidate.
 */
export function buildNetworkData(selectedEntity, entityType, donations, donors, candidates) {
  const donorMap = Object.fromEntries(donors.map((d) => [d.id, d]));
  const candidateMap = Object.fromEntries(candidates.map((c) => [c.id, c]));

  const nodes = new Map();
  const links = [];
  const seenLinks = new Set();

  // Helper to add a node once
  const addNode = (id, type, data) => {
    if (!nodes.has(id)) nodes.set(id, { id, type, ...data });
  };

  const relevantDonations = donations.filter((donation) => {
    if (entityType === 'donor') return donation.donor_id === selectedEntity.id;
    if (entityType === 'candidate') return donation.candidate_id === selectedEntity.id;
    return false;
  });

  for (const donation of relevantDonations) {
    const donor = donorMap[donation.donor_id];
    const candidate = candidateMap[donation.candidate_id];
    if (!donor || !candidate) continue;

    addNode(`donor-${donor.id}`, 'donor', { label: donor.name, subtype: donor.type, color: donorTypeColorHex(donor.type) });
    addNode(`candidate-${candidate.id}`, 'candidate', { label: candidate.name, party: candidate.party, color: partyColorHex(candidate.party) });
    addNode(`party-${candidate.party}`, 'party', { label: candidate.party, color: partyColorHex(candidate.party) });

    const linkKey = `${donor.id}-${candidate.id}`;
    if (!seenLinks.has(linkKey)) {
      seenLinks.add(linkKey);
      links.push({
        source: `donor-${donor.id}`,
        target: `candidate-${candidate.id}`,
        amount: donation.amount,
        label: formatKES(donation.amount),
      });
    }

    const partyLinkKey = `${candidate.id}-${candidate.party}`;
    if (!seenLinks.has(partyLinkKey)) {
      seenLinks.add(partyLinkKey);
      links.push({
        source: `candidate-${candidate.id}`,
        target: `party-${candidate.party}`,
        amount: 0,
        label: '',
      });
    }
  }

  return { nodes: [...nodes.values()], links };
}

// ----- Date filter helper -----------------------------------------------

export function filterDonationsByDate(donations, maxDate) {
  return donations.filter((d) => d.date <= maxDate);
}
