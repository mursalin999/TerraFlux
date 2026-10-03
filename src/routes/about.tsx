import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, ShieldAlert, Cpu, Award, Globe2 } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TerraFlux — Team Emberline" },
      {
        name: "description",
        content:
          "About TerraFlux, created by Team Emberline (Mymensingh, Bangladesh) for the NASA Space Apps Challenge 2026.",
      },
      { property: "og:title", content: "About TerraFlux — Team Emberline" },
      {
        property: "og:description",
        content:
          "NASA Space Apps Challenge 2026 project: Harmonization of MODIS and VIIRS Hot Spots.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AboutPage,
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-3xl">
        {/* Header Badge */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-data-blue">
          <Globe2 className="h-4 w-4" />
          <span>PROVENANCE & PROJECT BACKGROUND</span>
        </div>

        <h1 className="mt-2 font-headline text-3xl font-bold tracking-tight text-text sm:text-4xl">
          About TerraFlux
        </h1>

        <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
          TerraFlux is an interactive satellite observation analysis instrument developed by{" "}
          <strong className="text-text font-semibold">Team Emberline</strong> based in{" "}
          <strong className="text-text font-semibold">Mymensingh, Bangladesh</strong> for the{" "}
          <span className="text-anomaly-amber font-semibold">NASA Space Apps Challenge 2026</span>.
        </p>

        {/* Independence Disclaimer Banner */}
        <div className="mt-6 rounded-lg border border-border/80 bg-surface-elevated/70 p-4 text-xs leading-relaxed text-text shadow-sm">
          <div className="flex items-center gap-2 font-semibold uppercase tracking-wider text-anomaly-amber">
            <ShieldAlert className="h-4 w-4" />
            <span>INDEPENDENCE & DISCLAIMER NOTICE</span>
          </div>
          <p className="mt-2 text-text-secondary">
            TerraFlux is an independent participant project created for the NASA Space Apps
            Challenge and is <strong className="text-text">not an official NASA product</strong>.
            The designations employed and presentation of satellite data do not imply the expression
            of any opinion whatsoever on the part of NASA, the United States Government, or any
            participating space agency.
          </p>
        </div>

        {/* Project Metadata Grid */}
        <section className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-4">
            <span className="text-[10px] uppercase tracking-wider text-text-secondary">
              CHALLENGE
            </span>
            <div className="mt-1 font-headline text-base font-semibold text-text">
              NASA Space Apps Challenge 2026
            </div>
            <div className="mt-0.5 text-xs text-text-secondary">
              Theme: Harmonization of MODIS & VIIRS Hot Spots
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <span className="text-[10px] uppercase tracking-wider text-text-secondary">
              TEAM & LOCATION
            </span>
            <div className="mt-1 font-headline text-base font-semibold text-text">
              Team Emberline
            </div>
            <div className="mt-0.5 text-xs text-text-secondary">Mymensingh, Bangladesh</div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 sm:col-span-2">
            <span className="text-[10px] uppercase tracking-wider text-text-secondary">
              PRIMARY DATA SOURCE
            </span>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-headline text-base font-semibold text-text">
                NASA FIRMS (Fire Information for Resource Management System)
              </span>
              <a
                href="https://firms.modaps.eosdis.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-data-blue hover:underline"
              >
                <span>firms.modaps.eosdis.nasa.gov</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="mt-1 text-xs text-text-secondary">
              Real-time and historical MODIS NRT (Terra & Aqua) and VIIRS NRT (Suomi-NPP & NOAA-20)
              calibrated sensor streams.
            </p>
          </div>
        </section>

        {/* AI-Assisted Development Disclosure */}
        <section className="mt-8 rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-data-blue">
            <Cpu className="h-4 w-4" />
            <span>AI-ASSISTED DEVELOPMENT DISCLOSURE</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-text-secondary">
            In compliance with NASA Space Apps Challenge competition guidelines, we disclose that
            generative AI coding assistants (including Claude and Gemini) were used during the
            hackathon to accelerate scaffolding, boilerplate generation, and scientific UI design.
            All mathematical harmonization logic, cross-sensor agreement criteria, and data
            provenance pipelines were directed, validated, and tested by Team Emberline.
          </p>
        </section>

        {/* Scientific Integrity Principle */}
        <section className="mt-8 border-t border-border pt-6 text-xs leading-relaxed text-text-secondary">
          <h2 className="font-headline text-sm font-semibold uppercase tracking-wider text-text">
            Scientific Integrity Principles
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-4">
            <li>
              <strong className="text-text">Zero Fabrication:</strong> TerraFlux never generates,
              interpolates, or guesses active thermal observations. If a region or interval contains
              no satellite records, it is displayed as "Not available".
            </li>
            <li>
              <strong className="text-text">Direct Ingestion Traceability:</strong> Every point on
              the globe links back to its verified NASA FIRMS satellite telemetry, acquisition UTC
              time, and native sensor resolution.
            </li>
            <li>
              <strong className="text-text">Clear Categorization:</strong> Satellite thermal
              observations are distinct from ground fire perimeters. We maintain this scientific
              distinction across every dashboard and telemetry panel.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
