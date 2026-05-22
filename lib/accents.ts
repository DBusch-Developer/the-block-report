/**
 * lib/accents.ts
 *
 * Per-section accent colors. Three historical pigments — cinnabar (red),
 * verdigris (teal), ochre (yellow-brown) — each tied to one section of
 * The Block Report.
 */

export const ACCENTS = {
  noise: "#D64A23", // Cinnabar
  rats: "#2D5F5D", // Verdigris
  potholes: "#B57333", // Ochre
} as const;

export const ACCENT_NAMES = {
  noise: "Cinnabar",
  rats: "Verdigris",
  potholes: "Ochre",
} as const;

export type Section = keyof typeof ACCENTS;
