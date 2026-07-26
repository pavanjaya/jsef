"use client";

import Reveal from "../components/Reveal";

export default function MembershipForm() {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Application submitted. We will contact you within 5–7 business days.");
  };

  return (
    <Reveal as="form" className="mem-form" onSubmit={onSubmit} id="mem-form-sec">
      <h3 style={{ marginBottom: ".5rem", fontSize: 20 }}>Membership Application</h3>
      <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: "2rem" }}>
        We&apos;ll review and contact you within 5–7 business days.
      </p>
      <div className="form-row">
        <div className="fg">
          <label>Full Name *</label>
          <input type="text" placeholder="Your full name" required />
        </div>
        <div className="fg">
          <label>Email *</label>
          <input type="email" placeholder="you@example.com" required />
        </div>
      </div>
      <div className="form-row">
        <div className="fg">
          <label>Phone *</label>
          <input type="tel" placeholder="+91 XXXXX XXXXX" required />
        </div>
        <div className="fg">
          <label>Occupation</label>
          <input type="text" placeholder="e.g. Student, Business" />
        </div>
      </div>
      <div className="fg">
        <label>Address *</label>
        <input type="text" placeholder="Your full address" required />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1.5px solid var(--rule)",
          padding: "12px 16px",
          marginBottom: "1.5rem",
        }}
      >
        <span style={{ fontSize: 13, color: "var(--ink-2)" }}>JSEC Membership — Lifetime</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--brand)" }}>₹1,100</span>
      </div>
      <button type="submit" className="btn btn-ink" style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 14 }}>
        Submit Application →
      </button>
    </Reveal>
  );
}
