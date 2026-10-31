# TerraFlux monthly sensor harmonization

All chart values come from stored `fire_detections` rows through the `monthly_series` and `daily_series` SQL functions.

- A burning cell-day is a distinct tuple of `(floor(longitude / 0.15), floor(latitude / 0.15), UTC acquisition date)` with at least one detection.
- `g = sum(S-NPP burning cell-days) / sum(NOAA-20 burning cell-days)` across complete months where both groups have stored detections.
- The VIIRS reference uses S-NPP when available; otherwise NOAA-20 multiplied by `g`.
- `k = sum(VIIRS reference burning cell-days) / sum(MODIS burning cell-days)` across complete overlap months. It is only reported when there are at least 36 overlap months.
- Harmonized values use the VIIRS reference whenever it exists. Earlier MODIS-only months use `MODIS burning cell-days × k`.
- Leave-one-year-out error recalculates `k` without each validation year and reports the median absolute percentage error for non-zero VIIRS months.
- `r²` is Pearson correlation squared for monthly MODIS and VIIRS-reference burning cell-days in the overlap.
- Raw-count ratio is `sum(VIIRS raw detections) / sum(MODIS raw detections)` in the overlap. Raw counts are never added across sensors.
- Complete months exclude partial boundary months and the current month, which is shown separately as month-to-date.
