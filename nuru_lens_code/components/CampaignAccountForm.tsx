'use client';

import { useState } from 'react';

interface FormData {
  candidate_name: string;
  political_party: string;
  position_running_for: string;
  constituency: string;
  county: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  campaign_start_date: string;
  campaign_end_date: string;
  ad_campaigns: string;
  billboards: string;
  convoys: string;
  merchandise: string;
}

interface CampaignAccountFormProps {
  onSuccess: (accountId: number) => void;
}

export default function CampaignAccountForm({ onSuccess }: CampaignAccountFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    candidate_name: '',
    political_party: '',
    position_running_for: '',
    constituency: '',
    county: '',
    bank_name: '',
    account_number: '',
    account_holder: '',
    campaign_start_date: '',
    campaign_end_date: '',
    ad_campaigns: '',
    billboards: '',
    convoys: '',
    merchandise: '',
  });

  function update(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/campaign-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          position_running_for: formData.position_running_for || undefined,
          campaign_start_date: formData.campaign_start_date || undefined,
          campaign_end_date: formData.campaign_end_date || undefined,
          ad_campaigns: formData.ad_campaigns || undefined,
          billboards: formData.billboards || undefined,
          convoys: formData.convoys || undefined,
          merchandise: formData.merchandise || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Submission failed');
      }
      const account = await res.json();
      onSuccess(account.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="candidate_name" className={labelClass}>
            Candidate / Party Name *
          </label>
          <input
            id="candidate_name"
            type="text"
            required
            value={formData.candidate_name}
            onChange={(e) => update('candidate_name', e.target.value)}
            className={inputClass}
            placeholder="e.g. John Doe"
          />
        </div>
        <div>
          <label htmlFor="political_party" className={labelClass}>
            Political Party *
          </label>
          <input
            id="political_party"
            type="text"
            required
            value={formData.political_party}
            onChange={(e) => update('political_party', e.target.value)}
            className={inputClass}
            placeholder="e.g. Progressive Party"
          />
        </div>
        <div>
          <label htmlFor="position_running_for" className={labelClass}>
            Position running for
          </label>
          <input
            id="position_running_for"
            type="text"
            value={formData.position_running_for}
            onChange={(e) => update('position_running_for', e.target.value)}
            className={inputClass}
            placeholder="e.g. MP, Governor"
          />
        </div>
        <div>
          <label htmlFor="constituency" className={labelClass}>
            Constituency *
          </label>
          <input
            id="constituency"
            type="text"
            required
            value={formData.constituency}
            onChange={(e) => update('constituency', e.target.value)}
            className={inputClass}
            placeholder="e.g. Westlands"
          />
        </div>
        <div>
          <label htmlFor="county" className={labelClass}>
            County *
          </label>
          <input
            id="county"
            type="text"
            required
            value={formData.county}
            onChange={(e) => update('county', e.target.value)}
            className={inputClass}
            placeholder="e.g. Nairobi"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Campaign bank account
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="bank_name" className={labelClass}>
              Bank name *
            </label>
            <input
              id="bank_name"
              type="text"
              required
              value={formData.bank_name}
              onChange={(e) => update('bank_name', e.target.value)}
              className={inputClass}
              placeholder="e.g. Equity Bank"
            />
          </div>
          <div>
            <label htmlFor="account_number" className={labelClass}>
              Account number *
            </label>
            <input
              id="account_number"
              type="text"
              required
              value={formData.account_number}
              onChange={(e) => update('account_number', e.target.value)}
              className={inputClass}
              placeholder="Account number"
            />
          </div>
          <div>
            <label htmlFor="account_holder" className={labelClass}>
              Account holder name *
            </label>
            <input
              id="account_holder"
              type="text"
              required
              value={formData.account_holder}
              onChange={(e) => update('account_holder', e.target.value)}
              className={inputClass}
              placeholder="Name on the account"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Public campaign activities (voluntary disclosure)
        </h4>
        <p className="text-xs text-amber-600 dark:text-amber-400 mb-4">
          Report ad campaigns (Twitter, etc.), billboards, vehicle convoys, and merchandise. Voluntary. Discrepancies with watchdog findings may affect your transparency score.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="ad_campaigns" className={labelClass}>
              Ad campaigns (Twitter, Facebook, etc.)
            </label>
            <textarea
              id="ad_campaigns"
              rows={2}
              value={formData.ad_campaigns}
              onChange={(e) => update('ad_campaigns', e.target.value)}
              className={inputClass}
              placeholder="e.g. Twitter ads since Jan 2026, Facebook spend KES 50,000"
            />
          </div>
          <div>
            <label htmlFor="billboards" className={labelClass}>
              Billboards
            </label>
            <input
              id="billboards"
              type="text"
              value={formData.billboards}
              onChange={(e) => update('billboards', e.target.value)}
              className={inputClass}
              placeholder="e.g. 5 locations in Nairobi, 2 in Mombasa"
            />
          </div>
          <div>
            <label htmlFor="convoys" className={labelClass}>
              Vehicle convoys
            </label>
            <input
              id="convoys"
              type="text"
              value={formData.convoys}
              onChange={(e) => update('convoys', e.target.value)}
              className={inputClass}
              placeholder="e.g. 3 convoy events in Feb 2026"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="merchandise" className={labelClass}>
              Merchandise
            </label>
            <textarea
              id="merchandise"
              rows={2}
              value={formData.merchandise}
              onChange={(e) => update('merchandise', e.target.value)}
              className={inputClass}
              placeholder="e.g. T-shirts, caps, branded materials"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Campaign period
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="campaign_start_date" className={labelClass}>
              Campaign start date
            </label>
            <input
              id="campaign_start_date"
              type="date"
              value={formData.campaign_start_date}
              onChange={(e) => update('campaign_start_date', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="campaign_end_date" className={labelClass}>
              Campaign end date
            </label>
            <input
              id="campaign_end_date"
              type="date"
              value={formData.campaign_end_date}
              onChange={(e) => update('campaign_end_date', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full md:w-auto rounded-lg bg-green-600 px-6 py-3 text-base font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit campaign account'}
      </button>
    </form>
  );
}
