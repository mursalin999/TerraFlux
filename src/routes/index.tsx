import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { Suspense, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Calendar,
  Layers,
  Database,
  RefreshCw,
} from "lucide-react";
import { LogoWithWordmark } from "@/components/LogoMark";
import {
  getHomeMissionTelemetry,
  getRecentGlobeObservations,
  getGlobalCells48h,
  triggerGlobalPull,
  type HomeMissionTelemetry,
} from "@/lib/firelens.functions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import HomeEarthGlobe from "@/components/HomeEarthGlobe";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TerraFlux: Earth's thermal story, harmonized" },
      {
        name: "description",
        content:
          "Explore harmonized MODIS and VIIRS active-fire observations from NASA FIRMS through a common analytical framework.",
      },
      { property: "og:title", content: "TerraFlux: Earth's thermal story, harmonized" },
      {
        property: "og:description",
        content:
          "Explore harmonized MODIS and VIIRS active-fire observations from NASA FIRMS through a common analytical framework.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

type LoadingStage =
  "INITIALIZING EARTH" | "LOADING OBSERVATIONS" | "SYNCING SENSOR LAYERS" | "READY";

function GlobeFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[#030711]">
      <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-border/40 bg-surface/30 sm:h-96 sm:w-96 lg:translate-x-[18%]">
        <div className="h-60 w-60 rounded-full border border-dashed border-data-blue/30 sm:h-80 sm:w-80" />
        <div className="absolute font-mono text-[10px] uppercase tracking-widest text-text-secondary">
          CALIBRATING 3D GEOID…
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [tourPaused, setTourPaused] = useState(false);
  const tourCaptions = [
    "Earth: start with the full stored observation view.",
    "Fly to Bangladesh: inspect the selected region.",
    "MODIS only: hollow blue rings show 1 km observations.",
    "VIIRS only: orange dots show 375 m observations.",
    "Harmonized: derived activity combines both sensors.",
    "Agreement: correspondence between satellite observations.",
    "Largest gap day: compare the live daily sensor totals.",
    "Methods: read what TerraFlux knows and does not know.",
  ];
  const [loadingStage, setLoadingStage] = useState<LoadingStage>("INITIALIZING EARTH");
  const [showLoaderBadge, setShowLoaderBadge] = useState(false);

  // Real telemetry and observations queries
  const telemetryQuery = useQuery({
    queryKey: ["home-mission-telemetry"],
    queryFn: () => getHomeMissionTelemetry(),
    staleTime: 60000,
  });

  const observationsQuery = useQuery({
    queryKey: ["home-globe-observations"],
    queryFn: () => getRecentGlobeObservations(),
    staleTime: 60000,
  });

  const globalCellsQuery = useQuery({
    queryKey: ["home-global-cells-48h"],
    queryFn: () => getGlobalCells48h(),
    staleTime: 60000,
  });

  const telemetry: HomeMissionTelemetry = telemetryQuery.data ?? {
    status: telemetryQuery.isError ? "unavailable" : "ok",
    totalDetections: 0,
    modisCount: 0,
    viirsCount: 0,
    latestAcqDate: null,
    lastIngestTime: null,
    baselineDays: 0,
    regionsCovered: 0,
    firstAcqDate: null,
    hasHarmonized: false,
    isRecentPull: false,
  };

  const observations = observationsQuery.data ?? [];
  const globalCells = globalCellsQuery.data?.cells ?? [];
  const refreshGlobalLayer = async () => {
    const secret = window.prompt("Admin token");
    if (!secret) return;
    await triggerGlobalPull({ data: { days: 2, dry_run: false, secret } });
    await globalCellsQuery.refetch();
  };

  // Skip loader if ready in under 300 ms
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tour") === "1") setTourStep(0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTourStep(null);
      if (event.key === "ArrowRight" && tourStep != null)
        setTourStep((step) => Math.min(7, (step ?? 0) + 1));
      if (event.key === "ArrowLeft" && tourStep != null)
        setTourStep((step) => Math.max(0, (step ?? 0) - 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tourStep]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadingStage !== "READY") {
        setShowLoaderBadge(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [loadingStage]);

  const handleStageChange = (stage: LoadingStage) => {
    setLoadingStage(stage);
  };

  const isDataAvailable = telemetry.status === "ok" && !telemetryQuery.isError;
  const isModisAvailable = isDataAvailable && telemetry.modisCount > 0;
  const isViirsAvailable = isDataAvailable && telemetry.viirsCount > 0;
  const isHarmonizedActive = isDataAvailable && telemetry.hasHarmonized;

  return (
    <div className="relative flex h-[100dvh] w-screen flex-col justify-between overflow-hidden bg-bg text-text select-none">
      {/* 3D Earth Globe Canvas Background */}
      <div className="absolute inset-0 z-0">
        <ClientOnly fallback={<GlobeFallback />}>
          <Suspense fallback={<GlobeFallback />}>
            <HomeEarthGlobe
              observations={observations}
              globalCells={globalCells}
              globalFetchedAt={globalCellsQuery.data?.fetchedAt ?? null}
              isLoadingObservations={observationsQuery.isLoading}
              observationError={
                observationsQuery.isError
                  ? "Unable to read stored observations from database."
                  : null
              }
              isPanelOpen={mobileMenuOpen}
              onLoadingStageChange={handleStageChange}
            />
          </Suspense>
        </ClientOnly>
      </div>

      {/* Subtle Dark Gradient behind Text for Contrast (Desktop: left half, Mobile: bottom) */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-full bg-gradient-to-r from-bg via-bg/85 to-transparent lg:block lg:w-[54%]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[55%] bg-gradient-to-t from-bg via-bg/90 to-transparent lg:hidden"
        aria-hidden="true"
      />

      {/* Top Header / Navigation Bar */}
      <header className="relative z-30 border-b border-border/80 bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Top-left: TerraFlux mark + wordmark with "EARTH OBSERVATION / FIRE ACTIVITY" */}
          <Link to="/" className="flex items-center">
            <LogoWithWordmark />
          </Link>

          {/* Top-right nav: EXPLORE, DATA, METHODOLOGY, ABOUT */}
          <nav className="hidden items-center gap-2 font-mono text-xs sm:flex" aria-label="Main">
            <Link
              to="/explore"
              search={{}}
              className="rounded px-3 py-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-text"
            >
              EXPLORE
            </Link>

            {/* DATA dropdown leading to Calendar, Compare, and Provenance */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded px-3 py-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-text"
                >
                  <span>DATA</span>
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 border-border bg-surface-elevated font-mono text-xs text-text shadow-2xl"
              >
                <DropdownMenuItem asChild>
                  <Link
                    to="/calendar"
                    search={{}}
                    className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface"
                  >
                    <RefreshCw className="h-4 w-4 text-data-blue" />
                    <div className="flex flex-col">
                      <span className="font-semibold">Fetch NASA FIRMS</span>
                      <span className="text-[10px] text-text-secondary">
                        Any region and date range
                      </span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/calendar"
                    search={{}}
                    className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface"
                  >
                    <Calendar className="h-4 w-4 text-thermal-orange" />
                    <div className="flex flex-col">
                      <span className="font-semibold">Observation Calendar</span>
                      <span className="text-[10px] text-text-secondary">
                        Temporal density matrix
                      </span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/compare"
                    search={{}}
                    className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface"
                  >
                    <Layers className="h-4 w-4 text-data-blue" />
                    <div className="flex flex-col">
                      <span className="font-semibold">Sensor Comparison</span>
                      <span className="text-[10px] text-text-secondary">
                        MODIS vs VIIRS metrics
                      </span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/about"
                    search={{}}
                    className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface"
                  >
                    <Database className="h-4 w-4 text-agreement-teal" />
                    <div className="flex flex-col">
                      <span className="font-semibold">NASA FIRMS Provenance</span>
                      <span className="text-[10px] text-text-secondary">Data origin & limits</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/methodology"
              search={{}}
              className="rounded px-3 py-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-text"
            >
              METHODOLOGY
            </Link>

            <Link
              to="/about"
              search={{}}
              className="rounded px-3 py-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-text"
            >
              ABOUT
            </Link>
          </nav>

          {/* Mobile Menu Icon */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="rounded border border-border bg-surface p-2 text-text"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="border-b border-border bg-surface px-4 py-3 sm:hidden">
            <nav className="flex flex-col space-y-1 font-mono text-xs">
              <Link
                to="/"
                search={{ tour: "1" }}
                className="inline-flex min-h-11 items-center justify-center rounded border border-agreement-teal px-4 py-2 font-mono text-xs font-semibold tracking-wider text-agreement-teal transition-colors hover:bg-agreement-teal/10"
              >
                GUIDED TOUR
              </Link>
              <Link
                to="/explore"
                search={{}}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded px-3 py-2 text-text hover:bg-surface-elevated"
              >
                EXPLORE
              </Link>
              <Link
                to="/calendar"
                search={{}}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded px-3 py-2 text-text hover:bg-surface-elevated"
              >
                DATA · FETCH NASA FIRMS
              </Link>
              <Link
                to="/calendar"
                search={{}}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded px-3 py-2 text-text hover:bg-surface-elevated"
              >
                DATA · CALENDAR MATRIX
              </Link>
              <Link
                to="/compare"
                search={{}}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded px-3 py-2 text-text hover:bg-surface-elevated"
              >
                DATA · SENSOR COMPARISON
              </Link>
              <Link
                to="/methodology"
                search={{}}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded px-3 py-2 text-text hover:bg-surface-elevated"
              >
                METHODOLOGY
              </Link>
              <Link
                to="/about"
                search={{}}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded px-3 py-2 text-text hover:bg-surface-elevated"
              >
                ABOUT
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Real Loading Sequence HUD Badge (skips if <300ms) */}
      {showLoaderBadge && loadingStage !== "READY" && (
        <div className="pointer-events-none absolute right-4 top-20 z-40 flex min-h-11 items-center gap-2 rounded border border-border bg-surface/90 px-3 py-2 font-mono text-[11px] text-text backdrop-blur-md sm:right-8">
          <span className="h-2 w-2 rounded-full bg-data-blue animate-pulse" />
          <span className="font-semibold uppercase tracking-wider">{loadingStage}</span>
        </div>
      )}

      {/* Center-Left Content Section */}
      <section className="relative z-20 mx-auto flex w-full max-w-screen-2xl flex-1 items-end px-4 pb-8 sm:px-6 lg:items-center lg:pb-0 lg:px-8">
        <div className="max-w-xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-data-blue">
            <span>EARTH'S THERMAL STORY</span>
          </div>

          {/* Headline */}
          <h1 className="mt-3 font-headline text-3xl font-semibold leading-[1.1] tracking-tight text-text sm:text-5xl lg:text-5xl">
            Two satellites.
            <br />
            One analytical view.
          </h1>

          {/* Body */}
          <p className="mt-4 font-sans text-xs leading-relaxed text-text-secondary sm:text-base sm:leading-relaxed">
            Explore harmonized MODIS and VIIRS active-fire observations through a common analytical
            framework designed to reveal patterns, differences and unusual periods across Earth.
          </p>

          {!telemetryQuery.isPending && telemetryQuery.data && (
            <div className="mt-6 rounded border border-border bg-surface/80 p-3 font-mono text-[11px] backdrop-blur-sm">
              <div className="font-semibold uppercase tracking-wider text-text">SNAPSHOT</div>
              <p className="mt-2 text-text-secondary">
                {telemetry.totalDetections.toLocaleString()} detections · {telemetry.regionsCovered} regions
              </p>
              <p className="mt-1 text-text-secondary">
                MODIS {telemetry.modisCount.toLocaleString()} · VIIRS {telemetry.viirsCount.toLocaleString()}
              </p>
              <p className="mt-1 text-text-secondary">
                {telemetry.firstAcqDate ?? "—"} → {telemetry.latestAcqDate ?? "—"} · {telemetry.baselineDays} days stored
              </p>
            </div>
          )}

          <div className="mt-5 max-w-lg border-l-2 border-agreement-teal pl-3 text-xs leading-relaxed text-text-secondary sm:text-sm">
            <p>
              <strong className="text-text">WHO IT&apos;S FOR:</strong> Researchers, students and
              local analysts who need to compare MODIS and VIIRS fire records without learning two
              data formats.
            </p>
            <p className="mt-2">
              <strong className="text-text">WHY BANGLADESH:</strong> Fire detections in South Asia
              change strongly with season and cloud cover. TerraFlux makes those differences visible
              so a quiet or busy day is not over-read.
            </p>
            <p className="mt-2">
              <strong className="text-text">WHAT IT IS NOT:</strong> Not an alert system and not a
              confirmed-fire map.
            </p>
            {/* [TEAM EDIT: add one real, verified local use case] */}
          </div>

          {/* Primary CTA and Secondary Link */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              to="/explore"
              search={{}}
              className="inline-flex items-center justify-center rounded bg-data-blue px-5 py-2.5 font-mono text-xs font-semibold text-bg transition-opacity hover:opacity-90 active:scale-[0.98]"
            >
              EXPLORE EARTH →
            </Link>
            <Link
              to="/methodology"
              search={{}}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-text-secondary transition-colors hover:text-text"
            >
              <span>HOW IT WORKS</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {tourStep != null && (
        <div
          className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-xl rounded-lg border border-agreement-teal/60 bg-surface/95 p-4 shadow-2xl backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Guided tour"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-agreement-teal">
                GUIDED TOUR · STEP {tourStep + 1} OF 8
              </p>
              <p className="mt-2 text-sm text-text">
                {tourPaused ? "Tour paused. Resume when ready." : tourCaptions[tourStep]}
              </p>
            </div>
            <button
              type="button"
              aria-label="Exit guided tour"
              onClick={() => setTourStep(null)}
              className="min-h-11 min-w-11 rounded border border-border text-text"
            >
              ESC
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setTourPaused((paused) => !paused)}
              className="min-h-11 rounded border border-border px-3 text-xs text-text"
            >
              {tourPaused ? "RESUME" : "PAUSE"}
            </button>
            <button
              type="button"
              disabled={tourStep === 0}
              onClick={() => setTourStep((step) => Math.max(0, (step ?? 0) - 1))}
              className="min-h-11 rounded border border-border px-3 text-xs text-text disabled:opacity-40"
            >
              BACK
            </button>
            <button
              type="button"
              onClick={() => setTourStep((step) => (step != null && step < 7 ? step + 1 : null))}
              className="min-h-11 rounded bg-agreement-teal px-3 text-xs font-semibold text-bg"
            >
              {tourStep === 7 ? "DONE" : "NEXT"}
            </button>
          </div>
        </div>
      )}

      {/* Mission Status Bar (Thin strip at the bottom; compact scrollable chips on mobile) */}
      <footer className="relative z-30 border-t border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-11 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
          <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 py-2 font-mono text-[11px] text-text-secondary sm:gap-x-4 lg:justify-between">
            {/* DATA SOURCE: NASA FIRMS */}
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="text-text-secondary">DATA SOURCE:</span>
              <strong className="text-text">NASA FIRMS</strong>
              <button
                type="button"
                onClick={refreshGlobalLayer}
                className="ml-2 min-h-9 rounded border border-border px-2 text-[10px] text-text-secondary hover:border-data-orange hover:text-text"
              >
                REFRESH GLOBAL LAYER
              </button>
              {telemetryQuery.isPending ? (
                <span
                  className="inline-flex items-center gap-1.5 text-text-secondary"
                  aria-label="Loading data source status"
                >
                  <span className="inline-block h-2 w-16 animate-pulse rounded bg-surface-elevated" />
                  <span>· LOADING</span>
                </span>
              ) : telemetry.status === "unavailable" ? (
                <span className="font-semibold text-critical-red" title={telemetry.errorMessage ?? "Stored data query failed"}>· DATA SOURCE UNAVAILABLE</span>
              ) : (
                <>
                  <span className="text-text-secondary/70">·</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wider ${
                      telemetry.isRecentPull
                        ? "border border-agreement-teal/40 bg-agreement-teal/15 font-bold text-agreement-teal"
                        : "border border-border bg-surface font-medium text-text-secondary"
                    }`}
                  >
                    STORED RECORDS
                  </span>
                  {telemetry.latestAcqDate && (
                    <span className="text-[10px] text-text-secondary">
                      ({telemetry.latestAcqDate})
                    </span>
                  )}
                </>
              )}
            </div>

            <span className="hidden text-border lg:inline">|</span>

            {/* SENSOR: MODIS */}
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full border border-data-blue" />
              <span>MODIS:</span>
              <span
                className={
                  isModisAvailable ? "font-semibold text-data-blue" : "text-text-secondary/60"
                }
              >
                {telemetryQuery.isPending
                  ? "LOADING"
                  : isModisAvailable
                    ? `AVAILABLE (${telemetry.modisCount.toLocaleString()})`
                    : telemetryQuery.isError
                      ? "UNAVAILABLE — QUERY ERROR"
                      : "NO STORED ROWS"}
              </span>
            </div>

            <span className="hidden text-border lg:inline">|</span>

            {/* SENSOR: VIIRS */}
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-thermal-orange" />
              <span>VIIRS:</span>
              <span
                className={
                  isViirsAvailable ? "font-semibold text-thermal-orange" : "text-text-secondary/60"
                }
              >
                {telemetryQuery.isPending
                  ? "LOADING"
                  : isViirsAvailable
                    ? `AVAILABLE (${telemetry.viirsCount.toLocaleString()})`
                    : telemetryQuery.isError
                      ? "UNAVAILABLE — QUERY ERROR"
                      : "NO STORED ROWS"}
              </span>
            </div>

            <span className="hidden text-border lg:inline">|</span>

            {/* HARMONIZATION */}
            <div className="flex shrink-0 items-center gap-1.5">
              <span>HARMONIZATION:</span>
              <span
                className={
                  isHarmonizedActive
                    ? "font-semibold text-agreement-teal"
                    : "text-text-secondary/60"
                }
              >
                {telemetryQuery.isPending
                  ? "LOADING"
                  : isHarmonizedActive
                    ? "ACTIVE"
                    : telemetryQuery.isError
                      ? "UNAVAILABLE — QUERY ERROR"
                      : "NO STORED ROWS"}
              </span>
            </div>

            <span className="hidden text-border lg:inline">|</span>

            {/* HISTORICAL BASELINE */}
            <div className="flex shrink-0 items-center gap-1.5">
              <span>HISTORICAL:</span>
              <span className="text-text">
                {telemetryQuery.isPending
                  ? "LOADING"
                  : telemetry.baselineDays > 0
                    ? `${telemetry.baselineDays} DAYS${telemetry.baselineDays < 365 ? " · LIMITED" : ""}`
                    : telemetryQuery.isError
                      ? "UNAVAILABLE — QUERY ERROR"
                      : "NO STORED ROWS"}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
