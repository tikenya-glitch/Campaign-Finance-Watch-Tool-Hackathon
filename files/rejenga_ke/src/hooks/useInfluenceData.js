/**
 * useInfluenceData.js
 * Central data hook — loads raw JSON, applies filters, and returns
 * pre-computed structures for every visualisation layer plus risk scores.
 */
import { useMemo } from 'react';
import {
  buildArcData,
  buildHeatmapData,
  buildDonorScatterData,
  buildCandidateScatterData,
  buildCountySummary,
  filterDonationsByDate,
} from '../utils/dataHelpers';
import { detectSuspiciousPatterns } from '../utils/suspiciousPatterns';
import { computeAllRiskScores } from '../utils/riskScoring';
import { detectConflictsOfInterest } from '../utils/conflictOfInterest';
import donorsRaw     from '../data/donors.json';
import candidatesRaw from '../data/candidates.json';
import donationsRaw  from '../data/donations.json';

export function useInfluenceData({ selectedParty, selectedDonorType, minAmount, maxDate }) {
  // 1. Apply timeline and amount filters
  const filteredDonations = useMemo(() => {
    let result = filterDonationsByDate(donationsRaw, maxDate);
    if (minAmount > 0)          result = result.filter((d) => d.amount >= minAmount);
    if (selectedParty !== 'all') {
      const cMap = Object.fromEntries(candidatesRaw.map((c) => [c.id, c]));
      result = result.filter((d) => cMap[d.candidate_id]?.party === selectedParty);
    }
    if (selectedDonorType !== 'all') {
      const dMap = Object.fromEntries(donorsRaw.map((d) => [d.id, d]));
      result = result.filter((d) => dMap[d.donor_id]?.type === selectedDonorType);
    }
    return result;
  }, [selectedParty, selectedDonorType, minAmount, maxDate]);

  // 2. Deck.gl layer data (filtered)
  const arcData         = useMemo(() => buildArcData(filteredDonations, donorsRaw, candidatesRaw), [filteredDonations]);
  const heatmapData     = useMemo(() => buildHeatmapData(filteredDonations, candidatesRaw), [filteredDonations]);
  const donorScatter    = useMemo(() => buildDonorScatterData(donorsRaw), []);
  const candidateScatter= useMemo(() => buildCandidateScatterData(candidatesRaw), []);
  const countySummary   = useMemo(() => buildCountySummary(filteredDonations, donorsRaw, candidatesRaw), [filteredDonations]);

  // 3. Risk scores computed on ALL donations (independent of view filters)
  const riskScores = useMemo(
    () => computeAllRiskScores(candidatesRaw, donationsRaw, donorsRaw),
    []
  );

  // 4. Suspicious flags on ALL donations
  const suspiciousFlags = useMemo(
    () => detectSuspiciousPatterns(donorsRaw, donationsRaw, candidatesRaw),
    []
  );

  // 5. Conflict of interest detection on ALL donations
  const conflicts = useMemo(
    () => detectConflictsOfInterest(donationsRaw, donorsRaw, candidatesRaw),
    []
  );

  return {
    donors:          donorsRaw,
    candidates:      candidatesRaw,
    donations:       filteredDonations,
    allDonations:    donationsRaw,
    arcData,
    heatmapData,
    donorScatter,
    candidateScatter,
    countySummary,
    riskScores,
    suspiciousFlags,
    conflicts,
  };
}
