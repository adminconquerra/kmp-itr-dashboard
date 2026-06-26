import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  'Not Started': 'bg-neutral-100 text-neutral-700',
  'Campaign Sent': 'bg-neutral-100 text-neutral-700',
  'Replied - Awaiting Call': 'bg-info-50 text-info-700',
  'Form Submitted': 'bg-info-50 text-info-700',
  'Invoice Sent': 'bg-warning-50 text-warning-700',
  'Follow Up 1 Sent': 'bg-warning-50 text-warning-700',
  'Follow Up 2 Sent': 'bg-warning-50 text-warning-700',
  'Follow Up 3 Sent': 'bg-danger-50 text-danger-700',
  'Lost - Manual Review': 'bg-danger-50 text-danger-700',
  'Onboarding Form Sent': 'bg-success-50 text-success-700',
  'Onboarding Form Submitted': 'bg-success-50 text-success-700',
  'ITR In Progress': 'bg-info-50 text-info-700',
  Lodged: 'bg-success-50 text-success-700',
};

const FALLBACK = 'bg-neutral-100 text-neutral-700';

type Size = 'sm' | 'lg';

const SIZE_STYLES: Record<Size, string> = {
  sm: 'px-2.5 py-1 text-xs',   // spec default — table cells, lists
  lg: 'px-4 py-2 text-sm',     // spec detail-page header
};

export function StatusBadge({
  status,
  size = 'sm',
  className,
}: {
  status: string;
  size?: Size;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium whitespace-nowrap',
        SIZE_STYLES[size],
        STATUS_STYLES[status] ?? FALLBACK,
        className,
      )}
    >
      {status}
    </span>
  );
}
