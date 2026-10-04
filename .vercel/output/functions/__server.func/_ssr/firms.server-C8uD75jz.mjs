//#region node_modules/.nitro/vite/services/ssr/assets/firms.server-C8uD75jz.js
function validateBbox(bbox) {
	const parts = bbox.split(",").map((p) => Number(p.trim()));
	if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) throw new Error("bbox must be \"west,south,east,north\" with four numbers");
	const [west, south, east, north] = parts;
	if (west >= east || south >= north) throw new Error("bbox is inverted: need west < east and south < north");
	if (south < -90 || north > 90 || west < -180 || east > 180) throw new Error("bbox out of range (lon -180..180, lat -90..90)");
	return [
		west,
		south,
		east,
		north
	];
}
function parseCsv(text, source) {
	const trimmed = text.trim();
	if (!trimmed) return [];
	const lines = trimmed.split(/\r?\n/);
	const headerLine = lines[0].toLowerCase();
	if (!headerLine.includes("latitude") || !headerLine.includes("longitude")) throw new Error(`NASA FIRMS ${source} rejection: ${trimmed.slice(0, 300)}`);
	if (lines.length < 2) return [];
	const headers = lines[0].split(",").map((h) => h.trim());
	const rows = [];
	for (let i = 1; i < lines.length; i++) {
		const cols = lines[i].split(",");
		if (cols.length !== headers.length) continue;
		const row = {};
		headers.forEach((h, j) => row[h] = cols[j].trim());
		rows.push(row);
	}
	return rows;
}
var num = (v) => {
	if (v === void 0 || v === "") return null;
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
};
function modisConfidenceTier(score) {
	if (score === null) return "low";
	if (score < 30) return "low";
	if (score < 80) return "nominal";
	return "high";
}
function harmonizeModis(rows) {
	const out = [];
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
			resolution_m: 1e3,
			brightness_k: num(r["brightness"]),
			brightness2_k: num(r["bright_t31"]),
			frp_mw: num(r["frp"]),
			confidence_tier: modisConfidenceTier(conf),
			confidence_raw: r["confidence"] ?? null,
			day_night: r["daynight"] === "N" ? "N" : r["daynight"] === "D" ? "D" : null
		});
	}
	return out;
}
function harmonizeViirs(rows) {
	const out = [];
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
			day_night: r["daynight"] === "N" ? "N" : r["daynight"] === "D" ? "D" : null
		});
	}
	return out;
}
async function fetchFirmsCsv(opts) {
	const { mapKey, source, bbox, days, date } = opts;
	const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${source}/${bbox}/${days}` + (date ? `/${date}` : "");
	const res = await fetch(url);
	if (!res.ok) {
		const body = await res.text().catch(() => "");
		throw new Error(`FIRMS ${source} request failed [${res.status}]: ${body.slice(0, 300)}`);
	}
	const text = await res.text();
	if (/^invalid|error/i.test(text.trim().slice(0, 20))) throw new Error(`FIRMS ${source} returned an error: ${text.slice(0, 300)}`);
	return parseCsv(text, source);
}
async function fetchAndHarmonize(opts) {
	const mapKey = (process.env["FIRMS_MAP_KEY"] || process.env["VITE_FIRMS_MAP_KEY"] || process.env["NASA_FIRMS_MAP_KEY"])?.trim();
	if (!mapKey) throw new Error("FIRMS_MAP_KEY is not set in Vercel environment variables. Please set FIRMS_MAP_KEY in Vercel Project Settings -> Environment Variables and trigger a fresh redeploy.");
	validateBbox(opts.bbox);
	if (!Number.isInteger(opts.days) || opts.days < 1 || opts.days > 5) throw new Error("days must be an integer between 1 and 5 — recent-checks endpoint only");
	const [modisRaw, viirsRaw] = await Promise.all([fetchFirmsCsv({
		...opts,
		mapKey,
		source: "MODIS_NRT"
	}), fetchFirmsCsv({
		...opts,
		mapKey,
		source: "VIIRS_NOAA20_NRT"
	})]);
	return [...harmonizeModis(modisRaw), ...harmonizeViirs(viirsRaw)];
}
async function upsertDetections(rows) {
	if (rows.length === 0) return 0;
	const CHUNK = 500;
	if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		let upserted = 0;
		for (let i = 0; i < rows.length; i += CHUNK) {
			const { error } = await supabaseAdmin.from("fire_detections").upsert(rows.slice(i, i + CHUNK), {
				onConflict: "lat,lon,acq_date,acq_time,sensor,satellite",
				ignoreDuplicates: true
			});
			if (error) throw new Error(`upsert failed: ${error.message}`);
			upserted += Math.min(CHUNK, rows.length - i);
		}
		return upserted;
	}
	const token = process.env["FIRELENS_INGEST_TOKEN"]?.trim();
	if (!token) throw new Error("No database write credentials: set FIRELENS_INGEST_TOKEN (or SUPABASE_SERVICE_ROLE_KEY) in Vercel environment variables and redeploy.");
	const { publicServerClient } = await import("./supabase-public.server-BKJqrls1.mjs");
	const sb = publicServerClient();
	let upserted = 0;
	for (let i = 0; i < rows.length; i += CHUNK) {
		const { data, error } = await sb.rpc("ingest_fire_detections", {
			_token: token,
			_rows: rows.slice(i, i + CHUNK)
		});
		if (error) throw new Error(`upsert failed: ${error.message}`);
		upserted += typeof data === "number" ? data : 0;
	}
	return upserted;
}
/** Split [startDate, endDate] into consecutive windows of at most 5 days. */
function chunkDateRange(startDate, endDate) {
	const start = /* @__PURE__ */ new Date(startDate + "T00:00:00Z");
	const end = /* @__PURE__ */ new Date(endDate + "T00:00:00Z");
	if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new Error("dates must be YYYY-MM-DD");
	if (start > end) throw new Error("start_date must be on or before end_date");
	const starts = [];
	const cursor = new Date(start);
	while (cursor <= end) {
		starts.push(cursor.toISOString().slice(0, 10));
		cursor.setUTCDate(cursor.getUTCDate() + 5);
	}
	return starts;
}
//#endregion
export { chunkDateRange, fetchAndHarmonize, upsertDetections };
