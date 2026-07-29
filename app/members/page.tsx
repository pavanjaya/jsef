import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export const metadata: Metadata = {
  title: "Members — JSEC",
};

const SUPABASE_CONFIGURED = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

type DirectoryMember = { member_id: string; full_name: string; city: string; gotra: string | null };

// Shown only while Supabase isn't configured. Generic placeholders only —
// this is a roster of real people, so no invented names.
const PREVIEW_MEMBERS: DirectoryMember[] = [
  { member_id: "preview-1", full_name: "Member #1", city: "Nashik", gotra: "Kashyap" },
  { member_id: "preview-2", full_name: "Member #2", city: "Nashik", gotra: "Kashyap" },
  { member_id: "preview-3", full_name: "Member #3", city: "Pune", gotra: "—" },
  { member_id: "preview-4", full_name: "Member #4", city: "Mumbai", gotra: "—" },
  { member_id: "preview-5", full_name: "Member #5", city: "Nashik", gotra: "—" },
];

export default async function MembersPage() {
  let members = PREVIEW_MEMBERS;

  if (SUPABASE_CONFIGURED) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data } = await supabase.rpc("list_directory_members");
    members = data ?? [];
  }

  return (
    <div className="page">
      {!SUPABASE_CONFIGURED && (
        <div style={{ background: "var(--accent-orange)", color: "#fff", textAlign: "center", padding: "10px", fontSize: 13, fontWeight: 600 }}>
          Preview mode — showing generic placeholder members. Connect Supabase to make this page real.
        </div>
      )}
      <div className="page-banner">
        <div className="wrap">
          <span className="eyebrow">Members</span>
          <h1 className="h1" style={{ maxWidth: 640, marginBottom: "1.2rem" }}>
            Our community,
            <br />
            <em>by name.</em>
          </h1>
          <p className="lead" style={{ maxWidth: 540 }}>
            Every approved JSEC member appears here by default — visible to fellow members only, never your phone
            or address. You can hide yourself anytime from your account page.
          </p>
        </div>
      </div>

      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          {members.length === 0 ? (
            <p style={{ color: "var(--ink-3)", fontSize: 14 }}>No members to show yet.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
              {members.map((m) => (
                <div
                  key={m.member_id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: ".2rem",
                    border: "1px solid var(--rule)",
                    padding: "1.2rem 1.4rem",
                    background: "var(--surface)",
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{m.full_name}</span>
                  <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
                    {m.city}
                    {m.gotra && m.gotra !== "—" ? ` · ${m.gotra} Gotra` : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
