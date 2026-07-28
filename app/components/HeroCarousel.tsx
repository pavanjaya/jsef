"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Slide = {
  bg: string;
  overlay?: string;
  tag: string;
  title: React.ReactNode;
  desc: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

const SLIDES: Slide[] = [
  {
    bg: "url('/images/jpl-2026-champions.png') center/cover no-repeat",
    tag: "Jangid Premier League · 2026",
    title: (
      <>
        JPL 2026
        <br />
        Champions.
      </>
    ),
    desc: "The Jangid Premier League 2026 — our biggest cricket celebration yet. Champions crowned, memories made, community united.",
    primary: { label: "Read the report", href: "/events" },
    secondary: { label: "Our story", href: "/about" },
  },
  {
    bg: "linear-gradient(135deg,#0d1a3a 0%,#1a3060 50%,#2a5090 100%)",
    overlay: "linear-gradient(to top,rgba(0,0,0,.8) 0%,rgba(0,0,0,.15) 100%)",
    tag: "Open Now · Education",
    title: (
      <>
        Scholarships
        <br />
        that change
        <br />
        lives.
      </>
    ),
    desc: "Merit-based scholarships, digital skills workshops, and mentorship for the next generation of Jangid scholars.",
    primary: { label: "Apply now", href: "/membership" },
    secondary: { label: "Learn more", href: "/about" },
  },
  {
    bg: "linear-gradient(135deg,#0f2810 0%,#1e4d20 50%,#2d7a30 100%)",
    overlay: "linear-gradient(to top,rgba(0,0,0,.8) 0%,rgba(0,0,0,.15) 100%)",
    tag: "Upcoming · Cultural",
    title: (
      <>
        Heritage in
        <br />
        living color.
      </>
    ),
    desc: "A vibrant celebration of Jangid culture — music, dance, crafts, and community bonding across all generations.",
    primary: { label: "Register now", href: "/events" },
    secondary: { label: "Contact us", href: "/contact" },
  },
];

const TOTAL = SLIDES.length;
const INTERVAL_MS = 3000;

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);

  const goTo = (n: number) => setActiveIndex(n);
  const next = () => setActiveIndex((i) => (i + 1) % TOTAL);
  const prev = () => setActiveIndex((i) => (i - 1 + TOTAL) % TOTAL);

  const stopCarousel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const startCarousel = () => {
    stopCarousel();
    timerRef.current = setInterval(() => setActiveIndex((i) => (i + 1) % TOTAL), INTERVAL_MS);
  };

  useEffect(() => {
    startCarousel();
    return stopCarousel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 44) {
      if (dx < 0) next();
      else prev();
    }
  };

  return (
    <div id="h-hero" onMouseEnter={stopCarousel} onMouseLeave={startCarousel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="carousel-track">
        {SLIDES.map((slide, i) => (
          <div className={`carousel-slide${i === activeIndex ? " active" : ""}`} key={i}>
            <div className="slide-img" style={{ background: slide.bg }}></div>
            <div className="slide-overlay" style={slide.overlay ? { background: slide.overlay } : undefined}></div>
            <div className="slide-content">
              <span className="slide-tag">{slide.tag}</span>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-desc">{slide.desc}</p>
              <div className="slide-btns">
                <Link href={slide.primary.href} className="btn btn-brand">
                  {slide.primary.label}
                </Link>
                <Link
                  href={slide.secondary.href}
                  className="btn btn-ghost"
                  style={{ color: "#fff", borderColor: "rgba(255,255,255,.3)", background: "rgba(255,255,255,.08)", backdropFilter: "blur(8px)" }}
                >
                  {slide.secondary.label}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-badge">
        <strong>1,200+</strong>
        <span>Members · Since 2018</span>
      </div>

      <div className="slide-counter">{String(activeIndex + 1).padStart(2, "0")} / 0{TOTAL}</div>
      <div className="carousel-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`cdot${i === activeIndex ? " active" : ""}`} onClick={() => goTo(i)}></button>
        ))}
      </div>
    </div>
  );
}
