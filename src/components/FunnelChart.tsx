export type FunnelStage = { label: string; count: number };

/**
 * Horizontal-bar funnel. Each stage stacks: label + counts on the top line,
 * the bar full-width below. Stacking instead of side-by-side avoids label
 * truncation on long stage names and reads cleanly at any viewport width.
 *
 * The first stage's count is the 100% reference — every subsequent bar is a
 * fraction of that total. The right-hand percentage is a different number:
 * stage count / previous stage count (how many flowed through from above).
 */
export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  if (stages.length === 0) return null;
  const total = stages[0].count;

  return (
    <div className="flex flex-col gap-4">
      {stages.map((stage, i) => {
        const widthPct = total === 0 ? 0 : (stage.count / total) * 100;
        const prev = i === 0 ? null : stages[i - 1].count;
        const prevPct =
          prev && prev > 0 ? Math.round((stage.count / prev) * 100) : null;

        return (
          <div key={stage.label} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-neutral-700">
                {stage.label}
              </span>
              <div className="flex shrink-0 gap-2 text-sm tabular-nums">
                <span className="text-neutral-700">{stage.count}</span>
                {prevPct !== null && (
                  <span className="text-neutral-400">{prevPct}%</span>
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
