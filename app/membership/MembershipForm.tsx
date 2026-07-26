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
      <div className="fg">
        <label>Membership Type *</label>
        <select required defaultValue="">
          <option value="" disabled>
            Select…
          </option>
          <option>Student Member — ₹200 (5 years)</option>
          <option>General Member — ₹500 (5 years)</option>
          <option>Managing Committee — ₹5,100</option>
        </select>
      </div>
      <button type="submit" className="btn btn-ink" style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 14 }}>
        Submit Application →
      </button>
    </Reveal>
  );
}
