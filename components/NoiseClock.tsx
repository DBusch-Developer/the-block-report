"use client";

import { useState } from "react";
import { Group } from "@visx/group";
import { Line } from "@visx/shape";
import { scaleLinear } from "@visx/scale";

interface HourData {
  hour: number;
  count: number;
}

interface NoiseClockProps {
  data: HourData[];
  centerStat?: string;
  centerLabel1?: string;
  centerLabel2?: string;
  peakLabel?: string;
  peakSubLabel?: string;
  cliffLabel?: string;
  cliffSubLabel?: string;
  accentColor?: string;
}

const VIEWBOX_W = 700;
const VIEWBOX_H = 660;
const CENTER_X = 350;
const CENTER_Y = 330;
const INNER_R = 70;
const MAX_BAR = 200;
const LATE_NIGHT = new Set([22, 23, 0, 1, 2]);

const hourLabelText = (h: number) => {
  if (h === 0) return "12am";
  if (h < 12) return `${h}am`;
  if (h === 12) return "12pm";
  return `${h - 12}pm`;
};

const ANGLE_LABELS = [
  { h: 0, label: "12am" },
  { h: 3, label: "3am" },
  { h: 6, label: "6am" },
  { h: 9, label: "9am" },
  { h: 12, label: "12pm" },
  { h: 15, label: "3pm" },
  { h: 18, label: "6pm" },
  { h: 21, label: "9pm" },
];

export default function NoiseClock({
  data,
  centerStat = "44%",
  centerLabel1 = "of noise calls",
  centerLabel2 = "10pm — 2am",
  peakLabel = "11pm peak",
  peakSubLabel = "321 calls · loudest hour",
  cliffLabel = "3am cliff",
  cliffSubLabel = "82% drop in one hour",
  accentColor = "#D64A23",
}: NoiseClockProps) {
  const maxCount = Math.max(...data.map((d) => d.count));
  const radiusScale = scaleLinear<number>({
    domain: [0, maxCount],
    range: [0, MAX_BAR],
  });

  // Round to 3 decimals — prevents float precision drift between
  // server-rendered HTML and client React state (hydration mismatch).
  const r = (n: number) => Math.round(n * 1000) / 1000;

  const [hover, setHover] = useState<{
    hour: number;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const bars = data.map(({ hour, count }) => {
    const angleRad = ((hour * 15 - 90) * Math.PI) / 180;
    const scaled = radiusScale(count);
    return {
      hour,
      count,
      ix: r(INNER_R * Math.cos(angleRad)),
      iy: r(INNER_R * Math.sin(angleRad)),
      ox: r((INNER_R + scaled) * Math.cos(angleRad)),
      oy: r((INNER_R + scaled) * Math.sin(angleRad)),
      isLate: LATE_NIGHT.has(hour),
    };
  });

  const peakHour = data.find((d) => d.hour === 23)!;
  const peakAngle = ((23 * 15 - 90) * Math.PI) / 180;
  const peakOuter = INNER_R + radiusScale(peakHour.count);
  const peakX = r(peakOuter * Math.cos(peakAngle));
  const peakY = r(peakOuter * Math.sin(peakAngle));

  const cliffHour = data.find((d) => d.hour === 3)!;
  const cliffAngle = ((3 * 15 - 90) * Math.PI) / 180;
  const cliffOuter = INNER_R + radiusScale(cliffHour.count);
  const cliffX = r(cliffOuter * Math.cos(cliffAngle));
  const cliffY = r(cliffOuter * Math.sin(cliffAngle));

  const handleEnter = (e: React.MouseEvent, hour: number, count: number) => {
    setHover({ hour, count, x: e.clientX, y: e.clientY });
  };

  const handleMove = (e: React.MouseEvent) => {
    if (hover) {
      setHover({ ...hover, x: e.clientX, y: e.clientY });
    }
  };

  const handleLeave = () => setHover(null);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="noiseClockTitle noiseClockDesc"
        style={{ width: "100%", display: "block" }}
      >
        <title id="noiseClockTitle">NYC noise complaints by hour, 2023</title>
        <desc id="noiseClockDesc">
          Radial bar chart of NYC 311 noise complaints across 24 hours.
          Late-night hours from 10pm to 2am are highlighted and account for
          44 percent of complaints. 11pm is the peak at 321 calls. Calls
          drop 82 percent between 2am and 3am.
        </desc>

        <Group left={CENTER_X} top={CENTER_Y}>
          {bars.map(({ hour, count, ix, iy, ox, oy, isLate }) => (
            <g key={hour}>
              <Line
                from={{ x: ix, y: iy }}
                to={{ x: ox, y: oy }}
                stroke={isLate ? accentColor : "#0A0A0A"}
                strokeWidth={13}
                opacity={isLate ? 1 : 0.82}
              />
              {/* invisible thicker hit area for hovering */}
              <Line
                from={{ x: ix, y: iy }}
                to={{ x: ox, y: oy }}
                stroke="transparent"
                strokeWidth={22}
                onMouseEnter={(e) => handleEnter(e, hour, count)}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                style={{ cursor: "pointer" }}
              />
            </g>
          ))}

          {ANGLE_LABELS.map(({ h, label }) => {
            const a = ((h * 15 - 90) * Math.PI) / 180;
            const lx = 290 * Math.cos(a);
            const ly = 290 * Math.sin(a) + 4;
            return (
              <text
                key={label}
                x={lx.toFixed(0)}
                y={ly.toFixed(0)}
                textAnchor="middle"
                fontFamily="var(--font-sans), Helvetica, sans-serif"
                fontSize={12}
                fontWeight={500}
                fill="#0A0A0A"
              >
                {label}
              </text>
            );
          })}

          <text
            x="0"
            y="-4"
            textAnchor="middle"
            fontFamily="var(--font-serif), 'Times New Roman', serif"
            fontSize={44}
            fontWeight={700}
            fill="#0A0A0A"
          >
            {centerStat}
          </text>
          <text
            x="0"
            y="18"
            textAnchor="middle"
            fontFamily="var(--font-sans), Helvetica, sans-serif"
            fontSize={11}
            fontWeight={500}
            fill="#0A0A0A"
          >
            {centerLabel1}
          </text>
          <text
            x="0"
            y="34"
            textAnchor="middle"
            fontFamily="var(--font-sans), Helvetica, sans-serif"
            fontSize={11}
            fontWeight={500}
            fill="#666"
          >
            {centerLabel2}
          </text>

          <Line
            from={{ x: peakX, y: peakY }}
            to={{ x: -160, y: -300 }}
            stroke="#0A0A0A"
            strokeWidth={0.7}
          />
          <circle
            cx={peakX.toFixed(1)}
            cy={peakY.toFixed(1)}
            r={3}
            fill={accentColor}
          />
          <text
            x={-167}
            y={-302}
            textAnchor="end"
            fontFamily="var(--font-sans), Helvetica, sans-serif"
            fontSize={12}
            fontWeight={700}
            fill="#0A0A0A"
          >
            {peakLabel}
          </text>
          <text
            x={-167}
            y={-286}
            textAnchor="end"
            fontFamily="var(--font-sans), Helvetica, sans-serif"
            fontSize={11}
            fontWeight={500}
            fill="#555"
          >
            {peakSubLabel}
          </text>

          <Line
            from={{ x: cliffX, y: cliffY }}
            to={{ x: 200, y: -130 }}
            stroke="#0A0A0A"
            strokeWidth={0.7}
          />
          <circle
            cx={cliffX.toFixed(1)}
            cy={cliffY.toFixed(1)}
            r={3}
            fill="#0A0A0A"
          />
          <text
            x={207}
            y={-132}
            fontFamily="var(--font-sans), Helvetica, sans-serif"
            fontSize={12}
            fontWeight={700}
            fill={accentColor}
          >
            {cliffLabel}
          </text>
          <text
            x={207}
            y={-116}
            fontFamily="var(--font-sans), Helvetica, sans-serif"
            fontSize={11}
            fontWeight={500}
            fill="#555"
          >
            {cliffSubLabel}
          </text>
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
          <div style={{ fontWeight: 600 }}>{hourLabelText(hover.hour)}</div>
          <div style={{ opacity: 0.85 }}>{hover.count} calls</div>
        </div>
      )}
    </div>
  );
}
