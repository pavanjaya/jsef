import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin — JSEC",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: self } = await supabase.from("members").select("role").eq("id", user.id).single();
  if (self?.role !== "admin") redirect("/account");

  const { data: members } = await supabase.from("members").select("*").order("applied_at", { ascending: false });

  return (
    <div className="page">
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

      <section className="sec" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <AdminClient members={members ?? []} />
        </div>
      </section>
    </div>
  );
}
