import { a as parseBbox, n as REGIONS } from "./regions--TbXEuvW.mjs";
import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType, t as arrayType } from "../_libs/zod.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firelens.functions-BBXfZNE1.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var bboxSchema = stringType().regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/, "bbox must be west,south,east,north");
var fetchFireData_createServerFn_handler = createServerRpc({
	id: "9b5fd3c37788415adf5406154e297c40ef9714eb19b85dcdfcd73720bd7a9f99",
	name: "fetchFireData",
	filename: "src/lib/firelens.functions.ts"
}, (opts) => fetchFireData.__executeServer(opts));
var fetchFireData = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	bbox: bboxSchema,
	days: numberType().int().min(1).max(5),
	date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
}).parse(data)).handler(fetchFireData_createServerFn_handler, async ({ data }) => {
	const { fetchAndHarmonize, upsertDetections } = await import("./firms.server-Ddze8PYh.mjs");
	const rows = await fetchAndHarmonize(data);
	return {
		rows,
		stored: await upsertDetections(rows)
	};
});
var backfillFireData_createServerFn_handler = createServerRpc({
	id: "b7f8bb219b1f057e80df7858dce0f2cbef3abc8bcbe7de9b8c2b5248b4d019c9",
	name: "backfillFireData",
	filename: "src/lib/firelens.functions.ts"
}, (opts) => backfillFireData.__executeServer(opts));
var backfillFireData = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	bbox: bboxSchema,
	start_date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/),
	end_date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/)
}).parse(data)).handler(backfillFireData_createServerFn_handler, async ({ data }) => {
	const { fetchAndHarmonize, upsertDetections, chunkDateRange } = await import("./firms.server-Ddze8PYh.mjs");
	const starts = chunkDateRange(data.start_date, data.end_date);
	let chunks = 0;
	let stored = 0;
	const errors = [];
	for (const date of starts) try {
		const rows = await fetchAndHarmonize({
			bbox: data.bbox,
			days: 5,
			date
		});
		stored += await upsertDetections(rows);
		chunks += 1;
	} catch (err) {
		errors.push(`${date}: ${err instanceof Error ? err.message : String(err)}`);
	}
	if (stored === 0 && errors.length > 0) throw new Error(errors[0]);
	return {
		chunks,
		stored,
		errors
	};
});
function publicClient() {
	const url = typeof process !== "undefined" && (process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"]) || typeof import.meta !== "undefined" && {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/"
	}["VITE_SUPABASE_URL"];
	const key = typeof process !== "undefined" && (process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"]) || typeof import.meta !== "undefined" && {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/"
	}["VITE_SUPABASE_PUBLISHABLE_KEY"];
	if (!url || !key) return null;
	try {
		return createClient(url, key, {
			auth: { persistSession: false },
			global: { fetch: (input, init) => {
				const h = new Headers(init?.headers);
				if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
				h.set("apikey", key);
				const controller = new AbortController();
				const timeout = setTimeout(() => controller.abort(), 12e3);
				const requestInit = {
					...init,
					headers: h,
					signal: controller.signal
				};
				return fetch(input, requestInit).finally(() => clearTimeout(timeout));
			} }
		});
	} catch {
		return null;
	}
}
var detectionsQuerySchema = objectType({
	west: numberType().min(-180).max(180),
	south: numberType().min(-90).max(90),
	east: numberType().min(-180).max(180),
	north: numberType().min(-90).max(90),
	start_date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/),
	end_date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/),
	sensors: arrayType(enumType(["MODIS", "VIIRS"])).optional(),
	confidence: arrayType(enumType([
		"low",
		"nominal",
		"high"
	])).optional()
});
var getDetections_createServerFn_handler = createServerRpc({
	id: "b18e849ffbb94fa9261d5adb4ec9fd20ebe3a2dba1bec9a563dfda350dd0acee",
	name: "getDetections",
	filename: "src/lib/firelens.functions.ts"
}, (opts) => getDetections.__executeServer(opts));
var getDetections = createServerFn({ method: "GET" }).inputValidator((data) => detectionsQuerySchema.parse(data)).handler(getDetections_createServerFn_handler, async ({ data }) => {
	const sb = publicClient();
	if (!sb) return [];
	let q = sb.from("fire_detections").select("lat,lon,acq_date,acq_time,sensor,satellite,resolution_m,brightness_k,brightness2_k,frp_mw,confidence_tier,day_night").gte("lon", data.west).lte("lon", data.east).gte("lat", data.south).lte("lat", data.north).gte("acq_date", data.start_date).lte("acq_date", data.end_date).order("acq_date", { ascending: true }).limit(2e4);
	if (data.sensors?.length) q = q.in("sensor", data.sensors);
	if (data.confidence?.length) q = q.in("confidence_tier", data.confidence);
	const { data: rows, error } = await q;
	if (error || !rows) return [];
	return rows;
});
var getDailyCounts_createServerFn_handler = createServerRpc({
	id: "19965a3ba3bbf3ee03fe44b0e27aba82af8c4cc628464213a639814626726208",
	name: "getDailyCounts",
	filename: "src/lib/firelens.functions.ts"
}, (opts) => getDailyCounts.__executeServer(opts));
var getDailyCounts = createServerFn({ method: "GET" }).inputValidator((data) => detectionsQuerySchema.omit({
	sensors: true,
	confidence: true
}).parse(data)).handler(getDailyCounts_createServerFn_handler, async ({ data }) => {
	const sb = publicClient();
	if (!sb) return [];
	const { data: rows, error } = await sb.from("fire_detections").select("acq_date,sensor").gte("lon", data.west).lte("lon", data.east).gte("lat", data.south).lte("lat", data.north).gte("acq_date", data.start_date).lte("acq_date", data.end_date).limit(1e5);
	if (error || !rows) return [];
	const counts = /* @__PURE__ */ new Map();
	for (const r of rows) {
		const entry = counts.get(r.acq_date) ?? {
			date: r.acq_date,
			modis: 0,
			viirs: 0
		};
		if (r.sensor === "MODIS") entry.modis += 1;
		else entry.viirs += 1;
		counts.set(r.acq_date, entry);
	}
	return [...counts.values()].sort((a, b) => a.date.localeCompare(b.date));
});
var getLiveSnapshot_createServerFn_handler = createServerRpc({
	id: "c5514e0a97d4cc310a8751abd6bee0b21d62f40f104f18b49fb00ceb1e63ff36",
	name: "getLiveSnapshot",
	filename: "src/lib/firelens.functions.ts"
}, (opts) => getLiveSnapshot.__executeServer(opts));
var getLiveSnapshot = createServerFn({ method: "GET" }).handler(getLiveSnapshot_createServerFn_handler, async () => {
	const sb = publicClient();
	if (!sb) return {
		totalDetections: 0,
		activeSensors: 0,
		regionsCovered: 0,
		totalRegions: REGIONS.length
	};
	const countQuery = (sensor) => {
		let query = sb.from("fire_detections").select("id", {
			count: "exact",
			head: true
		});
		if (sensor) query = query.eq("sensor", sensor);
		return query;
	};
	const [totalResult, modisResult, viirsResult, ...regionResults] = await Promise.all([
		countQuery(),
		countQuery("MODIS"),
		countQuery("VIIRS"),
		...REGIONS.map((region) => {
			const bounds = parseBbox(region.bbox);
			return sb.from("fire_detections").select("id", {
				count: "exact",
				head: true
			}).gte("lon", bounds.west).lte("lon", bounds.east).gte("lat", bounds.south).lte("lat", bounds.north);
		})
	]);
	if ([
		totalResult,
		modisResult,
		viirsResult,
		...regionResults
	].find((result) => result.error)?.error) return {
		totalDetections: 0,
		activeSensors: 0,
		regionsCovered: 0,
		totalRegions: REGIONS.length
	};
	const modisCount = modisResult.count ?? 0;
	const viirsCount = viirsResult.count ?? 0;
	const activeSensorsCount = (modisCount > 0 ? 1 : 0) + (viirsCount > 0 ? 1 : 0);
	return {
		totalDetections: totalResult.count ?? 0,
		activeSensors: activeSensorsCount,
		regionsCovered: regionResults.filter((result) => (result.count ?? 0) > 0).length,
		totalRegions: REGIONS.length
	};
});
var getHomeMissionTelemetry_createServerFn_handler = createServerRpc({
	id: "b89bfb8f8acf2d3e273a3dae80b17400cc8e00aceb682311d42f89fd2d5fe2ff",
	name: "getHomeMissionTelemetry",
	filename: "src/lib/firelens.functions.ts"
}, (opts) => getHomeMissionTelemetry.__executeServer(opts));
var getHomeMissionTelemetry = createServerFn({ method: "GET" }).handler(getHomeMissionTelemetry_createServerFn_handler, async () => {
	const sb = publicClient();
	if (!sb) return {
		status: "unavailable",
		totalDetections: 0,
		modisCount: 0,
		viirsCount: 0,
		latestAcqDate: null,
		lastIngestTime: null,
		baselineDays: 0,
		hasHarmonized: false,
		isRecentPull: false
	};
	try {
		const [totalRes, modisRes, viirsRes, latestRes, oldestRes] = await Promise.all([
			sb.from("fire_detections").select("id", {
				count: "exact",
				head: true
			}),
			sb.from("fire_detections").select("id", {
				count: "exact",
				head: true
			}).eq("sensor", "MODIS"),
			sb.from("fire_detections").select("id", {
				count: "exact",
				head: true
			}).eq("sensor", "VIIRS"),
			sb.from("fire_detections").select("acq_date,created_at").order("acq_date", { ascending: false }).limit(1),
			sb.from("fire_detections").select("acq_date").order("acq_date", { ascending: true }).limit(1)
		]);
		if (totalRes.error) return {
			status: "unavailable",
			totalDetections: 0,
			modisCount: 0,
			viirsCount: 0,
			latestAcqDate: null,
			lastIngestTime: null,
			baselineDays: 0,
			hasHarmonized: false,
			isRecentPull: false
		};
		const totalDetections = totalRes.count ?? 0;
		const modisCount = modisRes.count ?? 0;
		const viirsCount = viirsRes.count ?? 0;
		const latestRow = latestRes.data?.[0];
		const oldestRow = oldestRes.data?.[0];
		let baselineDays = 0;
		if (latestRow?.acq_date && oldestRow?.acq_date) {
			const diffMs = new Date(latestRow.acq_date).getTime() - new Date(oldestRow.acq_date).getTime();
			baselineDays = Math.max(1, Math.round(diffMs / 864e5) + 1);
		}
		let isRecentPull = false;
		if (latestRow?.created_at) isRecentPull = (Date.now() - new Date(latestRow.created_at).getTime()) / 36e5 <= 48;
		return {
			status: "ok",
			totalDetections,
			modisCount,
			viirsCount,
			latestAcqDate: latestRow?.acq_date ?? null,
			lastIngestTime: latestRow?.created_at ?? null,
			baselineDays,
			hasHarmonized: modisCount > 0 && viirsCount > 0,
			isRecentPull
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
			isRecentPull: false
		};
	}
});
var getRecentGlobeObservations_createServerFn_handler = createServerRpc({
	id: "e615816906e90bb554e4742d1a566bb3852ed7f69cfdaf23416ddbb3ead1377b",
	name: "getRecentGlobeObservations",
	filename: "src/lib/firelens.functions.ts"
}, (opts) => getRecentGlobeObservations.__executeServer(opts));
var getRecentGlobeObservations = createServerFn({ method: "GET" }).handler(getRecentGlobeObservations_createServerFn_handler, async () => {
	const sb = publicClient();
	if (!sb) return [];
	try {
		const latestRes = await sb.from("fire_detections").select("acq_date").order("acq_date", { ascending: false }).limit(1);
		if (!latestRes.data?.[0]?.acq_date) return [];
		const latestDate = /* @__PURE__ */ new Date(latestRes.data[0].acq_date + "T00:00:00Z");
		const windowStart = new Date(latestDate);
		windowStart.setUTCDate(windowStart.getUTCDate() - 6);
		const windowStartStr = windowStart.toISOString().slice(0, 10);
		const { data: rows, error } = await sb.from("fire_detections").select("lat,lon,acq_date,acq_time,sensor,satellite,resolution_m,brightness_k,brightness2_k,frp_mw,confidence_tier,day_night").gte("acq_date", windowStartStr).order("acq_date", { ascending: false }).limit(1e4);
		if (error || !rows) return [];
		return rows;
	} catch {
		return [];
	}
});
var getGlobalGridCells_createServerFn_handler = createServerRpc({
	id: "2eb6082b8054b3a2c949ea86720867eeb37eca70984ea392fb222467e08cef32",
	name: "getGlobalGridCells",
	filename: "src/lib/firelens.functions.ts"
}, (opts) => getGlobalGridCells.__executeServer(opts));
var getGlobalGridCells = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	start_date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	end_date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
}).parse(data)).handler(getGlobalGridCells_createServerFn_handler, async ({ data }) => {
	const sb = publicClient();
	if (!sb) return [];
	try {
		let query = sb.from("global_fire_cells").select("cell_id, lat, lon, acq_date, modis_count, viirs_count, total_count, max_frp, mean_frp, max_brightness_k, strong_agreement").order("acq_date", { ascending: false }).limit(1e4);
		if (data.start_date) query = query.gte("acq_date", data.start_date);
		if (data.end_date) query = query.lte("acq_date", data.end_date);
		const { data: rows, error } = await query;
		if (error || !rows) return [];
		return rows;
	} catch {
		return [];
	}
});
var triggerGlobalPull_createServerFn_handler = createServerRpc({
	id: "2a7a39ee95d22edb7cc18a0c263bf5ec12b00fdc4b29e593a2df511c50a8eadf",
	name: "triggerGlobalPull",
	filename: "src/lib/firelens.functions.ts"
}, (opts) => triggerGlobalPull.__executeServer(opts));
var triggerGlobalPull = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	days: numberType().int().min(1).max(3).default(1),
	date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	dry_run: booleanType().default(false)
}).parse(data)).handler(triggerGlobalPull_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./firms.server-Ddze8PYh.mjs");
	const { data: result, error } = await supabaseAdmin().functions.invoke("pull-global-firms", { body: data });
	if (error) throw new Error(`Edge function error: ${error.message}`);
	return result;
});
//#endregion
export { backfillFireData_createServerFn_handler, fetchFireData_createServerFn_handler, getDailyCounts_createServerFn_handler, getDetections_createServerFn_handler, getGlobalGridCells_createServerFn_handler, getHomeMissionTelemetry_createServerFn_handler, getLiveSnapshot_createServerFn_handler, getRecentGlobeObservations_createServerFn_handler, triggerGlobalPull_createServerFn_handler };
