"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("Newsletter signup");
    const body = encodeURIComponent(`Please add ${email} to the JangidTimes mailing list.`);
    window.location.href = `mailto:hello@jsec.org?subject=${subject}&body=${body}`;
  };

  return (
    <footer>
      <div className="foot-wrap">
        <div className="foot-top">
          <div>
            <img
              src="/images/logo-wordmark.svg"
              style={{ height: 30, width: "auto", filter: "brightness(0) invert(1)" }}
              alt="JSEF"
            />
            <p className="foot-brand-desc">
              Jangid Sports & Education Committee — empowering our community in Nashik through sports, learning,
              culture, and shared purpose since 2018.
            </p>
            <span className="foot-tagline">सेवा · संस्कृति · समाज</span>
            <form className="foot-subscribe" onSubmit={onSubscribe}>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button type="submit">Subscribe →</button>
            </form>
          </div>
          <div>
            <div className="foot-col-title">Explore</div>
            <ul className="foot-links">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/membership">Membership</Link></li>
              <li><Link href="/magazine">JangidTimes</Link></li>
              <li><Link href="/scholarships">Scholarships</Link></li>
            </ul>
          </div>
          <div>
            <div className="foot-col-title">Community</div>
            <ul className="foot-links">
              <li><Link href="/committee">Governing Body</Link></li>
              <li><Link href="/directory">Business Directory</Link></li>
              <li><Link href="/blood-donors">Blood Donors</Link></li>
              <li><Link href="/jobs">Job Board</Link></li>
              <li><Link href="/login">Member Login</Link></li>
              <li><Link href="/contact">Partner With Us</Link></li>
              <li><Link href="/in-memoriam">In Memoriam</Link></li>
            </ul>
          </div>
          <div>
            <div className="foot-col-title">Get in touch</div>
            <ul className="foot-links">
              <li>
                <a style={{ cursor: "default" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  Jangid Bhawan, Nashik
                </a>
              </li>
              <li>
                <a href="mailto:hello@jsec.org">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  hello@jsec.org
                </a>
              </li>
              <li>
                <a href="tel:+919766640399">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2.2z" />
                  </svg>
                  +91 97666 40399
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="foot-bot">
          <div className="foot-copy">© 2026 Jangid Sports & Education Committee. All rights reserved.</div>
          <div className="foot-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
