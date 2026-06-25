'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

// Spec-defined slice palette (cycled). Hex literals so Recharts doesn't have
// to resolve Tailwind tokens at runtime.
const SLICE_COLORS = [
  '#1b9cd8', // brand-500
  '#334e68', // navy-600
  '#7dd3fc', // brand-300
  '#627d98', // navy-400
  '#0369a1', // brand-700
  '#14304a', // navy-800
];

export type DonutDatum = { label: string; value: number };

export function DonutChart({ data }: { data: DonutDatum[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (data.length === 0 || total === 0) {
    return (
      <p className="py-6 text-center text-sm italic text-neutral-400">
        No data
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={1}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((d, i) => (
                <Cell
                  key={d.label}
                  fill={SLICE_COLORS[i % SLICE_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label — overlay, ignores pointer events so slice hover still works */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums text-navy-900">
            {total}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
            Total
          </span>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: SLICE_COLORS[i % SLICE_COLORS.length] }}
            />
            <span className="truncate text-neutral-700">{d.label}</span>
            <span className="ml-auto tabular-nums text-neutral-500">
              {d.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
