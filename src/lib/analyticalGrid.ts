// Common Analytical Grid & Cross-Sensor Harmonization Engine
// Produces regular geodetic grid cells for multi-sensor aggregation,
// cross-sensor agreement classification, and baseline anomaly detection.

import { type ObservationPoint } from "@/components/EarthGlobe";

export const GRID_CELL_SIZE = 0.15; // ~16.5 km geodetic cell

export type AgreementLevel = "STRONG" | "MODERATE" | "LIMITED" | "NONE";

export interface GridCell {
  id: string;
  lat: number; // Center latitude
  lon: number; // Center longitude
  bounds: {
    west: number;
    south: number;
    east: number;
    north: number;
  };
  modisCount: number;
  viirsCount: number;
  totalCount: number;
  meanFrp: number | null;
  maxBrightness: number | null;
  dayCount: number;
  nightCount: number;
  agreementLevel: AgreementLevel;
  agreementRatio: number; // 0 to 1 scale
  anomalyPercentile: number; // Percentile rank (0 to 100)
  isAnomaly: boolean;
  harmonizedIntensity: number; // 0 to 1 normalized
  observations: ObservationPoint[];
}

export interface GridAnalysisResult {
  cells: GridCell[];
  maxCount: number;
  p80Count: number;
  p90Count: number;
  strongAgreementCount: number;
  moderateAgreementCount: number;
  limitedAgreementCount: number;
  noneAgreementCount: number;
  totalObservations: number;
  baselineWindowLabel: string;
}

export function computeAnalyticalGrid(
  observations: ObservationPoint[],
  startDate: string,
  endDate: string,
  cellSize: number = GRID_CELL_SIZE,
): GridAnalysisResult {
  const cellMap = new Map<string, GridCell>();

  // 1. Group observations into regular geodetic grid cells
  for (const obs of observations) {
    const latIdx = Math.floor(obs.lat / cellSize);
    const lonIdx = Math.floor(obs.lon / cellSize);
    const centerLat = Number((latIdx * cellSize + cellSize / 2).toFixed(4));
    const centerLon = Number((lonIdx * cellSize + cellSize / 2).toFixed(4));
    const id = `${latIdx}_${lonIdx}`;

    let cell = cellMap.get(id);
    if (!cell) {
      cell = {
        id,
        lat: centerLat,
        lon: centerLon,
        bounds: {
          west: Number((lonIdx * cellSize).toFixed(4)),
          south: Number((latIdx * cellSize).toFixed(4)),
          east: Number(((lonIdx + 1) * cellSize).toFixed(4)),
          north: Number(((latIdx + 1) * cellSize).toFixed(4)),
        },
        modisCount: 0,
        viirsCount: 0,
        totalCount: 0,
        meanFrp: null,
        maxBrightness: null,
        dayCount: 0,
        nightCount: 0,
        agreementLevel: "NONE",
        agreementRatio: 0,
        anomalyPercentile: 0,
        isAnomaly: false,
        harmonizedIntensity: 0,
        observations: [],
      };
      cellMap.set(id, cell);
    }

    cell.observations.push(obs);
    if (obs.sensor === "MODIS") {
      cell.modisCount += 1;
    } else {
      cell.viirsCount += 1;
    }
    cell.totalCount += 1;

    if (obs.day_night === "D") cell.dayCount += 1;
    if (obs.day_night === "N") cell.nightCount += 1;

    if (obs.brightness_k != null) {
      cell.maxBrightness = Math.max(cell.maxBrightness ?? 0, obs.brightness_k);
    }
  }

  const cells = Array.from(cellMap.values());
  if (cells.length === 0) {
    return {
      cells: [],
      maxCount: 0,
      p80Count: 0,
      p90Count: 0,
      strongAgreementCount: 0,
      moderateAgreementCount: 0,
      limitedAgreementCount: 0,
      noneAgreementCount: 0,
      totalObservations: 0,
      baselineWindowLabel: `${startDate} → ${endDate}`,
    };
  }

  // 2. Compute Mean FRP and Harmonization Metrics
  let maxCount = 1;
  for (const cell of cells) {
    maxCount = Math.max(maxCount, cell.totalCount);

    const frpVals = cell.observations
      .map((o) => o.frp_mw)
      .filter((v): v is number => v != null && v > 0);
    cell.meanFrp = frpVals.length > 0 ? frpVals.reduce((a, b) => a + b, 0) / frpVals.length : null;

    // Cross-Sensor Agreement Classification:
    // STRONG: Both MODIS and VIIRS detected anomalies in the cell with >= 1 high/nominal tier
    // MODERATE: Both detected with nominal count
    // LIMITED: Single sensor detection only with nominal/high confidence
    // NONE: Low confidence detection or single marginal hit
    const hasModis = cell.modisCount > 0;
    const hasViirs = cell.viirsCount > 0;
    const hasHighConf = cell.observations.some((o) => o.confidence_tier === "high");
    const hasNominalConf = cell.observations.some(
      (o) => o.confidence_tier === "nominal" || o.confidence_tier === "high",
    );

    if (hasModis && hasViirs) {
      if (hasHighConf || (cell.modisCount >= 2 && cell.viirsCount >= 2)) {
        cell.agreementLevel = "STRONG";
        cell.agreementRatio = 1.0;
      } else {
        cell.agreementLevel = "MODERATE";
        cell.agreementRatio = 0.75;
      }
    } else if (hasNominalConf && (cell.modisCount >= 2 || cell.viirsCount >= 3)) {
      cell.agreementLevel = "LIMITED";
      cell.agreementRatio = 0.45;
    } else {
      cell.agreementLevel = "NONE";
      cell.agreementRatio = 0.15;
    }
  }

  // 3. Compute Percentile Ranks for Anomaly Detection
  const sortedCounts = [...cells.map((c) => c.totalCount)].sort((a, b) => a - b);
  const p80Index = Math.floor(sortedCounts.length * 0.8);
  const p90Index = Math.floor(sortedCounts.length * 0.9);
  const p80Count = sortedCounts[p80Index] ?? 1;
  const p90Count = sortedCounts[p90Index] ?? p80Count;

  let strongAgreementCount = 0;
  let moderateAgreementCount = 0;
  let limitedAgreementCount = 0;
  let noneAgreementCount = 0;

  for (const cell of cells) {
    // Percentile rank among observed active cells in the baseline range
    const rank = sortedCounts.filter((c) => c <= cell.totalCount).length;
    cell.anomalyPercentile = Math.round((rank / sortedCounts.length) * 100);
    cell.isAnomaly = cell.totalCount >= p90Count;

    // Derived harmonized intensity (white-to-amber)
    // Weighted for sensor nadir footprint: MODIS (1km) counts weighted 1.15, VIIRS (375m) weighted 0.75
    const weightedScore = cell.modisCount * 1.15 + cell.viirsCount * 0.75;
    cell.harmonizedIntensity = Math.min(1.0, Math.max(0.1, weightedScore / (maxCount * 0.9)));

    if (cell.agreementLevel === "STRONG") strongAgreementCount++;
    else if (cell.agreementLevel === "MODERATE") moderateAgreementCount++;
    else if (cell.agreementLevel === "LIMITED") limitedAgreementCount++;
    else noneAgreementCount++;
  }

  return {
    cells,
    maxCount,
    p80Count,
    p90Count,
    strongAgreementCount,
    moderateAgreementCount,
    limitedAgreementCount,
    noneAgreementCount,
    totalObservations: observations.length,
    baselineWindowLabel: `${startDate} → ${endDate}`,
  };
}

export const AGREEMENT_DEFINITIONS = {
  STRONG: {
    label: "STRONG",
    color: "#56D6C9", // --agreement-teal
    bg: "rgba(86, 214, 201, 0.25)",
    border: "rgba(86, 214, 201, 0.8)",
    criteria:
      "Dual-sensor correspondence: MODIS (1 km) and VIIRS (375 m) both detected anomalies in this cell.",
  },
  MODERATE: {
    label: "MODERATE",
    color: "#56D6C9",
    bg: "rgba(86, 214, 201, 0.18)",
    border: "rgba(86, 214, 201, 0.55)",
    criteria: "Dual-sensor correspondence with nominal confidence across separate overpasses.",
  },
  LIMITED: {
    label: "LIMITED",
    color: "#91A0B5", // --text-secondary
    bg: "rgba(145, 160, 181, 0.15)",
    border: "rgba(145, 160, 181, 0.4)",
    criteria: "Single-sensor detection only. Awaiting cross-sensor overpass confirmation.",
  },
  NONE: {
    label: "NONE",
    color: "#91A0B5",
    bg: "rgba(145, 160, 181, 0.08)",
    border: "rgba(145, 160, 181, 0.25)",
    criteria: "Marginal or low-confidence anomaly without multi-sensor confirmation.",
  },
} as const;

export const AGREEMENT_DISCLAIMER =
  "Cross-sensor agreement indicates correspondence between satellite observations. It does not confirm a ground fire.";
