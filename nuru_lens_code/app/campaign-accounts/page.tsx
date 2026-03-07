'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CampaignAccountSummary from '../../components/CampaignAccountSummary';
import VerificationStatusBadge from '../../components/VerificationStatusBadge';
import { maskAccountNumber } from '@/lib/maskAccountNumber';
import type { CampaignAccount } from '@/lib/db';

export default function CampaignAccountsRegistryPage() {
  const [accounts, setAccounts] = useState<CampaignAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/campaign-account')
      .then((res) => res.ok ? res.json() : [])
      .then(setAccounts)
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Campaign accounts registry
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
          All submitted campaign financial accounts. Oversight users can review and verify submissions.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading…</p>
      ) : accounts.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">No campaign accounts submitted yet.</p>
          <Link
            href="/submit-campaign-account"
            className="mt-4 inline-block text-green-600 dark:text-green-400 font-medium hover:underline"
          >
            Submit the first campaign account →
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {accounts.map((account) => (
            <li key={account.id}>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{account.candidate_name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {account.political_party} · {account.constituency}, {account.county}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {account.bank_name} · {maskAccountNumber(account.account_number)}
                    </p>
                  </div>
                  <VerificationStatusBadge status={account.verification_status} />
                </div>
                <div className="px-4 sm:px-6 pb-4 flex gap-4">
                  <Link
                    href={`/campaign-accounts/${account.id}`}
                    className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
