import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { D as Check, T as ChevronRight, b as Circle } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dropdown-menu-BomvrVjz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/LogoMark.tsx";
function LogoMark({ className = "h-7 w-7" }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 28 28",
		fill: "none",
		"aria-hidden": "true",
		className,
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
				cx: "14",
				cy: "14",
				r: "9",
				stroke: "rgba(145, 160, 181, 0.45)",
				strokeWidth: "1",
				fill: "none"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 11,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
				cx: "14",
				cy: "14",
				r: "2.5",
				fill: "#F4F7FA",
				opacity: "0.9"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 20,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
				d: "M 4.5 18 C 7 7.5, 21 8, 23.5 17.5",
				stroke: "#4DA3FF",
				strokeWidth: "1.5",
				strokeDasharray: "2.5 1.5",
				strokeLinecap: "round",
				fill: "none"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 23,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
				d: "M 5.5 10.5 C 9 20.5, 21 19.5, 22.5 8",
				stroke: "#FF6A2A",
				strokeWidth: "1.5",
				strokeLinecap: "round",
				fill: "none"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 33,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
				cx: "21.5",
				cy: "9.2",
				r: "1.6",
				fill: "#56D6C9"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 42,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 3,
		columnNumber: 5
	}, this);
}
function LogoWithWordmark({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `flex items-center gap-3 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogoMark, { className: "h-8 w-8 shrink-0" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 50,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "font-headline text-base font-bold tracking-[0.25em] text-text",
				children: "TERRAFLUX"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 52,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "font-mono text-[9px] tracking-[0.18em] text-text-secondary",
				children: "EARTH OBSERVATION / FIRE ACTIVITY"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 55,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 51,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 49,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/components/ui/dropdown-menu.tsx";
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "ml-auto" }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 37,
		columnNumber: 5
	}, void 0)]
}, void 0, true, {
	fileName: _jsxFileName,
	lineNumber: 27,
	columnNumber: 3
}, void 0));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 46,
	columnNumber: 3
}, void 0));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 62,
	columnNumber: 5
}, void 0) }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 61,
	columnNumber: 3
}, void 0));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 82,
	columnNumber: 3
}, void 0));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 108,
			columnNumber: 9
		}, void 0) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 107,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 106,
		columnNumber: 5
	}, void 0), children]
}, void 0, true, {
	fileName: _jsxFileName,
	lineNumber: 98,
	columnNumber: 3
}, void 0));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Circle, { className: "h-2 w-2 fill-current" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 130,
			columnNumber: 9
		}, void 0) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 129,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 128,
		columnNumber: 5
	}, void 0), children]
}, void 0, true, {
	fileName: _jsxFileName,
	lineNumber: 120,
	columnNumber: 3
}, void 0));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 144,
	columnNumber: 3
}, void 0));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 156,
	columnNumber: 3
}, void 0));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 166,
		columnNumber: 5
	}, void 0);
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
//#endregion
export { LogoMark as a, DropdownMenuTrigger as i, DropdownMenuContent as n, LogoWithWordmark as o, DropdownMenuItem as r, DropdownMenu as t };
