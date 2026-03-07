/**
 * CandidateDashboard.jsx
 * Desktop: 3-column layout (Rankings | Radar+Score | Conflicts)
 * Tablet/Mobile: tab-switcher collapses to single visible panel at a time
 */
import { useState, useMemo } from 'react';
import CandidateRankingList from './CandidateRankingList';
import RiskScoreCard from './RiskScoreCard';
import RadarChart from './RadarChart';
import ConflictAlerts from './ConflictAlerts';
import TimelineChart from './TimelineChart';
import { riskColor } from '../utils/riskScoring';
import { BarChart2, Clock, List, AlertTriangle } from 'lucide-react';

const MOBILE_TABS = [
  { id: 'rankings', label: 'Rankings',  icon: List          },
  { id: 'analysis', label: 'Analysis',  icon: BarChart2     },
  { id: 'conflicts',label: 'Conflicts', icon: AlertTriangle  },
];

export default function CandidateDashboard({
  candidates, riskScores, donations, donors,
  suspiciousFlags, conflicts, allDonations,
}) {
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0] ?? null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [mobileTab, setMobileTab] = useState('rankings');

  const candidateMap = useMemo(
    () => Object.fromEntries(candidates.map((c) => [c.id, c])),
    [candidates]
  );
  const riskMap = useMemo(
    () => Object.fromEntries(riskScores.map((r) => [r.candidateId, r])),
    [riskScores]
  );

  const selectedRisk = selectedCandidate ? riskMap[selectedCandidate.id] : null;
  const radarColor   = selectedRisk ? riskColor(selectedRisk.composite) : '#4f8ef7';

  const handleSelectCandidate = (c) => {
    setSelectedCandidate(c);
    setMobileTab('analysis'); // auto-navigate to analysis on mobile after selection
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* ── Mobile tab bar (hidden on lg+) ─────────────────────────────── */}
      <div className="flex lg:hidden border-b border-surface-border bg-surface-card shrink-0">
        {MOBILE_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMobileTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium border-b-2 transition-colors ${
              mobileTab === id
                ? 'border-accent-blue text-white'
                : 'border-transparent text-gray-500'
            }`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Main content area ───────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* LEFT — Rankings list */}
        <div className={`
          lg:flex lg:w-64 lg:border-r lg:border-surface-border bg-surface-card shrink-0
          ${mobileTab === 'rankings' ? 'flex flex-1' : 'hidden'}
          lg:flex-col lg:flex-none
        `}>
          <CandidateRankingList
            candidates={candidates}
            riskScores={riskScores}
            suspiciousFlags={suspiciousFlags}
            selectedId={selectedCandidate?.id}
            onSelect={handleSelectCandidate}
          />
        </div>

        {/* CENTRE — Risk analysis */}
        <div className={`
          lg:flex lg:flex-1 lg:flex-col lg:min-w-0 lg:border-r lg:border-surface-border
          ${mobileTab === 'analysis' ? 'flex flex-1 flex-col min-w-0' : 'hidden'}
        `}>
          {/* Toolbar */}
          <div className="px-4 py-2 border-b border-surface-border flex items-center gap-3 shrink-0">
            <BarChart2 size={13} className="text-accent-blue" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
              {showTimeline ? 'Finance Timeline' : 'Risk Score Analysis'}
            </span>
            <button
              onClick={() => setShowTimeline((v) => !v)}
              className={`ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                showTimeline
                  ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                  : 'bg-surface-hover text-gray-400 hover:text-white border border-surface-border'
              }`}
            >
              <Clock size={11} />
              <span className="hidden sm:inline">Timeline</span>
            </button>
          </div>

          {!showTimeline ? (
            <div className="flex flex-1 min-h-0 overflow-hidden flex-col md:flex-row">
              {/* Radar chart — stacks above on small centre panels */}
              <div className="md:w-64 lg:w-72 p-4 flex flex-col items-center justify-center md:border-r border-b md:border-b-0 border-surface-border shrink-0">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                  Risk Radar
                </p>
                <div className="w-full max-w-[220px] md:max-w-none" style={{ height: 220 }}>
                  {selectedRisk ? (
                    <RadarChart subScores={selectedRisk.subScores} color={radarColor} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-600 text-xs">
                      Select a candidate
                    </div>
                  )}
                </div>
              </div>
              {/* Sub-score breakdown */}
              <div className="flex-1 p-4 overflow-y-auto">
                <RiskScoreCard
                  candidate={selectedCandidate}
                  riskData={selectedRisk}
                  donations={donations}
                  donors={donors}
                  allDonations={allDonations}
                  candidateMap={candidateMap}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 p-4 min-h-0 flex flex-col gap-3 overflow-hidden">
              {selectedRisk ? (
                <>
                  <p className="text-xs text-gray-500 shrink-0">
                    Monthly donations to{' '}
                    <span className="text-white font-medium">{selectedCandidate?.name}</span>
                  </p>
                  <div className="flex-1 min-h-0">
                    <TimelineChart
                      monthlyTotals={selectedRisk.monthlyTotals}
                      candidateName={selectedCandidate?.name}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center flex-1 text-gray-600 text-xs">
                  Select a candidate to view their timeline
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Conflict of interest */}
        <div className={`
          lg:flex lg:w-72 lg:bg-surface-card lg:flex-col lg:shrink-0
          ${mobileTab === 'conflicts' ? 'flex flex-1 flex-col bg-surface-card' : 'hidden'}
        `}>
          <div className="px-4 py-2 border-b border-surface-border shrink-0">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
              Conflict of Interest Alerts
            </p>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ConflictAlerts
              conflicts={conflicts}
              onSelectCandidate={handleSelectCandidate}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
