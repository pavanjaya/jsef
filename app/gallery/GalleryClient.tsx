"use client";

import { useEffect, useState } from "react";
import Reveal from "../components/Reveal";

type Photo = { src?: string; emoji?: string; caption: string };
type GalleryEvent = { title: string; date: string; photos: Photo[] };

const EVENTS: GalleryEvent[] = [
  {
    title: "Jangid Box Cricket League",
    date: "April 2025",
    photos: [
      { src: "/images/gallery-bcl-team-photo.png", caption: "Team Photo" },
      { src: "/images/gallery-bcl-winners.png", caption: "Winners" },
      { src: "/images/gallery-bcl-inauguration.png", caption: "Inauguration Ceremony" },
      { src: "/images/gallery-bcl-ladies-match.png", caption: "Ladies Match" },
    ],
  },
  { title: "Annual Sports Trophy Ceremony", date: "Mar 2025", photos: [{ emoji: "🏆", caption: "Annual Sports Trophy Ceremony" }] },
  { title: "Scholarship Awards 2025", date: "Jan 2025", photos: [{ emoji: "📚", caption: "Scholarship Awards 2025" }] },
  { title: "Heritage Festival Night", date: "Dec 2024", photos: [{ emoji: "🎊", caption: "Heritage Festival Night" }] },
  { title: "Box Cricket Tournament", date: "Feb 2025", photos: [{ emoji: "🏏", caption: "Box Cricket Tournament" }] },
  { title: "Tree Planting Drive", date: "Nov 2024", photos: [{ emoji: "🌱", caption: "Tree Planting Drive" }] },
  { title: "Community Gathering", date: "Oct 2024", photos: [{ emoji: "🤝", caption: "Community Gathering" }] },
];

const GRID_ITEMS: { wide?: boolean; emoji?: string; bg: string }[] = [
  { wide: true, bg: "url('/images/gallery-box-cricket-league.png') center/cover" },
  { emoji: "🏆", bg: "linear-gradient(135deg,#fff0e0,#ffd8b0)" },
  { emoji: "📚", bg: "linear-gradient(135deg,#e8f0ff,#c8d8ff)" },
  { emoji: "🎊", bg: "linear-gradient(135deg,#f0ffe8,#c8f0b0)" },
  { emoji: "🏏", bg: "linear-gradient(135deg,#f0ebff,#ddd0ff)" },
  { emoji: "🌱", bg: "linear-gradient(135deg,#fff0f5,#ffd0e0)" },
  { emoji: "🤝", bg: "linear-gradient(135deg,#fef9e7,#fde68a)" },
];

const DELAYS = [1, 2, 1, 2, 3, 4] as const;

export default function GalleryClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const changePhoto = (next: number) => {
    setFading(true);
    setTimeout(() => {
      setPhotoIndex(next);
      setFading(false);
    }, 150);
  };

  const open = (idx: number) => {
    setOpenIndex(idx);
    setPhotoIndex(0);
  };
  const close = () => setOpenIndex(null);

  useEffect(() => {
    document.body.style.overflow = openIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    const ev = EVENTS[openIndex];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") changePhoto((photoIndex - 1 + ev.photos.length) % ev.photos.length);
      if (e.key === "ArrowRight") changePhoto((photoIndex + 1) % ev.photos.length);
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIndex, photoIndex]);

  const ev = openIndex !== null ? EVENTS[openIndex] : null;
  const photo = ev ? ev.photos[photoIndex] : null;

  return (
    <>
      <div className="gal-grid">
        {GRID_ITEMS.map((item, i) => (
          <Reveal
            as="div"
            className={`gal-item${item.wide ? " gal-wide" : ""}`}
            delay={i === 0 ? undefined : DELAYS[i - 1]}
            key={EVENTS[i].title}
            style={{ background: item.bg, fontSize: item.wide ? 0 : 36 }}
            onClick={() => open(i)}
          >
            {!item.wide && item.emoji}
            <div className="gal-caption">
              <div className="gal-caption-title">{EVENTS[i].title}</div>
              <div className="gal-caption-date">{EVENTS[i].date}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <div
        className={`lightbox${openIndex !== null ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <button
          onClick={close}
          style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "#fff", fontSize: 32, cursor: "pointer", lineHeight: 1, opacity: 0.8 }}
          aria-label="Close"
        >
          &#x2715;
        </button>
        {ev && photo && (
          <>
            <div style={{ position: "absolute", top: 22, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,.55)", fontSize: 13, letterSpacing: ".5px" }}>
              {photoIndex + 1} / {ev.photos.length}
            </div>
            <div style={{ position: "relative", width: "100%", maxWidth: 880, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 64px", boxSizing: "border-box" }}>
              <button
                onClick={() => changePhoto((photoIndex - 1 + ev.photos.length) % ev.photos.length)}
                style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.12)", border: "none", color: "#fff", fontSize: 28, width: 44, height: 44, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                aria-label="Previous photo"
              >
                &#8249;
              </button>
              <div
                style={{
                  width: "100%",
                  maxHeight: "72vh",
                  aspectRatio: "4/3",
                  borderRadius: 10,
                  background: photo.src ? "#000" : "linear-gradient(135deg,#1a1a2e,#16213e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 80,
                  boxShadow: "0 8px 48px rgba(0,0,0,.5)",
                  transition: "opacity .25s",
                  opacity: fading ? 0 : 1,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {photo.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo.src} alt={photo.caption} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", borderRadius: 10 }} />
                ) : (
                  <span style={{ fontSize: 80 }}>{photo.emoji}</span>
                )}
              </div>
              <button
                onClick={() => changePhoto((photoIndex + 1) % ev.photos.length)}
                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.12)", border: "none", color: "#fff", fontSize: 28, width: 44, height: 44, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                aria-label="Next photo"
              >
                &#8250;
              </button>
            </div>
            <div style={{ marginTop: 18, textAlign: "center", padding: "0 24px" }}>
              <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, letterSpacing: ".1px", marginBottom: 4 }}>{photo.caption || ev.title}</div>
              <div style={{ color: "rgba(255,255,255,.55)", fontSize: 12, textTransform: "uppercase", letterSpacing: ".4px" }}>{ev.date}</div>
            </div>
            <div className="lb-thumbs" style={{ display: "flex", gap: 8, marginTop: 20, padding: "0 24px", maxWidth: 880, overflowX: "auto" }}>
              {ev.photos.map((p, i) => (
                <div
                  key={i}
                  className={`lb-thumb${i === photoIndex ? " active" : ""}`}
                  style={{ background: p.src ? `#000 url('${p.src}') center/cover no-repeat` : "linear-gradient(135deg,#1a1a2e,#16213e)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    changePhoto(i);
                  }}
                >
                  {!p.src && p.emoji}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
