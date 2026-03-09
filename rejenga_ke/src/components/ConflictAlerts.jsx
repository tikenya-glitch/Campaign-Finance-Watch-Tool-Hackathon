/**
 * ConflictAlerts.jsx
 * Displays conflict-of-interest cards with all content visible by default.
 * No accordion — explanation text, tags, and actions are always shown.
 */
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { formatKES } from '../utils/dataHelpers';

const RISK_COLORS = {
  high:   { text: '#ef4444', bg: '#ef44440a', border: '#ef444433' },
  medium: { text: '#f97316', bg: '#f973160a', border: '#f9731633' },
};

export default function ConflictAlerts({ conflicts, onSelectDonor, onSelectCandidate }) {
  if (!conflicts || conflicts.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 text-gray-600 text-xs text-center">
        No conflict-of-interest relationships detected in current dataset.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center gap-2 px-1">
        <ShieldAlert size={12} className="text-accent-red" />
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
          {conflicts.length} Potential Influence Risk{conflicts.length > 1 ? 's' : ''}
        </span>
      </div>

      {conflicts.map((c) => {
        const colors = RISK_COLORS[c.risk] ?? RISK_COLORS.medium;

        return (
          <div
            key={c.id}
            className="rounded-xl border flex flex-col gap-0 overflow-hidden"
            style={{ borderColor: colors.border, backgroundColor: colors.bg }}
          >
            {/* ── Card header ─────────────────────────────────────────── */}
            <div className="flex items-start gap-2.5 px-3 pt-3 pb-2">
              <AlertTriangle
                size={14}
                className="shrink-0 mt-0.5"
                style={{ color: colors.text }}
              />
              <div className="flex-1 min-w-0">
                {/* Donor name + risk badge */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[12px] font-semibold text-white leading-tight">
                    {c.donor.name}
                  </span>
                  <span
                    className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ color: colors.text, backgroundColor: colors.text + '22' }}
                  >
                    {c.risk}
                  </span>
                </div>

                {/* Candidate + role */}
                <p className="text-[11px] text-gray-400 leading-snug">
                  Donated to{' '}
                  <span className="text-gray-200 font-medium">{c.candidate.name}</span>
                  {' '}—{' '}
                  <span className="text-gray-500">
                    {c.candidate.position}, {c.candidate.county}
                  </span>
                </p>
              </div>
            </div>

            {/* ── Tags row ────────────────────────────────────────────── */}
            <div className="flex items-center gap-1.5 px-3 pb-2 flex-wrap">
              <span className="text-[10px] font-mono font-semibold text-gray-300">
                {formatKES(c.amount)}
              </span>
              {c.contractorFlag && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-red/15 text-accent-red font-medium">
                  Govt Contractor
                </span>
              )}
              {c.overlap.map((o) => (
                <span
                  key={o}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-surface-border text-gray-400"
                >
                  {o.replace(/_/g, ' ')}
                </span>
              ))}
            </div>

            {/* ── Explanation — always visible ─────────────────────────── */}
            <div
              className="mx-3 mb-3 p-2.5 rounded-lg border text-[11px] text-gray-400 leading-relaxed"
              style={{ borderColor: colors.border, backgroundColor: colors.text + '08' }}
            >
              {c.explanation}
            </div>

            {/* ── Action buttons ───────────────────────────────────────── */}
            <div className="flex gap-2 px-3 pb-3">
              <button
                onClick={() => onSelectDonor?.(c.donor)}
                className="flex-1 text-[10px] py-1.5 rounded-lg bg-surface-hover border border-surface-border text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
              >
                Donor profile
              </button>
              <button
                onClick={() => onSelectCandidate?.(c.candidate)}
                className="flex-1 text-[10px] py-1.5 rounded-lg bg-surface-hover border border-surface-border text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
              >
                Candidate risk
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
