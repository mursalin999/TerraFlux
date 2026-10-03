import { useState, useMemo } from "react";
import { ArrowRight, Check, X, ShieldAlert, Sparkles, Layers } from "lucide-react";
import type { ObservationPoint } from "@/components/EarthGlobe";
import type { GridCell } from "@/lib/analyticalGrid";
import { SENSOR_META } from "@/lib/regions";

export interface ObservationInspectorProps {
  observation: ObservationPoint | null;
  cell: GridCell | null;
  allCells?: GridCell[];
  baselineWindow?: string;
  onClose: () => void;
}

interface FieldItem {
  label: string;
  value: string;
  highlight?: boolean;
}

const unavailable = "Not available";
const format = (value: number | null | undefined, suffix = "") =>
  value == null ? unavailable : `${value}${suffix}`;

function calculatePercentile(value: number, allValues: number[]): number | null {
  if (!allValues.length) return null;
  const count = allValues.filter((v) => v <= value).length;
  return Math.round((count / allValues.length) * 100);
}

// Detection Story Panel (Side Panel on Desktop, Full-height Drawer on Mobile)
function DetectionStoryModal({
  observation,
  cell,
  rank,
  agreementLevel,
  evidenceStrength,
  baselineWindow,
  onClose,
}: {
  observation: ObservationPoint | null;
  cell: GridCell | null;
  rank: number | null;
  agreementLevel: string;
  evidenceStrength: string;
  baselineWindow: string;
  onClose: () => void;
}) {
  const isPoint = Boolean(observation);
  const sensor =
    observation?.sensor ??
    (cell?.modisCount && cell?.viirsCount ? "MODIS & VIIRS" : cell?.viirsCount ? "VIIRS" : "MODIS");
  const satellite = observation?.satellite ?? "Terra/Aqua & Suomi-NPP/NOAA-20";
  const resolution = observation ? `${observation.resolution_m} m` : "1,000 m / 375 m";
  const frpText =
    observation?.frp_mw != null
      ? `${observation.frp_mw.toFixed(1)} MW FRP`
      : cell?.meanFrp != null
        ? `${cell.meanFrp.toFixed(1)} MW mean FRP`
        : null;
  const confidence = observation?.confidence_tier ?? (cell?.isAnomaly ? "elevated" : "nominal");

  // Step 1: OBSERVED
  const observedDetail =
    isPoint && observation
      ? `${observation.acq_date} · ${observation.acq_time} UTC · ${observation.lat.toFixed(4)}° N, ${observation.lon.toFixed(4)}° E`
      : cell
        ? `${baselineWindow} · Centroid ${cell.lat.toFixed(4)}° N, ${cell.lon.toFixed(4)}° E`
        : unavailable;

  // Step 2: MODIS / VIIRS
  const sensorDetail =
    isPoint && observation
      ? `${observation.sensor} detected this thermal anomaly from spacecraft ${satellite} at ${resolution} native resolution with ${confidence} confidence.`
      : cell
        ? `VIIRS (375 m) registered ${cell.viirsCount.toLocaleString()} detections; MODIS (1,000 m) registered ${cell.modisCount.toLocaleString()} detections.`
        : unavailable;

  // Step 3: COMMON GRID
  const gridCellId =
    cell?.id ??
    (observation
      ? `${(Math.floor(observation.lat / 0.15) * 0.15).toFixed(2)}_${(Math.floor(observation.lon / 0.15) * 0.15).toFixed(2)}`
      : null);
  const commonGridDetail = gridCellId
    ? `Aligned to TerraFlux common analytical geodetic cell ${gridCellId} (0.15° × 0.15° equal-angle binning, ~16.5 km) to harmonize differing native satellite footprints.`
    : unavailable;

  // Step 4: CROSS-SENSOR AGREEMENT
  let agreementDetail = unavailable;
  if (agreementLevel === "STRONG") {
    agreementDetail = `STRONG: Both MODIS (${cell?.modisCount ?? "recorded"}) and VIIRS (${cell?.viirsCount ?? "recorded"}) co-detected anomalies within this common grid cell window.`;
  } else if (agreementLevel === "MODERATE") {
    agreementDetail = `MODERATE: Multi-observation thermal detection meeting nominal cross-sensor agreement criteria.`;
  } else if (agreementLevel === "LIMITED") {
    agreementDetail = `LIMITED: Single-sensor detection by ${sensor}. No concurrent detection recorded by the secondary satellite constellation.`;
  } else if (agreementLevel === "NONE") {
    agreementDetail = `NONE: Low radiometric intensity below dual-sensor correspondence threshold.`;
  }

  // Step 5: HISTORICAL CONTEXT
  const historicalDetail =
    rank != null
      ? `${rank}th percentile versus the stated baseline window (${baselineWindow}). ${cell?.isAnomaly ? "Classified as an anomaly (≥90th percentile threshold)." : "Within expected regional baseline range."}`
      : "Not available for this selection";

  // Step 6: TERRAFLUX INTERPRETATION (fixed template filled with real numbers)
  const interpretationDetail = `A ${sensor} radiometric observation was recorded at ${resolution} native resolution with ${confidence} confidence${frpText ? ` and ${frpText}` : ""}. Cross-sensor agreement is ${agreementLevel} with ${evidenceStrength.toLowerCase()} evidence strength. This is a satellite-detected thermal anomaly, not a confirmed ground fire.`;

  const steps = [
    { title: "1. OBSERVED", detail: observedDetail },
    { title: "2. MODIS / VIIRS", detail: sensorDetail },
    { title: "3. COMMON GRID", detail: commonGridDetail },
    { title: "4. CROSS-SENSOR AGREEMENT", detail: agreementDetail },
    { title: "5. HISTORICAL CONTEXT", detail: historicalDetail },
    { title: "6. TERRAFLUX INTERPRETATION", detail: interpretationDetail, highlight: true },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-bg/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Detection story"
    >
      <button
        type="button"
        aria-label="Close detection story"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <aside className="relative flex h-full w-full max-w-lg flex-col border-l border-border bg-surface text-text shadow-2xl">
        <header className="flex items-start justify-between border-b border-border p-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-data-blue" />
              <p className="font-mono text-[10px] tracking-[0.2em] text-data-blue">
                TERRAFLUX / DETECTION STORY
              </p>
            </div>
            <h2 className="mt-1 font-headline text-xl font-semibold text-text">
              Traceable Observation Lineage
            </h2>
            <p className="mt-0.5 font-mono text-[11px] text-text-secondary">
              Deterministic, template-filled scientific explanation based on physical telemetry.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded p-1 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <ol className="flex flex-1 flex-col gap-0 overflow-y-auto p-5">
          {steps.map((step, idx) => (
            <li
              key={step.title}
              className="relative flex gap-4 pb-6 last:pb-0 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-4"
              style={{ animationDelay: `${idx * 150}ms`, animationFillMode: "both" }}
            >
              <div className="relative flex flex-col items-center">
                <span
                  className={`z-10 flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                    step.highlight
                      ? "border-anomaly-amber bg-anomaly-amber/20 text-anomaly-amber"
                      : "border-data-blue/60 bg-surface-elevated text-data-blue"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
                {idx < steps.length - 1 && (
                  <span className="absolute top-6 h-full w-px bg-border" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text">
                  {step.title}
                </h3>
                <p
                  className={`mt-1 font-mono text-xs leading-relaxed ${
                    step.highlight
                      ? "rounded border border-border/80 bg-surface-elevated p-2.5 text-text"
                      : "text-text-secondary"
                  }`}
                >
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <footer className="border-t border-border bg-surface-elevated/40 p-4 font-mono text-[10px] leading-relaxed text-text-secondary">
          <span className="font-semibold text-text">SCIENTIFIC INTEGRITY NOTICE:</span> Observations
          reflect radiometer-sensed thermal anomalies. Atmospheric conditions, cloud cover, and
          surface reflectivity can influence spaceborne readings.
        </footer>
      </aside>
    </div>
  );
}

export function ObservationInspector({
  observation,
  cell,
  allCells = [],
  baselineWindow = "Current Query Window",
  onClose,
}: ObservationInspectorProps) {
  const [storyOpen, setStoryOpen] = useState(false);
  const [mobileSnap, setMobileSnap] = useState<"peek" | "half" | "full">("half");

  // Determine active context: point observation has precedence; falls back to cell selection
  const isPoint = Boolean(observation);
  const targetCell = useMemo(() => {
    if (cell) return cell;
    if (!observation || !allCells.length) return null;
    return (
      allCells.find(
        (c) =>
          observation.lon >= c.bounds.west &&
          observation.lon <= c.bounds.east &&
          observation.lat >= c.bounds.south &&
          observation.lat <= c.bounds.north,
      ) ?? null
    );
  }, [cell, observation, allCells]);

  // Derived metrics
  const rank = useMemo(() => {
    if (!allCells.length) return null;
    const targetCount = targetCell?.detectionCount ?? (isPoint ? 1 : 0);
    return calculatePercentile(
      targetCount,
      allCells.map((c) => c.detectionCount),
    );
  }, [allCells, targetCell, isPoint]);

  const agreementLevel = useMemo(() => {
    if (targetCell?.agreement) return targetCell.agreement;
    if (observation?.confidence_tier === "high") return "STRONG";
    if (observation?.confidence_tier === "nominal") return "MODERATE";
    return "LIMITED";
  }, [targetCell, observation]);

  const evidenceStrength = useMemo(() => {
    if (agreementLevel === "STRONG") return "HIGH";
    if (agreementLevel === "MODERATE" || observation?.confidence_tier === "high") return "ELEVATED";
    if (observation?.confidence_tier === "nominal") return "MODERATE";
    return "LIMITED";
  }, [agreementLevel, observation]);

  if (!observation && !cell) return null;

  // FIELD GROUPS: SOURCE DATA (NASA FIRMS) & TERRAFLUX-DERIVED
  const sourceFields: FieldItem[] =
    isPoint && observation
      ? [
          { label: "LATITUDE", value: observation.lat.toFixed(4) },
          { label: "LONGITUDE", value: observation.lon.toFixed(4) },
          { label: "ACQUISITION DATE", value: observation.acq_date },
          { label: "ACQUISITION TIME (UTC)", value: observation.acq_time },
          { label: "SENSOR", value: observation.sensor },
          { label: "PLATFORM", value: observation.satellite },
          { label: "NATIVE RESOLUTION", value: format(observation.resolution_m, " m") },
          { label: "FRP", value: format(observation.frp_mw?.toFixed(1), " MW") },
          { label: "BRIGHTNESS", value: format(observation.brightness_k?.toFixed(1), " K") },
          { label: "CONFIDENCE", value: observation.confidence_tier.toUpperCase() },
        ]
      : cell
        ? [
            { label: "LATITUDE (CENTROID)", value: cell.lat.toFixed(4) },
            { label: "LONGITUDE (CENTROID)", value: cell.lon.toFixed(4) },
            { label: "ACQUISITION DATE", value: baselineWindow.split(" ")[0] ?? unavailable },
            { label: "ACQUISITION TIME (UTC)", value: unavailable },
            { label: "SENSOR", value: `MODIS (${cell.modisCount}) · VIIRS (${cell.viirsCount})` },
            { label: "PLATFORM", value: "Terra / Aqua / Suomi-NPP / NOAA-20" },
            { label: "NATIVE RESOLUTION", value: "1,000 m (MODIS) / 375 m (VIIRS)" },
            { label: "FRP (MEAN)", value: format(cell.meanFrp?.toFixed(1), " MW") },
            { label: "BRIGHTNESS", value: unavailable },
            { label: "CONFIDENCE", value: cell.isAnomaly ? "ELEVATED" : "NOMINAL" },
          ]
        : [];

  const derivedFields: FieldItem[] = [
    {
      label: "HISTORICAL PERCENTILE",
      value: rank != null ? `${rank}th percentile` : unavailable,
      highlight: rank != null && rank >= 90,
    },
    {
      label: "CROSS-SENSOR AGREEMENT",
      value: agreementLevel,
    },
    {
      label: "EVIDENCE STRENGTH",
      value: evidenceStrength,
    },
  ];

  // For a common-grid cell selection, add per-sensor totals
  const cellSpecificFields: FieldItem[] = targetCell
    ? [
        { label: "MODIS DETECTIONS", value: targetCell.modisCount.toLocaleString() },
        { label: "VIIRS DETECTIONS", value: targetCell.viirsCount.toLocaleString() },
        { label: "TOTAL CELL DETECTIONS", value: targetCell.detectionCount.toLocaleString() },
      ]
    : [];

  const renderFieldList = (fields: FieldItem[]) => (
    <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
      {fields.map((field) => (
        <div key={field.label} className="min-w-0">
          <dt className="font-mono text-[9px] uppercase tracking-wider text-text-secondary">
            {field.label}
          </dt>
          <dd
            className={`mt-0.5 truncate font-mono text-xs ${
              field.highlight ? "font-semibold text-anomaly-amber" : "text-text"
            }`}
          >
            {field.value}
          </dd>
        </div>
      ))}
    </div>
  );

  const mainContent = (
    <div className="flex flex-col gap-4 p-4 font-mono">
      {/* SOURCE DATA GROUP */}
      <section>
        <div className="mb-2 flex items-center justify-between border-b border-border/50 pb-1">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-text-secondary">
            SOURCE DATA (NASA FIRMS)
          </span>
          {isPoint && observation && (
            <span
              className="text-[9px] font-bold"
              style={{
                color:
                  observation.sensor === "MODIS"
                    ? SENSOR_META.MODIS.color
                    : SENSOR_META.VIIRS.color,
              }}
            >
              {observation.sensor}
            </span>
          )}
        </div>
        <dl>{renderFieldList(sourceFields)}</dl>
      </section>

      {/* TERRAFLUX-DERIVED GROUP */}
      <section className="border-t border-border pt-3">
        <div className="mb-2 flex items-center gap-1.5 border-b border-border/50 pb-1">
          <Layers className="h-3 w-3 text-agreement-teal" />
          <span className="text-[9px] font-semibold uppercase tracking-wider text-text-secondary">
            TERRAFLUX-DERIVED
          </span>
        </div>
        <dl>{renderFieldList(derivedFields)}</dl>
      </section>

      {/* CELL SPECIFIC TOTALS (when common grid cell is selected or associated) */}
      {targetCell && (
        <section className="rounded border border-border/70 bg-surface-elevated/40 p-2.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-text-secondary">
              COMMON GRID CELL · {targetCell.id}
            </span>
            <span className="text-[9px] text-text-secondary">0.15°</span>
          </div>
          <dl>{renderFieldList(cellSpecificFields)}</dl>
        </section>
      )}

      {/* ACTION: OPEN DETECTION STORY */}
      <button
        type="button"
        onClick={() => setStoryOpen(true)}
        className="mt-1 flex items-center justify-between rounded border border-data-blue/50 bg-data-blue/10 px-3.5 py-2.5 font-mono text-[11px] font-semibold tracking-wider text-data-blue transition-all hover:border-data-blue hover:bg-data-blue/20"
      >
        <span>DETECTION STORY</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <>
      {/* DESKTOP: Floating panel on the right (max 340px) that never covers globe center */}
      <aside
        className="pointer-events-auto fixed right-4 top-20 z-30 hidden w-[340px] max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-surface/95 shadow-2xl backdrop-blur-xl lg:block"
        aria-label="Observation inspector"
      >
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-data-blue animate-pulse" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text">
              OBSERVATION
            </span>
          </div>
          <button
            type="button"
            aria-label="Close inspector"
            onClick={onClose}
            className="rounded p-1 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="max-h-[calc(100vh-140px)] overflow-y-auto">{mainContent}</div>
      </aside>

      {/* MOBILE: Bottom drawer with peek, half, and full snap points */}
      <div
        className={`pointer-events-auto fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-border bg-surface text-text shadow-2xl transition-all duration-300 lg:hidden ${
          mobileSnap === "peek" ? "h-[140px]" : mobileSnap === "half" ? "h-[50vh]" : "h-[88vh]"
        }`}
        aria-label="Observation inspector drawer"
      >
        {/* Drag handle / snap toggle bar */}
        <div className="flex shrink-0 flex-col items-center pt-2.5 pb-1">
          <button
            type="button"
            aria-label="Toggle snap height"
            onClick={() =>
              setMobileSnap((s) => (s === "peek" ? "half" : s === "half" ? "full" : "peek"))
            }
            className="h-1.5 w-12 rounded-full bg-border transition-colors hover:bg-text-secondary"
          />
        </div>

        <header className="flex shrink-0 items-center justify-between px-4 py-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text">
              OBSERVATION
            </span>
            <div className="flex gap-1 font-mono text-[9px]">
              {(["peek", "half", "full"] as const).map((snap) => (
                <button
                  key={snap}
                  type="button"
                  onClick={() => setMobileSnap(snap)}
                  className={`rounded px-1.5 py-0.5 uppercase ${
                    mobileSnap === snap ? "bg-data-blue/20 text-data-blue" : "text-text-secondary"
                  }`}
                >
                  {snap}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            aria-label="Close observation inspector"
            onClick={onClose}
            className="rounded p-1 text-text-secondary hover:text-text"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">{mainContent}</div>
      </div>

      {/* DETECTION STORY TIMELINE MODAL */}
      {storyOpen && (
        <DetectionStoryModal
          observation={observation}
          cell={targetCell}
          rank={rank}
          agreementLevel={agreementLevel}
          evidenceStrength={evidenceStrength}
          baselineWindow={baselineWindow}
          onClose={() => setStoryOpen(false)}
        />
      )}
    </>
  );
}

export default ObservationInspector;
