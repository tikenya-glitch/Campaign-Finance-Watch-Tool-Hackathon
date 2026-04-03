/**
 * MapTooltip.jsx
 * Floating tooltip rendered over the map canvas.
 * Positioned via fixed coordinates passed from deck.gl hover events.
 */
import { AlertTriangle } from 'lucide-react';
import { partyColorHex, donorTypeColorHex } from '../utils/dataHelpers';

export default function MapTooltip({ tooltip }) {
  if (!tooltip) return null;

  const { x, y, type, data } = tooltip;

  // Clamp so tooltip stays within viewport
  const style = {
    position: 'fixed',
    left: x + 16,
    top: y + 16,
    pointerEvents: 'none',
    zIndex: 1000,
    maxWidth: 240,
    // Flip to left side if too close to right edge
    transform: x > window.innerWidth - 280 ? 'translateX(calc(-100% - 32px))' : undefined,
  };

  return (
    <div style={style} className="bg-surface-card/95 backdrop-blur border border-surface-border rounded-xl shadow-xl p-3">
      {type === 'arc' && <ArcTooltip data={data} />}
      {type === 'donor' && <DonorTooltip data={data} />}
      {type === 'candidate' && <CandidateTooltip data={data} />}
    </div>
  );
}

function ArcTooltip({ data }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Donation Flow</span>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{
            color: donorTypeColorHex(data.donorType),
            backgroundColor: donorTypeColorHex(data.donorType) + '22',
          }}
        >
          {data.donorType}
        </span>
      </div>
      <div className="h-px bg-surface-border" />
      <Row label="Donor" value={data.donor} />
      <Row label="Candidate" value={data.candidate} />
      <Row label="Party" value={data.party} color={partyColorHex(data.party)} />
      <Row label="County" value={data.county} />
      <Row label="Amount" value={data.amount} highlight />
      <Row label="Date" value={data.date} />
    </div>
  );
}

function DonorTooltip({ data }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-white">{data.name}</span>
        {data.suspicious && <AlertTriangle size={12} className="text-accent-red shrink-0" />}
      </div>
      <div className="h-px bg-surface-border" />
      <Row label="Type" value={data.type} color={donorTypeColorHex(data.type)} />
      <Row label="County" value={data.county} />
      <Row label="Total Donated" value={data.total} highlight />
      {data.suspicious && (
        <div className="mt-1 p-2 rounded-lg bg-accent-red/10 border border-accent-red/20">
          <p className="text-[10px] text-accent-red font-semibold mb-1">Influence Risk Flags:</p>
          {data.flagReasons.map((r, i) => (
            <p key={i} className="text-[10px] text-gray-400">• {r}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function CandidateTooltip({ data }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-white">{data.name}</span>
      <div className="h-px bg-surface-border" />
      <Row label="Party" value={data.party} color={partyColorHex(data.party)} />
      <Row label="Position" value={data.position} />
      <Row label="County" value={data.county} />
    </div>
  );
}

function Row({ label, value, color, highlight }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[10px] text-gray-500 shrink-0">{label}</span>
      <span
        className={`text-[11px] font-medium truncate ${highlight ? 'text-accent-blue font-semibold' : 'text-gray-200'}`}
        style={color ? { color } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
