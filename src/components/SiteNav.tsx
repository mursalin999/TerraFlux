import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogoWithWordmark } from "@/components/LogoMark";
import { ChevronDown, Menu, X, Calendar, Layers, Database } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDataActive = pathname.startsWith("/calendar") || pathname.startsWith("/compare");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <LogoWithWordmark />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 sm:flex sm:gap-2" aria-label="Main">
          <Link
            to="/explore"
            search={{}}
            className={`rounded px-3 py-1.5 font-mono text-xs transition-colors ${
              pathname.startsWith("/explore")
                ? "border border-border bg-surface-elevated font-semibold text-text"
                : "text-text-secondary hover:bg-surface hover:text-text"
            }`}
          >
            EXPLORE
          </Link>

          {/* DATA Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`flex items-center gap-1 rounded px-3 py-1.5 font-mono text-xs transition-colors ${
                  isDataActive
                    ? "border border-border bg-surface-elevated font-semibold text-text"
                    : "text-text-secondary hover:bg-surface hover:text-text"
                }`}
              >
                <span>DATA</span>
                <ChevronDown className="h-3 w-3 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-border bg-surface-elevated font-mono text-xs text-text shadow-2xl"
            >
              <DropdownMenuItem asChild>
                <Link
                  to="/calendar"
                  search={{}}
                  className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface"
                >
                  <Calendar className="h-4 w-4 text-thermal-orange" />
                  <div className="flex flex-col">
                    <span className="font-semibold">Observation Calendar</span>
                    <span className="text-[10px] text-text-secondary">Temporal density matrix</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/compare"
                  search={{}}
                  className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface"
                >
                  <Layers className="h-4 w-4 text-data-blue" />
                  <div className="flex flex-col">
                    <span className="font-semibold">Sensor Comparison</span>
                    <span className="text-[10px] text-text-secondary">MODIS vs VIIRS metrics</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/about"
                  search={{}}
                  className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-text hover:bg-surface"
                >
                  <Database className="h-4 w-4 text-agreement-teal" />
                  <div className="flex flex-col">
                    <span className="font-semibold">NASA FIRMS Provenance</span>
                    <span className="text-[10px] text-text-secondary">Data origin & limits</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/methodology"
            search={{}}
            className={`rounded px-3 py-1.5 font-mono text-xs transition-colors ${
              pathname.startsWith("/methodology")
                ? "border border-border bg-surface-elevated font-semibold text-text"
                : "text-text-secondary hover:bg-surface hover:text-text"
            }`}
          >
            METHODOLOGY
          </Link>

          <Link
            to="/about"
            search={{}}
            className={`rounded px-3 py-1.5 font-mono text-xs transition-colors ${
              pathname.startsWith("/about")
                ? "border border-border bg-surface-elevated font-semibold text-text"
                : "text-text-secondary hover:bg-surface hover:text-text"
            }`}
          >
            ABOUT
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="rounded border border-border bg-surface p-2 text-text"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-surface px-4 py-3 sm:hidden">
          <nav className="flex flex-col space-y-1 font-mono text-xs">
            <Link
              to="/explore"
              search={{}}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded px-3 py-2 text-text hover:bg-surface-elevated"
            >
              EXPLORE
            </Link>
            <Link
              to="/calendar"
              search={{}}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded px-3 py-2 text-text hover:bg-surface-elevated"
            >
              DATA · CALENDAR MATRIX
            </Link>
            <Link
              to="/compare"
              search={{}}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded px-3 py-2 text-text hover:bg-surface-elevated"
            >
              DATA · SENSOR COMPARISON
            </Link>
            <Link
              to="/methodology"
              search={{}}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded px-3 py-2 text-text hover:bg-surface-elevated"
            >
              METHODOLOGY
            </Link>
            <Link
              to="/about"
              search={{}}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded px-3 py-2 text-text hover:bg-surface-elevated"
            >
              ABOUT
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
