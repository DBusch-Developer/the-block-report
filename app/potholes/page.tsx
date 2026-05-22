import Masthead from "@/components/Masthead";
import MapNYC from "@/components/MapNYC";
import MonthlyBars from "@/components/MonthlyBars";
import BoroughBars from "@/components/BoroughBars";
import { getPotholesPageData } from "@/lib/db";
import { ACCENTS } from "@/lib/accents";
import Link from "next/link";

export const metadata = {
  title: "Pothole season is real",
};

const ACCENT = ACCENTS.potholes;

const monthName = (m: number) =>
  [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][m - 1];

export default function PotholesPage() {
  const potholes = getPotholesPageData();
  const peakBorough = potholes.boroughs[0]?.borough;

  return (
    <main
      style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "20px clamp(16px, 5vw, 24px) 80px",
      }}
    >
      <Masthead current="potholes" />

      <article style={{ maxWidth: 780, margin: "0 auto" }}>
        <div className="eyebrow" style={{ color: ACCENT, marginBottom: 14 }}>
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

        <section style={{ margin: "0 0 12px" }}>
          <MonthlyBars
            data={potholes.monthly}
            peakMonth={potholes.stats.peak_month}
            troughMonth={potholes.stats.trough_month}
            accentColor={ACCENT}
            unitLabel="pothole complaints"
            caption="POTHOLE COMPLAINTS BY MONTH · 2023"
          />
        </section>
        <p
          className="eyebrow"
          style={{ textAlign: "center", color: "var(--ink-soft)", margin: "0 0 64px" }}
        >
          {potholes.stats.total} complaints · spring vs summer ratio{" "}
          {potholes.stats.spring_vs_summer}× · hover for detail
        </p>

        <section style={{ maxWidth: 620, margin: "0 auto 64px" }}>
          <p style={{ marginBottom: 22 }}>
            <span
              className="serif"
              style={{
                float: "left",
                fontSize: "clamp(56px, 13vw, 78px)",
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
            month. By {monthName(potholes.stats.trough_month)}, that number
            had fallen to {potholes.stats.trough_month_count} — the lowest of
            the year.
          </p>
          <p style={{ marginBottom: 22 }}>
            The pattern follows the freeze-thaw cycle that breaks roads apart
            from below: water seeps into pavement cracks, freezes overnight,
            expands, and pops the surface open by morning. Spring filed{" "}
            <strong>{potholes.stats.spring_total} pothole reports</strong>{" "}
            (March through May). Summer filed{" "}
            <strong>{potholes.stats.summer_total}</strong> (June through August).
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
            Every pothole complaint with geographic data, plotted on real streets
          </p>
        </section>

        <section style={{ margin: "0 0 16px" }}>
          <MapNYC
            points={potholes.points}
            accentColor={ACCENT}
            height={520}
          />
        </section>
        <p
          className="eyebrow"
          style={{ textAlign: "center", color: "var(--ink-soft)", margin: "0 0 64px" }}
        >
          One dot per pothole · {potholes.points.length} total · pan and zoom
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

          <BoroughBars
            data={potholes.boroughs}
            peakBorough={peakBorough}
            accentColor={ACCENT}
            unitLabel="potholes"
          />
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
            If a street looks fine in summer, it&apos;s no guarantee. Wait
            until March.
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
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
        }}
      >
        <Link
          href="/"
          style={{ textDecoration: "none", color: "var(--ink)", display: "block" }}
        >
          <div className="eyebrow" style={{ color: ACCENTS.noise }}>
            ← Back to · Public Disturbance
          </div>
          <div
            className="serif"
            style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.15, marginTop: 6 }}
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
          }}
        >
          <div className="eyebrow" style={{ color: ACCENTS.rats }}>
            ← Back to · Wildlife
          </div>
          <div
            className="serif"
            style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.15, marginTop: 6 }}
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
