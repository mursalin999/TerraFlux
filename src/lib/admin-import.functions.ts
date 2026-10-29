import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { harmonizeModis, harmonizeViirs, type HarmonizedRow } from "@/lib/firms.server";
import { getRegion, parseBbox } from "@/lib/regions";

const PRODUCT = {
  MODIS_TERRA: { label: "MODIS Terra", sensor: "MODIS", satellite: "T" },
  MODIS_AQUA: { label: "MODIS Aqua", sensor: "MODIS", satellite: "A" },
  VIIRS_SNPP: { label: "VIIRS S-NPP", sensor: "VIIRS", satellite: "N" },
  VIIRS_NOAA20: { label: "VIIRS NOAA-20", sensor: "VIIRS", satellite: "N20" },
  VIIRS_NOAA21: { label: "VIIRS NOAA-21", sensor: "VIIRS", satellite: "N21" },
} as const;

function authorize(password: string) {
  if (!process.env.ADMIN_IMPORT_SECRET || password !== process.env.ADMIN_IMPORT_SECRET) {
    throw new Response("Unauthorized", { status: 401 });
  }
}

function normalizeRows(rows: Record<string, string>[], productKey: keyof typeof PRODUCT, processing: "NRT" | "SP", sourceFileName: string, regionId: string) {
  const product = PRODUCT[productKey];
  const normalized = product.sensor === "MODIS"
    ? harmonizeModis(rows, { product: product.label, processing, source_file_name: sourceFileName })
    : harmonizeViirs(rows, { product: product.label, processing, source_file_name: sourceFileName });
  const bounds = parseBbox(getRegion(regionId).bbox);
  return normalized
    .filter((row) => row.lat >= bounds.south && row.lat <= bounds.north && row.lon >= bounds.west && row.lon <= bounds.east)
    .map((row) => ({ ...row, satellite: product.satellite }));
}

export const importArchiveBatch = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string; rows: Record<string, string>[]; productKey: keyof typeof PRODUCT; processing: "NRT" | "SP"; sourceFileName: string; regionId: string }) => data)
  .handler(async ({ data }) => {
    authorize(data.password);
    const rows = normalizeRows(data.rows, data.productKey, data.processing, data.sourceFileName, data.regionId);
    const { data: result, error } = await (supabaseAdmin as any).rpc("import_fire_detections", { _rows: rows });
    if (error) throw new Error(`Import batch failed: ${error.message}`);
    return { inside: rows.length, ...((result ?? {}) as { inserted?: number; updated?: number; skipped?: number }) };
  });

export const getImportSummary = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    authorize(data.password);
    const { data, error } = await (supabaseAdmin as any).rpc("firms_archive_summary");
    if (error) throw new Error(`Summary query failed: ${error.message}`);
    return (data ?? []).map((row: { product: string; year: number; rows: number; first_date: string; last_date: string }) => ({
      product: row.product,
      year: row.year,
      rows: row.rows,
      firstDate: row.first_date,
      lastDate: row.last_date,
    }));
  });

export { PRODUCT };
