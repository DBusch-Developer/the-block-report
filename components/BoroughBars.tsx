"use client";

import { useState } from "react";
import { Bar } from "@visx/shape";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";

interface BoroughData {
  borough: string;
  count: number;
}

interface BoroughBarsProps {
  data: BoroughData[];
  peakBorough?: string;
  accentColor?: string;
  unitLabel?: string;
}

const WIDTH = 720;
const HEIGHT = 200;
const MARGIN = { top: 6, right: 90, bottom: 6, left: 140 };

export default function BoroughBars({
  data,
  peakBorough,
  accentColor = "#D64A23",
  unitLabel = "complaints",
}: BoroughBarsProps) {
  const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
  const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
  const total = data.reduce((s, d) => s + d.count, 0);

  const yScale = scaleBand<string>({
    range: [0, innerHeight],
    domain: data.map((d) => d.borough),
    padding: 0.3,
  });

  const xScale = scaleLinear<number>({
    range: [0, innerWidth],
    domain: [0, Math.max(...data.map((d) => d.count))],
  });

  const [hover, setHover] = useState<{
    borough: string;
    count: number;
    pct: number;
    x: number;
    y: number;
  } | null>(null);

  // Round to prevent float precision drift between SSR and client hydration
  const r = (n: number) => Math.round(n * 1000) / 1000;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Counts by borough"
        style={{ width: "100%", display: "block" }}
      >
        <Group left={MARGIN.left} top={MARGIN.top}>
          {data.map((d) => {
            const barY = r(yScale(d.borough) ?? 0);
            const barHeight = r(yScale.bandwidth());
            const barWidth = r(xScale(d.count));
            const isPeak = d.borough === peakBorough;
            const pct = Math.round((100 * d.count) / total);

            return (
              <g key={d.borough}>
                <text
                  x={-12}
                  y={barY + barHeight / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontFamily="var(--font-sans), Helvetica, sans-serif"
                  fontSize={11}
                  fontWeight={isPeak ? 700 : 500}
                  fill={isPeak ? accentColor : "#0A0A0A"}
                  letterSpacing="0.1em"
                >
                  {d.borough.toUpperCase()}
                </text>
                <line
                  x1={0}
                  y1={barY + barHeight}
                  x2={innerWidth}
                  y2={barY + barHeight}
                  stroke="#0A0A0A"
                  strokeOpacity={0.13}
                  strokeWidth={1}
                />
                <Bar
                  x={0}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={isPeak ? accentColor : "#0A0A0A"}
                  opacity={isPeak ? 1 : 0.85}
                />
                <Bar
                  x={-4}
                  y={barY - 6}
                  width={innerWidth + 8}
                  height={barHeight + 12}
                  fill="transparent"
                  onMouseEnter={(e) =>
                    setHover({
                      borough: d.borough,
                      count: d.count,
                      pct,
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onMouseMove={(e) =>
                    setHover((h) => (h ? { ...h, x: e.clientX, y: e.clientY } : null))
                  }
                  onMouseLeave={() => setHover(null)}
                  style={{ cursor: "pointer" }}
                />
                <text
                  x={innerWidth + 12}
                  y={barY + barHeight / 2}
                  dominantBaseline="middle"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fontSize={13}
                  fill="#555"
                >
                  {d.count} · {pct}%
                </text>
              </g>
            );
          })}
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
          <div style={{ fontWeight: 600 }}>{hover.borough}</div>
          <div style={{ opacity: 0.85 }}>
            {hover.count} {unitLabel} · {hover.pct}%
          </div>
        </div>
      )}
    </div>
  );
}
