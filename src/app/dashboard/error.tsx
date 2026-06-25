'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[dashboard]', error);
  }, [error]);

  return (
    <div className="flex justify-center py-16">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-white p-8 text-center">
        <AlertCircle size={32} strokeWidth={1.5} className="text-danger-500" />
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] font-semibold leading-7 text-navy-900">
            Unable to load data
          </h2>
          <p className="text-sm leading-6 text-neutral-600">
            There was a problem fetching the latest information. This is
            usually temporary.
          </p>
          {error.digest && (
            <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.06em] text-neutral-400">
              Error ID {error.digest}
            </p>
          )}
        </div>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
