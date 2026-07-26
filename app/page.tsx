import Link from "next/link";
import HeroCarousel from "./components/HeroCarousel";
import Reveal from "./components/Reveal";
import Counter from "./components/Counter";

const PILLARS = [
  {
    icon: "M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9 1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z",
    title: "Physical Wellbeing",
    desc: "Health, fitness and sports programs that build strong bodies and stronger habits.",
  },
  {
    icon: "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z",
    title: "Education",
    desc: "Scholarships, workshops and mentorship for academic and intellectual growth.",
  },
  {
    icon: "M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm1-11V7h-2v6l4.25 2.55.75-1.23L13 11z",
    title: "Cultural Heritage",
    desc: "Festivals, arts, music and traditions that connect us to where we come from.",
  },
  {
    icon: "M11.5 3.5 9 6H5v4l-2.5 2.5L5 15v4h4l2.5 2.5L14 19h4v-4l2.5-2.5L18 10V6h-4l-2.5-2.5zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z",
    title: "Sports & Adventure",
    desc: "Tournaments and outdoor programs that nurture sportsmanship and confidence.",
  },
  {
    icon: "M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 4-2 8-2s4 2 8 2v-2c-4 0-4-2-8-2-.56 0-1.08.05-1.58.13C14.95 12.57 16.29 10.68 17 8z|M17 8c.29-1.48.28-3.12-.1-5-.92 3.4-2.56 4.15-4.97 4.92C9.52 8.82 7 9.86 7 14c0 .67.08 1.27.2 1.8C8.1 13.82 10.67 10.86 17 8z",
    title: "Environment",
    desc: "Tree planting and clean-up campaigns rooted in stewardship for the next generation.",
  },
  {
    icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    title: "Community Bonding",
    desc: "Cultural events and gatherings that bring all ages and walks of life together.",
  },
] as const;

const EVENTS = [
  { emoji: "🏏", cls: "cricket", tag: "Sports", title: "Annual Cricket Tournament", meta: "Mar 15–17, 2026 · Community Sports Ground" },
  { emoji: "💻", cls: "edu", tag: "Education", title: "Digital Skills Workshop", meta: "Mar 22, 2026 · Community Hall" },
  { emoji: "🎊", cls: "culture", tag: "Cultural", title: "Cultural Festival Night", meta: "Apr 5, 2026 · Main Auditorium" },
] as const;

const DELAYS = [1, 2, 3, 4, 5] as const;

export default function HomePage() {
  return (
    <div className="page">
      <HeroCarousel />

      <div id="h-stats">
        <div className="stats-row">
          <Reveal className="stat-item" delay={1}>
            <Counter target={7} suffix="+" />
            <span className="stat-l">Years of service</span>
          </Reveal>
          <Reveal className="stat-item" delay={2}>
            <Counter target={1200} suffix="+" />
            <span className="stat-l">Active members</span>
          </Reveal>
          <Reveal className="stat-item" delay={3}>
            <Counter target={48} />
            <span className="stat-l">Events hosted</span>
          </Reveal>
          <Reveal className="stat-item" delay={4}>
            <Counter target={15} suffix="L+" />
            <span className="stat-l">Lakhs in scholarships</span>
          </Reveal>
        </div>
      </div>

      <section id="h-mission">
        <div className="mis-wrap">
          <Reveal from="left">
            <span className="eyebrow">Our Mission</span>
            <h2 className="h2" style={{ marginBottom: "1.6rem" }}>
              A community
              <br />
              in motion.
            </h2>
            <p>
              We promote holistic development through physical wellbeing, education, cultural preservation, health
              awareness, environmental stewardship, and the quiet joy of social bonding.
            </p>
            <Link href="/about" className="btn btn-ink" style={{ marginTop: "1.8rem" }}>
              Read our story →
            </Link>
          </Reveal>
          <Reveal from="right" delay={2}>
            <div className="mis-quote-block">
              <blockquote>
                &quot;We empower our members with the skills, knowledge, and opportunities needed for personal
                growth, academic excellence, cultural appreciation, and active participation in the life of our
                community.&quot;
              </blockquote>
              <span className="mis-cite">JSEC Governing Body</span>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="rule-line"></div>

      <section id="h-pillars">
        <div className="wrap">
          <Reveal className="pillars-head">
            <div>
              <span className="eyebrow">Our Objectives</span>
              <h2 className="h2">
                Six pillars.
                <br />
                <em>One community.</em>
              </h2>
            </div>
            <Link href="/about" className="btn btn-ghost">
              Our values →
            </Link>
          </Reveal>
          <div className="pillars-grid">
            {PILLARS.map((p, i) => (
              <Reveal className="pillar-item" delay={DELAYS[i % 3]} key={p.title}>
                <div className="pillar-ico">
                  <svg viewBox="0 0 24 24">
                    {p.icon.split("|").map((d, j) => (
                      <path d={d} key={j} />
                    ))}
                  </svg>
                </div>
                <div className="pillar-title">{p.title}</div>
                <p className="pillar-desc">{p.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="rule-line"></div>

      <section id="h-events">
        <div className="wrap">
          <Reveal className="events-head">
            <div>
              <span className="eyebrow">What&apos;s Next</span>
              <h2 className="h2">
                Upcoming
                <br />
                <em>gatherings.</em>
              </h2>
            </div>
            <Link href="/events" className="btn btn-ghost">
              View all events →
            </Link>
          </Reveal>
          <div className="events-grid">
            {EVENTS.map((e, i) => (
              <Reveal className="ev-item" delay={DELAYS[i]} key={e.title}>
                <div className={`ev-img-wrap ${e.cls}`}>{e.emoji}</div>
                <span className="ev-tag">{e.tag}</span>
                <div className="ev-title">{e.title}</div>
                <div className="ev-meta">{e.meta}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="h-join">
        <div className="wrap">
          <Reveal className="join-intro">
            <span className="eyebrow">Get Involved</span>
            <h2 className="h2">
              Be part of
              <br />
              <em>something lasting.</em>
            </h2>
          </Reveal>
          <div className="join-grid">
            <Reveal className="join-card">
              <Link href="/membership" style={{ position: "absolute", inset: 0, zIndex: 3 }} aria-label="Join our community"></Link>
              <div className="join-card-img" style={{ background: "url('/images/jpl-2026-champions.png') center/cover no-repeat" }}></div>
              <div className="join-card-overlay"></div>
              <div className="join-card-body">
                <span className="join-card-tag">Membership</span>
                <h3>
                  Join our
                  <br />
                  community.
                </h3>
                <p>Be part of a vibrant network dedicated to sports, education, and cultural excellence.</p>
                <span className="join-card-btn">Apply for membership →</span>
              </div>
            </Reveal>
            <Reveal className="join-card" delay={2}>
              <Link href="/contact" style={{ position: "absolute", inset: 0, zIndex: 3 }} aria-label="List your business"></Link>
              <div
                className="join-card-img"
                style={{ background: "linear-gradient(135deg,#2d1a0e 0%,#7a3a10 40%,#cc6820 70%,#ff9a45 100%)" }}
              ></div>
              <div
                className="join-card-overlay"
                style={{ background: "linear-gradient(to top,rgba(0,0,0,.72) 0%,rgba(80,30,0,.25) 55%,transparent 100%)" }}
              ></div>
              <div className="join-card-body">
                <span className="join-card-tag">Marketplace</span>
                <h3>
                  List your
                  <br />
                  business.
                </h3>
                <p>Reach thousands of community members across Nashik through our trusted directory.</p>
                <span className="join-card-btn">Get listed today →</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
