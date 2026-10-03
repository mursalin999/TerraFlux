// Supabase Edge Function: pull-global-firms
// Pulls recent NASA FIRMS active fire data worldwide using FIRMS_MAP_KEY (Supabase secret).
// Aggregates global observations into 0.25° geodetic cells (public.global_fire_cells),
// while storing fine point-level records (public.fire_detections) strictly for preset regions.
// Respects FIRMS rate limits, batches requests sequentially, and is fully idempotent (safe to re-run).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// 5 Preset monitored regions for point-level resolution
const PRESET_REGIONS = [
  { name: "Bangladesh", bbox: [88.0, 20.5, 92.7, 26.7] },
  { name: "India", bbox: [68.0, 8.0, 89.0, 32.0] },
  { name: "Amazon Basin", bbox: [-70.0, -15.0, -50.0, 2.0] },
  { name: "Australia", bbox: [138.0, -39.0, 154.0, -26.0] },
  { name: "California", bbox: [-125.0, 32.0, -114.0, 42.0] },
];

// Worldwide continental quadrants to query within FIRMS bounding box limitations
const GLOBAL_QUADRANTS = [
  { name: "North America", bbox: "-170,15,-50,75" },
  { name: "South America", bbox: "-90,-60,-30,15" },
  { name: "Europe & North Africa", bbox: "-25,25,50,75" },
  { name: "Sub-Saharan Africa", bbox: "-20,-35,55,25" },
  { name: "Central & Northern Asia", bbox: "50,40,180,75" },
  { name: "South & East Asia", bbox: "50,0,150,40" },
  { name: "Oceania & Australia", bbox: "110,-50,180,0" },
];

const GRID_STEP = 0.25; // 0.25 deg ~= 27.8 km at equator

interface RawObservation {
  lat: number;
  lon: number;
  acq_date: string;
  acq_time: string;
  sensor: "MODIS" | "VIIRS";
  satellite: string;
  resolution_m: number;
  brightness_k: number | null;
  brightness2_k: number | null;
  frp_mw: number | null;
  confidence_tier: "low" | "nominal" | "high";
  confidence_raw: string | null;
  day_night: "D" | "N" | null;
}

interface CellAggregation {
  cell_id: string;
  lat: number;
  lon: number;
  acq_date: string;
  modis_count: number;
  viirs_count: number;
  total_count: number;
  max_frp: number | null;
  total_frp: number;
  frp_samples: number;
  max_brightness_k: number | null;
  strong_agreement: boolean;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isInsidePreset(lat: number, lon: number): boolean {
  for (const r of PRESET_REGIONS) {
    const [w, s, e, n] = r.bbox;
    if (lon >= w && lon <= e && lat >= s && lat <= n) {
      return true;
    }
  }
  return false;
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length !== headers.length) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, j) => (row[h] = cols[j].trim()));
    rows.push(row);
  }
  return rows;
}

function num(v: string | undefined): number | null {
  if (v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

async function fetchFirmsQuadrant(
  mapKey: string,
  source: "MODIS_NRT" | "VIIRS_NOAA20_NRT",
  bbox: string,
  days: number,
  date?: string,
): Promise<RawObservation[]> {
  const url =
    `https://firms.modaps.eosdis.nasa.gov/api/area/csv/` +
    `${mapKey}/${source}/${bbox}/${days}` +
    (date ? `/${date}` : "");

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`FIRMS ${source} failed (${res.status}): ${body.slice(0, 150)}`);
  }
  const text = await res.text();
  if (/^invalid|error/i.test(text.trim().slice(0, 20))) {
    throw new Error(`FIRMS returned error: ${text.slice(0, 150)}`);
  }

  const rows = parseCsv(text);
  const isModis = source === "MODIS_NRT";

  return rows
    .map((r) => {
      const lat = num(r["latitude"]);
      const lon = num(r["longitude"]);
      if (lat === null || lon === null || !r["acq_date"] || !r["acq_time"]) return null;

      if (isModis) {
        const conf = num(r["confidence"]);
        const tier = conf === null || conf < 30 ? "low" : conf < 80 ? "nominal" : "high";
        return {
          lat,
          lon,
          acq_date: r["acq_date"],
          acq_time: r["acq_time"],
          sensor: "MODIS" as const,
          satellite: r["satellite"] === "T" ? "T" : "A",
          resolution_m: 1000,
          brightness_k: num(r["brightness"]),
          brightness2_k: num(r["bright_t31"]),
          frp_mw: num(r["frp"]),
          confidence_tier: tier as "low" | "nominal" | "high",
          confidence_raw: r["confidence"] ?? null,
          day_night: r["daynight"] === "N" ? "N" : ("D" as const),
        };
      } else {
        const c = (r["confidence"] ?? "").toLowerCase();
        const tier = c.startsWith("h") ? "high" : c.startsWith("n") ? "nominal" : "low";
        return {
          lat,
          lon,
          acq_date: r["acq_date"],
          acq_time: r["acq_time"],
          sensor: "VIIRS" as const,
          satellite: r["satellite"] ?? "N20",
          resolution_m: 375,
          brightness_k: num(r["bright_ti4"]),
          brightness2_k: num(r["bright_ti5"]),
          frp_mw: num(r["frp"]),
          confidence_tier: tier as "low" | "nominal" | "high",
          confidence_raw: r["confidence"] ?? null,
          day_night: r["daynight"] === "N" ? "N" : ("D" as const),
        };
      }
    })
    .filter((o): o is RawObservation => o !== null);
}

Deno.serve(async (req) => {
  // CORS handling
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const FIRMS_MAP_KEY = Deno.env.get("FIRMS_MAP_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!FIRMS_MAP_KEY) {
      return new Response(
        JSON.stringify({ error: "FIRMS_MAP_KEY secret not found in Supabase project secrets." }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Missing Supabase service configuration." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const days = Math.min(3, Math.max(1, Number(body.days || 1))); // Default 1 day worldwide
    const targetDate = body.date as string | undefined; // Optional YYYY-MM-DD
    const dryRun = Boolean(body.dry_run);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const cellMap = new Map<string, CellAggregation>();
    const pointRecords: RawObservation[] = [];
    let totalDetectionsFetched = 0;

    // Iterate through continental quadrants sequentially to respect rate limits
    for (const quadrant of GLOBAL_QUADRANTS) {
      for (const source of ["MODIS_NRT", "VIIRS_NOAA20_NRT"] as const) {
        // Respect NASA FIRMS rate limit: 1200ms sleep between requests
        await delay(1200);

        try {
          const obsList = await fetchFirmsQuadrant(
            FIRMS_MAP_KEY,
            source,
            quadrant.bbox,
            days,
            targetDate,
          );
          totalDetectionsFetched += obsList.length;

          for (const obs of obsList) {
            // Check if point belongs to a preset region
            if (isInsidePreset(obs.lat, obs.lon)) {
              pointRecords.push(obs);
            }

            // Aggregate into global 0.25° geodetic grid cell
            const latIdx = Math.floor(obs.lat / GRID_STEP);
            const lonIdx = Math.floor(obs.lon / GRID_STEP);
            const centerLat = Number((latIdx * GRID_STEP + GRID_STEP / 2).toFixed(4));
            const centerLon = Number((lonIdx * GRID_STEP + GRID_STEP / 2).toFixed(4));
            const cellKey = `${centerLat}_${centerLon}_${obs.acq_date}`;

            let cell = cellMap.get(cellKey);
            if (!cell) {
              cell = {
                cell_id: `${centerLat}_${centerLon}`,
                lat: centerLat,
                lon: centerLon,
                acq_date: obs.acq_date,
                modis_count: 0,
                viirs_count: 0,
                total_count: 0,
                max_frp: null,
                total_frp: 0,
                frp_samples: 0,
                max_brightness_k: null,
                strong_agreement: false,
              };
              cellMap.set(cellKey, cell);
            }

            if (obs.sensor === "MODIS") cell.modisCount++;
            else cell.viirsCount++;
            cell.totalCount++;

            if (obs.frp_mw != null && obs.frp_mw > 0) {
              cell.max_frp = Math.max(cell.max_frp ?? 0, obs.frp_mw);
              cell.total_frp += obs.frp_mw;
              cell.frp_samples++;
            }
            if (obs.brightness_k != null) {
              cell.max_brightness_k = Math.max(cell.max_brightness_k ?? 0, obs.brightness_k);
            }
            if (cell.modisCount > 0 && cell.viirsCount > 0) {
              cell.strong_agreement = true;
            }
          }
        } catch (err) {
          console.error(`Error fetching quadrant ${quadrant.name} (${source}):`, err);
        }
      }
    }

    const aggregatedCells = Array.from(cellMap.values()).map((c) => ({
      cell_id: c.cell_id,
      lat: c.lat,
      lon: c.lon,
      acq_date: c.acq_date,
      modis_count: c.modis_count,
      viirs_count: c.viirs_count,
      total_count: c.total_count,
      max_frp: c.max_frp,
      mean_frp: c.frp_samples > 0 ? Number((c.total_frp / c.frp_samples).toFixed(2)) : null,
      max_brightness_k: c.max_brightness_k,
      strong_agreement: c.strong_agreement,
    }));

    if (dryRun) {
      return new Response(
        JSON.stringify({
          status: "dry_run",
          totalDetectionsFetched,
          aggregatedCellsCount: aggregatedCells.length,
          presetPointsCount: pointRecords.length,
          estimatedCellStorageBytes: aggregatedCells.length * 90,
          estimatedPointStorageBytes: pointRecords.length * 300,
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    // 1. Batch upsert aggregated global grid cells (500 rows per batch)
    let upsertedCells = 0;
    const CELL_BATCH = 500;
    for (let i = 0; i < aggregatedCells.length; i += CELL_BATCH) {
      const slice = aggregatedCells.slice(i, i + CELL_BATCH);
      const { error } = await supabase.from("global_fire_cells").upsert(slice, {
        onConflict: "cell_id,acq_date",
      });
      if (error) {
        console.error("Error upserting global_fire_cells batch:", error);
      } else {
        upsertedCells += slice.length;
      }
    }

    // 2. Batch upsert point-level records for preset regions only (500 rows per batch)
    let upsertedPoints = 0;
    const POINT_BATCH = 500;
    for (let i = 0; i < pointRecords.length; i += POINT_BATCH) {
      const slice = pointRecords.slice(i, i + POINT_BATCH);
      const { error } = await supabase.from("fire_detections").upsert(slice, {
        onConflict: "lat,lon,acq_date,acq_time,sensor,satellite",
        ignoreDuplicates: true,
      });
      if (error) {
        console.error("Error upserting preset fire_detections batch:", error);
      } else {
        upsertedPoints += slice.length;
      }
    }

    return new Response(
      JSON.stringify({
        status: "success",
        totalDetectionsFetched,
        upsertedGlobalCells: upsertedCells,
        upsertedPresetPoints: upsertedPoints,
        daysQueried: days,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error in pull-global-firms";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
