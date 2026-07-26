"use client";

import { useEffect, useRef, useState } from "react";

export default function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let start = 0;
            const duration = 1800;
            const step = (timestamp: number) => {
              if (!start) start = timestamp;
              const prog = Math.min((timestamp - start) / duration, 1);
              const ease = 1 - Math.pow(1 - prog, 4);
              setValue(Math.round(ease * target));
              if (prog < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span className="stat-n" ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
