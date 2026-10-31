export type SensorGroup = "MODIS" | "VIIRS_SNPP" | "VIIRS_N20";

export interface MonthlyAggregate {
  month: string;
  sensor_group: SensorGroup;
  raw_detections: number;
  burning_cell_days: number;
  days_with_detections: number;
  nrt_share: number;
}

export interface HarmonizedMonth {
  month: string;
  modis: number | null;
  viirsReference: number | null;
  harmonized: number | null;
  errorLow: number | null;
  errorHigh: number | null;
  complete: boolean;
  currentMonth: boolean;
}

export interface HarmonizationResult {
  series: HarmonizedMonth[];
  g: number | null;
  gMonths: string[];
  k: number | null;
  kMonths: string[];
  rSquared: number | null;
  overlapMonths: number;
  typicalErrorPercent: number | null;
  typicalErrorMonths: number;
  rawRatio: number | null;
  viirsStart: string | null;
  enoughOverlap: boolean;
}

function monthKey(value: string) { return `${value.slice(0, 7)}-01`; }
function isComplete(month: string, fromDate: string, toDate: string) {
  const first = `${fromDate.slice(0, 7)}-01`;
  const last = `${toDate.slice(0, 7)}-01`;
  return month !== first && month !== last || fromDate.endsWith("-01") && toDate === new Date(Date.UTC(Number(toDate.slice(0, 4)), Number(toDate.slice(5, 7)), 0)).toISOString().slice(0, 10);
}
function pearsonSquared(xs: number[], ys: number[]) {
  if (xs.length < 2) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  const numerator = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const dx = xs.reduce((s, x) => s + (x - mx) ** 2, 0);
  const dy = ys.reduce((s, y) => s + (y - my) ** 2, 0);
  if (!dx || !dy) return null;
  const r = numerator / Math.sqrt(dx * dy);
  return r * r;
}
function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function buildHarmonizedSeries(rows: MonthlyAggregate[], fromDate: string, toDate: string): HarmonizationResult {
  const byMonth = new Map<string, Partial<Record<SensorGroup, MonthlyAggregate>>>();
  for (const row of rows) byMonth.set(row.month.slice(0, 10), { ...(byMonth.get(row.month.slice(0, 10)) ?? {}), [row.sensor_group]: row });
  const months = [...byMonth.keys()].sort();
  const complete = months.filter((month) => isComplete(month, fromDate, toDate));
  const has = (row: MonthlyAggregate | undefined) => Boolean(row && row.raw_detections > 0);
  const bothViirs = complete.filter((month) => has(byMonth.get(month)?.VIIRS_SNPP) && has(byMonth.get(month)?.VIIRS_N20));
  const gMonths = bothViirs;
  const gDenominator = bothViirs.reduce((sum, month) => sum + (byMonth.get(month)?.VIIRS_N20?.burning_cell_days ?? 0), 0);
  const g = gDenominator ? bothViirs.reduce((sum, month) => sum + (byMonth.get(month)?.VIIRS_SNPP?.burning_cell_days ?? 0), 0) / gDenominator : null;
  const viirsReference = (month: string) => {
    const group = byMonth.get(month);
    if (has(group?.VIIRS_SNPP)) return group?.VIIRS_SNPP?.burning_cell_days ?? 0;
    if (has(group?.VIIRS_N20) && g != null) return (group?.VIIRS_N20?.burning_cell_days ?? 0) * g;
    return null;
  };
  const overlap = complete.filter((month) => has(byMonth.get(month)?.MODIS) && viirsReference(month) != null);
  const modisSum = overlap.reduce((sum, month) => sum + (byMonth.get(month)?.MODIS?.burning_cell_days ?? 0), 0);
  const viirsSum = overlap.reduce((sum, month) => sum + (viirsReference(month) ?? 0), 0);
  const k = modisSum && overlap.length >= 36 ? viirsSum / modisSum : null;
  const xs = overlap.map((month) => byMonth.get(month)?.MODIS?.burning_cell_days ?? 0);
  const ys = overlap.map((month) => viirsReference(month) ?? 0);
  const rSquared = k == null ? null : pearsonSquared(xs, ys);
  const typicalErrors: number[] = [];
  const overlapYears = [...new Set(overlap.map((month) => month.slice(0, 4)))];
  for (const year of overlapYears) {
    const training = overlap.filter((month) => !month.startsWith(year));
    const validation = overlap.filter((month) => month.startsWith(year));
    const denominator = training.reduce((sum, month) => sum + (byMonth.get(month)?.MODIS?.burning_cell_days ?? 0), 0);
    if (!denominator) continue;
    const leaveOutK = training.reduce((sum, month) => sum + (viirsReference(month) ?? 0), 0) / denominator;
    for (const month of validation) {
      const actual = viirsReference(month) ?? 0;
      if (actual === 0) continue;
      const predicted = (byMonth.get(month)?.MODIS?.burning_cell_days ?? 0) * leaveOutK;
      typicalErrors.push(Math.abs(predicted - actual) / actual * 100);
    }
  }
  const typicalErrorPercent = median(typicalErrors);
  const firstViirs = complete.find((month) => viirsReference(month) != null) ?? null;
  const currentMonth = `${toDate.slice(0, 7)}-01`;
  const series = months.map((month) => {
    const group = byMonth.get(month);
    const modis = has(group?.MODIS) ? group?.MODIS?.burning_cell_days ?? null : null;
    const viirs = viirsReference(month);
    const harmonized = k != null && modis != null ? modis * k : viirs;
    return { month, modis, viirsReference: viirs, harmonized, errorLow: harmonized != null && typicalErrorPercent != null ? harmonized * (1 - typicalErrorPercent / 100) : null, errorHigh: harmonized != null && typicalErrorPercent != null ? harmonized * (1 + typicalErrorPercent / 100) : null, complete: complete.includes(month), currentMonth: month === currentMonth };
  });
  const ratioDenominator = overlap.reduce((sum, month) => sum + (byMonth.get(month)?.MODIS?.raw_detections ?? 0), 0);
  const rawRatio = ratioDenominator ? overlap.reduce((sum, month) => sum + (byMonth.get(month)?.VIIRS_SNPP?.raw_detections ?? byMonth.get(month)?.VIIRS_N20?.raw_detections ?? 0), 0) / ratioDenominator : null;
  return { series, g, gMonths, k, kMonths: overlap, rSquared, overlapMonths: overlap.length, typicalErrorPercent, typicalErrorMonths: typicalErrors.length, rawRatio, viirsStart: firstViirs, enoughOverlap: overlap.length >= 36 };
}
