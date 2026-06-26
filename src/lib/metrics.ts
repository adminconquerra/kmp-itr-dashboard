import type { Client } from './types';
import { daysSince, isCompleted } from './utils';

/* ------------------------------------------------------------------ */
/* KPI counts                                                          */
/* ------------------------------------------------------------------ */

export type Kpis = {
  totalClients: number;
  campaignsSent: number;
  replies: number;
  formsSubmitted: number;
  invoicesPaid: number;
  lodged: number;
};

export function computeKpis(clients: Client[]): Kpis {
  return {
    totalClients: clients.length,
    campaignsSent: clients.filter((c) => isCompleted(c.campaignSent)).length,
    replies: clients.filter((c) => isCompleted(c.replied)).length,
    formsSubmitted: clients.filter((c) => isCompleted(c.formSubmitted)).length,
    invoicesPaid: clients.filter((c) => isCompleted(c.paymentReceived)).length,
    lodged: clients.filter((c) => isCompleted(c.lodged)).length,
  };
}

/* ------------------------------------------------------------------ */
/* Funnel                                                              */
/* ------------------------------------------------------------------ */

export type FunnelStage = { label: string; count: number };

export function computeFunnel(clients: Client[]): FunnelStage[] {
  return [
    { label: 'Total Clients', count: clients.length },
    {
      label: 'Campaigns Sent',
      count: clients.filter((c) => isCompleted(c.campaignSent)).length,
    },
    {
      label: 'Replies',
      count: clients.filter((c) => isCompleted(c.replied)).length,
    },
    {
      label: 'Info Captured',
      count: clients.filter((c) => isCompleted(c.formSubmitted)).length,
    },
    {
      label: 'Invoices Sent',
      count: clients.filter((c) => isCompleted(c.invoiceCreated)).length,
    },
    {
      label: 'Paid',
      count: clients.filter((c) => isCompleted(c.paymentReceived)).length,
    },
    {
      label: 'Onboarding Form Submitted',
      count: clients.filter((c) => isCompleted(c.onboardingFormSubmitted))
        .length,
    },
    {
      label: 'ITR In Progress',
      // Only currently-in-progress: lodged clients drop out of this count
      // and only appear in the Lodged stage below.
      count: clients.filter(
        (c) => isCompleted(c.itrInProgress) && !isCompleted(c.lodged),
      ).length,
    },
    {
      label: 'Lodged',
      count: clients.filter((c) => isCompleted(c.lodged)).length,
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Action lists                                                        */
/* ------------------------------------------------------------------ */

export type ActionItem = { client: Client; daysWaiting: number };

/**
 * Replied but no form submitted yet — Jimit needs to make the call.
 * Sorted longest-waiting first.
 */
export function awaitingCall(clients: Client[]): ActionItem[] {
  return clients
    .filter((c) => isCompleted(c.replied) && !isCompleted(c.formSubmitted))
    .map((c) => ({ client: c, daysWaiting: daysSince(c.replied) ?? 0 }))
    .sort((a, b) => b.daysWaiting - a.daysWaiting);
}

/**
 * Invoice raised more than 9 days ago and payment still outstanding
 * (paymentReceived is "no" or null — anything that isn't a real date).
 */
export function paymentOverdue(clients: Client[]): ActionItem[] {
  return clients
    .filter(
      (c) =>
        isCompleted(c.invoiceCreated) &&
        !isCompleted(c.paymentReceived) &&
        (daysSince(c.invoiceCreated) ?? 0) > 9,
    )
    .map((c) => ({ client: c, daysWaiting: daysSince(c.invoiceCreated) ?? 0 }))
    .sort((a, b) => b.daysWaiting - a.daysWaiting);
}

/**
 * Paid but onboarding form not submitted yet. Measured from paymentReceived.
 */
export function onboardingPending(clients: Client[]): ActionItem[] {
  return clients
    .filter(
      (c) =>
        isCompleted(c.paymentReceived) &&
        !isCompleted(c.onboardingFormSubmitted),
    )
    .map((c) => ({
      client: c,
      daysWaiting: daysSince(c.paymentReceived) ?? 0,
    }))
    .sort((a, b) => b.daysWaiting - a.daysWaiting);
}

/**
 * Onboarding form completed, ITR being worked on, but not lodged yet.
 * Measured from itrInProgress so the longest-waiting return surfaces first.
 */
export function itrAwaitingLodgement(clients: Client[]): ActionItem[] {
  return clients
    .filter((c) => isCompleted(c.itrInProgress) && !isCompleted(c.lodged))
    .map((c) => ({
      client: c,
      daysWaiting: daysSince(c.itrInProgress) ?? 0,
    }))
    .sort((a, b) => b.daysWaiting - a.daysWaiting);
}

/* ------------------------------------------------------------------ */
/* Reference-source breakdown                                          */
/* ------------------------------------------------------------------ */

export type ReferenceRow = {
  reference: string;
  total: number;
  paid: number;
  /** Paid / total, in the range 0–1. UI multiplies by 100 for display. */
  conversion: number;
};

export function referenceBreakdown(clients: Client[]): ReferenceRow[] {
  const groups = new Map<string, { total: number; paid: number }>();

  for (const c of clients) {
    const key = c.reference || 'Unknown';
    const bucket = groups.get(key) ?? { total: 0, paid: 0 };
    bucket.total += 1;
    if (isCompleted(c.paymentReceived)) bucket.paid += 1;
    groups.set(key, bucket);
  }

  return Array.from(groups, ([reference, { total, paid }]) => ({
    reference,
    total,
    paid,
    conversion: total === 0 ? 0 : paid / total,
  })).sort((a, b) => b.total - a.total);
}
