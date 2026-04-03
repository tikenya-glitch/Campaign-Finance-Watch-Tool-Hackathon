'use client';

import { EVENT_TYPE_CONFIG } from '@/lib/campaignPulseTypes';
import type { EventType } from '@/lib/campaignPulseTypes';

interface Props {
  summary: Record<EventType, number>;
  title?: string;
}

export default function CampaignActivitySummary({ summary, title = 'Campaign Activity (Last 24 Hours)' }: Props) {
  const entries = (Object.entries(summary) as [EventType, number][]).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]);
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {entries.length === 0 ? (
          <p className="col-span-full text-sm text-gray-500">No activity reported yet.</p>
        ) : (
          entries.map(([type, count]) => {
            const cfg = EVENT_TYPE_CONFIG[type];
            return (
              <div key={type} className="rounded-lg border p-3 bg-gray-50 dark:bg-gray-800/50">
                <span>{cfg.icon}</span>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-gray-600">{cfg.label}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
