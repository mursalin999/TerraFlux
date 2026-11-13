import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { REGIONS, parseBbox } from "./regions";
import { supabase } from "@/integrations/supabase/client";

const bboxSchema = z
  .string()
  .regex(
    /^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/,
    "bbox must be west,south,east,north",
  );
const bboxInputSchema = z.object({ west: z.number(), south: z.number(), east: z.number(), north: z.number() });

// --- fetch-fire-data: pull 1–5 recent days for a bbox and store them ---
export const fetchFireData = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        bbox: bboxSchema,
        days: z.number().int().min(1).max(10),
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { runFetchFireData } = await import("./firms.server");
    return runFetchFireData(data);
  });

// --- backfill-fire-data: populate a historical range in ≤5-day windows and ≤10° tiles ---
export const backfillFireData = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        bbox: bboxSchema,
        start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { runBackfillFireData } = await import("./firms.server");
    return runBackfillFireData(data);
  });

// --- Owner-only versions used by the "Data pull" panel: they need the admin password (ADMIN_IMPORT_SECRET) ---
function assertAdminPassword(password: string) {
  const secret = typeof process !== "undefined" ? process.env["ADMIN_IMPORT_SECRET"] : undefined;
  if (!secret) throw new Error("ADMIN_IMPORT_SECRET is not set on the server.");
  if (password !== secret) throw new Error("Wrong admin password.");
}

export const adminFetchFireData = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ password: z.string().min(1).max(200), bbox: bboxSchema, days: z.number().int().min(1).max(10) }).parse(data),
  )
  .handler(async ({ data }) => {
    assertAdminPassword(data.password);
    const { runFetchFireData } = await import("./firms.server");
    return runFetchFireData({ bbox: data.bbox, days: data.days });
  });

export const adminBackfillFireData = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        password: z.string().min(1).max(200),
        bbox: bboxSchema,
        start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    assertAdminPassword(data.password);
    const { runBackfillFireData } = await import("./firms.server");
    return runBackfillFireData({ bbox: data.bbox, start_date: data.start_date, end_date: data.end_date });
  });

// --- Public read queries (publishable key, anon-safe SELECT policy) ---

function publicClient() {
  const url =
    (typeof process !== "undefined" &&
      (process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"])) ||
    (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_URL"]);
  const key =
    (typeof process !== "undefined" &&
      (process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"])) ||
    (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"]);
  if (!url || !key) return null;
  try {
    return createClient(url, key, {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 12_000);
          const requestInit = { ...init, headers: h, signal: controller.signal };
          return fetch(input, requestInit).finally(() => clearTimeout(timeout));
        },
      },
    });
  } catch {
    return null;
  }
}

const detectionsQuerySchema = z.object({
  west: z.number().min(-180).max(180),
  south: z.number().min(-90).max(90),
  east: z.number().min(-180).max(180),
  north: z.number().min(-90).max(90),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sensors: z.array(z.enum(["MODIS", "VIIRS"])).optional(),
  confidence: z.array(z.enum(["low", "nominal", "high"])).optional(),
  sample_limit: z.number().int().min(1000).max(10000).optional(),
});

export const backfillPresetHistory = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ region_ids: z.array(z.string()).min(1).max(20), start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).parse(data))
  .handler(async ({ data }) => {
    const { fetchAndHarmonize, upsertDetections, chunkDateRange, splitBboxIntoTiles } = await import("./firms.server");
    const results: Array<{ region_id: string; stored: number; errors: string[] }> = [];
    for (const regionId of data.region_ids) {
      const region = REGIONS.find((item) => item.id === regionId);
      if (!region) continue;
      let stored = 0;
      const errors: string[] = [];
      for (const tile of splitBboxIntoTiles(region.bbox)) {
        for (const date of chunkDateRange(data.start_date, data.end_date)) {
          try { stored += await upsertDetections(await fetchAndHarmonize({ bbox: tile, days: 5, date })); }
          catch (error) { errors.push(`${tile} ${date}: ${error instanceof Error ? error.message : String(error)}`); }
        }
      }
      results.push({ region_id: regionId, stored, errors });
    }
    return results;
  });

export interface SpatialSummaryCell {
  sensor: "MODIS" | "VIIRS";
  cell_lat: number;
  cell_lon: number;
  cell_size: number;
  observation_count: number;
  cell_days: number;
  frp_sum: number;
  max_frp: number | null;
}

export interface SpatialBundle {
  cells: SpatialSummaryCell[];
  counts: Array<{ sensor: string; matching_records: number }>;
  days: Array<{ date: string; modis: number; viirs: number }>;
  sensor_cell_days?: { MODIS?: number; VIIRS?: number };
  coverage: { first_date: string | null; last_date: string | null; active_days: number };
  overlap?: { both_cell_days: number; modis_only_cell_days: number; viirs_only_cell_days: number; overlap_months: number; raw_ratio: number | null };
  sensitivity?: Array<{ cell_size: number; agreement_rate: number; both_cell_days?: number; total_cell_days?: number }>;
  degraded?: boolean;
  analysisError?: string;
}

export function spatialCellsToObservationPoints(cells: SpatialSummaryCell[], fallbackDate: string) {
  return cells.map((cell) => ({
    lat: cell.cell_lat + cell.cell_size / 2,
    lon: cell.cell_lon + cell.cell_size / 2,
    acq_date: fallbackDate,
    acq_time: "",
    sensor: cell.sensor,
    satellite: "Aggregated spatial cell",
    resolution_m: cell.sensor === "MODIS" ? 1000 : 375,
    brightness_k: null,
    brightness2_k: null,
    frp_mw: cell.max_frp,
    frp_sum: cell.frp_sum,
    confidence_tier: "nominal",
    day_night: null,
    observation_count: cell.observation_count,
    cell_days: cell.cell_days,
  }));
}

const spatialQuerySchema = detectionsQuerySchema.omit({ sample_limit: true }).extend({ map_start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), map_end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() });
const comparisonAnalysisUnavailable = "Analysis unavailable: database function missing or timed out";
type SpatialSensor = "MODIS" | "VIIRS";
type DetectionSample = {
  lat: number;
  lon: number;
  acq_date: string;
  sensor: SpatialSensor;
  frp_mw: number | null;
};

type SpatialRpcResult = { data: unknown; error: { message: string } | null };
type SpatialRpcBuilder = PromiseLike<SpatialRpcResult> & {
  abortSignal?: (requestSignal: AbortSignal) => PromiseLike<SpatialRpcResult>;
};

const spatialRpcClient = supabase as unknown as {
  rpc: (name: string, args: Record<string, unknown>) => SpatialRpcBuilder;
};

async function requestSpatialRpc(name: string, args: Record<string, unknown>, signal: AbortSignal) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  const cancelRequest = () => controller.abort();
  signal.addEventListener("abort", cancelRequest, { once: true });
  try {
    const request = spatialRpcClient.rpc(name, args);
    const response =
      typeof request.abortSignal === "function" ? request.abortSignal(controller.signal) : request;
    const { data, error } = await response;
    if (error) throw new Error(error.message);
    if (!data || typeof data !== "object") throw new Error(`${name} returned an invalid response.`);
    return data as Record<string, unknown>;
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener("abort", cancelRequest);
  }
}

type SpatialQuery = z.infer<typeof spatialQuerySchema>;

const DAY_MS = 86_400_000;
const dayNumber = (iso: string) => Math.floor(Date.parse(`${iso}T00:00:00Z`) / DAY_MS);
const isoFromDayNumber = (day: number) => new Date(day * DAY_MS).toISOString().slice(0, 10);
// A window that selects no rows at all. Used for yearly chunks that fall outside the playback window.
const EMPTY_MAP_WINDOW = { p_map_from_date: "9999-12-31", p_map_to_date: "9999-12-30" };

function mapCellSizeFor(data: SpatialQuery) {
  return Math.max(0.15, Math.sqrt(((data.east - data.west) * (data.north - data.south) * 2) / 2500));
}

// Runs the tasks with at most `limit` in flight, keeping the result order.
async function mapWithLimit<T, R>(items: T[], limit: number, task: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next;
        next += 1;
        results[index] = await task(items[index]!);
      }
    }),
  );
  return results;
}

// One page (max 1,000 rows) of detections for one sensor. The API caps every response at 1,000 rows,
// so larger windows are read as several pages.
export const getMapDetectionPage = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    detectionsQuerySchema
      .omit({ sample_limit: true, sensors: true })
      .extend({ sensor: z.enum(["MODIS", "VIIRS"]), offset: z.number().int().min(0).max(50_000) })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const sb = publicClient();
    if (!sb) throw new Error("Supabase read credentials are unavailable; detections could not be loaded.");
    let query = sb
      .from("fire_detections")
      .select("lat,lon,acq_date,sensor,frp_mw")
      .eq("sensor", data.sensor)
      .gte("lon", data.west).lte("lon", data.east)
      .gte("lat", data.south).lte("lat", data.north)
      .gte("acq_date", data.start_date).lte("acq_date", data.end_date)
      .order("acq_date", { ascending: false })
      .range(data.offset, data.offset + 999);
    if (data.confidence?.length) query = query.in("confidence_tier", data.confidence);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return (rows ?? []) as DetectionSample[];
  });

// Used when the spatial SQL functions are missing or too slow. Totals, the timeline and coverage come from the
// stored daily series (every record, as the Calendar uses); the map cells come from the detections of the map
// window, read page by page. Wide windows are sampled evenly across time. Nothing here is invented.
async function fetchFallbackSpatialBundle(data: SpatialQuery, signal: AbortSignal): Promise<SpatialBundle> {
  const area = { west: data.west, south: data.south, east: data.east, north: data.north };
  const mapFrom = data.map_start_date ?? data.start_date;
  const mapTo = data.map_end_date ?? data.end_date;
  const firstDay = dayNumber(mapFrom);
  const span = Math.max(1, dayNumber(mapTo) - firstDay + 1);
  const windowCount = span <= 14 ? 1 : Math.min(8, Math.ceil(span / 30));
  const pagesPerWindow = windowCount === 1 ? 6 : 1;
  const windows = Array.from({ length: windowCount }, (_, index) => ({
    start: isoFromDayNumber(firstDay + Math.floor((span * index) / windowCount)),
    end: isoFromDayNumber(index === windowCount - 1 ? dayNumber(mapTo) : firstDay + Math.floor((span * (index + 1)) / windowCount) - 1),
  }));
  const requests = windows.flatMap((window) =>
    (["MODIS", "VIIRS"] as const).flatMap((sensor) =>
      Array.from({ length: pagesPerWindow }, (_, page) => ({ window, sensor, offset: page * 1000 })),
    ),
  );
  const [daily, pages] = await Promise.all([
    getDailyCounts({ data: { ...area, start_date: data.start_date, end_date: data.end_date } }),
    mapWithLimit(requests, 6, (request) =>
      getMapDetectionPage({
        data: { ...area, start_date: request.window.start, end_date: request.window.end, sensor: request.sensor, offset: request.offset, confidence: data.confidence },
      }),
    ),
  ]);
  if (signal.aborted) throw new Error("Spatial query aborted.");

  const cellSize = mapCellSizeFor(data);
  const cellGroups = new Map<string, SpatialSummaryCell & { dates: Set<string> }>();
  for (const row of pages.flat()) {
    const cellLat = Math.floor(row.lat / cellSize) * cellSize;
    const cellLon = Math.floor(row.lon / cellSize) * cellSize;
    const key = `${row.sensor}:${cellLat}:${cellLon}`;
    const cell = cellGroups.get(key) ?? {
      sensor: row.sensor,
      cell_lat: cellLat,
      cell_lon: cellLon,
      cell_size: cellSize,
      observation_count: 0,
      cell_days: 0,
      frp_sum: 0,
      max_frp: null,
      dates: new Set<string>(),
    };
    cell.observation_count += 1;
    cell.dates.add(row.acq_date);
    cell.frp_sum += row.frp_mw ?? 0;
    cell.max_frp = row.frp_mw == null ? cell.max_frp : Math.max(cell.max_frp ?? -Infinity, row.frp_mw);
    cellGroups.set(key, cell);
  }

  const days = daily.filter((day) => day.modis + day.viirs > 0);
  return {
    cells: [...cellGroups.values()].map(({ dates, ...cell }) => ({ ...cell, cell_days: dates.size })),
    counts: [
      { sensor: "MODIS", matching_records: days.reduce((sum, day) => sum + day.modis, 0) },
      { sensor: "VIIRS", matching_records: days.reduce((sum, day) => sum + day.viirs, 0) },
    ],
    days,
    coverage: {
      first_date: days[0]?.date ?? null,
      last_date: days[days.length - 1]?.date ?? null,
      active_days: days.length,
    },
    sensitivity: [],
    degraded: true,
  };
}

function spatialRpcArgs(data: SpatialQuery) {
  return {
    p_west: data.west,
    p_south: data.south,
    p_east: data.east,
    p_north: data.north,
    p_from_date: data.start_date,
    p_to_date: data.end_date,
    p_confidence: data.confidence ?? null,
  };
}

// Calendar-year chunks keep every database call small, so each one finishes inside the database time limit.
function chunkQuery(data: SpatialQuery, chunk: { start: string; end: string }): SpatialQuery {
  return { ...data, start_date: chunk.start, end_date: chunk.end };
}

function mapWindowArgs(data: SpatialQuery, chunk: { start: string; end: string }) {
  if (!data.map_start_date && !data.map_end_date) return { p_map_from_date: null, p_map_to_date: null };
  const from = data.map_start_date && data.map_start_date > chunk.start ? data.map_start_date : chunk.start;
  const to = data.map_end_date && data.map_end_date < chunk.end ? data.map_end_date : chunk.end;
  return from <= to ? { p_map_from_date: from, p_map_to_date: to } : EMPTY_MAP_WINDOW;
}

function mergeBundles(parts: SpatialBundle[]): SpatialBundle {
  const cells = new Map<string, SpatialSummaryCell>();
  const totals = { MODIS: 0, VIIRS: 0 };
  const days: SpatialBundle["days"] = [];
  let firstDate: string | null = null;
  let lastDate: string | null = null;
  let activeDays = 0;
  let cellDays = { MODIS: 0, VIIRS: 0 };
  let hasCellDays = false;
  const overlap = { both_cell_days: 0, modis_only_cell_days: 0, viirs_only_cell_days: 0, overlap_months: 0 };
  let hasOverlap = false;
  const sensitivity = new Map<number, { both: number; total: number; rates: number[]; complete: boolean }>();
  for (const part of parts) {
    for (const cell of part.cells ?? []) {
      const key = `${cell.sensor}:${cell.cell_lat}:${cell.cell_lon}`;
      const existing = cells.get(key);
      if (!existing) cells.set(key, { ...cell });
      else {
        existing.observation_count += Number(cell.observation_count) || 0;
        existing.cell_days += Number(cell.cell_days) || 0; // yearly chunks never share a day
        existing.frp_sum += Number(cell.frp_sum) || 0;
        existing.max_frp = cell.max_frp == null ? existing.max_frp : Math.max(existing.max_frp ?? -Infinity, cell.max_frp);
      }
    }
    for (const row of part.counts ?? []) {
      if (row.sensor === "MODIS" || row.sensor === "VIIRS") totals[row.sensor] += Number(row.matching_records) || 0;
    }
    days.push(...(part.days ?? []));
    if (part.coverage?.first_date && (!firstDate || part.coverage.first_date < firstDate)) firstDate = part.coverage.first_date;
    if (part.coverage?.last_date && (!lastDate || part.coverage.last_date > lastDate)) lastDate = part.coverage.last_date;
    activeDays += Number(part.coverage?.active_days) || 0;
    if (part.sensor_cell_days) {
      hasCellDays = true;
      cellDays = { MODIS: cellDays.MODIS + (Number(part.sensor_cell_days.MODIS) || 0), VIIRS: cellDays.VIIRS + (Number(part.sensor_cell_days.VIIRS) || 0) };
    }
    if (part.overlap) {
      hasOverlap = true;
      overlap.both_cell_days += Number(part.overlap.both_cell_days) || 0;
      overlap.modis_only_cell_days += Number(part.overlap.modis_only_cell_days) || 0;
      overlap.viirs_only_cell_days += Number(part.overlap.viirs_only_cell_days) || 0;
      overlap.overlap_months += Number(part.overlap.overlap_months) || 0;
    }
    for (const item of part.sensitivity ?? []) {
      const entry = sensitivity.get(item.cell_size) ?? { both: 0, total: 0, rates: [], complete: true };
      if (item.both_cell_days == null || item.total_cell_days == null) entry.complete = false;
      entry.both += Number(item.both_cell_days) || 0;
      entry.total += Number(item.total_cell_days) || 0;
      entry.rates.push(Number(item.agreement_rate) || 0);
      sensitivity.set(item.cell_size, entry);
    }
  }
  const single = parts.length === 1;
  return {
    cells: [...cells.values()],
    counts: [
      { sensor: "MODIS", matching_records: totals.MODIS },
      { sensor: "VIIRS", matching_records: totals.VIIRS },
    ],
    days: days.sort((a, b) => a.date.localeCompare(b.date)),
    ...(hasCellDays ? { sensor_cell_days: cellDays } : {}),
    coverage: { first_date: firstDate, last_date: lastDate, active_days: activeDays },
    ...(hasOverlap ? { overlap: { ...overlap, raw_ratio: totals.MODIS > 0 ? totals.VIIRS / totals.MODIS : null } } : {}),
    sensitivity: [...sensitivity.entries()]
      .filter(([, entry]) => single || entry.complete)
      .map(([cell_size, entry]) => ({
        cell_size,
        agreement_rate: single && !entry.complete ? entry.rates[0]! : entry.total > 0 ? entry.both / entry.total : 0,
        ...(entry.complete ? { both_cell_days: entry.both, total_cell_days: entry.total } : {}),
      }))
      .sort((a, b) => a.cell_size - b.cell_size),
  };
}

const comparisonNeedsNewSql = "Analysis unavailable: update the Supabase SQL (spatial_compare_bundle v2) for multi-year ranges.";

export async function fetchSpatialBundle(data: SpatialQuery, signal: AbortSignal): Promise<SpatialBundle> {
  try {
    const chunks = splitIntoYears(data.start_date, data.end_date);
    const parts = await mapWithLimit(chunks, 3, (chunk) =>
      requestSpatialRpc("spatial_map_bundle", { ...spatialRpcArgs(chunkQuery(data, chunk)), ...mapWindowArgs(data, chunk) }, signal),
    );
    return mergeBundles(parts as unknown as SpatialBundle[]);
  } catch (rpcError) {
    if (signal.aborted) throw rpcError;
    console.error("[TerraFlux] spatial_map_bundle failed; reading detections directly", rpcError);
    return fetchFallbackSpatialBundle(data, signal);
  }
}

export async function fetchCompareSpatialBundle(data: SpatialQuery, signal: AbortSignal): Promise<SpatialBundle> {
  const chunks = splitIntoYears(data.start_date, data.end_date);
  const [comparison, map] = await Promise.all([
    mapWithLimit(chunks, 3, (chunk) => requestSpatialRpc("spatial_compare_bundle", spatialRpcArgs(chunkQuery(data, chunk)), signal))
      .then((parts) => ({ bundle: mergeBundles(parts as unknown as SpatialBundle[]) }))
      .catch((error: unknown) => ({ error })),
    mapWithLimit(chunks, 3, (chunk) =>
      requestSpatialRpc("spatial_map_bundle", { ...spatialRpcArgs(chunkQuery(data, chunk)), ...mapWindowArgs(data, chunk) }, signal),
    )
      .then((parts) => ({ bundle: mergeBundles(parts as unknown as SpatialBundle[]) }))
      .catch((error: unknown) => ({ error })),
  ]);
  if (signal.aborted) throw new Error("Spatial query aborted.");

  if ("bundle" in comparison && "bundle" in map) {
    const hasRecords = (comparison.bundle.counts ?? []).some((row) => row.matching_records > 0);
    const needsNewSql = chunks.length > 1 && hasRecords && (comparison.bundle.sensitivity ?? []).length === 0;
    return { ...map.bundle, ...comparison.bundle, cells: map.bundle.cells, ...(needsNewSql ? { analysisError: comparisonNeedsNewSql } : {}) };
  }
  if ("bundle" in map) {
    console.error("[TerraFlux] spatial_compare_bundle failed", "error" in comparison ? comparison.error : null);
    return { ...map.bundle, analysisError: comparisonAnalysisUnavailable };
  }
  console.error("[TerraFlux] spatial_map_bundle failed; reading detections directly", "error" in map ? map.error : null);
  const fallback = await fetchFallbackSpatialBundle(data, signal);
  if ("bundle" in comparison) return { ...comparison.bundle, cells: fallback.cells, degraded: true };
  return { ...fallback, analysisError: comparisonAnalysisUnavailable };
}

export const getDetections = createServerFn({ method: "GET" })
  .inputValidator((data) => detectionsQuerySchema.parse(data))
  .handler(async ({ data }) => {
    const sb = publicClient();
    if (!sb) {
      throw new Error("Supabase read credentials are unavailable; detections could not be loaded.");
    }
    const maximumRows = Math.min(data.sample_limit ?? 10000, 10000);
    let query = sb
      .from("fire_detections")
      .select("lat,lon,acq_date,acq_time,sensor,satellite,resolution_m,brightness_k,brightness2_k,frp_mw,confidence_tier,day_night")
      .gte("lon", data.west).lte("lon", data.east)
      .gte("lat", data.south).lte("lat", data.north)
      .gte("acq_date", data.start_date).lte("acq_date", data.end_date)
      .limit(maximumRows);
    if (data.sensors?.length) query = query.in("sensor", data.sensors);
    if (data.confidence?.length) query = query.in("confidence_tier", data.confidence);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    if (!rows) throw new Error("Supabase returned no detection response.");
    return rows;
  });

// Daily counts per sensor — powers the calendar heatmap and comparison chart.
function splitIntoYears(start: string, end: string) {
  const ranges: Array<{ start: string; end: string }> = [];
  for (let year = Number(start.slice(0, 4)); year <= Number(end.slice(0, 4)); year += 1) {
    const rangeStart = year === Number(start.slice(0, 4)) ? start : `${year}-01-01`;
    const rangeEnd = year === Number(end.slice(0, 4)) ? end : `${year}-12-31`;
    ranges.push({ start: rangeStart, end: rangeEnd });
  }
  return ranges;
}

export const getAreaCoverage = createServerFn({ method: "GET" })
  .inputValidator((data) => bboxInputSchema.parse(data))
  .handler(async ({ data }) => {
    const sb = publicClient();
    if (!sb) return [];
    const { data: rows, error } = await sb.rpc("area_coverage", {
      p_west: data.west,
      p_south: data.south,
      p_east: data.east,
      p_north: data.north,
    });
    if (error || !rows) return [];
    return rows as Array<{ sensor: string; first_date: string | null; last_date: string | null; detections: number }>;
  });

const exportPageSchema = detectionsQuerySchema.extend({ cursor_date: z.string().optional(), cursor_time: z.string().optional(), cursor_id: z.union([z.string(), z.number()]).optional(), page_size: z.number().int().min(1).max(10000).default(10000) });
export const getDetectionExportPage = createServerFn({ method: "GET" })
  .inputValidator((data) => exportPageSchema.parse(data))
  .handler(async ({ data }) => {
    const sb = publicClient();
    if (!sb) return { rows: [], next: null, total: 0 };
    let query = sb.from("fire_detections").select("id,lat,lon,acq_date,acq_time,sensor,satellite,product,processing,brightness_k,brightness2_k,frp_mw,confidence_raw,confidence_tier,day_night").gte("lon", data.west).lte("lon", data.east).gte("lat", data.south).lte("lat", data.north).gte("acq_date", data.start_date).lte("acq_date", data.end_date).order("acq_date", { ascending: true }).order("acq_time", { ascending: true }).order("id", { ascending: true }).limit(data.page_size);
    if (data.sensors?.length) query = query.in("sensor", data.sensors);
    if (data.confidence?.length) query = query.in("confidence_tier", data.confidence);
    if (data.cursor_date && data.cursor_time && data.cursor_id !== undefined) query = query.or(`acq_date.gt.${data.cursor_date},and(acq_date.eq.${data.cursor_date},acq_time.gt.${data.cursor_time}),and(acq_date.eq.${data.cursor_date},acq_time.eq.${data.cursor_time},id.gt.${data.cursor_id})`);
    const { data: rows, error } = await query;
    if (error || !rows) throw new Error(error?.message ?? "Could not prepare detections download");
    const last = rows.at(-1) as Record<string, unknown> | undefined;
    return { rows, next: rows.length === data.page_size && last ? { cursor_date: String(last.acq_date), cursor_time: String(last.acq_time), cursor_id: last.id } : null, total: rows.length };
  });

export const getDailyCounts = createServerFn({ method: "GET" })
  .inputValidator((data) => detectionsQuerySchema.omit({ sensors: true, confidence: true }).parse(data))
  .handler(async ({ data }) => {
    const sb = publicClient();
    if (!sb) return [];
    const ranges = splitIntoYears(data.start_date, data.end_date);
    const rows: Array<{ day: string; sensor_group: string; raw_detections: number }> = [];
    for (const range of ranges) {
      const result = await sb.rpc("daily_series", {
        p_west: data.west, p_south: data.south, p_east: data.east, p_north: data.north,
        p_from_date: range.start, p_to_date: range.end,
      });
      if (result.error || !result.data) return [];
      rows.push(...(result.data as typeof rows));
    }
    const counts = new Map<string, { date: string; modis: number; viirs: number }>();
    for (const row of rows) {
      const entry = counts.get(row.day) ?? { date: row.day, modis: 0, viirs: 0 };
      if (row.sensor_group === "MODIS") entry.modis = Number(row.raw_detections);
      else entry.viirs += Number(row.raw_detections);
      counts.set(row.day, entry);
    }
    return [...counts.values()].sort((a, b) => a.date.localeCompare(b.date));
  });

export const getMonthlySeries = createServerFn({ method: "GET" })
  .inputValidator((data) => detectionsQuerySchema.omit({ sensors: true, confidence: true }).parse(data))
  .handler(async ({ data }) => {
    const sb = publicClient();
    if (!sb) return [];
    const rows: Array<Record<string, unknown>> = [];
    for (const range of splitIntoYears(data.start_date, data.end_date)) {
      const result = await sb.rpc("monthly_series", {
        p_west: data.west, p_south: data.south, p_east: data.east, p_north: data.north,
        p_from_date: range.start, p_to_date: range.end,
      });
      if (result.error || !result.data) return [];
      rows.push(...(result.data as Array<Record<string, unknown>>));
    }
    return rows;
  });

// Database-wide totals for the public Home snapshot. Region coverage means a
// preset bounding box currently contains at least one stored FIRMS detection.
export const getLiveSnapshot = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  if (!sb) {
    return {
      totalDetections: 0,
      activeSensors: 0,
      regionsCovered: 0,
      totalRegions: REGIONS.length,
    };
  }
  const [summaryResult, ...regionResults] = await Promise.all([
    sb.rpc("fire_data_summary"),
    ...REGIONS.map((region) => {
      const bounds = parseBbox(region.bbox);
      return sb.from("fire_detections").select("id").gte("lon", bounds.west).lte("lon", bounds.east).gte("lat", bounds.south).lte("lat", bounds.north).limit(1);
    }),
  ]);
  if (summaryResult.error) {
    return { totalDetections: 0, activeSensors: 0, regionsCovered: 0, totalRegions: REGIONS.length };
  }
  const summary = summaryResult.data?.[0];
  const modisCount = Number(summary?.modis_detections ?? 0);
  const viirsCount = Number(summary?.viirs_detections ?? 0);
  const activeSensorsCount = (modisCount > 0 ? 1 : 0) + (viirsCount > 0 ? 1 : 0);

  return {
    totalDetections: Number(summary?.total_detections ?? 0),
    activeSensors: activeSensorsCount,
    regionsCovered: regionResults.filter((result) => !result.error && (result.data?.length ?? 0) > 0).length,
    totalRegions: REGIONS.length,
  };
});

export interface HomeMissionTelemetry {
  status: "ok" | "unavailable";
  totalDetections: number;
  modisCount: number;
  viirsCount: number;
  latestAcqDate: string | null;
  lastIngestTime: string | null;
  baselineDays: number;
  regionsCovered: number;
  firstAcqDate: string | null;
  hasHarmonized: boolean;
  isRecentPull: boolean;
  errorMessage?: string;
}

export const getHomeMissionTelemetry = createServerFn({ method: "GET" }).handler(
  async (): Promise<HomeMissionTelemetry> => {
    const empty = (errorMessage?: string): HomeMissionTelemetry => ({
      status: errorMessage ? "unavailable" : "ok",
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
      ...(errorMessage ? { errorMessage } : {}),
    });
    const sb = publicClient();
    if (!sb) return empty("Supabase client is not configured");

    try {
      const regionQueries = REGIONS.map((region) => {
        const bounds = parseBbox(region.bbox);
        return sb.from("fire_detections").select("id").gte("lon", bounds.west).lte("lon", bounds.east).gte("lat", bounds.south).lte("lat", bounds.north).limit(1);
      });
      const [summaryRes, ...regionResults] = await Promise.all([sb.rpc("fire_data_summary"), ...regionQueries]);
      if (summaryRes.error) return empty(summaryRes.error.message);
      const summary = summaryRes.data?.[0];
      const firstAcqDate = summary?.first_date ?? null;
      const latestAcqDate = summary?.last_date ?? null;
      const baselineDays = latestAcqDate && firstAcqDate
        ? Math.max(1, Math.round((new Date(latestAcqDate).getTime() - new Date(firstAcqDate).getTime()) / 86400000) + 1)
        : 0;
      const modisCount = Number(summary?.modis_detections ?? 0);
      const viirsCount = Number(summary?.viirs_detections ?? 0);
      const lastIngestTime = null;
      return {
        status: "ok",
        totalDetections: Number(summary?.total_detections ?? modisCount + viirsCount),
        modisCount,
        viirsCount,
        latestAcqDate,
        lastIngestTime,
        baselineDays,
        regionsCovered: regionResults.filter((result) => !result.error && (result.data?.length ?? 0) > 0).length,
        firstAcqDate,
        hasHarmonized: modisCount > 0 && viirsCount > 0,
        isRecentPull: lastIngestTime ? (Date.now() - new Date(lastIngestTime).getTime()) / 3600000 <= 48 : false,
      };
    } catch (error) {
      return empty(error instanceof Error ? error.message : "Stored data query failed");
    }
  },
);

export const getRecentGlobeObservations = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  if (!sb) return [];

  try {
    const latestRes = await sb
      .from("fire_detections")
      .select("acq_date")
      .order("acq_date", { ascending: false })
      .limit(1);

    if (!latestRes.data?.[0]?.acq_date) {
      return [];
    }

    const latestDate = new Date(latestRes.data[0].acq_date + "T00:00:00Z");
    const windowStart = new Date(latestDate);
    windowStart.setUTCDate(windowStart.getUTCDate() - 6);
    const windowStartStr = windowStart.toISOString().slice(0, 10);

    const regionRows = await Promise.all(
      REGIONS.map(async (region) => {
        const bounds = parseBbox(region.bbox);
        const { data, error } = await sb
          .from("fire_detections")
          .select("lat,lon,acq_date,acq_time,sensor,satellite,resolution_m,brightness_k,brightness2_k,frp_mw,confidence_tier,day_night")
          .gte("lon", bounds.west).lte("lon", bounds.east)
          .gte("lat", bounds.south).lte("lat", bounds.north)
          .gte("acq_date", windowStartStr)
          .order("acq_date", { ascending: false }).limit(3000);
        if (error) throw error;
        return data ?? [];
      }),
    );
    return Array.from(new Map(regionRows.flat().map((row) => [`${row.lat}:${row.lon}:${row.acq_date}:${row.sensor}:${row.acq_time}`, row])).values());
  } catch {
    return [];
  }
});

// --- get-global-grid-cells: retrieves aggregated global grid observations ---
export const getGlobalCells48h = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  if (!sb) return { cells: [], fetchedAt: null as string | null };
  const { data, error } = await sb
    .from("global_cells_48h")
    .select("cell_lat,cell_lon,count,max_frp,source,fetched_at")
    .eq("source", "VIIRS")
    .order("fetched_at", { ascending: false })
    .limit(20000);
  if (error || !data?.length) return { cells: [], fetchedAt: null as string | null };
  const fetchedAt = data[0].fetched_at;
  return { cells: data.filter((row) => row.fetched_at === fetchedAt), fetchedAt };
});

export const getGlobalGridCells = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        start_date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        end_date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const sb = publicClient();
    if (!sb) return [];

    try {
      let query = sb
        .from("global_fire_cells")
        .select(
          "cell_id, lat, lon, acq_date, modis_count, viirs_count, total_count, max_frp, mean_frp, max_brightness_k, strong_agreement",
        )
        .order("acq_date", { ascending: false })
        .limit(10000);

      if (data.start_date) query = query.gte("acq_date", data.start_date);
      if (data.end_date) query = query.lte("acq_date", data.end_date);

      const { data: rows, error } = await query;
      if (error || !rows) return [];
      return rows;
    } catch {
      return [];
    }
  });

// --- trigger-global-pull: invokes the pull-global-firms Supabase Edge Function ---
export const triggerGlobalPull = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        days: z.number().int().min(1).max(3).default(2),
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        dry_run: z.boolean().default(false),
        secret: z.string().min(1),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    if (data.secret !== process.env.FIRELENS_INGEST_TOKEN) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("./firms.server");
    const admin = supabaseAdmin();
    const { data: result, error } = await admin.functions.invoke("pull-global-firms", {
      body: data,
    });
    if (error) {
      throw new Error(`Edge function error: ${error.message}`);
    }
    return result;
  });
