/**
 * InvestigativeMode.jsx
 * Journalist / watchdog search tool — fully responsive.
 * Mobile: stacked (summary above, network below)
 * Desktop: side-by-side
 */
import { useState, useMemo, useCallback } from 'react';
import { Search, X, TrendingUp, User, Building2, Users, Network } from 'lucide-react';
import { formatKES, partyColorHex, donorTypeColorHex, buildNetworkData } from '../utils/dataHelpers';
import NetworkGraph from './NetworkGraph';
import { AlertTriangle } from 'lucide-react';

export default function InvestigativeMode({ donors, candidates, donations, suspiciousFlags }) {
  const [query, setQuery]       = useState('');
  const [selected, setSelected] = useState(null);
  const [mobileTab, setMobileTab] = useState('summary'); // 'summary' | 'network'

  const candidateMap = useMemo(() => Object.fromEntries(candidates.map((c) => [c.id, c])), [candidates]);
  const donorMap     = useMemo(() => Object.fromEntries(donors.map((d) => [d.id, d])),     [donors]);

  const allEntities = useMemo(() => [
    ...donors.map((d)     => ({ id: d.id, name: d.name, type: 'donor',     entity: d })),
    ...candidates.map((c) => ({ id: c.id, name: c.name, type: 'candidate', entity: c })),
  ], [donors, candidates]);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return allEntities.filter((e) => e.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, allEntities]);

  const handleSelect = useCallback((item) => {
    setSelected({ entity: item.entity, type: item.type });
    setQuery(item.name);
    setMobileTab('summary');
  }, []);

  const clear = useCallback(() => { setSelected(null); setQuery(''); }, []);

  const summary = useMemo(() => {
    if (!selected) return null;
    const { entity, type } = selected;
    if (type === 'donor') {
      const myDons    = donations.filter((d) => d.donor_id === entity.id);
      const total     = myDons.reduce((s, d) => s + d.amount, 0);
      const cids      = [...new Set(myDons.map((d) => d.candidate_id))];
      const parties   = [...new Set(cids.map((id) => candidateMap[id]?.party).filter(Boolean))];
      const counties  = [...new Set(cids.map((id) => candidateMap[id]?.county).filter(Boolean))];
      const topCands  = Object.entries(myDons.reduce((a, d) => { a[d.candidate_id] = (a[d.candidate_id] ?? 0) + d.amount; return a; }, {}))
        .sort((a, b) => b[1] - a[1]).slice(0, 5)
        .map(([cid, amt]) => ({ candidate: candidateMap[cid], amount: amt })).filter((r) => r.candidate);
      return { type, entity, totalAmount: total, candidateCount: cids.length, parties, counties, topCandidates: topCands, flag: suspiciousFlags[entity.id] };
    }
    if (type === 'candidate') {
      const myDons   = donations.filter((d) => d.candidate_id === entity.id);
      const total    = myDons.reduce((s, d) => s + d.amount, 0);
      const dids     = [...new Set(myDons.map((d) => d.donor_id))];
      const donorCtys= [...new Set(dids.map((id) => donorMap[id]?.county).filter(Boolean))];
      const topDons  = Object.entries(myDons.reduce((a, d) => { a[d.donor_id] = (a[d.donor_id] ?? 0) + d.amount; return a; }, {}))
        .sort((a, b) => b[1] - a[1]).slice(0, 5)
        .map(([did, amt]) => ({ donor: donorMap[did], amount: amt })).filter((r) => r.donor);
      return { type, entity, totalAmount: total, donorCount: dids.length, donorCounties: donorCtys, topDonors: topDons };
    }
  }, [selected, donations, candidateMap, donorMap, suspiciousFlags]);

  const networkData = useMemo(() => {
    if (!selected) return null;
    return buildNetworkData(selected.entity, selected.type, donations, donors, candidates);
  }, [selected, donations, donors, candidates]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Search bar */}
      <div className="px-4 py-3 border-b border-surface-border bg-surface-card shrink-0">
        <div className="relative max-w-2xl mx-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); if (!e.target.value) setSelected(null); }}
            placeholder="Search donor, candidate, company…"
            className="w-full bg-surface-DEFAULT border border-surface-border rounded-xl pl-9 pr-9 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent-blue/60 transition-colors"
          />
          {query && (
            <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Autocomplete */}
        {results.length > 0 && !selected && (
          <div className="max-w-2xl mx-auto mt-1 bg-surface-card border border-surface-border rounded-xl overflow-hidden shadow-xl z-10 relative">
            {results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover transition-colors text-left"
              >
                <EntityTypeIcon type={item.type} entity={item.entity} />
                <div>
                  <p className="text-[12px] text-white font-medium">{item.name}</p>
                  <p className="text-[10px] text-gray-500">
                    {item.type === 'donor'
                      ? `${item.entity.type} · ${item.entity.county}`
                      : `${item.entity.party} · ${item.entity.position} · ${item.entity.county}`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {!selected ? (
        <EmptyState />
      ) : (
        <>
          {/* Mobile tab switcher */}
          <div className="flex md:hidden border-b border-surface-border bg-surface-card shrink-0">
            {[{ id: 'summary', label: 'Profile' }, { id: 'network', label: 'Network' }].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setMobileTab(id)}
                className={`flex-1 py-2.5 text-[12px] font-medium border-b-2 transition-colors ${
                  mobileTab === id ? 'border-accent-blue text-white' : 'border-transparent text-gray-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Influence summary */}
            <div className={`
              w-full md:w-80 border-r border-surface-border overflow-y-auto bg-surface-card shrink-0
              ${mobileTab === 'network' ? 'hidden md:block' : 'block'}
            `}>
              <InfluenceSummary summary={summary} />
            </div>

            {/* Network graph */}
            <div className={`
              flex-1 flex flex-col min-h-0
              ${mobileTab === 'summary' ? 'hidden md:flex' : 'flex'}
            `}>
              <div className="px-4 py-2 border-b border-surface-border shrink-0">
                <div className="flex items-center gap-1.5">
                  <Network size={12} className="text-gray-500" />
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold truncate">
                    Influence Network — {selected.entity.name}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-h-0 bg-surface-DEFAULT">
                {networkData?.nodes.length > 0 ? (
                  <NetworkGraph data={networkData} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600 text-xs">
                    No relationship data found
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function InfluenceSummary({ summary }) {
  if (!summary) return null;
  const { type, entity, flag } = summary;
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <EntityTypeIcon type={type} entity={entity} size="lg" />
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-white truncate">{entity.name}</h3>
          <p className="text-[11px] text-gray-500 truncate">
            {type === 'donor'
              ? `${entity.type} · ${entity.sector?.replace(/_/g, ' ')} · ${entity.county}`
              : `${entity.party} · ${entity.position} · ${entity.county}`}
          </p>
        </div>
      </div>

      {flag && (
        <div className="p-3 rounded-xl bg-accent-red/10 border border-accent-red/30">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={12} className="text-accent-red" />
            <span className="text-xs font-semibold text-accent-red">Influence Risk</span>
          </div>
          {flag.reasons.map((r, i) => (
            <p key={i} className="text-[11px] text-gray-400">• {r}</p>
          ))}
        </div>
      )}

      {type === 'donor' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Total Donated"   value={formatKES(summary.totalAmount)} color="#4f8ef7" />
            <Stat label="Candidates"      value={summary.candidateCount}         color="#f97316" />
            <Stat label="Parties Reached" value={summary.parties.length}         color="#a855f7" />
            <Stat label="Counties"        value={summary.counties.length}        color="#22c55e" />
          </div>
          <Section title="Parties Funded">
            <div className="flex flex-wrap gap-1">
              {summary.parties.map((p) => (
                <span key={p} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ color: partyColorHex(p), backgroundColor: partyColorHex(p) + '22' }}>
                  {p}
                </span>
              ))}
            </div>
          </Section>
          <Section title="Counties Influenced">
            <div className="flex flex-wrap gap-1">
              {summary.counties.map((c) => (
                <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-border text-gray-400">{c}</span>
              ))}
            </div>
          </Section>
          <Section title="Top Funded Candidates">
            {summary.topCandidates.map(({ candidate, amount }) => (
              <div key={candidate.id} className="flex items-center justify-between py-1">
                <div className="min-w-0 mr-2">
                  <p className="text-[11px] text-white truncate">{candidate.name.split(' ').slice(0, 2).join(' ')}</p>
                  <p className="text-[9px] text-gray-600">{candidate.party} · {candidate.county}</p>
                </div>
                <span className="text-[11px] font-mono text-accent-blue shrink-0">{formatKES(amount)}</span>
              </div>
            ))}
          </Section>
        </>
      )}

      {type === 'candidate' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Total Raised"   value={formatKES(summary.totalAmount)} color="#4f8ef7" />
            <Stat label="Donors"         value={summary.donorCount}             color="#f97316" />
            <Stat label="Donor Counties" value={summary.donorCounties.length}   color="#22c55e" />
          </div>
          <Section title="Donor Counties">
            <div className="flex flex-wrap gap-1">
              {summary.donorCounties.map((c) => (
                <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-border text-gray-400">{c}</span>
              ))}
            </div>
          </Section>
          <Section title="Top Donors">
            {summary.topDonors.map(({ donor, amount }) => (
              <div key={donor.id} className="flex items-center justify-between py-1">
                <div className="min-w-0 mr-2">
                  <p className="text-[11px] text-white truncate">{donor.name}</p>
                  <p className="text-[9px] text-gray-600">{donor.type} · {donor.county}</p>
                </div>
                <span className="text-[11px] font-mono text-accent-blue shrink-0">{formatKES(amount)}</span>
              </div>
            ))}
          </Section>
        </>
      )}
    </div>
  );
}

function EntityTypeIcon({ type, entity, size = 'sm' }) {
  const dim = size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';
  const iconSize = size === 'lg' ? 16 : 12;
  if (type === 'donor') {
    const Icon = entity?.type === 'corporate' ? Building2 : entity?.type === 'organization' ? Users : User;
    const color = donorTypeColorHex(entity?.type);
    return (
      <div className={`${dim} rounded-lg flex items-center justify-center shrink-0`}
        style={{ backgroundColor: color + '22', border: `1px solid ${color}44` }}>
        <Icon size={iconSize} style={{ color }} />
      </div>
    );
  }
  return (
    <div className={`${dim} rounded-lg flex items-center justify-center shrink-0`}
      style={{ backgroundColor: partyColorHex(entity?.party) + '22', border: `1px solid ${partyColorHex(entity?.party)}44` }}>
      <TrendingUp size={iconSize} style={{ color: partyColorHex(entity?.party) }} />
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="bg-surface-DEFAULT rounded-lg p-2 border border-surface-border">
      <p className="text-[9px] text-gray-600 mb-0.5">{label}</p>
      <p className="text-xs font-bold truncate" style={{ color }}>{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold mb-1.5">{title}</p>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
      <Search size={40} className="text-gray-800" />
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-1">Investigative Mode</h3>
        <p className="text-xs text-gray-600 max-w-sm leading-relaxed">
          Search for any donor, candidate, or company to reveal their complete political influence footprint.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {['Safaricom Foundation', 'Alice Wambua', 'Rift Valley Holdings'].map((hint) => (
          <span key={hint} className="text-[10px] px-2 py-1 rounded-full bg-surface-card border border-surface-border text-gray-500">
            Try: "{hint}"
          </span>
        ))}
      </div>
    </div>
  );
}
