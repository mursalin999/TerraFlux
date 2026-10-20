import { X } from "lucide-react";
import type { ObservationPoint } from "@/components/EarthGlobe";
import type { GridAnalysisResult } from "@/lib/analyticalGrid";
import type { FindingDay } from "@/components/FindingsPanel";

interface UnusualDayDrawerProps {
  day: FindingDay | null;
  observations: ObservationPoint[];
  analysis: GridAnalysisResult;
  regionBbox: { west: number; south: number; east: number; north: number };
  onClose: () => void;
}

export function UnusualDayDrawer({
  day,
  observations,
  analysis,
  regionBbox,
  onClose,
}: UnusualDayDrawerProps) {
  if (!day) return null;
  const dayObservations = observations.filter((observation) => observation.acq_date === day.date);
  const dayCells = analysis.cells.filter((cell) =>
    cell.observations.some((observation) => observation.acq_date === day.date),
  );
  const topThree = [...dayCells].sort((a, b) => b.totalCount - a.totalCount).slice(0, 3);
  const topCount = topThree.reduce((sum, cell) => sum + cell.totalCount, 0);
  const total = day.modis + day.viirs;
  const concentration = total > 0 ? Math.round((topCount / total) * 100) : null;
  const frp = dayObservations
    .map((observation) => observation.frp_mw)
    .filter((value): value is number => value != null);
  const sortedFrp = [...frp].sort((a, b) => a - b);
  const medianFrp = sortedFrp.length ? sortedFrp[Math.floor(sortedFrp.length / 2)] : null;
  const maxFrp = sortedFrp.length ? sortedFrp[sortedFrp.length - 1] : null;
  const worldview = `https://worldview.earthdata.nasa.gov/?v=${regionBbox.west},${regionBbox.south},${regionBbox.east},${regionBbox.north}&t=${day.date}`;

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto border-t border-border bg-surface p-5 shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[min(100%,420px)] sm:border-l sm:border-t-0"
      aria-labelledby="unusual-day-title"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-anomaly-amber">
            WHY WAS THIS DAY UNUSUAL?
          </p>
          <h2 id="unusual-day-title" className="mt-1 font-headline text-xl font-semibold text-text">
            {day.date}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close unusual day panel"
          className="min-h-11 min-w-11 rounded border border-border p-2 text-text-secondary hover:text-text"
        >
          <X className="mx-auto h-4 w-4" />
        </button>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 font-mono text-sm">
        <div className="rounded border border-border p-3">
          <span className="text-[11px] text-text-secondary">MODIS</span>
          <strong className="mt-1 block text-data-blue">{day.modis.toLocaleString()}</strong>
        </div>
        <div className="rounded border border-border p-3">
          <span className="text-[11px] text-text-secondary">VIIRS</span>
          <strong className="mt-1 block text-thermal-orange">{day.viirs.toLocaleString()}</strong>
        </div>
      </div>
      <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm text-text">
        <div className="flex justify-between gap-4">
          <dt className="text-text-secondary">Historical percentile</dt>
          <dd>
            {dayCells.length
              ? `${Math.max(...dayCells.map((cell) => cell.anomalyPercentile))}%`
              : "Not available"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-secondary">Agreement level</dt>
          <dd>
            {dayCells.length
              ? dayCells.sort((a, b) => b.agreementRatio - a.agreementRatio)[0]?.agreementLevel
              : "Not available"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-secondary">Top 3 cell concentration</dt>
          <dd>{concentration == null ? "Not available" : `${concentration}% of detections`}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-secondary">FRP median / max</dt>
          <dd>
            {medianFrp == null
              ? "Not available"
              : `${medianFrp.toFixed(1)} / ${maxFrp?.toFixed(1)} MW`}
          </dd>
        </div>
      </dl>
      <p className="mt-5 rounded border border-border bg-surface-elevated p-3 text-sm leading-relaxed text-text-secondary">
        On {day.date}, stored observations totaled {total.toLocaleString()} across MODIS and VIIRS.
        The top three analytical cells contain{" "}
        {concentration == null ? "an unavailable share" : `${concentration}%`} of detections. This
        is a satellite-detected thermal anomaly, not a confirmed ground fire.
      </p>
      <p className="mt-3 font-mono text-[11px] text-text-secondary">
        BASELINE: {analysis.baselineWindowLabel}
      </p>
      <a
        href={worldview}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-11 items-center text-sm text-data-blue underline underline-offset-4"
      >
        Open this day in NASA Worldview
      </a>
      <p className="mt-2 text-xs text-text-secondary">
        Cloud cover can hide detections; check the imagery.
      </p>
    </aside>
  );
}
