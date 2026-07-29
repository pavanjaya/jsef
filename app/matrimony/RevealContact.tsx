"use client";

import { useState } from "react";

type Contact = { full_name: string; phone: string; email: string };

export default function RevealContact({ requestId }: { requestId: string }) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (contact) {
    return (
      <div style={{ marginTop: ".6rem", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.8 }}>
        {contact.full_name}
        <br />
        {contact.phone} · {contact.email}
      </div>
    );
  }

  return (
    <div style={{ marginTop: ".6rem" }}>
      <button
        type="button"
        className="btn btn-ghost"
        style={{ padding: "6px 14px", fontSize: 11 }}
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          setError(null);
          const res = await fetch(`/api/matrimony/contact?requestId=${requestId}`);
          const data = await res.json();
          setLoading(false);
          if (!res.ok) setError(data.error || "Could not load contact details.");
          else setContact(data);
        }}
      >
        {loading ? "Loading…" : "Show Contact"}
      </button>
      {error && <p style={{ fontSize: 12, color: "#B91C1C", marginTop: ".4rem" }}>{error}</p>}
    </div>
  );
}
