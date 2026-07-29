"use client";

import { useState, useTransition } from "react";
import { sendRequest } from "./actions";

export default function RequestButton({ profileId, alreadySent }: { profileId: string; alreadySent: boolean }) {
  const [sent, setSent] = useState(alreadySent);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (sent) {
    return (
      <button type="button" className="btn btn-ghost" disabled style={{ width: "100%", justifyContent: "center", opacity: 0.7 }}>
        Request Sent ✓
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-brand"
        disabled={pending}
        style={{ width: "100%", justifyContent: "center", opacity: pending ? 0.6 : 1 }}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await sendRequest(profileId);
            if (result.error) setError(result.error);
            else setSent(true);
          })
        }
      >
        {pending ? "Sending…" : "Send Request →"}
      </button>
      {error && <p style={{ fontSize: 12, color: "#B91C1C", marginTop: ".5rem" }}>{error}</p>}
    </div>
  );
}
