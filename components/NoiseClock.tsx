interface HourData {
  hour: number;
  count: number;
}

interface NoiseClockProps {
  data: HourData[];
  peakLabel?: string;
  peakSubLabel?: string;
  cliffLabel?: string;
  cliffSubLabel?: string;
  centerStat?: string;
  centerLabel1?: string;
  centerLabel2?: string;
  accentColor?: string;
}

export default function NoiseClock({
  data,
  peakLabel = "11pm peak",
  peakSubLabel = "321 calls · loudest hour",
  cliffLabel = "3am cliff",
  cliffSubLabel = "82% drop in one hour",
  centerStat = "44%",
  centerLabel1 = "of noise calls",
  centerLabel2 = "10pm — 2am",
  accentColor = "#D64A23",
}: NoiseClockProps) {
  const innerR = 70;
  const maxBar = 200;
  const maxCount = Math.max(...data.map((d) => d.count));
  const lateNight = new Set([22, 23, 0, 1, 2]);

  const bars = data.map(({ hour, count }) => {
    const angleRad = ((hour * 15 - 90) * Math.PI) / 180;
    const scaled = (count / maxCount) * maxBar;
    return {
      hour,
      ix: innerR * Math.cos(angleRad),
      iy: innerR * Math.sin(angleRad),
      ox: (innerR + scaled) * Math.cos(angleRad),
      oy: (innerR + scaled) * Math.sin(angleRad),
      isLate: lateNight.has(hour),
    };
  });

  const hourLabels = [
    { h: 0, label: "12am" },
    { h: 3, label: "3am" },
    { h: 6, label: "6am" },
    { h: 9, label: "9am" },
    { h: 12, label: "12pm" },
    { h: 15, label: "3pm" },
    { h: 18, label: "6pm" },
    { h: 21, label: "9pm" },
  ].map(({ h, label }) => {
    const angleRad = ((h * 15 - 90) * Math.PI) / 180;
    return {
      x: 290 * Math.cos(angleRad),
      y: 290 * Math.sin(angleRad) + 4,
      label,
    };
  });

  const peakHour = data.find((d) => d.hour === 23)!;
  const peakAngle = ((23 * 15 - 90) * Math.PI) / 180;
  const peakOuter = innerR + (peakHour.count / maxCount) * maxBar;
  const peakX = peakOuter * Math.cos(peakAngle);
  const peakY = peakOuter * Math.sin(peakAngle);

  const cliffHour = data.find((d) => d.hour === 3)!;
  const cliffAngle = ((3 * 15 - 90) * Math.PI) / 180;
  const cliffOuter = innerR + (cliffHour.count / maxCount) * maxBar;
  const cliffX = cliffOuter * Math.cos(cliffAngle);
  const cliffY = cliffOuter * Math.sin(cliffAngle);

  return (
    <svg
      viewBox="0 0 700 660"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="noiseClockTitle noiseClockDesc"
      style={{ width: "100%", display: "block" }}
    >
      <title id="noiseClockTitle">NYC noise complaints by hour, 2023</title>
      <desc id="noiseClockDesc">
        Radial bar chart of NYC 311 noise complaints distributed across 24 hours.
        Late-night hours from 10pm to 2am are highlighted in cinnabar and account
        for 44 percent of all complaints. 11pm is the peak at 321 calls. Calls
        drop 82 percent between 2am and 3am.
      </desc>
      <g transform="translate(350, 330)">
        {bars.map(({ hour, ix, iy, ox, oy, isLate }) => (
          <line
            key={hour}
            x1={ix.toFixed(1)}
            y1={iy.toFixed(1)}
            x2={ox.toFixed(1)}
            y2={oy.toFixed(1)}
            stroke={isLate ? accentColor : "#0A0A0A"}
            strokeWidth={13}
            opacity={isLate ? 1 : 0.82}
          />
        ))}
        {hourLabels.map(({ x, y, label }) => (
          <text
            key={label}
            x={x.toFixed(0)}
            y={y.toFixed(0)}
            textAnchor="middle"
            fontFamily="var(--font-sans), Helvetica, sans-serif"
            fontSize={12}
            fontWeight={500}
            fill="#0A0A0A"
          >
            {label}
          </text>
        ))}
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
        <line
          x1={peakX.toFixed(1)}
          y1={peakY.toFixed(1)}
          x2={-160}
          y2={-300}
          stroke="#0A0A0A"
          strokeWidth={0.7}
        />
        <circle cx={peakX.toFixed(1)} cy={peakY.toFixed(1)} r={3} fill={accentColor} />
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
        <line
          x1={cliffX.toFixed(1)}
          y1={cliffY.toFixed(1)}
          x2={200}
          y2={-130}
          stroke="#0A0A0A"
          strokeWidth={0.7}
        />
        <circle cx={cliffX.toFixed(1)} cy={cliffY.toFixed(1)} r={3} fill="#0A0A0A" />
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
      </g>
    </svg>
  );
}
