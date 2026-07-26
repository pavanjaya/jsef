"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  { href: "/directory", label: "Directory" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

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
