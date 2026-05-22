# The Block Report · The New York 311 Investigations

A three-page editorial site exploring NYC's 2023 311 service request data.

- **`/`** — *Public Disturbance:* 44% of NYC's noise calls happen in five hours · cinnabar
- **`/rats`** — *Wildlife:* Brooklyn's rat problem, mapped · verdigris
- **`/potholes`** — *Infrastructure:* Pothole season is real · ochre

## Architecture

```
app/                        → pages (Server Components, call SQL at build time)
components/
  Masthead.tsx              → shared newspaper header, per-page accent
  NoiseClock.tsx            → Visx radial 24-hour bar chart (client)
  MonthlyBars.tsx           → Visx vertical bar chart (client)
  BoroughBars.tsx           → Visx horizontal bar chart (client)
  MapNYC.tsx                → react-leaflet map with Stadia tiles (client)
lib/
  db.ts                     → opens nyc_311_2023.db, exports query functions
  accents.ts                → per-page accent constants
db/nyc_311_2023.db          → the SQLite source of truth (committed)
next.config.ts              → leaves better-sqlite3 alone (native module)
.env.local                  → Stadia API key (NOT committed)
.env.example                → template
```

Pages stay statically generated. SQL runs at `next build`. Charts and maps are client components that hydrate for interactivity.

## Setup

```bash
npm install
```

If you're picking this up fresh, the deps you need:
```bash
npm install better-sqlite3 @visx/group @visx/shape @visx/scale leaflet react-leaflet
npm install -D @types/better-sqlite3 @types/leaflet
```

Get a **Stadia Maps API key** (free):
1. Sign up at https://stadiamaps.com
2. Create a Property
3. Under Authentication Configuration, add `localhost:3000` and your Vercel domain
4. Copy the API key
5. Create `.env.local` in the project root:
   ```
   NEXT_PUBLIC_STADIA_API_KEY=your-key-here
   ```

Then:

```bash
npm run dev
```

Open http://localhost:3000.

## To tweak

- **Per-page colors** — `lib/accents.ts`. Three constants, three pages.
- **Headlines and narrative** — plain JSX strings in each `app/<route>/page.tsx`.
- **Chart annotations** — props on `<NoiseClock>` (peakLabel, cliffLabel, centerStat).
- **Chart highlight rules** — `peakMonth`, `troughMonth`, `peakBorough` props on the bar chart components decide which bar gets the accent color.
- **Map style** — change the tile URL in `MapNYC.tsx`. Stadia has multiple styles: `stamen_toner_lite` (current, B&W minimal), `stamen_toner` (high-contrast B&W), `alidade_smooth` (light gray), `outdoors` (color).
- **Map dot styling** — `pointRadius`, `pointOpacity` props on `<MapNYC>`.
- **Masthead text** — `components/Masthead.tsx`. Date is hardcoded — update when republishing.

## To add a new SQL query

`lib/db.ts` has three page-level functions. Pattern:

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

Then import and call from any page:

```tsx
import { getRatsByMonth } from "@/lib/db";
const data = getRatsByMonth();
```

The SQLite VS Code extension reads `db/nyc_311_2023.db` directly — write and test queries in the editor before moving them into `lib/db.ts`.

## Deploy

```bash
git add -A
git commit -m "issue 01"
git push origin main
```

Then on vercel.com → Import Project → pick your repo. On the deploy settings, add the env var:
- Key: `NEXT_PUBLIC_STADIA_API_KEY`
- Value: your Stadia key

Vercel auto-detects Next.js, installs `better-sqlite3` with the Linux prebuilt binary, runs `next build` against `db/nyc_311_2023.db` (committed to your repo), bakes the SQL results into static HTML, and serves it. First deploy is usually under 90 seconds.

## Data provenance

NYC Open Data · 311 Service Requests, calendar year 2023. 25,000 rows in a single `service_requests` table.
