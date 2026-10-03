import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Globe,
  Map as MapIcon,
  SlidersHorizontal,
  Info,
  X,
  Database,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { REGIONS, getRegion, parseBbox, SENSOR_META, HARMONIZED_META } from "@/lib/regions";
import {
  RegionSelect,
  DateRangeInputs,
  ConfidenceFilter,
  defaultFilters,
  type FireFilters,
} from "@/components/FireControls";
import { getDetections, fetchFireData, backfillFireData } from "@/lib/firelens.functions";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { type ObservationPoint } from "@/components/EarthGlobe";

const EarthGlobe = lazy(() => import("@/components/EarthGlobe"));
const FireMap = lazy(() => import("@/components/FireMap"));

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — TerraFlux" },
      {
        name: "description",
        content:
          "Interactive 3D Earth globe and planar map of harmonized NASA MODIS and VIIRS satellite thermal anomaly observations. Inspect radiometric attributes, cross-sensor agreement, and ingest data from NASA FIRMS.",
      },
      { property: "og:title", content: "Explore — TerraFlux" },
      {
        property: "og:description",
        content: "Explore harmonized MODIS and VIIRS satellite thermal anomaly records.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explore,
});

type PullState =
  | { status: "idle" }
  | { status: "running"; done: number; total: number }
  | { status: "done"; stored: number }
  | { status: "error"; message: string };

type ViewMode = "3d" | "2d";

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

function LoadingFallback({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-bg font-mono text-xs text-text-secondary">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-data-blue border-t-transparent" />
      <span className="mt-3 tracking-widest uppercase">{label}</span>
    </div>
  );
}

function Explore() {
  const [filters, setFilters] = useState<FireFilters>(defaultFilters);
  const [viewMode, setViewMode] = useState<ViewMode>("3d");
  const [pull, setPull] = useState<PullState>({ status: "idle" });
  const [showModis, setShowModis] = useState(true);
  const [showViirs, setShowViirs] = useState(true);
  const [selectedObs, setSelectedObs] = useState<ObservationPoint | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const queryClient = useQueryClient();
  const runBackfill = useServerFn(backfillFireData);
  const runFetch = useServerFn(fetchFireData);

  const region = getRegion(filters.regionId);
  const bboxParts = parseBbox(region.bbox);

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
  });

  const detections = useMemo(() => query.data ?? [], [query.data]);
  const modisCount = detections.filter((d) => d.sensor === "MODIS").length;
  const viirsCount = detections.filter((d) => d.sensor === "VIIRS").length;

  const percentage = (count: number) =>
    detections.length === 0 ? 0 : Math.round((count / detections.length) * 100);

  const confidenceCounts = {
    low: detections.filter((d) => d.confidence_tier === "low").length,
    nominal: detections.filter((d) => d.confidence_tier === "nominal").length,
    high: detections.filter((d) => d.confidence_tier === "high").length,
  };

  const pullHistory = async () => {
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

  const pullRecent = async () => {
    setPull({ status: "running", done: 0, total: 1 });
    try {
      const res = await runFetch({ data: { bbox: region.bbox, days: 3 } });
      await queryClient.invalidateQueries({ queryKey: ["detections"] });
      setPull({ status: "done", stored: res.stored });
    } catch (err) {
      setPull({ status: "error", message: err instanceof Error ? err.message : "Pull failed" });
    }
  };

  // Filter component markup shared between desktop sidebar and mobile bottom drawer
  const controlPanelContent = (
    <div className="space-y-6">
      <div className="space-y-4">
        <RegionSelect
          value={filters.regionId}
          onChange={(regionId) => {
            setFilters((f) => ({ ...f, regionId }));
            setSelectedObs(null);
          }}
        />
        <DateRangeInputs
          startDate={filters.startDate}
          endDate={filters.endDate}
          onStart={(startDate) => setFilters((f) => ({ ...f, startDate }))}
          onEnd={(endDate) => setFilters((f) => ({ ...f, endDate }))}
        />
        <ConfidenceFilter
          value={filters.confidence}
          onChange={(confidence) => setFilters((f) => ({ ...f, confidence }))}
        />
      </div>

      {/* Layer Toggles */}
      <div className="space-y-2.5 border-t border-border pt-4">
        <div className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
          SENSOR LAYERS
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setShowModis(!showModis)}
            className={`flex items-center justify-between rounded border px-2.5 py-1.5 font-mono text-xs transition-colors ${
              showModis
                ? "border-data-blue bg-data-blue/15 text-data-blue"
                : "border-border bg-surface text-text-secondary opacity-60"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full border border-data-blue" />
              <span>MODIS</span>
            </div>
            <span className="text-[10px]">{showModis ? "ON" : "OFF"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowViirs(!showViirs)}
            className={`flex items-center justify-between rounded border px-2.5 py-1.5 font-mono text-xs transition-colors ${
              showViirs
                ? "border-thermal-orange bg-thermal-orange/15 text-thermal-orange"
                : "border-border bg-surface text-text-secondary opacity-60"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-thermal-orange" />
              <span>VIIRS</span>
            </div>
            <span className="text-[10px]">{showViirs ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* Ingestion Trigger */}
      <div className="space-y-2 border-t border-border pt-4">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-text-secondary">
          <span>DATA PROVENANCE</span>
          <span className="text-[9px] text-text-secondary/70">NASA FIRMS API</span>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={pullRecent}
            disabled={pull.status === "running"}
            className="flex items-center justify-center gap-2 rounded bg-data-blue px-3 py-1.5 font-mono text-xs font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${pull.status === "running" ? "animate-spin" : ""}`} />
            FETCH RECENT (3 DAYS)
          </button>
          <button
            type="button"
            onClick={pullHistory}
            disabled={pull.status === "running"}
            className="rounded border border-border bg-surface px-3 py-1.5 font-mono text-xs font-medium text-text transition-colors hover:bg-surface-elevated disabled:opacity-50"
          >
            LOAD FULL RANGE FROM FIRMS
          </button>
        </div>
        <div className="font-mono text-[10px] leading-relaxed text-text-secondary">
          {pull.status === "running" && (
            <span className="text-anomaly-amber">
              Ingesting from FIRMS… chunk {pull.done} / {pull.total}
            </span>
          )}
          {pull.status === "done" && (
            <span className="text-agreement-teal">
              Ingestion complete: {pull.stored.toLocaleString()} records committed.
            </span>
          )}
          {pull.status === "error" && <span className="text-critical-red">{pull.message}</span>}
          {pull.status === "idle" && "Thermal observations are loaded directly from NASA FIRMS."}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Console Bar */}
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline text-2xl font-semibold tracking-tight text-text">
              Terrestrial Observation Console
            </h1>
            <span className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary">
              LIVE
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            TARGET: <span className="font-semibold text-text uppercase">{region.name}</span> · BBOX:{" "}
            {region.bbox} · RANGE: {filters.startDate} → {filters.endDate}
          </p>
        </div>

        {/* View Switcher & Mobile Trigger */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              className={`flex items-center gap-1.5 rounded px-3 py-1 font-mono text-xs transition-colors ${
                viewMode === "3d"
                  ? "bg-data-blue font-semibold text-bg"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>3D EARTH</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("2d")}
              className={`flex items-center gap-1.5 rounded px-3 py-1 font-mono text-xs transition-colors ${
                viewMode === "2d"
                  ? "bg-data-blue font-semibold text-bg"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              <MapIcon className="h-3.5 w-3.5" />
              <span>2D PLANAR</span>
            </button>
          </div>

          {/* Mobile Bottom Sheet Drawer Trigger */}
          <div className="lg:hidden">
            <Drawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
              <DrawerTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text hover:bg-surface-elevated"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>FILTERS</span>
                </button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[85vh] border-border bg-surface px-6 pb-8 pt-4 text-text">
                <DrawerHeader className="px-0 pb-4">
                  <DrawerTitle className="font-headline text-lg text-text">
                    Observation Parameters
                  </DrawerTitle>
                  <DrawerDescription className="font-mono text-xs text-text-secondary">
                    Configure target coordinates, date interval, and sensor layers.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="overflow-y-auto pr-1">{controlPanelContent}</div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      {/* Main Analytical Grid */}
      <div className="mt-6 lg:grid lg:grid-cols-[300px_minmax(0,1fr)_320px] lg:items-start lg:gap-6">
        {/* Desktop Sidebar Controls (Hidden on mobile) */}
        <aside className="hidden space-y-6 rounded-lg border border-border bg-surface p-5 lg:block">
          <div className="border-b border-border pb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text">
            OBSERVATION PARAMETERS
          </div>
          {controlPanelContent}
        </aside>

        {/* Central Visualization Viewport (3D Earth or 2D Planar) */}
        <div className="relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
          <div className="h-[520px] sm:h-[600px] lg:h-[700px]">
            {viewMode === "3d" ? (
              <ClientOnly fallback={<LoadingFallback label="INITIALIZING 3D GEOID…" />}>
                <Suspense fallback={<LoadingFallback label="RENDERING 3D EARTH…" />}>
                  <EarthGlobe
                    observations={detections}
                    selectedRegion={region}
                    selectedObservation={selectedObs}
                    onSelectObservation={(obs) => setSelectedObs(obs)}
                    showModis={showModis}
                    showViirs={showViirs}
                  />
                </Suspense>
              </ClientOnly>
            ) : (
              <ClientOnly fallback={<LoadingFallback label="LOADING CARTOGRAPHY…" />}>
                <Suspense fallback={<LoadingFallback label="LOADING 2D PLANAR MAP…" />}>
                  <FireMap detections={detections} center={region.center} zoom={region.zoom} />
                </Suspense>
              </ClientOnly>
            )}
          </div>

          {/* Real-Time Telemetry Bar at Viewport Bottom */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface px-4 py-2.5 font-mono text-[11px] text-text-secondary">
            <div className="flex items-center gap-4">
              <span>
                OBSERVATIONS:{" "}
                <strong className="text-text">
                  {query.isLoading ? "…" : detections.length.toLocaleString()}
                </strong>
              </span>
              <span>·</span>
              <span>
                MODIS: <strong className="text-data-blue">{modisCount}</strong> (
                {percentage(modisCount)}%)
              </span>
              <span>·</span>
              <span>
                VIIRS: <strong className="text-thermal-orange">{viirsCount}</strong> (
                {percentage(viirsCount)}%)
              </span>
            </div>
            <div className="text-[10px] text-text-secondary/70">
              CLICK ANY OBSERVATION TO INSPECT DETECTOR TELEMETRY
            </div>
          </div>
        </div>

        {/* Observation Inspector & Telemetry Column */}
        <aside className="mt-6 space-y-6 lg:mt-0">
          {/* Observation Telemetry Inspector */}
          <div className="rounded-lg border border-border bg-surface p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text">
                OBSERVATION INSPECTOR
              </span>
              {selectedObs && (
                <button
                  type="button"
                  onClick={() => setSelectedObs(null)}
                  className="font-mono text-[10px] text-text-secondary hover:text-text"
                >
                  CLEAR
                </button>
              )}
            </div>

            {selectedObs ? (
              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between rounded bg-surface-elevated px-2.5 py-1.5">
                  <span className="text-[10px] text-text-secondary uppercase">SENSOR</span>
                  <span
                    className="font-bold"
                    style={{
                      color:
                        selectedObs.sensor === "MODIS"
                          ? SENSOR_META.MODIS.color
                          : SENSOR_META.VIIRS.color,
                    }}
                  >
                    {selectedObs.sensor} ({selectedObs.resolution_m} m)
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between border-b border-border/50 py-1">
                    <span className="text-text-secondary">COORDINATES</span>
                    <span className="text-text">
                      {selectedObs.lat?.toFixed(4)}, {selectedObs.lon?.toFixed(4)}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-border/50 py-1">
                    <span className="text-text-secondary">PLATFORM</span>
                    <span className="text-text">{selectedObs.satellite ?? "Not available"}</span>
                  </div>

                  <div className="flex justify-between border-b border-border/50 py-1">
                    <span className="text-text-secondary">ACQUISITION TIME</span>
                    <span className="text-text">
                      {selectedObs.acq_date} {selectedObs.acq_time} UTC
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-border/50 py-1">
                    <span className="text-text-secondary">DAY / NIGHT</span>
                    <span className="text-text">
                      {selectedObs.day_night === "N"
                        ? "NIGHT"
                        : selectedObs.day_night === "D"
                          ? "DAY"
                          : "Not available"}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-border/50 py-1">
                    <span className="text-text-secondary">BRIGHTNESS (CH 1)</span>
                    <span className="text-text">
                      {selectedObs.brightness_k != null
                        ? `${selectedObs.brightness_k.toFixed(1)} K`
                        : "Not available"}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-border/50 py-1">
                    <span className="text-text-secondary">BRIGHTNESS (CH 2)</span>
                    <span className="text-text">
                      {selectedObs.brightness2_k != null
                        ? `${selectedObs.brightness2_k.toFixed(1)} K`
                        : "Not available"}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-border/50 py-1">
                    <span className="text-text-secondary">FRP (RADIATIVE POWER)</span>
                    <span className="font-semibold text-text">
                      {selectedObs.frp_mw != null
                        ? `${selectedObs.frp_mw.toFixed(1)} MW`
                        : "Not available"}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-border/50 py-1">
                    <span className="text-text-secondary">CONFIDENCE TIER</span>
                    <span className="font-semibold uppercase text-text">
                      {selectedObs.confidence_tier ?? "Not available"}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-text-secondary">RAW SENSOR SCORE</span>
                    <span className="text-text">
                      {selectedObs.confidence_raw ?? "Not available"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded border border-dashed border-border/80 p-4 text-center font-mono text-xs text-text-secondary">
                Select any observation marker on the globe or map to view calibrated detector
                telemetry.
              </div>
            )}
          </div>

          {/* Aggregate Confidence & Agreement Breakdown */}
          <div className="rounded-lg border border-border bg-surface p-5">
            <div className="border-b border-border pb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text">
              CONFIDENCE DISTRIBUTION
            </div>

            <div className="mt-4 space-y-3">
              {(["high", "nominal", "low"] as const).map((tier) => (
                <div key={tier} className="space-y-1">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="uppercase text-text-secondary">{tier}</span>
                    <span className="font-semibold text-text">
                      {confidenceCounts[tier].toLocaleString()} (
                      {percentage(confidenceCounts[tier])}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className={`h-full rounded-full ${
                        tier === "high"
                          ? "bg-data-blue"
                          : tier === "nominal"
                            ? "bg-anomaly-amber"
                            : "bg-text-secondary"
                      }`}
                      style={{ width: `${percentage(confidenceCounts[tier])}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {detections.length === 0 && !query.isLoading && (
              <p className="mt-4 font-mono text-xs leading-relaxed text-text-secondary">
                No observations stored for this region and temporal window. Use the data pull
                controls to ingest observations from NASA FIRMS.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
