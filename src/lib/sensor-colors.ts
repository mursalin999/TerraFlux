export const SENSOR_COLORS = {
  MODIS: "#4DA3FF",
  VIIRS: "#FF6A2A",
  NEUTRAL: "#C9D4E5",
} as const;

export type SensorKey = keyof typeof SENSOR_COLORS;
