'use client';

import { useState } from 'react';
import Link from 'next/link';
import { runComplianceChecks } from '../../lib/complianceEngine';
import {
  AlertTriangle,
  TrendingUp,
  Users,
  FileWarning,
  ShieldAlert,
  Play,
  Radio,
  Bot,
  UserCheck,
  Loader2,
} from 'lucide-react';

const alertTypeConfig = {
  overspending: {
    label: 'Overspending',
    icon: TrendingUp,
    className: 'bg-red-50 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
  },
  donation_spike: {
    label: 'Donation spike',
    icon: AlertTriangle,
    className: 'bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  clustered_donations: {
    label: 'Clustered donations',
    icon: Users,
    className: 'bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  missing_disclosure: {
    label: 'Missing disclosure',
    icon: FileWarning,
    className: 'bg-orange-50 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  },
} as const;

const severityConfig = {
  high: { label: 'High', className: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300' },
  medium: { label: 'Medium', className: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' },
  low: { label: 'Low', className: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300' },
} as const;

export default function WatchdogPage() {
  const [gathering, setGathering] = useState(false);
  const [lastLaunched, setLastLaunched] = useState<Date | null>(null);

  const alerts = runComplianceChecks();

  async function handleLaunchWatchdog() {
    setGathering(true);
    // Simulate gathering from crowd + AI (2–3 seconds)
    await new Promise((r) => setTimeout(r, 2500));
    setLastLaunched(new Date());
    setGathering(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Watchdog</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
          Self-gathering intelligence on campaign finance and public activities. Crowdsourced reports, AI analysis, and compliance monitoring.
        </p>
      </div>

      {/* Launch Watchdog */}
      <div className="mb-10 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Launch Watchdog
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-xl">
              Gathers information from public sources, crowd reports, and AI analysis (coming soon). Runs compliance checks and cross-references candidate disclosures with findings.
            </p>
            {lastLaunched && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                Last run: {lastLaunched.toLocaleString()}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleLaunchWatchdog}
            disabled={gathering}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            {gathering ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                Gathering intelligence…
              </>
            ) : (
              <>
                <Play className="h-5 w-5" aria-hidden />
                Launch Watchdog
              </>
            )}
          </button>
        </div>
        {gathering && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-6 text-sm">
            <span className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Radio className="h-4 w-4 text-green-500" aria-hidden />
              Scanning public sources
            </span>
            <span className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <UserCheck className="h-4 w-4 text-green-500" aria-hidden />
              Checking crowd reports
            </span>
            <span className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-500">
              <Bot className="h-4 w-4" aria-hidden />
              AI analysis (coming soon)
            </span>
          </div>
        )}
      </div>

      {/* Findings */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Findings
        </h2>
        {alerts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <ShieldAlert className="h-12 w-12 text-green-500 mx-auto mb-4" aria-hidden />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No alerts at this time</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Financial irregularities and compliance issues will appear here. Launch the Watchdog to refresh findings from public sources and crowd reports.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {alerts.length} alert{alerts.length !== 1 ? 's' : ''} — sorted by severity, then date
            </p>
            <ul className="space-y-3">
              {alerts.map((alert) => {
                const typeConf = alertTypeConfig[alert.alertType];
                const sevConf = severityConfig[alert.severity];
                const TypeIcon = typeConf.icon;
                return (
                  <li key={alert.id}>
                    <Link
                      href={`/candidate/${alert.candidateId}`}
                      className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${typeConf.className}`}
                            >
                              <TypeIcon className="h-3.5 w-3.5" />
                              {typeConf.label}
                            </span>
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${sevConf.className}`}
                            >
                              {sevConf.label}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{alert.candidateName}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{alert.message}</p>
                          <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">{alert.createdAt}</p>
                        </div>
                        <span className="text-green-600 dark:text-green-400 font-medium text-sm shrink-0">
                          View profile →
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
