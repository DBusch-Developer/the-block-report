import Masthead from "@/components/Masthead";
import { getAtlasPageData } from "@/lib/db";
import { ACCENTS } from "@/lib/accents";
import Link from "next/link";

export const metadata = {
  title: "Five boroughs, five obsessions",
};

const ACCENT = ACCENTS.atlas;

export default function AtlasPage() {
  const atlas = getAtlasPageData();

  return (
    <main
      style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "20px clamp(16px, 5vw, 24px) 80px",
      }}
    >
      <Masthead current="atlas" />

      <article style={{ maxWidth: 780, margin: "0 auto" }}>
        <div className="eyebrow" style={{ color: ACCENT, marginBottom: 14 }}>
          Cross-Section
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
          Five boroughs, five obsessions.
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
          Each of NYC&apos;s five boroughs has its own 311 character. The
          complaint topping one borough&apos;s list barely registers in
          another.
        </p>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            marginBottom: 72,
          }}
          aria-label="Top complaint categories per borough"
        >
          {atlas.boroughs.map((b) => (
            <BoroughCard key={b.borough} data={b} accent={ACCENT} />
          ))}
        </section>

        <section style={{ maxWidth: 620, margin: "0 auto 56px" }}>
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
              F
            </span>
            our of five NYC boroughs lead with the same 311 complaint:{" "}
            <strong>Consumer Complaint</strong>. Brooklyn, Queens, the Bronx,
            and Staten Island all rank it first. Only Manhattan breaks the
            pattern — its top complaint is{" "}
            <strong>Noise - Residential</strong>.
          </p>
          <p style={{ marginBottom: 22 }}>
            The unanimity at the top is its own finding. But scroll past
            the #1 spot and the boroughs diverge fast. Brooklyn&apos;s
            second complaint is blocked driveways. Queens&apos;s is illegal
            parking. The Bronx leans into sanitation — missed collection,
            overflowing baskets. Staten Island&apos;s list reads commercial.
            Manhattan&apos;s reads residential.
          </p>
          <p>
            The lists aren&apos;t random. They&apos;re a portrait. Older
            housing stock complains about paint and plaster. Nightlife
            districts complain about noise. Streets full of double-parked
            vans complain about parking. Each borough&apos;s top five is a
            snapshot of what it&apos;s like to live there.
          </p>
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
            Cross-reference these five lists before you sign a lease. The
            borough&apos;s top complaint is your future neighborhood&apos;s
            most-felt grievance.
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
          style={{ textDecoration: "none", color: "var(--ink)", display: "block" }}
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
          {atlas.stats.total_complaints.toLocaleString()}
        </span>
      </footer>
    </main>
  );
}

function BoroughCard({
  data,
  accent,
}: {
  data: {
    borough: string;
    total: number;
    topCategories: Array<{
      category: string;
      count: number;
      pct: number;
      rank: number;
    }>;
  };
  accent: string;
}) {
  const maxCount = Math.max(...data.topCategories.map((c) => c.count));

  return (
    <article
      style={{
        padding: "20px 22px",
        border: "1px solid var(--ink)",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        className="serif"
        style={{
          fontSize: 26,
          fontWeight: 700,
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {data.borough}
      </h2>
      <div
        className="eyebrow"
        style={{ color: "var(--ink-soft)", marginTop: 4, marginBottom: 18 }}
      >
        {data.total.toLocaleString()} complaints
      </div>
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {data.topCategories.map((c, i) => (
          <li key={c.category}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 12,
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: i === 0 ? 700 : 500,
                  color: i === 0 ? accent : "var(--ink)",
                  lineHeight: 1.3,
                }}
              >
                {c.category}
              </span>
              <span
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 11,
                  color: "var(--ink-soft)",
                  whiteSpace: "nowrap",
                }}
              >
                {c.count} · {c.pct}%
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: 4,
                background: "#00000015",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(c.count / maxCount) * 100}%`,
                  height: "100%",
                  background: i === 0 ? accent : "var(--ink)",
                  opacity: i === 0 ? 1 : 0.7,
                }}
              />
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
