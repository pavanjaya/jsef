import type { Metadata } from "next";
import Reveal from "../components/Reveal";
import DirectoryClient from "./DirectoryClient";

export const metadata: Metadata = {
  title: "Business Directory — JSEC",
};

export default function DirectoryPage() {
  return (
    <div className="page">
      <div className="page-banner">
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Community
          </Reveal>
          <Reveal as="h1" className="h1" delay={1} style={{ marginBottom: "1rem" }}>
            Business <em>Directory</em>
          </Reveal>
          <Reveal as="p" className="lead" delay={2} style={{ maxWidth: 560 }}>
            Discover and support businesses owned by members of the Jangid community.
          </Reveal>
        </div>
      </div>
      <section className="sec" style={{ background: "var(--bg)", paddingTop: "3.5rem" }}>
        <div className="wrap">
          <DirectoryClient />
        </div>
      </section>
    </div>
  );
}
