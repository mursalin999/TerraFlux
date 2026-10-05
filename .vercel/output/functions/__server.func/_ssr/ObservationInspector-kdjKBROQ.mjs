import { i as __toESM } from "../_runtime.mjs";
import { r as SENSOR_META } from "./regions--TbXEuvW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { D as Check, j as ArrowRight, p as Layers, r as Sparkles, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ObservationInspector-kdjKBROQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/ObservationInspector.tsx";
var unavailable = "Not available";
var format = (value, suffix = "") => value == null ? unavailable : `${value}${suffix}`;
function calculatePercentile(value, allValues) {
	if (!allValues.length) return null;
	const count = allValues.filter((v) => v <= value).length;
	return Math.round(count / allValues.length * 100);
}
function DetectionStoryModal({ observation, cell, rank, agreementLevel, evidenceStrength, baselineWindow, onClose }) {
	const isPoint = Boolean(observation);
	const sensor = observation?.sensor ?? (cell?.modisCount && cell?.viirsCount ? "MODIS & VIIRS" : cell?.viirsCount ? "VIIRS" : "MODIS");
	const satellite = observation?.satellite ?? "Terra/Aqua & Suomi-NPP/NOAA-20";
	const resolution = observation ? `${observation.resolution_m} m` : "1,000 m / 375 m";
	const frpText = observation?.frp_mw != null ? `${observation.frp_mw.toFixed(1)} MW FRP` : cell?.meanFrp != null ? `${cell.meanFrp.toFixed(1)} MW mean FRP` : null;
	const confidence = observation?.confidence_tier ?? (cell?.isAnomaly ? "elevated" : "nominal");
	const observedDetail = isPoint && observation ? `${observation.acq_date} · ${observation.acq_time} UTC · ${observation.lat.toFixed(4)}° N, ${observation.lon.toFixed(4)}° E` : cell ? `${baselineWindow} · Centroid ${cell.lat.toFixed(4)}° N, ${cell.lon.toFixed(4)}° E` : unavailable;
	const sensorDetail = isPoint && observation ? `${observation.sensor} detected this thermal anomaly from spacecraft ${satellite} at ${resolution} native resolution with ${confidence} confidence.` : cell ? `VIIRS (375 m) registered ${(cell.viirsCount ?? 0).toLocaleString()} detections; MODIS (1,000 m) registered ${(cell.modisCount ?? 0).toLocaleString()} detections.` : unavailable;
	const gridCellId = cell?.id ?? (observation ? `${(Math.floor(observation.lat / .15) * .15).toFixed(2)}_${(Math.floor(observation.lon / .15) * .15).toFixed(2)}` : null);
	const commonGridDetail = gridCellId ? `Aligned to TerraFlux common analytical geodetic cell ${gridCellId} (0.15° × 0.15° equal-angle binning, ~16.5 km) to harmonize differing native satellite footprints.` : unavailable;
	let agreementDetail = unavailable;
	if (agreementLevel === "STRONG") agreementDetail = `STRONG: Both MODIS (${cell?.modisCount ?? "recorded"}) and VIIRS (${cell?.viirsCount ?? "recorded"}) co-detected anomalies within this common grid cell window.`;
	else if (agreementLevel === "MODERATE") agreementDetail = `MODERATE: Multi-observation thermal detection meeting nominal cross-sensor agreement criteria.`;
	else if (agreementLevel === "LIMITED") agreementDetail = `LIMITED: Single-sensor detection by ${sensor}. No concurrent detection recorded by the secondary satellite constellation.`;
	else if (agreementLevel === "NONE") agreementDetail = `NONE: Low radiometric intensity below dual-sensor correspondence threshold.`;
	const historicalDetail = rank != null ? `${rank}th percentile versus the stated baseline window (${baselineWindow}). ${cell?.isAnomaly ? "Classified as an anomaly (≥90th percentile threshold)." : "Within expected regional baseline range."}` : "Not available for this selection";
	const interpretationDetail = `A ${sensor} radiometric observation was recorded at ${resolution} native resolution with ${confidence} confidence${frpText ? ` and ${frpText}` : ""}. Cross-sensor agreement is ${agreementLevel} with ${evidenceStrength.toLowerCase()} evidence strength. This is a satellite-detected thermal anomaly, not a confirmed ground fire.`;
	const steps = [
		{
			title: "1. OBSERVED",
			detail: observedDetail
		},
		{
			title: "2. MODIS / VIIRS",
			detail: sensorDetail
		},
		{
			title: "3. COMMON GRID",
			detail: commonGridDetail
		},
		{
			title: "4. CROSS-SENSOR AGREEMENT",
			detail: agreementDetail
		},
		{
			title: "5. HISTORICAL CONTEXT",
			detail: historicalDetail
		},
		{
			title: "6. TERRAFLUX INTERPRETATION",
			detail: interpretationDetail,
			highlight: true
		}
	];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 z-50 flex justify-end bg-bg/60 backdrop-blur-sm",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Detection story",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
			type: "button",
			"aria-label": "Close detection story",
			onClick: onClose,
			className: "absolute inset-0 cursor-default"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 126,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
			className: "relative flex h-full w-full max-w-lg flex-col border-l border-border bg-surface text-text shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
					className: "flex items-start justify-between border-b border-border p-5",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-4 w-4 text-data-blue" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 136,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-mono text-[10px] tracking-[0.2em] text-data-blue",
								children: "TERRAFLUX / DETECTION STORY"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 137,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 135,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "mt-1 font-headline text-xl font-semibold text-text",
							children: "Traceable Observation Lineage"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 141,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-0.5 font-mono text-[11px] text-text-secondary",
							children: "Deterministic, template-filled scientific explanation based on physical telemetry."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 144,
							columnNumber: 13
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 134,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						"aria-label": "Close",
						onClick: onClose,
						className: "rounded p-1 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-5 w-5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 154,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 148,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 133,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", {
					className: "flex flex-1 flex-col gap-0 overflow-y-auto p-5",
					children: steps.map((step, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
						className: "relative flex gap-4 pb-6 last:pb-0 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-4",
						style: {
							animationDelay: `${idx * 150}ms`,
							animationFillMode: "both"
						},
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "relative flex flex-col items-center",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: `z-10 flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${step.highlight ? "border-anomaly-amber bg-anomaly-amber/20 text-anomaly-amber" : "border-data-blue/60 bg-surface-elevated text-data-blue"}`,
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 173,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 166,
								columnNumber: 17
							}, this), idx < steps.length - 1 && /* @__PURE__ */ (void 0)("span", { className: "absolute top-6 h-full w-px bg-border" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 176,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 165,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "font-mono text-[11px] font-semibold uppercase tracking-wider text-text",
								children: step.title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 180,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: `mt-1 font-mono text-xs leading-relaxed ${step.highlight ? "rounded border border-border/80 bg-surface-elevated p-2.5 text-text" : "text-text-secondary"}`,
								children: step.detail
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 183,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 179,
							columnNumber: 15
						}, this)]
					}, step.title, true, {
						fileName: _jsxFileName,
						lineNumber: 160,
						columnNumber: 13
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 158,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
					className: "border-t border-border bg-surface-elevated/40 p-4 font-mono text-[10px] leading-relaxed text-text-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-semibold text-text",
						children: "SCIENTIFIC INTEGRITY NOTICE:"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 198,
						columnNumber: 11
					}, this), " Observations reflect radiometer-sensed thermal anomalies. Atmospheric conditions, cloud cover, and surface reflectivity can influence spaceborne readings."]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 197,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 132,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 120,
		columnNumber: 5
	}, this);
}
function ObservationInspector({ observation, cell, allCells = [], baselineWindow = "Current Query Window", onClose }) {
	const [storyOpen, setStoryOpen] = (0, import_react.useState)(false);
	const [mobileSnap, setMobileSnap] = (0, import_react.useState)("half");
	const isPoint = Boolean(observation);
	const targetCell = (0, import_react.useMemo)(() => {
		if (cell) return cell;
		if (!observation || !allCells.length) return null;
		return allCells.find((c) => observation.lon >= c.bounds.west && observation.lon <= c.bounds.east && observation.lat >= c.bounds.south && observation.lat <= c.bounds.north) ?? null;
	}, [
		cell,
		observation,
		allCells
	]);
	const rank = (0, import_react.useMemo)(() => {
		if (!allCells.length) return null;
		return calculatePercentile(targetCell?.totalCount ?? targetCell?.detectionCount ?? (isPoint ? 1 : 0), allCells.map((c) => c.totalCount ?? c.detectionCount ?? 0));
	}, [
		allCells,
		targetCell,
		isPoint
	]);
	const agreementLevel = (0, import_react.useMemo)(() => {
		if (targetCell?.agreementLevel) return targetCell.agreementLevel;
		if (targetCell?.agreement) return targetCell.agreement;
		if (observation?.confidence_tier === "high") return "STRONG";
		if (observation?.confidence_tier === "nominal") return "MODERATE";
		return "LIMITED";
	}, [targetCell, observation]);
	const evidenceStrength = (0, import_react.useMemo)(() => {
		if (agreementLevel === "STRONG") return "HIGH";
		if (agreementLevel === "MODERATE" || observation?.confidence_tier === "high") return "ELEVATED";
		if (observation?.confidence_tier === "nominal") return "MODERATE";
		return "LIMITED";
	}, [agreementLevel, observation]);
	if (!observation && !cell) return null;
	const isModis = observation?.sensor === "MODIS";
	const orbitalAltitude = isPoint && observation ? isModis ? "705 km (Polar Sun-Synchronous EOS)" : "824 km (Polar Sun-Synchronous JPSS)" : "705 km / 824 km";
	const solarCrossing = isPoint && observation ? isModis ? "10:30 (Terra EOS AM) / 13:30 (Aqua EOS PM)" : "13:30 Local Solar Time (NOAA-20 / SNPP)" : "10:30 AM / 1:30 PM Equator Crossing";
	const primarySpectral = isPoint && observation ? isModis ? `${format(observation.brightness_k?.toFixed(1), " K")} (Channel 21/22, 3.96 µm)` : `${format(observation.brightness_k?.toFixed(1), " K")} (Band I4, 3.74 µm)` : unavailable;
	const secondarySpectral = isPoint && observation ? observation.brightness2_k != null ? isModis ? `${observation.brightness2_k.toFixed(1)} K (Channel 31, 11.0 µm)` : `${observation.brightness2_k.toFixed(1)} K (Band I5, 11.45 µm)` : unavailable : unavailable;
	const dayNightMode = isPoint && observation ? observation.day_night === "D" ? "Daytime Overpass (Solar Reflectance)" : observation.day_night === "N" ? "Nighttime Overpass (Thermal Only)" : "Standard Pass" : unavailable;
	const confidenceDisplay = isPoint && observation ? observation.confidence_raw ? `${observation.confidence_raw} (${observation.confidence_tier.toUpperCase()})` : observation.confidence_tier.toUpperCase() : cell?.isAnomaly ? "ELEVATED" : "NOMINAL";
	const swathDistortion = isPoint && observation ? isModis ? "1,000 m (Nadir) → ~4,800 m (Scan Edge)" : "375 m (Near-constant I-band across swath)" : "1,000 m / 375 m";
	const sourceFields = isPoint && observation ? [
		{
			label: "LATITUDE",
			value: observation.lat.toFixed(4)
		},
		{
			label: "LONGITUDE",
			value: observation.lon.toFixed(4)
		},
		{
			label: "ACQUISITION DATE",
			value: observation.acq_date
		},
		{
			label: "ACQUISITION TIME (UTC)",
			value: observation.acq_time
		},
		{
			label: "SENSOR & INSTRUMENT",
			value: observation.sensor
		},
		{
			label: "PLATFORM / SATELLITE",
			value: observation.satellite
		},
		{
			label: "ORBITAL ALTITUDE",
			value: orbitalAltitude
		},
		{
			label: "SOLAR LOCAL OVERPASS",
			value: solarCrossing
		},
		{
			label: "NATIVE RESOLUTION",
			value: format(observation.resolution_m, " m")
		},
		{
			label: "SWATH FOOTPRINT",
			value: swathDistortion
		},
		{
			label: "FRP (FIRE RADIATIVE POWER)",
			value: format(observation.frp_mw?.toFixed(1), " MW")
		},
		{
			label: "BRIGHTNESS (FIRE CHANNEL)",
			value: primarySpectral
		},
		{
			label: "BACKGROUND BRIGHTNESS (IR)",
			value: secondarySpectral
		},
		{
			label: "CONFIDENCE METRIC",
			value: confidenceDisplay
		},
		{
			label: "OVERPASS ILLUMINATION",
			value: dayNightMode
		}
	] : cell ? [
		{
			label: "LATITUDE (CENTROID)",
			value: cell.lat.toFixed(4)
		},
		{
			label: "LONGITUDE (CENTROID)",
			value: cell.lon.toFixed(4)
		},
		{
			label: "ACQUISITION DATE",
			value: baselineWindow.split(" ")[0] ?? unavailable
		},
		{
			label: "ACQUISITION TIME (UTC)",
			value: unavailable
		},
		{
			label: "SENSOR & INSTRUMENT",
			value: `MODIS (${cell.modisCount ?? 0}) · VIIRS (${cell.viirsCount ?? 0})`
		},
		{
			label: "PLATFORM / SATELLITE",
			value: "Terra / Aqua / Suomi-NPP / NOAA-20"
		},
		{
			label: "ORBITAL ALTITUDE",
			value: orbitalAltitude
		},
		{
			label: "SOLAR LOCAL OVERPASS",
			value: solarCrossing
		},
		{
			label: "NATIVE RESOLUTION",
			value: "1,000 m (MODIS) / 375 m (VIIRS)"
		},
		{
			label: "SWATH FOOTPRINT",
			value: "0.15° Harmonized Geodetic Grid (~16.5 km)"
		},
		{
			label: "FRP (MEAN)",
			value: format(cell.meanFrp?.toFixed(1), " MW")
		},
		{
			label: "BRIGHTNESS (FIRE CHANNEL)",
			value: unavailable
		},
		{
			label: "BACKGROUND BRIGHTNESS (IR)",
			value: unavailable
		},
		{
			label: "CONFIDENCE METRIC",
			value: confidenceDisplay
		},
		{
			label: "OVERPASS ILLUMINATION",
			value: unavailable
		}
	] : [];
	const derivedFields = [
		{
			label: "HISTORICAL PERCENTILE",
			value: rank != null ? `${rank}th percentile` : unavailable,
			highlight: rank != null && rank >= 90
		},
		{
			label: "CROSS-SENSOR AGREEMENT",
			value: agreementLevel
		},
		{
			label: "EVIDENCE STRENGTH",
			value: evidenceStrength
		}
	];
	const cellSpecificFields = targetCell ? [
		{
			label: "MODIS DETECTIONS",
			value: (targetCell.modisCount ?? 0).toLocaleString()
		},
		{
			label: "VIIRS DETECTIONS",
			value: (targetCell.viirsCount ?? 0).toLocaleString()
		},
		{
			label: "TOTAL CELL DETECTIONS",
			value: (targetCell.totalCount ?? targetCell?.detectionCount ?? 0).toLocaleString()
		}
	] : [];
	const renderFieldList = (fields) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid grid-cols-2 gap-x-3 gap-y-2.5",
		children: fields.map((field) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
				className: "font-mono text-[9px] uppercase tracking-wider text-text-secondary",
				children: field.label
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 405,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", {
				className: `mt-0.5 truncate font-mono text-xs ${field.highlight ? "font-semibold text-anomaly-amber" : "text-text"}`,
				children: field.value
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 408,
				columnNumber: 11
			}, this)]
		}, field.label, true, {
			fileName: _jsxFileName,
			lineNumber: 404,
			columnNumber: 9
		}, this))
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 402,
		columnNumber: 5
	}, this);
	const mainContent = /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col gap-4 p-4 font-mono",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mb-2 flex items-center justify-between border-b border-border/50 pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-[9px] font-semibold uppercase tracking-wider text-text-secondary",
					children: "SOURCE DATA (NASA FIRMS)"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 425,
					columnNumber: 11
				}, this), isPoint && observation && /* @__PURE__ */ (void 0)("span", {
					className: "text-[9px] font-bold",
					style: { color: observation.sensor === "MODIS" ? SENSOR_META.MODIS.color : SENSOR_META.VIIRS.color },
					children: observation.sensor
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 429,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 424,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dl", { children: renderFieldList(sourceFields) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 442,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 423,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "border-t border-border pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mb-2 flex items-center gap-1.5 border-b border-border/50 pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layers, { className: "h-3 w-3 text-agreement-teal" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 448,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-[9px] font-semibold uppercase tracking-wider text-text-secondary",
						children: "TERRAFLUX-DERIVED"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 449,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 447,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dl", { children: renderFieldList(derivedFields) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 453,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 446,
				columnNumber: 7
			}, this),
			targetCell && /* @__PURE__ */ (void 0)("section", {
				className: "rounded border border-border/70 bg-surface-elevated/40 p-2.5",
				children: [/* @__PURE__ */ (void 0)("div", {
					className: "mb-2 flex items-center justify-between",
					children: [/* @__PURE__ */ (void 0)("span", {
						className: "text-[9px] font-semibold uppercase tracking-wider text-text-secondary",
						children: ["COMMON GRID CELL · ", targetCell.id]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 460,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("span", {
						className: "text-[9px] text-text-secondary",
						children: "0.15°"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 463,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 459,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("dl", { children: renderFieldList(cellSpecificFields) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 465,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 458,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				type: "button",
				onClick: () => setStoryOpen(true),
				className: "mt-1 flex items-center justify-between rounded border border-data-blue/50 bg-data-blue/10 px-3.5 py-2.5 font-mono text-[11px] font-semibold tracking-wider text-data-blue transition-all hover:border-data-blue hover:bg-data-blue/20",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "DETECTION STORY" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 475,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 476,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 470,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 421,
		columnNumber: 5
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
			className: "pointer-events-auto fixed right-4 top-20 z-30 hidden w-[340px] max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-surface/95 shadow-2xl backdrop-blur-xl lg:block",
			"aria-label": "Observation inspector",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "flex items-center justify-between border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-2 w-2 rounded-full bg-data-blue animate-pulse" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 490,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-mono text-xs font-semibold uppercase tracking-wider text-text",
						children: "OBSERVATION"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 491,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 489,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					"aria-label": "Close inspector",
					onClick: onClose,
					className: "rounded p-1 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 501,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 495,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 488,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "max-h-[calc(100vh-140px)] overflow-y-auto",
				children: mainContent
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 504,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 484,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: `pointer-events-auto fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-border bg-surface text-text shadow-2xl transition-all duration-300 lg:hidden ${mobileSnap === "peek" ? "h-[140px]" : mobileSnap === "half" ? "h-[50vh]" : "h-[88vh]"}`,
			"aria-label": "Observation inspector drawer",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex shrink-0 flex-col items-center pt-2.5 pb-1",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						"aria-label": "Toggle snap height",
						onClick: () => setMobileSnap((s) => s === "peek" ? "half" : s === "half" ? "full" : "peek"),
						className: "h-1.5 w-12 rounded-full bg-border transition-colors hover:bg-text-secondary"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 516,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 515,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
					className: "flex shrink-0 items-center justify-between px-4 py-2 border-b border-border/60",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-mono text-xs font-semibold uppercase tracking-wider text-text",
							children: "OBSERVATION"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 528,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex gap-1 font-mono text-[9px]",
							children: [
								"peek",
								"half",
								"full"
							].map((snap) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setMobileSnap(snap),
								className: `rounded px-1.5 py-0.5 uppercase ${mobileSnap === snap ? "bg-data-blue/20 text-data-blue" : "text-text-secondary"}`,
								children: snap
							}, snap, false, {
								fileName: _jsxFileName,
								lineNumber: 533,
								columnNumber: 17
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 531,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 527,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						"aria-label": "Close observation inspector",
						onClick: onClose,
						className: "rounded p-1 text-text-secondary hover:text-text",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 552,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 546,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 526,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex-1 overflow-y-auto",
					children: mainContent
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 556,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 508,
			columnNumber: 7
		}, this),
		storyOpen && /* @__PURE__ */ (void 0)(DetectionStoryModal, {
			observation,
			cell: targetCell,
			rank,
			agreementLevel,
			evidenceStrength,
			baselineWindow,
			onClose: () => setStoryOpen(false)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 561,
			columnNumber: 9
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 482,
		columnNumber: 5
	}, this);
}
//#endregion
export { ObservationInspector as t };
