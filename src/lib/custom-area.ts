export interface Bbox { west: number; south: number; east: number; north: number }

export const QUICK_BBOXES = {
  Bangladesh: { west: 88, south: 20.5, east: 92.7, north: 26.6 },
  Sundarbans: { west: 88.8, south: 21.5, east: 89.9, north: 22.6 },
  "Chattogram hills": { west: 91.6, south: 21.2, east: 92.7, north: 23.8 },
  "Sylhet region": { west: 90.9, south: 24, east: 92.7, north: 25.2 },
  "Dhaka area": { west: 89.9, south: 23.4, east: 90.9, north: 24.4 },
} as const;

export function parseCustomBbox(value: string | null | undefined): Bbox | null {
  if (!value) return null;
  const numbers = value.split(",").map(Number);
  if (numbers.length !== 4 || numbers.some((number) => !Number.isFinite(number))) return null;
  const [west, south, east, north] = numbers;
  if (west! >= east! || south! >= north! || south! < -90 || north! > 90 || west! < -180 || east! > 180) return null;
  if (east! - west! > 10 || north! - south! > 10) return null;
  return { west: west!, south: south!, east: east!, north: north! };
}

export function bboxString(bbox: Bbox) { return [bbox.west, bbox.south, bbox.east, bbox.north].map((value) => Number(value.toFixed(6))).join(","); }
export function bboxCenter(bbox: Bbox): [number, number] { return [(bbox.south + bbox.north) / 2, (bbox.west + bbox.east) / 2]; }
export function bboxAreaError(bbox: Bbox) { if (bbox.east - bbox.west > 10 || bbox.north - bbox.south > 10) return "This area is larger than 10° by 10°. Shrink it to the map center."; if (bbox.east - bbox.west < 0.15 || bbox.north - bbox.south < 0.15) return "This area must be at least 0.15° by 0.15°."; return null; }
export function validateCustomBbox(bbox: Bbox) { if (bbox.south < -90 || bbox.north > 90) return "Latitude must be between -90 and 90."; if (bbox.west < -180 || bbox.east > 180) return "Longitude must be between -180 and 180."; if (bbox.south >= bbox.north) return "South latitude must be less than north latitude."; if (bbox.west >= bbox.east) return "West longitude must be less than east longitude."; return bboxAreaError(bbox); }
