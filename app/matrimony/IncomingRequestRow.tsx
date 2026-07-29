"use client";

import { useState, useTransition } from "react";
import { createClient } from "../../lib/supabase/client";
import { respondToRequest } from "./actions";
import RevealContact from "./RevealContact";

type RequesterProfile = {
  age: number | null;
  height: string | null;
  education: string | null;
  profession: string | null;
  gotra: string | null;
  city: string | null;
  about: string | null;
  photo_path: string | null;
};

export default function IncomingRequestRow({
  requestId,
  initialStatus,
}: {
  requestId: string;
  initialStatus: "pending" | "accepted" | "declined";
}) {
  const [profile, setProfile] = useState<RequesterProfile | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onView = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.rpc("get_requester_profile", { p_request_id: requestId });
    setProfile(data?.[0] ?? null);
    setLoading(false);
    setExpanded(true);
  };

  const onRespond = (accept: boolean) => {
    setError(null);
    startTransition(async () => {
      const result = await respondToRequest(requestId, accept);
      if (result.error) setError(result.error);
      else setStatus(accept ? "accepted" : "declined");
    });
  };

  if (status !== "pending") {
    return (
      <div style={{ border: "1px solid var(--rule)", padding: "1rem 1.2rem", background: "var(--surface)" }}>
        <span className={`status-badge ${status === "accepted" ? "status-approved" : "status-rejected"}`}>{status}</span>
        {status === "accepted" && <RevealContact requestId={requestId} />}
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid var(--rule)", padding: "1rem 1.2rem", background: "var(--surface)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".8rem" }}>
        <span style={{ fontSize: 13.5, color: "var(--ink-2)" }}>Someone sent you a request.</span>
        <div style={{ display: "flex", gap: ".6rem" }}>
          <button type="button" className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 11 }} onClick={onView}>
            {loading ? "Loading…" : expanded ? "Hide" : "View Profile"}
          </button>
          <button
            type="button"
            className="btn btn-brand"
            disabled={pending}
            style={{ padding: "8px 16px", fontSize: 11, opacity: pending ? 0.6 : 1 }}
            onClick={() => onRespond(true)}
          >
            Accept
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={pending}
            style={{ padding: "8px 16px", fontSize: 11, opacity: pending ? 0.6 : 1 }}
            onClick={() => onRespond(false)}
          >
            Decline
          </button>
        </div>
      </div>

      {expanded && profile && (
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--rule)", fontSize: 13, color: "var(--ink-2)" }}>
          {profile.age ? `${profile.age} yrs` : "Age not shared"}
          {profile.height ? ` · ${profile.height}` : ""}
          <br />
          {[profile.education, profile.profession].filter(Boolean).join(" · ") || "—"}
          <br />
          {[profile.gotra && profile.gotra !== "—" ? `${profile.gotra} Gotra` : null, profile.city].filter(Boolean).join(" · ")}
          {profile.about && <p style={{ marginTop: ".5rem", fontFamily: "var(--f-serif)" }}>{profile.about}</p>}
        </div>
      )}
      {expanded && !profile && <p style={{ marginTop: ".8rem", fontSize: 12.5, color: "var(--ink-3)" }}>No profile details available.</p>}
      {error && <p style={{ fontSize: 12, color: "#B91C1C", marginTop: ".5rem" }}>{error}</p>}
    </div>
  );
}
