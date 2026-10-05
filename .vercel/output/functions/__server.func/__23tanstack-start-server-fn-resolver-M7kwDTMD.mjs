//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-M7kwDTMD.js
var manifest = {
	"19965a3ba3bbf3ee03fe44b0e27aba82af8c4cc628464213a639814626726208": {
		functionName: "getDailyCounts_createServerFn_handler",
		importer: () => import("./_ssr/firelens.functions-BPnXlzSK.mjs")
	},
	"2a7a39ee95d22edb7cc18a0c263bf5ec12b00fdc4b29e593a2df511c50a8eadf": {
		functionName: "triggerGlobalPull_createServerFn_handler",
		importer: () => import("./_ssr/firelens.functions-BPnXlzSK.mjs")
	},
	"2eb6082b8054b3a2c949ea86720867eeb37eca70984ea392fb222467e08cef32": {
		functionName: "getGlobalGridCells_createServerFn_handler",
		importer: () => import("./_ssr/firelens.functions-BPnXlzSK.mjs")
	},
	"9b5fd3c37788415adf5406154e297c40ef9714eb19b85dcdfcd73720bd7a9f99": {
		functionName: "fetchFireData_createServerFn_handler",
		importer: () => import("./_ssr/firelens.functions-BPnXlzSK.mjs")
	},
	"b18e849ffbb94fa9261d5adb4ec9fd20ebe3a2dba1bec9a563dfda350dd0acee": {
		functionName: "getDetections_createServerFn_handler",
		importer: () => import("./_ssr/firelens.functions-BPnXlzSK.mjs")
	},
	"b7f8bb219b1f057e80df7858dce0f2cbef3abc8bcbe7de9b8c2b5248b4d019c9": {
		functionName: "backfillFireData_createServerFn_handler",
		importer: () => import("./_ssr/firelens.functions-BPnXlzSK.mjs")
	},
	"b89bfb8f8acf2d3e273a3dae80b17400cc8e00aceb682311d42f89fd2d5fe2ff": {
		functionName: "getHomeMissionTelemetry_createServerFn_handler",
		importer: () => import("./_ssr/firelens.functions-BPnXlzSK.mjs")
	},
	"c5514e0a97d4cc310a8751abd6bee0b21d62f40f104f18b49fb00ceb1e63ff36": {
		functionName: "getLiveSnapshot_createServerFn_handler",
		importer: () => import("./_ssr/firelens.functions-BPnXlzSK.mjs")
	},
	"e615816906e90bb554e4742d1a566bb3852ed7f69cfdaf23416ddbb3ead1377b": {
		functionName: "getRecentGlobeObservations_createServerFn_handler",
		importer: () => import("./_ssr/firelens.functions-BPnXlzSK.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
