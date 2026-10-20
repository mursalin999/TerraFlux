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

## Rendering and sources

Native MODIS observations use hollow rings and VIIRS observations use solid dots. Analytical views use the computed grid cells. NASA FIRMS is the data source; TerraFlux is an independent project and is not an official NASA product.
