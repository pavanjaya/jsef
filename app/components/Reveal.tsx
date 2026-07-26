"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  className?: string;
  from?: "left" | "right";
  delay?: 1 | 2 | 3 | 4 | 5;
  children?: ReactNode;
  [key: string]: unknown;
};

export default function Reveal({ as, className = "", from, delay, children, ...rest }: RevealProps) {
  const Tag = as || "div";
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setOn(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const classes = ["reveal", from ? `from-${from}` : "", delay ? `d${delay}` : "", on ? "on" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
}
