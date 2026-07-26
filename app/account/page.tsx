import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "My Account — JSEC",
};

const STATUS_COPY: Record<string, { label: string; className: string; message: string }> = {
  pending: {
    label: "Pending Review",
    className: "status-pending",
    message: "Our governing body is reviewing your application. This usually takes 5–7 business days — check back soon.",
  },
  approved: {
    label: "Approved",
    className: "status-approved",
    message: "You're a lifetime JSEC member. Download your ID card and certificate below.",
  },
  rejected: {
    label: "Not Approved",
    className: "status-rejected",
    message: "Your application wasn't approved this time. Contact us at hello@jsec.org if you have questions.",
  },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: member } = await supabase.from("members").select("*").eq("id", user.id).single();

  const status = STATUS_COPY[member?.status as string] ?? STATUS_COPY.pending;

  return (
    <div className="page">
      <div className="page-banner">
        <div className="wrap">
          <span className="eyebrow">My Account</span>
          <h1 className="h1" style={{ maxWidth: 600, marginBottom: ".4rem" }}>
            {member?.full_name || "Welcome"}
          </h1>
          <p className="lead" style={{ maxWidth: 500 }}>
            {user.email}
          </p>
        </div>
      </div>

      <section className="sec" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <div className="mem-form" style={{ margin: "0 auto" }}>
            <span className={`status-badge ${status.className}`}>{status.label}</span>
            <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7, margin: "1rem 0 0" }}>{status.message}</p>

            {member?.status === "approved" && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1.5px solid var(--rule)",
                    padding: "12px 16px",
                    margin: "1.5rem 0",
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--ink-2)" }}>Member ID</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--brand)" }}>{member.member_id}</span>
                </div>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <a href="/api/member/id-card" className="btn btn-brand" style={{ flex: 1, justifyContent: "center" }}>
                    Download ID Card
                  </a>
                  <a href="/api/member/certificate" className="btn btn-ink" style={{ flex: 1, justifyContent: "center" }}>
                    Download Certificate
                  </a>
                </div>
              </>
            )}

            <form action={signOut} style={{ marginTop: "2rem" }}>
              <button type="submit" className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
                Log Out
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
