import { useEffect, useState } from "react";
import { bboxString, parseCustomBbox, type Bbox } from "@/lib/custom-area";

export function useCustomArea(initial: Bbox) {
  const [bbox, setBbox] = useState<Bbox>(() => parseCustomBbox(typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("bbox")) ?? initial);
  useEffect(() => { const params = new URLSearchParams(window.location.search); params.set("bbox", bboxString(bbox)); window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`); }, [bbox]);
  return [bbox, setBbox] as const;
}
