import { Card } from '@/components/Card';
import { cn } from '@/lib/utils';

type Direction = 'up' | 'down' | 'neutral';

const TREND_COLORS: Record<Direction, string> = {
  up: 'text-success-700',
  down: 'text-danger-700',
  neutral: 'text-neutral-500',
};

const TREND_ARROWS: Record<Direction, string> = {
  up: '↑',
  down: '↓',
  neutral: '·',
};

export type KPICardProps = {
  label: string;
  value: number | string;
  trend?: { label: string; direction?: Direction };
};

/**
 * Spec structure (top to bottom):
 *   1. Micro caps label   (11px / 600 / 0.06em / uppercase / neutral-500)
 *   2. Hero number        (36px / 600 / -0.025em / navy-900 / tabular-nums)
 *   3. Optional trend     (12px / success-700 | danger-700 | neutral-500)
 *
 * Hover: border darkens to neutral-300 (no lift, no shadow — per spec).
 */
export function KPICard({ label, value, trend }: KPICardProps) {
  const direction = trend?.direction ?? 'neutral';
  return (
    <Card className="transition-colors hover:border-neutral-300">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
          {label}
        </span>
        <span className="text-[36px] font-semibold leading-[40px] tracking-[-0.025em] text-navy-900 tabular-nums">
          {value}
        </span>
        {trend && (
          <span className={cn('text-xs tabular-nums', TREND_COLORS[direction])}>
            {TREND_ARROWS[direction]} {trend.label}
          </span>
        )}
      </div>
    </Card>
  );
}
