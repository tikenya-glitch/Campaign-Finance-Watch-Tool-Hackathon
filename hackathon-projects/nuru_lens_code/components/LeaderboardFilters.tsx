'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  getTopCandidates,
  getCandidatesByCounty,
  getCandidatesByConstituency,
  getUniqueCounties,
  getUniqueConstituencies,
} from '../lib/mockData';
import type { Candidate } from '../lib/mockData';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const badgeIcons = {
  verified: <CheckCircle className="h-5 w-5 text-green-500" aria-hidden />,
  partial: <AlertCircle className="h-5 w-5 text-amber-500" aria-hidden />,
  none: <XCircle className="h-5 w-5 text-red-500" aria-hidden />,
};

type Scope = 'national' | 'county' | 'constituency';

function getFilteredCandidates(scope: Scope, county: string, constituency: string): Candidate[] {
  const base = getTopCandidates();
  if (scope === 'national') return base;
  if (scope === 'county' && county) return getCandidatesByCounty(county);
  if (scope === 'constituency' && constituency) return getCandidatesByConstituency(constituency);
  return base;
}

export default function LeaderboardFilters() {
  const [scope, setScope] = useState<Scope>('national');
  const [county, setCounty] = useState('');
  const [constituency, setConstituency] = useState('');

  const counties = getUniqueCounties();
  const constituencies = getUniqueConstituencies();
  const candidates = getFilteredCandidates(scope, county, constituency);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Filter by</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label htmlFor="scope" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Scope
            </label>
            <select
              id="scope"
              value={scope}
              onChange={(e) => {
                setScope(e.target.value as Scope);
                setCounty('');
                setConstituency('');
              }}
              className="block w-full min-w-[180px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="national">National (all)</option>
              <option value="county">County</option>
              <option value="constituency">Constituency</option>
            </select>
          </div>
          {scope === 'county' && (
            <div>
              <label htmlFor="county" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                County
              </label>
              <select
                id="county"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="block w-full min-w-[180px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select county</option>
                {counties.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
          {scope === 'constituency' && (
            <div>
              <label htmlFor="constituency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Constituency
              </label>
              <select
                id="constituency"
                value={constituency}
                onChange={(e) => setConstituency(e.target.value)}
                className="block w-full min-w-[200px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select constituency</option>
                {constituencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Showing {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {candidates.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No candidates match the selected filter. Try another scope or area.
          </div>
        ) : (
          candidates.map((candidate, index) => (
            <Link
              key={candidate.id}
              href={`/candidate/${candidate.id}`}
              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
            >
              <div className="flex items-center gap-4">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300"
                  aria-hidden
                >
                  #{index + 1}
                </span>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{candidate.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {candidate.party} · {candidate.constituency}, {candidate.county}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Score: {candidate.transparencyScore}%
                </span>
                <span className="sr-only">{candidate.badge}</span>
                {badgeIcons[candidate.badge]}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
