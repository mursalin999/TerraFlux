import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { E as ChevronDown, d as Menu, j as ArrowRight, k as Calendar, p as Layers, t as X, v as Database } from "../_libs/lucide-react.mjs";
import { C as ClientOnly, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getHomeMissionTelemetry } from "./firelens.functions-BRu83nth.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as DropdownMenuTrigger, n as DropdownMenuContent, o as LogoWithWordmark, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BomvrVjz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-RqoelQW9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/index.tsx?tsr-split=component";
function GlobeFallback() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative flex h-full w-full items-center justify-center bg-[#030711]",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "relative flex h-72 w-72 items-center justify-center rounded-full border border-border/40 bg-surface/30 sm:h-96 sm:w-96 lg:translate-x-[18%]",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-60 w-60 rounded-full border border-dashed border-data-blue/30 sm:h-80 sm:w-80" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 12,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "absolute font-mono text-[10px] uppercase tracking-widest text-text-secondary",
				children: "CALIBRATING 3D GEOID…"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 13,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 11,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 10,
		columnNumber: 10
	}, this);
}
function HomePage() {
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	const [loadingStage, ,] = (0, import_react.useState)("INITIALIZING EARTH");
	const [showLoaderBadge, setShowLoaderBadge] = (0, import_react.useState)(false);
	const telemetryQuery = useQuery({
		queryKey: ["home-mission-telemetry"],
		queryFn: () => getHomeMissionTelemetry(),
		staleTime: 6e4
	});
	const telemetry = telemetryQuery.data ?? {
		status: telemetryQuery.isError ? "unavailable" : "ok",
		totalDetections: 0,
		modisCount: 0,
		viirsCount: 0,
		latestAcqDate: null,
		lastIngestTime: null,
		baselineDays: 0,
		hasHarmonized: false,
		isRecentPull: false
	};
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(() => {
			if (loadingStage !== "READY") setShowLoaderBadge(true);
		}, 300);
		return () => clearTimeout(timer);
	}, [loadingStage]);
	const isDataAvailable = telemetry.status === "ok" && !telemetryQuery.isError;
	const isModisAvailable = isDataAvailable && telemetry.modisCount > 0;
	const isViirsAvailable = isDataAvailable && telemetry.viirsCount > 0;
	const isHarmonizedActive = isDataAvailable && telemetry.hasHarmonized;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative flex h-[100dvh] w-screen flex-col justify-between overflow-hidden bg-bg text-text select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "absolute inset-0 z-0",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GlobeFallback, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 57,
					columnNumber: 31
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 57,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 56,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-full bg-gradient-to-r from-bg via-bg/85 to-transparent lg:block lg:w-[54%]",
				"aria-hidden": "true"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 61,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[55%] bg-gradient-to-t from-bg via-bg/90 to-transparent lg:hidden",
				"aria-hidden": "true"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 62,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "relative z-30 border-b border-border/80 bg-bg/80 backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/",
							className: "flex items-center",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogoWithWordmark, {}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 69,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 68,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
							className: "hidden items-center gap-2 font-mono text-xs sm:flex",
							"aria-label": "Main",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/explore",
									search: {},
									className: "rounded px-3 py-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-text",
									children: "EXPLORE"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 74,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										className: "flex items-center gap-1 rounded px-3 py-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-text",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "DATA" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 82,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { className: "h-3 w-3 opacity-70" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 83,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 81,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 80,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuContent, {
									align: "end",
									className: "w-56 border-border bg-surface-elevated font-mono text-xs text-text shadow-2xl",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuItem, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
												to: "/calendar",
												search: {},
												className: "flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "h-4 w-4 text-thermal-orange" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 89,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex flex-col",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "font-semibold",
														children: "Observation Calendar"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 91,
														columnNumber: 23
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "text-[10px] text-text-secondary",
														children: "Temporal density matrix"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 92,
														columnNumber: 23
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 90,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 88,
												columnNumber: 19
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 87,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuItem, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
												to: "/compare",
												search: {},
												className: "flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layers, { className: "h-4 w-4 text-data-blue" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 100,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex flex-col",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "font-semibold",
														children: "Sensor Comparison"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 102,
														columnNumber: 23
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "text-[10px] text-text-secondary",
														children: "MODIS vs VIIRS metrics"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 103,
														columnNumber: 23
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 101,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 99,
												columnNumber: 19
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 98,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuItem, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
												to: "/about",
												search: {},
												className: "flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Database, { className: "h-4 w-4 text-agreement-teal" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 111,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex flex-col",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "font-semibold",
														children: "NASA FIRMS Provenance"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 113,
														columnNumber: 23
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "text-[10px] text-text-secondary",
														children: "Data origin & limits"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 114,
														columnNumber: 23
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 112,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 110,
												columnNumber: 19
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 109,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 86,
									columnNumber: 15
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 79,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/methodology",
									search: {},
									className: "rounded px-3 py-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-text",
									children: "METHODOLOGY"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 121,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/about",
									search: {},
									className: "rounded px-3 py-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-text",
									children: "ABOUT"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 125,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 73,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center sm:hidden",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setMobileMenuOpen(!mobileMenuOpen),
								"aria-label": "Toggle navigation menu",
								className: "rounded border border-border bg-surface p-2 text-text",
								children: mobileMenuOpen ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 133,
									columnNumber: 33
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Menu, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 133,
									columnNumber: 61
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 132,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 131,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 66,
					columnNumber: 9
				}, this), mobileMenuOpen && /* @__PURE__ */ (void 0)("div", {
					className: "border-b border-border bg-surface px-4 py-3 sm:hidden",
					children: /* @__PURE__ */ (void 0)("nav", {
						className: "flex flex-col space-y-1 font-mono text-xs",
						children: [
							/* @__PURE__ */ (void 0)(Link, {
								to: "/explore",
								search: {},
								onClick: () => setMobileMenuOpen(false),
								className: "rounded px-3 py-2 text-text hover:bg-surface-elevated",
								children: "EXPLORE"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 141,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)(Link, {
								to: "/calendar",
								search: {},
								onClick: () => setMobileMenuOpen(false),
								className: "rounded px-3 py-2 text-text hover:bg-surface-elevated",
								children: "DATA · CALENDAR MATRIX"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 144,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)(Link, {
								to: "/compare",
								search: {},
								onClick: () => setMobileMenuOpen(false),
								className: "rounded px-3 py-2 text-text hover:bg-surface-elevated",
								children: "DATA · SENSOR COMPARISON"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 147,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)(Link, {
								to: "/methodology",
								search: {},
								onClick: () => setMobileMenuOpen(false),
								className: "rounded px-3 py-2 text-text hover:bg-surface-elevated",
								children: "METHODOLOGY"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 150,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)(Link, {
								to: "/about",
								search: {},
								onClick: () => setMobileMenuOpen(false),
								className: "rounded px-3 py-2 text-text hover:bg-surface-elevated",
								children: "ABOUT"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 153,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 140,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 139,
					columnNumber: 28
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 65,
				columnNumber: 7
			}, this),
			showLoaderBadge && loadingStage !== "READY" && /* @__PURE__ */ (void 0)("div", {
				className: "pointer-events-none absolute right-4 top-20 z-40 flex items-center gap-2 rounded border border-border bg-surface/90 px-3 py-1.5 font-mono text-[11px] text-text backdrop-blur-md sm:right-8",
				children: [/* @__PURE__ */ (void 0)("span", { className: "h-2 w-2 rounded-full bg-data-blue animate-pulse" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 162,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("span", {
					className: "font-semibold uppercase tracking-wider",
					children: loadingStage
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 163,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 161,
				columnNumber: 55
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "relative z-20 mx-auto flex w-full max-w-screen-2xl flex-1 items-end px-4 pb-8 sm:px-6 lg:items-center lg:pb-0 lg:px-8",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-data-blue",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "EARTH'S THERMAL STORY" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 171,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 170,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "mt-3 font-headline text-3xl font-semibold leading-[1.1] tracking-tight text-text sm:text-5xl lg:text-5xl",
							children: [
								"Two satellites.",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 177,
									columnNumber: 13
								}, this),
								"One analytical view."
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 175,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-4 font-sans text-xs leading-relaxed text-text-secondary sm:text-base sm:leading-relaxed",
							children: "Explore harmonized MODIS and VIIRS active-fire observations through a common analytical framework designed to reveal patterns, differences and unusual periods across Earth."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 182,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-6 flex flex-wrap items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/explore",
								search: {},
								className: "inline-flex items-center justify-center rounded bg-data-blue px-5 py-2.5 font-mono text-xs font-semibold text-bg transition-opacity hover:opacity-90 active:scale-[0.98]",
								children: "EXPLORE EARTH →"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 189,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/methodology",
								search: {},
								className: "inline-flex items-center gap-1.5 font-mono text-xs text-text-secondary transition-colors hover:text-text",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "HOW IT WORKS" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 193,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, {
									className: "h-3.5 w-3.5",
									"aria-hidden": "true"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 194,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 192,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 188,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 168,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 167,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
				className: "relative z-30 border-t border-border bg-surface/90 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mx-auto flex h-11 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex w-full items-center gap-3 overflow-x-auto whitespace-nowrap font-mono text-[11px] text-text-secondary scrollbar-none sm:gap-4 lg:justify-between",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex shrink-0 items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-text-secondary",
										children: "DATA SOURCE:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 206,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
										className: "text-text",
										children: "NASA FIRMS"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 207,
										columnNumber: 15
									}, this),
									telemetry.status === "unavailable" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-semibold text-critical-red",
										children: "· DATA SOURCE UNAVAILABLE"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 208,
										columnNumber: 53
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-text-secondary/70",
											children: "·"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 209,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: `rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wider ${telemetry.isRecentPull ? "border border-agreement-teal/40 bg-agreement-teal/15 font-bold text-agreement-teal" : "border border-border bg-surface font-medium text-text-secondary"}`,
											children: telemetry.isRecentPull ? "LIVE" : "STORED RECORDS"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 210,
											columnNumber: 19
										}, this),
										telemetry.latestAcqDate && /* @__PURE__ */ (void 0)("span", {
											className: "text-[10px] text-text-secondary",
											children: [
												"(",
												telemetry.latestAcqDate,
												")"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 213,
											columnNumber: 47
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 208,
										columnNumber: 138
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 205,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "hidden text-border lg:inline",
								children: "|"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 219,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex shrink-0 items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-block h-2 w-2 rounded-full border border-data-blue" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 223,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "MODIS:" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 224,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: isModisAvailable ? "font-semibold text-data-blue" : "text-text-secondary/60",
										children: isModisAvailable ? "AVAILABLE" : "UNAVAILABLE"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 225,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 222,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "hidden text-border lg:inline",
								children: "|"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 230,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex shrink-0 items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-block h-2 w-2 rounded-full bg-thermal-orange" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 234,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "VIIRS:" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 235,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: isViirsAvailable ? "font-semibold text-thermal-orange" : "text-text-secondary/60",
										children: isViirsAvailable ? "AVAILABLE" : "UNAVAILABLE"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 236,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 233,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "hidden text-border lg:inline",
								children: "|"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 241,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex shrink-0 items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "HARMONIZATION:" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 245,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: isHarmonizedActive ? "font-semibold text-agreement-teal" : "text-text-secondary/60",
									children: isHarmonizedActive ? "ACTIVE" : "UNAVAILABLE"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 246,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 244,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "hidden text-border lg:inline",
								children: "|"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 251,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex shrink-0 items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "HISTORICAL:" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 255,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-text",
									children: telemetry.baselineDays > 0 ? `${telemetry.baselineDays} DAYS BASELINE` : "UNAVAILABLE"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 256,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 254,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 203,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 202,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 201,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 54,
		columnNumber: 10
	}, this);
}
//#endregion
export { HomePage as component };
