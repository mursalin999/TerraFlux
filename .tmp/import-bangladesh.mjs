import fs from 'node:fs';
import Papa from 'papaparse';
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
if (!url || !key) throw new Error('Supabase server credentials are unavailable');
const bbox = { west: 88.0, south: 20.5, east: 92.7, north: 26.7 };
const files = [
  ['fire_archive_M-C61_834939.csv', 'MODIS Collection 6.1', 'MODIS', 'MODIS'],
  ['fire_archive_J2V-C2_834941.csv', 'VIIRS NOAA-21', 'VIIRS', 'N21'],
  ['fire_archive_J1V-C2_834940.csv', 'VIIRS NOAA-20', 'VIIRS', 'N20'],
  ['fire_archive_SV-C2_834942.csv', 'VIIRS S-NPP', 'VIIRS', 'N'],
];
function num(value) { const n = Number(value); return value === '' || !Number.isFinite(n) ? null : n; }
function normalize(rows, product, sensor, fallbackSatellite, sourceFileName) {
  return rows.flatMap((r) => {
    const lat = num(r.latitude), lon = num(r.longitude);
    if (lat === null || lon === null || !r.acq_date || !r.acq_time || lat < bbox.south || lat > bbox.north || lon < bbox.west || lon > bbox.east) return [];
    const confidence = sensor === 'MODIS' ? num(r.confidence) : null;
    const tier = sensor === 'MODIS' ? (confidence === null || confidence < 30 ? 'low' : confidence < 80 ? 'nominal' : 'high') : ((r.confidence || '').toLowerCase().startsWith('h') ? 'high' : (r.confidence || '').toLowerCase().startsWith('n') ? 'nominal' : 'low');
    const satellite = sensor === 'MODIS' ? (r.satellite || fallbackSatellite) : (r.satellite || fallbackSatellite);
    return [{ lat, lon, acq_date: r.acq_date, acq_time: String(r.acq_time).replace(/\D/g, '').padStart(4, '0'), sensor, satellite, resolution_m: sensor === 'MODIS' ? 1000 : 375, brightness_k: num(r.brightness ?? r.bright_ti4), brightness2_k: num(r.bright_t31 ?? r.bright_ti5), frp_mw: num(r.frp), confidence_tier: tier, confidence_raw: r.confidence ?? null, day_night: r.daynight === 'N' ? 'N' : r.daynight === 'D' ? 'D' : null, product, processing: 'ARCHIVE', source_file_name: sourceFileName }];
  });
}
async function rpc(rows) {
  const response = await fetch(`${url}/rest/v1/rpc/import_fire_detections`, { method: 'POST', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ _rows: rows }) });
  const body = await response.text(); if (!response.ok) throw new Error(`RPC ${response.status}: ${body.slice(0, 500)}`); return JSON.parse(body);
}
for (const [file, product, sensor, satellite] of files) {
  const parsed = Papa.parse(fs.readFileSync(`/vercel/share/v0-project/.v0/import/${file}`, 'utf8'), { header: true, skipEmptyLines: true }).data;
  const normalized = normalize(parsed, product, sensor, satellite, file);
  const uniqueRows = [...new Map(normalized.map((row) => [[row.lat, row.lon, row.acq_date, row.acq_time, row.sensor, row.satellite].join('|'), row])).values()];
  let inserted = 0, updated = 0, skipped = 0;
  for (let i = 0; i < uniqueRows.length; i += 500) { const result = await rpc(uniqueRows.slice(i, i + 500)); inserted += result.inserted || 0; updated += result.updated || 0; skipped += result.skipped || 0; }
  console.log(JSON.stringify({ file, sourceRows: parsed.length, bangladeshRows: uniqueRows.length, inserted, updated, skipped }));
}
