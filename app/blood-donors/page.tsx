import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export const metadata: Metadata = {
  title: "Blood Donors — JSEC",
};

const SUPABASE_CONFIGURED = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

type Donor = { id: string; blood_group: string; city: string; available: boolean };

// Shown only while Supabase isn't configured. Deliberately non-identifying —
// unlike other preview data in this app, a donor directory shows real
// phone/contact-adjacent info about real people, so no invented names.
const PREVIEW_DONORS: Donor[] = [
  { id: "preview-1", blood_group: "O+", city: "Nashik", available: true },
  { id: "preview-2", blood_group: "B+", city: "Nashik", available: true },
  { id: "preview-3", blood_group: "A-", city: "Pune", available: true },
  { id: "preview-4", blood_group: "AB+", city: "Mumbai", available: false },
  { id: "preview-5", blood_group: "O-", city: "Nashik", available: true },
];

export default async function BloodDonorsPage() {
  let donors = PREVIEW_DONORS;

  if (SUPABASE_CONFIGURED) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data } = await supabase
      .from("blood_donors")
      .select("id, blood_group, city, available")
      .order("blood_group");
    donors = data ?? [];
  }

  const byGroup = donors.reduce<Record<string, Donor[]>>((acc, d) => {
    (acc[d.blood_group] ??= []).push(d);
    return acc;
  }, {});
  const groups = Object.keys(byGroup).sort();

  return (
    <div className="page">
      {!SUPABASE_CONFIGURED && (
        <div style={{ background: "var(--accent-orange)", color: "#fff", textAlign: "center", padding: "10px", fontSize: 13, fontWeight: 600 }}>
          Preview mode — showing generic placeholder donors. Connect Supabase to make this page real.
        </div>
      )}
      <div className="page-banner">
        <div className="wrap">
          <span className="eyebrow">Blood Donors</span>
          <h1 className="h1" style={{ maxWidth: 640, marginBottom: "1.2rem" }}>
            Ready when
            <br />
            it <em>matters.</em>
          </h1>
          <p className="lead" style={{ maxWidth: 540 }}>
            JSEC members who&apos;ve volunteered to be reachable in an emergency. Contact the committee to be put in
            touch with a donor near you.
          </p>
        </div>
      </div>

      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          {donors.length === 0 ? (
            <p style={{ color: "var(--ink-3)", fontSize: 14 }}>
              No donors registered yet. Add yourself from your{" "}
              <a href="/account" style={{ color: "var(--brand)" }}>
                account page
              </a>
              .
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {groups.map((group) => (
                <div key={group}>
                  <div className="fg-section-title" style={{ marginTop: 0 }}>
                    {group} · {byGroup[group].length} {byGroup[group].length === 1 ? "donor" : "donors"}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
                    {byGroup[group].map((d) => (
                      <div
                        key={d.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          border: "1px solid var(--rule)",
                          padding: "1rem 1.2rem",
                          background: "var(--surface)",
                        }}
                      >
                        <span style={{ fontSize: 13.5, color: "var(--ink-2)" }}>{d.city}</span>
                        <span className={`status-badge ${d.available ? "status-approved" : "status-rejected"}`}>
                          {d.available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p style={{ fontSize: 13, color: "var(--ink-3)", marginTop: "3rem" }}>
            For privacy, phone numbers aren&apos;t shown here — reach out to{" "}
            <a href="mailto:hello@jsec.org" style={{ color: "var(--brand)" }}>
              hello@jsec.org
            </a>{" "}
            and the committee will connect you with a matching donor.
          </p>
        </div>
      </section>
    </div>
  );
}
