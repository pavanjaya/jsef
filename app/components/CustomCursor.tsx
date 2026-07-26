"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let rx = cx;
    let ry = cy;
    let frame: number;

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      dot.style.left = cx + "px";
      dot.style.top = cy + "px";
    };
    document.addEventListener("mousemove", onMove);

    const animRing = () => {
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      frame = requestAnimationFrame(animRing);
    };
    frame = requestAnimationFrame(animRing);

    const selector = "a,button,.btn,.join-card,.pillar-item,.ev-item,.comm-card,.mag-item,.evp-card";
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(selector)) {
        document.body.classList.add("cursor-hover");
      }
    };
    const onOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related || !related.closest(selector)) {
        document.body.classList.remove("cursor-hover");
      }
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div id="cursor">
      <div id="cursor-dot" ref={dotRef}></div>
      <div id="cursor-ring" ref={ringRef}></div>
    </div>
  );
}
