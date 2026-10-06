import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { C as ClientOnly, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { E as ChevronDown, d as Menu, j as ArrowRight, k as Calendar, l as RefreshCw, p as Layers, t as X, v as Database } from "../_libs/lucide-react.mjs";
import { a as getHomeMissionTelemetry } from "./firelens.functions-C1L89yTy.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as DropdownMenuTrigger, n as DropdownMenuContent, o as LogoWithWordmark, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-j_qlvo2r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DCtL4Isu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GlobeFallback() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative flex h-full w-full items-center justify-center bg-[#030711]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex h-72 w-72 items-center justify-center rounded-full border border-border/40 bg-surface/30 sm:h-96 sm:w-96 lg:translate-x-[18%]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-60 w-60 rounded-full border border-dashed border-data-blue/30 sm:h-80 sm:w-80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute font-mono text-[10px] uppercase tracking-widest text-text-secondary",
				children: "CALIBRATING 3D GEOID…"
			})]
		})
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-[100dvh] w-screen flex-col justify-between overflow-hidden bg-bg text-text select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobeFallback, {}) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-full bg-gradient-to-r from-bg via-bg/85 to-transparent lg:block lg:w-[54%]",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[55%] bg-gradient-to-t from-bg via-bg/90 to-transparent lg:hidden",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-30 border-b border-border/80 bg-bg/80 backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "flex items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoWithWordmark, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "hidden items-center gap-2 font-mono text-xs sm:flex",
							"aria-label": "Main",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/explore",
									search: {},
									className: "rounded px-3 py-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-text",
									children: "EXPLORE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "flex items-center gap-1 rounded px-3 py-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-text",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DATA" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 opacity-70" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "end",
									className: "w-56 border-border bg-surface-elevated font-mono text-xs text-text shadow-2xl",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/calendar",
												search: {},
												className: "flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 text-data-blue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-col",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold",
														children: "Fetch NASA FIRMS"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-text-secondary",
														children: "Any region and date range"
													})]
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/calendar",
												search: {},
												className: "flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4 text-thermal-orange" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-col",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold",
														children: "Observation Calendar"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-text-secondary",
														children: "Temporal density matrix"
													})]
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/compare",
												search: {},
												className: "flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-data-blue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-col",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold",
														children: "Sensor Comparison"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-text-secondary",
														children: "MODIS vs VIIRS metrics"
													})]
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/about",
												search: {},
												className: "flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-4 w-4 text-agreement-teal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-col",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold",
														children: "NASA FIRMS Provenance"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-text-secondary",
														children: "Data origin & limits"
													})]
												})]
											})
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/methodology",
									search: {},
									className: "rounded px-3 py-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-text",
									children: "METHODOLOGY"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/about",
									search: {},
									className: "rounded px-3 py-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-text",
									children: "ABOUT"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center sm:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMobileMenuOpen(!mobileMenuOpen),
								"aria-label": "Toggle navigation menu",
								className: "rounded border border-border bg-surface p-2 text-text",
								children: mobileMenuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
							})
						})
					]
				}), mobileMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-border bg-surface px-4 py-3 sm:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex flex-col space-y-1 font-mono text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/explore",
								search: {},
								onClick: () => setMobileMenuOpen(false),
								className: "rounded px-3 py-2 text-text hover:bg-surface-elevated",
								children: "EXPLORE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/calendar",
								search: {},
								onClick: () => setMobileMenuOpen(false),
								className: "rounded px-3 py-2 text-text hover:bg-surface-elevated",
								children: "DATA · FETCH NASA FIRMS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/calendar",
								search: {},
								onClick: () => setMobileMenuOpen(false),
								className: "rounded px-3 py-2 text-text hover:bg-surface-elevated",
								children: "DATA · CALENDAR MATRIX"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/compare",
								search: {},
								onClick: () => setMobileMenuOpen(false),
								className: "rounded px-3 py-2 text-text hover:bg-surface-elevated",
								children: "DATA · SENSOR COMPARISON"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/methodology",
								search: {},
								onClick: () => setMobileMenuOpen(false),
								className: "rounded px-3 py-2 text-text hover:bg-surface-elevated",
								children: "METHODOLOGY"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/about",
								search: {},
								onClick: () => setMobileMenuOpen(false),
								className: "rounded px-3 py-2 text-text hover:bg-surface-elevated",
								children: "ABOUT"
							})
						]
					})
				})]
			}),
			showLoaderBadge && loadingStage !== "READY" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute right-4 top-20 z-40 flex items-center gap-2 rounded border border-border bg-surface/90 px-3 py-1.5 font-mono text-[11px] text-text backdrop-blur-md sm:right-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-data-blue animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold uppercase tracking-wider",
					children: loadingStage
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-20 mx-auto flex w-full max-w-screen-2xl flex-1 items-end px-4 pb-8 sm:px-6 lg:items-center lg:pb-0 lg:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-data-blue",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "EARTH'S THERMAL STORY" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-3 font-headline text-3xl font-semibold leading-[1.1] tracking-tight text-text sm:text-5xl lg:text-5xl",
							children: [
								"Two satellites.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"One analytical view."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-sans text-xs leading-relaxed text-text-secondary sm:text-base sm:leading-relaxed",
							children: "Explore harmonized MODIS and VIIRS active-fire observations through a common analytical framework designed to reveal patterns, differences and unusual periods across Earth."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/explore",
								search: {},
								className: "inline-flex items-center justify-center rounded bg-data-blue px-5 py-2.5 font-mono text-xs font-semibold text-bg transition-opacity hover:opacity-90 active:scale-[0.98]",
								children: "EXPLORE EARTH →"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/methodology",
								search: {},
								className: "inline-flex items-center gap-1.5 font-mono text-xs text-text-secondary transition-colors hover:text-text",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "HOW IT WORKS" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									className: "h-3.5 w-3.5",
									"aria-hidden": "true"
								})]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "relative z-30 border-t border-border bg-surface/90 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex h-11 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full items-center gap-3 overflow-x-auto whitespace-nowrap font-mono text-[11px] text-text-secondary scrollbar-none sm:gap-4 lg:justify-between",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-text-secondary",
										children: "DATA SOURCE:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-text",
										children: "NASA FIRMS"
									}),
									telemetry.status === "unavailable" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-critical-red",
										children: "· DATA SOURCE UNAVAILABLE"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-text-secondary/70",
											children: "·"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wider ${telemetry.isRecentPull ? "border border-agreement-teal/40 bg-agreement-teal/15 font-bold text-agreement-teal" : "border border-border bg-surface font-medium text-text-secondary"}`,
											children: telemetry.isRecentPull ? "LIVE" : "STORED RECORDS"
										}),
										telemetry.latestAcqDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-text-secondary",
											children: [
												"(",
												telemetry.latestAcqDate,
												")"
											]
										})
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-border lg:inline",
								children: "|"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-2 w-2 rounded-full border border-data-blue" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MODIS:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: isModisAvailable ? "font-semibold text-data-blue" : "text-text-secondary/60",
										children: isModisAvailable ? "AVAILABLE" : "UNAVAILABLE"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-border lg:inline",
								children: "|"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-2 w-2 rounded-full bg-thermal-orange" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VIIRS:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: isViirsAvailable ? "font-semibold text-thermal-orange" : "text-text-secondary/60",
										children: isViirsAvailable ? "AVAILABLE" : "UNAVAILABLE"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-border lg:inline",
								children: "|"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "HARMONIZATION:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: isHarmonizedActive ? "font-semibold text-agreement-teal" : "text-text-secondary/60",
									children: isHarmonizedActive ? "ACTIVE" : "UNAVAILABLE"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-border lg:inline",
								children: "|"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "HISTORICAL:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-text",
									children: telemetry.baselineDays > 0 ? `${telemetry.baselineDays} DAYS BASELINE` : "UNAVAILABLE"
								})]
							})
						]
					})
				})
			})
		]
	});
}
//#endregion
export { HomePage as component };
