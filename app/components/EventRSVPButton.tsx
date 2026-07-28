"use client";

import { useState, useTransition } from "react";
import { toggleRsvp } from "../events/actions";

export default function EventRSVPButton({
  slug,
  initialCount,
  initialGoing,
  supabaseConfigured,
}: {
  slug: string;
  initialCount: number;
  initialGoing: boolean;
  supabaseConfigured: boolean;
}) {
  const [count, setCount] = useState(initialCount);
  const [going, setGoing] = useState(initialGoing);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!supabaseConfigured) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: ".8rem" }}>
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{count} going</span>
        <a href="/login" style={{ fontSize: 12, fontWeight: 700, color: "var(--brand)", textDecoration: "none" }}>
          Log in to RSVP →
        </a>
      </div>
    );
  }

  const onClick = () => {
    setError(null);
    startTransition(async () => {
      const result = await toggleRsvp(slug);
      if (result.error) {
        setError(result.error);
        return;
      }
      setGoing(result.going);
      setCount((c) => (result.going ? c + 1 : Math.max(0, c - 1)));
    });
  };

  return (
    <div style={{ marginTop: ".8rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{count} going</span>
        <button
          type="button"
          onClick={onClick}
          disabled={pending}
          className={going ? "btn btn-ghost" : "btn btn-brand"}
          style={{ padding: "8px 16px", fontSize: 11, opacity: pending ? 0.6 : 1 }}
        >
          {going ? "Going ✓" : "RSVP"}
        </button>
      </div>
      {error && <p style={{ fontSize: 11, color: "#B91C1C", marginTop: ".4rem" }}>{error}</p>}
    </div>
  );
}
