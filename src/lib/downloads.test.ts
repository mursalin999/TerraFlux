import { strict as assert } from "node:assert";
import test from "node:test";
import Papa from "papaparse";
import { canDownloadDetections, toCsv } from "./downloads.ts";

test("builds RFC 4180 CSV with commas, quotes, and empty values", () => {
  const csv = toCsv(["name", "note", "empty"], [{ name: "A, B", note: 'said "hello"', empty: "" }, { name: "plain", note: "line", empty: "" }]);
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true }).data;
  assert.deepEqual(parsed, [{ name: "A, B", note: 'said "hello"', empty: "" }, { name: "plain", note: "line", empty: "" }]);
  assert.match(csv, /\r\n/);
});

test("requires file rows to equal the on-screen count", () => {
  assert.equal(canDownloadDetections(5, 5), true);
  assert.equal(canDownloadDetections(5, 4), false);
});

test("zero rows cannot enable the detections download", () => {
  assert.equal(canDownloadDetections(0, 0), false);
});
