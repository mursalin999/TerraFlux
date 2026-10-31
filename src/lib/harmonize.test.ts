import { strict as assert } from "node:assert";
import test from "node:test";
import { buildHarmonizedSeries, type MonthlyAggregate } from "./harmonize.ts";

function row(month: string, sensor_group: MonthlyAggregate["sensor_group"], cells: number, raw = cells): MonthlyAggregate {
  return { month, sensor_group, raw_detections: raw, burning_cell_days: cells, days_with_detections: 10, nrt_share: 0 };
}

test("uses S-NPP directly and scales NOAA-20 with g", () => {
  const rows = [row("2020-02-01", "VIIRS_SNPP", 20), row("2020-02-01", "VIIRS_N20", 10), row("2020-03-01", "VIIRS_N20", 10)];
  const result = buildHarmonizedSeries(rows, "2020-01-01", "2020-04-30");
  assert.equal(result.g, 2);
  assert.equal(result.series.find((item) => item.month === "2020-03-01")?.viirsReference, 20);
});

test("refuses to create a bridge with fewer than 36 overlap months", () => {
  const rows = Array.from({ length: 12 }, (_, index) => { const month = `2020-${String(index + 1).padStart(2, "0")}-01`; return [row(month, "MODIS", 10), row(month, "VIIRS_SNPP", 20)].flat(); }).flat();
  assert.equal(buildHarmonizedSeries(rows, "2020-01-01", "2021-01-01").k, null);
});
