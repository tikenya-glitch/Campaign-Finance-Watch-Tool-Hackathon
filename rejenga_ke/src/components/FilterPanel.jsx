/**
 * FilterPanel.jsx
 * Left sidebar for the Map view: layer toggles, party filter,
 * donor type filter, minimum amount slider, timeline filter, county summary.
 */
import { useState } from 'react';
import { Layers, Filter, MapPin, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { formatKES, partyColorHex, donorTypeColorHex } from '../utils/dataHelpers';

const PARTIES     = ['all', 'UDA', 'ODM', 'Jubilee', 'Wiper', 'KANU', 'PDR'];
const DONOR_TYPES = ['all', 'corporate', 'individual', 'organization'];

const MILESTONES = [
  { date: '2025-01-01', label: 'Early 2025' },
  { date: '2025-07-01', label: 'Mid 2025'   },
  { date: '2026-01-01', label: 'Early 2026' },
  { date: '2026-07-01', label: 'Mid 2026'   },
  { date: '2027-01-01', label: 'Early 2027' },
  { date: '2027-04-01', label: 'Election \'27' },
];

export default function FilterPanel({
  selectedParty, onPartyChange,
  selectedDonorType, onDonorTypeChange,
  minAmount, onMinAmountChange,
  showHeatmap, onToggleHeatmap,
  showFlows,   onToggleFlows,
  countySummary,
  maxDate, onDateChange,
}) {
  const [countyExpanded, setCountyExpanded] = useState(true);

  const currentMilestoneIdx = MILESTONES.findIndex((m) => m.date === maxDate);

  return (
    <aside className="w-60 bg-surface-card border-r border-surface-border flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-accent-blue" />
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Filters</span>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-4">
        {/* Layer toggles */}
        <section>
          <label className="section-label"><Layers size={12} />Map Layers</label>
          <div className="flex flex-col gap-2 mt-2">
            <ToggleRow label="Money Flows"    enabled={showFlows}   onToggle={onToggleFlows}   color="accent-blue"   />
            <ToggleRow label="Funding Heatmap" enabled={showHeatmap} onToggle={onToggleHeatmap} color="accent-orange" />
          </div>
        </section>

        {/* Timeline */}
        {onDateChange && (
          <section>
            <label className="section-label"><Calendar size={12} />Timeline</label>
            <div className="mt-2 px-1">
              <input
                type="range"
                min={0}
                max={MILESTONES.length - 1}
                value={currentMilestoneIdx === -1 ? MILESTONES.length - 1 : currentMilestoneIdx}
                onChange={(e) => onDateChange(MILESTONES[parseInt(e.target.value, 10)].date)}
                className="w-full h-1.5 appearance-none rounded-full cursor-pointer timeline-slider"
                style={{
                  background: `linear-gradient(to right, #4f8ef7 0%, #4f8ef7 ${
                    ((currentMilestoneIdx === -1 ? MILESTONES.length - 1 : currentMilestoneIdx) /
                      (MILESTONES.length - 1)) * 100
                  }%, #2a2d3e ${
                    ((currentMilestoneIdx === -1 ? MILESTONES.length - 1 : currentMilestoneIdx) /
                      (MILESTONES.length - 1)) * 100
                  }%, #2a2d3e 100%)`,
                }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-gray-600">2025</span>
                <span className="text-[10px] text-accent-blue font-semibold">
                  {MILESTONES[currentMilestoneIdx === -1 ? MILESTONES.length - 1 : currentMilestoneIdx]?.label}
                </span>
                <span className="text-[9px] text-gray-600">2027</span>
              </div>
            </div>
          </section>
        )}

        {/* Party filter */}
        <section>
          <label className="section-label">Political Party</label>
          <div className="flex flex-col gap-1 mt-2">
            {PARTIES.map((p) => (
              <button
                key={p}
                onClick={() => onPartyChange(p)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors text-left ${
                  selectedParty === p
                    ? 'bg-surface-hover text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-surface-hover/50'
                }`}
              >
                {p !== 'all' && (
                  <span className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: partyColorHex(p) }} />
                )}
                <span className="truncate">{p === 'all' ? 'All Parties' : p}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Donor type filter */}
        <section>
          <label className="section-label">Donor Type</label>
          <div className="flex flex-col gap-1 mt-2">
            {DONOR_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => onDonorTypeChange(t)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors text-left ${
                  selectedDonorType === t
                    ? 'bg-surface-hover text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-surface-hover/50'
                }`}
              >
                {t !== 'all' && (
                  <span className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: donorTypeColorHex(t) }} />
                )}
                <span className="capitalize">{t === 'all' ? 'All Types' : t}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Minimum amount slider */}
        <section>
          <label className="section-label">Min. Donation</label>
          <div className="mt-2 px-1">
            <input
              type="range"
              min={0}
              max={4000000}
              step={500000}
              value={minAmount}
              onChange={(e) => onMinAmountChange(Number(e.target.value))}
              className="w-full h-1.5 appearance-none rounded-full cursor-pointer timeline-slider"
              style={{
                background: `linear-gradient(to right, #4f8ef7 0%, #4f8ef7 ${
                  (minAmount / 4_000_000) * 100
                }%, #2a2d3e ${(minAmount / 4_000_000) * 100}%, #2a2d3e 100%)`,
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-600">KES 0</span>
              <span className="text-[11px] text-accent-blue font-semibold">
                {minAmount > 0 ? formatKES(minAmount) : 'No min'}
              </span>
              <span className="text-[10px] text-gray-600">4M</span>
            </div>
          </div>
        </section>

        {/* County summary */}
        <section>
          <button
            onClick={() => setCountyExpanded((v) => !v)}
            className="section-label w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-1"><MapPin size={12} />County Funding</div>
            {countyExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {countyExpanded && (
            <div className="flex flex-col gap-1 mt-2">
              {countySummary
                .sort((a, b) => b.total - a.total)
                .slice(0, 8)
                .map((c) => (
                  <div key={c.county} className="flex items-center gap-2 py-0.5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300 truncate">{c.county}</span>
                        <span className="text-[10px] text-gray-500 ml-1 shrink-0">{formatKES(c.total)}</span>
                      </div>
                      <div className="h-0.5 bg-surface-border rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-accent-orange rounded-full"
                          style={{ width: `${Math.min(100, (c.total / 25_000_000) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}

function ToggleRow({ label, enabled, onToggle, color }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-hover/50 transition-colors"
    >
      <span className="text-xs text-gray-300">{label}</span>
      <div className={`relative w-8 h-4 rounded-full transition-colors ${enabled ? `bg-${color}` : 'bg-surface-border'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
    </button>
  );
}
