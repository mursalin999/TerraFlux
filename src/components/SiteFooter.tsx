import { Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/LogoMark";

const FOOTER_LINKS = [
  { to: "/explore", label: "EXPLORE" },
  { to: "/calendar", label: "CALENDAR" },
  { to: "/compare", label: "COMPARE" },
  { to: "/about", label: "METHODOLOGY & LIMITATIONS" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface text-text">
      <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center lg:px-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-6 w-6" />
            <span className="font-headline text-sm font-semibold tracking-tight text-text">
              TerraFlux
            </span>
            <span className="font-mono text-[10px] text-text-secondary">· TEAM EMBERLINE</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-text-secondary">
            Independent scientific observation platform for harmonized MODIS and VIIRS satellite
            thermal anomalies. Thermal anomalies represent spaceborne radiometric observations, not
            ground-verified fires.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-text-secondary/80">
            <span>DATA SOURCE: NASA FIRMS</span>
            <span>·</span>
            <span>BUILT FOR: NASA SPACE APPS CHALLENGE 2026</span>
            <span>·</span>
            <span>NOT AN OFFICIAL NASA PRODUCT</span>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs" aria-label="Footer">
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              search={{}}
              className="text-text-secondary transition-colors hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
