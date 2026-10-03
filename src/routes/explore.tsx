import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronDown, Database, Globe, Info, List, Map as MapIcon, RefreshCw, SlidersHorizontal, Table2, X } from "lucide-react";
import { REGIONS, getRegion, parseBbox, SENSOR_META } from "@/lib/regions";
import { DateRangeInputs, RegionSelect, ConfidenceFilter, defaultFilters, type FireFilters } from "@/components/FireControls";
import { backfillFireData, fetchFireData, getDailyCounts, getDetections } from "@/lib/firelens.functions";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { type ObservationPoint } from "@/components/EarthGlobe";
import ObservationInspector from "@/components/ObservationInspector";
import ActivityTimeline, { ActivityAnalysis } from "@/components/ActivityTimeline";

const EarthGlobe = lazy(() => import("@/components/EarthGlobe"));
const FireMap = lazy(() => import("@/components/FireMap"));

export const Route = createFileRoute("/explore")({
  head: () => ({ meta: [{ title: "Explore — TerraFlux" }, { name: "description", content: "Explore harmonized MODIS and VIIRS fire observations on one Earth." }] }),
  component: Explore,
});

type ViewMode = "native" | "grid" | "harmonized" | "anomaly" | "agreement";
type SurfaceMode = "3d" | "2d";
type PullState = { status: "idle" } | { status: "running"; label: string } | { status: "done"; stored: number } | { status: "error"; message: string };

const VIEW_COPY: Record<ViewMode, { label: string; caption: string }> = {
  native: { label: "NATIVE", caption: "Raw observations in native sensor styling." },
  grid: { label: "COMMON GRID", caption: "Both sensors aggregated into the existing analytical grid." },
  harmonized: { label: "HARMONIZED", caption: "both sensors on one common grid." },
  anomaly: { label: "ANOMALY", caption: "Historical percentile anomaly · baseline window: available archive." },
  agreement: { label: "AGREEMENT", caption: "Cross-sensor correspondence on the common analytical grid." },
};

function Loading({ label }: { label: string }) {
  return <div className="flex h-full items-center justify-center bg-bg font-mono text-xs uppercase tracking-widest text-text-secondary"><span className="mr-3 size-4 animate-spin rounded-full border-2 border-data-blue border-t-transparent" />{label}</div>;
}

function Explore() {
  const [filters, setFilters] = useState<FireFilters>(defaultFilters);
  const [view, setView] = useState<ViewMode>("harmonized");
  const [surface, setSurface] = useState<SurfaceMode>("3d");
  const [sensor, setSensor] = useState<"MODIS" | "VIIRS" | "BOTH">("BOTH");
  const [timeScale, setTimeScale] = useState("daily");
  const [selectedObs, setSelectedObs] = useState<ObservationPoint | null>(null);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [tableOpen, setTableOpen] = useState(false);
  const [pull, setPull] = useState<PullState>({ status: "idle" });
  const [analysisDate, setAnalysisDate] = useState<string | null>(null);
  const region = getRegion(filters.regionId);
  const bounds = parseBbox(region.bbox);
  const queryClient = useQueryClient();
  const runFetch = useServerFn(fetchFireData);
  const runBackfill = useServerFn(backfillFireData);
  const query = useQuery({ queryKey: ["explore", filters, sensor, timeScale], queryFn: () => getDetections({ data: { ...bounds, start_date: filters.startDate, end_date: filters.endDate, confidence: filters.confidence, sensors: sensor === "BOTH" ? undefined : [sensor] } }) });
  const detections = useMemo(() => query.data ?? [], [query.data]);
  const dailyQuery = useQuery({ queryKey: ["daily-counts", filters.regionId, filters.startDate, filters.endDate], queryFn: () => getDailyCounts({ data: { ...bounds, start_date: filters.startDate, end_date: filters.endDate } }) });
  const activityDays = dailyQuery.data ?? [];
  const pullRecent = async () => { setPull({ status: "running", label: "Fetching last 3 days" }); try { const r = await runFetch({ data: { bbox: region.bbox, days: 3 } }); await queryClient.invalidateQueries({ queryKey: ["explore"] }); setPull({ status: "done", stored: r.stored }); } catch (e) { setPull({ status: "error", message: e instanceof Error ? e.message : "Pull failed" }); } };
  const pullFull = async () => { setPull({ status: "running", label: "Loading full range from NASA FIRMS" }); try { const r = await runBackfill({ data: { bbox: region.bbox, start_date: filters.startDate, end_date: filters.endDate } }); await queryClient.invalidateQueries({ queryKey: ["explore"] }); setPull({ status: "done", stored: r.stored }); } catch (e) { setPull({ status: "error", message: e instanceof Error ? e.message : "Pull failed" }); } };

  const controls = <div className="flex flex-col gap-4">
    <RegionSelect value={filters.regionId} onChange={(regionId) => { setFilters((f) => ({ ...f, regionId })); setSelectedObs(null); }} />
    <DateRangeInputs startDate={filters.startDate} endDate={filters.endDate} onStart={(startDate) => setFilters((f) => ({ ...f, startDate }))} onEnd={(endDate) => setFilters((f) => ({ ...f, endDate }))} />
    <label className="flex flex-col gap-1"><span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">TIME SCALE</span><select value={timeScale} onChange={(e) => setTimeScale(e.target.value)} className="rounded border border-border bg-surface px-2 py-1.5 font-mono text-xs text-text"><option>daily</option><option>weekly</option><option>monthly</option></select></label>
    <label className="flex flex-col gap-1"><span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">SENSOR</span><select value={sensor} onChange={(e) => setSensor(e.target.value as typeof sensor)} className="rounded border border-border bg-surface px-2 py-1.5 font-mono text-xs text-text"><option value="BOTH">MODIS + VIIRS</option><option>MODIS</option><option>VIIRS</option></select></label>
    <ConfidenceFilter value={filters.confidence} onChange={(confidence) => setFilters((f) => ({ ...f, confidence }))} />
    <div className="flex flex-col gap-2 border-t border-border pt-3"><span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">DATA PULL</span><button type="button" onClick={pullRecent} disabled={pull.status === "running"} className="flex items-center justify-center gap-2 rounded bg-data-blue px-3 py-2 font-mono text-xs font-semibold text-bg disabled:opacity-50"><RefreshCw className={pull.status === "running" ? "animate-spin" : ""} data-icon="inline-start" />FETCH LAST 3 DAYS</button><button type="button" onClick={pullFull} disabled={pull.status === "running"} className="rounded border border-border px-3 py-2 font-mono text-xs text-text disabled:opacity-50">LOAD FULL RANGE FROM NASA FIRMS</button><p className="font-mono text-[10px] leading-relaxed text-text-secondary">{pull.status === "running" ? pull.label : pull.status === "done" ? `${pull.stored.toLocaleString()} records committed.` : pull.status === "error" ? pull.message : "NASA FIRMS · live source"}</p></div>
  </div>;

  return <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1800px] flex-col gap-4 px-3 py-4 sm:px-6 lg:px-8">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2"><span className="font-mono text-[10px] tracking-[0.24em] text-data-blue">PHASE 03 / EXPLORE</span><span className="rounded-full border border-agreement-teal/40 px-2 py-0.5 font-mono text-[9px] text-agreement-teal">LIVE</span></div><h1 className="mt-1 font-headline text-2xl font-semibold text-text sm:text-3xl">One Earth. Two Eyes.</h1><p className="font-mono text-xs text-text-secondary">{region.name} · {filters.startDate} → {filters.endDate} · {detections.length.toLocaleString()} visible observations</p></div><div className="flex items-center gap-2"><div className="flex rounded border border-border bg-surface p-1"><button type="button" aria-pressed={surface === "3d"} onClick={() => setSurface("3d")} className={`rounded px-2.5 py-1 font-mono text-xs ${surface === "3d" ? "bg-data-blue text-bg" : "text-text-secondary"}`}><Globe data-icon="inline-start" /> 3D</button><button type="button" aria-pressed={surface === "2d"} onClick={() => setSurface("2d")} className={`rounded px-2.5 py-1 font-mono text-xs ${surface === "2d" ? "bg-data-blue text-bg" : "text-text-secondary"}`}><MapIcon data-icon="inline-start" /> 2D</button></div><Drawer open={!controlsOpen} onOpenChange={(open) => setControlsOpen(!open)}><DrawerTrigger asChild><button type="button" className="flex items-center gap-2 rounded border border-border bg-surface px-3 py-2 font-mono text-xs text-text lg:hidden"><SlidersHorizontal data-icon="inline-start" />CONTROLS</button></DrawerTrigger><DrawerContent className="border-border bg-surface px-5 pb-8 text-text"><DrawerHeader className="px-0"><DrawerTitle className="font-headline text-lg">Workspace controls</DrawerTitle><DrawerDescription className="font-mono text-xs text-text-secondary">Filter the visible scientific workspace.</DrawerDescription></DrawerHeader>{controls}</DrawerContent></Drawer></div></header>
    <section className="relative flex min-h-[650px] flex-1 overflow-hidden rounded-lg border border-border bg-surface"><div className="absolute left-3 top-3 z-10 hidden w-64 rounded-lg border border-border bg-surface/90 p-3 shadow-2xl backdrop-blur-md lg:block"><button type="button" onClick={() => setControlsOpen(!controlsOpen)} className="mb-3 flex w-full items-center justify-between font-mono text-[11px] font-semibold tracking-wider text-text"><span>CONTROLS</span><ChevronDown className={controlsOpen ? "rotate-180" : ""} /></button>{controlsOpen && controls}</div><div className="absolute left-1/2 top-3 z-10 flex -translate-x-1/2 rounded-full border border-border bg-surface/90 p-1 shadow-xl backdrop-blur-md" role="tablist" aria-label="Sensor comparison"><span className="sr-only">Sensor view</span>{(["MODIS", "VIIRS", "HARMONIZED"] as const).map((item) => <button key={item} type="button" onClick={() => setSensor(item === "HARMONIZED" ? "BOTH" : item)} className={`rounded-full px-3 py-1.5 font-mono text-[10px] tracking-wider transition-all duration-500 ${((item === "HARMONIZED" && view === "harmonized") || (item !== "HARMONIZED" && sensor === item)) ? "bg-text text-bg" : "text-text-secondary hover:text-text"}`}>{item}</button>)}</div><div className="h-[calc(100vh-14rem)] min-h-[650px] w-full">{surface === "3d" ? <ClientOnly fallback={<Loading label="INITIALIZING GLOBE" />}><Suspense fallback={<Loading label="RENDERING EARTH" />}><EarthGlobe observations={detections} selectedRegion={region} selectedObservation={selectedObs} onSelectObservation={setSelectedObs} sensorMode={sensor} view={view} /></Suspense></ClientOnly> : <ClientOnly fallback={<Loading label="LOADING MAP" />}><Suspense fallback={<Loading label="LOADING CARTOGRAPHY" />}><FireMap detections={detections} center={region.center} zoom={region.zoom} /></Suspense></ClientOnly>}</div><div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded border border-border bg-surface/90 px-3 py-2 backdrop-blur-md"><div className="flex flex-wrap items-center gap-1">{(Object.keys(VIEW_COPY) as ViewMode[]).map((key) => <button key={key} type="button" aria-pressed={view === key} onClick={() => setView(key)} className={`rounded px-2 py-1 font-mono text-[10px] ${view === key ? "bg-text text-bg" : "text-text-secondary hover:text-text"}`}>{VIEW_COPY[key].label}</button>)}</div><p className="font-mono text-[10px] text-text-secondary">{VIEW_COPY[view].caption}</p></div></section>
    <ActivityTimeline days={activityDays} onSelectDate={setAnalysisDate} />
    <ObservationInspector observation={selectedObs} onClose={() => setSelectedObs(null)} />
    {analysisDate && <ActivityAnalysis date={analysisDate} days={activityDays} onClose={() => setAnalysisDate(null)} onFlyTo={() => setAnalysisDate(null)} />}
    <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] text-text-secondary"><button type="button" onClick={() => setTableOpen(!tableOpen)} className="flex items-center gap-2 rounded border border-border px-3 py-2 text-text"><Table2 data-icon="inline-start" />VIEW AS TABLE ({detections.length})</button><span><Info className="mr-1 inline-block" />Cross-sensor agreement indicates correspondence between satellite observations. It does not confirm a ground fire.</span></div>
    {tableOpen && <div className="overflow-auto rounded-lg border border-border bg-surface"><table className="w-full min-w-[760px] text-left font-mono text-xs"><caption className="sr-only">Observations in current selection</caption><thead className="border-b border-border text-[10px] uppercase text-text-secondary"><tr>{["Sensor", "Date", "Coordinates", "Platform", "FRP", "Confidence"].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead><tbody>{detections.slice(0, 500).map((d, i) => <tr key={`${d.sensor}-${d.acq_date}-${d.acq_time}-${i}`} className="border-b border-border/50"><td className="px-3 py-2" style={{ color: SENSOR_META[d.sensor].color }}>{d.sensor}</td><td className="px-3 py-2">{d.acq_date} {d.acq_time}</td><td className="px-3 py-2">{d.lat.toFixed(3)}, {d.lon.toFixed(3)}</td><td className="px-3 py-2">{d.satellite}</td><td className="px-3 py-2">{d.frp_mw == null ? "—" : `${d.frp_mw.toFixed(1)} MW`}</td><td className="px-3 py-2 uppercase">{d.confidence_tier}</td></tr>)}</tbody></table></div>}
  </main>;
}

void REGIONS;
void Database;
void List;
void X;
void DrawerDescription;
void DrawerHeader;
void DrawerTitle;
void DrawerContent;
void DrawerTrigger;

export type { ViewMode };
