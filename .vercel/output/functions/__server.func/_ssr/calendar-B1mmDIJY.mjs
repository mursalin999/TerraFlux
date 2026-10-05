import { i as __toESM } from "../_runtime.mjs";
import { a as parseBbox, i as getRegion } from "./regions--TbXEuvW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { i as defaultFilters, n as EmptyState, r as RegionSelect, t as DateRangeInputs } from "./EmptyState-Doq5cxJR.mjs";
import { t as ActivityTimeline } from "./ActivityTimeline-Bbxj-r7y.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getDetections, r as getDailyCounts } from "./firelens.functions-BRu83nth.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-B1mmDIJY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/calendar.tsx?tsr-split=component";
function CalendarPage() {
	const defaults = defaultFilters();
	const navigate = useNavigate();
	const [regionId, setRegionId] = (0, import_react.useState)(defaults.regionId);
	const [startDate, setStartDate] = (0, import_react.useState)(defaults.startDate);
	const [endDate, setEndDate] = (0, import_react.useState)(defaults.endDate);
	const [mode, setMode] = (0, import_react.useState)("combined");
	const [selectedDayForAnalysis, setSelectedDayForAnalysis] = (0, import_react.useState)(null);
	const region = getRegion(regionId);
	const bboxParts = parseBbox(region.bbox);
	const query = useQuery({
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
	});
	const detectionsQuery = useQuery({
		queryKey: [
			"detections-calendar",
			regionId,
			startDate,
			endDate
		],
		queryFn: () => getDetections({ data: {
			...bboxParts,
			start_date: startDate,
			end_date: endDate
		} }),
		staleTime: 6e4
	});
	const days = query.data ?? [];
	const rawDetections = detectionsQuery.data ?? [];
	const countForMode = (day) => mode === "MODIS" ? day.modis : mode === "VIIRS" ? day.viirs : day.modis + day.viirs;
	const total = days.reduce((sum, day) => sum + countForMode(day), 0);
	const busiest = days.reduce((best, day) => countForMode(day) > (best ? countForMode(best) : -1) ? day : best, null);
	const monthlyTotals = /* @__PURE__ */ new Map();
	const weekdayTotals = Array.from({ length: 7 }, () => 0);
	for (const day of days) {
		const count = countForMode(day);
		const month = day.date.slice(0, 7);
		monthlyTotals.set(month, (monthlyTotals.get(month) ?? 0) + count);
		const weekday = (/* @__PURE__ */ new Date(`${day.date}T00:00:00Z`)).getUTCDay();
		weekdayTotals[weekday] = (weekdayTotals[weekday] ?? 0) + count;
	}
	const activeMonths = [...monthlyTotals.entries()].filter(([, count]) => count > 0);
	const busiestMonth = activeMonths.reduce((best, item) => !best || item[1] > best[1] ? item : best, null);
	const quietestMonth = activeMonths.reduce((best, item) => !best || item[1] < best[1] ? item : best, null);
	weekdayTotals.reduce((best, count, index) => count > weekdayTotals[best] ? index : best, 0);
	const monthLabel = (value) => (/* @__PURE__ */ new Date(`${value}-01T00:00:00Z`)).toLocaleString("en", {
		month: "long",
		year: "numeric",
		timeZone: "UTC"
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "font-mono text-xs uppercase tracking-wider text-data-blue",
						children: "TEMPORAL DENSITY ANALYSIS"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 70,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "mt-1 font-headline text-2xl font-semibold tracking-tight text-text",
						children: "Observation Calendar Matrix"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 73,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-1 font-mono text-xs text-text-secondary",
						children: [
							"Daily thermal anomaly count for ",
							region.name,
							". Highlights seasonal cycles and anomaly spikes."
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 76,
						columnNumber: 11
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 69,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-end gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RegionSelect, {
						value: regionId,
						onChange: setRegionId
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 82,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DateRangeInputs, {
						startDate,
						endDate,
						onStart: setStartDate,
						onEnd: setEndDate
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 83,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 81,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 68,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-6 flex gap-2",
				role: "tablist",
				"aria-label": "Sensor view",
				children: [
					"combined",
					"MODIS",
					"VIIRS"
				].map((m) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					role: "tab",
					"aria-selected": mode === m,
					onClick: () => setMode(m),
					className: `rounded border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${mode === m ? m === "MODIS" ? "border-data-blue bg-data-blue/20 text-data-blue font-semibold" : m === "VIIRS" ? "border-thermal-orange bg-thermal-orange/20 text-thermal-orange font-semibold" : "border-anomaly-amber bg-anomaly-amber/20 text-anomaly-amber font-semibold" : "border-border bg-surface text-text-secondary hover:text-text"}`,
					children: m === "combined" ? "HARMONIZED (BOTH)" : m
				}, m, false, {
					fileName: _jsxFileName,
					lineNumber: 88,
					columnNumber: 62
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 87,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-6",
				children: [
					query.isLoading && /* @__PURE__ */ (void 0)("div", {
						className: "rounded-lg border border-border bg-surface p-16 text-center font-mono text-xs text-text-secondary",
						children: "Reading stored observations…"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 94,
						columnNumber: 29
					}, this),
					query.isError && /* @__PURE__ */ (void 0)(EmptyState, {
						type: "firms_error",
						description: "Could not load daily observation counts from NASA FIRMS database.",
						onRetry: () => query.refetch()
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 97,
						columnNumber: 27
					}, this),
					!query.isLoading && !query.isError && days.length === 0 && /* @__PURE__ */ (void 0)(EmptyState, {
						type: "no_observations",
						title: "No satellite observations found for this selection.",
						description: `No stored observations for ${region.name} in this date range. Open Explore to fetch recent or backfill data from NASA FIRMS.`
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 98,
						columnNumber: 69
					}, this),
					days.length > 0 && /* @__PURE__ */ (void 0)(ActivityTimeline, {
						days,
						detections: rawDetections,
						selectedDate: selectedDayForAnalysis,
						onSelectDate: (date) => setSelectedDayForAnalysis(date),
						onFlyTo: (date) => {
							navigate({ to: "/explore" });
						}
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 99,
						columnNumber: 29
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 93,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-lg border border-border bg-surface p-5 font-mono",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-[10px] uppercase tracking-wider text-text-secondary",
								children: "TOTAL OBSERVATIONS"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 109,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-1 text-2xl font-bold text-text",
								children: total > 0 ? total.toLocaleString() : "Not available"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 112,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-1 text-[10px] text-text-secondary",
								children: mode === "combined" ? "MODIS + VIIRS combined" : `${mode} detector only`
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 115,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 108,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-lg border border-border bg-surface p-5 font-mono",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-[10px] uppercase tracking-wider text-text-secondary",
								children: "PEAK ACQUISITION DAY"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 121,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-1 text-lg font-bold text-text",
								children: busiest && countForMode(busiest) > 0 ? busiest.date : "Not available"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 124,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-1 text-[10px] text-text-secondary",
								children: busiest && countForMode(busiest) > 0 ? `${countForMode(busiest).toLocaleString()} observations on this date` : "No detections in range"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 127,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 120,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-lg border border-border bg-surface p-5 font-mono",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-[10px] uppercase tracking-wider text-text-secondary",
								children: "MAXIMUM MONTH"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 133,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-1 text-lg font-bold text-text",
								children: busiestMonth ? monthLabel(busiestMonth[0]) : "Not available"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 136,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-1 text-[10px] text-text-secondary",
								children: busiestMonth ? `${busiestMonth[1].toLocaleString()} total observations` : "Not available"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 139,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 132,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-lg border border-border bg-surface p-5 font-mono",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-[10px] uppercase tracking-wider text-text-secondary",
								children: "ACTIVE INTERVAL"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 145,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-1 text-lg font-bold text-text",
								children: activeMonths.length > 0 ? `${activeMonths.length} months active` : "Not available"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 148,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-1 text-[10px] text-text-secondary",
								children: quietestMonth ? `Lowest: ${monthLabel(quietestMonth[0])}` : "No detections recorded"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 151,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 144,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 107,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 67,
		columnNumber: 10
	}, this);
}
//#endregion
export { CalendarPage as component };
