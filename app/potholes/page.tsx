import Masthead from "@/components/Masthead";
import NYCMap from "@/components/NYCMap";
import { getPotholesPageData } from "@/lib/db";
import Link from "next/link";

export const metadata = {
  title: "Pothole season is real",
};

const monthAbbrev = (m: number) =>
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1];

const monthName = (m: number) =>
  [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][m - 1];

export default function PotholesPage() {
  const potholes = getPotholesPageData();
  const maxMonthly = Math.max(...potholes.monthly.map((m) => m.count));
  const maxBorough = Math.max(...potholes.boroughs.map((b) => b.count));
  const totalBorough = potholes.boroughs.reduce((s, b) => s + b.count, 0);

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "20px 24px 80px" }}>
      <Masthead current="potholes" />

      <article style={{ maxWidth: 780, margin: "0 auto" }}>
        <div
          className="eyebrow"
          style={{ color: "var(--cinnabar)", marginBottom: 14 }}
        >
          Infrastructure
        </div>

        <h1
          className="serif"
          style={{
            fontSize: "clamp(38px, 6.5vw, 62px)",
            lineHeight: 1.04,
            fontWeight: 700,
            letterSpacing: "-0.015em",
            margin: "0 0 24px",
            paddingBottom: 24,
            borderBottom: "3px solid var(--ink)",
          }}
        >
          Pothole season is real.
        </h1>

        <p
          className="serif"
          style={{
            fontSize: "clamp(19px, 2.4vw, 22px)",
            lineHeight: 1.45,
            color: "var(--ink-soft)",
            fontStyle: "italic",
            margin: "28px 0 56px",
          }}
        >
          NYC pothole complaints peaked at {potholes.stats.peak_month_count} in{" "}
          {monthName(potholes.stats.peak_month)} and bottomed out at{" "}
          {potholes.stats.trough_month_count} in{" "}
          {monthName(potholes.stats.trough_month)}. Spring filed{" "}
          {potholes.stats.spring_vs_summer}× as many as summer.
        </p>

        <section
          style={{ margin: "0 -8px 12px", padding: "0 8px" }}
          aria-label="Monthly chart"
        >
          <svg
            viewBox="0 0 760 290"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={`Monthly pothole complaints in 2023, peaking at ${potholes.stats.peak_month_count} in ${monthName(potholes.stats.peak_month)} and bottoming at ${potholes.stats.trough_month_count} in ${monthName(potholes.stats.trough_month)}`}
            style={{ width: "100%", display: "block" }}
          >
            <line
              x1="0"
              y1="230"
              x2="760"
              y2="230"
              stroke="#0A0A0A"
              strokeWidth="1"
            />
            {potholes.monthly.map((m, i) => {
              const x = i * 62 + 12;
              const h = (m.count / maxMonthly) * 195;
              const y = 230 - h;
              const isPeak = m.month === potholes.stats.peak_month;
              const isTrough = m.month === potholes.stats.trough_month;
              return (
                <g key={m.month}>
                  <rect
                    x={x}
                    y={y}
                    width={50}
                    height={h}
                    fill={isPeak ? "#D64A23" : "#0A0A0A"}
                    opacity={isPeak ? 1 : 0.86}
                  />
                  <text
                    x={x + 25}
                    y={y - 8}
                    textAnchor="middle"
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                    fontSize="12"
                    fontWeight="500"
                    fill={isPeak ? "#D64A23" : isTrough ? "#0A0A0A" : "#555"}
                  >
                    {m.count}
                  </text>
                  <text
                    x={x + 25}
                    y={252}
                    textAnchor="middle"
                    fontFamily="var(--font-sans), Helvetica, sans-serif"
                    fontSize="11"
                    fontWeight={isPeak ? 700 : 500}
                    fill={isPeak ? "#D64A23" : "#0A0A0A"}
                    letterSpacing="0.1em"
                  >
                    {monthAbbrev(m.month).toUpperCase()}
                  </text>
                </g>
              );
            })}
            <text
              x="380"
              y="278"
              textAnchor="middle"
              fontFamily="var(--font-sans), Helvetica, sans-serif"
              fontSize="11"
              fill="#555"
              letterSpacing="0.1em"
            >
              POTHOLE COMPLAINTS BY MONTH · 2023
            </text>
          </svg>
        </section>
        <p
          className="eyebrow"
          style={{
            textAlign: "center",
            color: "var(--ink-soft)",
            margin: "0 0 64px",
          }}
        >
          {potholes.stats.total} complaints · spring vs summer ratio{" "}
          {potholes.stats.spring_vs_summer}×
        </p>

        <section style={{ maxWidth: 620, margin: "0 auto 64px" }}>
          <p style={{ marginBottom: 22 }}>
            <span
              className="serif"
              style={{
                float: "left",
                fontSize: 78,
                lineHeight: 0.85,
                fontWeight: 700,
                marginRight: 10,
                marginTop: 6,
              }}
            >
              P
            </span>
            otholes are a winter problem. NYC drivers reported{" "}
            {potholes.stats.peak_month_count} potholes to 311 in{" "}
            {monthName(potholes.stats.peak_month)}, the year&apos;s busiest
            month. By {monthName(potholes.stats.trough_month)}, that number had
            fallen to {potholes.stats.trough_month_count} — the lowest of the
            year.
          </p>
          <p style={{ marginBottom: 22 }}>
            The pattern follows the freeze-thaw cycle that breaks roads apart
            from below: water seeps into pavement cracks, freezes overnight,
            expands, and pops the surface open by morning. Spring filed{" "}
            <strong>{potholes.stats.spring_total} pothole reports</strong>{" "}
            (March through May). Summer filed{" "}
            <strong>{potholes.stats.summer_total}</strong> (June through
            August).
          </p>
          <p>
            By the time the leaves are off the trees again, the cycle restarts —
            October&apos;s count was a near-match for January&apos;s.
          </p>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2
            className="serif"
            style={{
              fontSize: 30,
              fontWeight: 700,
              margin: "0 0 6px",
              paddingBottom: 12,
              borderBottom: "2px solid var(--ink)",
            }}
          >
            Where they happen
          </h2>
          <p
            className="eyebrow"
            style={{ color: "var(--ink-soft)", margin: "0 0 28px" }}
          >
            Every pothole complaint with geographic data, plotted
          </p>
        </section>

        <section style={{ margin: "0 -8px 12px" }}>
          <NYCMap
            points={potholes.points}
            ariaLabel={`Map of New York City showing the location of ${potholes.points.length} pothole complaints to 311 in 2023`}
          />
        </section>
        <p
          className="eyebrow"
          style={{
            textAlign: "center",
            color: "var(--ink-soft)",
            margin: "0 0 64px",
          }}
        >
          One dot per pothole · {potholes.points.length} total
        </p>

        <section style={{ marginBottom: 64 }}>
          <h2
            className="serif"
            style={{
              fontSize: 30,
              fontWeight: 700,
              margin: "0 0 6px",
              paddingBottom: 12,
              borderBottom: "2px solid var(--ink)",
            }}
          >
            By borough
          </h2>
          <p
            className="eyebrow"
            style={{ color: "var(--ink-soft)", margin: "0 0 28px" }}
          >
            Pothole complaints filed in 2023
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {potholes.boroughs.map((b) => {
              const pct = Math.round((b.count / totalBorough) * 100);
              return (
                <div
                  key={b.borough}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "130px 1fr 80px",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <span
                    className="eyebrow"
                    style={{ color: "var(--ink)", fontWeight: 500 }}
                  >
                    {b.borough}
                  </span>
                  <div
                    style={{
                      height: 18,
                      borderBottom: "1px solid #00000022",
                    }}
                  >
                    <div
                      style={{
                        width: `${(b.count / maxBorough) * 100}%`,
                        height: "100%",
                        background: "var(--ink)",
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: 13,
                      color: "var(--ink-soft)",
                      textAlign: "right",
                    }}
                  >
                    {b.count} · {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section
          style={{
            borderTop: "3px solid var(--ink)",
            paddingTop: 32,
            marginBottom: 48,
          }}
        >
          <p
            className="serif"
            style={{
              fontSize: "clamp(20px, 2.4vw, 24px)",
              lineHeight: 1.45,
              fontStyle: "italic",
              margin: 0,
            }}
          >
            If a street looks fine in summer, it&apos;s no guarantee. Wait until
            March.
          </p>
        </section>
      </article>

      <nav
        style={{
          maxWidth: 780,
          margin: "0 auto",
          paddingTop: 32,
          borderTop: "1px solid var(--ink)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "var(--ink)",
            display: "block",
          }}
        >
          <div className="eyebrow" style={{ color: "var(--ink-soft)" }}>
            ← Back to · Public Disturbance
          </div>
          <div
            className="serif"
            style={{
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.15,
              marginTop: 6,
            }}
          >
            44% of noise calls in 5 hours
          </div>
        </Link>
        <Link
          href="/rats"
          style={{
            textDecoration: "none",
            color: "var(--ink)",
            display: "block",
            textAlign: "right",
          }}
        >
          <div className="eyebrow" style={{ color: "var(--ink-soft)" }}>
            ← Back to · Wildlife
          </div>
          <div
            className="serif"
            style={{
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.15,
              marginTop: 6,
            }}
          >
            Brooklyn&apos;s rat problem
          </div>
        </Link>
      </nav>

      <footer
        style={{
          maxWidth: 780,
          margin: "32px auto 0",
          paddingTop: 16,
          borderTop: "1px solid var(--ink)",
          fontSize: 12,
          color: "var(--ink-soft)",
        }}
      >
        <span className="eyebrow">
          Source: NYC Open Data · 311 Service Requests, 2023 · n ={" "}
          {potholes.stats.total}
        </span>
      </footer>
    </main>
  );
}
