import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { SENSOR_META } from "@/lib/regions";

interface DailyRecord {
  date: string;
  modis: number;
  viirs: number;
}

interface CompareChartProps {
  data: DailyRecord[];
}

interface TooltipPayloadItem {
  dataKey?: string | number;
  value?: number;
  name?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const modisVal = Number(payload.find((p) => p.dataKey === "modis")?.value ?? 0);
  const viirsVal = Number(payload.find((p) => p.dataKey === "viirs")?.value ?? 0);
  const delta = Math.abs(modisVal - viirsVal);

  return (
    <div className="rounded-[6px] border border-border bg-surface-elevated p-3 font-mono text-xs text-text shadow-xl">
      <div className="border-b border-border/60 pb-1.5 font-semibold text-text">{label}</div>
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-data-blue">
            <span className="h-2 w-2 rounded-full border border-data-blue" />
            MODIS (1 km):
          </span>
          <span className="font-bold text-text">{modisVal.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-thermal-orange">
            <span className="h-2 w-2 rounded-full bg-thermal-orange" />
            VIIRS (375 m):
          </span>
          <span className="font-bold text-text">{viirsVal.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border/40 pt-1 text-[11px] text-text-secondary">
          <span>DIVERGENCE (Δ):</span>
          <span className="font-semibold text-anomaly-amber">{delta.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function CompareChart({ data }: CompareChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center font-mono text-xs text-text-secondary">
        No daily observation data recorded for this selection.
      </div>
    );
  }

  // Format date ticks for clean readability on axes
  const formattedData = data.map((d) => ({
    ...d,
    shortDate: d.date.length >= 10 ? d.date.slice(5) : d.date,
  }));

  return (
    <div className="h-72 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="modisGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={SENSOR_META.MODIS.color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={SENSOR_META.MODIS.color} stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="viirsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={SENSOR_META.VIIRS.color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={SENSOR_META.VIIRS.color} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(145, 160, 181, 0.12)" strokeDasharray="3 3" />

          <XAxis
            dataKey="shortDate"
            stroke="#91A0B5"
            fontSize={10}
            fontFamily="DM Mono, monospace"
            tickLine={false}
            dy={5}
            interval="preserveStartEnd"
          />

          <YAxis
            stroke="#91A0B5"
            fontSize={10}
            fontFamily="DM Mono, monospace"
            tickLine={false}
            dx={-5}
            allowDecimals={false}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="modis"
            name="MODIS"
            stroke={SENSOR_META.MODIS.color}
            strokeWidth={2}
            fill="url(#modisGrad)"
            activeDot={{ r: 4, stroke: "#030711", strokeWidth: 1 }}
          />

          <Area
            type="monotone"
            dataKey="viirs"
            name="VIIRS"
            stroke={SENSOR_META.VIIRS.color}
            strokeWidth={2}
            fill="url(#viirsGrad)"
            activeDot={{ r: 4, stroke: "#030711", strokeWidth: 1 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
