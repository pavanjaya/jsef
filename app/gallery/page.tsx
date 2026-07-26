import type { Metadata } from "next";
import Reveal from "../components/Reveal";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery — JSEC",
};

export default function GalleryPage() {
  return (
    <div className="page page-fade">
      <div className="page-banner">
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Photo Gallery
          </Reveal>
          <Reveal as="h1" className="h1" delay={1} style={{ marginBottom: "1.2rem" }}>
            Moments that
            <br />
            <em>matter.</em>
          </Reveal>
        </div>
      </div>
      <section className="sec" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <GalleryClient />
        </div>
      </section>
    </div>
  );
}
