import { i as __toESM } from "../_runtime.mjs";
import { a as parseBbox, i as getRegion } from "./regions--TbXEuvW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { C as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Earth, f as Map$1, m as Info, t as X } from "../_libs/lucide-react.mjs";
import { i as defaultFilters, n as EmptyState, r as RegionSelect, t as DateRangeInputs } from "./EmptyState-CYtulnKL.mjs";
import { i as getDetections, r as getDailyCounts } from "./firelens.functions-C1L89yTy.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as NasaFirmsFetcher } from "./NasaFirmsFetcher-B61ZlWsW.mjs";
import { n as ObservationInspector, r as computeAnalyticalGrid } from "./analyticalGrid-JuyqBVH4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compare-BXUHHC6D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Formula({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "group relative inline-flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "How is this calculated?",
			className: "rounded p-1 text-text-secondary hover:text-text",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			role: "tooltip",
			className: "pointer-events-none absolute bottom-full left-0 z-30 mb-2 hidden w-64 rounded border border-border bg-surface-elevated p-2 text-[11px] normal-case leading-relaxed text-text shadow-xl group-hover:block group-focus-within:block",
			children
		})]
	});
}
function FindingsPanel({ days, agreementRate, sampleCells, onSelectDay, compact = false }) {
	const modis = days.reduce((sum, day) => sum + day.modis, 0);
	const viirs = days.reduce((sum, day) => sum + day.viirs, 0);
	const ratio = modis > 0 ? viirs / modis : null;
	const largestGap = days.reduce((best, day) => {
		if (!best || Math.abs(day.viirs - day.modis) > Math.abs(best.viirs - best.modis)) return day;
		return best;
	}, null);
	const peak = days.reduce((best, day) => {
		if (!best || day.modis + day.viirs > best.modis + best.viirs) return day;
		return best;
	}, null);
	const monthCounts = /* @__PURE__ */ new Map();
	for (const day of days) monthCounts.set(day.date.slice(0, 7), (monthCounts.get(day.date.slice(0, 7)) ?? 0) + day.modis + day.viirs);
	const busiestMonth = [...monthCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
	const firstDate = days[0]?.date ?? null;
	const lastDate = days[days.length - 1]?.date ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `rounded-lg border border-border bg-surface ${compact ? "p-3" : "p-5"}`,
		"aria-labelledby": "key-findings-title",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 border-b border-border pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: "key-findings-title",
				className: "font-mono text-xs font-semibold uppercase tracking-wider text-text",
				children: "KEY FINDINGS"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-[11px] text-text-secondary",
				children: [sampleCells.toLocaleString(), " grid cells"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `mt-4 grid gap-3 ${compact ? "grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border border-border bg-surface-elevated p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 font-mono text-[11px] uppercase text-text-secondary",
							children: [
								"DETECTIONS",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Formula, { children: "VIIRS/MODIS ratio = total VIIRS detections divided by total MODIS detections. A dash is shown when MODIS is zero." })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-text",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-thermal-orange",
									children: ["VIIRS ", viirs.toLocaleString()]
								}),
								" ",
								"· MODIS ",
								modis.toLocaleString()
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-mono text-xs text-text-secondary",
							children: ["RATIO: ", ratio == null ? "—" : `${ratio.toFixed(1)}x`]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border border-border bg-surface-elevated p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 font-mono text-[11px] uppercase text-text-secondary",
						children: [
							"AGREEMENT RATE",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Formula, { children: "Agreement rate = grid cells with both MODIS and VIIRS observations divided by grid cells with at least one observation." })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-xl font-semibold text-agreement-teal",
						children: agreementRate == null ? "—" : `${Math.round(agreementRate * 100)}%`
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border border-border bg-surface-elevated p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 font-mono text-[11px] uppercase text-text-secondary",
						children: [
							"LARGEST GAP",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Formula, { children: "Absolute difference between the daily VIIRS and MODIS counts." })
						]
					}), largestGap ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onSelectDay?.(largestGap.date),
						className: "mt-1 min-h-11 text-left font-mono text-sm text-anomaly-amber underline-offset-2 hover:underline",
						children: [
							largestGap.date,
							" · Δ ",
							Math.abs(largestGap.viirs - largestGap.modis).toLocaleString()
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-text-secondary",
						children: "Not available"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border border-border bg-surface-elevated p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[11px] uppercase text-text-secondary",
						children: "PEAK DAY"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-sm text-text",
						children: peak ? `${peak.date} · ${(peak.modis + peak.viirs).toLocaleString()}` : "Not available"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border border-border bg-surface-elevated p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[11px] uppercase text-text-secondary",
						children: "BUSIEST MONTH"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-sm text-text",
						children: busiestMonth ?? "Not available"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border border-border bg-surface-elevated p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[11px] uppercase text-text-secondary",
						children: "DATA COVERAGE"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-xs text-text",
						children: firstDate && lastDate ? `${firstDate} to ${lastDate}, ${days.length} days` : "Not available"
					})]
				})
			]
		})]
	});
}
function UnusualDayDrawer({ day, observations, analysis, regionBbox, onClose }) {
	if (!day) return null;
	const dayObservations = observations.filter((observation) => observation.acq_date === day.date);
	const dayCells = analysis.cells.filter((cell) => cell.observations.some((observation) => observation.acq_date === day.date));
	const topCount = [...dayCells].sort((a, b) => b.totalCount - a.totalCount).slice(0, 3).reduce((sum, cell) => sum + cell.totalCount, 0);
	const total = day.modis + day.viirs;
	const concentration = total > 0 ? Math.round(topCount / total * 100) : null;
	const sortedFrp = [...dayObservations.map((observation) => observation.frp_mw).filter((value) => value != null)].sort((a, b) => a - b);
	const medianFrp = sortedFrp.length ? sortedFrp[Math.floor(sortedFrp.length / 2)] : null;
	const maxFrp = sortedFrp.length ? sortedFrp[sortedFrp.length - 1] : null;
	const worldview = `https://worldview.earthdata.nasa.gov/?v=${regionBbox.west},${regionBbox.south},${regionBbox.east},${regionBbox.north}&t=${day.date}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto border-t border-border bg-surface p-5 shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[min(100%,420px)] sm:border-l sm:border-t-0",
		"aria-labelledby": "unusual-day-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-wider text-anomaly-amber",
					children: "WHY WAS THIS DAY UNUSUAL?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "unusual-day-title",
					className: "mt-1 font-headline text-xl font-semibold text-text",
					children: day.date
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					"aria-label": "Close unusual day panel",
					className: "min-h-11 min-w-11 rounded border border-border p-2 text-text-secondary hover:text-text",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mx-auto h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid grid-cols-2 gap-3 font-mono text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border border-border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-text-secondary",
						children: "MODIS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "mt-1 block text-data-blue",
						children: day.modis.toLocaleString()
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border border-border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-text-secondary",
						children: "VIIRS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "mt-1 block text-thermal-orange",
						children: day.viirs.toLocaleString()
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-5 space-y-3 border-t border-border pt-4 text-sm text-text",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-text-secondary",
							children: "Historical percentile"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: dayCells.length ? `${Math.max(...dayCells.map((cell) => cell.anomalyPercentile))}%` : "Not available" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-text-secondary",
							children: "Agreement level"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: dayCells.length ? dayCells.sort((a, b) => b.agreementRatio - a.agreementRatio)[0]?.agreementLevel : "Not available" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-text-secondary",
							children: "Top 3 cell concentration"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: concentration == null ? "Not available" : `${concentration}% of detections` })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-text-secondary",
							children: "FRP median / max"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: medianFrp == null ? "Not available" : `${medianFrp.toFixed(1)} / ${maxFrp?.toFixed(1)} MW` })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-5 rounded border border-border bg-surface-elevated p-3 text-sm leading-relaxed text-text-secondary",
				children: [
					"On ",
					day.date,
					", stored observations totaled ",
					total.toLocaleString(),
					" across MODIS and VIIRS. The top three analytical cells contain",
					" ",
					concentration == null ? "an unavailable share" : `${concentration}%`,
					" of detections. This is a satellite-detected thermal anomaly, not a confirmed ground fire."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 font-mono text-[11px] text-text-secondary",
				children: ["BASELINE: ", analysis.baselineWindowLabel]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: worldview,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "mt-4 inline-flex min-h-11 items-center text-sm text-data-blue underline underline-offset-4",
				children: "Open this day in NASA Worldview"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-text-secondary",
				children: "Cloud cover can hide detections; check the imagery."
			})
		]
	});
}
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
	const sensors = mode === "combined" ? void 0 : [mode];
	const mapQuery = useQuery({
		queryKey: [
			"compare-map",
			regionId,
			startDate,
			endDate,
			mode
		],
		queryFn: () => getDetections({ data: {
			...bboxParts,
			start_date: startDate,
			end_date: endDate,
			sensors
		} })
	});
	const dailyQuery = useQuery({
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
	const detections = (0, import_react.useMemo)(() => mapQuery.data ?? [], [mapQuery.data]);
	const days = dailyQuery.data ?? [];
	const modisTotal = days.reduce((s, d) => s + d.modis, 0);
	const viirsTotal = days.reduce((s, d) => s + d.viirs, 0);
	Math.max(1, ...days.map((d) => d.modis + d.viirs));
	const gridAnalysis = (0, import_react.useMemo)(() => computeAnalyticalGrid(detections, startDate, endDate), [
		detections,
		startDate,
		endDate
	]);
	const agreementRate = (0, import_react.useMemo)(() => {
		if (gridAnalysis.cells.length === 0) return null;
		return gridAnalysis.cells.filter((cell) => cell.modisCount > 0 && cell.viirsCount > 0).length / gridAnalysis.cells.length;
	}, [gridAnalysis.cells]);
	const [selectedDay, setSelectedDay] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border pb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-xs uppercase tracking-wider text-data-blue",
						children: "CROSS-SENSOR RESOLUTION & AGREEMENT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-headline text-2xl font-semibold tracking-tight text-text",
						children: "Instrument Divergence Analysis"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-mono text-xs text-text-secondary",
						children: [
							"Comparing 1 km MODIS nadir observations with 375 m VIIRS I-band detections over",
							" ",
							region.name,
							"."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FindingsPanel, {
					days,
					agreementRate,
					sampleCells: gridAnalysis.cells.length,
					onSelectDay: setSelectedDay
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-lg border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 border-b border-border pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-mono text-xs font-semibold uppercase tracking-wider text-text",
							children: "GRID SENSITIVITY"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] text-agreement-teal",
							children: "0.15° TerraFlux grid"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid grid-cols-4 gap-2",
						children: [
							.05,
							.1,
							.15,
							.25
						].map((size) => {
							const result = computeAnalyticalGrid(detections, startDate, endDate, size);
							const rate = result.cells.length ? result.cells.filter((cell) => cell.modisCount > 0 && cell.viirsCount > 0).length / result.cells.length : null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `rounded border p-2 text-center ${size === .15 ? "border-agreement-teal bg-agreement-teal/10" : "border-border bg-surface-elevated"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-mono text-xs text-text",
									children: [size.toFixed(2), "°"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 font-mono text-sm text-agreement-teal",
									children: rate == null ? "—" : `${Math.round(rate * 100)}%`
								})]
							}, size);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-text-secondary",
						children: "Same observations, different cell size: shows how much agreement depends on the grid choice."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NasaFirmsFetcher, {
					initialRegionId: regionId,
					initialStartDate: startDate,
					initialEndDate: endDate
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-5 lg:sticky lg:top-20 lg:rounded-lg lg:border lg:border-border lg:bg-surface lg:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-border pb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text",
							children: "ANALYSIS PARAMETERS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-end gap-4 lg:flex-col lg:items-stretch",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegionSelect, {
								value: regionId,
								onChange: setRegionId
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateRangeInputs, {
								startDate,
								endDate,
								onStart: setStartDate,
								onEnd: setEndDate
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1.5 border-t border-border pt-4 lg:flex-col",
							role: "tablist",
							"aria-label": "Sensor selection",
							children: [
								"combined",
								"MODIS",
								"VIIRS"
							].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								role: "tab",
								"aria-selected": mode === m,
								onClick: () => setMode(m),
								className: `rounded border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${mode === m ? m === "MODIS" ? "border-data-blue bg-data-blue/20 text-data-blue font-semibold" : m === "VIIRS" ? "border-thermal-orange bg-thermal-orange/20 text-thermal-orange font-semibold" : "border-anomaly-amber bg-anomaly-amber/20 text-anomaly-amber font-semibold" : "border-border bg-surface text-text-secondary hover:text-text"}`,
								children: m === "combined" ? "HARMONIZED (BOTH)" : `${m} ONLY`
							}, m))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-6 lg:mt-0 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-[420px] overflow-hidden rounded-lg border border-border bg-bg lg:h-[620px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute left-3 top-3 z-20 flex min-h-11 max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-1 rounded-md border border-border/80 bg-surface/90 p-1 font-mono text-[11px] shadow-xl backdrop-blur-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setMapProjection("3D"),
								className: `flex min-h-11 items-center gap-1.5 rounded px-3 py-2 uppercase transition-colors ${mapProjection === "3D" ? "border border-data-blue bg-data-blue/20 text-data-blue font-semibold" : "text-text-secondary hover:text-text"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3D GLOBE" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setMapProjection("2D"),
								className: `flex min-h-11 items-center gap-1.5 rounded px-3 py-2 uppercase transition-colors ${mapProjection === "2D" ? "border border-thermal-orange bg-thermal-orange/20 text-thermal-orange font-semibold" : "text-text-secondary hover:text-text"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map$1, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2D MAP" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-surface" }) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-surface p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 font-mono text-xs font-semibold uppercase text-text",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full border border-data-blue bg-transparent" }), "MODIS (1 KM)"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 font-mono text-3xl font-semibold text-data-blue",
											children: dailyQuery.isLoading ? "LOADING" : modisTotal > 0 ? modisTotal.toLocaleString() : dailyQuery.isError ? "UNAVAILABLE — QUERY ERROR" : "UNAVAILABLE — NO STORED ROWS"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-mono text-[11px] uppercase text-text-secondary",
											children: "OBSERVATIONS IN RANGE"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-surface p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 font-mono text-xs font-semibold uppercase text-text",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-thermal-orange" }), "VIIRS (375 M)"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 font-mono text-3xl font-semibold text-thermal-orange",
											children: dailyQuery.isLoading ? "LOADING" : viirsTotal > 0 ? viirsTotal.toLocaleString() : dailyQuery.isError ? "UNAVAILABLE — QUERY ERROR" : "UNAVAILABLE — NO STORED ROWS"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-mono text-[11px] uppercase text-text-secondary",
											children: "OBSERVATIONS IN RANGE"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border bg-surface p-5 text-xs text-text-secondary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "border-b border-border pb-2 font-mono text-xs font-semibold uppercase tracking-wider text-text",
										children: "CROSS-SENSOR AGREEMENT PRINCIPLES"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 leading-relaxed",
										children: "MODIS and VIIRS thermal anomaly counts rarely match 1:1. VIIRS features a 375 m pixel area that is approximately 7 times smaller than MODIS's 1 km pixel at nadir, allowing it to resolve smaller and lower-intensity thermal anomalies."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 leading-relaxed",
										children: "Furthermore, Aqua/Terra (MODIS) and Suomi NPP/NOAA-20 (VIIRS) cross over regions at different orbital times (approx. 01:30/13:30 vs 02:00/14:00 solar local time), meaning transient thermal events may be detected by one sensor before extinguishing or flaring up."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 rounded border border-border bg-surface-elevated p-3 font-mono text-[11px] text-text",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-agreement-teal",
												children: "AGREEMENT METRIC:"
											}),
											" ",
											"Cross-sensor agreement indicates spatial-temporal correspondence between observations, but does not confirm a ground fire."
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border bg-surface p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border pb-2 font-mono text-xs font-semibold uppercase tracking-wider text-text",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DAILY DETECTIONS BY SENSOR" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 text-[10px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 text-data-blue",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full border border-data-blue" }), "MODIS (1 KM)"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 text-thermal-orange",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-thermal-orange" }), "VIIRS (375 M)"]
										})]
									})]
								}), days.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { type: "no_observations" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-72 w-full animate-pulse bg-surface-elevated/40" }) })
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnusualDayDrawer, {
				day: days.find((day) => day.date === selectedDay) ?? null,
				observations: detections,
				analysis: gridAnalysis,
				regionBbox: bboxParts,
				onClose: () => setSelectedDay(null)
			}),
			selectedObs && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObservationInspector, {
				observation: selectedObs,
				cell: null,
				baselineWindow: `${startDate} to ${endDate}`,
				onClose: () => setSelectedObs(null)
			})
		]
	});
}
//#endregion
export { Compare as component };
