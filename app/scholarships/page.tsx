import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Scholarships — JSEC",
};

const CRITERIA = [
  {
    title: "Community Membership",
    desc: "Applicant or their parent/guardian must be an active JSEC lifetime member.",
  },
  {
    title: "Enrolled in Study",
    desc: "Currently enrolled in school, college, or a recognized diploma/degree program.",
  },
  {
    title: "Merit or Need Based",
    desc: "Awarded on academic merit, financial need, or a combination of both — assessed case by case.",
  },
  {
    title: "Annual Application",
    desc: "Scholarships are awarded annually; past recipients may reapply each year.",
  },
] as const;

const QUOTES = [
  {
    quote: "The scholarship covered my exam fees at a time my family really needed the support.",
    cite: "A 2024 JSEC Scholar",
  },
  {
    quote: "Knowing the community believed in my education pushed me to work even harder.",
    cite: "A 2023 JSEC Scholar",
  },
  {
    quote: "It wasn't just the money — it was the encouragement from people who'd walked the same path.",
    cite: "A 2022 JSEC Scholar",
  },
] as const;

const DELAYS = [1, 2, 3, 4] as const;

export default function ScholarshipsPage() {
  return (
    <div className="page">
      <div className="page-banner">
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Scholarships
          </Reveal>
          <Reveal as="h1" className="h1" delay={1} style={{ maxWidth: 640, marginBottom: "1.2rem" }}>
            Investing in
            <br />
            our <em>scholars.</em>
          </Reveal>
          <Reveal as="p" className="lead" delay={2} style={{ maxWidth: 540 }}>
            Merit- and need-based scholarships for JSEC members and their families — because education shouldn&apos;t
            wait on circumstance.
          </Reveal>
        </div>
      </div>

      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <div className="stats-row" style={{ maxWidth: 900, margin: "0 auto" }}>
            <div className="stat-item">
              <span className="stat-n" style={{ color: "var(--brand)" }}>
                15L+
              </span>
              <span className="stat-l" style={{ color: "var(--ink-3)" }}>
                Awarded to date
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-n" style={{ color: "var(--brand)" }}>
                7+
              </span>
              <span className="stat-l" style={{ color: "var(--ink-3)" }}>
                Years running
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-n" style={{ color: "var(--brand)" }}>
                ∞
              </span>
              <span className="stat-l" style={{ color: "var(--ink-3)" }}>
                Applications welcome
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="rule-line"></div>

      <section className="sec" style={{ background: "var(--warm)" }}>
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Who Can Apply
          </Reveal>
          <Reveal as="h2" className="h2" delay={1}>
            Eligibility
            <br />
            <em>criteria.</em>
          </Reveal>
          <div className="elig-grid">
            {CRITERIA.map((c, i) => (
              <Reveal as="div" className="elig-card" delay={DELAYS[i]} key={c.title}>
                <span className="elig-check">✓</span>
                <div>
                  <div className="elig-title">{c.title}</div>
                  <div className="elig-desc">{c.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="rule-line"></div>

      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <Reveal as="span" className="eyebrow" style={{ textAlign: "center", display: "block" }}>
            In Their Words
          </Reveal>
          <Reveal as="h2" className="h2" delay={1} style={{ textAlign: "center", marginBottom: "3rem" }}>
            From past
            <br />
            <em>recipients.</em>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
            {QUOTES.map((q, i) => (
              <Reveal
                key={q.cite}
                delay={DELAYS[i]}
                style={{ border: "1px solid var(--rule)", padding: "2rem", background: "var(--surface)" }}
              >
                <p style={{ fontFamily: "var(--f-serif)", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.8, marginBottom: "1.2rem", fontStyle: "italic" }}>
                  &quot;{q.quote}&quot;
                </p>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  — {q.cite}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: "var(--warm)", textAlign: "center" }}>
        <div className="wrap">
          <Reveal as="h2" className="h2" style={{ marginBottom: "1rem" }}>
            Ready to
            <br />
            <em>apply?</em>
          </Reveal>
          <Reveal as="p" delay={1} className="lead" style={{ maxWidth: 480, margin: "0 auto 2rem" }}>
            Scholarship applications open to all active JSEC members. Become a member first, then reach out to the
            committee to apply.
          </Reveal>
          <Reveal delay={2}>
            <Link href="/membership" className="btn btn-brand">
              Become a member →
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
