import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Shimmer placeholder. Style it with className (e.g. h-24 w-full) — the
 * pulse animation and neutral fill come from here.
 */
export function Skeleton({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-neutral-100', className)}
      {...rest}
    />
  );
}
