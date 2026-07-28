import type { Metadata } from "next";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "In Memoriam — JSEC",
};

export default function InMemoriamPage() {
  return (
    <div className="page">
      <div className="page-banner">
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            In Memoriam
          </Reveal>
          <Reveal as="h1" className="h1" delay={1} style={{ maxWidth: 640, marginBottom: "1.2rem" }}>
            Remembering
            <br />
            our <em>own.</em>
          </Reveal>
          <Reveal as="p" className="lead" delay={2} style={{ maxWidth: 540 }}>
            A space to honor members of our community who are no longer with us — their contributions, their
            memory, and the mark they left on the people around them.
          </Reveal>
        </div>
      </div>

      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap" style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <p style={{ fontFamily: "var(--f-serif)", fontSize: 16, color: "var(--ink-2)", lineHeight: 1.9, marginBottom: "1.4rem" }}>
              This page is just getting started — tributes will appear here as families and friends share them with
              the committee.
            </p>
            <p style={{ fontFamily: "var(--f-serif)", fontSize: 16, color: "var(--ink-2)", lineHeight: 1.9, marginBottom: "2.5rem" }}>
              If you&apos;d like to add a tribute for a member of the community, please reach out to the committee
              directly — we&apos;ll work with you to add their name, photo, and a short remembrance here with care.
            </p>
            <a
              href="mailto:hello@jsec.org?subject=In%20Memoriam%20Tribute%20Request"
              className="btn btn-brand"
            >
              Request a tribute →
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
