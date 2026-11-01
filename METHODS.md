# TerraFlux methods

All named products, platforms, processing modes, coverage ranges, overlap months, k, g, r², sample counts, and typical error values shown in the application must come from stored query results. This document describes the transformations, not a second source of numeric truth.

## Data and limits

TerraFlux preserves NASA FIRMS detections and does not turn them into confirmed fires. Cloud, smoke, overpass timing, short-lived or small fires, industrial heat, agricultural heat, and other thermal sources affect what is observed. Values before the VIIRS overlap are estimates produced by the MODIS-to-VIIRS bridge.

## Monthly comparison

The app compares month-to-date UTC detections with the stored historical median and percentile labels. A zero means no detections in the selected stored data, which is not proof of no fire and not proof of no observation. MODIS confidence buckets are a TerraFlux estimate, not an official NASA definition.

## Export columns

Detection exports preserve sensor, platform, product, processing, UTC date/time, location, brightness, FRP, native confidence, derived confidence bucket, day/night, and derived grid fields.

All chart values come from stored `fire_detections` rows through the `monthly_series` and `daily_series` SQL functions.

- A burning cell-day is a distinct tuple of `(floor(longitude / 0.15), floor(latitude / 0.15), UTC acquisition date)` with at least one detection.
- `g = sum(S-NPP burning cell-days) / sum(NOAA-20 burning cell-days)` across complete months where both groups have stored detections.
- The VIIRS reference uses S-NPP when available; otherwise NOAA-20 multiplied by `g`.
- `k = sum(VIIRS reference burning cell-days) / sum(MODIS burning cell-days)` across complete overlap months. It is only reported when there are at least 36 overlap months.
- Harmonized values use `MODIS burning cell-days × k` whenever MODIS exists, including months where VIIRS is also present. This keeps the bridge auditable: a tooltip can always be checked with the displayed MODIS value and k. VIIRS-only months use the VIIRS reference directly.
- Leave-one-year-out error recalculates `k` without each validation year and reports the median absolute percentage error for non-zero VIIRS months.
- `r²` is Pearson correlation squared for monthly MODIS and VIIRS-reference burning cell-days in the overlap.
- Raw-count ratio is `sum(VIIRS raw detections) / sum(MODIS raw detections)` in the overlap. Raw counts are never added across sensors.
- Complete months exclude partial boundary months and the current month, which is shown separately as month-to-date.
