'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import CampaignAccountSummary from '../../../components/CampaignAccountSummary';
import type { CampaignAccount } from '@/lib/db';

export default function CampaignAccountDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [account, setAccount] = useState<(CampaignAccount & { documents?: unknown[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/campaign-account/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setAccount)
      .catch(() => setAccount(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleVerify(status: 'verified' | 'rejected' | 'requires_review') {
    if (!id) return;
    setVerifying(true);
    try {
      const res = await fetch(`/api/campaign-account/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verification_status: status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAccount(updated);
      }
    } finally {
      setVerifying(false);
    }
  }

  if (loading) return <p className="p-8 text-gray-600 dark:text-gray-400">Loading…</p>;
  if (!account) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-600 dark:text-gray-400">Account not found.</p>
        <Link href="/campaign-accounts" className="mt-4 inline-block text-green-600 dark:text-green-400 hover:underline">
          ← Back to registry
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/campaign-accounts"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-6 font-medium"
      >
        ← Back to registry
      </Link>
      <CampaignAccountSummary account={account} maskAccount />
      {account.verification_status === 'pending' || account.verification_status === 'requires_review' ? (
        <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Verification</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={verifying}
              onClick={() => handleVerify('verified')}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              Mark verified
            </button>
            <button
              type="button"
              disabled={verifying}
              onClick={() => handleVerify('requires_review')}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
            >
              Requires review
            </button>
            <button
              type="button"
              disabled={verifying}
              onClick={() => handleVerify('rejected')}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      ) : null}
      {account.documents && (account.documents as unknown[]).length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Documents</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            {(account.documents as { id: number; file_name: string; document_type: string }[]).map((d) => (
              <li key={d.id}>
                {d.file_name} ({d.document_type.replace(/_/g, ' ')})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
