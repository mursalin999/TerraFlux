import { Info } from "lucide-react";

export interface FindingDay {
  date: string;
  modis: number;
  viirs: number;
}

interface FindingsPanelProps {
  days: FindingDay[];
  agreementRate: number | null;
  sampleCells: number;
  onSelectDay?: (date: string) => void;
  compact?: boolean;
}

function Formula({ children }: { children: string }) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label="How is this calculated?"
        className="rounded p-1 text-text-secondary hover:text-text"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 hidden w-64 rounded border border-border bg-surface-elevated p-2 text-[11px] normal-case leading-relaxed text-text shadow-xl group-hover:block group-focus-within:block"
      >
        {children}
      </span>
    </span>
  );
}

export function FindingsPanel({
  days,
  agreementRate,
  sampleCells,
  onSelectDay,
  compact = false,
}: FindingsPanelProps) {
  const modis = days.reduce((sum, day) => sum + day.modis, 0);
  const viirs = days.reduce((sum, day) => sum + day.viirs, 0);
  const ratio = modis > 0 ? viirs / modis : null;
  const largestGap = days.reduce<FindingDay | null>((best, day) => {
    if (!best || Math.abs(day.viirs - day.modis) > Math.abs(best.viirs - best.modis)) return day;
    return best;
  }, null);
  const peak = days.reduce<FindingDay | null>((best, day) => {
    if (!best || day.modis + day.viirs > best.modis + best.viirs) return day;
    return best;
  }, null);
  const monthCounts = new Map<string, number>();
  for (const day of days)
    monthCounts.set(
      day.date.slice(0, 7),
      (monthCounts.get(day.date.slice(0, 7)) ?? 0) + day.modis + day.viirs,
    );
  const busiestMonth = [...monthCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const firstDate = days[0]?.date ?? null;
  const lastDate = days[days.length - 1]?.date ?? null;

  return (
    <section
      className={`rounded-lg border border-border bg-surface ${compact ? "p-3" : "p-5"}`}
      aria-labelledby="key-findings-title"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
        <h2
          id="key-findings-title"
          className="font-mono text-xs font-semibold uppercase tracking-wider text-text"
        >
          KEY FINDINGS
        </h2>
        <span className="font-mono text-[11px] text-text-secondary">
          {sampleCells.toLocaleString()} grid cells
        </span>
      </div>
      <div
        className={`mt-4 grid gap-3 ${compact ? "grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}
      >
        <div className="rounded border border-border bg-surface-elevated p-3">
          <div className="flex items-center gap-1 font-mono text-[11px] uppercase text-text-secondary">
            DETECTIONS{" "}
            <Formula>
              VIIRS/MODIS ratio = total VIIRS detections divided by total MODIS detections. A dash
              is shown when MODIS is zero.
            </Formula>
          </div>
          <p className="mt-1 text-sm text-text">
            <span className="font-semibold text-thermal-orange">
              VIIRS {viirs.toLocaleString()}
            </span>{" "}
            · MODIS {modis.toLocaleString()}
          </p>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            RATIO: {ratio == null ? "—" : `${ratio.toFixed(1)}x`}
          </p>
        </div>
        <div className="rounded border border-border bg-surface-elevated p-3">
          <div className="flex items-center gap-1 font-mono text-[11px] uppercase text-text-secondary">
            AGREEMENT RATE{" "}
            <Formula>
              Agreement rate = grid cells with both MODIS and VIIRS observations divided by grid
              cells with at least one observation.
            </Formula>
          </div>
          <p className="mt-1 font-mono text-xl font-semibold text-agreement-teal">
            {agreementRate == null ? "—" : `${Math.round(agreementRate * 100)}%`}
          </p>
        </div>
        <div className="rounded border border-border bg-surface-elevated p-3">
          <div className="flex items-center gap-1 font-mono text-[11px] uppercase text-text-secondary">
            LARGEST GAP{" "}
            <Formula>Absolute difference between the daily VIIRS and MODIS counts.</Formula>
          </div>
          {largestGap ? (
            <button
              type="button"
              onClick={() => onSelectDay?.(largestGap.date)}
              className="mt-1 min-h-11 text-left font-mono text-sm text-anomaly-amber underline-offset-2 hover:underline"
            >
              {largestGap.date} · Δ {Math.abs(largestGap.viirs - largestGap.modis).toLocaleString()}
            </button>
          ) : (
            <p className="mt-1 text-sm text-text-secondary">Not available</p>
          )}
        </div>
        <div className="rounded border border-border bg-surface-elevated p-3">
          <div className="font-mono text-[11px] uppercase text-text-secondary">PEAK DAY</div>
          <p className="mt-1 font-mono text-sm text-text">
            {peak
              ? `${peak.date} · ${(peak.modis + peak.viirs).toLocaleString()}`
              : "Not available"}
          </p>
        </div>
        <div className="rounded border border-border bg-surface-elevated p-3">
          <div className="font-mono text-[11px] uppercase text-text-secondary">BUSIEST MONTH</div>
          <p className="mt-1 font-mono text-sm text-text">{busiestMonth ?? "Not available"}</p>
        </div>
        <div className="rounded border border-border bg-surface-elevated p-3">
          <div className="font-mono text-[11px] uppercase text-text-secondary">DATA COVERAGE</div>
          <p className="mt-1 font-mono text-xs text-text">
            {firstDate && lastDate
              ? `${firstDate} to ${lastDate}, ${days.length} days`
              : "Not available"}
          </p>
        </div>
      </div>
    </section>
  );
}
