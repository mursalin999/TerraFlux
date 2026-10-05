import { i as __toESM } from "../_runtime.mjs";
import { i as getRegion, n as REGIONS } from "./regions--TbXEuvW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { l as RefreshCw, s as Satellite } from "../_libs/lucide-react.mjs";
import { a as useServerFn } from "./EmptyState-CYtulnKL.mjs";
import { n as fetchFireData, t as backfillFireData } from "./firelens.functions-C-GdgMFj.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/NasaFirmsFetcher-D-raXJ-D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function dateValue(offsetDays) {
	const date = /* @__PURE__ */ new Date();
	date.setUTCDate(date.getUTCDate() + offsetDays);
	return date.toISOString().slice(0, 10);
}
function NasaFirmsFetcher({ initialRegionId = REGIONS[0].id, initialStartDate = dateValue(-3), initialEndDate = dateValue(0) }) {
	const [regionId, setRegionId] = (0, import_react.useState)(initialRegionId);
	const [startDate, setStartDate] = (0, import_react.useState)(initialStartDate);
	const [endDate, setEndDate] = (0, import_react.useState)(initialEndDate);
	const [status, setStatus] = (0, import_react.useState)({ kind: "idle" });
	const runBackfill = useServerFn(backfillFireData);
	const runFetch = useServerFn(fetchFireData);
	const queryClient = useQueryClient();
	const region = getRegion(regionId);
	const refreshData = async () => {
		if (!startDate || !endDate) {
			setStatus({
				kind: "error",
				message: "Choose both dates."
			});
			return;
		}
		if (startDate > endDate) {
			setStatus({
				kind: "error",
				message: "Start date must be on or before end date."
			});
			return;
		}
		setStatus({ kind: "loading" });
		try {
			const result = await runBackfill({ data: {
				bbox: region.bbox,
				start_date: startDate,
				end_date: endDate
			} });
			await queryClient.invalidateQueries();
			setStatus({
				kind: "success",
				stored: result.stored
			});
		} catch (error) {
			setStatus({
				kind: "error",
				message: error instanceof Error ? error.message : "NASA FIRMS fetch failed."
			});
		}
	};
	const fetchRecent = async () => {
		setStatus({ kind: "loading" });
		try {
			const result = await runFetch({ data: {
				bbox: region.bbox,
				days: 3
			} });
			await queryClient.invalidateQueries();
			setStatus({
				kind: "success",
				stored: result.stored
			});
		} catch (error) {
			setStatus({
				kind: "error",
				message: error instanceof Error ? error.message : "NASA FIRMS fetch failed."
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-border bg-surface p-4 shadow-sm sm:p-5",
		"aria-labelledby": "nasa-firms-fetcher-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-data-blue",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Satellite, {
							className: "h-3.5 w-3.5",
							"aria-hidden": "true"
						}), "NASA FIRMS DATA INGEST"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "nasa-firms-fetcher-title",
						className: "mt-1 font-headline text-lg font-semibold text-text",
						children: "Fetch observations for any date range"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-2xl font-mono text-[11px] leading-relaxed text-text-secondary",
						children: "Pull MODIS and VIIRS records directly from NASA FIRMS and make them available across the globe, calendar, and comparison views."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded border border-agreement-teal/40 bg-agreement-teal/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-agreement-teal",
					children: "API CONNECTED"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_1fr_1fr_auto] sm:items-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary",
						children: ["Region", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: regionId,
							onChange: (event) => setRegionId(event.target.value),
							className: "min-h-9 rounded border border-border bg-bg px-2.5 text-xs normal-case tracking-normal text-text focus:border-data-blue focus:outline-none",
							children: REGIONS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: item.id,
								children: item.name
							}, item.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary",
						children: ["From", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: startDate,
							onChange: (event) => setStartDate(event.target.value),
							className: "min-h-9 rounded border border-border bg-bg px-2.5 text-xs text-text focus:border-data-blue focus:outline-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary",
						children: ["To", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: endDate,
							onChange: (event) => setEndDate(event.target.value),
							className: "min-h-9 rounded border border-border bg-bg px-2.5 text-xs text-text focus:border-data-blue focus:outline-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: refreshData,
						disabled: status.kind === "loading",
						className: "inline-flex min-h-9 items-center justify-center gap-2 rounded bg-data-blue px-4 font-mono text-xs font-semibold text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
							className: status.kind === "loading" ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5",
							"aria-hidden": "true"
						}), "FETCH DATE RANGE"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-text-secondary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: fetchRecent,
					disabled: status.kind === "loading",
					className: "underline underline-offset-2 hover:text-text disabled:opacity-50",
					children: "Fetch latest 3 days instead"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					"aria-live": "polite",
					children: [
						status.kind === "loading" && "Contacting NASA FIRMS and storing observations…",
						status.kind === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-agreement-teal",
							children: [
								"Fetch complete: ",
								status.stored.toLocaleString(),
								" records stored."
							]
						}),
						status.kind === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-critical-red",
							children: status.message
						}),
						status.kind === "idle" && "Fetched records are shared by every data view."
					]
				})]
			})
		]
	});
}
//#endregion
export { NasaFirmsFetcher as t };
