'use client';

import { useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

type DocumentType = 'bank_statement' | 'donation_report' | 'campaign_finance_declaration' | 'other';

interface DocumentUploaderProps {
  campaignAccountId: number;
  onUploadComplete?: () => void;
}

export default function DocumentUploader({ campaignAccountId, onUploadComplete }: DocumentUploaderProps) {
  const [documentType, setDocumentType] = useState<DocumentType>('bank_statement');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    setError(null);
    setSuccess(false);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType);
      const res = await fetch(`/api/campaign-account/${campaignAccountId}/document`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Upload failed');
      }
      setSuccess(true);
      setFile(null);
      onUploadComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Upload supporting documents
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        PDF, CSV, Excel, or images (bank statements, donation reports, campaign finance declarations)
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="document_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Document type
          </label>
          <select
            id="document_type"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as DocumentType)}
            className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="bank_statement">Bank statement</option>
            <option value="donation_report">Donation report</option>
            <option value="campaign_finance_declaration">Campaign finance declaration</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            File
          </label>
          <input
            id="file"
            type="file"
            accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setError(null);
            }}
            className="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-green-50 dark:file:bg-green-900/30 file:px-4 file:py-2 file:text-sm file:font-medium file:text-green-700 dark:file:text-green-300 hover:file:bg-green-100 dark:hover:file:bg-green-900/50"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {file.name}
            </p>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-600 dark:text-green-400">Document uploaded successfully.</p>
        )}
        <button
          type="submit"
          disabled={!file || uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload
            </>
          )}
        </button>
      </form>
    </div>
  );
}
