import { i as __toESM } from "../_runtime.mjs";
import { r as SENSOR_META } from "./regions--TbXEuvW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { O as ChartLine, k as Calendar, r as Sparkles, t as X, u as Navigation } from "../_libs/lucide-react.mjs";
import { a as CartesianGrid, i as Area, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ActivityTimeline-Bbxj-r7y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/CalendarHeatmap.tsx";
function countFor(d, mode) {
	if (!d) return 0;
	if (mode === "MODIS") return d.modis;
	if (mode === "VIIRS") return d.viirs;
	return d.modis + d.viirs;
}
function level(count, max) {
	if (count === 0 || max === 0) return 0;
	const r = count / max;
	if (r <= .2) return 1;
	if (r <= .45) return 2;
	if (r <= .7) return 3;
	return 4;
}
function CalendarHeatmap({ days, startDate, endDate, mode, onSelectDate }) {
	const byDate = new Map(days.map((d) => [d.date, d]));
	const max = Math.max(1, ...days.map((d) => countFor(d, mode)));
	const LEVEL_BG = mode === "MODIS" ? [
		"bg-surface border border-border/40",
		"bg-data-blue/25 border border-data-blue/30",
		"bg-data-blue/50 border border-data-blue/50",
		"bg-data-blue/75 border border-data-blue/70",
		"bg-data-blue border border-data-blue"
	] : [
		"bg-surface border border-border/40",
		"bg-thermal-orange/25 border border-thermal-orange/30",
		"bg-thermal-orange/50 border border-thermal-orange/50",
		"bg-thermal-orange/75 border border-thermal-orange/70",
		"bg-thermal-orange border border-thermal-orange"
	];
	const start = /* @__PURE__ */ new Date(startDate + "T00:00:00Z");
	const end = /* @__PURE__ */ new Date(endDate + "T00:00:00Z");
	const first = new Date(start);
	first.setUTCDate(first.getUTCDate() - first.getUTCDay());
	const weeks = [];
	const cursor = new Date(first);
	while (cursor <= end) {
		const week = [];
		for (let i = 0; i < 7; i++) {
			week.push({
				date: new Date(cursor),
				inRange: cursor >= start && cursor <= end
			});
			cursor.setUTCDate(cursor.getUTCDate() + 1);
		}
		weeks.push(week);
	}
	const monthLabels = [];
	let lastMonth = -1;
	let lastIndex = -999;
	weeks.forEach((week, i) => {
		const m = week[0].date.getUTCMonth();
		if (m !== lastMonth && week[0].date <= end) {
			if (i - lastIndex >= 3 || lastIndex === -999) {
				const nextMonthInSoon = weeks.slice(i + 1, i + 3).some((w) => w[0].date.getUTCMonth() !== m);
				if (!(i === 0 && nextMonthInSoon)) {
					monthLabels.push({
						label: week[0].date.toLocaleString("en", {
							month: "short",
							timeZone: "UTC"
						}),
						index: i
					});
					lastIndex = i;
				}
			}
			lastMonth = m;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "overflow-x-auto pb-2 font-mono",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "relative inline-block min-w-max",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex h-5 pl-7 text-[10px] text-text-secondary",
					children: monthLabels.map((m) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "absolute uppercase",
						style: { left: `${m.index * 13 + 28}px` },
						children: m.label
					}, `${m.label}-${m.index}`, false, {
						fileName: _jsxFileName$1,
						lineNumber: 102,
						columnNumber: 13
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 100,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid grid-rows-7 gap-1 pr-1 text-[9px] text-text-secondary/70",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-2.5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 115,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "h-2.5 leading-none",
								children: "M"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 116,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-2.5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 117,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "h-2.5 leading-none",
								children: "W"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 118,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-2.5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 119,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "h-2.5 leading-none",
								children: "F"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 120,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-2.5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 121,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 114,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-1",
						children: weeks.map((week, wi) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-rows-7 gap-1",
							children: week.map((d, di) => {
								const iso = d.date.toISOString().slice(0, 10);
								const entry = byDate.get(iso);
								const count = countFor(entry, mode);
								const lev = d.inRange ? level(count, max) : 0;
								const isClickable = Boolean(d.inRange && count > 0 && onSelectDate);
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									title: `${iso}: ${count.toLocaleString()} observations (${entry ? `MODIS: ${entry.modis}, VIIRS: ${entry.viirs}` : "none stored"})`,
									onClick: () => isClickable && onSelectDate?.(iso),
									role: isClickable ? "button" : void 0,
									tabIndex: isClickable ? 0 : void 0,
									className: `h-2.5 w-2.5 rounded-[2px] transition-colors ${d.inRange ? LEVEL_BG[lev] : "bg-surface opacity-20 border border-border/20"} ${isClickable ? "cursor-pointer hover:ring-1 hover:ring-text" : ""}`
								}, di, false, {
									fileName: _jsxFileName$1,
									lineNumber: 135,
									columnNumber: 21
								}, this);
							})
						}, wi, false, {
							fileName: _jsxFileName$1,
							lineNumber: 127,
							columnNumber: 15
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 125,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 112,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-4 flex items-center justify-between text-[10px] text-text-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "uppercase",
						children: ["MAX DAILY DENSITY: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
							className: "text-text",
							children: max.toLocaleString()
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 155,
							columnNumber: 32
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 154,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "LESS" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 158,
								columnNumber: 13
							}, this),
							LEVEL_BG.map((bg, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `h-2.5 w-2.5 rounded-[2px] ${bg}` }, i, false, {
								fileName: _jsxFileName$1,
								lineNumber: 160,
								columnNumber: 15
							}, this)),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "MORE" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 162,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 157,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 153,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 98,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 97,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/components/ActivityTimeline.tsx";
function percentile(value, values) {
	if (!values.length) return 0;
	const count = values.filter((item) => item <= value).length;
	return Math.round(count / values.length * 100);
}
function useCountUp(target, durationMs = 800) {
	const [count, setCount] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let startTimestamp = null;
		let frameId;
		const step = (timestamp) => {
			if (!startTimestamp) startTimestamp = timestamp;
			const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
			const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
			setCount(Math.round(target * ease));
			if (progress < 1) frameId = requestAnimationFrame(step);
		};
		frameId = requestAnimationFrame(step);
		return () => cancelAnimationFrame(frameId);
	}, [target, durationMs]);
	return count;
}
function aggregateDays(days, scale) {
	if (scale === "daily") return days;
	const buckets = /* @__PURE__ */ new Map();
	for (const day of days) {
		const date = /* @__PURE__ */ new Date(`${day.date}T00:00:00Z`);
		const key = scale === "monthly" ? day.date.slice(0, 7) : (() => {
			const monday = new Date(date);
			monday.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7);
			return monday.toISOString().slice(0, 10);
		})();
		const current = buckets.get(key) ?? {
			date: key,
			modis: 0,
			viirs: 0
		};
		current.modis += day.modis;
		current.viirs += day.viirs;
		buckets.set(key, current);
	}
	return [...buckets.values()].sort((a, b) => a.date.localeCompare(b.date));
}
function DayMiniMap({ detections }) {
	if (!detections.length) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex h-44 items-center justify-center rounded border border-border bg-bg/80 font-mono text-[11px] text-text-secondary",
		children: "No coordinate records found for this date."
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 98,
		columnNumber: 7
	}, this);
	const lats = detections.map((d) => d.lat);
	const lons = detections.map((d) => d.lon);
	const minLat = Math.min(...lats);
	const maxLat = Math.max(...lats);
	const minLon = Math.min(...lons);
	const maxLon = Math.max(...lons);
	const latSpan = Math.max(.08, maxLat - minLat);
	const lonSpan = Math.max(.08, maxLon - minLon);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative h-44 overflow-hidden rounded border border-border bg-[#030711]",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
			className: "h-full w-full p-4",
			viewBox: "0 0 100 100",
			preserveAspectRatio: "none",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
					x1: "0",
					y1: "25",
					x2: "100",
					y2: "25",
					stroke: "rgba(145,160,181,0.08)",
					strokeDasharray: "2,2"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 119,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
					x1: "0",
					y1: "50",
					x2: "100",
					y2: "50",
					stroke: "rgba(145,160,181,0.08)",
					strokeDasharray: "2,2"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 127,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
					x1: "0",
					y1: "75",
					x2: "100",
					y2: "75",
					stroke: "rgba(145,160,181,0.08)",
					strokeDasharray: "2,2"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 135,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
					x1: "25",
					y1: "0",
					x2: "25",
					y2: "100",
					stroke: "rgba(145,160,181,0.08)",
					strokeDasharray: "2,2"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 143,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
					x1: "50",
					y1: "0",
					x2: "50",
					y2: "100",
					stroke: "rgba(145,160,181,0.08)",
					strokeDasharray: "2,2"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 151,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
					x1: "75",
					y1: "0",
					x2: "75",
					y2: "100",
					stroke: "rgba(145,160,181,0.08)",
					strokeDasharray: "2,2"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 159,
					columnNumber: 9
				}, this),
				detections.slice(0, 300).map((d, i) => {
					const x = (d.lon - minLon) / lonSpan * 90 + 5;
					const y = 95 - ((d.lat - minLat) / latSpan * 90 + 5);
					const isModis = d.sensor === "MODIS";
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
						cx: x,
						cy: y,
						r: isModis ? 2.5 : 1.8,
						fill: isModis ? SENSOR_META.MODIS.color : SENSOR_META.VIIRS.color,
						opacity: .85
					}, i, false, {
						fileName: _jsxFileName,
						lineNumber: 174,
						columnNumber: 13
					}, this);
				})
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 117,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "absolute bottom-2 left-2 flex items-center gap-2 rounded bg-surface/90 px-2 py-1 font-mono text-[9px] text-text backdrop-blur-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-1.5 w-1.5 rounded-full bg-data-blue" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 187,
						columnNumber: 11
					}, this), " MODIS"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 186,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-1.5 w-1.5 rounded-full bg-thermal-orange" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 190,
						columnNumber: 11
					}, this), " VIIRS"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 189,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-text-secondary",
					children: [
						"(",
						detections.length.toLocaleString(),
						" points)"
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 192,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 185,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 116,
		columnNumber: 5
	}, this);
}
function ActivityAnalysis({ date, days, detections = [], onClose, onFlyTo }) {
	const selected = days.find((day) => day.date === date) ?? {
		date,
		modis: 0,
		viirs: 0
	};
	const total = selected.modis + selected.viirs;
	const rawRank = percentile(total, days.map((d) => d.modis + d.viirs));
	const animatedRank = useCountUp(rawRank);
	const animatedModis = useCountUp(selected.modis);
	const animatedViirs = useCountUp(selected.viirs);
	const dayDetections = (0, import_react.useMemo)(() => detections.filter((d) => d.acq_date === date), [detections, date]);
	const frpStats = (0, import_react.useMemo)(() => {
		const frpVals = dayDetections.map((d) => d.frp_mw).filter((v) => v != null && v > 0);
		if (!frpVals.length) return null;
		const maxFrp = Math.max(...frpVals);
		const meanFrp = frpVals.reduce((a, b) => a + b, 0) / frpVals.length;
		return {
			max: maxFrp.toFixed(1),
			mean: meanFrp.toFixed(1)
		};
	}, [dayDetections]);
	const agreement = selected.modis > 0 && selected.viirs > 0 ? "STRONG" : selected.modis > 0 || selected.viirs > 0 ? "LIMITED" : "NONE";
	const evidenceStrength = agreement === "STRONG" ? "HIGH" : total >= 10 ? "ELEVATED" : total >= 3 ? "MODERATE" : "LIMITED";
	const spatialConcentration = total > 20 ? "High-Density Cluster" : total > 5 ? "Moderate Grouping" : "Dispersed";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 z-50 flex justify-end bg-bg/60 backdrop-blur-sm animate-in fade-in duration-200",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `Analysis for ${date}`,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
			type: "button",
			"aria-label": "Close analysis",
			onClick: onClose,
			className: "absolute inset-0 cursor-default"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 266,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
			className: "relative flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-border bg-surface text-text shadow-2xl animate-in slide-in-from-right duration-300",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "flex items-start justify-between border-b border-border p-5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-4 w-4 text-anomaly-amber" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 276,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "font-mono text-[10px] tracking-[0.2em] text-anomaly-amber uppercase",
							children: "WHY WAS THIS DAY UNUSUAL?"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 277,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 275,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "mt-1 font-headline text-2xl font-bold text-text",
						children: date
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 281,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-0.5 font-mono text-xs text-text-secondary",
						children: "Deterministic analytical decomposition from verified spaceborne observations."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 282,
						columnNumber: 13
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 274,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					"aria-label": "Close",
					onClick: onClose,
					className: "rounded p-1 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-5 w-5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 292,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 286,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 273,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col gap-5 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid grid-cols-2 gap-2.5 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded border border-border bg-surface-elevated p-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "font-mono text-[9px] uppercase tracking-wider text-text-secondary",
									children: "HISTORICAL PERCENTILE"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 300,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-1.5 font-mono text-lg font-bold text-anomaly-amber",
									children: [animatedRank, "th %ile"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 303,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 299,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded border border-border bg-surface-elevated p-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "font-mono text-[9px] uppercase tracking-wider text-text-secondary",
									children: "MODIS ACTIVITY"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 309,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-1.5 font-mono text-lg font-bold text-data-blue",
									children: animatedModis.toLocaleString()
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 312,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 308,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded border border-border bg-surface-elevated p-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "font-mono text-[9px] uppercase tracking-wider text-text-secondary",
									children: "VIIRS ACTIVITY"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 318,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-1.5 font-mono text-lg font-bold text-thermal-orange",
									children: animatedViirs.toLocaleString()
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 321,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 317,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded border border-border bg-surface-elevated p-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "font-mono text-[9px] uppercase tracking-wider text-text-secondary",
									children: "CROSS-SENSOR AGREEMENT"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 327,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-1.5 font-mono text-sm font-semibold text-agreement-teal",
									children: agreement
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 330,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 326,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded border border-border bg-surface-elevated p-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "font-mono text-[9px] uppercase tracking-wider text-text-secondary",
									children: "EVIDENCE STRENGTH"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 336,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-1.5 font-mono text-sm font-semibold text-text",
									children: evidenceStrength
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 339,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 335,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded border border-border bg-surface-elevated p-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "font-mono text-[9px] uppercase tracking-wider text-text-secondary",
									children: "SPATIAL CONCENTRATION"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 345,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-1.5 font-mono text-sm font-semibold text-text",
									children: spatialConcentration
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 348,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 344,
								columnNumber: 13
							}, this),
							frpStats && /* @__PURE__ */ (void 0)("div", {
								className: "col-span-2 rounded border border-border bg-surface-elevated p-3 sm:col-span-3",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "font-mono text-[9px] uppercase tracking-wider text-text-secondary",
									children: "FRP SUMMARY"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 356,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "mt-1.5 font-mono text-sm text-text",
									children: [
										"Peak: ",
										/* @__PURE__ */ (void 0)("span", {
											className: "font-bold text-thermal-orange",
											children: [frpStats.max, " MW"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 360,
											columnNumber: 25
										}, this),
										" · Mean: ",
										/* @__PURE__ */ (void 0)("span", {
											className: "font-bold text-text",
											children: [frpStats.mean, " MW"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 361,
											columnNumber: 25
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 359,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 355,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 298,
						columnNumber: 11
					}, this),
					days.length < 14 && /* @__PURE__ */ (void 0)("div", {
						className: "rounded border border-anomaly-amber/40 bg-anomaly-amber/10 p-3 font-mono text-xs text-anomaly-amber",
						children: [
							/* @__PURE__ */ (void 0)("span", {
								className: "font-bold",
								children: "BASELINE LIMITED:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 370,
								columnNumber: 15
							}, this),
							" ",
							days.length,
							" days stored. Small sample sizes can exaggerate percentile shifts."
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 369,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-lg border border-border bg-surface-elevated/40 p-4 font-mono text-xs leading-relaxed text-text",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
							"This day ranks in the",
							" ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-anomaly-amber",
								children: [rawRank, "th percentile"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 379,
								columnNumber: 15
							}, this),
							" of",
							" ",
							days.length,
							" days in the selected window. VIIRS recorded",
							" ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-thermal-orange",
								children: selected.viirs.toLocaleString()
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 381,
								columnNumber: 15
							}, this),
							" ",
							"detections and MODIS",
							" ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-data-blue",
								children: selected.modis.toLocaleString()
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 383,
								columnNumber: 15
							}, this),
							".",
							agreement === "STRONG" && " Both sensors detected elevated thermal activity during their respective orbital passes, confirming dual-instrument radiometric coincidence.",
							agreement === "LIMITED" && " Only a single sensor recorded detections during this period, indicating localized or short-duration radiometric heating."
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 377,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 376,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "font-mono text-[11px] leading-relaxed text-text-secondary",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-semibold text-text",
							children: "Observational Notice:"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 393,
							columnNumber: 13
						}, this), " Satellite detections are radiometric thermal observations of elevated ground temperature. They provide observational evidence for scientific analysis but do not confirm ground fire boundaries."]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 392,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-text-secondary",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "DAY'S DETECTION LOCATIONS" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 402,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [dayDetections.length.toLocaleString(), " POINTS"] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 403,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 401,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DayMiniMap, { detections: dayDetections }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 405,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 400,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						onClick: () => onFlyTo?.(date),
						className: "flex items-center justify-center gap-2 rounded border border-data-blue/50 bg-data-blue/10 px-4 py-3 font-mono text-xs font-semibold tracking-wider text-data-blue transition-all hover:border-data-blue hover:bg-data-blue/20",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Navigation, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 414,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "FLY MAIN GLOBE TO THIS DAY" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 415,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 409,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 296,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 272,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 260,
		columnNumber: 5
	}, this);
}
function ActivityTimeline({ days, detections = [], selectedDate: controlledDate, onSelectDate, onFlyTo }) {
	const [scale, setScale] = (0, import_react.useState)("daily");
	const [series, setSeries] = (0, import_react.useState)("COMBINED");
	const [showHeatmap, setShowHeatmap] = (0, import_react.useState)(false);
	const [hovered, setHovered] = (0, import_react.useState)(null);
	const [activeAnalysisDate, setActiveAnalysisDate] = (0, import_react.useState)(null);
	const effectiveAnalysisDate = controlledDate ?? activeAnalysisDate;
	const grouped = (0, import_react.useMemo)(() => aggregateDays(days, scale), [days, scale]);
	const chartData = (0, import_react.useMemo)(() => {
		return grouped.map((day) => ({
			...day,
			combined: day.modis + day.viirs,
			label: scale === "monthly" ? day.date : day.date.slice(5)
		}));
	}, [grouped, scale]);
	const allValues = (0, import_react.useMemo)(() => {
		return chartData.map((day) => series === "MODIS" ? day.modis : series === "VIIRS" ? day.viirs : day.combined);
	}, [chartData, series]);
	const activePeriod = hovered ?? grouped[grouped.length - 1];
	const activeValue = activePeriod ? series === "MODIS" ? activePeriod.modis : series === "VIIRS" ? activePeriod.viirs : activePeriod.modis + activePeriod.viirs : 0;
	const activePercentile = (0, import_react.useMemo)(() => percentile(activeValue, allValues), [activeValue, allValues]);
	const baselineLimited = days.length < 14;
	const handleDayClick = (dateStr) => {
		if (onSelectDate) onSelectDate(dateStr);
		setActiveAnalysisDate(dateStr);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "rounded-lg border border-border bg-surface p-4 sm:p-5 font-mono",
		"aria-label": "Thermal activity timeline",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-[10px] tracking-[0.2em] text-data-blue uppercase",
					children: "THERMAL ACTIVITY OVER TIME"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 485,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mt-0.5 font-headline text-lg font-semibold text-text",
					children: "When did the landscape change?"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 488,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 484,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-1 rounded border border-border bg-surface-elevated/50 p-1",
					role: "tablist",
					"aria-label": "Timeline scale",
					children: [
						"daily",
						"weekly",
						"monthly"
					].map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						role: "tab",
						"aria-selected": scale === s,
						onClick: () => setScale(s),
						className: `rounded px-2.5 py-1 text-[10px] uppercase transition-all ${scale === s ? "border border-data-blue/60 bg-data-blue/20 text-data-blue font-semibold" : "text-text-secondary hover:text-text"}`,
						children: s
					}, s, false, {
						fileName: _jsxFileName,
						lineNumber: 500,
						columnNumber: 13
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 494,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 483,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-3 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-1.5",
					role: "tablist",
					"aria-label": "Timeline series",
					children: [
						"MODIS",
						"VIIRS",
						"COMBINED"
					].map((ser) => {
						const isSelected = series === ser;
						const color = ser === "MODIS" ? SENSOR_META.MODIS.color : ser === "VIIRS" ? SENSOR_META.VIIRS.color : "var(--anomaly-amber)";
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							role: "tab",
							"aria-selected": isSelected,
							onClick: () => setSeries(ser),
							className: `flex items-center gap-1.5 rounded border px-2.5 py-1 text-[10px] uppercase transition-all ${isSelected ? "border-border bg-surface-elevated text-text font-semibold shadow-sm" : "border-transparent text-text-secondary hover:text-text"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "h-2 w-2 rounded-full",
								style: { backgroundColor: color }
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 542,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ser }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 543,
								columnNumber: 17
							}, this)]
						}, ser, true, {
							fileName: _jsxFileName,
							lineNumber: 530,
							columnNumber: 15
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 520,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => setShowHeatmap(!showHeatmap),
					className: "flex items-center gap-1.5 rounded border border-border px-2.5 py-1 text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:border-text-secondary hover:text-text",
					children: showHeatmap ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChartLine, { className: "h-3 w-3" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 557,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "SHOW TIMELINE" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 558,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 556,
						columnNumber: 13
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "h-3 w-3" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 562,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "SHOW CALENDAR HEATMAP" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 563,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 561,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 550,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 519,
				columnNumber: 7
			}, this),
			showHeatmap ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-4 overflow-x-auto pb-1",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CalendarHeatmap, {
					days,
					startDate: days[0]?.date ?? "2026-07-01",
					endDate: days[days.length - 1]?.date ?? "2026-09-18",
					mode: series === "COMBINED" ? "combined" : series,
					onSelectDate: handleDayClick
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 572,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 571,
				columnNumber: 9
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-3 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "h-64 min-w-[560px]",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AreaChart, {
							data: chartData,
							onMouseMove: (state) => {
								const item = state?.activePayload?.[0]?.payload;
								if (item) setHovered(item);
							},
							onClick: (state) => {
								const item = state?.activePayload?.[0]?.payload;
								if (item?.date) handleDayClick(item.date);
							},
							margin: {
								top: 10,
								right: 15,
								left: -10,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("defs", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("linearGradient", {
									id: "timelineGradient",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
										offset: "5%",
										stopColor: series === "MODIS" ? SENSOR_META.MODIS.color : series === "VIIRS" ? SENSOR_META.VIIRS.color : "var(--anomaly-amber)",
										stopOpacity: .4
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 598,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
										offset: "95%",
										stopColor: series === "MODIS" ? SENSOR_META.MODIS.color : series === "VIIRS" ? SENSOR_META.VIIRS.color : "var(--anomaly-amber)",
										stopOpacity: 0
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 609,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 597,
									columnNumber: 19
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 596,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CartesianGrid, {
									stroke: "rgba(145,160,181,0.12)",
									strokeDasharray: "3 3"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 622,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(XAxis, {
									dataKey: "label",
									stroke: "#91a0b5",
									fontFamily: "DM Mono",
									fontSize: 10,
									tickLine: false,
									interval: "preserveStartEnd"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 623,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(YAxis, {
									stroke: "#91a0b5",
									fontFamily: "DM Mono",
									fontSize: 10,
									tickLine: false,
									allowDecimals: false
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 631,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tooltip, { content: ({ active: open, payload }) => {
									if (!open || !payload?.[0]) return null;
									const item = payload[0].payload;
									const val = series === "MODIS" ? item.modis : series === "VIIRS" ? item.viirs : item.modis + item.viirs;
									const rank = percentile(val, allValues);
									return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "rounded border border-border bg-surface-elevated/95 p-2.5 font-mono text-[11px] text-text shadow-xl backdrop-blur-md",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "font-semibold text-text",
												children: item.date
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 651,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "mt-1 text-anomaly-amber",
												children: [
													val.toLocaleString(),
													" observations · ",
													rank,
													"th percentile"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 652,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "mt-0.5 text-[9px] text-text-secondary",
												children: [
													"MODIS: ",
													item.modis.toLocaleString(),
													" · VIIRS:",
													" ",
													item.viirs.toLocaleString()
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 655,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "mt-1 border-t border-border/50 pt-1 text-[9px] text-data-blue",
												children: "Click to view \"Why was this day unusual?\""
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 659,
												columnNumber: 25
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 650,
										columnNumber: 23
									}, this);
								} }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 638,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Area, {
									type: "monotone",
									dataKey: series === "MODIS" ? "modis" : series === "VIIRS" ? "viirs" : "combined",
									stroke: series === "MODIS" ? SENSOR_META.MODIS.color : series === "VIIRS" ? SENSOR_META.VIIRS.color : "var(--anomaly-amber)",
									fill: "url(#timelineGradient)",
									strokeWidth: 2
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 666,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 584,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 583,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 582,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 581,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
				className: "mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-[10px] text-text-secondary",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
					activePeriod?.date ?? "Active Period",
					" ·",
					" ",
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
						className: "text-text",
						children: [activeValue.toLocaleString(), " observations"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 690,
						columnNumber: 13
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 688,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "ml-2 font-semibold text-anomaly-amber",
					children: [
						"(",
						activePercentile,
						"th historical percentile)"
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 692,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 687,
					columnNumber: 9
				}, this), baselineLimited && /* @__PURE__ */ (void 0)("span", {
					className: "rounded bg-anomaly-amber/15 px-2 py-0.5 font-semibold text-anomaly-amber",
					children: [
						"BASELINE LIMITED: ",
						days.length,
						" days stored"
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 698,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 686,
				columnNumber: 7
			}, this),
			effectiveAnalysisDate && /* @__PURE__ */ (void 0)(ActivityAnalysis, {
				date: effectiveAnalysisDate,
				days,
				detections,
				onClose: () => {
					setActiveAnalysisDate(null);
					if (onSelectDate) onSelectDate("");
				},
				onFlyTo
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 706,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 478,
		columnNumber: 5
	}, this);
}
//#endregion
export { ActivityTimeline as t };
