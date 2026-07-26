import Link from "next/link";

export default function Footer() {
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
          </div>
          <div>
            <div className="foot-col-title">Explore</div>
            <ul className="foot-links">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/membership">Membership</Link></li>
              <li><Link href="/magazine">JangidTimes</Link></li>
            </ul>
          </div>
          <div>
            <div className="foot-col-title">Community</div>
            <ul className="foot-links">
              <li><Link href="/committee">Governing Body</Link></li>
              <li><Link href="/directory">Business Directory</Link></li>
              <li><Link href="/membership">Member Login</Link></li>
              <li><Link href="/contact">Partner With Us</Link></li>
            </ul>
          </div>
          <div>
            <div className="foot-col-title">Get in touch</div>
            <ul className="foot-links">
              <li><a style={{ cursor: "default" }}>Jangid Bhawan, Nashik</a></li>
              <li><a href="mailto:hello@jsec.org">hello@jsec.org</a></li>
              <li><a href="tel:+919766640399">+91 97666 40399</a></li>
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
