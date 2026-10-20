import { i as __toESM } from "../_runtime.mjs";
import { n as REGIONS, t as CONFIDENCE_TIERS } from "./regions--TbXEuvW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { K as isRedirect, S as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as CircleAlert, l as RefreshCw, m as Flame, s as Satellite, v as Database } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmptyState-CYtulnKL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1 lg:w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[11px] uppercase tracking-wider text-text-secondary",
			children: "TARGET REGION"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "rounded border border-border bg-surface px-3 py-2 font-mono text-xs text-text focus:border-data-blue focus:outline-none lg:w-full",
			children: REGIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
				value: r.id,
				className: "bg-surface text-text",
				children: [
					r.name,
					" (",
					r.bbox,
					")"
				]
			}, r.id))
		})]
	});
}
function DateRangeInputs({ startDate, endDate, onStart, onEnd }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3 lg:grid lg:w-full lg:grid-cols-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "flex flex-col gap-1 lg:w-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[11px] uppercase tracking-wider text-text-secondary",
				children: "ACQUISITION START"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "date",
				value: startDate,
				onChange: (e) => onStart(e.target.value),
				className: "rounded border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text focus:border-data-blue focus:outline-none lg:w-full"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "flex flex-col gap-1 lg:w-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[11px] uppercase tracking-wider text-text-secondary",
				children: "ACQUISITION END"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "date",
				value: endDate,
				onChange: (e) => onEnd(e.target.value),
				className: "rounded border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text focus:border-data-blue focus:outline-none lg:w-full"
			})]
		})]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "status",
		"aria-live": "polite",
		className: `flex flex-col items-center justify-center rounded-lg border border-border/70 bg-surface/60 p-8 text-center font-mono backdrop-blur-sm ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-elevated text-text-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6 stroke-[1.5]" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 font-headline text-base font-semibold text-text",
				children: displayTitle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-md text-xs leading-relaxed text-text-secondary",
				children: displayDesc
			}),
			onRetry && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onRetry,
				className: "mt-5 inline-flex items-center gap-2 rounded border border-data-blue/50 bg-data-blue/10 px-4 py-2 text-xs font-semibold text-data-blue transition-colors hover:border-data-blue hover:bg-data-blue/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "RETRY PULL" })]
			})
		]
	});
}
//#endregion
export { useServerFn as a, defaultFilters as i, EmptyState as n, RegionSelect as r, DateRangeInputs as t };
