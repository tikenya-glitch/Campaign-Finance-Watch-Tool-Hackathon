import Link from 'next/link';
import { mockCandidates } from '../../lib/mockData';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const badgeIcons = {
  verified: <CheckCircle className="h-5 w-5 text-green-500" />,
  partial: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  none: <XCircle className="h-5 w-5 text-red-500" />,
};

export default function CandidatesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Candidate Profiles</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
          Browse transparency and finance data for each candidate. View funds raised, spending, limits, and compliance status.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCandidates.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-green-100 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{candidate.name}</h2>
              {badgeIcons[candidate.badge]}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{candidate.party}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{candidate.constituency}, {candidate.county}</p>
            <div className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Funds Raised:</span>
                <span className="font-medium">KES {candidate.fundsRaised.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Funds Spent:</span>
                <span className="font-medium">KES {candidate.fundsSpent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Limit:</span>
                <span className="font-medium text-gray-600 dark:text-gray-300">KES {candidate.spendingLimit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Compliance:</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    candidate.complianceStatus === 'compliant'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                  }`}
                >
                  {candidate.complianceStatus === 'compliant' ? 'Compliant' : 'Violation'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Transparency Score:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{candidate.transparencyScore}%</span>
              </div>
            </div>
            <Link
              href={`/candidate/${candidate.id}`}
              className="inline-flex items-center justify-center w-full bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}