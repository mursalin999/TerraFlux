import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { REGIONS, getRegion, parseBbox } from "@/lib/regions";
import { RegionSelect, DateRangeInputs, defaultFilters } from "@/components/FireControls";
import { CalendarHeatmap } from "@/components/CalendarHeatmap";
import { getDailyCounts } from "@/lib/firelens.functions";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Temporal Anomaly Calendar — TerraFlux" },
      {
        name: "description",
        content:
          "Daily density heatmap of harmonized satellite thermal anomalies for any region — seasonal rhythms and abnormal spikes visible at a glance.",
      },
      { property: "og:title", content: "Temporal Anomaly Calendar — TerraFlux" },
      {
        property: "og:description",
        content:
          "Daily MODIS and VIIRS thermal anomaly observation density rendered as an analytical calendar matrix.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalendarPage,
});

type Mode = "combined" | "MODIS" | "VIIRS";

function CalendarPage() {
  const defaults = defaultFilters();
  const [regionId, setRegionId] = useState(defaults.regionId);
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [mode, setMode] = useState<Mode>("combined");

  const region = getRegion(regionId);
  const bboxParts = parseBbox(region.bbox);

  const query = useQuery({
    queryKey: ["daily-counts", regionId, startDate, endDate],
    queryFn: () =>
      getDailyCounts({
        data: { ...bboxParts, start_date: startDate, end_date: endDate },
      }),
  });

  const days = query.data ?? [];
  const countForMode = (day: (typeof days)[number]) =>
    mode === "MODIS" ? day.modis : mode === "VIIRS" ? day.viirs : day.modis + day.viirs;
  const total = days.reduce((sum, day) => sum + countForMode(day), 0);
  const busiest = days.reduce<(typeof days)[number] | null>(
    (best, day) => (countForMode(day) > (best ? countForMode(best) : -1) ? day : best),
    null,
  );
  const monthlyTotals = new Map<string, number>();
  const weekdayTotals = Array.from({ length: 7 }, () => 0);
  for (const day of days) {
    const count = countForMode(day);
    const month = day.date.slice(0, 7);
    monthlyTotals.set(month, (monthlyTotals.get(month) ?? 0) + count);
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    weekdayTotals[weekday] = (weekdayTotals[weekday] ?? 0) + count;
  }
  const activeMonths = [...monthlyTotals.entries()].filter(([, count]) => count > 0);
  const busiestMonth = activeMonths.reduce<(typeof activeMonths)[number] | null>(
    (best, item) => (!best || item[1] > best[1] ? item : best),
    null,
  );
  const quietestMonth = activeMonths.reduce<(typeof activeMonths)[number] | null>(
    (best, item) => (!best || item[1] < best[1] ? item : best),
    null,
  );
  const strongestWeekdayIndex = weekdayTotals.reduce(
    (best, count, index) => (count > weekdayTotals[best]! ? index : best),
    0,
  );
  const monthLabel = (value: string) =>
    new Date(`${value}-01T00:00:00Z`).toLocaleString("en", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  const weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-data-blue">
            TEMPORAL DENSITY ANALYSIS
          </div>
          <h1 className="mt-1 font-headline text-2xl font-semibold tracking-tight text-text">
            Observation Calendar Matrix
          </h1>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            Daily thermal anomaly count for {region.name}. Highlights seasonal cycles and anomaly
            spikes.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <RegionSelect value={regionId} onChange={setRegionId} />
          <DateRangeInputs
            startDate={startDate}
            endDate={endDate}
            onStart={setStartDate}
            onEnd={setEndDate}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-2" role="tablist" aria-label="Sensor view">
        {(["combined", "MODIS", "VIIRS"] as Mode[]).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`rounded border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              mode === m
                ? m === "MODIS"
                  ? "border-data-blue bg-data-blue/20 text-data-blue font-semibold"
                  : m === "VIIRS"
                    ? "border-thermal-orange bg-thermal-orange/20 text-thermal-orange font-semibold"
                    : "border-anomaly-amber bg-anomaly-amber/20 text-anomaly-amber font-semibold"
                : "border-border bg-surface text-text-secondary hover:text-text"
            }`}
          >
            {m === "combined" ? "HARMONIZED (BOTH)" : m}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface p-6">
        {query.isLoading && (
          <p className="py-16 text-center font-mono text-xs text-text-secondary">
            Reading stored observations…
          </p>
        )}
        {query.isError && (
          <p className="rounded border border-critical-red/40 bg-critical-red/10 p-4 font-mono text-xs text-critical-red">
            Couldn't load daily counts.
          </p>
        )}
        {!query.isLoading && !query.isError && days.length === 0 && (
          <div className="py-16 text-center font-mono text-xs text-text-secondary">
            <p>No stored observations for {region.name} in this range.</p>
            <p className="mt-2">
              Open{" "}
              <a href="/explore" className="text-data-blue underline underline-offset-4">
                Explore
              </a>{" "}
              and run "Fetch recent" or "Load full range" to ingest data from NASA FIRMS.
            </p>
          </div>
        )}
        {days.length > 0 && (
          <CalendarHeatmap days={days} startDate={startDate} endDate={endDate} mode={mode} />
        )}
      </div>

      {/* Aggregate Analytical Metrics */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface p-5 font-mono">
          <div className="text-[10px] uppercase tracking-wider text-text-secondary">
            TOTAL OBSERVATIONS
          </div>
          <div className="mt-1 text-2xl font-bold text-text">
            {total > 0 ? total.toLocaleString() : "Not available"}
          </div>
          <div className="mt-1 text-[10px] text-text-secondary">
            {mode === "combined" ? "MODIS + VIIRS combined" : `${mode} detector only`}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5 font-mono">
          <div className="text-[10px] uppercase tracking-wider text-text-secondary">
            PEAK ACQUISITION DAY
          </div>
          <div className="mt-1 text-lg font-bold text-text">
            {busiest && countForMode(busiest) > 0 ? busiest.date : "Not available"}
          </div>
          <div className="mt-1 text-[10px] text-text-secondary">
            {busiest && countForMode(busiest) > 0
              ? `${countForMode(busiest).toLocaleString()} observations on this date`
              : "No detections in range"}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5 font-mono">
          <div className="text-[10px] uppercase tracking-wider text-text-secondary">
            MAXIMUM MONTH
          </div>
          <div className="mt-1 text-lg font-bold text-text">
            {busiestMonth ? monthLabel(busiestMonth[0]) : "Not available"}
          </div>
          <div className="mt-1 text-[10px] text-text-secondary">
            {busiestMonth
              ? `${busiestMonth[1].toLocaleString()} total observations`
              : "Not available"}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5 font-mono">
          <div className="text-[10px] uppercase tracking-wider text-text-secondary">
            ACTIVE INTERVAL
          </div>
          <div className="mt-1 text-lg font-bold text-text">
            {activeMonths.length > 0 ? `${activeMonths.length} months active` : "Not available"}
          </div>
          <div className="mt-1 text-[10px] text-text-secondary">
            {quietestMonth ? `Lowest: ${monthLabel(quietestMonth[0])}` : "No detections recorded"}
          </div>
        </div>
      </div>
    </div>
  );
}
