import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { REGIONS, parseBbox } from "./regions";

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
    const { fetchAndHarmonize, upsertDetections } = await import("./firms.server");
    const rows = await fetchAndHarmonize(data);
    const stored = await upsertDetections(rows);
    return { rows, stored };
  });

function splitBboxIntoTiles(bbox: string): string[] {
  const [west, south, east, north] = bbox.split(",").map(Number);
  const tiles: string[] = [];
  for (let tileWest = west!; tileWest < east!; tileWest += 10) {
    for (let tileSouth = south!; tileSouth < north!; tileSouth += 10) {
      tiles.push([tileWest, tileSouth, Math.min(tileWest + 10, east!), Math.min(tileSouth + 10, north!)].join(","));
    }
  }
  return tiles;
}

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
    const { fetchAndHarmonize, upsertDetections, chunkDateRange } = await import("./firms.server");
    const starts = chunkDateRange(data.start_date, data.end_date);
    let chunks = 0;
    let stored = 0;
    const errors: string[] = [];
    const tiles = splitBboxIntoTiles(data.bbox);
    // Sequential requests avoid saturating NASA FIRMS while covering large presets.
    for (const tile of tiles) {
      for (const date of starts) {
        try {
          const rows = await fetchAndHarmonize({ bbox: tile, days: 5, date });
          stored += await upsertDetections(rows);
          chunks += 1;
        } catch (err) {
          errors.push(`${tile} ${date}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }
    if (stored === 0 && errors.length > 0) {
      throw new Error(errors[0]);
    }
    return { chunks, stored, errors };
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
    const { fetchAndHarmonize, upsertDetections, chunkDateRange } = await import("./firms.server");
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

export const getDetections = createServerFn({ method: "GET" })
  .inputValidator((data) => detectionsQuerySchema.parse(data))
  .handler(async ({ data }) => {
    const sb = publicClient();
    if (!sb) {
      return [];
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
    return error || !rows ? [] : rows;
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
        totalDetections: totalRes.count ?? 0,
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
