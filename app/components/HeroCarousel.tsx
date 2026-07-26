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
const INTERVAL_MS = 5000;

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const [barOn, setBarOn] = useState(false);
  const [hintHidden, setHintHidden] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<[number, number]>([0, 0]);
  const touchStartX = useRef(0);

  const restartProgress = () => {
    cancelAnimationFrame(rafRef.current[0]);
    cancelAnimationFrame(rafRef.current[1]);
    setBarOn(false);
    rafRef.current[0] = requestAnimationFrame(() => {
      rafRef.current[1] = requestAnimationFrame(() => setBarOn(true));
    });
  };

  const goTo = (n: number) => {
    setActiveIndex((prev) => {
      if (prev === n) return prev;
      setLeavingIndex(prev);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = setTimeout(() => setLeavingIndex(null), 1000);
      return n;
    });
    restartProgress();
  };

  const next = () => goTo((activeIndex + 1) % TOTAL);
  const prev = () => goTo((activeIndex - 1 + TOTAL) % TOTAL);

  const stopCarousel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const startCarousel = () => {
    stopCarousel();
    timerRef.current = setInterval(() => {
      setActiveIndex((current) => {
        const n = (current + 1) % TOTAL;
        setLeavingIndex(current);
        if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = setTimeout(() => setLeavingIndex(null), 1000);
        return n;
      });
      restartProgress();
    }, INTERVAL_MS);
  };

  // autoplay + initial progress bar
  useEffect(() => {
    startCarousel();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicks off the CSS width transition on mount, same as on every slide change
    restartProgress();
    const raf = rafRef.current;
    return () => {
      stopCarousel();
      cancelAnimationFrame(raf[0]);
      cancelAnimationFrame(raf[1]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // scroll hint
  useEffect(() => {
    const onScroll = () => setHintHidden(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // touch swipe
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
        {SLIDES.map((slide, i) => {
          const cls = ["carousel-slide", i === activeIndex ? "active" : "", i === leavingIndex ? "leaving" : ""]
            .filter(Boolean)
            .join(" ");
          return (
            <div className={cls} key={i}>
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
          );
        })}
      </div>

      <div className={`scroll-hint${hintHidden ? " hidden" : ""}`}>
        <div className="scroll-mouse"></div>
        <span>Scroll</span>
      </div>
      <div className="slide-counter">{String(activeIndex + 1).padStart(2, "0")} / 0{TOTAL}</div>
      <div className="carousel-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`cdot${i === activeIndex ? " active" : ""}`} onClick={() => goTo(i)}></button>
        ))}
      </div>
      <div className="carousel-progress">
        <div className={`carousel-progress-bar${barOn ? " animating" : ""}`}></div>
      </div>
    </div>
  );
}
