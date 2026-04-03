import VerificationStatusBadge from './VerificationStatusBadge';
import { maskAccountNumber } from '@/lib/maskAccountNumber';

interface CampaignAccountSummaryProps {
  account: {
    candidate_name: string;
    political_party: string;
    position_running_for?: string | null;
    constituency: string;
    county: string;
    bank_name: string;
    account_number: string;
    account_holder: string;
    campaign_start_date?: string | null;
    campaign_end_date?: string | null;
    ad_campaigns?: string | null;
    billboards?: string | null;
    convoys?: string | null;
    merchandise?: string | null;
    verification_status: string;
    submitted_at: string;
    verified_at?: string | null;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  maskAccount?: boolean;
}

export default function CampaignAccountSummary({ account, maskAccount = true }: CampaignAccountSummaryProps) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{account.candidate_name}</h3>
          <p className="text-gray-600 dark:text-gray-400">{account.political_party}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {account.constituency}, {account.county}
          </p>
        </div>
        <VerificationStatusBadge status={account.verification_status} />
      </div>
      <dl className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-gray-500 dark:text-gray-400">Position</dt>
          <dd className="font-medium text-gray-900 dark:text-gray-100">{account.position_running_for || '—'}</dd>
        </div>
        <div>
          <dt className="text-gray-500 dark:text-gray-400">Bank</dt>
          <dd className="font-medium text-gray-900 dark:text-gray-100">{account.bank_name}</dd>
        </div>
        <div>
          <dt className="text-gray-500 dark:text-gray-400">Account number</dt>
          <dd className="font-medium text-gray-900 dark:text-gray-100 font-mono">
            {maskAccount ? maskAccountNumber(account.account_number) : account.account_number}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500 dark:text-gray-400">Account holder</dt>
          <dd className="font-medium text-gray-900 dark:text-gray-100">{account.account_holder}</dd>
        </div>
        <div>
          <dt className="text-gray-500 dark:text-gray-400">Campaign period</dt>
          <dd className="font-medium text-gray-900 dark:text-gray-100">
            {account.campaign_start_date && account.campaign_end_date
              ? `${account.campaign_start_date} – ${account.campaign_end_date}`
              : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500 dark:text-gray-400">Submitted</dt>
          <dd className="font-medium text-gray-900 dark:text-gray-100">
            {new Date(account.submitted_at).toLocaleDateString()}
          </dd>
        </div>
        {(account.ad_campaigns || account.billboards || account.convoys || account.merchandise) && (
          <>
            {account.ad_campaigns && (
              <div className="sm:col-span-2">
                <dt className="text-gray-500 dark:text-gray-400">Ad campaigns (reported)</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">{account.ad_campaigns}</dd>
              </div>
            )}
            {account.billboards && (
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Billboards (reported)</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">{account.billboards}</dd>
              </div>
            )}
            {account.convoys && (
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Convoys (reported)</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">{account.convoys}</dd>
              </div>
            )}
            {account.merchandise && (
              <div className="sm:col-span-2">
                <dt className="text-gray-500 dark:text-gray-400">Merchandise (reported)</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">{account.merchandise}</dd>
              </div>
            )}
          </>
        )}
      </dl>
    </div>
  );
}
