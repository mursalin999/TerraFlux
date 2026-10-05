import { i as __toESM } from "../_runtime.mjs";
import { a as parseBbox, i as getRegion } from "./regions--TbXEuvW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { f as Map, g as Earth } from "../_libs/lucide-react.mjs";
import { i as defaultFilters, n as EmptyState, r as RegionSelect, t as DateRangeInputs } from "./EmptyState-Doq5cxJR.mjs";
import { C as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as getDailyCounts } from "./firelens.functions-BRu83nth.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as ObservationInspector } from "./ObservationInspector-kdjKBROQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compare-aIFxRYsl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/compare.tsx?tsr-split=component";
function Compare() {
	const defaults = defaultFilters();
	const [regionId, setRegionId] = (0, import_react.useState)(defaults.regionId);
	const [startDate, setStartDate] = (0, import_react.useState)(defaults.startDate);
	const [endDate, setEndDate] = (0, import_react.useState)(defaults.endDate);
	const [mode, setMode] = (0, import_react.useState)("combined");
	const [mapProjection, setMapProjection] = (0, import_react.useState)("3D");
	const [selectedObs, setSelectedObs] = (0, import_react.useState)(null);
	const region = getRegion(regionId);
	const bboxParts = parseBbox(region.bbox);
	const days = useQuery({
		queryKey: [
			"daily-counts",
			regionId,
			startDate,
			endDate
		],
		queryFn: () => getDailyCounts({ data: {
			...bboxParts,
			start_date: startDate,
			end_date: endDate
		} })
	}).data ?? [];
	const modisTotal = days.reduce((s, d) => s + d.modis, 0);
	const viirsTotal = days.reduce((s, d) => s + d.viirs, 0);
	Math.max(1, ...days.map((d) => d.modis + d.viirs));
	days.reduce((best, day) => !best || Math.abs(day.modis - day.viirs) > Math.abs(best.modis - best.viirs) ? day : best, null);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "border-b border-border pb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "font-mono text-xs uppercase tracking-wider text-data-blue",
						children: "CROSS-SENSOR RESOLUTION & AGREEMENT"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 38,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "mt-1 font-headline text-2xl font-semibold tracking-tight text-text",
						children: "Instrument Divergence Analysis"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 41,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-1 font-mono text-xs text-text-secondary",
						children: [
							"Comparing 1 km MODIS nadir observations with 375 m VIIRS I-band detections over",
							" ",
							region.name,
							"."
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 44,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 37,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
					className: "space-y-5 lg:sticky lg:top-20 lg:rounded-lg lg:border lg:border-border lg:bg-surface lg:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "border-b border-border pb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text",
							children: "ANALYSIS PARAMETERS"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 52,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap items-end gap-4 lg:flex-col lg:items-stretch",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RegionSelect, {
								value: regionId,
								onChange: setRegionId
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 56,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DateRangeInputs, {
								startDate,
								endDate,
								onStart: setStartDate,
								onEnd: setEndDate
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 57,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 55,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex gap-1.5 border-t border-border pt-4 lg:flex-col",
							role: "tablist",
							"aria-label": "Sensor selection",
							children: [
								"combined",
								"MODIS",
								"VIIRS"
							].map((m) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								role: "tab",
								"aria-selected": mode === m,
								onClick: () => setMode(m),
								className: `rounded border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${mode === m ? m === "MODIS" ? "border-data-blue bg-data-blue/20 text-data-blue font-semibold" : m === "VIIRS" ? "border-thermal-orange bg-thermal-orange/20 text-thermal-orange font-semibold" : "border-anomaly-amber bg-anomaly-amber/20 text-anomaly-amber font-semibold" : "border-border bg-surface text-text-secondary hover:text-text"}`,
								children: m === "combined" ? "HARMONIZED (BOTH)" : `${m} ONLY`
							}, m, false, {
								fileName: _jsxFileName,
								lineNumber: 60,
								columnNumber: 66
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 59,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 51,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 grid gap-6 lg:mt-0 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "relative h-[420px] overflow-hidden rounded-lg border border-border bg-bg lg:h-[620px]",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "absolute left-3 top-3 z-20 flex items-center gap-1 rounded-md border border-border/80 bg-surface/90 p-1 font-mono text-[10px] shadow-xl backdrop-blur-md",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setMapProjection("3D"),
								className: `flex items-center gap-1.5 rounded px-2.5 py-1 uppercase transition-colors ${mapProjection === "3D" ? "border border-data-blue bg-data-blue/20 text-data-blue font-semibold" : "text-text-secondary hover:text-text"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Earth, { className: "h-3 w-3" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 71,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "3D GLOBE" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 72,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 70,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setMapProjection("2D"),
								className: `flex items-center gap-1.5 rounded px-2.5 py-1 uppercase transition-colors ${mapProjection === "2D" ? "border border-thermal-orange bg-thermal-orange/20 text-thermal-orange font-semibold" : "text-text-secondary hover:text-text"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Map, { className: "h-3 w-3" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 75,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "2D MAP" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 76,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 74,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 69,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-full w-full bg-surface" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 80,
							columnNumber: 35
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 80,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 67,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "rounded-lg border border-border bg-surface p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-2 font-mono text-xs font-semibold uppercase text-text",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-2.5 w-2.5 rounded-full border border-data-blue bg-transparent" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 87,
												columnNumber: 19
											}, this), "MODIS (1 KM)"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 86,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "mt-2 font-mono text-3xl font-semibold text-data-blue",
											children: modisTotal.toLocaleString()
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 90,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "mt-1 font-mono text-[10px] uppercase text-text-secondary",
											children: "OBSERVATIONS IN RANGE"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 93,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 85,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "rounded-lg border border-border bg-surface p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-2 font-mono text-xs font-semibold uppercase text-text",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-2.5 w-2.5 rounded-full bg-thermal-orange" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 99,
												columnNumber: 19
											}, this), "VIIRS (375 M)"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 98,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "mt-2 font-mono text-3xl font-semibold text-thermal-orange",
											children: viirsTotal.toLocaleString()
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 102,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "mt-1 font-mono text-[10px] uppercase text-text-secondary",
											children: "OBSERVATIONS IN RANGE"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 105,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 97,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 84,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-lg border border-border bg-surface p-5 text-xs text-text-secondary",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "border-b border-border pb-2 font-mono text-xs font-semibold uppercase tracking-wider text-text",
										children: "CROSS-SENSOR AGREEMENT PRINCIPLES"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 113,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-3 leading-relaxed",
										children: "MODIS and VIIRS thermal anomaly counts rarely match 1:1. VIIRS features a 375 m pixel area that is approximately 7 times smaller than MODIS's 1 km pixel at nadir, allowing it to resolve smaller and lower-intensity thermal anomalies."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 116,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-2 leading-relaxed",
										children: "Furthermore, Aqua/Terra (MODIS) and Suomi NPP/NOAA-20 (VIIRS) cross over regions at different orbital times (approx. 01:30/13:30 vs 02:00/14:00 solar local time), meaning transient thermal events may be detected by one sensor before extinguishing or flaring up."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 121,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mt-3 rounded border border-border bg-surface-elevated p-3 font-mono text-[11px] text-text",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-semibold text-agreement-teal",
												children: "AGREEMENT METRIC:"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 128,
												columnNumber: 17
											}, this),
											" ",
											"Cross-sensor agreement indicates spatial-temporal correspondence between observations, but does not confirm a ground fire."
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 127,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 112,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-lg border border-border bg-surface p-5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between border-b border-border pb-2 font-mono text-xs font-semibold uppercase tracking-wider text-text",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "DAILY DETECTIONS BY SENSOR" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 137,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-3 text-[10px]",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "flex items-center gap-1 text-data-blue",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-2 w-2 rounded-full border border-data-blue" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 140,
												columnNumber: 21
											}, this), "MODIS (1 KM)"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 139,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "flex items-center gap-1 text-thermal-orange",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-2 w-2 rounded-full bg-thermal-orange" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 144,
												columnNumber: 21
											}, this), "VIIRS (375 M)"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 143,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 138,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 136,
									columnNumber: 15
								}, this), days.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "py-6",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EmptyState, { type: "no_observations" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 151,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 150,
									columnNumber: 36
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-2",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-72 w-full animate-pulse bg-surface-elevated/40" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 153,
										columnNumber: 41
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 153,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 152,
									columnNumber: 26
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 135,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 83,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 66,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 50,
				columnNumber: 7
			}, this),
			selectedObs && /* @__PURE__ */ (void 0)(ObservationInspector, {
				observation: selectedObs,
				cell: null,
				baselineWindow: `${startDate} to ${endDate}`,
				onClose: () => setSelectedObs(null)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 160,
				columnNumber: 23
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 36,
		columnNumber: 10
	}, this);
}
//#endregion
export { Compare as component };
