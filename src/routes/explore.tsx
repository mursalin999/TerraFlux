import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useMemo, useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw,
  Table as TableIcon,
  HelpCircle,
  RotateCcw,
  Layers,
  Sparkles,
  ShieldCheck,
  Calendar,
  Grid,
  Globe2,
  Map as MapIcon,
} from "lucide-react";
import { REGIONS, getRegion, parseBbox, SENSOR_META } from "@/lib/regions";
import { defaultFilters, type FireFilters, type ConfidenceTier } from "@/components/FireControls";
import { getDetections, fetchFireData, backfillFireData } from "@/lib/firelens.functions";
import {
  computeAnalyticalGrid,
  AGREEMENT_DEFINITIONS,
  AGREEMENT_DISCLAIMER,
  type GridCell,
} from "@/lib/analyticalGrid";
import { type ObservationPoint } from "@/components/EarthGlobe";
import { type ExploreViewMode, type SensorFilterMode } from "@/components/ExploreGlobe";
import { ObservationsTableModal } from "@/components/ObservationsTableModal";
import { ObservationInspector } from "@/components/ObservationInspector";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { EmptyState } from "@/components/EmptyState";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const ExploreGlobe = lazy(() => import("@/components/ExploreGlobe"));
const FireMap = lazy(() => import("@/components/FireMap"));

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Scientific Workspace — TerraFlux" },
      {
        name: "description",
        content:
          "Harmonized MODIS and VIIRS satellite active-fire observation workspace. Explore raw observations, common analytical grid, historical baseline anomalies, and cross-sensor agreement on a 3D Earth.",
      },
      { property: "og:title", content: "Scientific Workspace — TerraFlux" },
      {
        property: "og:description",
        content:
          "Interactive 3D Earth analytical workspace with multi-sensor harmonization, agreement analysis, and anomaly tracking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExploreWorkspace,
});

type TimeScale = "daily" | "weekly" | "monthly";

type PullState =
  | { status: "idle" }
  | { status: "running"; done: number; total: number }
  | { status: "done"; stored: number }
  | { status: "error"; message: string };

function monthChunks(start: string, end: string): { start: string; end: string }[] {
  const out: { start: string; end: string }[] = [];
  const cursor = new Date(start + "T00:00:00Z");
  const last = new Date(end + "T00:00:00Z");
  while (cursor <= last) {
    const chunkEnd = new Date(cursor);
    chunkEnd.setUTCDate(chunkEnd.getUTCDate() + 29);
    if (chunkEnd > last) chunkEnd.setTime(last.getTime());
    out.push({
      start: cursor.toISOString().slice(0, 10),
      end: chunkEnd.toISOString().slice(0, 10),
    });
    cursor.setUTCDate(cursor.getUTCDate() + 30);
  }
  return out;
}

function ExploreWorkspace() {
  const [filters, setFilters] = useState<FireFilters>(defaultFilters);
  const [timeScale, setTimeScale] = useState<TimeScale>("daily");
  const [activeSensor, setActiveSensor] = useState<SensorFilterMode>("HARMONIZED");
  const [activeView, setActiveView] = useState<ExploreViewMode>("NATIVE");
  const [mapProjection, setMapProjection] = useState<"3D" | "2D">("3D");
  const [isParamsOpen, setIsParamsOpen] = useState(false);
  const [isLegendExpanded, setIsLegendExpanded] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [selectedObs, setSelectedObs] = useState<ObservationPoint | null>(null);
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const [selectedAnalysisDate, setSelectedAnalysisDate] = useState<string | null>(null);
  const [pull, setPull] = useState<PullState>({ status: "idle" });

  const queryClient = useQueryClient();
  const runBackfill = useServerFn(backfillFireData);
  const runFetch = useServerFn(fetchFireData);

  const region = getRegion(filters.regionId);
  const bboxParts = parseBbox(region.bbox);

  // Viewport-aware cached query by region, dates, and confidence
  const query = useQuery({
    queryKey: [
      "detections",
      filters.regionId,
      filters.startDate,
      filters.endDate,
      filters.confidence.join(","),
    ],
    queryFn: () =>
      getDetections({
        data: {
          ...bboxParts,
          start_date: filters.startDate,
          end_date: filters.endDate,
          confidence: filters.confidence.length ? filters.confidence : undefined,
        },
      }),
    staleTime: 120000,
  });

  const rawDetections = useMemo(() => query.data ?? [], [query.data]);

  // Compute common analytical grid, anomaly percentiles, and agreement levels
  const gridAnalysis = useMemo(() => {
    return computeAnalyticalGrid(rawDetections, filters.startDate, filters.endDate);
  }, [rawDetections, filters.startDate, filters.endDate]);

  // Aggregate daily detections for the collapsible timeline
  const timelineDays = useMemo(() => {
    const map = new Map<string, { date: string; modis: number; viirs: number }>();
    for (const d of rawDetections) {
      const entry = map.get(d.acq_date) ?? { date: d.acq_date, modis: 0, viirs: 0 };
      if (d.sensor === "MODIS") entry.modis++;
      else entry.viirs++;
      map.set(d.acq_date, entry);
    }
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [rawDetections]);

  // Signature caption based on active sensor
  const sensorCaption = useMemo(() => {
    if (activeSensor === "MODIS") {
      return "MODIS: 1,000 m nadir pixel observations from Terra and Aqua satellites.";
    }
    if (activeSensor === "VIIRS") {
      return "VIIRS: 375 m high-resolution I-band observations from Suomi NPP and NOAA-20/21.";
    }
    return "HARMONIZED: both sensors on one common analytical grid.";
  }, [activeSensor]);

  // Ingestion actions
  const handlePullRecent = async () => {
    setPull({ status: "running", done: 0, total: 1 });
    try {
      const res = await runFetch({ data: { bbox: region.bbox, days: 3 } });
      await queryClient.invalidateQueries({ queryKey: ["detections"] });
      setPull({ status: "done", stored: res.stored });
    } catch (err) {
      setPull({ status: "error", message: err instanceof Error ? err.message : "Pull failed" });
    }
  };

  const handlePullHistory = async () => {
    if (!filters.startDate || !filters.endDate) {
      setPull({ status: "error", message: "Choose both a start date and an end date." });
      return;
    }
    if (filters.startDate > filters.endDate) {
      setPull({ status: "error", message: "Start date must be on or before end date." });
      return;
    }

    const chunks = monthChunks(filters.startDate, filters.endDate);
    setPull({ status: "running", done: 0, total: chunks.length });
    let stored = 0;
    try {
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]!;
        const res = await runBackfill({
          data: {
            bbox: region.bbox,
            start_date: chunk.start,
            end_date: chunk.end,
          },
        });
        stored += res.stored;
        setPull({ status: "running", done: i + 1, total: chunks.length });
      }
      await queryClient.invalidateQueries({ queryKey: ["detections"] });
      setPull({ status: "done", stored });
    } catch (err) {
      setPull({ status: "error", message: err instanceof Error ? err.message : "Pull failed" });
    }
  };

  const resetFilters = () => {
    setFilters(defaultFilters());
    setActiveSensor("HARMONIZED");
    setActiveView("NATIVE");
    setSelectedObs(null);
    setSelectedCell(null);
  };

  // Reusable controls markup for both desktop floating panel and mobile drawer
  const controlsContent = (
    <div className="space-y-5 text-xs font-mono">
      {/* Target Region */}
      <div>
        <label className="text-[11px] uppercase tracking-wider text-text-secondary">
          TARGET REGION
        </label>
        <select
          value={filters.regionId}
          onChange={(e) => {
            setFilters((f) => ({ ...f, regionId: e.target.value }));
            setSelectedObs(null);
            setSelectedCell(null);
          }}
          className="mt-1.5 w-full rounded border border-border bg-surface px-3 py-1.5 text-text focus:border-data-blue focus:outline-none"
        >
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.bbox})
            </option>
          ))}
        </select>
      </div>

      {/* Date Interval */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] uppercase text-text-secondary">START DATE</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
            className="mt-1 w-full rounded border border-border bg-surface px-2.5 py-1 text-xs text-text focus:border-data-blue focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase text-text-secondary">END DATE</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
            className="mt-1 w-full rounded border border-border bg-surface px-2.5 py-1 text-xs text-text focus:border-data-blue focus:outline-none"
          />
        </div>
      </div>

      {/* Time Scale (daily / weekly / monthly) */}
      <div>
        <label className="text-[11px] uppercase tracking-wider text-text-secondary">
          TIME SCALE
        </label>
        <div className="mt-1.5 grid grid-cols-3 gap-1 rounded border border-border bg-surface p-1">
          {(["daily", "weekly", "monthly"] as TimeScale[]).map((scale) => (
            <button
              key={scale}
              type="button"
              onClick={() => setTimeScale(scale)}
              className={`rounded py-1 text-center font-mono text-[11px] uppercase transition-colors ${
                timeScale === scale
                  ? "bg-surface-elevated font-semibold text-text"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              {scale}
            </button>
          ))}
        </div>
      </div>

      {/* Confidence Filter */}
      <div>
        <label className="text-[11px] uppercase tracking-wider text-text-secondary">
          CONFIDENCE TIERS
        </label>
        <div className="mt-1.5 flex gap-1.5">
          {(["low", "nominal", "high"] as ConfidenceTier[]).map((tier) => {
            const active = filters.confidence.includes(tier);
            return (
              <button
                key={tier}
                type="button"
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    confidence: active
                      ? f.confidence.filter((t) => t !== tier)
                      : [...f.confidence, tier],
                  }))
                }
                className={`flex-1 rounded border py-1 text-center text-xs uppercase transition-colors ${
                  active
                    ? "border-data-blue bg-data-blue/20 font-semibold text-data-blue"
                    : "border-border bg-surface text-text-secondary hover:text-text"
                }`}
              >
                {tier}
              </button>
            );
          })}
        </div>
      </div>

      {/* NASA FIRMS Data Pull Action */}
      <div className="space-y-2 border-t border-border pt-4">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-text-secondary">
          <span>DATA PULL</span>
          <span className="text-[9px] text-text-secondary/70">NASA FIRMS API</span>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handlePullRecent}
            disabled={pull.status === "running"}
            className="flex items-center justify-center gap-2 rounded bg-data-blue px-3 py-1.5 font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${pull.status === "running" ? "animate-spin" : ""}`} />
            FETCH LAST 3 DAYS
          </button>
          <button
            type="button"
            onClick={handlePullHistory}
            disabled={pull.status === "running"}
            className="rounded border border-border bg-surface px-3 py-1.5 text-text transition-colors hover:bg-surface-elevated disabled:opacity-50"
          >
              FETCH NASA FIRMS DATE RANGE
          </button>
        </div>
        <div className="text-[10px] text-text-secondary">
          {pull.status === "running" && (
            <span className="text-anomaly-amber">
              Ingesting from FIRMS… chunk {pull.done} / {pull.total}
            </span>
          )}
          {pull.status === "done" && (
            <span className="text-agreement-teal">
              Ingest complete: {pull.stored.toLocaleString()} records stored.
            </span>
          )}
          {pull.status === "error" && <span className="text-critical-red">{pull.message}</span>}
          {pull.status === "idle" && "Queries directly verified NASA FIRMS endpoints."}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-bg text-text select-none">
      {/* 3D Earth Globe (DOMINANT VIEWPORT) */}
      <div className="absolute inset-0 z-0">
        <ClientOnly
          fallback={
            <div className="flex h-full w-full items-center justify-center font-mono text-xs text-text-secondary">
              CALIBRATING 3D GEOID…
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center font-mono text-xs text-text-secondary">
                RENDERING EARTH VIEW…
              </div>
            }
          >
            {mapProjection === "3D" ? (
              <ExploreGlobe
                observations={rawDetections}
                gridCells={gridAnalysis.cells}
                selectedRegion={region}
                activeSensor={activeSensor}
                activeView={activeView}
                selectedObservation={selectedObs}
                selectedCell={selectedCell}
                onSelectObservation={(obs) => {
                  setSelectedObs(obs);
                  setSelectedCell(null);
                }}
                onSelectCell={(cell) => {
                  setSelectedCell(cell);
                  setSelectedObs(null);
                }}
              />
            ) : (
              <FireMap
                detections={rawDetections}
                center={region.center}
                zoom={region.zoom}
                onSelectObservation={(obs) => {
                  setSelectedObs(obs as unknown as ObservationPoint);
                  setSelectedCell(null);
                }}
              />
            )}
          </Suspense>
        </ClientOnly>
      </div>

      {/* TOP DESKTOP FLOATING BAR (Slim, Compact, Floating) */}
      <div className="pointer-events-auto absolute left-4 right-4 top-4 z-20 hidden items-center justify-between gap-4 font-mono sm:flex lg:left-6 lg:right-6">
        {/* Left: Region & Signature 3-Way Control */}
        <div className="flex items-center gap-3 rounded-lg border border-border/80 bg-surface/90 p-1.5 shadow-2xl backdrop-blur-md">
          {/* Target Region Selector */}
          <select
            value={filters.regionId}
            onChange={(e) => {
              setFilters((f) => ({ ...f, regionId: e.target.value }));
              setSelectedObs(null);
              setSelectedCell(null);
            }}
            className="rounded border border-border/60 bg-surface-elevated px-2.5 py-1 text-xs font-semibold text-text focus:border-data-blue focus:outline-none"
          >
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name.toUpperCase()}
              </option>
            ))}
          </select>

          {/* SIGNATURE INTERACTION: "ONE EARTH. TWO EYES." (3-way control) */}
          <div className="flex items-center gap-1 rounded border border-border/60 bg-surface-elevated/70 p-0.5">
            {(["MODIS", "VIIRS", "HARMONIZED"] as SensorFilterMode[]).map((sensor) => {
              const active = activeSensor === sensor;
              return (
                <button
                  key={sensor}
                  type="button"
                  onClick={() => setActiveSensor(sensor)}
                  className={`rounded px-2.5 py-1 text-xs font-semibold tracking-wider transition-all duration-300 ${
                    active
                      ? sensor === "MODIS"
                        ? "bg-data-blue text-bg shadow-sm"
                        : sensor === "VIIRS"
                          ? "bg-thermal-orange text-bg shadow-sm"
                          : "bg-anomaly-amber text-bg shadow-sm"
                      : "text-text-secondary hover:text-text"
                  }`}
                >
                  {sensor}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: View Mode Selector (NATIVE | COMMON GRID | HARMONIZED | ANOMALY | AGREEMENT) */}
        <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-surface/90 p-1.5 shadow-2xl backdrop-blur-md">
          {(
            ["NATIVE", "COMMON GRID", "HARMONIZED", "ANOMALY", "AGREEMENT"] as ExploreViewMode[]
          ).map((view) => {
            const active = activeView === view;
            return (
              <button
                key={view}
                type="button"
                onClick={() => {
                  setActiveView(view);
                  if (view === "HARMONIZED") setActiveSensor("HARMONIZED");
                }}
                className={`rounded px-2.5 py-1 text-xs tracking-wider transition-colors ${
                  active
                    ? "bg-surface-elevated font-semibold text-text border border-border"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                {view}
              </button>
            );
          })}
        </div>

        {/* Map Projection Switcher: 3D GLOBE vs 2D REGIONAL MAP */}
        <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-surface/90 p-1.5 shadow-2xl backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMapProjection("3D")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs uppercase tracking-wider transition-colors ${
              mapProjection === "3D"
                ? "border border-data-blue bg-data-blue/20 text-data-blue font-semibold"
                : "text-text-secondary hover:text-text"
            }`}
          >
            <Globe2 className="h-3.5 w-3.5" />
            <span>3D GLOBE</span>
          </button>
          <button
            type="button"
            onClick={() => setMapProjection("2D")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs uppercase tracking-wider transition-colors ${
              mapProjection === "2D"
                ? "border border-thermal-orange bg-thermal-orange/20 text-thermal-orange font-semibold"
                : "text-text-secondary hover:text-text"
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" />
            <span>2D MAP</span>
          </button>
        </div>

        {/* Right: Actions (Parameters Toggle, View Table, Reset) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsParamsOpen(!isParamsOpen)}
            className={`flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface/90 px-3 py-1.5 text-xs text-text shadow-2xl backdrop-blur-md transition-colors hover:bg-surface-elevated ${
              isParamsOpen ? "border-data-blue text-data-blue" : ""
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>PARAMETERS</span>
            {isParamsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          <button
            type="button"
            onClick={() => setIsTableModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface/90 px-3 py-1.5 text-xs text-text shadow-2xl backdrop-blur-md transition-colors hover:bg-surface-elevated"
          >
            <TableIcon className="h-3.5 w-3.5 text-agreement-teal" />
            <span>VIEW AS TABLE</span>
          </button>

          <button
            type="button"
            onClick={resetFilters}
            title="Reset parameters"
            className="rounded-lg border border-border/80 bg-surface/90 p-1.5 text-text-secondary shadow-2xl backdrop-blur-md transition-colors hover:text-text"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ONE-LINE SIGNATURE CAPTION (Subtle HUD below top bar) */}
      <div className="pointer-events-none absolute left-6 top-18 z-10 hidden font-mono text-[11px] text-text-secondary sm:block">
        <span className="rounded border border-border/60 bg-surface/80 px-2.5 py-1 backdrop-blur-md">
          {sensorCaption}
        </span>
      </div>

      {/* Accessible Loading Status with aria-live */}
      {query.isFetching && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute right-6 top-18 z-20 hidden items-center gap-2 rounded-full border border-border/80 bg-surface/90 px-3 py-1 font-mono text-[11px] text-text shadow-xl backdrop-blur-md sm:flex animate-in fade-in"
        >
          <RefreshCw className="h-3 w-3 animate-spin text-data-blue" />
          <span>Synchronizing observations…</span>
        </div>
      )}

      {/* Query Error Floating State */}
      {query.isError && (
        <div className="pointer-events-auto absolute right-6 top-20 z-30 max-w-sm shadow-2xl">
          <EmptyState type="firms_error" onRetry={() => query.refetch()} />
        </div>
      )}

      {/* COLLAPSIBLE PARAMETERS FLOATING PANEL (Desktop) */}
      {isParamsOpen && (
        <div className="pointer-events-auto absolute right-6 top-18 z-30 hidden w-80 rounded-lg border border-border/90 bg-surface/95 p-5 shadow-2xl backdrop-blur-xl sm:block animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text">
              FILTER & INGESTION PARAMETERS
            </span>
            <button
              type="button"
              onClick={() => setIsParamsOpen(false)}
              className="text-text-secondary hover:text-text"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4">{controlsContent}</div>
        </div>
      )}

      {/* MOBILE FLOATING BAR & CONTROLS TRIGGER */}
      <div className="pointer-events-auto absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-2 font-mono sm:hidden">
        {/* Mobile Signature 3-way toggle */}
        <div className="flex items-center justify-between rounded-lg border border-border/80 bg-surface/90 p-1 backdrop-blur-md">
          {(["MODIS", "VIIRS", "HARMONIZED"] as SensorFilterMode[]).map((sensor) => (
            <button
              key={sensor}
              type="button"
              onClick={() => setActiveSensor(sensor)}
              className={`flex-1 rounded py-1 text-center text-xs font-semibold ${
                activeSensor === sensor
                  ? sensor === "MODIS"
                    ? "bg-data-blue text-bg"
                    : sensor === "VIIRS"
                      ? "bg-thermal-orange text-bg"
                      : "bg-anomaly-amber text-bg"
                  : "text-text-secondary"
              }`}
            >
              {sensor}
            </button>
          ))}
        </div>

        {/* Mobile Action Buttons: CONTROLS & TABLE */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-text shadow-xl"
          >
            <SlidersHorizontal className="h-4 w-4 text-data-blue" />
            <span>CONTROLS ({activeView})</span>
          </button>
          <button
            type="button"
            onClick={() => setIsTableModalOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-xs text-text shadow-xl"
          >
            <TableIcon className="h-4 w-4 text-agreement-teal" />
            <span>TABLE</span>
          </button>
        </div>
      </div>

      {/* MOBILE CONTROLS BOTTOM SHEET DRAWER */}
      <Drawer open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
        <DrawerContent className="max-h-[85vh] border-border bg-surface px-6 pb-8 pt-4 font-mono text-text">
          <DrawerHeader className="px-0 pb-3">
            <DrawerTitle className="font-headline text-lg text-text">
              Observation Controls
            </DrawerTitle>
            <DrawerDescription className="text-xs text-text-secondary">
              Configure sensor view, geodetic region, date window, and data pull.
            </DrawerDescription>
          </DrawerHeader>

          {/* View Selection in Mobile Drawer */}
          <div className="mb-4">
            <label className="text-[11px] uppercase tracking-wider text-text-secondary">
              ACTIVE VIEW
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {(
                ["NATIVE", "COMMON GRID", "HARMONIZED", "ANOMALY", "AGREEMENT"] as ExploreViewMode[]
              ).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => {
                    setActiveView(view);
                    if (view === "HARMONIZED") setActiveSensor("HARMONIZED");
                  }}
                  className={`rounded border px-2 py-1 text-center text-[11px] ${
                    activeView === view
                      ? "border-data-blue bg-data-blue/15 font-semibold text-data-blue"
                      : "border-border bg-surface-elevated text-text-secondary"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          {/* Projection Selection in Mobile Drawer */}
          <div className="mb-4">
            <label className="text-[11px] uppercase tracking-wider text-text-secondary">
              MAP PROJECTION
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setMapProjection("3D")}
                className={`flex items-center justify-center gap-1.5 rounded border py-1.5 text-center text-xs font-semibold ${
                  mapProjection === "3D"
                    ? "border-data-blue bg-data-blue/20 text-data-blue"
                    : "border-border bg-surface-elevated text-text-secondary"
                }`}
              >
                <Globe2 className="h-3.5 w-3.5" />
                <span>3D GLOBE</span>
              </button>
              <button
                type="button"
                onClick={() => setMapProjection("2D")}
                className={`flex items-center justify-center gap-1.5 rounded border py-1.5 text-center text-xs font-semibold ${
                  mapProjection === "2D"
                    ? "border-thermal-orange bg-thermal-orange/20 text-thermal-orange"
                    : "border-border bg-surface-elevated text-text-secondary"
                }`}
              >
                <MapIcon className="h-3.5 w-3.5" />
                <span>2D MAP</span>
              </button>
            </div>
          </div>

          <div className="overflow-y-auto pr-1">{controlsContent}</div>
        </DrawerContent>
      </Drawer>

      {/* COMPACT COLLAPSIBLE LEGEND (Bottom-Left) */}
      <div className="pointer-events-auto absolute bottom-4 left-4 z-20 hidden max-w-sm rounded-lg border border-border/80 bg-surface/90 p-3 font-mono text-xs shadow-2xl backdrop-blur-md sm:block">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold uppercase tracking-wider text-text">LEGEND</span>
            <span className="text-[10px] text-text-secondary">({activeView})</span>
          </div>
          <button
            type="button"
            onClick={() => setIsLegendExpanded(!isLegendExpanded)}
            className="text-text-secondary hover:text-text"
          >
            {isLegendExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {isLegendExpanded && (
          <div className="mt-2.5 space-y-2">
            {activeView === "NATIVE" && (
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full border border-data-blue bg-transparent" />
                  <span className="text-text">MODIS — 1,000 m nadir pixel (ring)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-thermal-orange" />
                  <span className="text-text">VIIRS — 375 m I-band pixel (solid)</span>
                </div>
                <div className="text-[10px] text-text-secondary/80">
                  Marker size scales subtly with Fire Radiative Power (FRP).
                </div>
              </div>
            )}

            {activeView === "COMMON GRID" && (
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-[10px] text-text-secondary">
                  <span>LOW DENSITY</span>
                  <span>HIGH DENSITY ({gridAnalysis.maxCount} MAX)</span>
                </div>
                <div className="h-2 w-full rounded-sm bg-gradient-to-r from-data-blue/20 via-data-blue/60 to-data-blue" />
                <div className="text-[10px] text-text-secondary">
                  Grid resolution: 0.15° geodetic cells (~16.5 km).
                </div>
              </div>
            )}

            {activeView === "HARMONIZED" && (
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-[10px] text-text-secondary">
                  <span>BASELINE NOMINAL</span>
                  <span>UNIFIED THERMAL INTENSITY</span>
                </div>
                <div className="h-2 w-full rounded-sm bg-gradient-to-r from-[#F4F7FA]/30 via-anomaly-amber/60 to-anomaly-amber" />
                <div className="text-[10px] text-text-secondary">
                  Derived multi-sensor layer harmonizing MODIS and VIIRS nadir footprints.
                </div>
              </div>
            )}

            {activeView === "ANOMALY" && (
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm bg-anomaly-amber" />
                  <span className="text-text font-semibold text-anomaly-amber">
                    CRITICAL ANOMALY (≥90th percentile)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm bg-anomaly-amber/40 border border-anomaly-amber" />
                  <span className="text-text">ELEVATED ACTIVITY (80–89th percentile)</span>
                </div>
                <div className="rounded border border-border bg-surface-elevated/70 p-2 text-[10px] text-text-secondary">
                  BASELINE WINDOW:{" "}
                  <strong className="text-text">{gridAnalysis.baselineWindowLabel}</strong>
                </div>
              </div>
            )}

            {activeView === "AGREEMENT" && (
              <div className="space-y-2 text-[11px]">
                <div className="grid grid-cols-2 gap-1.5">
                  {(["STRONG", "MODERATE", "LIMITED", "NONE"] as const).map((level) => {
                    const def = AGREEMENT_DEFINITIONS[level];
                    return (
                      <div
                        key={level}
                        title={def.criteria}
                        className="flex items-center gap-1.5 rounded border border-border/80 px-2 py-1 text-[10px]"
                        style={{ backgroundColor: def.bg, borderColor: def.border }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: def.color }}
                        />
                        <span className="font-semibold text-text">{level}</span>
                      </div>
                    );
                  })}
                </div>
                {/* TOOLTIP TEXT EXACTLY AS REQUIRED */}
                <div className="rounded border border-border bg-surface-elevated p-2 text-[10px] leading-relaxed text-text">
                  <span className="text-agreement-teal font-semibold">SCIENTIFIC NOTICE: </span>
                  {AGREEMENT_DISCLAIMER}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PHASE 4: OBSERVATION INSPECTOR & DETECTION STORY */}
      <ObservationInspector
        observation={selectedObs}
        cell={selectedCell}
        allCells={gridAnalysis.cells}
        baselineWindow={`${filters.startDate} → ${filters.endDate}`}
        onClose={() => {
          setSelectedObs(null);
          setSelectedCell(null);
        }}
      />

      {/* ACCESSIBLE OBSERVATIONS TABLE MODAL */}
      <ObservationsTableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        observations={rawDetections}
        regionName={region.name}
      />

      {/* PHASE 5: COLLAPSIBLE THERMAL ACTIVITY TIMELINE BOTTOM PANEL */}
      <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-20 flex flex-col items-center">
        {/* Toggle Pill Button */}
        <button
          type="button"
          onClick={() => setTimelineExpanded((v) => !v)}
          className="flex items-center gap-2 rounded-t-lg border-t border-x border-border bg-surface/95 px-4 py-1.5 font-mono text-[11px] font-semibold text-text shadow-2xl backdrop-blur-md transition-all hover:bg-surface-elevated"
          aria-expanded={timelineExpanded}
          aria-label="Toggle thermal activity timeline"
        >
          <span className="h-2 w-2 rounded-full bg-data-blue animate-pulse" />
          <span>THERMAL ACTIVITY TIMELINE</span>
          <span className="text-[9px] text-text-secondary">({timelineDays.length} days)</span>
          {timelineExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5" />
          )}
        </button>

        {timelineExpanded && (
          <div className="w-full max-h-[48vh] overflow-y-auto border-t border-border bg-surface/95 p-3 shadow-2xl backdrop-blur-xl sm:p-4 animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto max-w-6xl">
              <ActivityTimeline
                days={timelineDays}
                detections={rawDetections}
                selectedDate={selectedAnalysisDate}
                onSelectDate={(date) => setSelectedAnalysisDate(date)}
                onFlyTo={(date) => {
                  const firstOnDate = rawDetections.find((d) => d.acq_date === date);
                  if (firstOnDate) {
                    setSelectedObs(firstOnDate);
                  }
                  setSelectedAnalysisDate(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
