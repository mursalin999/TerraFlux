import fs from "node:fs/promises";
import Papa from "papaparse";
import { supabaseAdmin } from "./src/integrations/supabase/client.server";
import { harmonizeModis, harmonizeViirs } from "./src/lib/firms.server";

const files = [
  [".tmp/fire_archive_M-C61.csv", "MODIS Terra/Aqua"],
  [".tmp/fire_archive_J1V-C2.csv", "VIIRS NOAA-21"],
  [".tmp/fire_archive_J2V-C2.csv", "VIIRS NOAA-20"],
  [".tmp/fire_archive_SV-C2.csv", "VIIRS S-NPP"],
  [".tmp/fire_nrt_M-C61.csv", "MODIS Terra/Aqua"],
  [".tmp/fire_nrt_J2V-C2.csv", "VIIRS NOAA-20"],
  [".tmp/fire_nrt_SV-C2.csv", "VIIRS S-NPP"],
] as const;
let inserted = 0;
for (const [file, label] of files) {
  const text = await fs.readFile(file, "utf8");
  const rows = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true }).data;
  const normalized = label.startsWith("MODIS")
    ? harmonizeModis(rows, { product: label, processing: file.includes("nrt") ? "NRT" : "SP", source_file_name: file }).map((row) => ({ ...row, satellite: rows.find((r) => r.acq_date === row.acq_date && r.acq_time === row.acq_time)?.satellite === "Aqua" ? "A" : "T" }))
    : harmonizeViirs(rows, { product: label, processing: file.includes("nrt") ? "NRT" : "SP", source_file_name: file });
  for (let i = 0; i < normalized.length; i += 500) {
    const { error } = await supabaseAdmin.from("fire_detections").upsert(normalized.slice(i, i + 500), { onConflict: "lat,lon,acq_date,acq_time,sensor,satellite", ignoreDuplicates: true });
    if (error) throw new Error(`${file}: ${error.message}`);
    inserted += normalized.slice(i, i + 500).length;
  }
  console.log(`${file}: ${normalized.length} rows`);
}
console.log(`Imported ${inserted} rows`);
