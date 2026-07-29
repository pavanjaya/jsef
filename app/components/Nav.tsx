"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import LoginModal from "./LoginModal";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/committee", label: "Committee" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/magazine", label: "Magazine" },
  { href: "/membership", label: "Membership" },
];

const COMMUNITY_LINKS = [
  { href: "/directory", label: "Business Directory" },
  { href: "/blood-donors", label: "Blood Donors" },
  { href: "/jobs", label: "Job Board" },
  { href: "/scholarships", label: "Scholarships" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const communityRef = useRef<HTMLLIElement>(null);
  const communityActive = COMMUNITY_LINKS.some((l) => l.href === pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobOpen(false);
  }

  useEffect(() => {
    if (!communityOpen) return;
    const onClick = (e: MouseEvent) => {
      if (communityRef.current && !communityRef.current.contains(e.target as Node)) {
        setCommunityOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCommunityOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [communityOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Checked client-side (rather than in the root layout) so the rest of the
  // site — which doesn't need per-request auth — stays statically prerendered.
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setIsLoggedIn(!!user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setIsLoggedIn(!!session?.user));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <div className="ann-bar">
        <Link href="/membership">Lifetime Membership · ₹1,100 · Applications Open →</Link>
      </div>
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
          <li className="nav-dropdown" ref={communityRef}>
            <button
              type="button"
              className={`nav-dropdown-trigger${communityActive ? " active" : ""}`}
              onClick={() => setCommunityOpen((v) => !v)}
              aria-expanded={communityOpen}
            >
              Community
              <svg className="nav-dropdown-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div className={`nav-dropdown-menu${communityOpen ? " open" : ""}`}>
              {COMMUNITY_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""} onClick={() => setCommunityOpen(false)}>
                  {l.label}
                </Link>
              ))}
            </div>
          </li>
          {!isLoggedIn && (
            <li>
              <a
                href="/login"
                className={pathname === "/login" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setLoginOpen(true);
                }}
              >
                Login
              </a>
            </li>
          )}
          <li>
            {isLoggedIn ? (
              <Link href="/account" className="nav-cta">
                My Account
              </Link>
            ) : (
              <Link href="/membership" className="nav-cta">
                Join Now
              </Link>
            )}
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
        {COMMUNITY_LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setMobOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link
          href={isLoggedIn ? "/account" : "/login"}
          onClick={(e) => {
            setMobOpen(false);
            if (!isLoggedIn) {
              e.preventDefault();
              setLoginOpen(true);
            }
          }}
        >
          {isLoggedIn ? "My Account" : "Login"}
        </Link>
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
