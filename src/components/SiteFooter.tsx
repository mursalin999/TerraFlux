import { Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/LogoMark";
import { ExternalLink } from "lucide-react";

const FOOTER_LINKS = [
  { to: "/explore", label: "EXPLORE" },
  { to: "/calendar", label: "CALENDAR" },
  { to: "/compare", label: "COMPARE" },
  { to: "/methodology", label: "METHODOLOGY" },
  { to: "/about", label: "ABOUT" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface text-text">
      <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center lg:px-8">
        <div className="max-w-2xl font-mono">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-6 w-6" />
            <span className="font-headline text-sm font-semibold tracking-tight text-text">
              TerraFlux
            </span>
            <span className="text-[10px] text-text-secondary">
              · TEAM EMBERLINE (MYMENSINGH, BANGLADESH)
            </span>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-text-secondary font-sans">
            Independent scientific observation platform harmonizing MODIS and VIIRS satellite active
            fire observations. Thermal anomalies represent spaceborne radiometric observations, not
            ground-verified fires.
          </p>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-text-secondary">
            <span>
              DATA SOURCE:{" "}
              <a
                href="https://firms.modaps.eosdis.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-data-blue hover:underline inline-flex items-center gap-0.5"
              >
                <span>NASA FIRMS</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </span>
            <span>·</span>
            <span>BUILT FOR: NASA SPACE APPS CHALLENGE 2026</span>
            <span>·</span>
            <span className="text-text font-medium">NOT AN OFFICIAL NASA PRODUCT</span>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs" aria-label="Footer">
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              search={{}}
              className="text-text-secondary transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue rounded px-1"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default SiteFooter;
