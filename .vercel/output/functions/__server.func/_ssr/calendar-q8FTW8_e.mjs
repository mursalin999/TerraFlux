import { i as __toESM } from "../_runtime.mjs";
import { a as parseBbox, i as getRegion } from "./regions--TbXEuvW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as defaultFilters, n as EmptyState, r as RegionSelect, t as DateRangeInputs } from "./EmptyState-CYtulnKL.mjs";
import { t as ActivityTimeline } from "./ActivityTimeline-CCY4kQsk.mjs";
import { i as getDetections, r as getDailyCounts } from "./firelens.functions-C-GdgMFj.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as NasaFirmsFetcher } from "./NasaFirmsFetcher-D-raXJ-D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-q8FTW8_e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-xs uppercase tracking-wider text-data-blue",
						children: "TEMPORAL DENSITY ANALYSIS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-headline text-2xl font-semibold tracking-tight text-text",
						children: "Observation Calendar Matrix"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-mono text-xs text-text-secondary",
						children: [
							"Daily thermal anomaly count for ",
							region.name,
							". Highlights seasonal cycles and anomaly spikes."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegionSelect, {
						value: regionId,
						onChange: setRegionId
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateRangeInputs, {
						startDate,
						endDate,
						onStart: setStartDate,
						onEnd: setEndDate
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NasaFirmsFetcher, {
					initialRegionId: regionId,
					initialStartDate: startDate,
					initialEndDate: endDate
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex gap-2",
				role: "tablist",
				"aria-label": "Sensor view",
				children: [
					"combined",
					"MODIS",
					"VIIRS"
				].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					role: "tab",
					"aria-selected": mode === m,
					onClick: () => setMode(m),
					className: `rounded border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${mode === m ? m === "MODIS" ? "border-data-blue bg-data-blue/20 text-data-blue font-semibold" : m === "VIIRS" ? "border-thermal-orange bg-thermal-orange/20 text-thermal-orange font-semibold" : "border-anomaly-amber bg-anomaly-amber/20 text-anomaly-amber font-semibold" : "border-border bg-surface text-text-secondary hover:text-text"}`,
					children: m === "combined" ? "HARMONIZED (BOTH)" : m
				}, m))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [
					query.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-border bg-surface p-16 text-center font-mono text-xs text-text-secondary",
						children: "Reading stored observations…"
					}),
					query.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						type: "firms_error",
						description: "Could not load daily observation counts from NASA FIRMS database.",
						onRetry: () => query.refetch()
					}),
					!query.isLoading && !query.isError && days.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						type: "no_observations",
						title: "No satellite observations found for this selection.",
						description: `No stored observations for ${region.name} in this date range. Open Explore to fetch recent or backfill data from NASA FIRMS.`
					}),
					days.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityTimeline, {
						days,
						detections: rawDetections,
						selectedDate: selectedDayForAnalysis,
						onSelectDate: (date) => setSelectedDayForAnalysis(date),
						onFlyTo: (date) => {
							navigate({ to: "/explore" });
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-5 font-mono",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-text-secondary",
								children: "TOTAL OBSERVATIONS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-2xl font-bold text-text",
								children: total > 0 ? total.toLocaleString() : "Not available"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[10px] text-text-secondary",
								children: mode === "combined" ? "MODIS + VIIRS combined" : `${mode} detector only`
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-5 font-mono",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-text-secondary",
								children: "PEAK ACQUISITION DAY"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-lg font-bold text-text",
								children: busiest && countForMode(busiest) > 0 ? busiest.date : "Not available"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[10px] text-text-secondary",
								children: busiest && countForMode(busiest) > 0 ? `${countForMode(busiest).toLocaleString()} observations on this date` : "No detections in range"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-5 font-mono",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-text-secondary",
								children: "MAXIMUM MONTH"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-lg font-bold text-text",
								children: busiestMonth ? monthLabel(busiestMonth[0]) : "Not available"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[10px] text-text-secondary",
								children: busiestMonth ? `${busiestMonth[1].toLocaleString()} total observations` : "Not available"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-5 font-mono",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-text-secondary",
								children: "ACTIVE INTERVAL"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-lg font-bold text-text",
								children: activeMonths.length > 0 ? `${activeMonths.length} months active` : "Not available"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[10px] text-text-secondary",
								children: quietestMonth ? `Lowest: ${monthLabel(quietestMonth[0])}` : "No detections recorded"
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { CalendarPage as component };
