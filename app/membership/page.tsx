import type { Metadata } from "next";
import Reveal from "../components/Reveal";
import FAQAccordion from "../components/FAQAccordion";
import MembershipApplication from "./MembershipApplication";

export const metadata: Metadata = {
  title: "Membership — JSEC",
};

const ELIGIBILITY = [
  {
    icon: "🪪",
    title: "Community Lineage",
    desc: "Open to individuals of the Jangid community by birth or marriage, and their immediate family.",
  },
  {
    icon: "🎂",
    title: "18 Years or Older",
    desc: "Applicants must be at least 18 years old at the time of application.",
  },
  {
    icon: "🌍",
    title: "Anywhere You Are",
    desc: "Open to Jangid families across Nashik, the rest of India, and the global diaspora.",
  },
  {
    icon: "🤝",
    title: "Good Standing",
    desc: "No history of conduct that conflicts with JSEC's values of service and integrity.",
  },
] as const;

const BENEFITS = [
  {
    icon: "M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-6 5.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z",
    title: "Full Event Access",
    desc: "Free or discounted entry to every JSEC tournament, workshop, and festival throughout the year.",
  },
  {
    icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    title: "Voting & Leadership Rights",
    desc: "A voice in committee elections, and eligibility to stand for leadership positions yourself.",
  },
  {
    icon: "M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z",
    title: "Scholarship Eligibility",
    desc: "Access to merit- and need-based scholarships for members and their families.",
  },
  {
    icon: "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z",
    title: "Business Directory Listing",
    desc: "Get your business listed in our community directory, seen by 1,200+ members across Nashik.",
  },
  {
    icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H7v-2h3v2zm0-4H7v-2h3v2zm0-4H7V7h3v2zm7 8h-5v-2h5v2zm0-4h-5v-2h5v2zm0-4h-5V7h5v2z",
    title: "JangidTimes Subscription",
    desc: "Receive our community magazine, with stories, achievements, and updates from across JSEC.",
  },
  {
    icon: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    title: "Networking & Mentorship",
    desc: "Connect with community leaders, professionals, and mentors across generations.",
  },
] as const;

const STEPS = [
  { n: "01", title: "Apply Online", desc: "Fill out the application form with your details and submit." },
  { n: "02", title: "Committee Review", desc: "Our governing body reviews your application within 5–7 business days." },
  { n: "03", title: "Welcome Aboard", desc: "Once approved, you're a lifetime member — start enjoying every benefit right away." },
] as const;

const FAQS = [
  {
    q: "How long does approval take?",
    a: "Our governing body reviews every application within 5–7 business days. Log in anytime to check your status.",
  },
  {
    q: "Is the ₹1,100 fee a one-time payment?",
    a: "Yes — it's a single lifetime membership fee. No renewals, no recurring charges.",
  },
  {
    q: "Do I need an Aadhaar card to apply?",
    a: "Yes, we ask for your Aadhaar number for identity verification. It's kept strictly confidential and used only for membership records.",
  },
  {
    q: "Can my whole family apply together?",
    a: "Each family member applies individually with their own login and details, but families are welcome to submit multiple applications together.",
  },
  {
    q: "What happens after I'm approved?",
    a: "You can log in anytime to download your member ID card and membership certificate as PDFs, and you'll get full access to every JSEC benefit right away.",
  },
] as const;

const ELIGIBILITY_DELAYS = [1, 2, 3, 4] as const;
const BENEFIT_DELAYS = [1, 2, 1, 2, 3, 4] as const;
const STEP_DELAYS = [1, 2, 3] as const;

export default function MembershipPage() {
  return (
    <div className="page">
      <div className="page-banner">
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Membership
          </Reveal>
          <Reveal as="h1" className="h1" delay={1} style={{ maxWidth: 600, marginBottom: "1.2rem" }}>
            Become part
            <br />
            of the <em>story.</em>
          </Reveal>
          <Reveal as="p" className="lead" delay={2} style={{ maxWidth: 560 }}>
            Whether you want to play, learn, mentor, or contribute — a single JSEC membership opens every door.
            No tiers, no renewals, just one community for life.
          </Reveal>
        </div>
      </div>

      <section className="sec" style={{ background: "var(--bg)", paddingTop: "5rem" }}>
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Who Can Join
          </Reveal>
          <Reveal as="h2" className="h2" delay={1}>
            Open to every
            <br />
            <em>Jangid family.</em>
          </Reveal>
          <div className="elig-grid">
            {ELIGIBILITY.map((e, i) => (
              <Reveal as="div" className="elig-card" delay={ELIGIBILITY_DELAYS[i]} key={e.title}>
                <span className="elig-check">✓</span>
                <div>
                  <div className="elig-title">{e.title}</div>
                  <div className="elig-desc">{e.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="rule-line"></div>

      <section className="sec" style={{ background: "var(--warm)" }}>
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Member Benefits
          </Reveal>
          <Reveal as="h2" className="h2" delay={1}>
            Everything you need to
            <br />
            <em>stay involved.</em>
          </Reveal>
          <div className="mem-benefits-grid">
            {BENEFITS.map((b, i) => (
              <Reveal className="pillar-item" delay={BENEFIT_DELAYS[i]} key={b.title}>
                <div className="pillar-ico">
                  <svg viewBox="0 0 24 24">
                    <path d={b.icon} />
                  </svg>
                </div>
                <div className="pillar-title">{b.title}</div>
                <p className="pillar-desc">{b.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="rule-line"></div>

      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <Reveal as="span" className="eyebrow" style={{ textAlign: "center", display: "block" }}>
            Questions
          </Reveal>
          <Reveal as="h2" className="h2" delay={1} style={{ textAlign: "center" }}>
            Frequently
            <br />
            <em>asked.</em>
          </Reveal>
          <FAQAccordion items={FAQS} />
        </div>
      </section>

      <div className="rule-line"></div>

      <section className="sec" style={{ background: "var(--warm)" }}>
        <div className="wrap">
          <Reveal as="span" className="eyebrow" style={{ textAlign: "center", display: "block" }}>
            Join Today
          </Reveal>
          <Reveal as="h2" className="h2" delay={1} style={{ textAlign: "center" }}>
            Ready when
            <br />
            <em>you are.</em>
          </Reveal>

          <div className="mem-cta-grid">
            <div className="mem-steps">
              <Reveal as="span" className="eyebrow">
                How It Works
              </Reveal>
              <Reveal as="h3" className="h3" style={{ marginBottom: "1rem" }}>
                Three steps to membership.
              </Reveal>
              <div className="val-list">
                {STEPS.map((s, i) => (
                  <Reveal as="div" className="val-row" delay={STEP_DELAYS[i]} key={s.n}>
                    <span className="val-n">{s.n}</span>
                    <div>
                      <div className="val-title">{s.title}</div>
                      <div className="val-desc">{s.desc}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <MembershipApplication />
          </div>
        </div>
      </section>
    </div>
  );
}
