"use client";

import { useEffect, useRef, useState } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 5 + 2;
      if (p >= 100) {
        p = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setTimeout(() => setHidden(true), 700);
        }, 400);
      } else {
        setProgress(p);
      }
    }, 160);
    return () => clearInterval(interval);
  }, []);

  if (hidden) return null;

  return (
    <div id="loader" className={done ? "done" : ""}>
      <div id="loader-inner">
        <img className="loader-logo" src="/images/logo-mark.svg" alt="JSEF" />
        <div className="loader-bar-wrap">
          <div className="loader-bar" ref={barRef} style={{ width: `${progress}%` }}></div>
        </div>
        <span className="loader-label">Loading</span>
      </div>
    </div>
  );
}
