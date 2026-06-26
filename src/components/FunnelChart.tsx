export type FunnelStage = { label: string; count: number };

/**
 * Horizontal-bar funnel. Each stage stacks: label + counts on the top line,
 * the bar full-width below. Stacking instead of side-by-side avoids label
 * truncation on long stage names and reads cleanly at any viewport width.
 *
 * The first stage's count is the 100% reference — every subsequent bar is a
 * fraction of that total, and the right-hand label reads `count of total`
 * so the proportion is always legible without depending on stage-to-stage
 * conversion math (which breaks for "currently in progress" buckets that
 * shrink as work advances).
 */
export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  if (stages.length === 0) return null;
  const total = stages[0].count;

  return (
    <div className="flex flex-col gap-4">
      {stages.map((stage, i) => {
        const widthPct = total === 0 ? 0 : (stage.count / total) * 100;
        const isFirst = i === 0;

        return (
          <div key={stage.label} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-neutral-700">
                {stage.label}
              </span>
              <div className="flex shrink-0 gap-1.5 text-sm tabular-nums">
                <span className="text-neutral-700">{stage.count}</span>
                {!isFirst && (
                  <span className="text-neutral-400">of {total}</span>
                )}
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <div
                aria-hidden
                className="h-full rounded-full bg-brand-500 transition-[width]"
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
