import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export type TimelineEvent = {
  date: Date;
  label: string;
  description?: string;
};

/**
 * Vertical timeline. Each row is a three-column grid: date / marker / content.
 * The marker column stacks a top line + dot + bottom line per row; the top
 * line is suppressed on the first event and the bottom line on the last, so
 * the line visually runs continuously through the middle.
 */
export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="py-6 text-center text-sm italic text-neutral-400">
        No events yet
      </p>
    );
  }

  return (
    <ol className="flex flex-col">
      {events.map((event, i) => {
        const isFirst = i === 0;
        const isLast = i === events.length - 1;
        return (
          <li
            key={i}
            className="grid grid-cols-[80px_16px_1fr] gap-3"
          >
            <time className="pt-0.5 text-xs tabular-nums text-neutral-500">
              {format(event.date, 'MMM d, yyyy')}
            </time>
            <div className="flex flex-col items-center">
              {/* Top half of line — hidden for the very first event */}
              <div
                className={cn(
                  'h-2 w-px',
                  isFirst ? 'bg-transparent' : 'bg-neutral-200',
                )}
              />
              {/* Dot */}
              <span
                aria-hidden
                className="h-3 w-3 shrink-0 rounded-full bg-brand-500"
              />
              {/* Bottom half — flex-1 fills the row, which now includes pb-6
                  on the content cell, so this line meets the next row's top
                  line edge-to-edge instead of leaving a 24px gap. */}
              <div
                className={cn(
                  'w-px flex-1',
                  isLast ? 'bg-transparent' : 'bg-neutral-200',
                )}
              />
            </div>
            <div className={cn(!isLast && 'pb-6')}>
              <div className="text-sm font-semibold text-neutral-800">
                {event.label}
              </div>
              {event.description && (
                <div className="text-[13px] text-neutral-500">
                  {event.description}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
