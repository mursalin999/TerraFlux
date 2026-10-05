import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-M7kwDTMD.mjs";
import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firelens.functions-BRu83nth.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var bboxSchema = stringType().regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/, "bbox must be west,south,east,north");
var fetchFireData = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	bbox: bboxSchema,
	days: numberType().int().min(1).max(5),
	date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
}).parse(data)).handler(createSsrRpc("9b5fd3c37788415adf5406154e297c40ef9714eb19b85dcdfcd73720bd7a9f99"));
var backfillFireData = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	bbox: bboxSchema,
	start_date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/),
	end_date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/)
}).parse(data)).handler(createSsrRpc("b7f8bb219b1f057e80df7858dce0f2cbef3abc8bcbe7de9b8c2b5248b4d019c9"));
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
var getDetections = createServerFn({ method: "GET" }).inputValidator((data) => detectionsQuerySchema.parse(data)).handler(createSsrRpc("b18e849ffbb94fa9261d5adb4ec9fd20ebe3a2dba1bec9a563dfda350dd0acee"));
var getDailyCounts = createServerFn({ method: "GET" }).inputValidator((data) => detectionsQuerySchema.omit({
	sensors: true,
	confidence: true
}).parse(data)).handler(createSsrRpc("19965a3ba3bbf3ee03fe44b0e27aba82af8c4cc628464213a639814626726208"));
createServerFn({ method: "GET" }).handler(createSsrRpc("c5514e0a97d4cc310a8751abd6bee0b21d62f40f104f18b49fb00ceb1e63ff36"));
var getHomeMissionTelemetry = createServerFn({ method: "GET" }).handler(createSsrRpc("b89bfb8f8acf2d3e273a3dae80b17400cc8e00aceb682311d42f89fd2d5fe2ff"));
createServerFn({ method: "GET" }).handler(createSsrRpc("e615816906e90bb554e4742d1a566bb3852ed7f69cfdaf23416ddbb3ead1377b"));
createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	start_date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	end_date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
}).parse(data)).handler(createSsrRpc("2eb6082b8054b3a2c949ea86720867eeb37eca70984ea392fb222467e08cef32"));
createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	days: numberType().int().min(1).max(3).default(1),
	date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	dry_run: booleanType().default(false)
}).parse(data)).handler(createSsrRpc("2a7a39ee95d22edb7cc18a0c263bf5ec12b00fdc4b29e593a2df511c50a8eadf"));
//#endregion
export { getHomeMissionTelemetry as a, getDetections as i, fetchFireData as n, getDailyCounts as r, backfillFireData as t };
