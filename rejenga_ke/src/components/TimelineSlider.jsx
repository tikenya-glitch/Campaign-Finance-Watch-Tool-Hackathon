/**
 * TimelineSlider.jsx
 * Horizontal slider that maps integer steps to concrete date strings.
 * Marks:  2025-01-01 | 2026-01-01 | 2026-07-01 | 2027-01-01 | 2027-04-01
 */
import { useMemo } from 'react';

const MILESTONES = [
  { date: '2025-01-01', label: 'Early 2025' },
  { date: '2025-07-01', label: 'Mid 2025' },
  { date: '2026-01-01', label: 'Early 2026' },
  { date: '2026-07-01', label: 'Mid 2026' },
  { date: '2027-01-01', label: 'Early 2027' },
  { date: '2027-04-01', label: 'Election 2027' },
];

export default function TimelineSlider({ value, onChange }) {
  const currentIndex = useMemo(
    () => MILESTONES.findIndex((m) => m.date === value),
    [value]
  );

  const handleChange = (e) => {
    const idx = parseInt(e.target.value, 10);
    onChange(MILESTONES[idx].date);
  };

  const currentLabel = MILESTONES[currentIndex]?.label ?? '';

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Timeline</span>
        <span className="text-[11px] font-semibold text-accent-blue">{currentLabel}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={0}
          max={MILESTONES.length - 1}
          value={currentIndex === -1 ? MILESTONES.length - 1 : currentIndex}
          onChange={handleChange}
          className="w-full h-1.5 appearance-none rounded-full cursor-pointer timeline-slider"
          style={{
            background: `linear-gradient(to right, #4f8ef7 0%, #4f8ef7 ${
              ((currentIndex === -1 ? MILESTONES.length - 1 : currentIndex) /
                (MILESTONES.length - 1)) *
              100
            }%, #2a2d3e ${
              ((currentIndex === -1 ? MILESTONES.length - 1 : currentIndex) /
                (MILESTONES.length - 1)) *
              100
            }%, #2a2d3e 100%)`,
          }}
        />
        {/* Tick labels */}
        <div className="flex justify-between mt-1">
          {MILESTONES.map((m) => (
            <span
              key={m.date}
              className={`text-[9px] ${
                m.date === value ? 'text-accent-blue font-semibold' : 'text-gray-600'
              }`}
            >
              {m.label.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
