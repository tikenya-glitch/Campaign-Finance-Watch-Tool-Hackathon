/**
 * PublicDashboard.jsx
 * Simplified transparency dashboard for citizens — fully responsive.
 */
import { formatKES, partyColorHex, donorTypeColorHex } from '../utils/dataHelpers';
import { riskColor, riskLevel } from '../utils/riskScoring';
import { AlertTriangle, TrendingUp, Users, MapPin, Database, ShieldCheck } from 'lucide-react';

function getHeatColor(value, max) {
  const pct = value / max;
  if (pct > 0.75) return '#ef4444';
  if (pct > 0.5)  return '#f97316';
  if (pct > 0.25) return '#eab308';
  return '#22c55e';
}

export default function PublicDashboard({ candidates, donors, donations, riskScores, countySummary }) {
  const riskMap = Object.fromEntries(riskScores.map((r) => [r.candidateId, r]));

  const ranked = [...candidates].sort(
    (a, b) => (riskMap[b.id]?.composite ?? 0) - (riskMap[a.id]?.composite ?? 0)
  );

  const donorTotals = {};
  for (const d of donations) donorTotals[d.donor_id] = (donorTotals[d.donor_id] ?? 0) + d.amount;
  const topDonors = Object.entries(donorTotals)
    .sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([did, amt]) => ({ donor: donors.find((d) => d.id === did), amount: amt }))
    .filter((r) => r.donor);

  const topCounties = [...countySummary].sort((a, b) => b.total - a.total).slice(0, 8);
  const maxCounty = topCounties[0]?.total ?? 1;
  const totalCirculation = donations.reduce((s, d) => s + d.amount, 0);
  const totalDonors = new Set(donations.map((d) => d.donor_id)).size;
  const highRiskCount = riskScores.filter((r) => r.composite >= 75).length;

  return (
    <div className="flex-1 overflow-y-auto bg-surface p-4 sm:p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">

        {/* Header */}
        <div className="text-center px-2">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
            Kenya Campaign Finance Transparency
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
            Monitoring political financing ahead of the 2027 General Elections.
          </p>
        </div>

        {/* Summary stats — 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <PublicStat icon={TrendingUp}    label="In Circulation"      value={formatKES(totalCirculation)} color="#4f8ef7" />
          <PublicStat icon={Users}         label="Active Donors"        value={totalDonors}                 color="#f97316" />
          <PublicStat icon={AlertTriangle} label="High-Risk Campaigns"  value={highRiskCount}               color="#ef4444" />
          <PublicStat icon={MapPin}        label="Counties Tracked"    value={topCounties.length}           color="#22c55e" />
        </div>

        {/* Rankings + County — stack on mobile, side-by-side on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Campaign risk ranking */}
          <div className="lg:col-span-2 bg-surface-card rounded-2xl border border-surface-border p-4 sm:p-5">
            <h3 className="text-sm font-bold text-white mb-1">Campaign Risk Rankings</h3>
            <p className="text-[11px] text-gray-500 mb-4">
              Higher scores indicate patterns that warrant scrutiny — not proof of wrongdoing.
            </p>
            <div className="flex flex-col gap-2.5">
              {ranked.map((c, i) => {
                const rd    = riskMap[c.id];
                const score = rd?.composite ?? 0;
                const color = riskColor(score);
                return (
                  <div key={c.id} className="flex items-center gap-2 sm:gap-3">
                    <span className="text-[11px] text-gray-600 w-4 text-right shrink-0">{i + 1}</span>
                    <div
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: color + '22', color }}
                    >
                      {score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <span className="text-xs text-white font-medium truncate">
                          {c.name.split(' ').slice(0, 2).join(' ')}
                        </span>
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0"
                          style={{ color: partyColorHex(c.party), backgroundColor: partyColorHex(c.party) + '22' }}
                        >
                          {c.party}
                        </span>
                      </div>
                      <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-[10px] font-mono text-gray-500">{formatKES(rd?.total ?? 0)}</p>
                      <p className="text-[9px] capitalize" style={{ color }}>{riskLevel(score)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* County heatmap bars */}
          <div className="bg-surface-card rounded-2xl border border-surface-border p-4 sm:p-5">
            <h3 className="text-sm font-bold text-white mb-1">Funding by County</h3>
            <p className="text-[11px] text-gray-500 mb-4">Most heavily funded counties.</p>
            <div className="flex flex-col gap-2.5">
              {topCounties.map((c) => (
                <div key={c.county}>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[11px] text-gray-300">{c.county}</span>
                    <span className="text-[10px] font-mono text-gray-500">{formatKES(c.total)}</span>
                  </div>
                  <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(c.total / maxCounty) * 100}%`,
                        backgroundColor: getHeatColor(c.total, maxCounty),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top donors — 1 col mobile, 2 col sm, 3 col md */}
        <div className="bg-surface-card rounded-2xl border border-surface-border p-4 sm:p-5">
          <h3 className="text-sm font-bold text-white mb-1">Top Donors Nationally</h3>
          <p className="text-[11px] text-gray-500 mb-4">Largest contributors to political campaigns.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {topDonors.map(({ donor, amount }, i) => (
              <div
                key={donor.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-DEFAULT border border-surface-border"
              >
                <span className="text-[11px] text-gray-600 shrink-0">#{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-white truncate">{donor.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full"
                      style={{ color: donorTypeColorHex(donor.type), backgroundColor: donorTypeColorHex(donor.type) + '22' }}
                    >
                      {donor.type}
                    </span>
                    <span className="text-[10px] font-mono text-accent-blue">{formatKES(amount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data sources */}
        <div className="bg-surface-card rounded-2xl border border-surface-border p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Database size={15} className="text-accent-blue" />
            <h3 className="text-sm font-bold text-white">Data Sources & Methodology</h3>
          </div>
          <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
            In a live deployment, PoliScope AI integrates these authoritative sources:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DATA_SOURCES.map((src) => (
              <div key={src.name} className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-DEFAULT border border-surface-border">
                <ShieldCheck size={12} className="text-accent-green mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold text-gray-300">{src.name}</p>
                  <p className="text-[10px] text-gray-600">{src.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-700 mt-3 italic">
            This prototype uses realistic mock data. Scores are generated by automated heuristics
            and do not constitute legal findings.
          </p>
        </div>

      </div>
    </div>
  );
}

function PublicStat({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-surface-card rounded-xl border border-surface-border p-3 sm:p-4 flex items-center gap-3">
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: color + '18', border: `1px solid ${color}33` }}>
        <Icon size={15} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-500 truncate">{label}</p>
        <p className="text-sm sm:text-base font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

const DATA_SOURCES = [
  { name: 'IEBC Campaign Disclosures', desc: 'Finance filings from the Independent Electoral and Boundaries Commission' },
  { name: 'Open Procurement Data',     desc: 'Kenya Open Data Initiative — government tender and contract awards' },
  { name: 'Company Registry',          desc: 'Business Registration Service — ownership & director information' },
  { name: 'Civic Datasets',            desc: 'TI-Kenya, Kenya ICT Authority open data portals' },
  { name: 'Investigative Reports',     desc: 'NMG, Nation, The Star — cross-referenced investigative journalism' },
  { name: 'Court & Ethics Records',    desc: 'Ethics and Anti-Corruption Commission (EACC) disclosures' },
];
