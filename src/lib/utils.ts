import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';

/**
 * Merge Tailwind class names. clsx handles conditional truthiness;
 * twMerge dedupes conflicting utilities (e.g. `p-4 p-6` -> `p-6`).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Source fields can be:
 *   - YYYY-MM-DD date string  -> completed
 *   - "no"                    -> explicitly not done
 *   - null / "" / undefined   -> not yet done
 * Returns true only for a real, parseable date.
 */
export function isCompleted(field: string | null | undefined): boolean {
  return parseDate(field) !== null;
}

/**
 * Parse a YYYY-MM-DD field. Returns null for null, "no", empty,
 * or anything that doesn't parse to a valid Date.
 */
export function parseDate(field: string | null | undefined): Date | null {
  if (!field || field === 'no') return null;
  const d = parseISO(field);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Whole calendar days between the given date and today.
 * Returns null if the field isn't a parseable date.
 */
export function daysSince(field: string | null | undefined): number | null {
  const d = parseDate(field);
  if (!d) return null;
  return differenceInCalendarDays(new Date(), d);
}

/** "Jun 19, 2026" — or "—" when the field is null / "no" / unparseable. */
export function formatDate(field: string | null | undefined): string {
  const d = parseDate(field);
  return d ? format(d, 'MMM d, yyyy') : '—';
}

const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  currencyDisplay: 'narrowSymbol',
  maximumFractionDigits: 0,
});

/** "$1,250" (AUD, no cents) — or "—" when null. */
export function formatCurrency(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  return currencyFormatter.format(n);
}
