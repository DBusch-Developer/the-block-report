# The Block Report · The New York 311 Investigations

A three-page editorial site exploring NYC's 2023 311 service request data.

- **`/`** — *Public Disturbance:* 44% of NYC's noise calls happen in five hours
- **`/rats`** — *Wildlife:* Brooklyn's rat problem, mapped
- **`/potholes`** — *Infrastructure:* Pothole season is real

## Architecture

This site uses a real SQLite database at build time. Pages are React Server Components that import query functions from `lib/db.ts` and call them directly — no API routes, no client-side fetch.

```
app/                      → pages (Server Components, call SQL at build time)
components/               → reusable UI (Masthead, NoiseClock, NYCMap)
lib/db.ts                 → opens nyc_311_2023.db, exports query functions
db/nyc_311_2023.db        → the actual SQLite file (committed to the repo)
data/nyc-map.json         → NYC borough geometry (pre-projected SVG paths)
next.config.ts            → tells webpack to leave better-sqlite3 alone
```

At `next build`, SQL queries execute against the SQLite file and the results are baked into static HTML. The deployed site doesn't need the DB at runtime.

To add a new question to the site:
1. Write a new query function in `lib/db.ts`
2. Import and call it from a page component
3. Done — Next.js rebuilds and the new data is on the page

## Setup

```bash
npm install better-sqlite3
npm install -D @types/better-sqlite3
```

(Native module — needs build tools if your platform doesn't have a prebuilt binary. Windows: usually works out of the box with Node 20+. If it fails, install Visual Studio Build Tools.)

Then:

```bash
npm run dev
```

Open http://localhost:3000.

## Writing new queries

`lib/db.ts` opens the DB read-only and exposes helpers. Open it and read — three example query functions are there. To add a new one:

```ts
export function getRatsByMonth() {
  return db.prepare(`
    SELECT created_month AS month, COUNT(*) AS count
    FROM service_requests
    WHERE complaint_type = 'Rodent'
    GROUP BY created_month
    ORDER BY created_month
  `).all() as { month: number; count: number }[];
}
```

Then in any page:

```tsx
import { getRatsByMonth } from "@/lib/db";

export default function MyPage() {
  const data = getRatsByMonth();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

The SQLite VS Code extension you installed reads the same `.db` file — you can write and test queries against `db/nyc_311_2023.db` directly in the editor before moving them into `lib/db.ts`.

## Design tokens

In `app/globals.css`:
- `--paper` `#FAFAF5` — page background
- `--ink` `#0A0A0A` — main text and rules
- `--ink-soft` `#555` — secondary text
- `--cinnabar` `#D64A23` — sharp accent

## Deploy

```bash
git add -A
git commit -m "block report — issue 01"
git push -u origin main
```

Then on vercel.com → Import Project → pick your repo. Vercel auto-detects Next.js, installs `better-sqlite3` with the Linux prebuilt binary, runs `next build` against the `.db` file (which is in the repo), and serves the resulting static HTML. First deploy is usually under 90 seconds.

## Data source

NYC Open Data · 311 Service Requests, calendar year 2023. The SQLite file holds 25,000 rows in a single `service_requests` table with 25 columns (created/closed timestamps, complaint type and descriptor, borough, ZIP, lat/lng, resolution description, plus pre-computed convenience columns like `created_hour` and `created_month`).
