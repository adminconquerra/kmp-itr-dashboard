import { getClientData } from '@/lib/data';
import { ClientTable } from '@/components/ClientTable';

export default async function ClientsPage() {
  const { clients } = await getClientData();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-[-0.015em] text-navy-900">
          Clients
        </h1>
        <p className="text-sm text-neutral-500">
          {clients.length} {clients.length === 1 ? 'client' : 'clients'} in the
          pipeline
        </p>
      </header>
      <ClientTable clients={clients} />
    </div>
  );
}
