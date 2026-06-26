import { format } from 'date-fns';
import { getClientData } from '@/lib/data';

export const dynamic = 'force-dynamic';
import {
  awaitingCall,
  computeFunnel,
  computeKpis,
  itrAwaitingLodgement,
  onboardingPending,
  paymentOverdue,
  type ActionItem,
} from '@/lib/metrics';
import { ActionList } from '@/components/ActionList';
import { Card } from '@/components/Card';
import { ClientTable } from '@/components/ClientTable';
import { FunnelChart } from '@/components/FunnelChart';
import { KPICard } from '@/components/KPICard';

function toListItems(items: ActionItem[]) {
  return items.map(({ client, daysWaiting }) => ({
    name: client.clientName,
    daysWaiting,
    href: `/dashboard/clients/${client.srNo}`,
  }));
}

export default async function DashboardPage() {
  const { clients, fetchedAt } = await getClientData();
  const kpis = computeKpis(clients);
  const funnel = computeFunnel(clients);

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-[-0.015em] text-navy-900">
          ITR Pipeline
        </h1>
        <p className="flex flex-wrap items-baseline gap-x-3 text-sm text-neutral-500">
          <span>FY 2026 Individual Tax Returns</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
            Last fetched {format(fetchedAt, 'MMM d, yyyy · h:mm a')}
          </span>
        </p>
      </header>

      {/* KPI grid */}
      <section
        aria-label="Key metrics"
        className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
      >
        <KPICard label="Total Clients" value={kpis.totalClients} />
        <KPICard label="Campaigns Sent" value={kpis.campaignsSent} />
        <KPICard label="Replies" value={kpis.replies} />
        <KPICard label="Info Captured" value={kpis.formsSubmitted} />
        <KPICard label="Invoices Paid" value={kpis.invoicesPaid} />
        <KPICard label="Lodged" value={kpis.lodged} />
      </section>

      {/* Pipeline funnel */}
      <Card>
        <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
          Pipeline Overview
        </h2>
        <FunnelChart stages={funnel} />
      </Card>

      {/* Action required */}
      <Card>
        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
          Action Required
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
          <ActionList
            title="Awaiting Jimit's call"
            items={toListItems(awaitingCall(clients))}
          />
          <ActionList
            title="Payment overdue"
            items={toListItems(paymentOverdue(clients))}
          />
          <ActionList
            title="Onboarding form pending"
            items={toListItems(onboardingPending(clients))}
          />
          <ActionList
            title="ITR awaiting lodgement"
            items={toListItems(itrAwaitingLodgement(clients))}
          />
        </div>
      </Card>

      {/* Client table */}
      <section className="flex min-w-0 flex-col gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
          All Clients
        </h2>
        <ClientTable clients={clients} />
      </section>
    </div>
  );
}
