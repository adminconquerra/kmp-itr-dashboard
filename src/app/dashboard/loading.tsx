import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';

function KPISkeleton() {
  return (
    <Card>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-16" />
      </div>
    </Card>
  );
}

function FunnelSkeleton() {
  return (
    <Card>
      <Skeleton className="mb-5 h-3 w-32" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-3 w-24" />
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="flex gap-3 p-5">
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="flex flex-col">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex h-14 items-center gap-4 border-t border-neutral-100 px-4"
            >
              <Skeleton className="h-4 w-6" />
              <div className="flex flex-1 flex-col gap-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <KPISkeleton key={i} />
        ))}
      </section>

      <FunnelSkeleton />

      <TableSkeleton />
    </div>
  );
}
