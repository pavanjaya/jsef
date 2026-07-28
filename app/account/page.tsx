import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { signOut } from "./actions";
import { upsertDonorProfile, removeDonorProfile } from "../blood-donors/actions";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

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

const SUPABASE_CONFIGURED = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Shown only while Supabase isn't configured, so the page can be previewed.
const PREVIEW_MEMBER = {
  full_name: "Pavan Tarachand Jangid",
  status: "approved",
  member_id: "JSEC-2026-00012",
};

export default async function AccountPage() {
  let email = "you@example.com";
  let member: { full_name: string; status: string; member_id: string | null } = PREVIEW_MEMBER;
  let donorProfile: { blood_group: string; city: string; available: boolean } | null = null;

  if (SUPABASE_CONFIGURED) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");
    email = user.email ?? email;

    const { data } = await supabase.from("members").select("*").eq("id", user.id).single();
    member = data ?? { full_name: "", status: "pending", member_id: null };

    const { data: donor } = await supabase
      .from("blood_donors")
      .select("blood_group, city, available")
      .eq("member_id", user.id)
      .maybeSingle();
    donorProfile = donor;
  }

  const status = STATUS_COPY[member.status] ?? STATUS_COPY.pending;

  return (
    <div className="page">
      {!SUPABASE_CONFIGURED && (
        <div style={{ background: "var(--accent-orange)", color: "#fff", textAlign: "center", padding: "10px", fontSize: 13, fontWeight: 600 }}>
          Preview mode — showing sample data. Connect Supabase to make this page real.
        </div>
      )}
      <div className="page-banner">
        <div className="wrap">
          <span className="eyebrow">My Account</span>
          <h1 className="h1" style={{ maxWidth: 600, marginBottom: ".4rem" }}>
            {member.full_name || "Welcome"}
          </h1>
          <p className="lead" style={{ maxWidth: 500 }}>
            {email}
          </p>
        </div>
      </div>

      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <div className="mem-form" style={{ margin: "0 auto" }}>
            <span className={`status-badge ${status.className}`}>{status.label}</span>
            <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7, margin: "1rem 0 0" }}>{status.message}</p>

            {member.status === "approved" && (
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

            {SUPABASE_CONFIGURED && (
              <form action={signOut} style={{ marginTop: "2rem" }}>
                <button type="submit" className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
                  Log Out
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {SUPABASE_CONFIGURED && member.status === "approved" && (
        <section className="sec" style={{ background: "var(--warm)" }}>
          <div className="wrap">
            <div className="mem-form" style={{ margin: "0 auto" }}>
              <h3 style={{ marginBottom: ".4rem", fontSize: 18 }}>Blood Donor Registration</h3>
              <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: "1.5rem" }}>
                Opt in to be listed on the{" "}
                <a href="/blood-donors" style={{ color: "var(--brand)" }}>
                  Blood Donors
                </a>{" "}
                directory. Only your blood group, city, and availability are shown — never your name or phone.
              </p>
              <form action={upsertDonorProfile}>
                <div className="form-row">
                  <div className="fg">
                    <label htmlFor="blood_group">Blood Group *</label>
                    <select id="blood_group" name="blood_group" defaultValue={donorProfile?.blood_group ?? ""} required>
                      <option value="" disabled>
                        Select…
                      </option>
                      {BLOOD_GROUPS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="fg">
                    <label htmlFor="city">City *</label>
                    <input id="city" name="city" type="text" defaultValue={donorProfile?.city ?? ""} required />
                  </div>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: 13.5, color: "var(--ink-2)", margin: "1rem 0 1.5rem" }}>
                  <input type="checkbox" name="available" defaultChecked={donorProfile?.available ?? true} />
                  Currently available to donate
                </label>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button type="submit" className="btn btn-brand" style={{ flex: 1, justifyContent: "center" }}>
                    {donorProfile ? "Update Donor Profile" : "Join the Directory"}
                  </button>
                  {donorProfile && (
                    <button type="submit" formAction={removeDonorProfile} className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
                      Remove My Profile
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
