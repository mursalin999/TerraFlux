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

// --- fetch-fire-data: pull 1–5 recent days for a bbox and store them ---
export const fetchFireData = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        bbox: bboxSchema,
        days: z.number().int().min(1).max(5),
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

// --- backfill-fire-data: populate a historical range in ≤5-day windows ---
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
    // Sequential, not parallel — stays comfortably inside FIRMS's
    // 5000 requests / 10-minute limit even for a full year of data.
    for (const date of starts) {
      try {
        const rows = await fetchAndHarmonize({ bbox: data.bbox, days: 5, date });
        stored += await upsertDetections(rows);
        chunks += 1;
      } catch (err) {
        errors.push(`${date}: ${err instanceof Error ? err.message : String(err)}`);
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
    process.env["SUPABASE_URL"] ||
    process.env["VITE_SUPABASE_URL"] ||
    process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];
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
});

export const getDetections = createServerFn({ method: "GET" })
  .inputValidator((data) => detectionsQuerySchema.parse(data))
  .handler(async ({ data }) => {
    const sb = publicClient();
    if (!sb) {
      return [];
    }
    let q = sb
      .from("fire_detections")
      .select(
        "lat,lon,acq_date,acq_time,sensor,satellite,resolution_m,brightness_k,brightness2_k,frp_mw,confidence_tier,day_night",
      )
      .gte("lon", data.west)
      .lte("lon", data.east)
      .gte("lat", data.south)
      .lte("lat", data.north)
      .gte("acq_date", data.start_date)
      .lte("acq_date", data.end_date)
      .order("acq_date", { ascending: true })
      .limit(20000);
    if (data.sensors?.length) q = q.in("sensor", data.sensors);
    if (data.confidence?.length) q = q.in("confidence_tier", data.confidence);
    const { data: rows, error } = await q;
    if (error || !rows) {
      return [];
    }
    return rows;
  });

// Daily counts per sensor — powers the calendar heatmap and comparison chart.
export const getDailyCounts = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    detectionsQuerySchema.omit({ sensors: true, confidence: true }).parse(data),
  )
  .handler(async ({ data }) => {
    const sb = publicClient();
    if (!sb) {
      return [];
    }
    const { data: rows, error } = await sb
      .from("fire_detections")
      .select("acq_date,sensor")
      .gte("lon", data.west)
      .lte("lon", data.east)
      .gte("lat", data.south)
      .lte("lat", data.north)
      .gte("acq_date", data.start_date)
      .lte("acq_date", data.end_date)
      .limit(100000);
    if (error || !rows) {
      return [];
    }
    const counts = new Map<string, { date: string; modis: number; viirs: number }>();
    for (const r of rows) {
      const entry = counts.get(r.acq_date) ?? { date: r.acq_date, modis: 0, viirs: 0 };
      if (r.sensor === "MODIS") entry.modis += 1;
      else entry.viirs += 1;
      counts.set(r.acq_date, entry);
    }
    return [...counts.values()].sort((a, b) => a.date.localeCompare(b.date));
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
  const countQuery = (sensor?: "MODIS" | "VIIRS") => {
    let query = sb.from("fire_detections").select("id", { count: "exact", head: true });
    if (sensor) query = query.eq("sensor", sensor);
    return query;
  };

  const [totalResult, modisResult, viirsResult, ...regionResults] = await Promise.all([
    countQuery(),
    countQuery("MODIS"),
    countQuery("VIIRS"),
    ...REGIONS.map((region) => {
      const bounds = parseBbox(region.bbox);
      return sb
        .from("fire_detections")
        .select("id", { count: "exact", head: true })
        .gte("lon", bounds.west)
        .lte("lon", bounds.east)
        .gte("lat", bounds.south)
        .lte("lat", bounds.north);
    }),
  ]);

  const firstError = [totalResult, modisResult, viirsResult, ...regionResults].find(
    (result) => result.error,
  )?.error;
  if (firstError) {
    return {
      totalDetections: 0,
      activeSensors: 0,
      regionsCovered: 0,
      totalRegions: REGIONS.length,
    };
  }

  const modisCount = modisResult.count ?? 0;
  const viirsCount = viirsResult.count ?? 0;
  const activeSensorsCount = (modisCount > 0 ? 1 : 0) + (viirsCount > 0 ? 1 : 0);

  return {
    totalDetections: totalResult.count ?? 0,
    activeSensors: activeSensorsCount,
    regionsCovered: regionResults.filter((result) => (result.count ?? 0) > 0).length,
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
  hasHarmonized: boolean;
  isRecentPull: boolean;
}

export const getHomeMissionTelemetry = createServerFn({ method: "GET" }).handler(
  async (): Promise<HomeMissionTelemetry> => {
    const sb = publicClient();
    if (!sb) {
      return {
        status: "unavailable",
        totalDetections: 0,
        modisCount: 0,
        viirsCount: 0,
        latestAcqDate: null,
        lastIngestTime: null,
        baselineDays: 0,
        hasHarmonized: false,
        isRecentPull: false,
      };
    }

    try {
      const [totalRes, modisRes, viirsRes, latestRes, oldestRes] = await Promise.all([
        sb.from("fire_detections").select("id", { count: "exact", head: true }),
        sb
          .from("fire_detections")
          .select("id", { count: "exact", head: true })
          .eq("sensor", "MODIS"),
        sb
          .from("fire_detections")
          .select("id", { count: "exact", head: true })
          .eq("sensor", "VIIRS"),
        sb
          .from("fire_detections")
          .select("acq_date,created_at")
          .order("acq_date", { ascending: false })
          .limit(1),
        sb
          .from("fire_detections")
          .select("acq_date")
          .order("acq_date", { ascending: true })
          .limit(1),
      ]);

      if (totalRes.error) {
        return {
          status: "unavailable",
          totalDetections: 0,
          modisCount: 0,
          viirsCount: 0,
          latestAcqDate: null,
          lastIngestTime: null,
          baselineDays: 0,
          hasHarmonized: false,
          isRecentPull: false,
        };
      }

      const totalDetections = totalRes.count ?? 0;
      const modisCount = modisRes.count ?? 0;
      const viirsCount = viirsRes.count ?? 0;
      const latestRow = latestRes.data?.[0];
      const oldestRow = oldestRes.data?.[0];

      let baselineDays = 0;
      if (latestRow?.acq_date && oldestRow?.acq_date) {
        const diffMs =
          new Date(latestRow.acq_date).getTime() - new Date(oldestRow.acq_date).getTime();
        baselineDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
      }

      let isRecentPull = false;
      if (latestRow?.created_at) {
        const hoursAgo = (Date.now() - new Date(latestRow.created_at).getTime()) / (1000 * 60 * 60);
        isRecentPull = hoursAgo <= 48;
      }

      return {
        status: "ok",
        totalDetections,
        modisCount,
        viirsCount,
        latestAcqDate: latestRow?.acq_date ?? null,
        lastIngestTime: latestRow?.created_at ?? null,
        baselineDays,
        hasHarmonized: modisCount > 0 && viirsCount > 0,
        isRecentPull,
      };
    } catch {
      return {
        status: "unavailable",
        totalDetections: 0,
        modisCount: 0,
        viirsCount: 0,
        latestAcqDate: null,
        lastIngestTime: null,
        baselineDays: 0,
        hasHarmonized: false,
        isRecentPull: false,
      };
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

    const { data: rows, error } = await sb
      .from("fire_detections")
      .select(
        "lat,lon,acq_date,acq_time,sensor,satellite,resolution_m,brightness_k,brightness2_k,frp_mw,confidence_tier,day_night",
      )
      .gte("acq_date", windowStartStr)
      .order("acq_date", { ascending: false })
      .limit(10000);

    if (error || !rows) return [];
    return rows;
  } catch {
    return [];
  }
});

// --- get-global-grid-cells: retrieves aggregated global grid observations ---
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
        days: z.number().int().min(1).max(3).default(1),
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        dry_run: z.boolean().default(false),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
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
