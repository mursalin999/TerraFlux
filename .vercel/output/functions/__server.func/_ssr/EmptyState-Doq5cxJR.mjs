import "../_runtime.mjs";
import { n as REGIONS, t as CONFIDENCE_TIERS } from "./regions--TbXEuvW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { C as CircleAlert, l as RefreshCw, m as Flame, s as Satellite, v as Database } from "../_libs/lucide-react.mjs";
require_react();
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/FireControls.tsx";
function defaultFilters() {
	const end = /* @__PURE__ */ new Date();
	const start = /* @__PURE__ */ new Date();
	start.setUTCFullYear(start.getUTCFullYear() - 1);
	return {
		regionId: REGIONS[0].id,
		startDate: start.toISOString().slice(0, 10),
		endDate: end.toISOString().slice(0, 10),
		confidence: [...CONFIDENCE_TIERS],
		sensors: ["MODIS", "VIIRS"]
	};
}
function RegionSelect({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
		className: "flex flex-col gap-1 lg:w-full",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "font-mono text-[11px] uppercase tracking-wider text-text-secondary",
			children: "TARGET REGION"
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 33,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "rounded border border-border bg-surface px-3 py-2 font-mono text-xs text-text focus:border-data-blue focus:outline-none lg:w-full",
			children: REGIONS.map((r) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
				value: r.id,
				className: "bg-surface text-text",
				children: [
					r.name,
					" (",
					r.bbox,
					")"
				]
			}, r.id, true, {
				fileName: _jsxFileName$1,
				lineNumber: 42,
				columnNumber: 11
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 36,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 32,
		columnNumber: 5
	}, this);
}
function DateRangeInputs({ startDate, endDate, onStart, onEnd }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex gap-3 lg:grid lg:w-full lg:grid-cols-1",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
			className: "flex flex-col gap-1 lg:w-full",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "font-mono text-[11px] uppercase tracking-wider text-text-secondary",
				children: "ACQUISITION START"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 65,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
				type: "date",
				value: startDate,
				onChange: (e) => onStart(e.target.value),
				className: "rounded border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text focus:border-data-blue focus:outline-none lg:w-full"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 68,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 64,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
			className: "flex flex-col gap-1 lg:w-full",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "font-mono text-[11px] uppercase tracking-wider text-text-secondary",
				children: "ACQUISITION END"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 76,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
				type: "date",
				value: endDate,
				onChange: (e) => onEnd(e.target.value),
				className: "rounded border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text focus:border-data-blue focus:outline-none lg:w-full"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 79,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 75,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 63,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/components/EmptyState.tsx";
var PRESETS = {
	no_observations: {
		title: "No satellite observations found for this selection.",
		description: "No MODIS or VIIRS thermal anomalies were recorded within the selected spatial bounding box and date window.",
		icon: Satellite
	},
	historical_unavailable: {
		title: "Historical comparison unavailable.",
		description: "Insufficient baseline history stored for this temporal window. Select another date range or run an ingestion backfill.",
		icon: Database
	},
	viirs_unavailable: {
		title: "VIIRS observations unavailable for this period.",
		description: "VIIRS (Suomi-NPP / NOAA-20) data stream returned no records for this interval. MODIS observations may still be accessible.",
		icon: Flame
	},
	firms_error: {
		title: "NASA FIRMS data could not be retrieved.",
		description: "The connection to the NASA FIRMS near-real-time API was interrupted or timed out. Check network connectivity or retry.",
		icon: CircleAlert
	},
	custom: {
		title: "No data available",
		description: "No observational data exists for the current query parameters.",
		icon: CircleAlert
	}
};
function EmptyState({ type = "no_observations", title, description, onRetry, className = "" }) {
	const preset = PRESETS[type];
	const Icon = preset.icon;
	const displayTitle = title ?? preset.title;
	const displayDesc = description ?? preset.description;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		role: "status",
		"aria-live": "polite",
		className: `flex flex-col items-center justify-center rounded-lg border border-border/70 bg-surface/60 p-8 text-center font-mono backdrop-blur-sm ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-elevated text-text-secondary",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-6 w-6 stroke-[1.5]" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 69,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 68,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
				className: "mt-4 font-headline text-base font-semibold text-text",
				children: displayTitle
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 72,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-2 max-w-md text-xs leading-relaxed text-text-secondary",
				children: displayDesc
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 74,
				columnNumber: 7
			}, this),
			onRetry && /* @__PURE__ */ (void 0)("button", {
				type: "button",
				onClick: onRetry,
				className: "mt-5 inline-flex items-center gap-2 rounded border border-data-blue/50 bg-data-blue/10 px-4 py-2 text-xs font-semibold text-data-blue transition-colors hover:border-data-blue hover:bg-data-blue/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue",
				children: [/* @__PURE__ */ (void 0)(RefreshCw, { className: "h-3.5 w-3.5" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 82,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("span", { children: "RETRY PULL" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 83,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 77,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 63,
		columnNumber: 5
	}, this);
}
//#endregion
export { defaultFilters as i, EmptyState as n, RegionSelect as r, DateRangeInputs as t };
