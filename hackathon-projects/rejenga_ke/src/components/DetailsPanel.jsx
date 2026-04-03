/**
 * DetailsPanel.jsx
 * Right sidebar shown in Map view: entity details, risk score summary, and network graph.
 */
import { X, AlertTriangle, Network, User, Building2, Users, TrendingUp } from 'lucide-react';
import {
  formatKES,
  partyColorHex,
  donorTypeColorHex,
  buildNetworkData,
} from '../utils/dataHelpers';
import { riskColor, riskLevel } from '../utils/riskScoring';
import NetworkGraph from './NetworkGraph';

const TYPE_ICONS = {
  corporate:    Building2,
  individual:   User,
  organization: Users,
};

export default function DetailsPanel({
  selected,
  donations,
  donors,
  candidates,
  suspiciousFlags,
  riskScores,
  onClose,
}) {
  if (!selected) {
    return (
      <aside className="w-72 bg-surface-card border-l border-surface-border flex flex-col items-center justify-center p-6 gap-3">
        <Network size={32} className="text-gray-700" />
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Click any donor or candidate on the map to explore their influence network
        </p>
      </aside>
    );
  }

  const { entity, type } = selected;
  const flag = type === 'donor' ? suspiciousFlags[entity.id] : null;
  const riskMap = Object.fromEntries(riskScores.map((r) => [r.candidateId, r]));
  const candidateRisk = type === 'candidate' ? riskMap[entity.id] : null;
  const networkData = buildNetworkData(entity, type, donations, donors, candidates);

  return (
    <aside className="w-72 bg-surface-card border-l border-surface-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-surface-border flex items-start justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <EntityIcon entity={entity} type={type} />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">{entity.name}</h3>
            <p className="text-[11px] text-gray-500">
              {type === 'donor' ? entity.county : `${entity.party} · ${entity.position}`}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-300 transition-colors shrink-0">
          <X size={14} />
        </button>
      </div>

      {/* Candidate risk score mini-display */}
      {candidateRisk && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-surface-DEFAULT border border-surface-border shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Campaign Risk Score</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ color: riskColor(candidateRisk.composite), backgroundColor: riskColor(candidateRisk.composite) + '1a' }}
            >
              {riskLevel(candidateRisk.composite).toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="text-2xl font-bold"
              style={{ color: riskColor(candidateRisk.composite) }}
            >
              {candidateRisk.composite}
              <span className="text-sm font-normal text-gray-600">/100</span>
            </div>
            {/* Mini sub-score bars */}
            <div className="flex-1 flex flex-col gap-0.5">
              {[
                ['Concentration', candidateRisk.subScores.donorConcentration],
                ['Corporate',     candidateRisk.subScores.corporateInfluence],
                ['Cross-Party',   candidateRisk.subScores.crossParty],
                ['Spike',         candidateRisk.subScores.spendingSpike],
                ['Geographic',    candidateRisk.subScores.geographicSpread],
              ].map(([label, score]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="text-[8px] text-gray-600 w-14 shrink-0">{label}</span>
                  <div className="flex-1 h-1 bg-surface-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${score}%`, backgroundColor: riskColor(score) }}
                    />
                  </div>
                  <span className="text-[8px] text-gray-600 w-5 text-right shrink-0">{score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Suspicious alert */}
      {flag && (
        <div className="mx-3 mt-3 p-3 rounded-lg bg-accent-red/10 border border-accent-red/30 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertTriangle size={13} className="text-accent-red shrink-0" />
            <span className="text-xs font-semibold text-accent-red">
              {flag.riskLevel === 'high' ? 'High' : 'Medium'} Influence Risk
            </span>
          </div>
          {flag.reasons.map((r, i) => (
            <p key={i} className="text-[11px] text-gray-400 flex items-start gap-1.5">
              <span className="text-accent-red mt-0.5">•</span>{r}
            </p>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="px-3 pt-3 shrink-0">
        {type === 'donor' ? (
          <DonorStats entity={entity} donations={donations} candidates={candidates} />
        ) : (
          <CandidateStats entity={entity} donations={donations} donors={donors} />
        )}
      </div>

      {/* Network graph */}
      <div className="flex flex-col flex-1 min-h-0 px-3 pb-3 pt-2">
        <div className="flex items-center gap-1.5 mb-2 shrink-0">
          <Network size={11} className="text-gray-500" />
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
            Influence Network
          </span>
        </div>
        <div className="flex-1 bg-surface-DEFAULT rounded-lg border border-surface-border min-h-0 flex flex-col overflow-hidden">
          <NetworkGraph data={networkData} />
        </div>
      </div>
    </aside>
  );
}

function EntityIcon({ entity, type }) {
  const Icon = type === 'donor' ? (TYPE_ICONS[entity.type] ?? User) : TrendingUp;
  const colorHex =
    type === 'donor' ? donorTypeColorHex(entity.type) : partyColorHex(entity.party);
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
      style={{ backgroundColor: colorHex + '22', border: `1px solid ${colorHex}44` }}
    >
      <Icon size={14} style={{ color: colorHex }} />
    </div>
  );
}

function DonorStats({ entity, donations, candidates }) {
  const cMap = Object.fromEntries(candidates.map((c) => [c.id, c]));
  const myDons = donations.filter((d) => d.donor_id === entity.id);
  const total = myDons.reduce((s, d) => s + d.amount, 0);
  const uniqueCandidates = [...new Set(myDons.map((d) => d.candidate_id))];
  const parties = [...new Set(uniqueCandidates.map((cid) => cMap[cid]?.party).filter(Boolean))];

  return (
    <div className="grid grid-cols-2 gap-2 mb-2">
      <StatCard label="Total Donated"    value={formatKES(total)}           color="#4f8ef7" />
      <StatCard label="Candidates"       value={uniqueCandidates.length}    color="#f97316" />
      <StatCard label="Parties Reached"  value={parties.length}             color="#a855f7" />
      <StatCard label="Type"             value={entity.type}                color={donorTypeColorHex(entity.type)} />
    </div>
  );
}

function CandidateStats({ entity, donations, donors }) {
  const dMap = Object.fromEntries(donors.map((d) => [d.id, d]));
  const myDons = donations.filter((d) => d.candidate_id === entity.id);
  const total = myDons.reduce((s, d) => s + d.amount, 0);
  const uniqueDonors = [...new Set(myDons.map((d) => d.donor_id))];
  const topDonors = myDons.sort((a, b) => b.amount - a.amount).slice(0, 3);

  return (
    <div className="grid grid-cols-2 gap-2 mb-2">
      <StatCard label="Total Raised"   value={formatKES(total)}       color="#4f8ef7" />
      <StatCard label="Donors"         value={uniqueDonors.length}    color="#f97316" />
      <StatCard label="Party"          value={entity.party}           color={partyColorHex(entity.party)} />
      <StatCard label="Position"       value={entity.position}        color="#22c55e" />
      <div className="col-span-2">
        <p className="text-[10px] text-gray-600 mb-1">Top Donors</p>
        {topDonors.map((d) => (
          <div key={d.id} className="flex justify-between items-center py-0.5">
            <span className="text-[10px] text-gray-400 truncate">{dMap[d.donor_id]?.name}</span>
            <span className="text-[10px] font-mono text-accent-blue ml-2">{formatKES(d.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-surface-DEFAULT rounded-lg p-2 border border-surface-border">
      <p className="text-[10px] text-gray-600 mb-0.5">{label}</p>
      <p className="text-xs font-semibold truncate" style={{ color }}>{value}</p>
    </div>
  );
}
