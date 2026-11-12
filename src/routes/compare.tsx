import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { Suspense, useEffect, useMemo, useState } from "react";
import { buildHarmonizedSeries, type MonthlyAggregate } from "@/lib/harmonize";
import { useQuery } from "@tanstack/react-query";
import { Globe2, Map as MapIcon, RefreshCw } from "lucide-react";
import {
  REGIONS,
  getRegion,
  parseBbox,
  type SensorId,
} from "@/lib/regions";
import { RegionSelect, DateRangeInputs, defaultFilters } from "@/components/FireControls";
import { fetchCompareSpatialBundle, spatialCellsToObservationPoints, getMonthlySeries } from "@/lib/firelens.functions";
import { HarmonizationSection } from "@/components/HarmonizationSection";
import { EmptyState } from "@/components/EmptyState";
import { ObservationInspector } from "@/components/ObservationInspector";
import type { ObservationPoint } from "@/components/EarthGlobe";
import FireMap from "@/components/FireMap";
import EarthGlobe from "@/components/EarthGlobe";
import CompareChart from "@/components/CompareChart";
import { FindingsPanel } from "@/components/FindingsPanel";
import { UnusualDayDrawer } from "@/components/UnusualDayDrawer";
import { computeAnalyticalGrid } from "@/lib/analyticalGrid";
import { SENSOR_COLORS } from "@/lib/sensor-colors";
import { CustomAreaControls } from "@/components/CustomAreaControls";
import { DownloadMenu } from "@/components/DownloadMenu";
import { bboxCenter } from "@/lib/custom-area";
import { useCustomArea } from "@/hooks/use-custom-area";

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
  const [regionId, setRegionId] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("bbox") ? "custom" : defaults.regionId);
  const [startDate, setStartDate] = useState("2020-01-01");
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [mode, setMode] = useState<Mode>("combined");
  const [mapProjection, setMapProjection] = useState<"3D" | "2D">("3D");
  const [gridSize, setGridSize] = useState(0.15);
  const [selectedObs, setSelectedObs] = useState<ObservationPoint | null>(null);
  const [customBbox, setCustomBbox] = useCustomArea(parseBbox(defaults.regionId === "bangladesh" ? getRegion("bangladesh").bbox : getRegion(defaults.regionId).bbox));
  const [mapBounds, setMapBounds] = useState(customBbox);

  const region = getRegion(regionId === "custom" ? defaults.regionId : regionId);
  const bboxParts = regionId === "custom" ? customBbox : parseBbox(region.bbox);
  const mapCenter = regionId === "custom" ? bboxCenter(customBbox) : region.center;
  const mapZoom = regionId === "custom" ? 7 : region.zoom;
  const [debouncedMapInput, setDebouncedMapInput] = useState({ ...bboxParts, start_date: startDate, end_date: endDate });
  const [stillLoading, setStillLoading] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedMapInput({ ...bboxParts, start_date: startDate, end_date: endDate }), 150);
    return () => window.clearTimeout(timer);
  }, [bboxParts.west, bboxParts.south, bboxParts.east, bboxParts.north, startDate, endDate]);
  const mapInputPending = bboxParts.west !== debouncedMapInput.west || bboxParts.south !== debouncedMapInput.south || bboxParts.east !== debouncedMapInput.east || bboxParts.north !== debouncedMapInput.north || startDate !== debouncedMapInput.start_date || endDate !== debouncedMapInput.end_date;
  const spatialQuery = useQuery({
    queryKey: ["compare-spatial-bundle", debouncedMapInput.west, debouncedMapInput.south, debouncedMapInput.east, debouncedMapInput.north, debouncedMapInput.start_date, debouncedMapInput.end_date],
    queryFn: async ({ signal }) => {
      try {
        return await fetchCompareSpatialBundle(debouncedMapInput, signal);
      } catch (error) {
        console.error("[TerraFlux] Compare spatial query failed", error);
        throw error;
      }
    },
    staleTime: 120000,
  });
  useEffect(() => {
    if (!spatialQuery.isFetching) { setStillLoading(false); return; }
    const timer = window.setTimeout(() => setStillLoading(true), 8000);
    return () => window.clearTimeout(timer);
  }, [spatialQuery.isFetching, spatialQuery.dataUpdatedAt]);

  const monthlyQuery = useQuery({
    queryKey: ["monthly-series", regionId, startDate, endDate],
    queryFn: () => getMonthlySeries({ data: { ...bboxParts, start_date: startDate, end_date: endDate } }),
  });

  const monthlyAnalysis = useMemo(
    () => buildHarmonizedSeries((monthlyQuery.data ?? []) as MonthlyAggregate[], startDate, endDate),
    [monthlyQuery.data, startDate, endDate],
  );

  const spatialBundle = mapInputPending ? undefined : spatialQuery.data;
  const allSensorCells = useMemo(() => spatialCellsToObservationPoints(spatialBundle?.cells ?? [], startDate), [spatialBundle, startDate]);
  const detections = useMemo(() => (spatialQuery.isFetching || mapInputPending ? [] : allSensorCells.filter((item) => mode === "combined" || item.sensor === mode)), [allSensorCells, mode, spatialQuery.isFetching, mapInputPending]);
  const days = spatialBundle?.days ?? [];
  const modisTotal = days.reduce((s, d) => s + d.modis, 0);
  const viirsTotal = days.reduce((s, d) => s + d.viirs, 0);
  const gridAnalysis = useMemo(
    () => computeAnalyticalGrid(allSensorCells, startDate, endDate, gridSize),
    [allSensorCells, startDate, endDate, gridSize],
  );
  const agreementRate = useMemo(() => {
    if (!spatialBundle || spatialBundle.analysisError) return null;
    return spatialBundle.sensitivity?.find((item) => item.cell_size === gridSize)?.agreement_rate ?? null;
  }, [spatialBundle, gridSize]);
  const coverage = spatialBundle?.coverage;
  const cellDays = { MODIS: spatialBundle?.sensor_cell_days?.MODIS ?? 0, VIIRS: spatialBundle?.sensor_cell_days?.VIIRS ?? 0 };
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
          analysisError={spatialBundle?.analysisError}
          sampleCells={gridAnalysis.cells.length}
          onSelectDay={setSelectedDay}
        />
      </div>

      <div className="mt-6">
          <HarmonizationSection result={monthlyAnalysis} loading={monthlyQuery.isLoading} observed={{ modisCellDays: cellDays.MODIS, viirsCellDays: cellDays.VIIRS, bothCellDays: spatialBundle?.overlap?.both_cell_days ?? 0, modisOnlyCellDays: spatialBundle?.overlap?.modis_only_cell_days ?? 0, viirsOnlyCellDays: spatialBundle?.overlap?.viirs_only_cell_days ?? 0, overlapMonths: monthlyAnalysis.overlapMonths, rawRatio: spatialBundle?.overlap?.raw_ratio ?? null }} />
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
            const rate = spatialBundle?.sensitivity?.find((item) => item.cell_size === size)?.agreement_rate ?? null;
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
        {spatialBundle?.analysisError && <p className="mt-3 text-xs leading-relaxed text-anomaly-amber" role="status">{spatialBundle.analysisError}</p>}
        <p className="mt-3 text-xs text-text-secondary">
          Same observations, different cell size: shows how much agreement depends on the grid choice. Selected: {gridSize.toFixed(2)}°.
        </p>
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-6">
        <aside className="space-y-5 lg:sticky lg:top-20 lg:rounded-lg lg:border lg:border-border lg:bg-surface lg:p-5">
          <div className="border-b border-border pb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text">
            ANALYSIS PARAMETERS
          </div>
          <div className="flex flex-wrap items-end gap-4 lg:flex-col lg:items-stretch">
<div><RegionSelect value={regionId} onChange={setRegionId} /><p className="mt-1 font-mono text-[10px] text-text-secondary">Coverage: {coverage?.first_date && coverage.last_date ? `${coverage.first_date} to ${coverage.last_date} (${coverage.active_days} active days)` : "—"}</p>{regionId === "custom" && <CustomAreaControls value={customBbox} onChange={setCustomBbox} mapBounds={mapBounds} />}</div><DownloadMenu area={region.name} bbox={bboxParts} startDate={startDate} endDate={endDate} displayedDetectionCount={modisTotal + viirsTotal} monthlyRows={(monthlyQuery.data ?? []) as Record<string, unknown>[]} />
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
                        : "border-border bg-surface-elevated font-semibold text-text"
                    : "border-border bg-surface text-text-secondary hover:text-text"
                }`}
                style={mode === "combined" && m === "combined" ? { borderColor: SENSOR_COLORS.NEUTRAL, color: SENSOR_COLORS.NEUTRAL } : undefined}
              >
                {m === "combined" ? <span className="inline-flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-data-blue" /><i className="h-1.5 w-1.5 rounded-full bg-thermal-orange" />HARMONIZED (BOTH)</span> : `${m} ONLY`}
              </button>
            ))}
          </div>
        </aside>

        <div className="mt-6 grid gap-6 lg:mt-0 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
          <div>
            {spatialBundle?.degraded && <div className="mb-2 rounded border border-anomaly-amber/50 bg-surface px-3 py-2 font-mono text-[11px] text-anomaly-amber" role="status">Fast summary unavailable. Showing a sample of detections.</div>}
            <div className="relative h-[420px] overflow-hidden rounded-lg border border-border bg-bg lg:h-[620px]">
              <div className="absolute left-3 top-3 z-20 flex min-h-11 max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-1 rounded-md border border-border/80 bg-surface/90 p-1 font-mono text-[11px] shadow-xl backdrop-blur-md">
                <button type="button" onClick={() => setMapProjection("3D")} className={`flex min-h-11 items-center gap-1.5 rounded px-3 py-2 uppercase transition-colors ${mapProjection === "3D" ? "border border-data-blue bg-data-blue/20 text-data-blue font-semibold" : "text-text-secondary hover:text-text"}`}><Globe2 className="h-3 w-3" /><span>3D GLOBE</span></button>
                <button type="button" onClick={() => setMapProjection("2D")} className={`flex min-h-11 items-center gap-1.5 rounded px-3 py-2 uppercase transition-colors ${mapProjection === "2D" ? "border border-border bg-surface-elevated text-text-secondary font-semibold" : "text-text-secondary hover:text-text"}`}><MapIcon className="h-3 w-3" /><span>2D MAP</span></button>
              </div>
              <ClientOnly fallback={<div className="h-full w-full bg-surface" />}>
                <Suspense fallback={<div className="h-full w-full bg-surface" />}>
                  {mapProjection === "3D" ? (
                    <EarthGlobe observations={detections} selectedRegion={region} selectedObservation={selectedObs} onSelectObservation={setSelectedObs} showModis={mode === "combined" || mode === "MODIS"} showViirs={mode === "combined" || mode === "VIIRS"} />
                  ) : (
                    <FireMap detections={detections} center={mapCenter} bounds={bboxParts} zoom={mapZoom} onBboxDrawn={(bbox) => { setRegionId("custom"); setCustomBbox(bbox); }} onBoundsChange={setMapBounds} onSelectObservation={(obs) => setSelectedObs(obs as unknown as ObservationPoint)} />
                  )}
                </Suspense>
              </ClientOnly>
              {(mapInputPending || spatialQuery.isFetching) && <div className="absolute inset-0 z-30 flex items-center justify-center bg-bg/75 p-4 backdrop-blur-sm" role="status" aria-live="polite"><div className="flex max-w-md flex-col items-center gap-3 rounded border border-border bg-surface p-4 text-center font-mono text-xs text-text shadow-xl"><RefreshCw className="h-4 w-4 animate-spin text-data-blue" /><span>{stillLoading ? "Still loading..." : `Loading ${mode === "combined" ? "MODIS and VIIRS" : mode} cells...`}</span>{stillLoading && <button type="button" onClick={() => spatialQuery.refetch()} className="rounded border border-border px-3 py-2 text-text">Retry</button>}</div></div>}
              {spatialQuery.isError && <div className="absolute right-3 top-3 z-30 flex max-w-[calc(100%-1.5rem)] items-center gap-3 rounded border border-anomaly-amber/50 bg-surface/95 p-3 font-mono text-xs text-text shadow-xl" role="alert" aria-live="polite"><span className="text-anomaly-amber">{spatialQuery.error.message}</span><button type="button" onClick={() => spatialQuery.refetch()} className="rounded border border-border px-3 py-2 text-text">Retry</button></div>}
            </div>
          </div>
          <div className="rounded border border-border bg-surface px-3 py-2 font-mono text-[10px] text-text-secondary" aria-live="polite">
            {spatialQuery.isError ? <strong className="text-anomaly-amber">SPATIAL SUMMARY UNAVAILABLE</strong> : <><strong className="text-text">{(modisTotal + viirsTotal).toLocaleString()}</strong> matching records · <strong className="text-text">{detections.length.toLocaleString()}</strong> aggregated cells rendered</>} · {mode === "combined" ? "MODIS + VIIRS" : mode}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase text-text">
                  <span className="h-2.5 w-2.5 rounded-full border border-data-blue bg-transparent" />
                  MODIS (1 KM)
                </div>
                <div className="mt-2 font-mono text-3xl font-semibold text-data-blue">
                  {spatialQuery.isLoading || mapInputPending ? "LOADING" : modisTotal > 0 ? modisTotal.toLocaleString() : spatialQuery.isError ? "UNAVAILABLE — QUERY ERROR" : "NO OBSERVATIONS IN RANGE"}
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
                  {spatialQuery.isLoading || mapInputPending ? "LOADING" : viirsTotal > 0 ? viirsTotal.toLocaleString() : spatialQuery.isError ? "UNAVAILABLE — QUERY ERROR" : "NO OBSERVATIONS IN RANGE"}
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
