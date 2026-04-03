'use client';

import { useState } from 'react';
import { EVENT_TYPE_CONFIG } from '@/lib/campaignPulseTypes';
import type { EventType } from '@/lib/campaignPulseTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const KENYA_CENTER = { lat: -1.2921, lng: 36.8219 };

export default function CampaignReportForm({ open, onClose, onSuccess }: Props) {
  const [eventType, setEventType] = useState<EventType>('rally');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/campaign-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          latitude: KENYA_CENTER.lat + (Math.random() - 0.5) * 0.05,
          longitude: KENYA_CENTER.lng + (Math.random() - 0.5) * 0.05,
          description: description || undefined,
          device_hash: 'browser_' + Date.now(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit');
      }
      setDescription('');
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/50" aria-label="Close" />
      <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Report Campaign Activity</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">What did you observe?</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, { label: string }][]).map(([type, cfg]) => (
                <label
                  key={type}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                    eventType === type
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="event_type"
                    value={type}
                    checked={eventType === type}
                    onChange={() => setEventType(type)}
                    className="sr-only"
                  />
                  <span>{cfg.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Short description (optional)
            </label>
            <textarea
              id="desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
              placeholder="What happened?"
            />
          </div>
          <p className="text-xs text-gray-500">Location and timestamp are captured automatically.</p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
