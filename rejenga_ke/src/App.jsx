/**
 * App.jsx
 * Root orchestrator for PoliScope AI.
 * Responsive: Map view sidebars are collapsible overlays on smaller screens.
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useInfluenceData } from './hooks/useInfluenceData';
import { SlidersHorizontal, PanelRightOpen, PanelRightClose } from 'lucide-react';

import TopBar              from './components/TopBar';
import FilterPanel         from './components/FilterPanel';
import MapView             from './components/MapView';
import DetailsPanel        from './components/DetailsPanel';
import AlertsModal         from './components/AlertsModal';
import CandidateDashboard  from './components/CandidateDashboard';
import InvestigativeMode   from './components/InvestigativeMode';
import PublicDashboard     from './components/PublicDashboard';
import TimelineChart       from './components/TimelineChart';
import CandidateRankingList from './components/CandidateRankingList';

const DEFAULT_DATE = '2027-04-01';

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return isMobile;
}

export default function App() {
  const isMobile = useIsMobile(1024);

  // ── Theme ────────────────────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = useCallback(() => setIsDark((v) => !v), []);
  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  // ── Navigation ──────────────────────────────────────────────────────────
  const [activeView, setActiveView] = useState('dashboard');

  // ── Map filter state ────────────────────────────────────────────────────
  const [selectedParty,     setSelectedParty]     = useState('all');
  const [selectedDonorType, setSelectedDonorType] = useState('all');
  const [minAmount,         setMinAmount]         = useState(0);
  const [maxDate,           setMaxDate]           = useState(DEFAULT_DATE);
  const [showHeatmap,       setShowHeatmap]       = useState(true);
  const [showFlows,         setShowFlows]         = useState(true);

  // ── Sidebar visibility (map view) ───────────────────────────────────────
  const [filterOpen,  setFilterOpen]  = useState(!isMobile);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // ── Selection state ─────────────────────────────────────────────────────
  const [mapSelected, setMapSelected] = useState(null);
  const [alertsOpen,  setAlertsOpen]  = useState(false);

  // ── Data ────────────────────────────────────────────────────────────────
  const {
    donors, candidates, donations, allDonations,
    arcData, heatmapData, donorScatter, candidateScatter,
    countySummary, riskScores, suspiciousFlags, conflicts,
  } = useInfluenceData({ selectedParty, selectedDonorType, minAmount, maxDate });

  const candidateMap = useMemo(
    () => Object.fromEntries(candidates.map((c) => [c.id, c])),
    [candidates]
  );
  const riskMap = useMemo(
    () => Object.fromEntries(riskScores.map((r) => [r.candidateId, r])),
    [riskScores]
  );

  const suspiciousCount = Object.keys(suspiciousFlags).length;
  const [timelineCandidate, setTimelineCandidate] = useState(candidates[0]);

  const handleSelectEntity = useCallback((sel) => {
    setMapSelected(sel);
    setDetailsOpen(true);
  }, []);
  const handleCloseDetails = useCallback(() => {
    setMapSelected(null);
    setDetailsOpen(false);
  }, []);
  const handleSelectDonorFromAlert = useCallback((donor) => {
    setMapSelected({ entity: donor, type: 'donor' });
    setDetailsOpen(true);
    setActiveView('map');
  }, []);

  // Close filter on mobile when a view change happens
  const handleViewChange = useCallback((view) => {
    setActiveView(view);
    if (isMobile) setFilterOpen(false);
  }, [isMobile]);

  return (
    <div className="flex flex-col h-screen bg-surface overflow-hidden" style={{ color: 'var(--text-primary)' }}>
      <TopBar
        activeView={activeView}
        onViewChange={handleViewChange}
        suspiciousCount={suspiciousCount}
        onAlertsClick={() => setAlertsOpen(true)}
        isDark={isDark}
        onThemeToggle={toggleTheme}
      />

      {/* ── Dashboard ───────────────────────────────────────────────────── */}
      {activeView === 'dashboard' && (
        <CandidateDashboard
          candidates={candidates}
          riskScores={riskScores}
          donations={donations}
          donors={donors}
          suspiciousFlags={suspiciousFlags}
          conflicts={conflicts}
          allDonations={allDonations}
        />
      )}

      {/* ── Map ─────────────────────────────────────────────────────────── */}
      {activeView === 'map' && (
        <div className="relative flex flex-1 min-h-0 overflow-hidden">

          {/* Filter overlay backdrop (mobile) */}
          {filterOpen && isMobile && (
            <div
              className="absolute inset-0 z-20 bg-black/50"
              onClick={() => setFilterOpen(false)}
            />
          )}

          {/* Filter panel — slides in from left on mobile */}
          <div
            className={`
              absolute lg:relative z-30 lg:z-auto h-full
              transition-transform duration-200 ease-in-out
              ${filterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              ${!filterOpen && !isMobile ? 'hidden' : ''}
            `}
          >
            <FilterPanel
              selectedParty={selectedParty}   onPartyChange={setSelectedParty}
              selectedDonorType={selectedDonorType} onDonorTypeChange={setSelectedDonorType}
              minAmount={minAmount}           onMinAmountChange={setMinAmount}
              maxDate={maxDate}               onDateChange={setMaxDate}
              showHeatmap={showHeatmap}       onToggleHeatmap={() => setShowHeatmap((v) => !v)}
              showFlows={showFlows}           onToggleFlows={() => setShowFlows((v) => !v)}
              countySummary={countySummary}
            />
          </div>

          {/* Map */}
          <MapView
            arcData={arcData}
            heatmapData={heatmapData}
            donorScatter={donorScatter}
            candidateScatter={candidateScatter}
            suspiciousFlags={suspiciousFlags}
            showHeatmap={showHeatmap}
            showFlows={showFlows}
            onSelectEntity={handleSelectEntity}
          />

          {/* Floating map controls (mobile) */}
          <div className="absolute bottom-6 left-4 flex flex-col gap-2 lg:hidden z-10">
            <button
              onClick={() => { setFilterOpen((v) => !v); setDetailsOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-card/95 backdrop-blur border border-surface-border text-xs text-gray-300 hover:text-white shadow-lg"
            >
              <SlidersHorizontal size={13} />
              Filters
            </button>
          </div>

          {/* Details overlay backdrop (mobile) */}
          {detailsOpen && mapSelected && isMobile && (
            <div
              className="absolute inset-0 z-20 bg-black/50"
              onClick={handleCloseDetails}
            />
          )}

          {/* Details panel — slides in from right on mobile */}
          <div
            className={`
              absolute right-0 lg:relative z-30 lg:z-auto h-full
              transition-transform duration-200 ease-in-out
              ${detailsOpen && mapSelected ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}
          >
            <DetailsPanel
              selected={mapSelected}
              donations={donations}
              donors={donors}
              candidates={candidates}
              suspiciousFlags={suspiciousFlags}
              riskScores={riskScores}
              onClose={handleCloseDetails}
            />
          </div>

        </div>
      )}

      {/* ── Investigate ─────────────────────────────────────────────────── */}
      {activeView === 'investigate' && (
        <InvestigativeMode
          donors={donors}
          candidates={candidates}
          donations={allDonations}
          suspiciousFlags={suspiciousFlags}
        />
      )}

      {/* ── Timeline ────────────────────────────────────────────────────── */}
      {activeView === 'timeline' && (
        <div className="flex flex-1 min-h-0 overflow-hidden flex-col md:flex-row">
          {/* Candidate selector — horizontal scroll on mobile, sidebar on desktop */}
          <div className="md:w-64 bg-surface-card md:border-r border-b md:border-b-0 border-surface-border shrink-0 overflow-x-auto md:overflow-x-visible overflow-y-hidden md:overflow-y-auto">
            <div className="flex md:flex-col min-w-max md:min-w-0">
              {/* Mobile: horizontal chip row */}
              <div className="flex md:hidden px-2 py-2 gap-2">
                {candidates.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setTimelineCandidate(c)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-colors ${
                      timelineCandidate?.id === c.id
                        ? 'bg-accent-blue/20 border-accent-blue/50 text-white'
                        : 'bg-surface-DEFAULT border-surface-border text-gray-500'
                    }`}
                  >
                    {c.name.split(' ')[0]}
                  </button>
                ))}
              </div>
              {/* Desktop: ranked list */}
              <div className="hidden md:block">
                <CandidateRankingList
                  candidates={candidates}
                  riskScores={riskScores}
                  suspiciousFlags={suspiciousFlags}
                  selectedId={timelineCandidate?.id}
                  onSelect={setTimelineCandidate}
                />
              </div>
            </div>
          </div>

          {/* Chart area */}
          <div className="flex-1 flex flex-col min-h-0 p-4 bg-surface">
            {timelineCandidate ? (
              <>
                <div className="mb-3 shrink-0">
                  <h2 className="text-sm font-bold text-white">
                    {timelineCandidate.name}
                  </h2>
                  <p className="text-xs text-gray-600">
                    {timelineCandidate.party} · {timelineCandidate.position} · {timelineCandidate.county}
                  </p>
                </div>
                <div className="flex-1 min-h-0">
                  <TimelineChart
                    monthlyTotals={riskMap[timelineCandidate.id]?.monthlyTotals ?? {}}
                    candidateName={timelineCandidate.name}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center flex-1 text-gray-600 text-sm">
                Select a candidate
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Public ──────────────────────────────────────────────────────── */}
      {activeView === 'public' && (
        <PublicDashboard
          candidates={candidates}
          donors={donors}
          donations={allDonations}
          riskScores={riskScores}
          countySummary={countySummary}
        />
      )}

      {alertsOpen && (
        <AlertsModal
          suspiciousFlags={suspiciousFlags}
          onClose={() => setAlertsOpen(false)}
          onSelectDonor={handleSelectDonorFromAlert}
        />
      )}
    </div>
  );
}
