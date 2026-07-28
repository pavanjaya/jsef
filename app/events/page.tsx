import type { Metadata } from "next";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Events — JSEC",
};

const UPCOMING = [
  { bg: "linear-gradient(140deg,#fff0e0,#ffd8b0)", emoji: "🏏", tag: "Sports", title: "Annual Cricket Tournament", meta: "Mar 15–17, 2026 · Sports Ground" },
  { bg: "linear-gradient(140deg,#e8f0ff,#c8d8ff)", emoji: "💻", tag: "Education", title: "Digital Skills Workshop", meta: "Mar 22, 2026 · Community Hall" },
  { bg: "linear-gradient(140deg,#f0ffe8,#c8f0b0)", emoji: "🎊", tag: "Cultural", title: "Cultural Festival Night", meta: "Apr 5, 2026 · Main Auditorium" },
] as const;

const PAST = [
  { bg: "url('/images/jpl-2026-champions.png') center/cover", emoji: null, tag: "Sports", title: "Jangid Premier League 2026", meta: "2026 · Community Sports Ground" },
  { bg: "linear-gradient(140deg,#f0ebff,#ddd0ff)", emoji: "📚", tag: "Education", title: "Scholarship Distribution 2025", meta: "Jan 26, 2025 · Jangid Bhawan" },
  { bg: "linear-gradient(140deg,#fff0f5,#ffd0e0)", emoji: "🪷", tag: "Cultural", title: "Heritage Festival 2024", meta: "Nov 10, 2024 · Main Auditorium" },
] as const;

const DELAYS = [0, 1, 2] as const;

export default function EventsPage() {
  return (
    <div className="page">
      <div className="page-banner">
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Events
          </Reveal>
          <Reveal as="h1" className="h1" delay={1} style={{ maxWidth: 600, marginBottom: "1.2rem" }}>
            Events that
            <br />
            <em>unite us.</em>
          </Reveal>
        </div>
      </div>
      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Upcoming
          </Reveal>
          <div className="evp-grid">
            {UPCOMING.map((e, i) => (
              <Reveal className="evp-card" delay={DELAYS[i] || undefined} key={e.title}>
                <div className="evp-img" style={{ background: e.bg }}>
                  {e.emoji}
                </div>
                <div className="evp-body">
                  <span className="evp-status evp-upcoming">Upcoming</span>
                  <span className="evp-tag">{e.tag}</span>
                  <div className="evp-title">{e.title}</div>
                  <div className="evp-meta">{e.meta}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="rule-line" style={{ margin: "4rem 0 3rem" }}></div>
          <Reveal as="span" className="eyebrow">
            Past Events
          </Reveal>
          <div className="evp-grid">
            {PAST.map((e, i) => (
              <Reveal className="evp-card" delay={DELAYS[i] || undefined} key={e.title}>
                <div className="evp-img" style={{ background: e.bg, backgroundPosition: "center" }}>
                  {e.emoji}
                </div>
                <div className="evp-body">
                  <span className="evp-status evp-past">Past</span>
                  <span className="evp-tag">{e.tag}</span>
                  <div className="evp-title">{e.title}</div>
                  <div className="evp-meta">{e.meta}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
