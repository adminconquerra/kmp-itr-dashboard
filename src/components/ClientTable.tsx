'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import type { Client } from '@/lib/types';
import { Button } from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { cn, daysSince, formatCurrency } from '@/lib/utils';

type SortField =
  | 'srNo'
  | 'clientName'
  | 'status'
  | 'daysSinceCampaign'
  | 'invoiceAmount';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 25;

const INPUT_CLASS =
  'h-9 rounded-md border border-neutral-300 bg-white text-sm text-neutral-700 ' +
  'placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none ' +
  'focus:ring-2 focus:ring-brand-500/30';

export function ClientTable({ clients }: { clients: Client[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [refFilter, setRefFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('srNo');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);

  const allStatuses = useMemo(
    () => Array.from(new Set(clients.map((c) => c.status))).sort(),
    [clients],
  );
  const allRefs = useMemo(
    () =>
      Array.from(new Set(clients.map((c) => c.reference).filter(Boolean))).sort(),
    [clients],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c) => {
      if (
        q &&
        !c.clientName.toLowerCase().includes(q) &&
        !c.email.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (statusFilter && c.status !== statusFilter) return false;
      if (refFilter && c.reference !== refFilter) return false;
      return true;
    });
  }, [clients, search, statusFilter, refFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = getSortValue(a, sortField);
      const bv = getSortValue(b, sortField);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, sorted.length);
  const pageRows = sorted.slice(start, end);

  const isFiltered =
    search !== '' || statusFilter !== '' || refFilter !== '';

  function toggleSort(field: SortField) {
    if (field === sortField) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  }

  function clearFilters() {
    setSearch('');
    setStatusFilter('');
    setRefFilter('');
    setPage(1);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {/* Filters */}
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-[40%] sm:flex-1">
          <Search
            size={16}
            strokeWidth={1.5}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email"
            className={cn(INPUT_CLASS, 'w-full pl-9 pr-3')}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className={cn(INPUT_CLASS, 'w-full px-3 sm:w-auto')}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {allStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={refFilter}
          onChange={(e) => {
            setRefFilter(e.target.value);
            setPage(1);
          }}
          className={cn(INPUT_CLASS, 'w-full px-3 sm:w-auto')}
          aria-label="Filter by reference source"
        >
          <option value="">All references</option>
          {allRefs.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-neutral-50">
            <tr className="border-b border-neutral-200">
              <ColumnHeader
                label="Sr. No."
                field="srNo"
                align="left"
                sortField={sortField}
                sortDir={sortDir}
                onSort={toggleSort}
              />
              <ColumnHeader
                label="Client"
                field="clientName"
                align="left"
                sortField={sortField}
                sortDir={sortDir}
                onSort={toggleSort}
              />
              <ColumnHeader
                label="Status"
                field="status"
                align="left"
                sortField={sortField}
                sortDir={sortDir}
                onSort={toggleSort}
              />
              <ColumnHeader
                label="Days Since Campaign"
                field="daysSinceCampaign"
                align="right"
                sortField={sortField}
                sortDir={sortDir}
                onSort={toggleSort}
              />
              <ColumnHeader
                label="Invoice"
                field="invoiceAmount"
                align="right"
                sortField={sortField}
                sortDir={sortDir}
                onSort={toggleSort}
              />
              <th className="h-10 px-4 text-right">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-neutral-500"
                >
                  {isFiltered ? (
                    <div className="flex flex-col items-center gap-3">
                      <span>No clients match your filters</span>
                      <Button variant="ghost" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    </div>
                  ) : (
                    <span>No clients</span>
                  )}
                </td>
              </tr>
            ) : (
              pageRows.map((c) => {
                const days = daysSince(c.campaignSent);
                return (
                  <tr
                    key={c.srNo}
                    className="h-14 border-b border-neutral-100 transition-colors hover:bg-neutral-50"
                  >
                    <td className="px-4 text-sm tabular-nums text-neutral-700">
                      {c.srNo}
                    </td>
                    <td className="px-4">
                      <div className="text-sm text-neutral-800">
                        {c.clientName}
                      </div>
                      <div className="text-xs text-neutral-500">{c.email}</div>
                    </td>
                    <td className="px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 text-right text-sm tabular-nums text-neutral-700">
                      {days === null ? '—' : days}
                    </td>
                    <td className="px-4 text-right text-sm tabular-nums text-neutral-700">
                      {formatCurrency(c.invoiceAmount)}
                    </td>
                    <td className="px-4 text-right">
                      <Link
                        href={`/dashboard/clients/${c.srNo}`}
                        className="text-xs font-medium text-brand-600 hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination — stacks on mobile so narrow viewports don't squish the controls */}
      {sorted.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-neutral-200 bg-neutral-50 px-4 py-3 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:py-0">
          <span className="text-[13px] tabular-nums text-neutral-500">
            Showing {start + 1}–{end} of {sorted.length}
          </span>
          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <Button
              variant="secondary"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm tabular-nums text-neutral-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function getSortValue(c: Client, field: SortField): number | string {
  switch (field) {
    case 'srNo':
      return c.srNo;
    case 'clientName':
      return c.clientName.toLowerCase();
    case 'status':
      return c.status;
    case 'daysSinceCampaign':
      return daysSince(c.campaignSent) ?? Number.NEGATIVE_INFINITY;
    case 'invoiceAmount':
      return c.invoiceAmount ?? Number.NEGATIVE_INFINITY;
  }
}

function ColumnHeader({
  label,
  field,
  align,
  sortField,
  sortDir,
  onSort,
}: {
  label: string;
  field: SortField;
  align: 'left' | 'right';
  sortField: SortField;
  sortDir: SortDir;
  onSort: (f: SortField) => void;
}) {
  const active = sortField === field;
  return (
    <th
      className={cn(
        'h-10 px-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500',
        align === 'right' && 'text-right',
      )}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn(
          'inline-flex items-center gap-1 transition-colors hover:text-neutral-700',
          align === 'right' && 'flex-row-reverse',
          active && 'text-neutral-700',
        )}
      >
        <span>{label}</span>
        {/* Always rendered (invisible when inactive) so labels don't jiggle on sort */}
        <span
          className={cn(
            'inline-flex w-3.5 justify-center text-brand-500',
            !active && 'invisible',
          )}
          aria-hidden
        >
          {sortDir === 'asc' ? (
            <ChevronUp size={14} strokeWidth={1.5} />
          ) : (
            <ChevronDown size={14} strokeWidth={1.5} />
          )}
        </span>
      </button>
    </th>
  );
}
