/**
 * CandidateRankingList.jsx
 * Scrollable ranked list of all candidates sorted by composite risk score.
 * Clicking a row selects that candidate for detail analysis.
 */
import { riskColor, riskLevel } from '../utils/riskScoring';
import { formatKES, partyColorHex } from '../utils/dataHelpers';
import { AlertTriangle } from 'lucide-react';

export default function CandidateRankingList({
  candidates,
  riskScores,
  suspiciousFlags,
  selectedId,
  onSelect,
}) {
  // Map candidateId → riskData
  const riskMap = Object.fromEntries(riskScores.map((r) => [r.candidateId, r]));

  const ranked = [...candidates].sort((a, b) => {
    const sa = riskMap[a.id]?.composite ?? 0;
    const sb = riskMap[b.id]?.composite ?? 0;
    return sb - sa;
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-2 border-b border-surface-border shrink-0">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
          Candidates — ranked by risk
        </p>
      </div>

      <div className="flex flex-col divide-y divide-surface-border">
        {ranked.map((candidate, idx) => {
          const rd      = riskMap[candidate.id];
          const score   = rd?.composite ?? 0;
          const total   = rd?.total ?? 0;
          const color   = riskColor(score);
          const level   = riskLevel(score);
          const isSusp  = !!suspiciousFlags[candidate.id];
          const isSelected = candidate.id === selectedId;

          return (
            <button
              key={candidate.id}
              onClick={() => onSelect(candidate)}
              className={`flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-hover/50 transition-colors ${
                isSelected ? 'bg-surface-hover border-l-2' : ''
              }`}
              style={isSelected ? { borderLeftColor: color } : {}}
            >
              {/* Rank */}
              <span className="text-[11px] text-gray-600 w-5 text-center shrink-0">
                {idx + 1}
              </span>

              {/* Score ring */}
              <div className="relative w-9 h-9 shrink-0">
                <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                  <circle cx="20" cy="20" r="15" fill="none" stroke="#2a2d3e" strokeWidth="3" />
                  <circle
                    cx="20" cy="20" r="15"
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * 94.2} 94.2`}
                  />
                </svg>
                <span
                  className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
                  style={{ color }}
                >
                  {score}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[12px] font-medium text-white truncate">
                    {candidate.name.split(' ')[0]} {candidate.name.split(' ')[1]}
                  </span>
                  {isSusp && <AlertTriangle size={10} className="text-accent-red shrink-0" />}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      color: partyColorHex(candidate.party),
                      backgroundColor: partyColorHex(candidate.party) + '22',
                    }}
                  >
                    {candidate.party}
                  </span>
                  <span className="text-[9px] text-gray-600">
                    {candidate.position} · {candidate.county}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right shrink-0">
                <p className="text-[11px] font-mono text-gray-400">{formatKES(total)}</p>
                <RiskChip level={level} color={color} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RiskChip({ level, color }) {
  const labels = { high: 'HIGH', elevated: 'ELEV.', medium: 'MED.', low: 'LOW' };
  return (
    <span
      className="text-[9px] font-bold px-1 py-0.5 rounded"
      style={{ color, backgroundColor: color + '18' }}
    >
      {labels[level] ?? level}
    </span>
  );
}
