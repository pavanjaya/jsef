import type { Metadata } from "next";
import { createClient } from "../../lib/supabase/server";
import JobPostModal from "./JobPostModal";

export const metadata: Metadata = {
  title: "Job Board — JSEC",
};

const SUPABASE_CONFIGURED = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

type JobPost = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  description: string;
  contact_email: string;
  created_at: string;
};

// Shown only while Supabase isn't configured, so the page can be previewed.
const PREVIEW_JOBS: JobPost[] = [
  {
    id: "preview-1",
    title: "Front Desk Executive",
    company: "Laxmi Hardware",
    location: "Nashik",
    description: "Looking for a front desk executive with good communication skills. Prior retail experience preferred.",
    contact_email: "hiring@example.com",
    created_at: "2026-07-10T10:00:00Z",
  },
  {
    id: "preview-2",
    title: "Junior Accountant",
    company: "Viva Enterprises",
    location: "Nashik",
    description: "Entry-level accounting role, Tally experience a plus. Freshers welcome to apply.",
    contact_email: "careers@example.com",
    created_at: "2026-07-05T10:00:00Z",
  },
  {
    id: "preview-3",
    title: "Digital Marketing Intern",
    company: "Community Member Business",
    location: "Remote",
    description: "3-month paid internship handling social media and basic ad campaigns. Great for students.",
    contact_email: "intern@example.com",
    created_at: "2026-06-28T10:00:00Z",
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function JobsPage() {
  let jobs = PREVIEW_JOBS;

  if (SUPABASE_CONFIGURED) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("job_posts")
      .select("id, title, company, location, description, contact_email, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    jobs = data ?? [];
  }

  return (
    <div className="page">
      {!SUPABASE_CONFIGURED && (
        <div style={{ background: "var(--accent-orange)", color: "#fff", textAlign: "center", padding: "10px", fontSize: 13, fontWeight: 600 }}>
          Preview mode — showing sample listings. Connect Supabase to make this page real.
        </div>
      )}
      <div className="page-banner">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <span className="eyebrow">Job Board</span>
            <h1 className="h1" style={{ maxWidth: 560, marginBottom: ".8rem" }}>
              Opportunities,
              <br />
              <em>shared.</em>
            </h1>
            <p className="lead" style={{ maxWidth: 480 }}>
              Openings posted by JSEC members, for JSEC members and their businesses.
            </p>
          </div>
          <JobPostModal />
        </div>
      </div>

      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          {jobs.length === 0 ? (
            <p style={{ color: "var(--ink-3)", fontSize: 14 }}>No openings posted right now — check back soon.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
              {jobs.map((job) => (
                <div key={job.id} className="evp-card" style={{ padding: "1.8rem" }}>
                  <span className="evp-tag">{job.company || "Community Listing"}</span>
                  <div className="evp-title" style={{ fontSize: 17, marginBottom: ".4rem" }}>
                    {job.title}
                  </div>
                  {job.location && <div className="evp-meta" style={{ marginBottom: ".8rem" }}>{job.location}</div>}
                  <p style={{ fontFamily: "var(--f-serif)", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7, marginBottom: "1.2rem" }}>
                    {job.description}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{formatDate(job.created_at)}</span>
                    <a href={`mailto:${job.contact_email}`} style={{ fontSize: 12, fontWeight: 700, color: "var(--brand)", textDecoration: "none" }}>
                      Apply →
                    </a>
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
