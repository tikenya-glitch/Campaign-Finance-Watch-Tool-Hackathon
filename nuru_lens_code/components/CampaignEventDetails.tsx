'use client';

import { EVENT_TYPE_CONFIG } from '@/lib/campaignPulseTypes';
import type { EventType } from '@/lib/campaignPulseTypes';

interface Report {
  id: number;
  event_type: EventType;
  description: string | null;
  evidence_url: string | null;
  created_at: string;
}

interface CampaignEventDetailsProps {
  eventType: EventType;
  reportCount: number;
  confidenceScore: number;
  lastUpdated: string;
  reports?: Report[];
}

export default function CampaignEventDetails({
  eventType,
  reportCount,
  confidenceScore,
  lastUpdated,
  reports = [],
}: CampaignEventDetailsProps) {
  const config = EVENT_TYPE_CONFIG[eventType];
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>{config.icon}</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{config.label}</h3>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Reports</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{reportCount}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Confidence</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{confidenceScore}%</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500 dark:text-gray-400">Last updated</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{lastUpdated}</p>
          </div>
        </div>
      </div>
      {reports.length > 0 && (
        <div className="p-5 divide-y divide-gray-100 dark:divide-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Reports</h4>
          {reports.map((r) => (
            <div key={r.id} className="py-3 first:pt-0">
              {r.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{r.description}</p>
              )}
              {r.evidence_url && (
                <a
                  href={r.evidence_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 dark:text-green-400 hover:underline mt-1 inline-block"
                >
                  View evidence
                </a>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{r.created_at}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
