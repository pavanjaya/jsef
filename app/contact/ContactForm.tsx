"use client";

import Reveal from "../components/Reveal";

export default function ContactForm() {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! We will get back to you soon.");
  };

  return (
    <Reveal as="form" className="mem-form" delay={2} style={{ margin: 0 }} onSubmit={onSubmit}>
      <h3 style={{ marginBottom: ".5rem", fontSize: 20 }}>Send us a message</h3>
      <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: "2rem" }}>We&apos;ll get back to you soon.</p>
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
      <div className="fg">
        <label>Subject *</label>
        <input type="text" placeholder="Brief subject" required />
      </div>
      <div className="fg">
        <label>Message *</label>
        <textarea placeholder="Your message…" required></textarea>
      </div>
      <button type="submit" className="btn btn-ink" style={{ width: "100%", justifyContent: "center", padding: 13 }}>
        Send Message →
      </button>
    </Reveal>
  );
}
