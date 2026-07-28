import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin — JSEC",
};

const SUPABASE_CONFIGURED = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Shown only while Supabase isn't configured, so the page can be previewed.
const PREVIEW_MEMBERS = [
  {
    id: "preview-1",
    role: "member",
    status: "pending",
    member_id: null,
    full_name: "Harish Ramkishor Jangid",
    fathers_or_husbands_name: "Ramkishor Jangid",
    dob: "1994-03-12",
    gotra: "Kashyap",
    phone: "+91 99601 04109",
    email: "harish@example.com",
    occupation: "Business",
    native_village: "Sojat, Rajasthan",
    aadhaar_number: "XXXX XXXX 4109",
    address_line: "12, Panchavati Road",
    city: "Nashik",
    state: "Maharashtra",
    country: "India",
    pin_code: "422003",
    applied_at: "2026-07-20T10:00:00Z",
    approved_at: null,
  },
  {
    id: "preview-2",
    role: "member",
    status: "approved",
    member_id: "JSEC-2026-00012",
    full_name: "Pavan Tarachand Jangid",
    fathers_or_husbands_name: "Tarachand Jangid",
    dob: "1996-06-02",
    gotra: "Kashyap",
    phone: "+91 91702 09810",
    email: "pavan@example.com",
    occupation: "Design",
    native_village: "Nashik",
    aadhaar_number: "XXXX XXXX 9810",
    address_line: "4, College Road",
    city: "Nashik",
    state: "Maharashtra",
    country: "India",
    pin_code: "422005",
    applied_at: "2026-07-10T10:00:00Z",
    approved_at: "2026-07-15T10:00:00Z",
  },
  {
    id: "preview-3",
    role: "member",
    status: "rejected",
    member_id: null,
    full_name: "Sample Applicant",
    fathers_or_husbands_name: "Sample Father",
    dob: null,
    gotra: null,
    phone: "+91 90000 00000",
    email: "sample@example.com",
    occupation: null,
    native_village: null,
    aadhaar_number: "XXXX XXXX 0000",
    address_line: "1, Sample Street",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pin_code: "400001",
    applied_at: "2026-07-05T10:00:00Z",
    approved_at: null,
  },
];

export default async function AdminPage() {
  let members = PREVIEW_MEMBERS;

  if (SUPABASE_CONFIGURED) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: self } = await supabase.from("members").select("role").eq("id", user.id).single();
    if (self?.role !== "admin") redirect("/account");

    const { data } = await supabase.from("members").select("*").order("applied_at", { ascending: false });
    members = data ?? [];
  }

  return (
    <div className="page">
      {!SUPABASE_CONFIGURED && (
        <div style={{ background: "var(--accent-orange)", color: "#fff", textAlign: "center", padding: "10px", fontSize: 13, fontWeight: 600 }}>
          Preview mode — showing sample applications. Connect Supabase to make this page real.
        </div>
      )}
      <div className="page-banner">
        <div className="wrap">
          <span className="eyebrow">Admin</span>
          <h1 className="h1" style={{ maxWidth: 600, marginBottom: ".4rem" }}>
            Applications
          </h1>
          <p className="lead" style={{ maxWidth: 500 }}>
            Review and approve JSEC membership applications.
          </p>
        </div>
      </div>

      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <AdminClient members={members} />
        </div>
      </section>
    </div>
  );
}
