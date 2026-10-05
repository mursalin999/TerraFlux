import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { E as ChevronDown, S as CircleCheck, a as ShieldAlert, d as Menu, g as Earth, h as ExternalLink, k as Calendar, p as Layers, t as X, v as Database, x as CircleX, y as Cpu } from "../_libs/lucide-react.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as LogoMark, i as DropdownMenuTrigger, n as DropdownMenuContent, o as LogoWithWordmark, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BomvrVjz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DMsmKuHf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var styles_default = "/assets/styles-D-S-Pr-j.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var _jsxFileName$4 = "/app/applet/src/components/SiteNav.tsx";
function SiteNav() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	const isDataActive = pathname.startsWith("/calendar") || pathname.startsWith("/compare");
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
		className: "sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: "/",
					className: "flex items-center",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogoWithWordmark, {}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 22,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 21,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
					className: "hidden items-center gap-1 sm:flex sm:gap-2",
					"aria-label": "Main",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/explore",
							search: {},
							className: `rounded px-3 py-1.5 font-mono text-xs transition-colors ${pathname.startsWith("/explore") ? "border border-border bg-surface-elevated font-semibold text-text" : "text-text-secondary hover:bg-surface hover:text-text"}`,
							children: "EXPLORE"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 27,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								className: `flex items-center gap-1 rounded px-3 py-1.5 font-mono text-xs transition-colors ${isDataActive ? "border border-border bg-surface-elevated font-semibold text-text" : "text-text-secondary hover:bg-surface hover:text-text"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "DATA" }, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 50,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { className: "h-3 w-3 opacity-70" }, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 51,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 42,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 41,
							columnNumber: 13
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
											fileName: _jsxFileName$4,
											lineNumber: 64,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex flex-col",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-semibold",
												children: "Observation Calendar"
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 66,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10px] text-text-secondary",
												children: "Temporal density matrix"
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 67,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 65,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$4,
										lineNumber: 59,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 58,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/compare",
										search: {},
										className: "flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layers, { className: "h-4 w-4 text-data-blue" }, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 77,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex flex-col",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-semibold",
												children: "Sensor Comparison"
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 79,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10px] text-text-secondary",
												children: "MODIS vs VIIRS metrics"
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 80,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 78,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$4,
										lineNumber: 72,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 71,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/about",
										search: {},
										className: "flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Database, { className: "h-4 w-4 text-agreement-teal" }, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 90,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex flex-col",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-semibold",
												children: "NASA FIRMS Provenance"
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 92,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10px] text-text-secondary",
												children: "Data origin & limits"
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 93,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 91,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$4,
										lineNumber: 85,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 84,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 54,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 40,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/methodology",
							search: {},
							className: `rounded px-3 py-1.5 font-mono text-xs transition-colors ${pathname.startsWith("/methodology") ? "border border-border bg-surface-elevated font-semibold text-text" : "text-text-secondary hover:bg-surface hover:text-text"}`,
							children: "METHODOLOGY"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 100,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/about",
							search: {},
							className: `rounded px-3 py-1.5 font-mono text-xs transition-colors ${pathname.startsWith("/about") ? "border border-border bg-surface-elevated font-semibold text-text" : "text-text-secondary hover:bg-surface hover:text-text"}`,
							children: "ABOUT"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 112,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 26,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center sm:hidden",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						onClick: () => setMobileMenuOpen(!mobileMenuOpen),
						"aria-label": "Toggle navigation menu",
						className: "rounded border border-border bg-surface p-2 text-text",
						children: mobileMenuOpen ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 133,
							columnNumber: 31
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Menu, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 133,
							columnNumber: 59
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 127,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 126,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$4,
			lineNumber: 20,
			columnNumber: 7
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
						fileName: _jsxFileName$4,
						lineNumber: 142,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)(Link, {
						to: "/calendar",
						search: {},
						onClick: () => setMobileMenuOpen(false),
						className: "rounded px-3 py-2 text-text hover:bg-surface-elevated",
						children: "DATA · CALENDAR MATRIX"
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 150,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)(Link, {
						to: "/compare",
						search: {},
						onClick: () => setMobileMenuOpen(false),
						className: "rounded px-3 py-2 text-text hover:bg-surface-elevated",
						children: "DATA · SENSOR COMPARISON"
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 158,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)(Link, {
						to: "/methodology",
						search: {},
						onClick: () => setMobileMenuOpen(false),
						className: "rounded px-3 py-2 text-text hover:bg-surface-elevated",
						children: "METHODOLOGY"
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 166,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)(Link, {
						to: "/about",
						search: {},
						onClick: () => setMobileMenuOpen(false),
						className: "rounded px-3 py-2 text-text hover:bg-surface-elevated",
						children: "ABOUT"
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 174,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 141,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 140,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 19,
		columnNumber: 5
	}, this);
}
var _jsxFileName$3 = "/app/applet/src/components/SiteFooter.tsx";
var FOOTER_LINKS = [
	{
		to: "/explore",
		label: "EXPLORE"
	},
	{
		to: "/calendar",
		label: "CALENDAR"
	},
	{
		to: "/compare",
		label: "COMPARE"
	},
	{
		to: "/methodology",
		label: "METHODOLOGY"
	},
	{
		to: "/about",
		label: "ABOUT"
	}
];
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
		className: "border-t border-border bg-surface text-text",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto grid max-w-screen-2xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "max-w-2xl font-mono",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogoMark, { className: "h-6 w-6" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 19,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-headline text-sm font-semibold tracking-tight text-text",
								children: "TerraFlux"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 20,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[10px] text-text-secondary",
								children: "· TEAM EMBERLINE (MYMENSINGH, BANGLADESH)"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 23,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 18,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 text-xs leading-relaxed text-text-secondary font-sans",
						children: "Independent scientific observation platform harmonizing MODIS and VIIRS satellite active fire observations. Thermal anomalies represent spaceborne radiometric observations, not ground-verified fires."
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 28,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-text-secondary",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
								"DATA SOURCE:",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: "https://firms.modaps.eosdis.nasa.gov/",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "text-data-blue hover:underline inline-flex items-center gap-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "NASA FIRMS" }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 43,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "h-2.5 w-2.5" }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 44,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 37,
									columnNumber: 15
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 35,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "·" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 47,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "BUILT FOR: NASA SPACE APPS CHALLENGE 2026" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 48,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "·" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 49,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-text font-medium",
								children: "NOT AN OFFICIAL NASA PRODUCT"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 50,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 34,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 17,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
				className: "flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs",
				"aria-label": "Footer",
				children: FOOTER_LINKS.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: item.to,
					search: {},
					className: "text-text-secondary transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue rounded px-1",
					children: item.label
				}, item.to, false, {
					fileName: _jsxFileName$3,
					lineNumber: 56,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 54,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 16,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 15,
		columnNumber: 5
	}, this);
}
var _jsxFileName$2 = "/app/applet/src/routes/__root.tsx";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 22,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 23,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 24,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 28,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 27,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 21,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 20,
		columnNumber: 5
	}, this);
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 50,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("pre", {
					className: "mt-2 max-h-48 overflow-auto text-left font-mono text-xs text-destructive",
					children: error?.stack || error?.message || String(error)
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 53,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 56,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 60,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 69,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 59,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 49,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 48,
		columnNumber: 5
	}, this);
}
var Route$6 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "TerraFlux: Earth's thermal story, harmonized" },
			{
				name: "description",
				content: "Explore harmonized MODIS and VIIRS active-fire observations from NASA FIRMS through a common analytical framework."
			},
			{
				name: "author",
				content: "Team Emberline — NASA Space Apps Challenge 2026"
			},
			{
				property: "og:title",
				content: "TerraFlux: Earth's thermal story, harmonized"
			},
			{
				property: "og:description",
				content: "Explore harmonized MODIS and VIIRS active-fire observations from NASA FIRMS through a common analytical framework."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:image",
				content: "/og-image.svg"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "TerraFlux: Earth's thermal story, harmonized"
			},
			{
				name: "twitter:description",
				content: "Explore harmonized MODIS and VIIRS active-fire observations from NASA FIRMS through a common analytical framework."
			},
			{
				name: "twitter:image",
				content: "/og-image.svg"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap"
			},
			{
				rel: "stylesheet",
				href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
		lang: "en",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeadContent, {}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 135,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 134,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 139,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 137,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 133,
		columnNumber: 5
	}, this);
}
function RootComponent() {
	const { queryClient } = Route$6.useRouteContext();
	const isHome = useRouterState({ select: (s) => s.location.pathname }) === "/";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: `flex flex-col ${isHome ? "h-[100dvh] overflow-hidden bg-bg" : "min-h-screen lg:min-h-0"}`,
			children: [
				!isHome && /* @__PURE__ */ (void 0)(SiteNav, {}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 155,
					columnNumber: 21
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
					className: `flex-1 ${isHome ? "relative h-full overflow-hidden" : "lg:flex-none"}`,
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 157,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 156,
					columnNumber: 9
				}, this),
				!isHome && /* @__PURE__ */ (void 0)(SiteFooter, {}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 159,
					columnNumber: 21
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 152,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 151,
		columnNumber: 5
	}, this);
}
var $$splitComponentImporter$3 = () => import("./routes-RqoelQW9.mjs");
var Route$5 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "TerraFlux: Earth's thermal story, harmonized" },
		{
			name: "description",
			content: "Explore harmonized MODIS and VIIRS active-fire observations from NASA FIRMS through a common analytical framework."
		},
		{
			property: "og:title",
			content: "TerraFlux: Earth's thermal story, harmonized"
		},
		{
			property: "og:description",
			content: "Explore harmonized MODIS and VIIRS active-fire observations from NASA FIRMS through a common analytical framework."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var _jsxFileName$1 = "/app/applet/src/routes/about.tsx";
var Route$4 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About TerraFlux — Team Emberline" },
		{
			name: "description",
			content: "About TerraFlux, created by Team Emberline (Mymensingh, Bangladesh) for the NASA Space Apps Challenge 2026."
		},
		{
			property: "og:title",
			content: "About TerraFlux — Team Emberline"
		},
		{
			property: "og:description",
			content: "NASA Space Apps Challenge 2026 project: Harmonization of MODIS and VIIRS Hot Spots."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: AboutPage
});
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 font-mono",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2 text-xs uppercase tracking-wider text-data-blue",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Earth, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 31,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "PROVENANCE & PROJECT BACKGROUND" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 32,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 30,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "mt-2 font-headline text-3xl font-bold tracking-tight text-text sm:text-4xl",
					children: "About TerraFlux"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 35,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-4 text-base leading-relaxed text-text-secondary sm:text-lg",
					children: [
						"TerraFlux is an interactive satellite observation analysis instrument developed by",
						" ",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
							className: "text-text font-semibold",
							children: "Team Emberline"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 41,
							columnNumber: 11
						}, this),
						" based in",
						" ",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
							className: "text-text font-semibold",
							children: "Mymensingh, Bangladesh"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 42,
							columnNumber: 11
						}, this),
						" for the",
						" ",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-anomaly-amber font-semibold",
							children: "NASA Space Apps Challenge 2026"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 43,
							columnNumber: 11
						}, this),
						"."
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 39,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 rounded-lg border border-border/80 bg-surface-elevated/70 p-4 text-xs leading-relaxed text-text shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2 font-semibold uppercase tracking-wider text-anomaly-amber",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldAlert, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 49,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "INDEPENDENCE & DISCLAIMER NOTICE" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 50,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 48,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 text-text-secondary",
						children: [
							"TerraFlux is an independent participant project created for the NASA Space Apps Challenge and is ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-text",
								children: "not an official NASA product"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 54,
								columnNumber: 30
							}, this),
							". The designations employed and presentation of satellite data do not imply the expression of any opinion whatsoever on the part of NASA, the United States Government, or any participating space agency."
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 52,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 47,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-lg border border-border bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] uppercase tracking-wider text-text-secondary",
									children: "CHALLENGE"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 64,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-1 font-headline text-base font-semibold text-text",
									children: "NASA Space Apps Challenge 2026"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 67,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-0.5 text-xs text-text-secondary",
									children: "Theme: Harmonization of MODIS & VIIRS Hot Spots"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 70,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 63,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-lg border border-border bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] uppercase tracking-wider text-text-secondary",
									children: "TEAM & LOCATION"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 76,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-1 font-headline text-base font-semibold text-text",
									children: "Team Emberline"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 79,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-0.5 text-xs text-text-secondary",
									children: "Mymensingh, Bangladesh"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 82,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 75,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-lg border border-border bg-surface p-4 sm:col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] uppercase tracking-wider text-text-secondary",
									children: "PRIMARY DATA SOURCE"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 86,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-1 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-headline text-base font-semibold text-text",
										children: "NASA FIRMS (Fire Information for Resource Management System)"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 90,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
										href: "https://firms.modaps.eosdis.nasa.gov/",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "flex items-center gap-1 text-xs text-data-blue hover:underline",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "firms.modaps.eosdis.nasa.gov" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 99,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "h-3 w-3" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 100,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 93,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 89,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 text-xs text-text-secondary",
									children: "Real-time and historical MODIS NRT (Terra & Aqua) and VIIRS NRT (Suomi-NPP & NOAA-20) calibrated sensor streams."
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 103,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 85,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 62,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-8 rounded-lg border border-border bg-surface p-5",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-data-blue",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Cpu, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 113,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "AI-ASSISTED DEVELOPMENT DISCLOSURE" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 114,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 112,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 text-xs leading-relaxed text-text-secondary",
						children: "In compliance with NASA Space Apps Challenge competition guidelines, we disclose that generative AI coding assistants (including Claude and Gemini) were used during the hackathon to accelerate scaffolding, boilerplate generation, and scientific UI design. All mathematical harmonization logic, cross-sensor agreement criteria, and data provenance pipelines were directed, validated, and tested by Team Emberline."
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 116,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 111,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-8 border-t border-border pt-6 text-xs leading-relaxed text-text-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "font-headline text-sm font-semibold uppercase tracking-wider text-text",
						children: "Scientific Integrity Principles"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 127,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
						className: "mt-3 list-disc space-y-2 pl-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-text",
								children: "Zero Fabrication:"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 132,
								columnNumber: 15
							}, this), " TerraFlux never generates, interpolates, or guesses active thermal observations. If a region or interval contains no satellite records, it is displayed as \"Not available\"."] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 131,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-text",
								children: "Direct Ingestion Traceability:"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 137,
								columnNumber: 15
							}, this), " Every point on the globe links back to its verified NASA FIRMS satellite telemetry, acquisition UTC time, and native sensor resolution."] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 136,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-text",
								children: "Clear Categorization:"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 142,
								columnNumber: 15
							}, this), " Satellite thermal observations are distinct from ground fire perimeters. We maintain this scientific distinction across every dashboard and telemetry panel."] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 141,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 130,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 126,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 28,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 27,
		columnNumber: 5
	}, this);
}
var $$splitComponentImporter$2 = () => import("./calendar-B1mmDIJY.mjs");
var Route$3 = createFileRoute("/calendar")({
	head: () => ({ meta: [
		{ title: "Temporal Anomaly Calendar — TerraFlux" },
		{
			name: "description",
			content: "Daily density heatmap of harmonized satellite thermal anomalies for any region — seasonal rhythms and abnormal spikes visible at a glance."
		},
		{
			property: "og:title",
			content: "Temporal Anomaly Calendar — TerraFlux"
		},
		{
			property: "og:description",
			content: "Daily MODIS and VIIRS thermal anomaly observation density rendered as an analytical calendar matrix."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./compare-aIFxRYsl.mjs");
var Route$2 = createFileRoute("/compare")({
	head: () => ({ meta: [
		{ title: "Sensor Comparison — TerraFlux" },
		{
			name: "description",
			content: "MODIS vs VIIRS satellite sensor comparison. Analyze spatial resolution divergence, orbital revisit differences, and cross-sensor agreement on a common analytical grid."
		},
		{
			property: "og:title",
			content: "Sensor Comparison — TerraFlux"
		},
		{
			property: "og:description",
			content: "Compare MODIS and VIIRS satellite thermal anomaly observations side by side."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./explore-C9ox8Sg4.mjs");
var Route$1 = createFileRoute("/explore")({
	head: () => ({ meta: [
		{ title: "Scientific Workspace — TerraFlux" },
		{
			name: "description",
			content: "Harmonized MODIS and VIIRS satellite active-fire observation workspace. Explore raw observations, common analytical grid, historical baseline anomalies, and cross-sensor agreement on a 3D Earth."
		},
		{
			property: "og:title",
			content: "Scientific Workspace — TerraFlux"
		},
		{
			property: "og:description",
			content: "Interactive 3D Earth analytical workspace with multi-sensor harmonization, agreement analysis, and anomaly tracking."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var _jsxFileName = "/app/applet/src/routes/methodology.tsx";
var Route = createFileRoute("/methodology")({
	head: () => ({ meta: [
		{ title: "Scientific Methodology & Analytical Harmonization — TerraFlux" },
		{
			name: "description",
			content: "Harmonization pipeline, mathematical logic, cross-sensor agreement criteria, and radiometric limitations for MODIS and VIIRS satellite active fire observations."
		},
		{
			property: "og:title",
			content: "Scientific Methodology — TerraFlux"
		},
		{
			property: "og:description",
			content: "Traceable scientific architecture for harmonizing MODIS and VIIRS spaceborne thermal anomaly observations."
		}
	] }),
	component: MethodologyPage
});
var PIPELINE_STEPS = [
	{
		id: "source-preservation",
		title: "1. SOURCE PRESERVATION",
		subtitle: "Raw telemetry integrity & unmanipulated values",
		color: "#94a3b8",
		detail: "All ingested observations from NASA FIRMS MODIS NRT and VIIRS NOAA-20 NRT streams are stored in their native formats. Original latitude, longitude, UTC timestamps, radiometric brightness (K), Fire Radiative Power (MW), and detector confidence scores are preserved without alteration or smoothing."
	},
	{
		id: "spatial-harmonization",
		title: "2. SPATIAL HARMONIZATION",
		subtitle: "Equal-angle 0.15° analytical geodetic grid",
		color: "#38bdf8",
		detail: "MODIS observes at 1,000 m nadir pixel resolution (expanding to ~4,800 m at scan edge), while VIIRS uses 375 m I-band imagery channels. To compare them objectively, TerraFlux projects both sensor datasets onto a uniform 0.15° × 0.15° (~16.5 km) geodetic grid, resolving native footprint scale disparities."
	},
	{
		id: "temporal-harmonization",
		title: "3. TEMPORAL HARMONIZATION",
		subtitle: "Orbital overpass alignment by UTC calendar date",
		color: "#fb923c",
		detail: "Terra (10:30 AM/PM), Aqua (1:30 AM/PM), and Suomi-NPP/NOAA-20 (1:30 AM/PM) cross the equator at different solar times. Temporal binning indexes observations by UTC acquisition date (YYYY-MM-DD) and night/day orbital flags, enabling synchronized temporal cross-referencing."
	},
	{
		id: "cross-sensor-agreement",
		title: "4. CROSS-SENSOR AGREEMENT",
		subtitle: "Mathematical spatial-temporal concurrence",
		color: "#2dd4bf",
		detail: "Evaluates whether both sensors detected active thermal anomalies in the same 0.15° cell on the same UTC day: STRONG (both MODIS and VIIRS co-detected with nominal/high confidence), MODERATE (co-detected with low/nominal signals), LIMITED (single-instrument detection only), or NONE."
	},
	{
		id: "historical-baseline",
		title: "5. HISTORICAL BASELINE",
		subtitle: "Empirical percentile rank over baseline window",
		color: "#f59e0b",
		detail: "Computes the empirical frequency percentile of thermal activity for each cell against all active days in the queried baseline window. Cells exceeding the 90th percentile are flagged as statistical anomalies, highlighting acute regional spikes beyond seasonal baselines."
	},
	{
		id: "analytical-view",
		title: "6. TERRAFLUX ANALYTICAL VIEW",
		subtitle: "Unified 3D spherical rendering & traceable telemetry",
		color: "#e2e8f0",
		detail: "Presents the harmonized analytical layers on a high-precision 3D globe and interactive time-series timeline. Researchers can switch between raw footprints, grid density, agreement levels, and anomaly tiers with full telemetry traceability."
	}
];
var LIMITATIONS = [
	{
		title: "Thermal Anomalies Are Not Confirmed Ground Fires",
		body: "Spaceborne sensors detect mid-infrared radiometric temperature spikes at pixel scale. While wildfires and agricultural burns are primary sources, industrial flare stacks, steel plants, power stations, and volcanic geothermal vents also generate thermal anomalies."
	},
	{
		title: "Cloud Cover & Atmospheric Obscuration",
		body: "Heavy cloud cover, dense smoke plumes, and thick aerosol hazes attenuate mid-infrared radiation. An active fire burning underneath thick overcast will not be detected by optical radiometers until cloud cover clears."
	},
	{
		title: "Sun Glint & Highly Reflective Surfaces",
		body: "Specular reflection of solar radiation off water bodies, solar energy farms, or metal rooftops can occasionally generate false-positive radiometric anomalies during daytime satellite passes."
	},
	{
		title: "Duplicate Detections Across Overpasses",
		body: "Because polar-orbiting satellites have overlapping orbital swaths toward higher latitudes and observe twice daily (day and night), the same burning location may be cataloged multiple times within a 24-hour cycle."
	},
	{
		title: "Revisit Gaps & Orbital Cadence",
		body: "Sun-synchronous polar satellites typically provide 2 to 4 overpasses per day per location. Short-duration fires igniting and extinguishing between satellite passes will escape detection."
	},
	{
		title: "Near-Real-Time Data Latency",
		body: "NASA FIRMS NRT data streams are typically delivered within 1 to 3 hours of orbital downlink. They are optimized for monitoring and scientific research, not immediate tactical first-response dispatch."
	},
	{
		title: "MODIS Confidence Tier Bucketing",
		body: "MODIS reports detection confidence as a continuous empirical quality score (0–100). TerraFlux buckets this score into three tiers (<30: low, 30–79: nominal, ≥80: high) to enable cross-sensor comparison with VIIRS categorical tiers. This bucketing is an analytical estimate developed by TerraFlux, not an official NASA definition; raw numeric scores are always preserved in the underlying database."
	}
];
function MethodologyPage() {
	const [expandedStep, setExpandedStep] = (0, import_react.useState)("spatial-harmonization");
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 font-mono",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "border-b border-border pb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2 text-xs uppercase tracking-wider text-data-blue",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layers, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 124,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "SCIENTIFIC METHODOLOGY & HARMONIZATION" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 125,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 123,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "mt-2 font-headline text-3xl font-bold tracking-tight text-text sm:text-4xl",
						children: "From Raw Photons to Harmonized Telemetry"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 127,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base",
						children: "How TerraFlux ingests, normalizes, and correlates spaceborne radiometric active fire observations from NASA's MODIS and VIIRS satellite instruments into a unified analytical framework."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 130,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 122,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "mt-8 rounded-xl border border-border bg-surface p-5 shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mb-4 flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[10px] uppercase tracking-widest text-data-blue",
							children: "ANALYTICAL PIPELINE ARCHITECTURE"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 141,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-headline text-lg font-semibold text-text",
							children: "Harmonization Workflow"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 144,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 140,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[10px] text-text-secondary",
							children: "Click any step to inspect technical details"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 148,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 139,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "overflow-x-auto pb-2",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "min-w-[780px]",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
								viewBox: "0 0 860 160",
								className: "w-full h-auto",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("defs", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("linearGradient", {
										id: "modisGrad",
										x1: "0",
										y1: "0",
										x2: "1",
										y2: "0",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
											offset: "0%",
											stopColor: "#38bdf8"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 159,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
											offset: "100%",
											stopColor: "#94a3b8"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 160,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 158,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("linearGradient", {
										id: "viirsGrad",
										x1: "0",
										y1: "0",
										x2: "1",
										y2: "0",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
											offset: "0%",
											stopColor: "#fb923c"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 163,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
											offset: "100%",
											stopColor: "#94a3b8"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 164,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 162,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 157,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
										x1: "80",
										y1: "40",
										x2: "170",
										y2: "40",
										stroke: "#38bdf8",
										strokeWidth: "1.5",
										strokeDasharray: "3,3"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 169,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
										x1: "80",
										y1: "120",
										x2: "170",
										y2: "120",
										stroke: "#fb923c",
										strokeWidth: "1.5",
										strokeDasharray: "3,3"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 178,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
										d: "M 170 40 C 210 40, 210 80, 240 80",
										fill: "none",
										stroke: "url(#modisGrad)",
										strokeWidth: "1.5"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 189,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
										d: "M 170 120 C 210 120, 210 80, 240 80",
										fill: "none",
										stroke: "url(#viirsGrad)",
										strokeWidth: "1.5"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 195,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
										x1: "330",
										y1: "80",
										x2: "360",
										y2: "80",
										stroke: "#94a3b8",
										strokeWidth: "1.5"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 203,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
										x1: "450",
										y1: "80",
										x2: "480",
										y2: "80",
										stroke: "#38bdf8",
										strokeWidth: "1.5"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 204,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
										x1: "570",
										y1: "80",
										x2: "600",
										y2: "80",
										stroke: "#fb923c",
										strokeWidth: "1.5"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 205,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
										x1: "690",
										y1: "80",
										x2: "720",
										y2: "80",
										stroke: "#2dd4bf",
										strokeWidth: "1.5"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 206,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
										x1: "810",
										y1: "80",
										x2: "840",
										y2: "80",
										stroke: "#f59e0b",
										strokeWidth: "1.5"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 207,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("g", {
										className: "cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("rect", {
											x: "10",
											y: "24",
											width: "70",
											height: "32",
											rx: "4",
											fill: "#0d1e33",
											stroke: "#38bdf8",
											strokeWidth: "1.2"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 211,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("text", {
											x: "45",
											y: "44",
											fill: "#38bdf8",
											fontSize: "10",
											fontWeight: "600",
											textAnchor: "middle",
											fontFamily: "DM Mono",
											children: "MODIS"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 221,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 210,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("g", {
										className: "cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("rect", {
											x: "10",
											y: "104",
											width: "70",
											height: "32",
											rx: "4",
											fill: "#2d170a",
											stroke: "#fb923c",
											strokeWidth: "1.2"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 236,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("text", {
											x: "45",
											y: "124",
											fill: "#fb923c",
											fontSize: "10",
											fontWeight: "600",
											textAnchor: "middle",
											fontFamily: "DM Mono",
											children: "VIIRS"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 246,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 235,
										columnNumber: 15
									}, this),
									PIPELINE_STEPS.slice(0, 5).map((step, i) => {
										const x = 240 + i * 120;
										const isSelected = expandedStep === step.id;
										return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("g", {
											className: "cursor-pointer transition-transform hover:scale-105",
											onClick: () => setExpandedStep(isSelected ? null : step.id),
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("rect", {
													x,
													y: 48,
													width: "90",
													height: "64",
													rx: "6",
													fill: isSelected ? "rgba(255,255,255,0.08)" : "#0c1322",
													stroke: step.color,
													strokeWidth: isSelected ? "2" : "1.2"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 269,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("text", {
													x: x + 45,
													y: 72,
													fill: step.color,
													fontSize: "9",
													fontWeight: "bold",
													textAnchor: "middle",
													fontFamily: "DM Mono",
													children: step.title.split(". ")[1]
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 279,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("text", {
													x: x + 45,
													y: 92,
													fill: "#91a0b5",
													fontSize: "7.5",
													textAnchor: "middle",
													fontFamily: "DM Mono",
													children: ["Step 0", i + 1]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 290,
													columnNumber: 21
												}, this)
											]
										}, step.id, true, {
											fileName: _jsxFileName,
											lineNumber: 264,
											columnNumber: 19
										}, this);
									}),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("g", {
										className: "cursor-pointer transition-transform hover:scale-105",
										onClick: () => setExpandedStep(expandedStep === "analytical-view" ? null : "analytical-view"),
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("rect", {
											x: "840",
											y: "48",
											width: "18",
											height: "64",
											rx: "4",
											fill: "#1e293b",
											stroke: "#e2e8f0",
											strokeWidth: "1.2"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 311,
											columnNumber: 17
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 305,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 156,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 155,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 154,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: PIPELINE_STEPS.map((step) => {
							const isExpanded = expandedStep === step.id;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								onClick: () => setExpandedStep(isExpanded ? null : step.id),
								className: `cursor-pointer rounded-lg border p-4 transition-all ${isExpanded ? "border-text bg-surface-elevated shadow-lg" : "border-border bg-surface hover:border-text-secondary"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] font-bold uppercase tracking-wider",
											style: { color: step.color },
											children: step.title
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 341,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { className: `h-4 w-4 text-text-secondary transition-transform ${isExpanded ? "rotate-180" : ""}` }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 347,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 340,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "mt-1 font-headline text-sm font-semibold text-text",
										children: step.subtitle
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 353,
										columnNumber: 17
									}, this),
									isExpanded && /* @__PURE__ */ (void 0)("p", {
										className: "mt-2 text-xs leading-relaxed text-text-secondary border-t border-border/50 pt-2 animate-in fade-in duration-200",
										children: step.detail
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 357,
										columnNumber: 19
									}, this)
								]
							}, step.id, true, {
								fileName: _jsxFileName,
								lineNumber: 331,
								columnNumber: 15
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 327,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 138,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "mt-10 border-t border-border pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[10px] uppercase tracking-widest text-data-blue",
							children: "EPISTEMIC BOUNDARIES"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 370,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-headline text-2xl font-bold text-text",
							children: "What TerraFlux Knows vs. What It Does Not Know"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 373,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-1 text-xs text-text-secondary",
							children: "Clear boundaries between verified satellite radiometric detections and ground truth."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 376,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 369,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid gap-6 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-xl border border-agreement-teal/40 bg-agreement-teal/5 p-6 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-agreement-teal",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 385,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "WHAT TERRAFLUX KNOWS (OBSERVABLE)" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 386,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 384,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
							className: "mt-4 space-y-3 text-xs leading-relaxed text-text",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-agreement-teal font-bold",
										children: "•"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 390,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "The exact geographical coordinate and UTC timestamp where a sensor pixel registered elevated mid-infrared thermal radiance." }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 391,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 389,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-agreement-teal font-bold",
										children: "•"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 397,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "The sensor instrument (MODIS vs. VIIRS), satellite orbit (Terra, Aqua, Suomi-NPP, NOAA-20), and nominal detector resolution (1,000 m vs. 375 m)." }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 398,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 396,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-agreement-teal font-bold",
										children: "•"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 404,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Whether both satellite instruments coincidentally detected anomalies within the same 0.15° spatial cell on the same UTC day (cross-sensor agreement)." }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 405,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 403,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-agreement-teal font-bold",
										children: "•"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 411,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Estimated Fire Radiative Power (MW) and brightness temperature (K) as measured at top-of-atmosphere." }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 412,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 410,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-agreement-teal font-bold",
										children: "•"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 418,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "How the day's activity ranks historically against stored regional baseline observations (percentile frequency)." }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 419,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 417,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 388,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 383,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-xl border border-critical-red/40 bg-critical-red/5 p-6 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-critical-red",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleX, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 430,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "WHAT TERRAFLUX DOES NOT KNOW (UNOBSERVABLE)" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 431,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 429,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
							className: "mt-4 space-y-3 text-xs leading-relaxed text-text",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-critical-red font-bold",
										children: "•"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 435,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Whether an anomaly is a destructive wildfire, a managed agricultural burn, an industrial flare stack, or bare soil solar heating." }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 436,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 434,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-critical-red font-bold",
										children: "•"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 442,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "The exact physical perimeter, burn depth, combustion rate, or flame height of a fire on the ground." }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 443,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 441,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-critical-red font-bold",
										children: "•"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 449,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Fire activity that ignited and extinguished between orbital overpass windows, or fires burning beneath cloud obscuration." }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 450,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 448,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-critical-red font-bold",
										children: "•"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 456,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Future fire propagation trajectories, wind-driven spread predictions, or real-time tactical evacuation boundaries." }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 457,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 455,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 433,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 428,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 381,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 368,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "mt-10 border-t border-border pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mb-6 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldAlert, { className: "h-5 w-5 text-thermal-orange" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 470,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "font-headline text-2xl font-bold text-text",
						children: "Known Radiometric Limitations"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 471,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 469,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: LIMITATIONS.map((lim) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-lg border border-border bg-surface p-5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "font-headline text-sm font-semibold uppercase tracking-wider text-text",
							children: lim.title
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 479,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-2 text-xs leading-relaxed text-text-secondary",
							children: lim.body
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 482,
							columnNumber: 15
						}, this)]
					}, lim.title, true, {
						fileName: _jsxFileName,
						lineNumber: 478,
						columnNumber: 13
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 476,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 468,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 120,
		columnNumber: 5
	}, this);
}
var rootRouteChildren = {
	IndexRoute: Route$5.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$6
	}),
	AboutRoute: Route$4.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$6
	}),
	CalendarRoute: Route$3.update({
		id: "/calendar",
		path: "/calendar",
		getParentRoute: () => Route$6
	}),
	CompareRoute: Route$2.update({
		id: "/compare",
		path: "/compare",
		getParentRoute: () => Route$6
	}),
	ExploreRoute: Route$1.update({
		id: "/explore",
		path: "/explore",
		getParentRoute: () => Route$6
	}),
	MethodologyRoute: Route.update({
		id: "/methodology",
		path: "/methodology",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
