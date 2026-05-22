import map from "@/data/nyc-map.json";

interface Point {
  lat: number;
  lng: number;
}

interface NYCMapProps {
  points: Point[];
  accentColor?: string;
  pointRadius?: number;
  pointOpacity?: number;
  showLabels?: boolean;
  ariaLabel?: string;
}

export default function NYCMap({
  points,
  accentColor = "#D64A23",
  pointRadius = 2.8,
  pointOpacity = 0.5,
  showLabels = true,
  ariaLabel = "Map of New York City showing data point locations across boroughs",
}: NYCMapProps) {
  const { latMax, lngMin, scaleX, scaleY } = map.bounds;

  const project = (lat: number, lng: number) => ({
    x: (lng - lngMin) * scaleX,
    y: (latMax - lat) * scaleY,
  });

  return (
    <svg
      viewBox={map.viewBox}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      style={{ width: "100%", display: "block" }}
    >
      <g>
        {map.boroughs.map((b) => (
          <path
            key={b.name}
            d={b.d}
            fill="#F0E9D2"
            stroke="#0A0A0A"
            strokeWidth={0.9}
            strokeLinejoin="round"
          />
        ))}
      </g>
      <g>
        {points.map((p, i) => {
          const { x, y } = project(p.lat, p.lng);
          return (
            <circle
              key={i}
              cx={x.toFixed(1)}
              cy={y.toFixed(1)}
              r={pointRadius}
              fill={accentColor}
              opacity={pointOpacity}
            />
          );
        })}
      </g>
      {showLabels && (
        <g>
          {map.boroughs.map((b) => (
            <text
              key={b.name + "-label"}
              x={b.labelX}
              y={b.labelY}
              textAnchor="middle"
              fontFamily="var(--font-sans), Helvetica, sans-serif"
              fontSize={11}
              fontWeight={500}
              fill="#0A0A0A"
              letterSpacing="0.12em"
              style={{ pointerEvents: "none" }}
            >
              {b.name.toUpperCase()}
            </text>
          ))}
        </g>
      )}
    </svg>
  );
}
