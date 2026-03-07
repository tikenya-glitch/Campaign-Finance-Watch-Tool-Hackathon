'use client';

import { useState } from 'react';
import CampaignAccountForm from '../../components/CampaignAccountForm';
import DocumentUploader from '../../components/DocumentUploader';
import CampaignAccountSummary from '../../components/CampaignAccountSummary';
import { CheckCircle } from 'lucide-react';

export default function SubmitCampaignAccountPage() {
  const [accountId, setAccountId] = useState<number | null>(null);
  const [account, setAccount] = useState<{
    id: number;
    candidate_name: string;
    political_party: string;
    position_running_for: string | null;
    constituency: string;
    county: string;
    bank_name: string;
    account_number: string;
    account_holder: string;
    campaign_start_date: string | null;
    campaign_end_date: string | null;
    verification_status: string;
    submitted_at: string;
  } | null>(null);

  async function handleSuccess(id: number) {
    setAccountId(id);
    const res = await fetch(`/api/campaign-account/${id}`);
    if (res.ok) {
      const data = await res.json();
      setAccount(data);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Register campaign account
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
          Submit your official campaign financial account to NuruLens. Once verified, this becomes the source of truth for campaign finance monitoring.
        </p>
      </div>

      {!accountId ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Campaign financial source details
          </h2>
          <CampaignAccountForm onSuccess={handleSuccess} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300">Account submitted</h3>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Your campaign account has been registered. You can now upload supporting documents below.
              </p>
            </div>
          </div>

          {account && (
            <CampaignAccountSummary account={account} maskAccount />
          )}

          <DocumentUploader campaignAccountId={accountId} />
        </div>
      )}
    </div>
  );
}
