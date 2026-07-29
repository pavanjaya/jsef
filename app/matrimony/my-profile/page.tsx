import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import MyProfileForm from "../MyProfileForm";
import IncomingRequestRow from "../IncomingRequestRow";
import RevealContact from "../RevealContact";

export const metadata: Metadata = {
  title: "My Matrimony Profile — JSEC",
};

const SUPABASE_CONFIGURED = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const STATUS_COPY: Record<string, { label: string; className: string; message: string }> = {
  draft: { label: "Draft", className: "status-pending", message: "Fill in your details and submit for review when ready." },
  pending: { label: "Pending Review", className: "status-pending", message: "An admin is reviewing your profile before it's visible to others." },
  approved: { label: "Approved", className: "status-approved", message: "Your profile is live and browsable by other members." },
};

export default async function MyMatrimonyProfilePage() {
  let profile = null as {
    age: number | null;
    height: string | null;
    education: string | null;
    profession: string | null;
    gotra: string | null;
    city: string | null;
    about: string | null;
    photo_path: string | null;
    status: string;
  } | null;
  let incoming: { id: string; status: "pending" | "accepted" | "declined" }[] = [];
  let outgoing: { id: string; status: string }[] = [];

  if (SUPABASE_CONFIGURED) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: myProfile } = await supabase.from("matrimony_profiles").select("*").eq("member_id", user.id).maybeSingle();
    profile = myProfile;

    if (myProfile) {
      const { data: inRequests } = await supabase
        .from("matrimony_requests")
        .select("id, status")
        .eq("to_profile_id", myProfile.id)
        .order("created_at", { ascending: false });
      incoming = inRequests ?? [];
    }

    const { data: outRequests } = await supabase
      .from("matrimony_requests")
      .select("id, status")
      .eq("from_member_id", user.id)
      .order("created_at", { ascending: false });
    outgoing = outRequests ?? [];
  }

  const status = STATUS_COPY[profile?.status ?? "draft"];

  return (
    <div className="page">
      {!SUPABASE_CONFIGURED && (
        <div style={{ background: "var(--accent-orange)", color: "#fff", textAlign: "center", padding: "10px", fontSize: 13, fontWeight: 600 }}>
          Preview mode — this form isn&apos;t connected yet. Connect Supabase to make it real.
        </div>
      )}
      <div className="page-banner">
        <div className="wrap">
          <span className="eyebrow">My Matrimony Profile</span>
          <h1 className="h1" style={{ maxWidth: 560, marginBottom: ".8rem" }}>
            Your profile,
            <br />
            <em>your control.</em>
          </h1>
          <p className="lead" style={{ maxWidth: 480 }}>
            Nothing here is visible to anyone until an admin approves it — and even then, browsers only see your
            details, never your name.
          </p>
        </div>
      </div>

      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <div className="mem-form" style={{ margin: "0 auto" }}>
            <span className={`status-badge ${status.className}`}>{status.label}</span>
            <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7, margin: "1rem 0 1.5rem" }}>{status.message}</p>
            <MyProfileForm profile={profile} />
          </div>
        </div>
      </section>

      {profile && (
        <section className="sec" style={{ background: "var(--warm)" }}>
          <div className="wrap">
            <span className="eyebrow">Incoming Requests</span>
            <h2 className="h2" style={{ marginBottom: "1.5rem" }}>
              Who&apos;s interested.
            </h2>
            {incoming.length === 0 ? (
              <p style={{ color: "var(--ink-3)", fontSize: 14 }}>No requests yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
                {incoming.map((r) => (
                  <IncomingRequestRow key={r.id} requestId={r.id} initialStatus={r.status} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <span className="eyebrow">Requests You&apos;ve Sent</span>
          <h2 className="h2" style={{ marginBottom: "1.5rem" }}>
            Your outreach.
          </h2>
          {outgoing.length === 0 ? (
            <p style={{ color: "var(--ink-3)", fontSize: 14 }}>You haven&apos;t sent any requests yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
              {outgoing.map((r) => (
                <div key={r.id} style={{ border: "1px solid var(--rule)", padding: ".8rem 1.2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13.5, color: "var(--ink-2)" }}>Request sent</span>
                    <span
                      className={`status-badge ${r.status === "accepted" ? "status-approved" : r.status === "declined" ? "status-rejected" : "status-pending"}`}
                    >
                      {r.status}
                    </span>
                  </div>
                  {r.status === "accepted" && <RevealContact requestId={r.id} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
