import Link from 'next/link';
import { getTopCandidates } from '../lib/mockData';
import { CheckCircle, AlertCircle, XCircle, ArrowRight } from 'lucide-react';

const badgeIcons = {
  verified: <CheckCircle className="h-5 w-5 text-green-500" aria-hidden />,
  partial: <AlertCircle className="h-5 w-5 text-amber-500" aria-hidden />,
  none: <XCircle className="h-5 w-5 text-red-500" aria-hidden />,
};

export default function Leaderboard() {
  const topCandidates = getTopCandidates().slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Transparency Leaderboard</h2>
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors"
        >
          View full leaderboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {topCandidates.map((candidate, index) => (
          <Link
            key={candidate.id}
            href={`/candidate/${candidate.id}`}
            className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300">
                #{index + 1}
              </span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{candidate.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {candidate.party} · {candidate.constituency}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{candidate.transparencyScore}%</span>
              {badgeIcons[candidate.badge]}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}