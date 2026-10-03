import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Methodology, Data & Scientific Limitations — TerraFlux" },
      {
        name: "description",
        content:
          "Scientific methodology, sensor specifications, harmonization logic, and radiometric limitations of TerraFlux for NASA FIRMS MODIS and VIIRS observations.",
      },
      { property: "og:title", content: "Methodology, Data & Scientific Limitations — TerraFlux" },
      {
        property: "og:description",
        content:
          "TerraFlux data provenance, harmonization principles, and known radiometric limitations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

export default function About() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <div className="font-mono text-xs uppercase tracking-wider text-data-blue">
          DOCUMENTATION & PROVENANCE
        </div>
        <h1 className="mt-2 font-headline text-3xl font-semibold tracking-tight text-text sm:text-4xl">
          Methodology & Scientific Limitations
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
          TerraFlux is an independent scientific observation instrument created by Team Emberline
          for the NASA Space Apps Challenge 2026 challenge “Harmonization of MODIS and VIIRS Hot
          Spots.” It is NOT an official NASA product and does not represent official agency
          reporting.
        </p>

        <section className="mt-10 space-y-4 border-t border-border pt-8">
          <h2 className="font-headline text-xl font-semibold text-text">What You Are Looking At</h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            Every point on the 3D globe and every calendar cell represents a{" "}
            <strong className="text-text">satellite-detected thermal anomaly</strong> — a sensor
            pixel where mid-infrared radiometric energy was statistically elevated above the
            surrounding background surface temperature during satellite overpass.
          </p>
          <div className="rounded border border-border bg-surface-elevated p-3.5 font-mono text-xs text-text">
            <strong className="text-thermal-orange">CRITICAL DISTINCTION:</strong> Satellite thermal
            anomalies are NOT confirmed ground fires. Industrial flare stacks, steel foundries, bare
            agricultural soil reflection, and gas vents can also trigger radiometric anomalies.
            Cross-sensor agreement indicates spatial-temporal correspondence between observations,
            but does not confirm a ground fire.
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">
            Data is ingested directly from the NASA FIRMS (Fire Information for Resource Management
            System) API, querying the MODIS NRT and VIIRS NOAA-20 NRT near-real-time observation
            streams.
          </p>
        </section>

        <section className="mt-10 space-y-4 border-t border-border pt-8">
          <h2 className="font-headline text-xl font-semibold text-text">The Two Sensor Systems</h2>
          <dl className="space-y-6 text-sm leading-relaxed">
            <div className="rounded border border-border bg-surface p-4">
              <dt className="flex items-center gap-2 font-mono text-sm font-semibold uppercase text-data-blue">
                <span className="h-2.5 w-2.5 rounded-full border border-data-blue bg-transparent" />
                MODIS — 1,000 m Nadir Resolution
              </dt>
              <dd className="mt-2 text-text-secondary">
                Flown on Terra (EOS AM-1, 10:30 local equator crossing) and Aqua (EOS PM-1, 13:30
                local equator crossing). MODIS reports an empirical detection confidence score
                between 0 and 100. TerraFlux harmonizes this continuous score into three tiered
                bands (&lt;30: low, 30–79: nominal, ≥80: high) for comparative analysis. This
                categorization is an analytical convenience and not an official NASA threshold; the
                raw numeric score is always preserved in the record.
              </dd>
            </div>

            <div className="rounded border border-border bg-surface p-4">
              <dt className="flex items-center gap-2 font-mono text-sm font-semibold uppercase text-thermal-orange">
                <span className="h-2.5 w-2.5 rounded-full bg-thermal-orange" />
                VIIRS — 375 m I-Band Resolution
              </dt>
              <dd className="mt-2 text-text-secondary">
                Flown on the Joint Polar Satellite System (Suomi NPP, NOAA-20, NOAA-21, 13:30 local
                equator crossing). VIIRS utilizes high-spatial-resolution imagery channels (I-band
                375 m) to resolve thermal anomalies with greater perimeter accuracy and sensitivity
                to low-intensity thermal sources. VIIRS outputs categorical confidence tiers
                directly (low, nominal, high).
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-10 space-y-4 border-t border-border pt-8">
          <h2 className="font-headline text-xl font-semibold text-text">
            Known Radiometric Limitations
          </h2>
          <ul className="list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-text-secondary">
            <li>
              <strong className="text-text">Cloud & Smoke Attenuation:</strong> Thick cloud cover
              and dense convective smoke plumes attenuate middle and thermal infrared radiance,
              concealing surface anomalies. An absence of detections does not guarantee an absence
              of heat.
            </li>
            <li>
              <strong className="text-text">Solar Glint:</strong> Direct reflection of sunlight off
              smooth water bodies or reflective terrain can elevate shortwave and mid-infrared
              signals, potentially generating low-confidence false anomaly triggers.
            </li>
            <li>
              <strong className="text-text">Pixel Footprint Growth:</strong> As scan angles increase
              away from satellite nadir towards swath edges, MODIS pixels distort and expand
              (bow-tie effect), increasing the geographic area covered by an anomaly marker.
            </li>
            <li>
              <strong className="text-text">Temporal Sampling Gaps:</strong> Polar-orbiting
              spacecraft sample an equatorial coordinate only 2 to 4 times per 24-hour cycle. Rapid
              or diurnal thermal events occurring between overpasses are omitted.
            </li>
            <li>
              <strong className="text-text">Near-Real-Time Latency:</strong> NRT products prioritize
              rapid delivery over definitive calibration. Definitive science-quality data may
              feature slight reprocessing differences.
            </li>
          </ul>
        </section>

        <div className="mt-12 border-t border-border pt-6 font-mono text-xs text-text-secondary">
          <div>DATA SOURCE: NASA FIRMS (firms.modaps.eosdis.nasa.gov)</div>
          <div className="mt-1">BUILT FOR: NASA SPACE APPS CHALLENGE 2026</div>
          <div className="mt-1 text-text-secondary/70">
            TerraFlux strictly presents stored observations without fabrication. If a field or
            region has no data stored, "Not available" is displayed.
          </div>
        </div>
      </div>
    </div>
  );
}
