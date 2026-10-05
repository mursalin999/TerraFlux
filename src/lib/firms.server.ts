// Server-only helpers for pulling NASA FIRMS CSV data and harmonizing
// MODIS / VIIRS records into the public.fire_detections schema.
// Imported only from *.functions.ts handler bodies (never shipped to client).

export interface HarmonizedRow {
  lat: number;
  lon: number;
  acq_date: string; // YYYY-MM-DD
  acq_time: string; // HHMM
  sensor: "MODIS" | "VIIRS";
  satellite: string; // MODIS: A/T; VIIRS: N/N20/N21
  resolution_m: number; // 1000 MODIS, 375 VIIRS
  brightness_k: number | null;
  brightness2_k: number | null;
  frp_mw: number | null;
  confidence_tier: "low" | "nominal" | "high";
  confidence_raw: string | null;
  day_night: "D" | "N" | null;
}

export const FIRMS_SOURCES = {
  MODIS_NRT: "MODIS_NRT",
  VIIRS_NOAA20_NRT: "VIIRS_NOAA20_NRT",
} as const;

export type FirmsSource = keyof typeof FIRMS_SOURCES;

export function validateBbox(bbox: string): [number, number, number, number] {
  const parts = bbox.split(",").map((p) => Number(p.trim()));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) {
    throw new Error('bbox must be "west,south,east,north" with four numbers');
  }
  const [west, south, east, north] = parts as [number, number, number, number];
  if (west >= east || south >= north) {
    throw new Error("bbox is inverted: need west < east and south < north");
  }
  if (south < -90 || north > 90 || west < -180 || east > 180) {
    throw new Error("bbox out of range (lon -180..180, lat -90..90)");
  }
  return [west, south, east, north];
}

function parseCsv(text: string, source: FirmsSource): Record<string, string>[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const lines = trimmed.split(/\r?\n/);
  const headerLine = lines[0]!.toLowerCase();

  // Validate that NASA FIRMS returned a legitimate CSV with expected coordinate columns
  if (!headerLine.includes("latitude") || !headerLine.includes("longitude")) {
    // NASA returned an error string, invalid key warning, transaction limit, or HTML page
    throw new Error(`NASA FIRMS ${source} rejection: ${trimmed.slice(0, 300)}`);
  }

  // Valid CSV header present, but no observation records in this bounding box/time
  if (lines.length < 2) return [];

  const headers = lines[0]!.split(",").map((h) => h.trim());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i]!.split(",");
    if (cols.length !== headers.length) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, j) => (row[h] = cols[j]!.trim()));
    rows.push(row);
  }
  return rows;
}

const num = (v: string | undefined): number | null => {
  if (v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// NOTE: MODIS reports confidence as a 0–100 numeric quality score. Bucketing it
// into low/nominal/high here is a rough estimate for cross-sensor comparison —
// the exact cutoffs below are NOT an official NASA definition. VIIRS reports
// confidence directly as low/nominal/high, so those map without interpretation.
function modisConfidenceTier(score: number | null): "low" | "nominal" | "high" {
  if (score === null) return "low";
  if (score < 30) return "low";
  if (score < 80) return "nominal";
  return "high";
}

export function harmonizeModis(rows: Record<string, string>[]): HarmonizedRow[] {
  const out: HarmonizedRow[] = [];
  for (const r of rows) {
    const lat = num(r["latitude"]);
    const lon = num(r["longitude"]);
    if (lat === null || lon === null || !r["acq_date"] || !r["acq_time"]) continue;
    const conf = num(r["confidence"]);
    out.push({
      lat,
      lon,
      acq_date: r["acq_date"],
      acq_time: r["acq_time"],
      sensor: "MODIS",
      satellite: r["satellite"] === "T" ? "T" : "A",
      resolution_m: 1000,
      brightness_k: num(r["brightness"]),
      brightness2_k: num(r["bright_t31"]),
      frp_mw: num(r["frp"]),
      confidence_tier: modisConfidenceTier(conf),
      confidence_raw: r["confidence"] ?? null,
      day_night: r["daynight"] === "N" ? "N" : r["daynight"] === "D" ? "D" : null,
    });
  }
  return out;
}

export function harmonizeViirs(rows: Record<string, string>[]): HarmonizedRow[] {
  const out: HarmonizedRow[] = [];
  for (const r of rows) {
    const lat = num(r["latitude"]);
    const lon = num(r["longitude"]);
    if (lat === null || lon === null || !r["acq_date"] || !r["acq_time"]) continue;
    const c = (r["confidence"] ?? "").toLowerCase();
    out.push({
      lat,
      lon,
      acq_date: r["acq_date"],
      acq_time: r["acq_time"],
      sensor: "VIIRS",
      satellite: r["satellite"] ?? "N20",
      resolution_m: 375,
      brightness_k: num(r["bright_ti4"]),
      brightness2_k: num(r["bright_ti5"]),
      frp_mw: num(r["frp"]),
      confidence_tier: c.startsWith("h") ? "high" : c.startsWith("n") ? "nominal" : "low",
      confidence_raw: r["confidence"] ?? null,
      day_night: r["daynight"] === "N" ? "N" : r["daynight"] === "D" ? "D" : null,
    });
  }
  return out;
}

export async function fetchFirmsCsv(opts: {
  mapKey: string;
  source: FirmsSource;
  bbox: string; // "west,south,east,north"
  days: number; // 1..5
  date?: string | undefined; // YYYY-MM-DD
}): Promise<Record<string, string>[]> {
  const { mapKey, source, bbox, days, date } = opts;
  const url =
    `https://firms.modaps.eosdis.nasa.gov/api/area/csv/` +
    `${mapKey}/${source}/${bbox}/${days}` +
    (date ? `/${date}` : "");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18_000);
  let res: Response;
  try {
    res = await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`FIRMS ${source} request timed out after 18 seconds`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`FIRMS ${source} request failed [${res.status}]: ${body.slice(0, 300)}`);
  }
  const text = await res.text();
  if (/^invalid|error/i.test(text.trim().slice(0, 20))) {
    throw new Error(`FIRMS ${source} returned an error: ${text.slice(0, 300)}`);
  }
  return parseCsv(text, source);
}

export async function fetchAndHarmonize(opts: {
  bbox: string;
  days: number;
  date?: string | undefined;
}): Promise<HarmonizedRow[]> {
  const mapKey = (
    process.env["FIRMS_MAP_KEY"] ||
    process.env["VITE_FIRMS_MAP_KEY"] ||
    process.env["NASA_FIRMS_MAP_KEY"]
  )?.trim();
  if (!mapKey) {
    throw new Error(
      "FIRMS_MAP_KEY is not set in Vercel environment variables. Please set FIRMS_MAP_KEY in Vercel Project Settings -> Environment Variables and trigger a fresh redeploy.",
    );
  }
  validateBbox(opts.bbox);
  if (!Number.isInteger(opts.days) || opts.days < 1 || opts.days > 5) {
    throw new Error("days must be an integer between 1 and 5 — recent-checks endpoint only");
  }
  const [modisRaw, viirsRaw] = await Promise.all([
    fetchFirmsCsv({ ...opts, mapKey, source: "MODIS_NRT" }),
    fetchFirmsCsv({ ...opts, mapKey, source: "VIIRS_NOAA20_NRT" }),
  ]);
  return [...harmonizeModis(modisRaw), ...harmonizeViirs(viirsRaw)];
}

export async function upsertDetections(rows: HarmonizedRow[]): Promise<number> {
  if (rows.length === 0) return 0;
  const CHUNK = 500;

  // Preferred path: service-role client (available on Lovable hosting).
  if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let upserted = 0;
    for (let i = 0; i < rows.length; i += CHUNK) {
      const { error } = await supabaseAdmin
        .from("fire_detections")
        .upsert(rows.slice(i, i + CHUNK), {
          onConflict: "lat,lon,acq_date,acq_time,sensor,satellite",
          ignoreDuplicates: true,
        });
      if (error) throw new Error(`upsert failed: ${error.message}`);
      upserted += Math.min(CHUNK, rows.length - i);
    }
    return upserted;
  }

  // Portable path (self-hosted deploys, e.g. Vercel): the service-role key is
  // not available, so writes go through a token-gated SECURITY DEFINER RPC.
  const token = process.env["FIRELENS_INGEST_TOKEN"]?.trim();
  if (!token) {
    throw new Error(
      "No database write credentials: set FIRELENS_INGEST_TOKEN (or SUPABASE_SERVICE_ROLE_KEY) in Vercel environment variables and redeploy.",
    );
  }
  const { publicServerClient } = await import("./supabase-public.server");
  const sb = publicServerClient();
  let upserted = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const { data, error } = await sb.rpc("ingest_fire_detections", {
      _token: token,
      _rows: rows.slice(i, i + CHUNK),
    });
    if (error) throw new Error(`upsert failed: ${error.message}`);
    upserted += typeof data === "number" ? data : 0;
  }
  return upserted;
}

/** Split [startDate, endDate] into consecutive windows of at most 5 days. */
export function chunkDateRange(startDate: string, endDate: string): string[] {
  const start = new Date(startDate + "T00:00:00Z");
  const end = new Date(endDate + "T00:00:00Z");
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("dates must be YYYY-MM-DD");
  }
  if (start > end) throw new Error("start_date must be on or before end_date");
  const starts: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    starts.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 5);
  }
  return starts;
}
