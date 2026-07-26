import type { Metadata } from "next";
import { Suspense } from "react";
import Reveal from "../components/Reveal";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login — JSEC",
};

export default function LoginPage() {
  return (
    <div className="page">
      <div className="page-banner">
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Members
          </Reveal>
          <Reveal as="h1" className="h1" delay={1} style={{ maxWidth: 600, marginBottom: "1.2rem" }}>
            Welcome
            <br />
            <em>back.</em>
          </Reveal>
          <Reveal as="p" className="lead" delay={2} style={{ maxWidth: 500 }}>
            Log in to track your membership status and download your ID card and certificate once approved.
          </Reveal>
        </div>
      </div>
      <section className="sec" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
