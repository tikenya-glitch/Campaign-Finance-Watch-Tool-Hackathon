/**
 * RiskScoreCard.jsx
 * Displays the composite risk score, sub-score breakdown bars,
 * and natural-language AI explanations for a selected candidate.
 */
import { useState } from 'react';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { riskLevel, riskColor } from '../utils/riskScoring';
import {
  explainDonorConcentration,
  explainCorporateInfluence,
  explainCrossParty,
  explainSpendingSpike,
  explainGeographicSpread,
} from '../utils/explainableAI';
import { formatKES } from '../utils/dataHelpers';

const SUB_SCORE_META = [
  { key: 'donorConcentration', label: 'Donor Concentration',  weight: 30, icon: '👤' },
  { key: 'corporateInfluence', label: 'Corporate Influence',  weight: 25, icon: '🏢' },
  { key: 'crossParty',         label: 'Cross-Party Funding',  weight: 20, icon: '⚖️'  },
  { key: 'spendingSpike',      label: 'Spending Spike',       weight: 15, icon: '📈' },
  { key: 'geographicSpread',   label: 'Geographic Spread',    weight: 10, icon: '🗺️'  },
];

function subScoreColor(score) {
  if (score >= 75) return '#ef4444';
  if (score >= 50) return '#f97316';
  if (score >= 25) return '#eab308';
  return '#22c55e';
}

export default function RiskScoreCard({
  candidate,
  riskData,
  donations,
  donors,
  allDonations,
  candidateMap,
}) {
  const [expandedKey, setExpandedKey] = useState(null);

  if (!candidate || !riskData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-600 text-sm">
        Select a candidate to view risk analysis
      </div>
    );
  }

  const { subScores, composite, total, monthlyTotals } = riskData;
  const level = riskLevel(composite);
  const color = riskColor(composite);

  const myDonations = donations.filter((d) => d.candidate_id === candidate.id);

  // Pre-compute explanations
  const explanations = {
    donorConcentration: explainDonorConcentration(subScores.donorConcentration, myDonations, donors),
    corporateInfluence: explainCorporateInfluence(subScores.corporateInfluence, myDonations, donors),
    crossParty:         explainCrossParty(subScores.crossParty, myDonations, allDonations, donors, candidateMap),
    spendingSpike:      explainSpendingSpike(subScores.spendingSpike, monthlyTotals),
    geographicSpread:   explainGeographicSpread(subScores.geographicSpread, myDonations, donors, candidate.county),
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
      {/* Score header */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-DEFAULT border border-surface-border">
        {/* Big score circle */}
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r="32" fill="none" stroke="#2a2d3e" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="32"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(composite / 100) * 201} 201`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-white leading-none">{composite}</span>
            <span className="text-[9px] text-gray-500 uppercase">/100</span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white truncate">{candidate.name}</h3>
          <p className="text-[11px] text-gray-500 mb-1">
            {candidate.party} · {candidate.position} · {candidate.county}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <RiskBadge level={level} color={color} />
            <span className="text-[11px] text-gray-500">
              Total raised: <span className="text-gray-300 font-medium">{formatKES(total)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sub-score bars */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold px-1">
          Risk Factor Breakdown
        </p>

        {SUB_SCORE_META.map(({ key, label, weight, icon }) => {
          const score     = subScores[key] ?? 0;
          const barColor  = subScoreColor(score);
          const isOpen    = expandedKey === key;

          return (
            <div key={key} className="rounded-lg border border-surface-border overflow-hidden">
              <button
                onClick={() => setExpandedKey(isOpen ? null : key)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-surface-hover/50 transition-colors"
              >
                <span className="text-base shrink-0">{icon}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-gray-300 font-medium">{label}</span>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-[10px] text-gray-600">×{weight}%</span>
                      <span
                        className="text-[11px] font-bold tabular-nums w-6 text-right"
                        style={{ color: barColor }}
                      >
                        {score}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${score}%`, backgroundColor: barColor }}
                    />
                  </div>
                </div>

                {isOpen ? (
                  <ChevronDown size={12} className="text-gray-600 shrink-0" />
                ) : (
                  <ChevronRight size={12} className="text-gray-600 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-3 pb-3 pt-1 bg-surface-DEFAULT/50 border-t border-surface-border">
                  <div className="flex items-start gap-2">
                    <Info size={11} className="text-gray-600 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {explanations[key]}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Weighted contribution */}
      <div className="rounded-lg border border-surface-border p-3">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2">
          Score Contribution (weighted)
        </p>
        <div className="flex h-4 rounded-full overflow-hidden gap-px">
          {SUB_SCORE_META.map(({ key, weight }) => {
            const score = subScores[key] ?? 0;
            const contribution = (score * weight) / 100;
            return (
              <div
                key={key}
                className="h-full"
                style={{
                  width: `${weight}%`,
                  backgroundColor: subScoreColor(score) + 'aa',
                }}
                title={`${key}: ${Math.round(contribution)} pts`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-1">
          {SUB_SCORE_META.map(({ key, weight }) => (
            <span key={key} className="text-[9px] text-gray-700" style={{ width: `${weight}%` }}>
              {weight}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RiskBadge({ level, color }) {
  const labels = { high: 'High Risk', elevated: 'Elevated', medium: 'Medium', low: 'Low Risk' };
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
      style={{ color, backgroundColor: color + '18', borderColor: color + '44' }}
    >
      {labels[level] ?? level}
    </span>
  );
}
