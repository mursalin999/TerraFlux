# Add data-backed dashboard content

## Home

- Keep the existing visual direction and hero, then add a compact “Live Snapshot” fed by stored detection data.
- Show total detections, active sensor count, and preset regions that currently contain stored records.
- Add a restrained three-step flow: NASA FIRMS data → Harmonization → Calendar & insights, with direct links into the product.

## Explore

- Compute confidence-tier and sensor percentages from the currently displayed detections.
- Add a compact summary beside the existing map details, with honest zero-data handling.

## Calendar

- Derive mode-aware monthly and weekday summaries from the current date range.
- Show busiest month, quietest month, and strongest day-of-week pattern beside or below the calendar.

## Compare

- Identify the date with the largest real MODIS/VIIRS count difference in the selected range.
- Expand the existing explanation and include that date and its exact counts when available.

## About & Data

- Add a concise “How This Was Built” disclosure covering AI-assisted planning and code, while stating that displayed fire records remain sourced from NASA FIRMS.

## Technical details

- Add one read-only server query for global snapshot totals; no schema or data-write changes.
- Reuse existing current-range query results for all page-level computations.
- Preserve existing controls, data loading, mobile behavior, typography, colors, and route structure.
- Verify all five pages on desktop and mobile, including empty-data states and current diagnostics.
