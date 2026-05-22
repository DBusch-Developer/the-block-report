import Masthead from "@/components/Masthead";
import NoiseClock from "@/components/NoiseClock";
import { getNoisePageData } from "@/lib/db";
import { ACCENTS } from "@/lib/accents";
import Link from "next/link";

export const metadata = {
  title: "44% of NYC's noise calls in five hours",
};

const ACCENT = ACCENTS.noise;

export default function NoisePage() {
  const noise = getNoisePageData();

  return (
    <main
      style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "20px clamp(16px, 5vw, 24px) 80px",
      }}
    >
      <Masthead current="noise" />

      <article style={{ maxWidth: 780, margin: "0 auto" }}>
        <div
          className="eyebrow"
          style={{ color: ACCENT, marginBottom: 14 }}
        >
          Public Disturbance
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
          Forty-four percent of NYC&apos;s noise complaints happen in a five-hour window.
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
          In 2023, calls to 311 about noise spiked between 10pm and 2am — three
          times the daytime rate — then fell off a cliff at 3am.
        </p>

        <section style={{ margin: "0 -8px 64px" }}>
          <NoiseClock data={noise.hourly} accentColor={ACCENT} />
        </section>

        <section style={{ maxWidth: 620, margin: "0 auto 72px" }}>
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
                color: "var(--ink)",
              }}
            >
              N
            </span>
            YC&apos;s noise complaints aren&apos;t evenly spread across the day. They
            cluster. In 2023, <strong>44 percent</strong> of the city&apos;s{" "}
            {noise.stats.total_noise.toLocaleString()} noise complaints to 311
            happened in a five-hour window — between 10pm and 2am. The per-hour
            rate during that window was three times the rest of the day.
          </p>
          <p style={{ marginBottom: 22 }}>
            Then, at 3am, the calls fall off a cliff. 315 complaints came in at
            2am. The next hour, 58. A drop of <strong>82 percent</strong> in
            sixty minutes.
          </p>
          <p>
            The most likely explanation isn&apos;t that NYC suddenly gets
            quieter at 3am. It&apos;s that the people who would have called
            have given up and gone to sleep.
          </p>
        </section>

        <section style={{ margin: "0 0 72px" }}>
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
            Eight late-night calls
          </h2>
          <p
            className="eyebrow"
            style={{ color: "var(--ink-soft)", margin: "0 0 28px" }}
          >
            Sampled from the {noise.stats.late_night_count.toLocaleString()}{" "}
            complaints filed between 10pm and 2am
          </p>

          <div style={{ overflowX: "auto", marginLeft: -8, marginRight: -8, paddingLeft: 8, paddingRight: 8 }}>
            <table
              style={{
                width: "100%",
                minWidth: 540,
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid var(--ink)" }}>
                  <th
                    className="eyebrow"
                    style={{ textAlign: "left", padding: "10px 8px 10px 0", fontWeight: 500 }}
                  >
                    Time
                  </th>
                  <th
                    className="eyebrow"
                    style={{ textAlign: "left", padding: "10px 8px", fontWeight: 500 }}
                  >
                    Where
                  </th>
                  <th
                    className="eyebrow"
                    style={{ textAlign: "left", padding: "10px 8px", fontWeight: 500 }}
                  >
                    What
                  </th>
                  <th
                    className="eyebrow"
                    style={{ textAlign: "left", padding: "10px 0 10px 8px", fontWeight: 500 }}
                  >
                    Outcome
                  </th>
                </tr>
              </thead>
              <tbody>
                {noise.samples.map((c, i) => {
                  const dt = new Date(c.datetime);
                  const date = dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  const time = dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
                  return (
                    <tr key={i} style={{ borderBottom: "0.5px solid #00000022" }}>
                      <td
                        style={{
                          padding: "18px 8px 18px 0",
                          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                          fontSize: 12,
                          color: "var(--ink-soft)",
                          whiteSpace: "nowrap",
                          verticalAlign: "top",
                        }}
                      >
                        <div>{date}</div>
                        <div style={{ color: ACCENT }}>{time}</div>
                      </td>
                      <td style={{ padding: "18px 8px", verticalAlign: "top" }}>
                        <div style={{ fontWeight: 500 }}>{c.borough}</div>
                        <div style={{ color: "var(--ink-soft)", fontSize: 12 }}>
                          ZIP {c.zip}
                        </div>
                      </td>
                      <td style={{ padding: "18px 8px", verticalAlign: "top" }}>
                        <div style={{ fontWeight: 500 }}>{c.subtype}</div>
                        <div style={{ color: "var(--ink-soft)", fontSize: 12 }}>
                          {c.descriptor}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "18px 0 18px 8px",
                          fontSize: 13,
                          color: "var(--ink-soft)",
                          verticalAlign: "top",
                        }}
                      >
                        {c.resolution}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
            NYC&apos;s noise problem peaks exactly when the people most
            affected are least able to do anything about it — and 311 calls
            show us when they stop trying.
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
        aria-label="Continue reading"
      >
        <Link
          href="/rats"
          style={{ textDecoration: "none", color: "var(--ink)", display: "block" }}
        >
          <div className="eyebrow" style={{ color: ACCENTS.rats }}>
            Next · Wildlife
          </div>
          <div
            className="serif"
            style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.15, marginTop: 6 }}
          >
            Brooklyn&apos;s rat problem, mapped →
          </div>
        </Link>
        <Link
          href="/potholes"
          style={{ textDecoration: "none", color: "var(--ink)", display: "block" }}
        >
          <div className="eyebrow" style={{ color: ACCENTS.potholes }}>
            Then · Infrastructure
          </div>
          <div
            className="serif"
            style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.15, marginTop: 6 }}
          >
            Pothole season is real →
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
          Source:{" "}
          <a
            href="https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            NYC Open Data · 311 Service Requests, 2023
          </a>
        </span>
      </footer>
    </main>
  );
}
