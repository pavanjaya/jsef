import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import RequestButton from "./RequestButton";

export const metadata: Metadata = {
  title: "Matrimony — JSEC",
};

const SUPABASE_CONFIGURED = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

type Profile = {
  id: string;
  age: number | null;
  height: string | null;
  education: string | null;
  profession: string | null;
  gotra: string | null;
  city: string | null;
  about: string | null;
  photo_path: string | null;
};

// Shown only while Supabase isn't configured. No names, no photos — same
// generic-placeholder rule as the rest of the preview-mode content.
const PREVIEW_PROFILES: Profile[] = [
  { id: "preview-1", age: 27, height: "5' 6\"", education: "B.Tech", profession: "Software Engineer", gotra: "Kashyap", city: "Nashik", about: "Enjoys cricket and community volunteering.", photo_path: null },
  { id: "preview-2", age: 29, height: "5' 4\"", education: "MBA", profession: "Marketing Manager", gotra: "—", city: "Pune", about: "Loves travel and classical music.", photo_path: null },
  { id: "preview-3", age: 31, height: "5' 9\"", education: "CA", profession: "Chartered Accountant", gotra: "Kashyap", city: "Mumbai", about: "Family-oriented, enjoys cooking.", photo_path: null },
];

export default async function MatrimonyPage() {
  let profiles = PREVIEW_PROFILES;
  let sentIds: string[] = [];
  let myProfileId: string | null = null;

  if (SUPABASE_CONFIGURED) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data } = await supabase.rpc("browse_matrimony_profiles");
    profiles = data ?? [];

    // photo_path is a path inside the private matrimony-photos bucket, not a
    // URL — swap each for a short-lived signed URL before rendering.
    profiles = await Promise.all(
      profiles.map(async (p) => {
        if (!p.photo_path) return p;
        const { data: signed } = await supabase.storage.from("matrimony-photos").createSignedUrl(p.photo_path, 300);
        return { ...p, photo_path: signed?.signedUrl ?? null };
      })
    );

    const { data: mine } = await supabase.from("matrimony_profiles").select("id").eq("member_id", user.id).maybeSingle();
    myProfileId = mine?.id ?? null;
    if (myProfileId) profiles = profiles.filter((p) => p.id !== myProfileId);

    const { data: sent } = await supabase.from("matrimony_requests").select("to_profile_id").eq("from_member_id", user.id);
    sentIds = (sent ?? []).map((r) => r.to_profile_id);
  }

  return (
    <div className="page">
      {!SUPABASE_CONFIGURED && (
        <div style={{ background: "var(--accent-orange)", color: "#fff", textAlign: "center", padding: "10px", fontSize: 13, fontWeight: 600 }}>
          Preview mode — showing generic placeholder profiles. Connect Supabase to make this page real.
        </div>
      )}
      <div className="page-banner">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <span className="eyebrow">Matrimony</span>
            <h1 className="h1" style={{ maxWidth: 560, marginBottom: ".8rem" }}>
              Jangid
              <br />
              <em>matrimony.</em>
            </h1>
            <p className="lead" style={{ maxWidth: 480 }}>
              Browse anonymously — no names or contact details are shown until a request is sent and accepted.
            </p>
          </div>
          <Link href="/matrimony/my-profile" className="btn btn-ink">
            My Profile →
          </Link>
        </div>
      </div>

      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          {profiles.length === 0 ? (
            <p style={{ color: "var(--ink-3)", fontSize: 14 }}>No profiles to show yet.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
              {profiles.map((p) => (
                <div key={p.id} style={{ border: "1px solid var(--rule)", background: "var(--surface)", overflow: "hidden" }}>
                  <div
                    style={{
                      aspectRatio: "1",
                      background: p.photo_path ? `url('${p.photo_path}') center/cover` : "var(--warm)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 40,
                      color: "var(--ink-3)",
                    }}
                  >
                    {!p.photo_path && "🪷"}
                  </div>
                  <div style={{ padding: "1.3rem" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: ".2rem" }}>
                      {p.age ? `${p.age} yrs` : "Age not shared"}
                      {p.height ? ` · ${p.height}` : ""}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginBottom: ".6rem" }}>
                      {[p.education, p.profession].filter(Boolean).join(" · ") || "—"}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: ".8rem" }}>
                      {[p.gotra && p.gotra !== "—" ? `${p.gotra} Gotra` : null, p.city].filter(Boolean).join(" · ")}
                    </div>
                    {p.about && (
                      <p style={{ fontFamily: "var(--f-serif)", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: "1rem" }}>
                        {p.about}
                      </p>
                    )}
                    <RequestButton profileId={p.id} alreadySent={sentIds.includes(p.id)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
