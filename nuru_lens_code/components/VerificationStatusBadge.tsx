type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'requires_review' | 'incomplete';
import { Clock, CheckCircle, XCircle, AlertCircle, FileQuestion } from 'lucide-react';

const statusConfig: Record<
  VerificationStatus,
  { label: string; icon: typeof Clock; className: string }
> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300',
  },
  verified: {
    label: 'Verified',
    icon: CheckCircle,
    className: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300',
  },
  requires_review: {
    label: 'Requires Review',
    icon: AlertCircle,
    className: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300',
  },
  incomplete: {
    label: 'Incomplete',
    icon: FileQuestion,
    className: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
  },
};

interface VerificationStatusBadgeProps {
  status: VerificationStatus | string;
  className?: string;
}

export default function VerificationStatusBadge({ status, className = '' }: VerificationStatusBadgeProps) {
  const config = statusConfig[status as VerificationStatus] ?? statusConfig.pending;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {config.label}
    </span>
  );
}
