import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface PlaybackControlsProps {
  dates: string[];
  detections: Array<{ acq_date: string; sensor: "MODIS" | "VIIRS" }>;
  onDateChange: (date: string) => void;
}

export function PlaybackControls({ dates, detections, onDateChange }: PlaybackControlsProps) {
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  const [playing, setPlaying] = useState(false);
  const currentDate = dates[index] ?? dates[dates.length - 1] ?? "—";

  const counts = useMemo(() => {
    const visible = detections.filter((item) => item.acq_date <= currentDate);
    return {
      modis: visible.filter((item) => item.sensor === "MODIS").length,
      viirs: visible.filter((item) => item.sensor === "VIIRS").length,
      total: visible.length,
    };
  }, [currentDate, detections]);

  useEffect(() => {
    if (currentDate !== "—") onDateChange(currentDate);
  }, [currentDate, onDateChange]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (query.get("playback") === "1" && !reduce) setPlaying(true);
    const onVisibility = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!playing || dates.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((value) => {
        if (value >= dates.length - 1) {
          setPlaying(false);
          return value;
        }
        return value + 1;
      });
    }, 1200 / speed);
    return () => window.clearInterval(timer);
  }, [dates.length, playing, speed]);

  if (!dates.length) return null;
  return (
    <section className="rounded border border-border bg-surface/90 p-3 font-mono" aria-label="Playback controls">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setPlaying((value) => !value)} className="inline-flex min-h-10 items-center gap-2 rounded border border-agreement-teal px-3 text-[11px] text-agreement-teal">
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {playing ? "PAUSE" : "PLAY"}
        </button>
        <div className="flex items-center gap-1" aria-label="Playback speed">
          {[1, 2, 4].map((value) => (
            <button key={value} type="button" aria-pressed={speed === value} onClick={() => setSpeed(value as 1 | 2 | 4)} className={`min-h-9 rounded border px-2 text-[10px] ${speed === value ? "border-data-blue bg-data-blue/15 text-data-blue" : "border-border text-text-secondary"}`}>
              {value}x
            </button>
          ))}
        </div>
        <output className="text-[11px] text-text">{currentDate} · MODIS {counts.modis} · VIIRS {counts.viirs}</output>
        <span className="text-[10px] text-text-secondary">TOTAL SO FAR {counts.total}</span>
      </div>
      <input className="mt-3 w-full accent-[var(--data-blue)]" type="range" min={0} max={Math.max(0, dates.length - 1)} value={index} onChange={(event) => { setIndex(Number(event.target.value)); setPlaying(false); }} aria-label="Playback date" />
    </section>
  );
}
