# TerraFlux methods

This document describes the behavior implemented in the current source tree.

## Common grid

`src/lib/analyticalGrid.ts` assigns each observation to a regular geodetic cell using the default `GRID_CELL_SIZE` of `0.15` degrees. The indices are `floor(latitude / cellSize)` and `floor(longitude / cellSize)`, with the key `${latIdx}_${lonIdx}`. Cell bounds are the index multiplied by the cell size; the displayed center is the midpoint. The function accepts another cell size for sensitivity calculations.

## Time alignment

The analytical grid groups observations by spatial cell only. Daily comparison rows are produced by the data query and are keyed by the stored acquisition date (`acq_date`). The exact cross-sensor time-window matching rule beyond the stored date is UNCLEAR IN CODE.

## Agreement levels

Agreement is classified per spatial cell over the queried observation set:

- `STRONG`: both sensors have at least one observation and the cell has at least one high-confidence observation, or both sensors have at least two observations.
- `MODERATE`: both sensors have at least one observation, but the strong condition is not met.
- `LIMITED`: only one sensor is present, with nominal/high confidence, and MODIS has at least two or VIIRS at least three observations.
- `NONE`: all other cells.

The implementation labels this as cross-sensor agreement; it does not confirm a ground fire. The current code computes this per cell, not explicitly per cell/day pair. Any separate cell/day denominator for the requested agreement-rate definition is UNCLEAR IN CODE.

## Percentile baseline and anomalies

For the queried observations, cells are sorted by `totalCount`. A cell's percentile is `round(number of cell counts <= its count / number of cells * 100)`. The anomaly threshold is the count at `floor(number of cells * 0.9)` in the sorted list; cells at or above that count are marked anomalous. The displayed baseline window is the requested query range (`startDate → endDate`), not an independently loaded 12-month seasonal baseline. A stored historical observation window beyond the query is UNCLEAR IN CODE.

## MODIS confidence

The source data exposes `confidence_tier` values such as `high` and `nominal`. The analytical grid treats `high` as high confidence and `nominal` or `high` as nominal-or-better. The complete upstream bucketing rule that assigns raw MODIS confidence values to tiers is UNCLEAR IN CODE.

## Stored database tables and columns

The public query layer is implemented in `src/lib/firelens.functions.ts` and Supabase server helpers. The exact live table schema is not declared in this repository's application source; table and column names available to the client query contract are UNCLEAR IN CODE. The observation fields consumed by the UI include sensor, satellite/platform, latitude, longitude, acquisition date/time, resolution, FRP, brightness, confidence tier, and day/night where present.

## Key Findings formulas

- MODIS detections = sum of daily `modis` counts.
- VIIRS detections = sum of daily `viirs` counts.
- VIIRS/MODIS ratio = total VIIRS / total MODIS; display a dash when MODIS is zero.
- Largest gap day = date maximizing `abs(VIIRS - MODIS)`.
- Peak day = date maximizing `MODIS + VIIRS`.
- Busiest month = calendar month with the largest sum of daily MODIS + VIIRS counts.
- Data coverage = first daily date, last daily date, and number of returned daily rows.
- The current findings agreement rate is cells containing both sensors divided by returned grid cells. This differs from the requested cell/day-pair definition; the exact cell/day implementation is UNCLEAR IN CODE.

## Playback

Playback uses the stored acquisition-date range. At date `t`, the visible set is all stored observations with `acq_date <= t`; the UI retains only the trailing three-day window for the animated layer so older points fade out instead of disappearing abruptly. Daily MODIS and VIIRS counts are computed from those stored rows. Playback pauses when the document is hidden and does not auto-start when `prefers-reduced-motion: reduce` is active. `?playback=1` requests autoplay otherwise.

## Permutation chance test

The chance test uses 500 shuffles of the stored MODIS acquisition-date labels while keeping the VIIRS dates fixed. For each shuffle, the selected statistic is recomputed; the reported empirical p-value is `(1 + number of shuffled statistics at least as extreme as observed) / 501`. This is a randomization diagnostic, not a causal probability.

## Overpass clock

Acquisition timestamps are grouped into UTC hour bins (`floor(acq_time / 100)`). Local solar time is approximated as `UTC hour + longitude / 15`, normalized to 0–24 hours. This describes observation timing and is not a local civil-time conversion.

## Evidence strength rule

Evidence is `STRONG` only when both sensors contribute to a cell and either a high-confidence observation is present or each sensor contributes at least two observations. It is `MODERATE` when both sensors are present without the strong condition, `LIMITED` for a one-sensor cell meeting the nominal/high threshold, and `NONE` otherwise. No tier confirms a ground fire.

## Exact NASA FIRMS products

- MODIS: NASA FIRMS MODIS Collection 6.1 NRT active-fire detections, 1 km nominal nadir pixel, from Terra and Aqua.
- VIIRS: NASA FIRMS VIIRS 375 m NRT active-fire detections, from Suomi-NPP and NOAA-20/21 where supplied by the feed.
- TerraFlux stores the FIRMS latitude, longitude, acquisition date/time, FRP, brightness, confidence, satellite, resolution, and day/night fields used by the UI.

## Rendering and sources

Native MODIS observations use hollow rings and VIIRS observations use solid dots. Analytical views use the computed grid cells. NASA FIRMS is the data source; TerraFlux is an independent project and is not an official NASA product.
