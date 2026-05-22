"use client";

import { useState } from "react";
import { Bar } from "@visx/shape";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";

interface MonthData {
  month: number;
  count: number;
}

interface MonthlyBarsProps {
  data: MonthData[];
  peakMonth?: number;
  troughMonth?: number;
  accentColor?: string;
  caption?: string;
  unitLabel?: string;
}

const MONTH_ABBREV = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const MONTH_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WIDTH = 760;
const HEIGHT = 300;
const MARGIN = { top: 30, right: 16, bottom: 64, left: 16 };

export default function MonthlyBars({
  data,
  peakMonth,
  troughMonth,
  accentColor = "#B57333",
  caption,
  unitLabel = "complaints",
}: MonthlyBarsProps) {
  const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
  const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

  const xScale = scaleBand<number>({
    range: [0, innerWidth],
    domain: data.map((d) => d.month),
    padding: 0.2,
  });

  const yScale = scaleLinear<number>({
    range: [innerHeight, 0],
    domain: [0, Math.max(...data.map((d) => d.count))],
    nice: true,
  });

  const [hover, setHover] = useState<{
    month: number;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Monthly count chart: peak ${peakMonth ? MONTH_FULL[peakMonth - 1] : ""}, trough ${troughMonth ? MONTH_FULL[troughMonth - 1] : ""}`}
        style={{ width: "100%", display: "block" }}
      >
        <Group left={MARGIN.left} top={MARGIN.top}>
          <line
            x1={0}
            y1={innerHeight}
            x2={innerWidth}
            y2={innerHeight}
            stroke="#0A0A0A"
            strokeWidth={1}
          />

          {data.map((d) => {
            const barX = xScale(d.month) ?? 0;
            const barWidth = xScale.bandwidth();
            const barY = yScale(d.count);
            const barHeight = innerHeight - barY;
            const isPeak = d.month === peakMonth;
            const isTrough = d.month === troughMonth;

            return (
              <g key={d.month}>
                <Bar
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={isPeak ? accentColor : "#0A0A0A"}
                  opacity={isPeak ? 1 : 0.86}
                />
                {/* hit area */}
                <Bar
                  x={barX - 4}
                  y={0}
                  width={barWidth + 8}
                  height={innerHeight}
                  fill="transparent"
                  onMouseEnter={(e) =>
                    setHover({ month: d.month, count: d.count, x: e.clientX, y: e.clientY })
                  }
                  onMouseMove={(e) =>
                    setHover((h) => (h ? { ...h, x: e.clientX, y: e.clientY } : null))
                  }
                  onMouseLeave={() => setHover(null)}
                  style={{ cursor: "pointer" }}
                />
                <text
                  x={barX + barWidth / 2}
                  y={barY - 8}
                  textAnchor="middle"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fontSize={12}
                  fontWeight={500}
                  fill={isPeak ? accentColor : isTrough ? "#0A0A0A" : "#555"}
                >
                  {d.count}
                </text>
                <text
                  x={barX + barWidth / 2}
                  y={innerHeight + 22}
                  textAnchor="middle"
                  fontFamily="var(--font-sans), Helvetica, sans-serif"
                  fontSize={11}
                  fontWeight={isPeak ? 700 : 500}
                  fill={isPeak ? accentColor : "#0A0A0A"}
                  letterSpacing="0.1em"
                >
                  {MONTH_ABBREV[d.month - 1].toUpperCase()}
                </text>
              </g>
            );
          })}

          {caption && (
            <text
              x={innerWidth / 2}
              y={innerHeight + 50}
              textAnchor="middle"
              fontFamily="var(--font-sans), Helvetica, sans-serif"
              fontSize={11}
              fill="#555"
              letterSpacing="0.1em"
            >
              {caption}
            </text>
          )}
        </Group>
      </svg>

      {hover && (
        <div
          style={{
            position: "fixed",
            left: hover.x + 14,
            top: hover.y + 14,
            background: "var(--ink)",
            color: "var(--paper)",
            padding: "8px 12px",
            borderRadius: 4,
            fontSize: 12,
            lineHeight: 1.4,
            pointerEvents: "none",
            zIndex: 1000,
            fontFamily: "var(--font-sans), Helvetica, sans-serif",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ fontWeight: 600 }}>{MONTH_FULL[hover.month - 1]}</div>
          <div style={{ opacity: 0.85 }}>
            {hover.count} {unitLabel}
          </div>
        </div>
      )}
    </div>
  );
}
