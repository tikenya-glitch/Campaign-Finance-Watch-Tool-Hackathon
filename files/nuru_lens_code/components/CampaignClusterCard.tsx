'use client';

import { EVENT_TYPE_CONFIG } from '@/lib/campaignPulseTypes';
import type { EventType } from '@/lib/campaignPulseTypes';

interface Props {
  clusterId: string;
  eventType: EventType;
  reportCount: number;
  confidenceScore: number;
  lastUpdated: string;
  onSelect?: () => void;
}

export default function CampaignClusterCard(props: Props) {
  const { eventType, reportCount, confidenceScore, lastUpdated, onSelect } = props;
  const cfg = EVENT_TYPE_CONFIG[eventType];
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:border-green-300 dark:hover:border-green-600 transition-colors"
    >
      <span className="text-lg">{cfg.icon}</span>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-1">{cfg.label}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">Reports: {reportCount} | Confidence: {confidenceScore}%</p>
      <p className="text-xs text-gray-500 mt-1">{lastUpdated}</p>
      {onSelect && <span className="text-green-600 dark:text-green-400 text-sm">View</span>}
    </button>
  );
}
