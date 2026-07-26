"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/committee", label: "Committee" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/magazine", label: "Magazine" },
  { href: "/membership", label: "Membership" },
  { href: "/directory", label: "Directory" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav id="topnav" className={scrolled ? "scrolled" : ""}>
        <Link href="/" className="nav-logo">
          <img src="/images/logo-wordmark.svg" style={{ height: 39, width: "auto" }} alt="JSEF" />
        </Link>
        <ul className="nav-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={pathname === l.href ? "active" : ""}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/membership" className="nav-cta">
              Join Now
            </Link>
          </li>
        </ul>
        <div
          className={`ham${mobOpen ? " open" : ""}`}
          onClick={() => setMobOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
      <div className={`mob-menu${mobOpen ? " open" : ""}`}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setMobOpen(false)}>
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}
