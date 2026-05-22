import Link from "next/link";
import { ACCENTS, type Section } from "@/lib/accents";

const sections: { id: Section; label: string; href: string }[] = [
  { id: "noise", label: "Noise", href: "/" },
  { id: "rats", label: "Rats", href: "/rats" },
  { id: "potholes", label: "Potholes", href: "/potholes" },
  { id: "atlas", label: "Atlas", href: "/atlas" },
];

export default function Masthead({ current }: { current: Section }) {
  const accent = ACCENTS[current];

  return (
    <header
      style={{
        borderBottom: "1px solid var(--ink)",
        marginBottom: 48,
      }}
    >
      <div
        className="eyebrow"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          padding: "14px 0 8px",
          borderBottom: "1px solid var(--ink)",
          color: "var(--ink-soft)",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span>Vol. I · No. 01</span>
        <span>Friday, May 22, 2026</span>
        <span>One dollar</span>
      </div>

      <div style={{ textAlign: "center", padding: "24px 0 16px" }}>
        <h1
          className="serif"
          style={{
            fontSize: "clamp(48px, 10vw, 88px)",
            lineHeight: 0.95,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            margin: 0,
          }}
        >
          The Block Report
        </h1>
        <div
          className="eyebrow"
          style={{
            marginTop: 14,
            color: "var(--ink-soft)",
          }}
        >
          The New York 311 Investigations — An issue about living here
        </div>
      </div>

      <nav
        style={{
          borderTop: "3px double var(--ink)",
          padding: "12px 0",
          display: "flex",
          justifyContent: "center",
          gap: 36,
          flexWrap: "wrap",
        }}
        aria-label="Section navigation"
      >
        {sections.map(({ id, label, href }) => {
          const isActive = current === id;
          const sectionAccent = ACCENTS[id];
          return (
            <Link
              key={id}
              href={href}
              className="eyebrow"
              style={{
                textDecoration: "none",
                color: isActive ? accent : "var(--ink)",
                borderBottom: isActive
                  ? `2px solid ${sectionAccent}`
                  : "2px solid transparent",
                paddingBottom: 3,
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
