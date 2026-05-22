"use client";

import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Point {
  lat: number;
  lng: number;
}

interface MapNYCProps {
  points: Point[];
  accentColor: string;
  height?: number;
  center?: [number, number];
  zoom?: number;
  pointRadius?: number;
  pointOpacity?: number;
}

export default function MapNYC({
  points,
  accentColor,
  height = 520,
  center = [40.7128, -74.006],
  zoom = 11,
  pointRadius = 3.5,
  pointOpacity = 0.65,
}: MapNYCProps) {
  const apiKey = process.env.NEXT_PUBLIC_STADIA_API_KEY;

  if (!apiKey) {
    return (
      <div
        style={{
          height: `clamp(360px, 65vh, ${height}px)`,
          background: "var(--paper)",
          border: "1px dashed var(--ink)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
          color: "var(--ink-soft)",
          fontSize: 13,
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 600 }}>Map unavailable</div>
        <div>
          Set <code>NEXT_PUBLIC_STADIA_API_KEY</code> in <code>.env.local</code>{" "}
          (free at stadiamaps.com).
        </div>
      </div>
    );
  }

  const tileUrl = `https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png?api_key=${apiKey}`;

  return (
    <div style={{ height: `clamp(360px, 65vh, ${height}px)`, border: "1px solid var(--ink)" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        preferCanvas={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          url={tileUrl}
          maxZoom={20}
        />
        {points.map((p, i) => (
          <CircleMarker
            key={i}
            center={[p.lat, p.lng]}
            radius={pointRadius}
            pathOptions={{
              fillColor: accentColor,
              color: accentColor,
              fillOpacity: pointOpacity,
              weight: 0,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
