import type { Metadata } from "next";
import Reveal from "../components/Reveal";
import MembershipForm from "./MembershipForm";

export const metadata: Metadata = {
  title: "Membership — JSEC",
};

const PLANS = [
  {
    name: "Student Member",
    price: "₹200",
    period: "5 year membership",
    feats: ["All community events", "Scholarship eligibility", "JangidTimes subscription", "Community networking"],
    btnClass: "btn-ghost",
    featured: false,
  },
  {
    name: "General Member",
    price: "₹500",
    period: "5 year membership",
    feats: ["Full event access", "Voting rights", "Business directory listing", "Leadership eligibility", "JangidTimes subscription"],
    btnClass: "btn-brand",
    featured: true,
  },
  {
    name: "Managing Committee",
    price: "₹5,100",
    period: "Lifetime membership",
    feats: ["All General benefits", "Committee decisions", "Priority event access", "Annual recognition", "Mentorship access"],
    btnClass: "btn-ink",
    featured: false,
  },
] as const;

const DELAYS = [0, 1, 2] as const;

export default function MembershipPage() {
  return (
    <div className="page page-fade">
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
          <Reveal as="p" className="lead" delay={2} style={{ maxWidth: 500 }}>
            Whether you want to play, learn, mentor, or contribute — there&apos;s a place for you here.
          </Reveal>
        </div>
      </div>
      <section className="sec" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <div className="mem-plans">
            {PLANS.map((plan, i) => (
              <Reveal className={`mem-plan${plan.featured ? " featured" : ""}`} delay={DELAYS[i] || undefined} key={plan.name}>
                <div className="mem-plan-name">{plan.name}</div>
                <div className="mem-plan-price">{plan.price}</div>
                <div className="mem-plan-period">{plan.period}</div>
                <ul className="mem-plan-feats">
                  {plan.feats.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a href="#mem-form-sec" className={`btn ${plan.btnClass}`} style={{ width: "100%", justifyContent: "center" }}>
                  Apply →
                </a>
              </Reveal>
            ))}
          </div>
          <MembershipForm />
        </div>
      </section>
    </div>
  );
}
