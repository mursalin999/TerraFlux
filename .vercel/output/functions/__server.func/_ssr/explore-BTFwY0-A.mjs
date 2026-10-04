import { i as __toESM } from "../_runtime.mjs";
import { a as parseBbox, i as getRegion, n as REGIONS, r as SENSOR_META } from "./regions--TbXEuvW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as ArrowUpDown, E as ChevronDown, _ as Download, c as RotateCcw, f as Map$1, g as Earth, i as SlidersHorizontal, l as RefreshCw, n as Table, o as Search, t as X, w as ChevronUp } from "../_libs/lucide-react.mjs";
import { i as defaultFilters, n as EmptyState } from "./EmptyState-B8YbAUtk.mjs";
import { t as ActivityTimeline } from "./ActivityTimeline-CCY4kQsk.mjs";
import { C as ClientOnly, K as isRedirect, S as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getDetections, n as fetchFireData, t as backfillFireData } from "./firelens.functions-DoSrae7C.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as ObservationInspector } from "./ObservationInspector-CbyNurQk.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Drawer } from "../_libs/vaul.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore-BTFwY0-A.js
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
var GRID_CELL_SIZE = .15;
function computeAnalyticalGrid(observations, startDate, endDate, cellSize = GRID_CELL_SIZE) {
	const cellMap = /* @__PURE__ */ new Map();
	for (const obs of observations) {
		const latIdx = Math.floor(obs.lat / cellSize);
		const lonIdx = Math.floor(obs.lon / cellSize);
		const centerLat = Number((latIdx * cellSize + cellSize / 2).toFixed(4));
		const centerLon = Number((lonIdx * cellSize + cellSize / 2).toFixed(4));
		const id = `${latIdx}_${lonIdx}`;
		let cell = cellMap.get(id);
		if (!cell) {
			cell = {
				id,
				lat: centerLat,
				lon: centerLon,
				bounds: {
					west: Number((lonIdx * cellSize).toFixed(4)),
					south: Number((latIdx * cellSize).toFixed(4)),
					east: Number(((lonIdx + 1) * cellSize).toFixed(4)),
					north: Number(((latIdx + 1) * cellSize).toFixed(4))
				},
				modisCount: 0,
				viirsCount: 0,
				totalCount: 0,
				meanFrp: null,
				maxBrightness: null,
				dayCount: 0,
				nightCount: 0,
				agreementLevel: "NONE",
				agreementRatio: 0,
				anomalyPercentile: 0,
				isAnomaly: false,
				harmonizedIntensity: 0,
				observations: []
			};
			cellMap.set(id, cell);
		}
		cell.observations.push(obs);
		if (obs.sensor === "MODIS") cell.modisCount += 1;
		else cell.viirsCount += 1;
		cell.totalCount += 1;
		if (obs.day_night === "D") cell.dayCount += 1;
		if (obs.day_night === "N") cell.nightCount += 1;
		if (obs.brightness_k != null) cell.maxBrightness = Math.max(cell.maxBrightness ?? 0, obs.brightness_k);
	}
	const cells = Array.from(cellMap.values());
	if (cells.length === 0) return {
		cells: [],
		maxCount: 0,
		p80Count: 0,
		p90Count: 0,
		strongAgreementCount: 0,
		moderateAgreementCount: 0,
		limitedAgreementCount: 0,
		noneAgreementCount: 0,
		totalObservations: 0,
		baselineWindowLabel: `${startDate} → ${endDate}`
	};
	let maxCount = 1;
	for (const cell of cells) {
		maxCount = Math.max(maxCount, cell.totalCount);
		const frpVals = cell.observations.map((o) => o.frp_mw).filter((v) => v != null && v > 0);
		cell.meanFrp = frpVals.length > 0 ? frpVals.reduce((a, b) => a + b, 0) / frpVals.length : null;
		const hasModis = cell.modisCount > 0;
		const hasViirs = cell.viirsCount > 0;
		const hasHighConf = cell.observations.some((o) => o.confidence_tier === "high");
		const hasNominalConf = cell.observations.some((o) => o.confidence_tier === "nominal" || o.confidence_tier === "high");
		if (hasModis && hasViirs) if (hasHighConf || cell.modisCount >= 2 && cell.viirsCount >= 2) {
			cell.agreementLevel = "STRONG";
			cell.agreementRatio = 1;
		} else {
			cell.agreementLevel = "MODERATE";
			cell.agreementRatio = .75;
		}
		else if (hasNominalConf && (cell.modisCount >= 2 || cell.viirsCount >= 3)) {
			cell.agreementLevel = "LIMITED";
			cell.agreementRatio = .45;
		} else {
			cell.agreementLevel = "NONE";
			cell.agreementRatio = .15;
		}
	}
	const sortedCounts = [...cells.map((c) => c.totalCount)].sort((a, b) => a - b);
	const p80Index = Math.floor(sortedCounts.length * .8);
	const p90Index = Math.floor(sortedCounts.length * .9);
	const p80Count = sortedCounts[p80Index] ?? 1;
	const p90Count = sortedCounts[p90Index] ?? p80Count;
	let strongAgreementCount = 0;
	let moderateAgreementCount = 0;
	let limitedAgreementCount = 0;
	let noneAgreementCount = 0;
	for (const cell of cells) {
		const rank = sortedCounts.filter((c) => c <= cell.totalCount).length;
		cell.anomalyPercentile = Math.round(rank / sortedCounts.length * 100);
		cell.isAnomaly = cell.totalCount >= p90Count;
		const weightedScore = cell.modisCount * 1.15 + cell.viirsCount * .75;
		cell.harmonizedIntensity = Math.min(1, Math.max(.1, weightedScore / (maxCount * .9)));
		if (cell.agreementLevel === "STRONG") strongAgreementCount++;
		else if (cell.agreementLevel === "MODERATE") moderateAgreementCount++;
		else if (cell.agreementLevel === "LIMITED") limitedAgreementCount++;
		else noneAgreementCount++;
	}
	return {
		cells,
		maxCount,
		p80Count,
		p90Count,
		strongAgreementCount,
		moderateAgreementCount,
		limitedAgreementCount,
		noneAgreementCount,
		totalObservations: observations.length,
		baselineWindowLabel: `${startDate} → ${endDate}`
	};
}
var AGREEMENT_DEFINITIONS = {
	STRONG: {
		label: "STRONG",
		color: "#56D6C9",
		bg: "rgba(86, 214, 201, 0.25)",
		border: "rgba(86, 214, 201, 0.8)",
		criteria: "Dual-sensor correspondence: MODIS (1 km) and VIIRS (375 m) both detected anomalies in this cell."
	},
	MODERATE: {
		label: "MODERATE",
		color: "#56D6C9",
		bg: "rgba(86, 214, 201, 0.18)",
		border: "rgba(86, 214, 201, 0.55)",
		criteria: "Dual-sensor correspondence with nominal confidence across separate overpasses."
	},
	LIMITED: {
		label: "LIMITED",
		color: "#91A0B5",
		bg: "rgba(145, 160, 181, 0.15)",
		border: "rgba(145, 160, 181, 0.4)",
		criteria: "Single-sensor detection only. Awaiting cross-sensor overpass confirmation."
	},
	NONE: {
		label: "NONE",
		color: "#91A0B5",
		bg: "rgba(145, 160, 181, 0.08)",
		border: "rgba(145, 160, 181, 0.25)",
		criteria: "Marginal or low-confidence anomaly without multi-sensor confirmation."
	}
};
function ObservationsTableModal({ isOpen, onClose, observations, regionName }) {
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [sortField, setSortField] = (0, import_react.useState)("acq_date");
	const [sortAsc, setSortAsc] = (0, import_react.useState)(false);
	const [page, setPage] = (0, import_react.useState)(1);
	const pageSize = 25;
	const filtered = (0, import_react.useMemo)(() => {
		return observations.filter((obs) => {
			if (!searchTerm) return true;
			const term = searchTerm.toLowerCase();
			return obs.sensor.toLowerCase().includes(term) || obs.satellite.toLowerCase().includes(term) || obs.acq_date.includes(term) || obs.confidence_tier.toLowerCase().includes(term) || obs.lat.toFixed(3).includes(term) || obs.lon.toFixed(3).includes(term);
		});
	}, [observations, searchTerm]);
	const sorted = (0, import_react.useMemo)(() => {
		return [...filtered].sort((a, b) => {
			const va = a[sortField];
			const vb = b[sortField];
			if (va == null) return 1;
			if (vb == null) return -1;
			if (typeof va === "string" && typeof vb === "string") return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
			return sortAsc ? va - vb : vb - va;
		});
	}, [
		filtered,
		sortField,
		sortAsc
	]);
	const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
	const currentPageRows = (0, import_react.useMemo)(() => {
		const start = (page - 1) * pageSize;
		return sorted.slice(start, start + pageSize);
	}, [
		sorted,
		page,
		pageSize
	]);
	if (!isOpen) return null;
	const toggleSort = (field) => {
		if (sortField === field) setSortAsc(!sortAsc);
		else {
			setSortField(field);
			setSortAsc(false);
		}
	};
	const exportCsv = () => {
		if (observations.length === 0) return;
		const headers = [
			"latitude",
			"longitude",
			"acq_date",
			"acq_time",
			"sensor",
			"satellite",
			"resolution_m",
			"brightness_k",
			"frp_mw",
			"confidence_tier",
			"day_night"
		];
		const rows = observations.map((o) => [
			o.lat,
			o.lon,
			o.acq_date,
			o.acq_time,
			o.sensor,
			o.satellite,
			o.resolution_m,
			o.brightness_k ?? "",
			o.frp_mw ?? "",
			o.confidence_tier,
			o.day_night ?? ""
		]);
		const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `terraflux_${regionName.toLowerCase()}_observations.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "table-modal-title",
		className: "fixed inset-0 z-50 flex items-center justify-center bg-bg/85 p-4 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-h-[90vh] w-full max-w-5xl flex-col rounded-lg border border-border bg-surface shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						id: "table-modal-title",
						className: "font-headline text-lg font-semibold text-text",
						children: ["Observation Register — ", regionName]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs text-text-secondary",
						children: [
							"Total ",
							observations.length.toLocaleString(),
							" satellite radiometric anomalies in current filter window."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: exportCsv,
							className: "flex items-center gap-1.5 rounded border border-border bg-surface-elevated px-3 py-1.5 font-mono text-xs text-text hover:bg-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "EXPORT CSV" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							"aria-label": "Close table view",
							className: "rounded p-1 text-text-secondary hover:bg-surface-elevated hover:text-text",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 border-b border-border bg-surface-elevated/40 px-6 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-3.5 w-3.5 text-text-secondary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: searchTerm,
							onChange: (e) => {
								setSearchTerm(e.target.value);
								setPage(1);
							},
							placeholder: "Search by sensor, satellite, date, coordinates, or tier…",
							className: "w-full rounded border border-border bg-surface py-1.5 pl-9 pr-3 font-mono text-xs text-text placeholder:text-text-secondary/60 focus:border-data-blue focus:outline-none"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs text-text-secondary",
						children: [
							"SHOWING ",
							sorted.length,
							" RECORDS"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-auto px-6 py-2",
					children: sorted.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-16 text-center font-mono text-xs text-text-secondary",
						children: "No observation records match your search criteria."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left font-mono text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "sticky top-0 border-b border-border bg-surface text-[11px] text-text-secondary uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "cursor-pointer py-3 pr-4 hover:text-text",
									onClick: () => toggleSort("acq_date"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ACQUISITION" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3 w-3" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "COORDINATES"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "SENSOR"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "PLATFORM"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "RESOLUTION"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "cursor-pointer py-3 px-4 hover:text-text",
									onClick: () => toggleSort("frp_mw"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FRP (MW)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3 w-3" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "cursor-pointer py-3 px-4 hover:text-text",
									onClick: () => toggleSort("brightness_k"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BRIGHTNESS" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3 w-3" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 pl-4",
									children: "CONFIDENCE"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border/40",
							children: currentPageRows.map((obs, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-surface-elevated/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2.5 pr-4 text-text",
										children: [
											obs.acq_date,
											" ",
											obs.acq_time,
											" UTC (",
											obs.day_night === "D" ? "DAY" : "NIGHT",
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2.5 px-4 text-text-secondary",
										children: [
											obs.lat.toFixed(4),
											", ",
											obs.lon.toFixed(4)
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-flex items-center gap-1 font-semibold",
											style: { color: obs.sensor === "MODIS" ? SENSOR_META.MODIS.color : SENSOR_META.VIIRS.color },
											children: obs.sensor
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 px-4 text-text",
										children: obs.satellite
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2.5 px-4 text-text-secondary",
										children: [obs.resolution_m, " m"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 px-4 font-semibold text-text",
										children: obs.frp_mw != null ? `${obs.frp_mw.toFixed(1)} MW` : "Not available"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 px-4 text-text-secondary",
										children: obs.brightness_k != null ? `${obs.brightness_k.toFixed(1)} K` : "Not available"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 pl-4 uppercase",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `rounded px-1.5 py-0.5 text-[10px] font-semibold ${obs.confidence_tier === "high" ? "bg-data-blue/20 text-data-blue" : obs.confidence_tier === "nominal" ? "bg-surface-elevated text-text" : "bg-surface text-text-secondary"}`,
											children: obs.confidence_tier
										})
									})
								]
							}, idx))
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-border px-6 py-3 font-mono text-xs text-text-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						"PAGE ",
						page,
						" OF ",
						totalPages
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: page <= 1,
							onClick: () => setPage((p) => Math.max(1, p - 1)),
							className: "rounded border border-border bg-surface px-3 py-1 text-text disabled:opacity-40",
							children: "PREVIOUS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: page >= totalPages,
							onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
							className: "rounded border border-border bg-surface px-3 py-1 text-text disabled:opacity-40",
							children: "NEXT"
						})]
					})]
				})
			]
		})
	});
}
var Drawer$1 = ({ shouldScaleBackground = true, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Root, {
	shouldScaleBackground,
	...props
});
Drawer$1.displayName = "Drawer";
Drawer.Trigger;
var DrawerPortal = Drawer.Portal;
Drawer.Close;
var DrawerOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80", className),
	...props
}));
DrawerOverlay.displayName = Drawer.Overlay.displayName;
var DrawerContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Content, {
	ref,
	className: cn("fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" }), children]
})] }));
DrawerContent.displayName = "DrawerContent";
var DrawerHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("grid gap-1.5 p-4 text-center sm:text-left", className),
	...props
});
DrawerHeader.displayName = "DrawerHeader";
var DrawerFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("mt-auto flex flex-col gap-2 p-4", className),
	...props
});
DrawerFooter.displayName = "DrawerFooter";
var DrawerTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Title, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DrawerTitle.displayName = Drawer.Title.displayName;
var DrawerDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DrawerDescription.displayName = Drawer.Description.displayName;
function monthChunks(start, end) {
	const out = [];
	const cursor = /* @__PURE__ */ new Date(start + "T00:00:00Z");
	const last = /* @__PURE__ */ new Date(end + "T00:00:00Z");
	while (cursor <= last) {
		const chunkEnd = new Date(cursor);
		chunkEnd.setUTCDate(chunkEnd.getUTCDate() + 29);
		if (chunkEnd > last) chunkEnd.setTime(last.getTime());
		out.push({
			start: cursor.toISOString().slice(0, 10),
			end: chunkEnd.toISOString().slice(0, 10)
		});
		cursor.setUTCDate(cursor.getUTCDate() + 30);
	}
	return out;
}
function ExploreWorkspace() {
	const [filters, setFilters] = (0, import_react.useState)(defaultFilters);
	const [timeScale, setTimeScale] = (0, import_react.useState)("daily");
	const [activeSensor, setActiveSensor] = (0, import_react.useState)("HARMONIZED");
	const [activeView, setActiveView] = (0, import_react.useState)("NATIVE");
	const [mapProjection, setMapProjection] = (0, import_react.useState)("3D");
	const [isParamsOpen, setIsParamsOpen] = (0, import_react.useState)(false);
	const [isLegendExpanded, setIsLegendExpanded] = (0, import_react.useState)(true);
	const [isMobileDrawerOpen, setIsMobileDrawerOpen] = (0, import_react.useState)(false);
	const [isTableModalOpen, setIsTableModalOpen] = (0, import_react.useState)(false);
	const [selectedObs, setSelectedObs] = (0, import_react.useState)(null);
	const [selectedCell, setSelectedCell] = (0, import_react.useState)(null);
	const [timelineExpanded, setTimelineExpanded] = (0, import_react.useState)(false);
	const [selectedAnalysisDate, setSelectedAnalysisDate] = (0, import_react.useState)(null);
	const [pull, setPull] = (0, import_react.useState)({ status: "idle" });
	const queryClient = useQueryClient();
	const runBackfill = useServerFn(backfillFireData);
	const runFetch = useServerFn(fetchFireData);
	const region = getRegion(filters.regionId);
	const bboxParts = parseBbox(region.bbox);
	const query = useQuery({
		queryKey: [
			"detections",
			filters.regionId,
			filters.startDate,
			filters.endDate,
			filters.confidence.join(",")
		],
		queryFn: () => getDetections({ data: {
			...bboxParts,
			start_date: filters.startDate,
			end_date: filters.endDate,
			confidence: filters.confidence.length ? filters.confidence : void 0
		} }),
		staleTime: 12e4
	});
	const rawDetections = (0, import_react.useMemo)(() => query.data ?? [], [query.data]);
	const gridAnalysis = (0, import_react.useMemo)(() => {
		return computeAnalyticalGrid(rawDetections, filters.startDate, filters.endDate);
	}, [
		rawDetections,
		filters.startDate,
		filters.endDate
	]);
	const timelineDays = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const d of rawDetections) {
			const entry = map.get(d.acq_date) ?? {
				date: d.acq_date,
				modis: 0,
				viirs: 0
			};
			if (d.sensor === "MODIS") entry.modis++;
			else entry.viirs++;
			map.set(d.acq_date, entry);
		}
		return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
	}, [rawDetections]);
	const sensorCaption = (0, import_react.useMemo)(() => {
		if (activeSensor === "MODIS") return "MODIS: 1,000 m nadir pixel observations from Terra and Aqua satellites.";
		if (activeSensor === "VIIRS") return "VIIRS: 375 m high-resolution I-band observations from Suomi NPP and NOAA-20/21.";
		return "HARMONIZED: both sensors on one common analytical grid.";
	}, [activeSensor]);
	const handlePullRecent = async () => {
		setPull({
			status: "running",
			done: 0,
			total: 1
		});
		try {
			const res = await runFetch({ data: {
				bbox: region.bbox,
				days: 3
			} });
			await queryClient.invalidateQueries({ queryKey: ["detections"] });
			setPull({
				status: "done",
				stored: res.stored
			});
		} catch (err) {
			setPull({
				status: "error",
				message: err instanceof Error ? err.message : "Pull failed"
			});
		}
	};
	const handlePullHistory = async () => {
		const chunks = monthChunks(filters.startDate, filters.endDate);
		setPull({
			status: "running",
			done: 0,
			total: chunks.length
		});
		let stored = 0;
		try {
			for (let i = 0; i < chunks.length; i++) {
				const chunk = chunks[i];
				const res = await runBackfill({ data: {
					bbox: region.bbox,
					start_date: chunk.start,
					end_date: chunk.end
				} });
				stored += res.stored;
				setPull({
					status: "running",
					done: i + 1,
					total: chunks.length
				});
			}
			await queryClient.invalidateQueries({ queryKey: ["detections"] });
			setPull({
				status: "done",
				stored
			});
		} catch (err) {
			setPull({
				status: "error",
				message: err instanceof Error ? err.message : "Pull failed"
			});
		}
	};
	const resetFilters = () => {
		setFilters(defaultFilters());
		setActiveSensor("HARMONIZED");
		setActiveView("NATIVE");
		setSelectedObs(null);
		setSelectedCell(null);
	};
	const controlsContent = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 text-xs font-mono",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-[11px] uppercase tracking-wider text-text-secondary",
				children: "TARGET REGION"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				value: filters.regionId,
				onChange: (e) => {
					setFilters((f) => ({
						...f,
						regionId: e.target.value
					}));
					setSelectedObs(null);
					setSelectedCell(null);
				},
				className: "mt-1.5 w-full rounded border border-border bg-surface px-3 py-1.5 text-text focus:border-data-blue focus:outline-none",
				children: REGIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
					value: r.id,
					children: [
						r.name,
						" (",
						r.bbox,
						")"
					]
				}, r.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-[10px] uppercase text-text-secondary",
					children: "START DATE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: filters.startDate,
					onChange: (e) => setFilters((f) => ({
						...f,
						startDate: e.target.value
					})),
					className: "mt-1 w-full rounded border border-border bg-surface px-2.5 py-1 text-xs text-text focus:border-data-blue focus:outline-none"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-[10px] uppercase text-text-secondary",
					children: "END DATE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: filters.endDate,
					onChange: (e) => setFilters((f) => ({
						...f,
						endDate: e.target.value
					})),
					className: "mt-1 w-full rounded border border-border bg-surface px-2.5 py-1 text-xs text-text focus:border-data-blue focus:outline-none"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-[11px] uppercase tracking-wider text-text-secondary",
				children: "TIME SCALE"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1.5 grid grid-cols-3 gap-1 rounded border border-border bg-surface p-1",
				children: [
					"daily",
					"weekly",
					"monthly"
				].map((scale) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTimeScale(scale),
					className: `rounded py-1 text-center font-mono text-[11px] uppercase transition-colors ${timeScale === scale ? "bg-surface-elevated font-semibold text-text" : "text-text-secondary hover:text-text"}`,
					children: scale
				}, scale))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-[11px] uppercase tracking-wider text-text-secondary",
				children: "CONFIDENCE TIERS"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1.5 flex gap-1.5",
				children: [
					"low",
					"nominal",
					"high"
				].map((tier) => {
					const active = filters.confidence.includes(tier);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFilters((f) => ({
							...f,
							confidence: active ? f.confidence.filter((t) => t !== tier) : [...f.confidence, tier]
						})),
						className: `flex-1 rounded border py-1 text-center text-xs uppercase transition-colors ${active ? "border-data-blue bg-data-blue/20 font-semibold text-data-blue" : "border-border bg-surface text-text-secondary hover:text-text"}`,
						children: tier
					}, tier);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 border-t border-border pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[11px] uppercase tracking-wider text-text-secondary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DATA PULL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-text-secondary/70",
							children: "NASA FIRMS API"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handlePullRecent,
							disabled: pull.status === "running",
							className: "flex items-center justify-center gap-2 rounded bg-data-blue px-3 py-1.5 font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3 w-3 ${pull.status === "running" ? "animate-spin" : ""}` }), "FETCH LAST 3 DAYS"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handlePullHistory,
							disabled: pull.status === "running",
							className: "rounded border border-border bg-surface px-3 py-1.5 text-text transition-colors hover:bg-surface-elevated disabled:opacity-50",
							children: "LOAD FULL RANGE FROM NASA FIRMS"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10px] text-text-secondary",
						children: [
							pull.status === "running" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-anomaly-amber",
								children: [
									"Ingesting from FIRMS… chunk ",
									pull.done,
									" / ",
									pull.total
								]
							}),
							pull.status === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-agreement-teal",
								children: [
									"Ingest complete: ",
									pull.stored.toLocaleString(),
									" records stored."
								]
							}),
							pull.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-critical-red",
								children: pull.message
							}),
							pull.status === "idle" && "Queries directly verified NASA FIRMS endpoints."
						]
					})
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-bg text-text select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full w-full items-center justify-center font-mono text-xs text-text-secondary",
					children: "CALIBRATING 3D GEOID…"
				}) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto absolute left-4 right-4 top-4 z-20 hidden items-center justify-between gap-4 font-mono sm:flex lg:left-6 lg:right-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-lg border border-border/80 bg-surface/90 p-1.5 shadow-2xl backdrop-blur-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: filters.regionId,
							onChange: (e) => {
								setFilters((f) => ({
									...f,
									regionId: e.target.value
								}));
								setSelectedObs(null);
								setSelectedCell(null);
							},
							className: "rounded border border-border/60 bg-surface-elevated px-2.5 py-1 text-xs font-semibold text-text focus:border-data-blue focus:outline-none",
							children: REGIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: r.id,
								children: r.name.toUpperCase()
							}, r.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1 rounded border border-border/60 bg-surface-elevated/70 p-0.5",
							children: [
								"MODIS",
								"VIIRS",
								"HARMONIZED"
							].map((sensor) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setActiveSensor(sensor),
									className: `rounded px-2.5 py-1 text-xs font-semibold tracking-wider transition-all duration-300 ${activeSensor === sensor ? sensor === "MODIS" ? "bg-data-blue text-bg shadow-sm" : sensor === "VIIRS" ? "bg-thermal-orange text-bg shadow-sm" : "bg-anomaly-amber text-bg shadow-sm" : "text-text-secondary hover:text-text"}`,
									children: sensor
								}, sensor);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1 rounded-lg border border-border/80 bg-surface/90 p-1.5 shadow-2xl backdrop-blur-md",
						children: [
							"NATIVE",
							"COMMON GRID",
							"HARMONIZED",
							"ANOMALY",
							"AGREEMENT"
						].map((view) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setActiveView(view);
									if (view === "HARMONIZED") setActiveSensor("HARMONIZED");
								},
								className: `rounded px-2.5 py-1 text-xs tracking-wider transition-colors ${activeView === view ? "bg-surface-elevated font-semibold text-text border border-border" : "text-text-secondary hover:text-text"}`,
								children: view
							}, view);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-lg border border-border/80 bg-surface/90 p-1.5 shadow-2xl backdrop-blur-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMapProjection("3D"),
							className: `flex items-center gap-1.5 rounded px-2.5 py-1 text-xs uppercase tracking-wider transition-colors ${mapProjection === "3D" ? "border border-data-blue bg-data-blue/20 text-data-blue font-semibold" : "text-text-secondary hover:text-text"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3D GLOBE" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMapProjection("2D"),
							className: `flex items-center gap-1.5 rounded px-2.5 py-1 text-xs uppercase tracking-wider transition-colors ${mapProjection === "2D" ? "border border-thermal-orange bg-thermal-orange/20 text-thermal-orange font-semibold" : "text-text-secondary hover:text-text"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map$1, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2D MAP" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setIsParamsOpen(!isParamsOpen),
								className: `flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface/90 px-3 py-1.5 text-xs text-text shadow-2xl backdrop-blur-md transition-colors hover:bg-surface-elevated ${isParamsOpen ? "border-data-blue text-data-blue" : ""}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PARAMETERS" }),
									isParamsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setIsTableModalOpen(true),
								className: "flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface/90 px-3 py-1.5 text-xs text-text shadow-2xl backdrop-blur-md transition-colors hover:bg-surface-elevated",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, { className: "h-3.5 w-3.5 text-agreement-teal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VIEW AS TABLE" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: resetFilters,
								title: "Reset parameters",
								className: "rounded-lg border border-border/80 bg-surface/90 p-1.5 text-text-secondary shadow-2xl backdrop-blur-md transition-colors hover:text-text",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute left-6 top-18 z-10 hidden font-mono text-[11px] text-text-secondary sm:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded border border-border/60 bg-surface/80 px-2.5 py-1 backdrop-blur-md",
					children: sensorCaption
				})
			}),
			query.isFetching && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "status",
				"aria-live": "polite",
				className: "pointer-events-none absolute right-6 top-18 z-20 hidden items-center gap-2 rounded-full border border-border/80 bg-surface/90 px-3 py-1 font-mono text-[11px] text-text shadow-xl backdrop-blur-md sm:flex animate-in fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3 animate-spin text-data-blue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Synchronizing observations…" })]
			}),
			query.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto absolute right-6 top-20 z-30 max-w-sm shadow-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					type: "firms_error",
					onRetry: () => query.refetch()
				})
			}),
			isParamsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto absolute right-6 top-18 z-30 hidden w-80 rounded-lg border border-border/90 bg-surface/95 p-5 shadow-2xl backdrop-blur-xl sm:block animate-in fade-in-0 zoom-in-95",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs font-semibold uppercase tracking-wider text-text",
						children: "FILTER & INGESTION PARAMETERS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setIsParamsOpen(false),
						className: "text-text-secondary hover:text-text",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: controlsContent
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-2 font-mono sm:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between rounded-lg border border-border/80 bg-surface/90 p-1 backdrop-blur-md",
					children: [
						"MODIS",
						"VIIRS",
						"HARMONIZED"
					].map((sensor) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setActiveSensor(sensor),
						className: `flex-1 rounded py-1 text-center text-xs font-semibold ${activeSensor === sensor ? sensor === "MODIS" ? "bg-data-blue text-bg" : sensor === "VIIRS" ? "bg-thermal-orange text-bg" : "bg-anomaly-amber text-bg" : "text-text-secondary"}`,
						children: sensor
					}, sensor))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setIsMobileDrawerOpen(true),
						className: "flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-text shadow-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4 text-data-blue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"CONTROLS (",
							activeView,
							")"
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setIsTableModalOpen(true),
						className: "flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-xs text-text shadow-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, { className: "h-4 w-4 text-agreement-teal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TABLE" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
				open: isMobileDrawerOpen,
				onOpenChange: setIsMobileDrawerOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerContent, {
					className: "max-h-[85vh] border-border bg-surface px-6 pb-8 pt-4 font-mono text-text",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerHeader, {
							className: "px-0 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, {
								className: "font-headline text-lg text-text",
								children: "Observation Controls"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, {
								className: "text-xs text-text-secondary",
								children: "Configure sensor view, geodetic region, date window, and data pull."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[11px] uppercase tracking-wider text-text-secondary",
								children: "ACTIVE VIEW"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 grid grid-cols-2 gap-1.5",
								children: [
									"NATIVE",
									"COMMON GRID",
									"HARMONIZED",
									"ANOMALY",
									"AGREEMENT"
								].map((view) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setActiveView(view);
										if (view === "HARMONIZED") setActiveSensor("HARMONIZED");
									},
									className: `rounded border px-2 py-1 text-center text-[11px] ${activeView === view ? "border-data-blue bg-data-blue/15 font-semibold text-data-blue" : "border-border bg-surface-elevated text-text-secondary"}`,
									children: view
								}, view))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[11px] uppercase tracking-wider text-text-secondary",
								children: "MAP PROJECTION"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 grid grid-cols-2 gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setMapProjection("3D"),
									className: `flex items-center justify-center gap-1.5 rounded border py-1.5 text-center text-xs font-semibold ${mapProjection === "3D" ? "border-data-blue bg-data-blue/20 text-data-blue" : "border-border bg-surface-elevated text-text-secondary"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3D GLOBE" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setMapProjection("2D"),
									className: `flex items-center justify-center gap-1.5 rounded border py-1.5 text-center text-xs font-semibold ${mapProjection === "2D" ? "border-thermal-orange bg-thermal-orange/20 text-thermal-orange" : "border-border bg-surface-elevated text-text-secondary"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map$1, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2D MAP" })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-y-auto pr-1",
							children: controlsContent
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto absolute bottom-4 left-4 z-20 hidden max-w-sm rounded-lg border border-border/80 bg-surface/90 p-3 font-mono text-xs shadow-2xl backdrop-blur-md sm:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border/60 pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold uppercase tracking-wider text-text",
							children: "LEGEND"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] text-text-secondary",
							children: [
								"(",
								activeView,
								")"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setIsLegendExpanded(!isLegendExpanded),
						className: "text-text-secondary hover:text-text",
						children: isLegendExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-3.5 w-3.5" })
					})]
				}), isLegendExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2.5 space-y-2",
					children: [
						activeView === "NATIVE" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full border border-data-blue bg-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-text",
										children: "MODIS — 1,000 m nadir pixel (ring)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-thermal-orange" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-text",
										children: "VIIRS — 375 m I-band pixel (solid)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-text-secondary/80",
									children: "Marker size scales subtly with Fire Radiative Power (FRP)."
								})
							]
						}),
						activeView === "COMMON GRID" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[10px] text-text-secondary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "LOW DENSITY" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"HIGH DENSITY (",
										gridAnalysis.maxCount,
										" MAX)"
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-full rounded-sm bg-gradient-to-r from-data-blue/20 via-data-blue/60 to-data-blue" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-text-secondary",
									children: "Grid resolution: 0.15° geodetic cells (~16.5 km)."
								})
							]
						}),
						activeView === "HARMONIZED" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[10px] text-text-secondary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BASELINE NOMINAL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "UNIFIED THERMAL INTENSITY" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-full rounded-sm bg-gradient-to-r from-[#F4F7FA]/30 via-anomaly-amber/60 to-anomaly-amber" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-text-secondary",
									children: "Derived multi-sensor layer harmonizing MODIS and VIIRS nadir footprints."
								})
							]
						}),
						activeView === "ANOMALY" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-sm bg-anomaly-amber" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-text font-semibold text-anomaly-amber",
										children: "CRITICAL ANOMALY (≥90th percentile)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-sm bg-anomaly-amber/40 border border-anomaly-amber" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-text",
										children: "ELEVATED ACTIVITY (80–89th percentile)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded border border-border bg-surface-elevated/70 p-2 text-[10px] text-text-secondary",
									children: [
										"BASELINE WINDOW:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-text",
											children: gridAnalysis.baselineWindowLabel
										})
									]
								})
							]
						}),
						activeView === "AGREEMENT" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-1.5",
								children: [
									"STRONG",
									"MODERATE",
									"LIMITED",
									"NONE"
								].map((level) => {
									const def = AGREEMENT_DEFINITIONS[level];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										title: def.criteria,
										className: "flex items-center gap-1.5 rounded border border-border/80 px-2 py-1 text-[10px]",
										style: {
											backgroundColor: def.bg,
											borderColor: def.border
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "h-1.5 w-1.5 rounded-full",
											style: { backgroundColor: def.color }
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-text",
											children: level
										})]
									}, level);
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded border border-border bg-surface-elevated p-2 text-[10px] leading-relaxed text-text",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-agreement-teal font-semibold",
									children: "SCIENTIFIC NOTICE: "
								}), "Cross-sensor agreement indicates correspondence between satellite observations. It does not confirm a ground fire."]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObservationInspector, {
				observation: selectedObs,
				cell: selectedCell,
				allCells: gridAnalysis.cells,
				baselineWindow: `${filters.startDate} → ${filters.endDate}`,
				onClose: () => {
					setSelectedObs(null);
					setSelectedCell(null);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObservationsTableModal, {
				isOpen: isTableModalOpen,
				onClose: () => setIsTableModalOpen(false),
				observations: rawDetections,
				regionName: region.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto fixed inset-x-0 bottom-0 z-20 flex flex-col items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setTimelineExpanded((v) => !v),
					className: "flex items-center gap-2 rounded-t-lg border-t border-x border-border bg-surface/95 px-4 py-1.5 font-mono text-[11px] font-semibold text-text shadow-2xl backdrop-blur-md transition-all hover:bg-surface-elevated",
					"aria-expanded": timelineExpanded,
					"aria-label": "Toggle thermal activity timeline",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-data-blue animate-pulse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "THERMAL ACTIVITY TIMELINE" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[9px] text-text-secondary",
							children: [
								"(",
								timelineDays.length,
								" days)"
							]
						}),
						timelineExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-3.5 w-3.5" })
					]
				}), timelineExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-h-[48vh] overflow-y-auto border-t border-border bg-surface/95 p-3 shadow-2xl backdrop-blur-xl sm:p-4 animate-in slide-in-from-bottom duration-300",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto max-w-6xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityTimeline, {
							days: timelineDays,
							detections: rawDetections,
							selectedDate: selectedAnalysisDate,
							onSelectDate: (date) => setSelectedAnalysisDate(date),
							onFlyTo: (date) => {
								const firstOnDate = rawDetections.find((d) => d.acq_date === date);
								if (firstOnDate) setSelectedObs(firstOnDate);
								setSelectedAnalysisDate(null);
							}
						})
					})
				})]
			})
		]
	});
}
//#endregion
export { ExploreWorkspace as component };
