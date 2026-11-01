import { REGIONS, parseBbox } from "./src/lib/regions";
import { fetchAndHarmonize, upsertDetections } from "./src/lib/firms.server";

const end = new Date();
const start = new Date(end);
start.setUTCFullYear(start.getUTCFullYear() - 1);
const iso = (date: Date) => date.toISOString().slice(0, 10);
const dates: string[] = [];
for (const cursor = new Date(`${iso(start)}T00:00:00Z`); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 10)) dates.push(iso(cursor));
const results: Array<{ region: string; stored: number; errors: string[] }> = [];
for (const region of REGIONS.filter((item) => item.id !== "bangladesh")) {
  const { west, south, east, north } = parseBbox(region.bbox);
  let stored = 0;
  const errors: string[] = [];
  for (let tileWest = west; tileWest < east; tileWest += 10) {
    for (let tileSouth = south; tileSouth < north; tileSouth += 10) {
      const tile = `${tileWest},${tileSouth},${Math.min(tileWest + 10, east)},${Math.min(tileSouth + 10, north)}`;
      for (const date of dates) {
        try {
          stored += await upsertDetections(await fetchAndHarmonize({ bbox: tile, days: 10, date }));
        } catch (error) {
          errors.push(`${tile} ${date}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
  }
  results.push({ region: region.name, stored, errors });
  console.log(JSON.stringify(results.at(-1)));
}
console.log(JSON.stringify({ start: iso(start), end: iso(end), results }));
