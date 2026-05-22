"use client";

/**
 * MapNYC — dynamic wrapper that loads the Leaflet implementation
 * only on the client. Leaflet accesses `window` at module load time,
 * so it cannot be evaluated during SSG. `next/dynamic` with ssr: false
 * defers loading to the browser.
 */

import dynamic from "next/dynamic";

const MapNYCInner = dynamic(() => import("./MapNYCInner"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "clamp(360px, 65vh, 520px)",
        background: "var(--paper)",
        border: "1px solid var(--ink)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--ink-soft)",
        fontSize: 13,
        letterSpacing: "0.15em",
        fontWeight: 500,
      }}
    >
      LOADING MAP…
    </div>
  ),
});

export default MapNYCInner;
