import Link from 'next/link';
import { cn } from '@/lib/utils';

export type ActionListItem = {
  name: string;
  daysWaiting: number;
  href: string;
};

type ActionListProps = {
  title: string;
  items: ActionListItem[];
  /** Optional. If set and items > 5, shows "View all (N)" at the bottom. */
  viewAllHref?: string;
};

const MAX_VISIBLE = 5;

function formatDays(n: number): string {
  return n === 1 ? '1 day' : `${n} days`;
}

export function ActionList({ title, items, viewAllHref }: ActionListProps) {
  const visible = items.slice(0, MAX_VISIBLE);
  const hiddenCount = items.length - visible.length;

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-[13px] font-semibold uppercase tracking-[0.05em] text-neutral-500">
        {title}
      </h3>

      {visible.length === 0 ? (
        <p className="py-6 text-center text-sm italic text-neutral-400">
          All caught up
        </p>
      ) : (
        <ul className="flex flex-col">
          {visible.map((item, i) => (
            <li
              key={item.href}
              className={cn(
                i < visible.length - 1 && 'border-b border-neutral-100',
              )}
            >
              <Link
                href={item.href}
                className="flex h-12 items-center justify-between rounded-md px-2 transition-colors hover:bg-neutral-50"
              >
                <span className="truncate text-sm font-medium text-neutral-800">
                  {item.name}
                </span>
                <span className="shrink-0 pl-3 text-xs tabular-nums text-neutral-500">
                  {formatDays(item.daysWaiting)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {hiddenCount > 0 &&
        (viewAllHref ? (
          <Link
            href={viewAllHref}
            className="self-start pt-1 text-xs font-medium text-brand-600 hover:underline"
          >
            View all ({items.length})
          </Link>
        ) : (
          <p className="self-start pt-1 text-xs text-neutral-400">
            +{hiddenCount} more
          </p>
        ))}
    </section>
  );
}
