import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Layers,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldAlert,
  Satellite,
} from "lucide-react";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "Scientific Methodology & Analytical Harmonization — TerraFlux" },
      {
        name: "description",
        content:
          "Harmonization pipeline, mathematical logic, cross-sensor agreement criteria, and radiometric limitations for MODIS and VIIRS satellite active fire observations.",
      },
      { property: "og:title", content: "Scientific Methodology — TerraFlux" },
      {
        property: "og:description",
        content:
          "Traceable scientific architecture for harmonizing MODIS and VIIRS spaceborne thermal anomaly observations.",
      },
    ],
  }),
  component: MethodologyPage,
});

const PIPELINE_STEPS = [
  {
    id: "source-preservation",
    title: "1. SOURCE PRESERVATION",
    subtitle: "Raw telemetry integrity & unmanipulated values",
    color: "#94a3b8",
    detail:
      "All ingested observations from NASA FIRMS MODIS NRT and VIIRS NOAA-20 NRT streams are stored in their native formats. Original latitude, longitude, UTC timestamps, radiometric brightness (K), Fire Radiative Power (MW), and detector confidence scores are preserved without alteration or smoothing.",
  },
  {
    id: "spatial-harmonization",
    title: "2. SPATIAL HARMONIZATION",
    subtitle: "Equal-angle 0.15° analytical geodetic grid",
    color: "#38bdf8",
    detail:
      "MODIS observes at 1,000 m nadir pixel resolution (expanding to ~4,800 m at scan edge), while VIIRS uses 375 m I-band imagery channels. To compare them objectively, TerraFlux projects both sensor datasets onto a uniform 0.15° × 0.15° (~16.5 km) geodetic grid, resolving native footprint scale disparities.",
  },
  {
    id: "temporal-harmonization",
    title: "3. TEMPORAL HARMONIZATION",
    subtitle: "Orbital overpass alignment by UTC calendar date",
    color: "#fb923c",
    detail:
      "Terra (10:30 AM/PM), Aqua (1:30 AM/PM), and Suomi-NPP/NOAA-20 (1:30 AM/PM) cross the equator at different solar times. Temporal binning indexes observations by UTC acquisition date (YYYY-MM-DD) and night/day orbital flags, enabling synchronized temporal cross-referencing.",
  },
  {
    id: "cross-sensor-agreement",
    title: "4. CROSS-SENSOR AGREEMENT",
    subtitle: "Mathematical spatial-temporal concurrence",
    color: "#2dd4bf",
    detail:
      "Evaluates whether both sensors detected active thermal anomalies in the same 0.15° cell on the same UTC day: STRONG (both MODIS and VIIRS co-detected with nominal/high confidence), MODERATE (co-detected with low/nominal signals), LIMITED (single-instrument detection only), or NONE.",
  },
  {
    id: "historical-baseline",
    title: "5. HISTORICAL BASELINE",
    subtitle: "Empirical percentile rank over baseline window",
    color: "#f59e0b",
    detail:
      "Computes the empirical frequency percentile of thermal activity for each cell against all active days in the queried baseline window. Cells exceeding the 90th percentile are flagged as statistical anomalies, highlighting acute regional spikes beyond seasonal baselines.",
  },
  {
    id: "analytical-view",
    title: "6. TERRAFLUX ANALYTICAL VIEW",
    subtitle: "Unified 3D spherical rendering & traceable telemetry",
    color: "#e2e8f0",
    detail:
      "Presents the harmonized analytical layers on a high-precision 3D globe and interactive time-series timeline. Researchers can switch between raw footprints, grid density, agreement levels, and anomaly tiers with full telemetry traceability.",
  },
];

const LIMITATIONS = [
  {
    title: "Thermal Anomalies Are Not Confirmed Ground Fires",
    body: "Spaceborne sensors detect mid-infrared radiometric temperature spikes at pixel scale. While wildfires and agricultural burns are primary sources, industrial flare stacks, steel plants, power stations, and volcanic geothermal vents also generate thermal anomalies.",
  },
  {
    title: "Cloud Cover & Atmospheric Obscuration",
    body: "Heavy cloud cover, dense smoke plumes, and thick aerosol hazes attenuate mid-infrared radiation. An active fire burning underneath thick overcast will not be detected by optical radiometers until cloud cover clears.",
  },
  {
    title: "Sun Glint & Highly Reflective Surfaces",
    body: "Specular reflection of solar radiation off water bodies, solar energy farms, or metal rooftops can occasionally generate false-positive radiometric anomalies during daytime satellite passes.",
  },
  {
    title: "Duplicate Detections Across Overpasses",
    body: "Because polar-orbiting satellites have overlapping orbital swaths toward higher latitudes and observe twice daily (day and night), the same burning location may be cataloged multiple times within a 24-hour cycle.",
  },
  {
    title: "Revisit Gaps & Orbital Cadence",
    body: "Sun-synchronous polar satellites typically provide 2 to 4 overpasses per day per location. Short-duration fires igniting and extinguishing between satellite passes will escape detection.",
  },
  {
    title: "Near-Real-Time Data Latency",
    body: "NASA FIRMS NRT data streams are typically delivered within 1 to 3 hours of orbital downlink. They are optimized for monitoring and scientific research, not immediate tactical first-response dispatch.",
  },
  {
    title: "MODIS Confidence Tier Bucketing",
    body: "MODIS reports detection confidence as a continuous empirical quality score (0–100). TerraFlux buckets this score into three tiers (<30: low, 30–79: nominal, ≥80: high) to enable cross-sensor comparison with VIIRS categorical tiers. This bucketing is an analytical estimate developed by TerraFlux, not an official NASA definition; raw numeric scores are always preserved in the underlying database.",
  },
];

export function MethodologyPage() {
  const [expandedStep, setExpandedStep] = useState<string | null>("spatial-harmonization");

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 font-mono">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-data-blue">
          <Layers className="h-4 w-4" />
          <span>SCIENTIFIC METHODOLOGY & HARMONIZATION</span>
        </div>
        <h1 className="mt-2 font-headline text-3xl font-bold tracking-tight text-text sm:text-4xl">
          From Raw Photons to Harmonized Telemetry
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base">
          How TerraFlux ingests, normalizes, and correlates spaceborne radiometric active fire
          observations from NASA's MODIS and VIIRS satellite instruments into a unified analytical
          framework.
        </p>
      </div>

      {/* SCIENTIFIC SVG PIPELINE DIAGRAM */}
      <section className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-2xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-data-blue">
              ANALYTICAL PIPELINE ARCHITECTURE
            </span>
            <h2 className="font-headline text-lg font-semibold text-text">
              Harmonization Workflow
            </h2>
          </div>
          <span className="text-[10px] text-text-secondary">
            Click any step to inspect technical details
          </span>
        </div>

        {/* Clean Scientific SVG Vector Flow */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[780px]">
            <svg viewBox="0 0 860 160" className="w-full h-auto">
              <defs>
                <linearGradient id="modisGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
                <linearGradient id="viirsGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
              </defs>

              {/* Converging Sensor Lines at the Top */}
              <line
                x1="80"
                y1="40"
                x2="170"
                y2="40"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
              <line
                x1="80"
                y1="120"
                x2="170"
                y2="120"
                stroke="#fb923c"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />

              {/* Convergence Beziers to Step 1 */}
              <path
                d="M 170 40 C 210 40, 210 80, 240 80"
                fill="none"
                stroke="url(#modisGrad)"
                strokeWidth="1.5"
              />
              <path
                d="M 170 120 C 210 120, 210 80, 240 80"
                fill="none"
                stroke="url(#viirsGrad)"
                strokeWidth="1.5"
              />

              {/* Sequential Pipeline Connection Lines */}
              <line x1="330" y1="80" x2="360" y2="80" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="450" y1="80" x2="480" y2="80" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="570" y1="80" x2="600" y2="80" stroke="#fb923c" strokeWidth="1.5" />
              <line x1="690" y1="80" x2="720" y2="80" stroke="#2dd4bf" strokeWidth="1.5" />
              <line x1="810" y1="80" x2="840" y2="80" stroke="#f59e0b" strokeWidth="1.5" />

              {/* MODIS Source Node */}
              <g className="cursor-pointer">
                <rect
                  x="10"
                  y="24"
                  width="70"
                  height="32"
                  rx="4"
                  fill="#0d1e33"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                />
                <text
                  x="45"
                  y="44"
                  fill="#38bdf8"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                  fontFamily="DM Mono"
                >
                  MODIS
                </text>
              </g>

              {/* VIIRS Source Node */}
              <g className="cursor-pointer">
                <rect
                  x="10"
                  y="104"
                  width="70"
                  height="32"
                  rx="4"
                  fill="#2d170a"
                  stroke="#fb923c"
                  strokeWidth="1.2"
                />
                <text
                  x="45"
                  y="124"
                  fill="#fb923c"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                  fontFamily="DM Mono"
                >
                  VIIRS
                </text>
              </g>

              {/* Step Nodes */}
              {PIPELINE_STEPS.slice(0, 5).map((step, i) => {
                const x = 240 + i * 120;
                const isSelected = expandedStep === step.id;
                return (
                  <g
                    key={step.id}
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setExpandedStep(isSelected ? null : step.id)}
                  >
                    <rect
                      x={x}
                      y={48}
                      width="90"
                      height="64"
                      rx="6"
                      fill={isSelected ? "rgba(255,255,255,0.08)" : "#0c1322"}
                      stroke={step.color}
                      strokeWidth={isSelected ? "2" : "1.2"}
                    />
                    <text
                      x={x + 45}
                      y={72}
                      fill={step.color}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="DM Mono"
                    >
                      {step.title.split(". ")[1]}
                    </text>
                    <text
                      x={x + 45}
                      y={92}
                      fill="#91a0b5"
                      fontSize="7.5"
                      textAnchor="middle"
                      fontFamily="DM Mono"
                    >
                      Step 0{i + 1}
                    </text>
                  </g>
                );
              })}

              {/* Step 6: TERRAFLUX ANALYTICAL VIEW Node */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() =>
                  setExpandedStep(expandedStep === "analytical-view" ? null : "analytical-view")
                }
              >
                <rect
                  x="840"
                  y="48"
                  width="18"
                  height="64"
                  rx="4"
                  fill="#1e293b"
                  stroke="#e2e8f0"
                  strokeWidth="1.2"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Step Explanations (Accordion / Expandable Cards) */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PIPELINE_STEPS.map((step) => {
            const isExpanded = expandedStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                className={`cursor-pointer rounded-lg border p-4 transition-all ${
                  isExpanded
                    ? "border-text bg-surface-elevated shadow-lg"
                    : "border-border bg-surface hover:border-text-secondary"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: step.color }}
                  >
                    {step.title}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-text-secondary transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <h3 className="mt-1 font-headline text-sm font-semibold text-text">
                  {step.subtitle}
                </h3>
                {isExpanded && (
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary border-t border-border/50 pt-2 animate-in fade-in duration-200">
                    {step.detail}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* WHAT TERRAFLUX KNOWS / WHAT IT DOES NOT KNOW */}
      <section className="mt-10 border-t border-border pt-8">
        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-widest text-data-blue">
            EPISTEMIC BOUNDARIES
          </span>
          <h2 className="font-headline text-2xl font-bold text-text">
            What TerraFlux Knows vs. What It Does Not Know
          </h2>
          <p className="mt-1 text-xs text-text-secondary">
            Clear boundaries between verified satellite radiometric detections and ground truth.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* WHAT IT KNOWS */}
          <div className="rounded-xl border border-agreement-teal/40 bg-agreement-teal/5 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-agreement-teal">
              <CheckCircle2 className="h-5 w-5" />
              <span>WHAT TERRAFLUX KNOWS (OBSERVABLE)</span>
            </div>
            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-text">
              <li className="flex items-start gap-2">
                <span className="text-agreement-teal font-bold">•</span>
                <span>
                  The exact geographical coordinate and UTC timestamp where a sensor pixel
                  registered elevated mid-infrared thermal radiance.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-agreement-teal font-bold">•</span>
                <span>
                  The sensor instrument (MODIS vs. VIIRS), satellite orbit (Terra, Aqua, Suomi-NPP,
                  NOAA-20), and nominal detector resolution (1,000 m vs. 375 m).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-agreement-teal font-bold">•</span>
                <span>
                  Whether both satellite instruments coincidentally detected anomalies within the
                  same 0.15° spatial cell on the same UTC day (cross-sensor agreement).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-agreement-teal font-bold">•</span>
                <span>
                  Estimated Fire Radiative Power (MW) and brightness temperature (K) as measured at
                  top-of-atmosphere.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-agreement-teal font-bold">•</span>
                <span>
                  How the day's activity ranks historically against stored regional baseline
                  observations (percentile frequency).
                </span>
              </li>
            </ul>
          </div>

          {/* WHAT IT DOES NOT KNOW */}
          <div className="rounded-xl border border-critical-red/40 bg-critical-red/5 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-critical-red">
              <XCircle className="h-5 w-5" />
              <span>WHAT TERRAFLUX DOES NOT KNOW (UNOBSERVABLE)</span>
            </div>
            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-text">
              <li className="flex items-start gap-2">
                <span className="text-critical-red font-bold">•</span>
                <span>
                  Whether an anomaly is a destructive wildfire, a managed agricultural burn, an
                  industrial flare stack, or bare soil solar heating.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-critical-red font-bold">•</span>
                <span>
                  The exact physical perimeter, burn depth, combustion rate, or flame height of a
                  fire on the ground.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-critical-red font-bold">•</span>
                <span>
                  Fire activity that ignited and extinguished between orbital overpass windows, or
                  fires burning beneath cloud obscuration.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-critical-red font-bold">•</span>
                <span>
                  Future fire propagation trajectories, wind-driven spread predictions, or real-time
                  tactical evacuation boundaries.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* RADIOMETRIC LIMITATIONS */}
      <section className="mt-10 border-t border-border pt-8">
        <div className="mb-6 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-thermal-orange" />
          <h2 className="font-headline text-2xl font-bold text-text">
            Known Radiometric Limitations
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {LIMITATIONS.map((lim) => (
            <div key={lim.title} className="rounded-lg border border-border bg-surface p-5">
              <h3 className="font-headline text-sm font-semibold uppercase tracking-wider text-text">
                {lim.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">{lim.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MethodologyPage;
