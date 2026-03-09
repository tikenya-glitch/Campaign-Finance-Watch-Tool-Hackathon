import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockCandidates } from '../../../lib/mockData';
import { CheckCircle, AlertCircle, XCircle, ArrowLeft } from 'lucide-react';

const badgeConfig = {
  verified: { icon: CheckCircle, label: 'Verified', className: 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/40' },
  partial: { icon: AlertCircle, label: 'Partial disclosure', className: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/40' },
  none: { icon: XCircle, label: 'No verification', className: 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/40' },
} as const;

export default async function CandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const candidate = mockCandidates.find((c) => c.id === id);
  if (!candidate) notFound();

  const BadgeIcon = badgeConfig[candidate.badge].icon;
  const badgeLabel = badgeConfig[candidate.badge].label;
  const badgeClassName = badgeConfig[candidate.badge].className;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/candidates"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to candidates
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
              <p className="text-gray-600 mt-1">{candidate.party}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {candidate.constituency}, {candidate.county}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${badgeClassName}`}
            >
              <BadgeIcon className="h-4 w-4" />
              {badgeLabel}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Finance summary</h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Funds raised</dt>
                  <dd className="font-semibold text-gray-900 dark:text-gray-100">KES {candidate.fundsRaised.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
<dt className="text-gray-600 dark:text-gray-400">Funds spent</dt>
                <dd className="font-semibold text-gray-900 dark:text-gray-100">KES {candidate.fundsSpent.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Spending limit</dt>
                <dd className="font-semibold text-gray-900 dark:text-gray-100">KES {candidate.spendingLimit.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-gray-600 dark:text-gray-400">Compliance</dt>
                  <dd>
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-sm font-medium ${
                        candidate.complianceStatus === 'compliant'
                          ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                          : candidate.complianceStatus === 'violation'
                            ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                            : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {candidate.complianceStatus === 'compliant'
                        ? 'Compliant'
                        : candidate.complianceStatus === 'violation'
                          ? 'Violation'
                          : 'Pending'}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Transparency score</dt>
                  <dd className="font-semibold text-gray-900 dark:text-gray-100">{candidate.transparencyScore}%</dd>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <dt>Last updated</dt>
                  <dd>{candidate.lastUpdated}</dd>
                </div>
              </dl>
            </section>
            <section>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Funding breakdown</h2>
              <ul className="space-y-2">
                {candidate.fundingBreakdown.map((item) => (
                  <li key={item.source} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{item.source}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      KES {item.amount.toLocaleString()} ({item.percent}%)
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
