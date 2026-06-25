import type { Client } from './types';
import { mockClients } from './mock-data';

export type ClientData = {
  clients: Client[];
  fetchedAt: Date;
};

export async function getClientData(): Promise<ClientData> {
  if (process.env.USE_MOCK_DATA === 'true') {
    return { clients: mockClients, fetchedAt: new Date() };
  }

  const url = process.env.DATA_API_URL;
  const apiKey = process.env.DATA_API_KEY;

  if (!url || !apiKey) {
    throw new Error(
      'DATA_API_URL or DATA_API_KEY is not set. Set USE_MOCK_DATA=true to use mock data.',
    );
  }

  const response = await fetch(url, {
    headers: { 'x-api-key': apiKey },
    cache: 'no-store',
    // Fail fast if the n8n webhook is unreachable or slow; otherwise the
    // server function holds the page open until Vercel's gateway 504s.
    signal: AbortSignal.timeout(15_000),
  }).catch((err: unknown) => {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      throw new Error('Data API timed out after 15s');
    }
    throw err;
  });

  if (!response.ok) {
    throw new Error(`Data API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as {
    clients?: Client[];
    fetchedAt?: string;
  };

  if (!Array.isArray(data.clients)) {
    throw new Error('Data API response missing "clients" array');
  }

  return {
    clients: data.clients,
    fetchedAt: data.fetchedAt ? new Date(data.fetchedAt) : new Date(),
  };
}
