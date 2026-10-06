import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { E as ChevronDown, S as CircleCheck, a as ShieldAlert, d as Menu, g as Earth, h as ExternalLink, k as Calendar, p as Layers, t as X, v as Database, x as CircleX, y as Cpu } from "../_libs/lucide-react.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as LogoMark, i as DropdownMenuTrigger, n as DropdownMenuContent, o as LogoWithWordmark, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-j_qlvo2r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BecfVqcz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BGUOApOk.css";
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
function SiteNav() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	const isDataActive = pathname.startsWith("/calendar") || pathname.startsWith("/compare");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoWithWordmark, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-1 sm:flex sm:gap-2",
					"aria-label": "Main",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/explore",
							search: {},
							className: `rounded px-3 py-1.5 font-mono text-xs transition-colors ${pathname.startsWith("/explore") ? "border border-border bg-surface-elevated font-semibold text-text" : "text-text-secondary hover:bg-surface hover:text-text"}`,
							children: "EXPLORE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: `flex items-center gap-1 rounded px-3 py-1.5 font-mono text-xs transition-colors ${isDataActive ? "border border-border bg-surface-elevated font-semibold text-text" : "text-text-secondary hover:bg-surface hover:text-text"}`,
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
							className: `rounded px-3 py-1.5 font-mono text-xs transition-colors ${pathname.startsWith("/methodology") ? "border border-border bg-surface-elevated font-semibold text-text" : "text-text-secondary hover:bg-surface hover:text-text"}`,
							children: "METHODOLOGY"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/about",
							search: {},
							className: `rounded px-3 py-1.5 font-mono text-xs transition-colors ${pathname.startsWith("/about") ? "border border-border bg-surface-elevated font-semibold text-text" : "text-text-secondary hover:bg-surface hover:text-text"}`,
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
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border bg-surface text-text",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-screen-2xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl font-mono",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "h-6 w-6" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-headline text-sm font-semibold tracking-tight text-text",
								children: "TerraFlux"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-text-secondary",
								children: "· TEAM EMBERLINE (MYMENSINGH, BANGLADESH)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs leading-relaxed text-text-secondary font-sans",
						children: "Independent scientific observation platform harmonizing MODIS and VIIRS satellite active fire observations. Thermal anomalies represent spaceborne radiometric observations, not ground-verified fires."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-text-secondary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"DATA SOURCE:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "https://firms.modaps.eosdis.nasa.gov/",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "text-data-blue hover:underline inline-flex items-center gap-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NASA FIRMS" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-2.5 w-2.5" })]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BUILT FOR: NASA SPACE APPS CHALLENGE 2026" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-text font-medium",
								children: "NOT AN OFFICIAL NASA PRODUCT"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs",
				"aria-label": "Footer",
				children: FOOTER_LINKS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					search: {},
					className: "text-text-secondary transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue rounded px-1",
					children: item.label
				}, item.to))
			})]
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-2 max-h-48 overflow-auto text-left font-mono text-xs text-destructive",
					children: error?.stack || error?.message || String(error)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$6.useRouteContext();
	const isHome = useRouterState({ select: (s) => s.location.pathname }) === "/";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `flex flex-col ${isHome ? "h-[100dvh] overflow-hidden bg-bg" : "min-h-screen lg:min-h-0"}`,
			children: [
				!isHome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: `flex-1 ${isHome ? "relative h-full overflow-hidden" : "lg:flex-none"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				}),
				!isHome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
			]
		})
	});
}
var $$splitComponentImporter$3 = () => import("./routes-DCtL4Isu.mjs");
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 font-mono",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs uppercase tracking-wider text-data-blue",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PROVENANCE & PROJECT BACKGROUND" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-headline text-3xl font-bold tracking-tight text-text sm:text-4xl",
					children: "About TerraFlux"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-base leading-relaxed text-text-secondary sm:text-lg",
					children: [
						"TerraFlux is an interactive satellite observation analysis instrument developed by",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-text font-semibold",
							children: "Team Emberline"
						}),
						" based in",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-text font-semibold",
							children: "Mymensingh, Bangladesh"
						}),
						" for the",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-anomaly-amber font-semibold",
							children: "NASA Space Apps Challenge 2026"
						}),
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 rounded-lg border border-border/80 bg-surface-elevated/70 p-4 text-xs leading-relaxed text-text shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-semibold uppercase tracking-wider text-anomaly-amber",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "INDEPENDENCE & DISCLAIMER NOTICE" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-text-secondary",
						children: [
							"TerraFlux is an independent participant project created for the NASA Space Apps Challenge and is ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-text",
								children: "not an official NASA product"
							}),
							". The designations employed and presentation of satellite data do not imply the expression of any opinion whatsoever on the part of NASA, the United States Government, or any participating space agency."
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-wider text-text-secondary",
									children: "CHALLENGE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 font-headline text-base font-semibold text-text",
									children: "NASA Space Apps Challenge 2026"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 text-xs text-text-secondary",
									children: "Theme: Harmonization of MODIS & VIIRS Hot Spots"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-wider text-text-secondary",
									children: "TEAM & LOCATION"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 font-headline text-base font-semibold text-text",
									children: "Team Emberline"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 text-xs text-text-secondary",
									children: "Mymensingh, Bangladesh"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-surface p-4 sm:col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-wider text-text-secondary",
									children: "PRIMARY DATA SOURCE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-headline text-base font-semibold text-text",
										children: "NASA FIRMS (Fire Information for Resource Management System)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "https://firms.modaps.eosdis.nasa.gov/",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "flex items-center gap-1 text-xs text-data-blue hover:underline",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "firms.modaps.eosdis.nasa.gov" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-text-secondary",
									children: "Real-time and historical MODIS NRT (Terra & Aqua) and VIIRS NRT (Suomi-NPP & NOAA-20) calibrated sensor streams."
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 grid gap-5 border-t border-border pt-8 sm:grid-cols-[minmax(0,1.25fr)_minmax(220px,0.75fr)] sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/emberline-logo.png",
								alt: "Emberline logo showing satellites observing fire data over Earth",
								className: "size-16 rounded-full border border-border object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] uppercase tracking-wider text-text-secondary",
								children: "TEAM EMBERLINE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-headline text-xl font-semibold text-text",
								children: "Built by Ibrahim Mursalin"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-relaxed text-text-secondary",
							children: "TerraFlux is an independent solo project by Ibrahim Mursalin, a 17-year-old builder focused on making NASA fire observations easier to understand and compare."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-lg border border-border bg-surface",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/ibrahim-mursalin.jpg",
							alt: "Black-and-white portrait of Ibrahim Mursalin",
							className: "aspect-[4/3] w-full object-cover object-top"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] uppercase tracking-wider text-text-secondary",
								children: "FOUNDER & BUILDER"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-semibold text-text",
								children: "Ibrahim Mursalin"
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 rounded-lg border border-border bg-surface p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-data-blue",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI-ASSISTED DEVELOPMENT DISCLOSURE" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs leading-relaxed text-text-secondary",
						children: "In compliance with NASA Space Apps Challenge competition guidelines, we disclose that generative AI coding assistants (including Claude and Gemini) were used during the hackathon to accelerate scaffolding, boilerplate generation, and scientific UI design. All mathematical harmonization logic, cross-sensor agreement criteria, and data provenance pipelines were directed, validated, and tested by Team Emberline."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 border-t border-border pt-6 text-xs leading-relaxed text-text-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-headline text-sm font-semibold uppercase tracking-wider text-text",
						children: "Scientific Integrity Principles"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 list-disc space-y-2 pl-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-text",
								children: "Zero Fabrication:"
							}), " TerraFlux never generates, interpolates, or guesses active thermal observations. If a region or interval contains no satellite records, it is displayed as \"Not available\"."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-text",
								children: "Direct Ingestion Traceability:"
							}), " Every point on the globe links back to its verified NASA FIRMS satellite telemetry, acquisition UTC time, and native sensor resolution."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-text",
								children: "Clear Categorization:"
							}), " Satellite thermal observations are distinct from ground fire perimeters. We maintain this scientific distinction across every dashboard and telemetry panel."] })
						]
					})]
				})
			]
		})
	});
}
var $$splitComponentImporter$2 = () => import("./calendar-Bxfm5DPP.mjs");
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
var $$splitComponentImporter$1 = () => import("./compare-D9ibR2II.mjs");
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
var $$splitComponentImporter = () => import("./explore-BWCTMyjJ.mjs");
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 font-mono",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border pb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs uppercase tracking-wider text-data-blue",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SCIENTIFIC METHODOLOGY & HARMONIZATION" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-headline text-3xl font-bold tracking-tight text-text sm:text-4xl",
						children: "From Raw Photons to Harmonized Telemetry"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base",
						children: "How TerraFlux ingests, normalizes, and correlates spaceborne radiometric active fire observations from NASA's MODIS and VIIRS satellite instruments into a unified analytical framework."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 rounded-xl border border-border bg-surface p-5 shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-widest text-data-blue",
							children: "ANALYTICAL PIPELINE ARCHITECTURE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-headline text-lg font-semibold text-text",
							children: "Harmonization Workflow"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-text-secondary",
							children: "Click any step to inspect technical details"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-[780px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: "0 0 860 160",
								className: "w-full h-auto",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "modisGrad",
										x1: "0",
										y1: "0",
										x2: "1",
										y2: "0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "#38bdf8"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "#94a3b8"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "viirsGrad",
										x1: "0",
										y1: "0",
										x2: "1",
										y2: "0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "#fb923c"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "#94a3b8"
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "80",
										y1: "40",
										x2: "170",
										y2: "40",
										stroke: "#38bdf8",
										strokeWidth: "1.5",
										strokeDasharray: "3,3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "80",
										y1: "120",
										x2: "170",
										y2: "120",
										stroke: "#fb923c",
										strokeWidth: "1.5",
										strokeDasharray: "3,3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M 170 40 C 210 40, 210 80, 240 80",
										fill: "none",
										stroke: "url(#modisGrad)",
										strokeWidth: "1.5"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M 170 120 C 210 120, 210 80, 240 80",
										fill: "none",
										stroke: "url(#viirsGrad)",
										strokeWidth: "1.5"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "330",
										y1: "80",
										x2: "360",
										y2: "80",
										stroke: "#94a3b8",
										strokeWidth: "1.5"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "450",
										y1: "80",
										x2: "480",
										y2: "80",
										stroke: "#38bdf8",
										strokeWidth: "1.5"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "570",
										y1: "80",
										x2: "600",
										y2: "80",
										stroke: "#fb923c",
										strokeWidth: "1.5"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "690",
										y1: "80",
										x2: "720",
										y2: "80",
										stroke: "#2dd4bf",
										strokeWidth: "1.5"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "810",
										y1: "80",
										x2: "840",
										y2: "80",
										stroke: "#f59e0b",
										strokeWidth: "1.5"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
										className: "cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											x: "10",
											y: "24",
											width: "70",
											height: "32",
											rx: "4",
											fill: "#0d1e33",
											stroke: "#38bdf8",
											strokeWidth: "1.2"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											x: "45",
											y: "44",
											fill: "#38bdf8",
											fontSize: "10",
											fontWeight: "600",
											textAnchor: "middle",
											fontFamily: "DM Mono",
											children: "MODIS"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
										className: "cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											x: "10",
											y: "104",
											width: "70",
											height: "32",
											rx: "4",
											fill: "#2d170a",
											stroke: "#fb923c",
											strokeWidth: "1.2"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											x: "45",
											y: "124",
											fill: "#fb923c",
											fontSize: "10",
											fontWeight: "600",
											textAnchor: "middle",
											fontFamily: "DM Mono",
											children: "VIIRS"
										})]
									}),
									PIPELINE_STEPS.slice(0, 5).map((step, i) => {
										const x = 240 + i * 120;
										const isSelected = expandedStep === step.id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
											className: "cursor-pointer transition-transform hover:scale-105",
											onClick: () => setExpandedStep(isSelected ? null : step.id),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x,
													y: 48,
													width: "90",
													height: "64",
													rx: "6",
													fill: isSelected ? "rgba(255,255,255,0.08)" : "#0c1322",
													stroke: step.color,
													strokeWidth: isSelected ? "2" : "1.2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: x + 45,
													y: 72,
													fill: step.color,
													fontSize: "9",
													fontWeight: "bold",
													textAnchor: "middle",
													fontFamily: "DM Mono",
													children: step.title.split(". ")[1]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: x + 45,
													y: 92,
													fill: "#91a0b5",
													fontSize: "7.5",
													textAnchor: "middle",
													fontFamily: "DM Mono",
													children: ["Step 0", i + 1]
												})
											]
										}, step.id);
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
										className: "cursor-pointer transition-transform hover:scale-105",
										onClick: () => setExpandedStep(expandedStep === "analytical-view" ? null : "analytical-view"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											x: "840",
											y: "48",
											width: "18",
											height: "64",
											rx: "4",
											fill: "#1e293b",
											stroke: "#e2e8f0",
											strokeWidth: "1.2"
										})
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: PIPELINE_STEPS.map((step) => {
							const isExpanded = expandedStep === step.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => setExpandedStep(isExpanded ? null : step.id),
								className: `cursor-pointer rounded-lg border p-4 transition-all ${isExpanded ? "border-text bg-surface-elevated shadow-lg" : "border-border bg-surface hover:border-text-secondary"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold uppercase tracking-wider",
											style: { color: step.color },
											children: step.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 text-text-secondary transition-transform ${isExpanded ? "rotate-180" : ""}` })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-1 font-headline text-sm font-semibold text-text",
										children: step.subtitle
									}),
									isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs leading-relaxed text-text-secondary border-t border-border/50 pt-2 animate-in fade-in duration-200",
										children: step.detail
									})
								]
							}, step.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 border-t border-border pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-widest text-data-blue",
							children: "EPISTEMIC BOUNDARIES"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-headline text-2xl font-bold text-text",
							children: "What TerraFlux Knows vs. What It Does Not Know"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-text-secondary",
							children: "Clear boundaries between verified satellite radiometric detections and ground truth."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-agreement-teal/40 bg-agreement-teal/5 p-6 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-agreement-teal",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "WHAT TERRAFLUX KNOWS (OBSERVABLE)" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-3 text-xs leading-relaxed text-text",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-agreement-teal font-bold",
										children: "•"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "The exact geographical coordinate and UTC timestamp where a sensor pixel registered elevated mid-infrared thermal radiance." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-agreement-teal font-bold",
										children: "•"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "The sensor instrument (MODIS vs. VIIRS), satellite orbit (Terra, Aqua, Suomi-NPP, NOAA-20), and nominal detector resolution (1,000 m vs. 375 m)." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-agreement-teal font-bold",
										children: "•"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Whether both satellite instruments coincidentally detected anomalies within the same 0.15° spatial cell on the same UTC day (cross-sensor agreement)." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-agreement-teal font-bold",
										children: "•"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Estimated Fire Radiative Power (MW) and brightness temperature (K) as measured at top-of-atmosphere." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-agreement-teal font-bold",
										children: "•"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "How the day's activity ranks historically against stored regional baseline observations (percentile frequency)." })]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-critical-red/40 bg-critical-red/5 p-6 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-critical-red",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "WHAT TERRAFLUX DOES NOT KNOW (UNOBSERVABLE)" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-3 text-xs leading-relaxed text-text",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-critical-red font-bold",
										children: "•"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Whether an anomaly is a destructive wildfire, a managed agricultural burn, an industrial flare stack, or bare soil solar heating." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-critical-red font-bold",
										children: "•"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "The exact physical perimeter, burn depth, combustion rate, or flame height of a fire on the ground." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-critical-red font-bold",
										children: "•"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fire activity that ignited and extinguished between orbital overpass windows, or fires burning beneath cloud obscuration." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-critical-red font-bold",
										children: "•"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Future fire propagation trajectories, wind-driven spread predictions, or real-time tactical evacuation boundaries." })]
								})
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 border-t border-border pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5 text-thermal-orange" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-headline text-2xl font-bold text-text",
						children: "Known Radiometric Limitations"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: LIMITATIONS.map((lim) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-headline text-sm font-semibold uppercase tracking-wider text-text",
							children: lim.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs leading-relaxed text-text-secondary",
							children: lim.body
						})]
					}, lim.title))
				})]
			})
		]
	});
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
