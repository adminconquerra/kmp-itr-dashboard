import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Folder, FileText, User, Receipt } from 'lucide-react';
import type { Client } from '@/lib/types';
import { getClientData } from '@/lib/data';
import { formatCurrency, formatDate, isCompleted, parseDate } from '@/lib/utils';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { Timeline, type TimelineEvent } from '@/components/Timeline';

export const dynamic = 'force-dynamic';

type EventDef = {
  field: keyof Client;
  label: string;
  description?: (c: Client) => string | undefined;
};

const EVENT_DEFS: EventDef[] = [
  { field: 'campaignSent', label: 'Campaign sent' },
  { field: 'replied', label: 'Client replied' },
  { field: 'autoReplySent', label: 'Auto reply sent' },
  { field: 'formSubmitted', label: 'Client info captured by Jimit' },
  {
    field: 'invoiceCreated',
    label: 'Invoice created',
    description: (c) =>
      c.invoiceAmount !== null ? formatCurrency(c.invoiceAmount) : undefined,
  },
  { field: 'fu1Sent', label: 'Follow-up 1 sent' },
  { field: 'fu2Sent', label: 'Follow-up 2 sent' },
  { field: 'fu3Sent', label: 'Follow-up 3 sent' },
  { field: 'paymentReceived', label: 'Payment received' },
  { field: 'onboardingFormSent', label: 'Onboarding form sent to client' },
  {
    field: 'onboardingFormSubmitted',
    label: 'Client completed onboarding form',
  },
];

function buildEvents(c: Client): TimelineEvent[] {
  const events: Array<TimelineEvent & { defIndex: number }> = [];
  EVENT_DEFS.forEach((def, defIndex) => {
    const value = c[def.field];
    if (typeof value !== 'string') return;
    const date = parseDate(value);
    if (!date) return;
    events.push({
      date,
      label: def.label,
      description: def.description?.(c),
      defIndex,
    });
  });
  events.sort((a, b) => {
    const diff = a.date.getTime() - b.date.getTime();
    return diff !== 0 ? diff : a.defIndex - b.defIndex;
  });
  return events.map(({ date, label, description }) => ({
    date,
    label,
    description,
  }));
}

function followUpDisplay(value: string | null): string {
  if (!value) return 'Not sent';
  if (value === 'no') return 'Skipped';
  return formatDate(value);
}

function paymentDisplay(value: string | null): string {
  if (isCompleted(value)) return `Paid ${formatDate(value)}`;
  return 'Outstanding';
}

type DetailRowProps = { label: string; children: React.ReactNode };

function DetailRow({ label, children }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
        {label}
      </dt>
      <dd className="text-right text-sm text-neutral-800">{children}</dd>
    </div>
  );
}

function ExternalLinkRow({
  url,
  label,
  icon,
}: {
  url: string | null | undefined;
  label: string;
  icon: React.ReactNode;
}) {
  if (!url) {
    return (
      <div className="flex h-9 items-center gap-2 rounded-md border border-dashed border-neutral-200 px-3 text-sm text-neutral-400">
        {icon}
        <span>{label} (not available)</span>
      </div>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
    >
      {icon}
      <span>{label}</span>
      <ExternalLink size={12} strokeWidth={1.5} className="ml-auto text-neutral-400" />
    </a>
  );
}

function xeroContactUrl(id: string): string | null {
  return id ? `https://go.xero.com/Contacts/View/${id}` : null;
}

function xeroInvoiceUrl(id: string): string | null {
  return id ? `https://go.xero.com/AccountsReceivable/View.aspx?InvoiceID=${id}` : null;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
      {children}
    </h2>
  );
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const srNo = Number(id);
  if (!Number.isInteger(srNo)) notFound();

  const { clients } = await getClientData();
  const client = clients.find((c) => c.srNo === srNo);
  if (!client) notFound();

  const events = buildEvents(client);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 self-start text-[13px] font-medium text-brand-600 hover:underline"
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Back to dashboard
      </Link>

      {/* Header card */}
      <Card className="p-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-start">
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-[-0.015em] text-navy-900">
              {client.clientName}
            </h1>
            <div className="break-all text-sm text-neutral-600">{client.email}</div>
            <div className="text-sm text-neutral-600">{client.mobile}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
                Reference
              </span>
              <span className="text-sm text-neutral-800">
                {client.reference || '—'}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
              Sr. No. {client.srNo}
            </span>
            <StatusBadge
              status={client.status}
              size="sm"
              className="md:px-4 md:py-2 md:text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Timeline + details split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <Card>
          <SectionLabel>Timeline</SectionLabel>
          <Timeline events={events} />
        </Card>

        <div className="flex flex-col gap-6">
          {/* Invoice */}
          <Card>
            <SectionLabel>Invoice</SectionLabel>
            <dl className="flex flex-col divide-y divide-neutral-100">
              <DetailRow label="Created">
                {formatDate(client.invoiceCreated)}
              </DetailRow>
              <DetailRow label="Amount">
                <span className="tabular-nums">
                  {formatCurrency(client.invoiceAmount)}
                </span>
              </DetailRow>
              <DetailRow label="Follow-up 1">
                {followUpDisplay(client.fu1Sent)}
              </DetailRow>
              <DetailRow label="Follow-up 2">
                {followUpDisplay(client.fu2Sent)}
              </DetailRow>
              <DetailRow label="Follow-up 3">
                {followUpDisplay(client.fu3Sent)}
              </DetailRow>
              <DetailRow label="Payment">
                {paymentDisplay(client.paymentReceived)}
              </DetailRow>
            </dl>
            <div className="mt-4">
              <ExternalLinkRow
                url={xeroInvoiceUrl(client.invoiceId)}
                label="Open invoice in Xero"
                icon={<Receipt size={14} strokeWidth={1.5} />}
              />
            </div>
          </Card>

          {/* Income & Reference */}
          <Card>
            <SectionLabel>Income & Reference</SectionLabel>
            <dl className="flex flex-col divide-y divide-neutral-100">
              <DetailRow label="Income source">
                {client.incomeSource || '—'}
              </DetailRow>
              <DetailRow label="Reference">
                {client.reference || '—'}
              </DetailRow>
            </dl>
            <div className="mt-4">
              <ExternalLinkRow
                url={xeroContactUrl(client.contactId)}
                label="Open contact in Xero"
                icon={<User size={14} strokeWidth={1.5} />}
              />
            </div>
          </Card>

          {/* Notes — only if present */}
          {client.notes && (
            <Card>
              <SectionLabel>Notes</SectionLabel>
              <p className="text-sm leading-6 text-neutral-700">
                {client.notes}
              </p>
            </Card>
          )}

          {/* OneDrive */}
          <Card>
            <SectionLabel>OneDrive</SectionLabel>
            <div className="flex flex-col gap-2">
              <ExternalLinkRow
                url={client.oneDriveFolderUrl}
                label="Open folder"
                icon={<Folder size={14} strokeWidth={1.5} />}
              />
              <ExternalLinkRow
                url={client.oneDriveFileUrl}
                label="Open file"
                icon={<FileText size={14} strokeWidth={1.5} />}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
