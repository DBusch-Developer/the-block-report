/**
 * lib/db.ts
 *
 * Opens nyc_311_2023.db read-only and exports query functions for each page.
 *
 * These functions run at build time (Server Components, SSG). At `next build`,
 * SQL executes against the real SQLite file and the results are baked into
 * static HTML. The deployed site doesn't need the DB at runtime.
 *
 * To add a new question to the site:
 *   1. Write a new SQL query as a function here
 *   2. Import and call it from a page component
 *   3. Next.js handles the rest
 */

import Database from "better-sqlite3";
import path from "path";

// ---------- Connection ----------

const db = new Database(
  path.join(process.cwd(), "db", "nyc_311_2023.db"),
  { readonly: true, fileMustExist: true }
);

// ---------- Helpers ----------

function titleCase(s: string): string {
  return s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

function hourLabel(h: number): string {
  if (h === 0) return "12am";
  if (h < 12) return `${h}am`;
  if (h === 12) return "12pm";
  return `${h - 12}pm`;
}

// ============================================================
// NOISE PAGE
// ============================================================

export interface NoisePageData {
  stats: {
    year: number;
    total_complaints: number;
    total_noise: number;
    noise_pct: number;
    late_night_count: number;
    late_night_pct: number;
    late_night_rate_multiplier: number;
    peak_hour: number;
    peak_hour_label: string;
    peak_count: number;
    cliff_drop_pct: number;
  };
  hourly: { hour: number; count: number }[];
  boroughs: { borough: string; count: number }[];
  samples: {
    datetime: string;
    subtype: string;
    descriptor: string;
    borough: string;
    zip: string;
    resolution: string;
  }[];
}

export function getNoisePageData(): NoisePageData {
  const total_complaints = (
    db.prepare("SELECT COUNT(*) AS n FROM service_requests").get() as { n: number }
  ).n;

  const total_noise = (
    db
      .prepare(
        "SELECT COUNT(*) AS n FROM service_requests WHERE complaint_type LIKE '%Noise%'"
      )
      .get() as { n: number }
  ).n;

  const hourly = db
    .prepare(
      `SELECT created_hour AS hour, COUNT(*) AS count
       FROM service_requests
       WHERE complaint_type LIKE '%Noise%'
       GROUP BY created_hour
       ORDER BY created_hour`
    )
    .all() as { hour: number; count: number }[];

  const lateNightHours = new Set([22, 23, 0, 1, 2]);
  const late_night_count = hourly
    .filter((h) => lateNightHours.has(h.hour))
    .reduce((s, h) => s + h.count, 0);
  const rest_count = total_noise - late_night_count;

  const peak = hourly.reduce((max, h) => (h.count > max.count ? h : max));

  const twoAm = hourly.find((h) => h.hour === 2)?.count ?? 0;
  const threeAm = hourly.find((h) => h.hour === 3)?.count ?? 0;

  const boroughsRaw = db
    .prepare(
      `SELECT borough, COUNT(*) AS count
       FROM service_requests
       WHERE complaint_type LIKE '%Noise%' AND borough != 'Unspecified'
       GROUP BY borough
       ORDER BY count DESC`
    )
    .all() as { borough: string; count: number }[];

  const samplesRaw = db
    .prepare(
      `SELECT created_datetime, complaint_type, descriptor, borough,
              incident_zip, resolution_description
       FROM service_requests
       WHERE complaint_type LIKE '%Noise%'
         AND created_hour IN (22, 23, 0, 1, 2)
         AND descriptor IS NOT NULL
         AND borough != 'Unspecified'
         AND resolution_description IS NOT NULL
         AND length(resolution_description) > 40
       ORDER BY created_datetime`
    )
    .all() as {
      created_datetime: string;
      complaint_type: string;
      descriptor: string;
      borough: string;
      incident_zip: string;
      resolution_description: string;
    }[];

  const seen = new Set<string>();
  const samples: NoisePageData["samples"] = [];
  for (const s of samplesRaw) {
    const subtype = s.complaint_type.replace("Noise - ", "");
    const key = `${subtype}|${s.borough}`;
    if (seen.has(key)) continue;
    seen.add(key);
    samples.push({
      datetime: s.created_datetime,
      subtype,
      descriptor: s.descriptor,
      borough: titleCase(s.borough),
      zip: s.incident_zip,
      resolution: s.resolution_description.trim(),
    });
    if (samples.length === 8) break;
  }

  return {
    stats: {
      year: 2023,
      total_complaints,
      total_noise,
      noise_pct: Math.round((1000 * total_noise) / total_complaints) / 10,
      late_night_count,
      late_night_pct: Math.round((100 * late_night_count) / total_noise),
      late_night_rate_multiplier:
        Math.round((10 * (late_night_count / 5)) / (rest_count / 19)) / 10,
      peak_hour: peak.hour,
      peak_hour_label: hourLabel(peak.hour),
      peak_count: peak.count,
      cliff_drop_pct: Math.round((100 * (twoAm - threeAm)) / twoAm),
    },
    hourly,
    boroughs: boroughsRaw.map((b) => ({
      borough: titleCase(b.borough),
      count: b.count,
    })),
    samples,
  };
}

// ============================================================
// RATS PAGE
// ============================================================

export interface RatsPageData {
  stats: {
    total: number;
    peak_borough: string;
    peak_borough_count: number;
    peak_borough_pct: number;
    peak_month: number;
    peak_month_count: number;
    top_zip: string;
    top_zip_borough: string;
    top_zip_count: number;
  };
  points: { lat: number; lng: number }[];
  boroughs: { borough: string; count: number }[];
  monthly: { month: number; count: number }[];
  topZips: { zip: string; borough: string; count: number }[];
}

export function getRatsPageData(): RatsPageData {
  const points = db
    .prepare(
      `SELECT latitude AS lat, longitude AS lng
       FROM service_requests
       WHERE complaint_type = 'Rodent'
         AND latitude IS NOT NULL
         AND longitude IS NOT NULL`
    )
    .all() as { lat: number; lng: number }[];

  const boroughsRaw = db
    .prepare(
      `SELECT borough, COUNT(*) AS count
       FROM service_requests
       WHERE complaint_type = 'Rodent' AND borough != 'Unspecified'
       GROUP BY borough
       ORDER BY count DESC`
    )
    .all() as { borough: string; count: number }[];

  const monthly = db
    .prepare(
      `SELECT created_month AS month, COUNT(*) AS count
       FROM service_requests
       WHERE complaint_type = 'Rodent'
       GROUP BY created_month
       ORDER BY created_month`
    )
    .all() as { month: number; count: number }[];

  const topZipsRaw = db
    .prepare(
      `SELECT incident_zip AS zip, borough, COUNT(*) AS count
       FROM service_requests
       WHERE complaint_type = 'Rodent'
         AND incident_zip IS NOT NULL
         AND borough != 'Unspecified'
       GROUP BY incident_zip
       ORDER BY count DESC, incident_zip ASC
       LIMIT 5`
    )
    .all() as { zip: string; borough: string; count: number }[];

  const total = boroughsRaw.reduce((s, b) => s + b.count, 0);
  const peakBorough = boroughsRaw[0];
  const peakMonth = monthly.reduce((max, m) => (m.count > max.count ? m : max));
  const topZip = topZipsRaw[0];

  return {
    stats: {
      total,
      peak_borough: titleCase(peakBorough.borough),
      peak_borough_count: peakBorough.count,
      peak_borough_pct: Math.round((100 * peakBorough.count) / total),
      peak_month: peakMonth.month,
      peak_month_count: peakMonth.count,
      top_zip: topZip.zip,
      top_zip_borough: titleCase(topZip.borough),
      top_zip_count: topZip.count,
    },
    points,
    boroughs: boroughsRaw.map((b) => ({
      borough: titleCase(b.borough),
      count: b.count,
    })),
    monthly,
    topZips: topZipsRaw.map((z) => ({
      zip: z.zip,
      borough: titleCase(z.borough),
      count: z.count,
    })),
  };
}

// ============================================================
// ATLAS PAGE — top complaint categories per borough
// ============================================================

export interface AtlasPageData {
  stats: {
    total_complaints: number;
    borough_count: number;
  };
  boroughs: Array<{
    borough: string;
    total: number;
    topCategories: Array<{
      category: string;
      count: number;
      pct: number; // percent of this borough's total
      rank: number;
    }>;
  }>;
}

export function getAtlasPageData(): AtlasPageData {
  // CTE chain with a window function: top 5 complaint categories per borough,
  // ranked within each borough by frequency. Joins per-borough totals so the
  // page can compute each category's percentage of its borough's load.
  const rows = db
    .prepare(
      `
      WITH borough_totals AS (
        SELECT borough, COUNT(*) AS total
        FROM service_requests
        WHERE borough != 'Unspecified'
        GROUP BY borough
      ),
      borough_complaints AS (
        SELECT
          borough,
          complaint_type,
          COUNT(*) AS count
        FROM service_requests
        WHERE borough != 'Unspecified'
        GROUP BY borough, complaint_type
      ),
      ranked AS (
        SELECT
          bc.borough,
          bc.complaint_type,
          bc.count,
          bt.total AS borough_total,
          ROW_NUMBER() OVER (PARTITION BY bc.borough ORDER BY bc.count DESC) AS rnk
        FROM borough_complaints bc
        JOIN borough_totals bt ON bt.borough = bc.borough
      )
      SELECT borough, complaint_type, count, borough_total, rnk
      FROM ranked
      WHERE rnk <= 5
      ORDER BY borough_total DESC, rnk
      `
    )
    .all() as {
      borough: string;
      complaint_type: string;
      count: number;
      borough_total: number;
      rnk: number;
    }[];

  const boroughMap = new Map<string, AtlasPageData["boroughs"][number]>();
  for (const row of rows) {
    const name = titleCase(row.borough);
    if (!boroughMap.has(name)) {
      boroughMap.set(name, {
        borough: name,
        total: row.borough_total,
        topCategories: [],
      });
    }
    boroughMap.get(name)!.topCategories.push({
      category: row.complaint_type,
      count: row.count,
      pct: Math.round((100 * row.count) / row.borough_total),
      rank: row.rnk,
    });
  }

  const boroughs = Array.from(boroughMap.values());

  return {
    stats: {
      total_complaints: boroughs.reduce((s, b) => s + b.total, 0),
      borough_count: boroughs.length,
    },
    boroughs,
  };
}

// ============================================================
// POTHOLES PAGE
// ============================================================

export interface PotholesPageData {
  stats: {
    total: number;
    peak_month: number;
    peak_month_count: number;
    trough_month: number;
    trough_month_count: number;
    spring_total: number;
    summer_total: number;
    spring_vs_summer: number;
  };
  points: { lat: number; lng: number }[];
  monthly: { month: number; count: number }[];
  boroughs: { borough: string; count: number }[];
}

export function getPotholesPageData(): PotholesPageData {
  const points = db
    .prepare(
      `SELECT latitude AS lat, longitude AS lng
       FROM service_requests
       WHERE complaint_type = 'Street Condition'
         AND descriptor = 'Pothole'
         AND latitude IS NOT NULL
         AND longitude IS NOT NULL`
    )
    .all() as { lat: number; lng: number }[];

  const monthly = db
    .prepare(
      `SELECT created_month AS month, COUNT(*) AS count
       FROM service_requests
       WHERE complaint_type = 'Street Condition' AND descriptor = 'Pothole'
       GROUP BY created_month
       ORDER BY created_month`
    )
    .all() as { month: number; count: number }[];

  const boroughsRaw = db
    .prepare(
      `SELECT borough, COUNT(*) AS count
       FROM service_requests
       WHERE complaint_type = 'Street Condition'
         AND descriptor = 'Pothole'
         AND borough != 'Unspecified'
       GROUP BY borough
       ORDER BY count DESC`
    )
    .all() as { borough: string; count: number }[];

  const total = points.length;
  const peak_month_data = monthly.reduce((max, m) =>
    m.count > max.count ? m : max
  );
  const trough_month_data = monthly.reduce((min, m) =>
    m.count < min.count ? m : min
  );

  const springTotal = monthly
    .filter((m) => m.month === 3 || m.month === 4 || m.month === 5)
    .reduce((s, m) => s + m.count, 0);
  const summerTotal = monthly
    .filter((m) => m.month === 6 || m.month === 7 || m.month === 8)
    .reduce((s, m) => s + m.count, 0);

  return {
    stats: {
      total,
      peak_month: peak_month_data.month,
      peak_month_count: peak_month_data.count,
      trough_month: trough_month_data.month,
      trough_month_count: trough_month_data.count,
      spring_total: springTotal,
      summer_total: summerTotal,
      spring_vs_summer: Math.round((10 * springTotal) / summerTotal) / 10,
    },
    points,
    monthly,
    boroughs: boroughsRaw.map((b) => ({
      borough: titleCase(b.borough),
      count: b.count,
    })),
  };
}
