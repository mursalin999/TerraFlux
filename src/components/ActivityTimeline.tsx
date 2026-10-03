import { useMemo, useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  X,
  Calendar as CalendarIcon,
  LineChart as ChartIcon,
  Navigation,
  Sparkles,
} from "lucide-react";
import { SENSOR_META } from "@/lib/regions";
import { CalendarHeatmap, type DayCount } from "@/components/CalendarHeatmap";

type Scale = "daily" | "weekly" | "monthly";
type Series = "MODIS" | "VIIRS" | "COMBINED";

export interface TimelineDetectionPoint {
  lat: number;
  lon: number;
  acq_date: string;
  sensor: "MODIS" | "VIIRS";
  frp_mw?: number | null;
  brightness_k?: number | null;
}

export interface ActivityTimelineProps {
  days: DayCount[];
  detections?: TimelineDetectionPoint[];
  selectedDate?: string | null;
  onSelectDate?: (date: string) => void;
  onFlyTo?: (date: string) => void;
}

function percentile(value: number, values: number[]): number {
  if (!values.length) return 0;
  const count = values.filter((item) => item <= value).length;
  return Math.round((count / values.length) * 100);
}

// Lightweight smooth count-up animation hook for numbers
function useCountUp(target: number, durationMs = 800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      // Ease out expo for natural deceleration
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(target * ease));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, durationMs]);

  return count;
}

function aggregateDays(days: DayCount[], scale: Scale) {
  if (scale === "daily") return days;
  const buckets = new Map<string, DayCount>();
  for (const day of days) {
    const date = new Date(`${day.date}T00:00:00Z`);
    const key =
      scale === "monthly"
        ? day.date.slice(0, 7)
        : (() => {
            const monday = new Date(date);
            monday.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
            return monday.toISOString().slice(0, 10);
          })();
    const current = buckets.get(key) ?? { date: key, modis: 0, viirs: 0 };
    current.modis += day.modis;
    current.viirs += day.viirs;
    buckets.set(key, current);
  }
  return [...buckets.values()].sort((a, b) => a.date.localeCompare(b.date));
}

// Mini Map showing detection scatter for a specific date
function DayMiniMap({ detections }: { detections: TimelineDetectionPoint[] }) {
  if (!detections.length) {
    return (
      <div className="flex h-44 items-center justify-center rounded border border-border bg-bg/80 font-mono text-[11px] text-text-secondary">
        No coordinate records found for this date.
      </div>
    );
  }

  // Calculate local bounding box
  const lats = detections.map((d) => d.lat);
  const lons = detections.map((d) => d.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);

  const latSpan = Math.max(0.08, maxLat - minLat);
  const lonSpan = Math.max(0.08, maxLon - minLon);

  return (
    <div className="relative h-44 overflow-hidden rounded border border-border bg-[#030711]">
      <svg className="h-full w-full p-4" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Subtle grid lines */}
        <line
          x1="0"
          y1="25"
          x2="100"
          y2="25"
          stroke="rgba(145,160,181,0.08)"
          strokeDasharray="2,2"
        />
        <line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          stroke="rgba(145,160,181,0.08)"
          strokeDasharray="2,2"
        />
        <line
          x1="0"
          y1="75"
          x2="100"
          y2="75"
          stroke="rgba(145,160,181,0.08)"
          strokeDasharray="2,2"
        />
        <line
          x1="25"
          y1="0"
          x2="25"
          y2="100"
          stroke="rgba(145,160,181,0.08)"
          strokeDasharray="2,2"
        />
        <line
          x1="50"
          y1="0"
          x2="50"
          y2="100"
          stroke="rgba(145,160,181,0.08)"
          strokeDasharray="2,2"
        />
        <line
          x1="75"
          y1="0"
          x2="75"
          y2="100"
          stroke="rgba(145,160,181,0.08)"
          strokeDasharray="2,2"
        />

        {/* Observation point scatter */}
        {detections.slice(0, 300).map((d, i) => {
          const x = ((d.lon - minLon) / lonSpan) * 90 + 5;
          const y = 95 - (((d.lat - minLat) / latSpan) * 90 + 5);
          const isModis = d.sensor === "MODIS";
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={isModis ? 2.5 : 1.8}
              fill={isModis ? SENSOR_META.MODIS.color : SENSOR_META.VIIRS.color}
              opacity={0.85}
            />
          );
        })}
      </svg>
      <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded bg-surface/90 px-2 py-1 font-mono text-[9px] text-text backdrop-blur-sm">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-data-blue" /> MODIS
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-thermal-orange" /> VIIRS
        </span>
        <span className="text-text-secondary">({detections.length.toLocaleString()} points)</span>
      </div>
    </div>
  );
}

// "WHY WAS THIS DAY UNUSUAL?" Immersive Analysis Panel
export function ActivityAnalysis({
  date,
  days,
  detections = [],
  onClose,
  onFlyTo,
}: {
  date: string;
  days: DayCount[];
  detections?: TimelineDetectionPoint[];
  onClose: () => void;
  onFlyTo?: (date: string) => void;
}) {
  const selected = days.find((day) => day.date === date) ?? { date, modis: 0, viirs: 0 };
  const total = selected.modis + selected.viirs;
  const allTotals = days.map((d) => d.modis + d.viirs);
  const rawRank = percentile(total, allTotals);

  // Animated numbers
  const animatedRank = useCountUp(rawRank);
  const animatedModis = useCountUp(selected.modis);
  const animatedViirs = useCountUp(selected.viirs);

  // Filter detections for this specific day
  const dayDetections = useMemo(
    () => detections.filter((d) => d.acq_date === date),
    [detections, date],
  );

  // FRP calculation (only if FRP is present)
  const frpStats = useMemo(() => {
    const frpVals = dayDetections
      .map((d) => d.frp_mw)
      .filter((v): v is number => v != null && v > 0);
    if (!frpVals.length) return null;
    const maxFrp = Math.max(...frpVals);
    const meanFrp = frpVals.reduce((a, b) => a + b, 0) / frpVals.length;
    return { max: maxFrp.toFixed(1), mean: meanFrp.toFixed(1) };
  }, [dayDetections]);

  // Agreement & Evidence Strength
  const agreement =
    selected.modis > 0 && selected.viirs > 0
      ? "STRONG"
      : selected.modis > 0 || selected.viirs > 0
        ? "LIMITED"
        : "NONE";

  const evidenceStrength =
    agreement === "STRONG"
      ? "HIGH"
      : total >= 10
        ? "ELEVATED"
        : total >= 3
          ? "MODERATE"
          : "LIMITED";

  const spatialConcentration =
    total > 20 ? "High-Density Cluster" : total > 5 ? "Moderate Grouping" : "Dispersed";

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-bg/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={`Analysis for ${date}`}
    >
      <button
        type="button"
        aria-label="Close analysis"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <aside className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-border bg-surface text-text shadow-2xl animate-in slide-in-from-right duration-300">
        <header className="flex items-start justify-between border-b border-border p-5">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-anomaly-amber" />
              <p className="font-mono text-[10px] tracking-[0.2em] text-anomaly-amber uppercase">
                WHY WAS THIS DAY UNUSUAL?
              </p>
            </div>
            <h2 className="mt-1 font-headline text-2xl font-bold text-text">{date}</h2>
            <p className="mt-0.5 font-mono text-xs text-text-secondary">
              Deterministic analytical decomposition from verified spaceborne observations.
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

        <div className="flex flex-col gap-5 p-5">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <div className="rounded border border-border bg-surface-elevated p-3">
              <div className="font-mono text-[9px] uppercase tracking-wider text-text-secondary">
                HISTORICAL PERCENTILE
              </div>
              <div className="mt-1.5 font-mono text-lg font-bold text-anomaly-amber">
                {animatedRank}th %ile
              </div>
            </div>

            <div className="rounded border border-border bg-surface-elevated p-3">
              <div className="font-mono text-[9px] uppercase tracking-wider text-text-secondary">
                MODIS ACTIVITY
              </div>
              <div className="mt-1.5 font-mono text-lg font-bold text-data-blue">
                {animatedModis.toLocaleString()}
              </div>
            </div>

            <div className="rounded border border-border bg-surface-elevated p-3">
              <div className="font-mono text-[9px] uppercase tracking-wider text-text-secondary">
                VIIRS ACTIVITY
              </div>
              <div className="mt-1.5 font-mono text-lg font-bold text-thermal-orange">
                {animatedViirs.toLocaleString()}
              </div>
            </div>

            <div className="rounded border border-border bg-surface-elevated p-3">
              <div className="font-mono text-[9px] uppercase tracking-wider text-text-secondary">
                CROSS-SENSOR AGREEMENT
              </div>
              <div className="mt-1.5 font-mono text-sm font-semibold text-agreement-teal">
                {agreement}
              </div>
            </div>

            <div className="rounded border border-border bg-surface-elevated p-3">
              <div className="font-mono text-[9px] uppercase tracking-wider text-text-secondary">
                EVIDENCE STRENGTH
              </div>
              <div className="mt-1.5 font-mono text-sm font-semibold text-text">
                {evidenceStrength}
              </div>
            </div>

            <div className="rounded border border-border bg-surface-elevated p-3">
              <div className="font-mono text-[9px] uppercase tracking-wider text-text-secondary">
                SPATIAL CONCENTRATION
              </div>
              <div className="mt-1.5 font-mono text-sm font-semibold text-text">
                {spatialConcentration}
              </div>
            </div>

            {/* FRP Summary - Shown only if FRP is stored */}
            {frpStats && (
              <div className="col-span-2 rounded border border-border bg-surface-elevated p-3 sm:col-span-3">
                <div className="font-mono text-[9px] uppercase tracking-wider text-text-secondary">
                  FRP SUMMARY
                </div>
                <div className="mt-1.5 font-mono text-sm text-text">
                  Peak: <span className="font-bold text-thermal-orange">{frpStats.max} MW</span> ·
                  Mean: <span className="font-bold text-text">{frpStats.mean} MW</span>
                </div>
              </div>
            )}
          </div>

          {/* Baseline Limited Warning */}
          {days.length < 14 && (
            <div className="rounded border border-anomaly-amber/40 bg-anomaly-amber/10 p-3 font-mono text-xs text-anomaly-amber">
              <span className="font-bold">BASELINE LIMITED:</span> {days.length} days stored. Small
              sample sizes can exaggerate percentile shifts.
            </div>
          )}

          {/* Fixed-Template Explanation */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4 font-mono text-xs leading-relaxed text-text">
            <p>
              This day ranks in the{" "}
              <strong className="text-anomaly-amber">{rawRank}th percentile</strong> of{" "}
              {days.length} days in the selected window. VIIRS recorded{" "}
              <strong className="text-thermal-orange">{selected.viirs.toLocaleString()}</strong>{" "}
              detections and MODIS{" "}
              <strong className="text-data-blue">{selected.modis.toLocaleString()}</strong>.
              {agreement === "STRONG" &&
                " Both sensors detected elevated thermal activity during their respective orbital passes, confirming dual-instrument radiometric coincidence."}
              {agreement === "LIMITED" &&
                " Only a single sensor recorded detections during this period, indicating localized or short-duration radiometric heating."}
            </p>
          </div>

          {/* Plain Language Caveat */}
          <p className="font-mono text-[11px] leading-relaxed text-text-secondary">
            <span className="font-semibold text-text">Observational Notice:</span> Satellite
            detections are radiometric thermal observations of elevated ground temperature. They
            provide observational evidence for scientific analysis but do not confirm ground fire
            boundaries.
          </p>

          {/* Mini Map of Day Detections */}
          <div>
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-text-secondary">
              <span>DAY'S DETECTION LOCATIONS</span>
              <span>{dayDetections.length.toLocaleString()} POINTS</span>
            </div>
            <DayMiniMap detections={dayDetections} />
          </div>

          {/* Action: Fly Main Globe to this Day */}
          <button
            type="button"
            onClick={() => onFlyTo?.(date)}
            className="flex items-center justify-center gap-2 rounded border border-data-blue/50 bg-data-blue/10 px-4 py-3 font-mono text-xs font-semibold tracking-wider text-data-blue transition-all hover:border-data-blue hover:bg-data-blue/20"
          >
            <Navigation className="h-4 w-4" />
            <span>FLY MAIN GLOBE TO THIS DAY</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

// Thermal Activity Timeline
export function ActivityTimeline({
  days,
  detections = [],
  selectedDate: controlledDate,
  onSelectDate,
  onFlyTo,
}: ActivityTimelineProps) {
  const [scale, setScale] = useState<Scale>("daily");
  const [series, setSeries] = useState<Series>("COMBINED");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [hovered, setHovered] = useState<DayCount | null>(null);
  const [activeAnalysisDate, setActiveAnalysisDate] = useState<string | null>(null);

  const effectiveAnalysisDate = controlledDate ?? activeAnalysisDate;

  // Aggregate days by chosen scale (Daily / Weekly / Monthly)
  const grouped = useMemo(() => aggregateDays(days, scale), [days, scale]);

  const chartData = useMemo(() => {
    return grouped.map((day) => ({
      ...day,
      combined: day.modis + day.viirs,
      label: scale === "monthly" ? day.date : day.date.slice(5),
    }));
  }, [grouped, scale]);

  const allValues = useMemo(() => {
    return chartData.map((day) =>
      series === "MODIS" ? day.modis : series === "VIIRS" ? day.viirs : day.combined,
    );
  }, [chartData, series]);

  const activePeriod = hovered ?? grouped[grouped.length - 1];
  const activeValue = activePeriod
    ? series === "MODIS"
      ? activePeriod.modis
      : series === "VIIRS"
        ? activePeriod.viirs
        : activePeriod.modis + activePeriod.viirs
    : 0;

  const activePercentile = useMemo(
    () => percentile(activeValue, allValues),
    [activeValue, allValues],
  );

  const baselineLimited = days.length < 14;

  const handleDayClick = (dateStr: string) => {
    if (onSelectDate) onSelectDate(dateStr);
    setActiveAnalysisDate(dateStr);
  };

  return (
    <section
      className="rounded-lg border border-border bg-surface p-4 sm:p-5 font-mono"
      aria-label="Thermal activity timeline"
    >
      {/* Top Header & Scales */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-data-blue uppercase">
            THERMAL ACTIVITY OVER TIME
          </p>
          <h2 className="mt-0.5 font-headline text-lg font-semibold text-text">
            When did the landscape change?
          </h2>
        </div>

        {/* DAILY | WEEKLY | MONTHLY Toggle */}
        <div
          className="flex items-center gap-1 rounded border border-border bg-surface-elevated/50 p-1"
          role="tablist"
          aria-label="Timeline scale"
        >
          {(["daily", "weekly", "monthly"] as Scale[]).map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={scale === s}
              onClick={() => setScale(s)}
              className={`rounded px-2.5 py-1 text-[10px] uppercase transition-all ${
                scale === s
                  ? "border border-data-blue/60 bg-data-blue/20 text-data-blue font-semibold"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Series Selector & View Toggle */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Timeline series">
          {(["MODIS", "VIIRS", "COMBINED"] as Series[]).map((ser) => {
            const isSelected = series === ser;
            const color =
              ser === "MODIS"
                ? SENSOR_META.MODIS.color
                : ser === "VIIRS"
                  ? SENSOR_META.VIIRS.color
                  : "var(--anomaly-amber)";
            return (
              <button
                key={ser}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSeries(ser)}
                className={`flex items-center gap-1.5 rounded border px-2.5 py-1 text-[10px] uppercase transition-all ${
                  isSelected
                    ? "border-border bg-surface-elevated text-text font-semibold shadow-sm"
                    : "border-transparent text-text-secondary hover:text-text"
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                <span>{ser}</span>
              </button>
            );
          })}
        </div>

        {/* Toggle between Timeline & Calendar Heatmap */}
        <button
          type="button"
          onClick={() => setShowHeatmap(!showHeatmap)}
          className="flex items-center gap-1.5 rounded border border-border px-2.5 py-1 text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:border-text-secondary hover:text-text"
        >
          {showHeatmap ? (
            <>
              <ChartIcon className="h-3 w-3" />
              <span>SHOW TIMELINE</span>
            </>
          ) : (
            <>
              <CalendarIcon className="h-3 w-3" />
              <span>SHOW CALENDAR HEATMAP</span>
            </>
          )}
        </button>
      </div>

      {/* Main Visual: Timeline AreaChart or Calendar Heatmap */}
      {showHeatmap ? (
        <div className="mt-4 overflow-x-auto pb-1">
          <CalendarHeatmap
            days={days}
            startDate={days[0]?.date ?? "2026-07-01"}
            endDate={days[days.length - 1]?.date ?? "2026-09-18"}
            mode={series === "COMBINED" ? "combined" : series}
            onSelectDate={handleDayClick}
          />
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <div className="h-64 min-w-[560px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                onMouseMove={(state) => {
                  const item = state?.activePayload?.[0]?.payload as DayCount | undefined;
                  if (item) setHovered(item);
                }}
                onClick={(state) => {
                  const item = state?.activePayload?.[0]?.payload as DayCount | undefined;
                  if (item?.date) handleDayClick(item.date);
                }}
                margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={
                        series === "MODIS"
                          ? SENSOR_META.MODIS.color
                          : series === "VIIRS"
                            ? SENSOR_META.VIIRS.color
                            : "var(--anomaly-amber)"
                      }
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={
                        series === "MODIS"
                          ? SENSOR_META.MODIS.color
                          : series === "VIIRS"
                            ? SENSOR_META.VIIRS.color
                            : "var(--anomaly-amber)"
                      }
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(145,160,181,0.12)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  stroke="#91a0b5"
                  fontFamily="DM Mono"
                  fontSize={10}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#91a0b5"
                  fontFamily="DM Mono"
                  fontSize={10}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active: open, payload }) => {
                    if (!open || !payload?.[0]) return null;
                    const item = payload[0].payload as DayCount;
                    const val =
                      series === "MODIS"
                        ? item.modis
                        : series === "VIIRS"
                          ? item.viirs
                          : item.modis + item.viirs;
                    const rank = percentile(val, allValues);
                    return (
                      <div className="rounded border border-border bg-surface-elevated/95 p-2.5 font-mono text-[11px] text-text shadow-xl backdrop-blur-md">
                        <div className="font-semibold text-text">{item.date}</div>
                        <div className="mt-1 text-anomaly-amber">
                          {val.toLocaleString()} observations · {rank}th percentile
                        </div>
                        <div className="mt-0.5 text-[9px] text-text-secondary">
                          MODIS: {item.modis.toLocaleString()} · VIIRS:{" "}
                          {item.viirs.toLocaleString()}
                        </div>
                        <div className="mt-1 border-t border-border/50 pt-1 text-[9px] text-data-blue">
                          Click to view "Why was this day unusual?"
                        </div>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={series === "MODIS" ? "modis" : series === "VIIRS" ? "viirs" : "combined"}
                  stroke={
                    series === "MODIS"
                      ? SENSOR_META.MODIS.color
                      : series === "VIIRS"
                        ? SENSOR_META.VIIRS.color
                        : "var(--anomaly-amber)"
                  }
                  fill="url(#timelineGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Footer Metrics & Baseline Caveat */}
      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-[10px] text-text-secondary">
        <div>
          <span>
            {activePeriod?.date ?? "Active Period"} ·{" "}
            <strong className="text-text">{activeValue.toLocaleString()} observations</strong>
          </span>
          <span className="ml-2 font-semibold text-anomaly-amber">
            ({activePercentile}th historical percentile)
          </span>
        </div>

        {baselineLimited && (
          <span className="rounded bg-anomaly-amber/15 px-2 py-0.5 font-semibold text-anomaly-amber">
            BASELINE LIMITED: {days.length} days stored
          </span>
        )}
      </footer>

      {/* "Why Was This Day Unusual?" Modal */}
      {effectiveAnalysisDate && (
        <ActivityAnalysis
          date={effectiveAnalysisDate}
          days={days}
          detections={detections}
          onClose={() => {
            setActiveAnalysisDate(null);
            if (onSelectDate) onSelectDate("");
          }}
          onFlyTo={onFlyTo}
        />
      )}
    </section>
  );
}

export default ActivityTimeline;
