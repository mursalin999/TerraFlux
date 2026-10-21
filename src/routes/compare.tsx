import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { Suspense, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Globe2, Map as MapIcon } from "lucide-react";
import {
  REGIONS,
  getRegion,
  parseBbox,
  SENSOR_META,
  HARMONIZED_META,
  type SensorId,
} from "@/lib/regions";
import { RegionSelect, DateRangeInputs, defaultFilters } from "@/components/FireControls";
import { getDetections, getDailyCounts } from "@/lib/firelens.functions";
import { EmptyState } from "@/components/EmptyState";
import { ObservationInspector } from "@/components/ObservationInspector";
import type { ObservationPoint } from "@/components/EarthGlobe";
import { NasaFirmsFetcher } from "@/components/NasaFirmsFetcher";
import FireMap from "@/components/FireMap";
import EarthGlobe from "@/components/EarthGlobe";
import CompareChart from "@/components/CompareChart";
import { FindingsPanel } from "@/components/FindingsPanel";
import { UnusualDayDrawer } from "@/components/UnusualDayDrawer";
import { computeAnalyticalGrid } from "@/lib/analyticalGrid";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Sensor Comparison — TerraFlux" },
      {
        name: "description",
        content:
          "MODIS vs VIIRS satellite sensor comparison. Analyze spatial resolution divergence, orbital revisit differences, and cross-sensor agreement on a common analytical grid.",
      },
      { property: "og:title", content: "Sensor Comparison — TerraFlux" },
      {
        property: "og:description",
        content: "Compare MODIS and VIIRS satellite thermal anomaly observations side by side.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Compare,
});

type Mode = SensorId | "combined";

function Compare() {
  const defaults = defaultFilters();
  const [regionId, setRegionId] = useState(defaults.regionId);
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [mode, setMode] = useState<Mode>("combined");
  const [mapProjection, setMapProjection] = useState<"3D" | "2D">("3D");
  const [gridSize, setGridSize] = useState(0.15);
  const [selectedObs, setSelectedObs] = useState<ObservationPoint | null>(null);

  const region = getRegion(regionId);
  const bboxParts = parseBbox(region.bbox);
  const sensors = mode === "combined" ? undefined : [mode];

  const mapQuery = useQuery({
    queryKey: ["compare-map", regionId, startDate, endDate, mode],
    queryFn: () =>
      getDetections({
        data: { ...bboxParts, start_date: startDate, end_date: endDate, sensors },
      }),
  });

  const dailyQuery = useQuery({
    queryKey: ["daily-counts", regionId, startDate, endDate],
    queryFn: () =>
      getDailyCounts({ data: { ...bboxParts, start_date: startDate, end_date: endDate } }),
  });

  const detections = useMemo(() => mapQuery.data ?? [], [mapQuery.data]);
  const days = dailyQuery.data ?? [];
  const modisTotal = days.reduce((s, d) => s + d.modis, 0);
  const viirsTotal = days.reduce((s, d) => s + d.viirs, 0);
  const chartMax = Math.max(1, ...days.map((d) => d.modis + d.viirs));
  const gridAnalysis = useMemo(
    () => computeAnalyticalGrid(detections, startDate, endDate, gridSize),
    [detections, startDate, endDate, gridSize],
  );
  const agreementRate = useMemo(() => {
    if (gridAnalysis.cells.length === 0) return null;
    return (
      gridAnalysis.cells.filter((cell) => cell.modisCount > 0 && cell.viirsCount > 0).length /
      gridAnalysis.cells.length
    );
  }, [gridAnalysis.cells]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="border-b border-border pb-6">
        <div className="font-mono text-xs uppercase tracking-wider text-data-blue">
          CROSS-SENSOR RESOLUTION & AGREEMENT
        </div>
        <h1 className="mt-1 font-headline text-2xl font-semibold tracking-tight text-text">
          Instrument Divergence Analysis
        </h1>
        <p className="mt-1 font-mono text-xs text-text-secondary">
          Comparing 1 km MODIS nadir observations with 375 m VIIRS I-band detections over{" "}
          {region.name}.
        </p>
      </div>

      <div className="mt-6">
        <FindingsPanel
          days={days}
          agreementRate={agreementRate}
          sampleCells={gridAnalysis.cells.length}
          onSelectDay={setSelectedDay}
        />
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-text">
            GRID SENSITIVITY
          </h2>
          <span className="font-mono text-[11px] text-agreement-teal">{gridSize.toFixed(2)}° TerraFlux grid</span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[0.05, 0.1, 0.15, 0.25].map((size) => {
            const result = computeAnalyticalGrid(detections, startDate, endDate, size);
            const rate = result.cells.length
              ? result.cells.filter((cell) => cell.modisCount > 0 && cell.viirsCount > 0).length /
                result.cells.length
              : null;
            return (
              <button
                key={size}
                type="button"
                aria-pressed={gridSize === size}
                onClick={() => setGridSize(size)}
                className={`rounded border p-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agreement-teal ${gridSize === size ? "border-agreement-teal bg-agreement-teal/10" : "border-border bg-surface-elevated hover:border-agreement-teal/60"}`}
              >
                <div className="font-mono text-xs text-text">{size.toFixed(2)}°</div>
                <div className="mt-1 font-mono text-sm text-agreement-teal">
                  {rate == null ? "—" : `${Math.round(rate * 100)}%`}
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-text-secondary">
          Same observations, different cell size: shows how much agreement depends on the grid choice. Selected: {gridSize.toFixed(2)}°.
        </p>
      </div>

      <div className="mt-6">
        <NasaFirmsFetcher
          initialRegionId={regionId}
          initialStartDate={startDate}
          initialEndDate={endDate}
        />
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-6">
        <aside className="space-y-5 lg:sticky lg:top-20 lg:rounded-lg lg:border lg:border-border lg:bg-surface lg:p-5">
          <div className="border-b border-border pb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text">
            ANALYSIS PARAMETERS
          </div>
          <div className="flex flex-wrap items-end gap-4 lg:flex-col lg:items-stretch">
            <RegionSelect value={regionId} onChange={setRegionId} />
            <DateRangeInputs
              startDate={startDate}
              endDate={endDate}
              onStart={setStartDate}
              onEnd={setEndDate}
            />
          </div>
          <div
            className="flex gap-1.5 border-t border-border pt-4 lg:flex-col"
            role="tablist"
            aria-label="Sensor selection"
          >
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
                {m === "combined" ? "HARMONIZED (BOTH)" : `${m} ONLY`}
              </button>
            ))}
          </div>
        </aside>

        <div className="mt-6 grid gap-6 lg:mt-0 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
          <div className="relative h-[420px] overflow-hidden rounded-lg border border-border bg-bg lg:h-[620px]">
            {/* Viewport projection mode switcher: 3D GLOBE vs 2D MAP */}
            <div className="absolute left-3 top-3 z-20 flex min-h-11 max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-1 rounded-md border border-border/80 bg-surface/90 p-1 font-mono text-[11px] shadow-xl backdrop-blur-md">
              <button
                type="button"
                onClick={() => setMapProjection("3D")}
                className={`flex min-h-11 items-center gap-1.5 rounded px-3 py-2 uppercase transition-colors ${
                  mapProjection === "3D"
                    ? "border border-data-blue bg-data-blue/20 text-data-blue font-semibold"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                <Globe2 className="h-3 w-3" />
                <span>3D GLOBE</span>
              </button>
              <button
                type="button"
                onClick={() => setMapProjection("2D")}
                className={`flex min-h-11 items-center gap-1.5 rounded px-3 py-2 uppercase transition-colors ${
                  mapProjection === "2D"
                    ? "border border-thermal-orange bg-thermal-orange/20 text-thermal-orange font-semibold"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                <MapIcon className="h-3 w-3" />
                <span>2D MAP</span>
              </button>
            </div>

            <ClientOnly fallback={<div className="h-full w-full bg-surface" />}>
              <Suspense fallback={<div className="h-full w-full bg-surface" />}>
                {mapProjection === "3D" ? (
                  <EarthGlobe
                    observations={detections}
                    selectedRegion={region}
                    selectedObservation={selectedObs}
                    onSelectObservation={(obs) => setSelectedObs(obs)}
                    showModis={mode === "combined" || mode === "MODIS"}
                    showViirs={mode === "combined" || mode === "VIIRS"}
                  />
                ) : (
                  <FireMap
                    detections={detections}
                    center={region.center}
                    zoom={region.zoom}
                    onSelectObservation={(obs) =>
                      setSelectedObs(obs as unknown as ObservationPoint)
                    }
                  />
                )}
              </Suspense>
            </ClientOnly>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase text-text">
                  <span className="h-2.5 w-2.5 rounded-full border border-data-blue bg-transparent" />
                  MODIS (1 KM)
                </div>
                <div className="mt-2 font-mono text-3xl font-semibold text-data-blue">
                  {dailyQuery.isLoading
                    ? "LOADING"
                    : modisTotal > 0
                      ? modisTotal.toLocaleString()
                      : dailyQuery.isError
                        ? "UNAVAILABLE — QUERY ERROR"
                        : "UNAVAILABLE — NO STORED ROWS"}
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase text-text-secondary">
                  OBSERVATIONS IN RANGE
                </div>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase text-text">
                  <span className="h-2.5 w-2.5 rounded-full bg-thermal-orange" />
                  VIIRS (375 M)
                </div>
                <div className="mt-2 font-mono text-3xl font-semibold text-thermal-orange">
                  {dailyQuery.isLoading
                    ? "LOADING"
                    : viirsTotal > 0
                      ? viirsTotal.toLocaleString()
                      : dailyQuery.isError
                        ? "UNAVAILABLE — QUERY ERROR"
                        : "UNAVAILABLE — NO STORED ROWS"}
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase text-text-secondary">
                  OBSERVATIONS IN RANGE
                </div>
              </div>
            </div>

            {/* Scientific Explanation of Sensor Disagreement */}
            <div className="rounded-lg border border-border bg-surface p-5 text-xs text-text-secondary">
              <div className="border-b border-border pb-2 font-mono text-xs font-semibold uppercase tracking-wider text-text">
                CROSS-SENSOR AGREEMENT PRINCIPLES
              </div>
              <p className="mt-3 leading-relaxed">
                MODIS and VIIRS thermal anomaly counts rarely match 1:1. VIIRS features a 375 m
                pixel area that is approximately 7 times smaller than MODIS's 1 km pixel at nadir,
                allowing it to resolve smaller and lower-intensity thermal anomalies.
              </p>
              <p className="mt-2 leading-relaxed">
                Furthermore, Aqua/Terra (MODIS) and Suomi NPP/NOAA-20 (VIIRS) cross over regions at
                different orbital times (approx. 01:30/13:30 vs 02:00/14:00 solar local time),
                meaning transient thermal events may be detected by one sensor before extinguishing
                or flaring up.
              </p>
              <div className="mt-3 rounded border border-border bg-surface-elevated p-3 font-mono text-[11px] text-text">
                <span className="font-semibold text-agreement-teal">AGREEMENT METRIC:</span>{" "}
                Cross-sensor agreement indicates spatial-temporal correspondence between
                observations, but does not confirm a ground fire.
              </div>
            </div>

            {/* Daily Detections Two-Series Chart */}
            <div className="rounded-lg border border-border bg-surface p-5">
              <div className="flex items-center justify-between border-b border-border pb-2 font-mono text-xs font-semibold uppercase tracking-wider text-text">
                <span>DAILY DETECTIONS BY SENSOR</span>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1 text-data-blue">
                    <span className="h-2 w-2 rounded-full border border-data-blue" />
                    MODIS (1 KM)
                  </span>
                  <span className="flex items-center gap-1 text-thermal-orange">
                    <span className="h-2 w-2 rounded-full bg-thermal-orange" />
                    VIIRS (375 M)
                  </span>
                </div>
              </div>

              {days.length === 0 ? (
                <div className="py-6">
                  <EmptyState type="no_observations" />
                </div>
              ) : (
                <div className="mt-2">
                  <ClientOnly
                    fallback={<div className="h-72 w-full animate-pulse bg-surface-elevated/40" />}
                  >
                    <Suspense
                      fallback={
                        <div className="h-72 w-full animate-pulse bg-surface-elevated/40" />
                      }
                    >
                      <CompareChart data={days} onDateClick={setSelectedDay} />
                    </Suspense>
                  </ClientOnly>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <UnusualDayDrawer
        day={days.find((day) => day.date === selectedDay) ?? null}
        observations={detections}
        analysis={gridAnalysis}
        regionBbox={bboxParts}
        onClose={() => setSelectedDay(null)}
      />

      {selectedObs && (
        <ObservationInspector
          observation={selectedObs}
          cell={null}
          baselineWindow={`${startDate} to ${endDate}`}
          onClose={() => setSelectedObs(null)}
        />
      )}
    </div>
  );
}
