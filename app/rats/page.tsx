import Masthead from "@/components/Masthead";
import MapNYC from "@/components/MapNYC";
import BoroughBars from "@/components/BoroughBars";
import { getRatsPageData } from "@/lib/db";
import { ACCENTS } from "@/lib/accents";
import Link from "next/link";

export const metadata = {
  title: "Brooklyn's rat problem, mapped",
};

const ACCENT = ACCENTS.rats;

const monthName = (m: number) =>
  [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][m - 1];

export default function RatsPage() {
  const rats = getRatsPageData();

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "20px 24px 80px" }}>
      <Masthead current="rats" />

      <article style={{ maxWidth: 780, margin: "0 auto" }}>
        <div className="eyebrow" style={{ color: ACCENT, marginBottom: 14 }}>
          Wildlife
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
          Brooklyn&apos;s rat problem, mapped.
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
          Of NYC&apos;s {rats.stats.total} rodent complaints to 311 in 2023,{" "}
          {rats.stats.peak_borough_pct} percent —{" "}
          {rats.stats.peak_borough_count} of them — came from a single borough.
        </p>

        <section style={{ margin: "0 0 16px" }}>
          <MapNYC
            points={rats.points}
            accentColor={ACCENT}
            height={520}
          />
        </section>
        <p
          className="eyebrow"
          style={{ textAlign: "center", color: "var(--ink-soft)", margin: "0 0 64px" }}
        >
          One dot per complaint · {rats.points.length} total · pan and zoom
        </p>

        <section style={{ maxWidth: 620, margin: "0 auto 56px" }}>
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
              R
            </span>
            odent complaints in New York City don&apos;t spread evenly.
            Brooklyn took in {rats.stats.peak_borough_count} of the city&apos;s{" "}
            {rats.stats.total} rodent calls to 311 in 2023, more than any
            other borough — and four of the five ZIP codes with the most
            complaints are in Brooklyn.
          </p>
          <p style={{ marginBottom: 22 }}>
            The busiest single ZIP was {rats.stats.top_zip} in{" "}
            {rats.stats.top_zip_borough}, with {rats.stats.top_zip_count}{" "}
            complaints. {monthName(rats.stats.peak_month)} 2023 was the
            year&apos;s busiest month, with {rats.stats.peak_month_count} calls.
          </p>
          <p>
            Not every report is a rat. Of the {rats.stats.total} rodent calls,
            122 were filed as &quot;Signs of Rodents,&quot; 102 as &quot;Mouse
            Sighting,&quot; 84 as &quot;Rat Sighting,&quot; and 79 as
            &quot;Condition Attracting Rodents&quot; — the kind of call you
            make about the uncovered trash bin two doors down.
          </p>
        </section>

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
            Rodent complaints filed in 2023 · hover for detail
          </p>

          <BoroughBars
            data={rats.boroughs}
            peakBorough={rats.stats.peak_borough}
            accentColor={ACCENT}
            unitLabel="rodent calls"
          />
        </section>

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
            The five worst ZIPs
          </h2>
          <p
            className="eyebrow"
            style={{ color: "var(--ink-soft)", margin: "0 0 28px" }}
          >
            ZIP codes with the most rodent complaints in 2023
          </p>

          <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {rats.topZips.map((z, i) => (
              <li
                key={z.zip}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 90px 1fr 80px",
                  alignItems: "baseline",
                  padding: "14px 0",
                  borderBottom:
                    i < rats.topZips.length - 1 ? "0.5px solid #00000022" : "none",
                  gap: 14,
                }}
              >
                <span
                  className="serif"
                  style={{ fontSize: 22, fontWeight: 700, color: "var(--ink-soft)" }}
                >
                  {i + 1}
                </span>
                <span
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                >
                  {z.zip}
                </span>
                <span style={{ fontSize: 14 }}>{z.borough}</span>
                <span
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 13,
                    color: ACCENT,
                    textAlign: "right",
                  }}
                >
                  {z.count} calls
                </span>
              </li>
            ))}
          </ol>
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
            Looking to live somewhere quiet, clean, and rodent-free? The map
            doesn&apos;t lie about which corners of the city to scout twice.
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
          href="/potholes"
          style={{ textDecoration: "none", color: "var(--ink)", display: "block" }}
        >
          <div className="eyebrow" style={{ color: ACCENTS.potholes }}>
            Next · Infrastructure
          </div>
          <div
            className="serif"
            style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.15, marginTop: 6 }}
          >
            Pothole season is real →
          </div>
        </Link>
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "var(--ink)",
            display: "block",
            textAlign: "right",
          }}
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
          Source: NYC Open Data · 311 Service Requests, 2023 · n = {rats.stats.total}
        </span>
      </footer>
    </main>
  );
}
