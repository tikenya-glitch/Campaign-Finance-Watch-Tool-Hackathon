/**
 * AlertsModal.jsx
 * Full-screen modal listing all suspicious donor flags with risk severity.
 */
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { formatKES, donorTypeColorHex } from '../utils/dataHelpers';

export default function AlertsModal({ suspiciousFlags, onClose, onSelectDonor }) {
  const flags = Object.values(suspiciousFlags).sort((a, b) =>
    a.riskLevel === 'high' ? -1 : 1
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface-card border border-surface-border rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <ShieldAlert size={20} className="text-accent-red" />
            <div>
              <h2 className="text-sm font-bold text-white">Suspicious Influence Alerts</h2>
              <p className="text-[11px] text-gray-500">{flags.length} donors flagged for review</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-300 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Alert list */}
        <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-3">
          {flags.map(({ donor, reasons, totalAmount, candidateCount, riskLevel }) => (
            <button
              key={donor.id}
              onClick={() => { onSelectDonor(donor); onClose(); }}
              className="w-full text-left p-4 rounded-xl border bg-surface-DEFAULT hover:bg-surface-hover transition-colors"
              style={{
                borderColor: riskLevel === 'high' ? '#ef444444' : '#f9731644',
                backgroundColor: riskLevel === 'high' ? '#ef44440a' : '#f973160a',
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <AlertTriangle
                    size={14}
                    className={riskLevel === 'high' ? 'text-accent-red shrink-0' : 'text-accent-orange shrink-0'}
                  />
                  <span className="text-sm font-semibold text-white truncate">{donor.name}</span>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <RiskBadge level={riskLevel} />
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      color: donorTypeColorHex(donor.type),
                      backgroundColor: donorTypeColorHex(donor.type) + '22',
                    }}
                  >
                    {donor.type}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mb-2">
                <Stat label="Total" value={formatKES(totalAmount)} />
                <Stat label="Candidates" value={candidateCount} />
                <Stat label="County" value={donor.county} />
              </div>

              <div className="flex flex-col gap-1">
                {reasons.map((r, i) => (
                  <p key={i} className="text-[11px] text-gray-400 flex items-start gap-1.5">
                    <span className={riskLevel === 'high' ? 'text-accent-red' : 'text-accent-orange'}>
                      ⚠
                    </span>
                    {r}
                  </p>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RiskBadge({ level }) {
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
        level === 'high'
          ? 'text-accent-red bg-accent-red/20 border border-accent-red/40'
          : 'text-accent-orange bg-accent-orange/20 border border-accent-orange/40'
      }`}
    >
      {level} risk
    </span>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-[9px] text-gray-600">{label}</p>
      <p className="text-[11px] font-semibold text-gray-300">{value}</p>
    </div>
  );
}
