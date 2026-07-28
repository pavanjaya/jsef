import type { Metadata } from "next";
import Reveal from "../components/Reveal";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — JSEC",
};

const ITEMS = [
  { icon: "📍", label: "Address", value: (
    <>
      Jangid Bhawan, Nashik
      <br />
      Maharashtra 422001
    </>
  ) },
  { icon: "📞", label: "Phone", value: (
    <>
      <a href="tel:+919766640399">+91 97666 40399</a>
      <br />
      <a href="tel:+919130875666">+91 91308 75666</a>
    </>
  ) },
  { icon: "✉️", label: "Email", value: <a href="mailto:hello@jsec.org">hello@jsec.org</a> },
  { icon: "🕐", label: "Office Hours", value: (
    <>
      Mon–Fri: 9:00 AM – 6:00 PM
      <br />
      Saturday: 9:00 AM – 2:00 PM
    </>
  ) },
] as const;

const DELAYS = [0, 1, 2, 3] as const;

export default function ContactPage() {
  return (
    <div className="page">
      <div className="page-banner">
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Contact
          </Reveal>
          <Reveal as="h1" className="h1" delay={1} style={{ maxWidth: 600, marginBottom: "1.2rem" }}>
            Get in
            <br />
            <em>touch.</em>
          </Reveal>
        </div>
      </div>
      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <div className="cnt-layout">
            <div>
              {ITEMS.map((item, i) => (
                <Reveal className="cnt-item" delay={DELAYS[i] || undefined} key={item.label}>
                  <div className="cnt-icon">{item.icon}</div>
                  <div>
                    <div className="cnt-label">{item.label}</div>
                    <div className="cnt-val">{item.value}</div>
                  </div>
                </Reveal>
              ))}
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
