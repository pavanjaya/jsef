import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "About — JSEC",
};

const VALUES = [
  { n: "01", title: "Service", desc: "Above self, always." },
  { n: "02", title: "Excellence", desc: "In sport, study, and craft." },
  { n: "03", title: "Heritage", desc: "Honoured, never frozen." },
  { n: "04", title: "Inclusion", desc: "Every age, every voice." },
  { n: "05", title: "Stewardship", desc: "For the generations ahead." },
] as const;

const DELAYS = [1, 2, 3, 4, 5] as const;

export default function AboutPage() {
  return (
    <div className="page">
      <div className="page-banner">
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            About JSEC
          </Reveal>
          <Reveal as="h1" className="h1" delay={1} style={{ maxWidth: 700, marginBottom: "1.2rem" }}>
            Built on tradition.
            <br />
            <em>Driven by tomorrow.</em>
          </Reveal>
          <Reveal as="p" className="lead" delay={2} style={{ maxWidth: 540 }}>
            The Jangid Sports & Education Committee was founded in Nashik with a simple promise — to nurture our
            community through play, learning, culture, and care.
          </Reveal>
        </div>
      </div>

      <section className="sec" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <div className="about-grid">
            <Reveal className="about-img" from="left">
              🤝
            </Reveal>
            <Reveal from="right" delay={2}>
              <span className="eyebrow">Our Story</span>
              <p>
                What began as a small gathering of families has grown into one of Nashik&apos;s most active community
                committees.
              </p>
              <p>
                For over seven years, JSEC has been the meeting point for the Jangid community — organising
                tournaments that fill the stands, scholarships that change futures, and festivals that remind us
                where we come from.
              </p>
              <p>
                We believe in the quiet, sustained work of community: showing up year after year, mentoring the next
                generation, and building institutions that outlive any one of us.
              </p>
              <Link href="/membership" className="btn btn-ink" style={{ marginTop: "1.5rem" }}>
                Join JSEC →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="values-sec">
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Our Values
          </Reveal>
          <Reveal as="h2" className="h2" delay={1}>
            Five values that shape
            <br />
            <em>every decision.</em>
          </Reveal>
          <div className="val-list">
            {VALUES.map((v, i) => (
              <Reveal as="div" className="val-row" delay={DELAYS[i]} key={v.n}>
                <span className="val-n">{v.n}</span>
                <div>
                  <div className="val-title">{v.title}</div>
                  <div className="val-desc">{v.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
