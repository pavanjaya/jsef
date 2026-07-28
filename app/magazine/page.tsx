import type { Metadata } from "next";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Magazine — JSEC",
};

const SIDEBAR = [
  { tag: "Sports · Feb 2025", title: "How Box Cricket Became Our Biggest Event Yet" },
  { tag: "Education · Jan 2025", title: "Meet the 2025 Scholarship Recipients" },
  { tag: "Culture · Dec 2024", title: "Heritage Festival: A Night to Remember" },
  { tag: "Community · Nov 2024", title: "Our Members Share Their Stories" },
] as const;

const ARCHIVE = [
  { issue: "Issue 03", date: "December 2024", title: "Heritage Festival Special" },
  { issue: "Issue 02", date: "August 2024", title: "The Scholarship Issue" },
  { issue: "Issue 01", date: "April 2024", title: "Launch Edition" },
] as const;

const ARCHIVE_DELAYS = [1, 2, 3] as const;

export default function MagazinePage() {
  return (
    <div className="page">
      <div className="mag-hero">
        <div className="wrap">
          <Reveal as="span" className="eyebrow" style={{ color: "rgba(255,255,255,.5)", justifyContent: "center", display: "block" }}>
            Community Publication
          </Reveal>
          <Reveal as="h1" className="h1" delay={1} style={{ color: "#fff", marginBottom: ".8rem", textAlign: "center" }}>
            JangidTimes
          </Reveal>
          <Reveal
            as="p"
            className="lead"
            delay={2}
            style={{ color: "rgba(255,255,255,.55)", maxWidth: 440, margin: "0 auto", textAlign: "center" }}
          >
            Stories, achievements, and news from across the Jangid community.
          </Reveal>
        </div>
      </div>
      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <div className="mag-grid">
            <Reveal className="mag-feat">
              <div className="mag-feat-img">📰</div>
              <div className="mag-feat-body">
                <span className="evp-tag">Latest · March 2025</span>
                <div className="ev-title" style={{ fontSize: 22, marginBottom: ".7rem" }}>
                  Champions, Scholars & New Beginnings
                </div>
                <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.8, marginBottom: "1.8rem" }}>
                  Featuring the JBCL 2025 champions, scholarship winners, and an exclusive interview with the
                  Governing Body.
                </p>
                <button className="btn btn-ink">Read Now →</button>
              </div>
            </Reveal>
            <Reveal className="mag-sidebar" delay={2}>
              {SIDEBAR.map((item) => (
                <div className="mag-item" key={item.title}>
                  <span className="mag-item-tag">{item.tag}</span>
                  <div className="mag-item-title">{item.title}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <div className="rule-line"></div>

      <section id="archive" className="sec" style={{ background: "var(--warm)", scrollMarginTop: 116 }}>
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Past Issues
          </Reveal>
          <Reveal as="h2" className="h2" delay={1} style={{ marginBottom: "1rem" }}>
            The archive.
          </Reveal>
          <Reveal as="p" delay={2} style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: "2.5rem", maxWidth: 480 }}>
            Don&apos;t have a copy of an older issue? Request it and we&apos;ll send it over by email.
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.2rem" }}>
            {ARCHIVE.map((a, i) => (
              <Reveal className="mag-item" delay={ARCHIVE_DELAYS[i]} key={a.issue} style={{ cursor: "default" }}>
                <span className="mag-item-tag">
                  {a.issue} · {a.date}
                </span>
                <div className="mag-item-title" style={{ marginBottom: "1rem" }}>
                  {a.title}
                </div>
                <a
                  href={`mailto:hello@jsec.org?subject=${encodeURIComponent(`Request: JangidTimes ${a.issue}`)}`}
                  style={{ fontSize: 12, fontWeight: 700, color: "var(--brand)", textDecoration: "none" }}
                >
                  Request this issue →
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
