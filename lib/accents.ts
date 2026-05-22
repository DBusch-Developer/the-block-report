/**
 * lib/accents.ts
 *
 * Per-section accent colors. Historical pigment names — each tied to
 * one section of The Block Report.
 */

export const ACCENTS = {
  noise: "#D64A23", // Cinnabar
  rats: "#2D5F5D", // Verdigris
  potholes: "#B57333", // Ochre
  atlas: "#2C3E7E", // Indigo
} as const;

export const ACCENT_NAMES = {
  noise: "Cinnabar",
  rats: "Verdigris",
  potholes: "Ochre",
  atlas: "Indigo",
} as const;

export type Section = keyof typeof ACCENTS;
