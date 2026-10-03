// GitHub-style contribution heatmap for daily thermal anomaly counts. Browser-safe.
export interface DayCount {
  date: string; // YYYY-MM-DD
  modis: number;
  viirs: number;
}

interface Props {
  days: DayCount[];
  startDate: string;
  endDate: string;
  mode: "combined" | "MODIS" | "VIIRS";
  onSelectDate?: (date: string) => void;
}

function countFor(d: DayCount | undefined, mode: Props["mode"]): number {
  if (!d) return 0;
  if (mode === "MODIS") return d.modis;
  if (mode === "VIIRS") return d.viirs;
  return d.modis + d.viirs;
}

function level(count: number, max: number): number {
  if (count === 0 || max === 0) return 0;
  const r = count / max;
  if (r <= 0.2) return 1;
  if (r <= 0.45) return 2;
  if (r <= 0.7) return 3;
  return 4;
}

export function CalendarHeatmap({ days, startDate, endDate, mode, onSelectDate }: Props) {
  const byDate = new Map(days.map((d) => [d.date, d]));
  const max = Math.max(1, ...days.map((d) => countFor(d, mode)));

  // Recolor the ramp for the dark theme: empty cell = surface, then thermal orange ramp (or blue if MODIS)
  const LEVEL_BG =
    mode === "MODIS"
      ? [
          "bg-surface border border-border/40",
          "bg-data-blue/25 border border-data-blue/30",
          "bg-data-blue/50 border border-data-blue/50",
          "bg-data-blue/75 border border-data-blue/70",
          "bg-data-blue border border-data-blue",
        ]
      : [
          "bg-surface border border-border/40",
          "bg-thermal-orange/25 border border-thermal-orange/30",
          "bg-thermal-orange/50 border border-thermal-orange/50",
          "bg-thermal-orange/75 border border-thermal-orange/70",
          "bg-thermal-orange border border-thermal-orange",
        ];

  // Build week columns starting on the Sunday before startDate.
  const start = new Date(startDate + "T00:00:00Z");
  const end = new Date(endDate + "T00:00:00Z");
  const first = new Date(start);
  first.setUTCDate(first.getUTCDate() - first.getUTCDay());

  const weeks: { date: Date; inRange: boolean }[][] = [];
  const cursor = new Date(first);
  while (cursor <= end) {
    const week: { date: Date; inRange: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      week.push({ date: new Date(cursor), inRange: cursor >= start && cursor <= end });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    weeks.push(week);
  }

  // Month labels with overlap prevention at left edge
  const monthLabels: { label: string; index: number }[] = [];
  let lastMonth = -1;
  let lastIndex = -999;
  weeks.forEach((week, i) => {
    const m = week[0]!.date.getUTCMonth();
    if (m !== lastMonth && week[0]!.date <= end) {
      // Ensure at least 3 week columns (39px+) between labels to avoid "Sep" and "Oct" colliding
      if (i - lastIndex >= 3 || lastIndex === -999) {
        // If it's the very first column and the next month is 1-2 weeks away, prefer the full next month
        const nextMonthInSoon = weeks
          .slice(i + 1, i + 3)
          .some((w) => w[0]!.date.getUTCMonth() !== m);
        if (!(i === 0 && nextMonthInSoon)) {
          monthLabels.push({
            label: week[0]!.date.toLocaleString("en", { month: "short", timeZone: "UTC" }),
            index: i,
          });
          lastIndex = i;
        }
      }
      lastMonth = m;
    }
  });

  return (
    <div className="overflow-x-auto pb-2 font-mono">
      <div className="relative inline-block min-w-max">
        {/* Month labels */}
        <div className="flex h-5 pl-7 text-[10px] text-text-secondary">
          {monthLabels.map((m) => (
            <span
              key={`${m.label}-${m.index}`}
              className="absolute uppercase"
              style={{ left: `${m.index * 13 + 28}px` }}
            >
              {m.label}
            </span>
          ))}
        </div>

        <div className="flex gap-1">
          {/* Day-of-week labels */}
          <div className="grid grid-rows-7 gap-1 pr-1 text-[9px] text-text-secondary/70">
            <span className="h-2.5" />
            <span className="h-2.5 leading-none">M</span>
            <span className="h-2.5" />
            <span className="h-2.5 leading-none">W</span>
            <span className="h-2.5" />
            <span className="h-2.5 leading-none">F</span>
            <span className="h-2.5" />
          </div>

          {/* Grid of week columns */}
          <div className="flex gap-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-rows-7 gap-1">
                {week.map((d, di) => {
                  const iso = d.date.toISOString().slice(0, 10);
                  const entry = byDate.get(iso);
                  const count = countFor(entry, mode);
                  const lev = d.inRange ? level(count, max) : 0;
                  const isClickable = Boolean(d.inRange && count > 0 && onSelectDate);
                  return (
                    <div
                      key={di}
                      title={`${iso}: ${count.toLocaleString()} observations (${entry ? `MODIS: ${entry.modis}, VIIRS: ${entry.viirs}` : "none stored"})`}
                      onClick={() => isClickable && onSelectDate?.(iso)}
                      role={isClickable ? "button" : undefined}
                      tabIndex={isClickable ? 0 : undefined}
                      className={`h-2.5 w-2.5 rounded-[2px] transition-colors ${
                        d.inRange ? LEVEL_BG[lev] : "bg-surface opacity-20 border border-border/20"
                      } ${isClickable ? "cursor-pointer hover:ring-1 hover:ring-text" : ""}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between text-[10px] text-text-secondary">
          <span className="uppercase">
            MAX DAILY DENSITY: <strong className="text-text">{max.toLocaleString()}</strong>
          </span>
          <div className="flex items-center gap-1.5">
            <span>LESS</span>
            {LEVEL_BG.map((bg, i) => (
              <span key={i} className={`h-2.5 w-2.5 rounded-[2px] ${bg}`} />
            ))}
            <span>MORE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
