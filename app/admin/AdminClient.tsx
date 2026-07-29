"use client";

import { useMemo, useState, useTransition } from "react";
import { approveMember, rejectMember } from "./actions";
import { approveJobPost, rejectJobPost } from "../jobs/actions";
import { approveMatrimonyProfile, rejectMatrimonyProfile } from "../matrimony/actions";

type JobPost = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  description: string;
  contact_email: string;
  status: string;
  created_at: string;
};

type MatrimonyProfile = {
  id: string;
  photo_url: string | null;
  age: number | null;
  height: string | null;
  education: string | null;
  profession: string | null;
  gotra: string | null;
  city: string | null;
  about: string | null;
  status: string;
  created_at: string;
  applicant_name: string | null;
  applicant_phone: string | null;
};

type Member = {
  id: string;
  role: string;
  status: string;
  member_id: string | null;
  full_name: string;
  fathers_or_husbands_name: string;
  dob: string | null;
  gotra: string | null;
  phone: string;
  email: string;
  occupation: string | null;
  native_village: string | null;
  aadhaar_number: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  pin_code: string | null;
  applied_at: string;
  approved_at: string | null;
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
] as const;

const STATUS_CLASS: Record<string, string> = {
  draft: "status-pending",
  pending: "status-pending",
  approved: "status-approved",
  rejected: "status-rejected",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminClient({
  members,
  jobPosts,
  matrimonyProfiles,
}: {
  members: Member[];
  jobPosts: JobPost[];
  matrimonyProfiles: MatrimonyProfile[];
}) {
  const [tab, setTab] = useState<"applications" | "jobs" | "matrimony">("applications");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Member | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<MatrimonyProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(
    () => (filter === "all" ? members : members.filter((m) => m.status === filter)),
    [members, filter]
  );

  const pendingJobs = jobPosts.filter((j) => j.status === "pending");
  const pendingProfiles = matrimonyProfiles.filter((p) => p.status === "pending");

  const runAction = (action: (id: string) => Promise<{ error: string | null }>, id: string) => {
    setError(null);
    startTransition(async () => {
      const result = await action(id);
      if (result.error) setError(result.error);
      else {
        setSelected(null);
        setSelectedJob(null);
        setSelectedProfile(null);
      }
    });
  };

  return (
    <>
      <div className="dir-filters" style={{ marginBottom: "2rem" }}>
        <button className={`dir-filter-btn${tab === "applications" ? " active" : ""}`} onClick={() => setTab("applications")}>
          Applications ({members.length})
        </button>
        <button className={`dir-filter-btn${tab === "jobs" ? " active" : ""}`} onClick={() => setTab("jobs")}>
          Job Posts ({pendingJobs.length} pending)
        </button>
        <button className={`dir-filter-btn${tab === "matrimony" ? " active" : ""}`} onClick={() => setTab("matrimony")}>
          Matrimony Profiles ({pendingProfiles.length} pending)
        </button>
      </div>

      {tab === "applications" && (
        <>
      <div className="dir-filters" style={{ marginTop: 0 }}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`dir-filter-btn${filter === f.key ? " active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label} ({f.key === "all" ? members.length : members.filter((m) => m.status === f.key).length})
          </button>
        ))}
      </div>

      <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: ".8rem" }}>
        {filtered.length === 0 && <p style={{ color: "var(--ink-3)", fontSize: 14 }}>No applications here.</p>}
        {filtered.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelected(m)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              textAlign: "left",
              width: "100%",
              background: "var(--bg)",
              border: "1px solid var(--rule)",
              padding: "1rem 1.4rem",
              cursor: "pointer",
              font: "inherit",
              color: "inherit",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{m.full_name}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
                {m.email} · Applied {formatDate(m.applied_at)}
              </div>
            </div>
            <span className={`status-badge ${STATUS_CLASS[m.status]}`}>{m.status}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="modal-overlay open"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className="modal-box">
            <button type="button" className="modal-close" onClick={() => setSelected(null)} aria-label="Close">
              &#x2715;
            </button>

            <h3 style={{ marginBottom: ".3rem", fontSize: 22 }}>{selected.full_name}</h3>
            <span className={`status-badge ${STATUS_CLASS[selected.status]}`} style={{ marginBottom: "1.5rem", display: "inline-block" }}>
              {selected.status}
            </span>

            <div className="fg-section-title" style={{ marginTop: 0 }}>Personal Details</div>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.9 }}>
              Father&apos;s / Husband&apos;s Name: {selected.fathers_or_husbands_name}
              <br />
              Date of Birth: {selected.dob || "—"}
              <br />
              Gotra: {selected.gotra || "—"}
              <br />
              Occupation: {selected.occupation || "—"}
              <br />
              Native Village: {selected.native_village || "—"}
            </p>

            <div className="fg-section-title">Contact</div>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.9 }}>
              Phone: {selected.phone}
              <br />
              Email: {selected.email}
            </p>

            <div className="fg-section-title">Identity</div>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.9 }}>Aadhaar: {selected.aadhaar_number}</p>

            <div className="fg-section-title">Address</div>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.9 }}>
              {selected.address_line}, {selected.city}, {selected.state} {selected.pin_code || ""}, {selected.country}
            </p>

            {selected.member_id && (
              <>
                <div className="fg-section-title">Membership</div>
                <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.9 }}>
                  Member ID: {selected.member_id}
                  <br />
                  Approved: {selected.approved_at ? formatDate(selected.approved_at) : "—"}
                </p>
              </>
            )}

            {error && <p style={{ fontSize: 13, color: "#B91C1C", margin: "1rem 0" }}>{error}</p>}

            {selected.status === "pending" && (
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  className="btn btn-brand"
                  disabled={pending}
                  style={{ flex: 1, justifyContent: "center", opacity: pending ? 0.6 : 1 }}
                  onClick={() => runAction(approveMember, selected.id)}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={pending}
                  style={{ flex: 1, justifyContent: "center", opacity: pending ? 0.6 : 1 }}
                  onClick={() => runAction(rejectMember, selected.id)}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
        </>
      )}

      {tab === "jobs" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
            {jobPosts.length === 0 && <p style={{ color: "var(--ink-3)", fontSize: 14 }}>No job posts yet.</p>}
            {jobPosts.map((j) => (
              <button
                key={j.id}
                onClick={() => setSelectedJob(j)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  textAlign: "left",
                  width: "100%",
                  background: "var(--bg)",
                  border: "1px solid var(--rule)",
                  padding: "1rem 1.4rem",
                  cursor: "pointer",
                  font: "inherit",
                  color: "inherit",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{j.title}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
                    {j.company || "Community listing"} · Posted {formatDate(j.created_at)}
                  </div>
                </div>
                <span className={`status-badge ${STATUS_CLASS[j.status]}`}>{j.status}</span>
              </button>
            ))}
          </div>

          {selectedJob && (
            <div
              className="modal-overlay open"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedJob(null);
              }}
            >
              <div className="modal-box">
                <button type="button" className="modal-close" onClick={() => setSelectedJob(null)} aria-label="Close">
                  &#x2715;
                </button>

                <h3 style={{ marginBottom: ".3rem", fontSize: 22 }}>{selectedJob.title}</h3>
                <span className={`status-badge ${STATUS_CLASS[selectedJob.status]}`} style={{ marginBottom: "1.5rem", display: "inline-block" }}>
                  {selectedJob.status}
                </span>

                <div className="fg-section-title" style={{ marginTop: 0 }}>Details</div>
                <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.9 }}>
                  Company: {selectedJob.company || "—"}
                  <br />
                  Location: {selectedJob.location || "—"}
                  <br />
                  Contact: {selectedJob.contact_email}
                </p>

                <div className="fg-section-title">Description</div>
                <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.9 }}>{selectedJob.description}</p>

                {error && <p style={{ fontSize: 13, color: "#B91C1C", margin: "1rem 0" }}>{error}</p>}

                {selectedJob.status === "pending" && (
                  <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                    <button
                      type="button"
                      className="btn btn-brand"
                      disabled={pending}
                      style={{ flex: 1, justifyContent: "center", opacity: pending ? 0.6 : 1 }}
                      onClick={() => runAction(approveJobPost, selectedJob.id)}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      disabled={pending}
                      style={{ flex: 1, justifyContent: "center", opacity: pending ? 0.6 : 1 }}
                      onClick={() => runAction(rejectJobPost, selectedJob.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "matrimony" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
            {matrimonyProfiles.length === 0 && <p style={{ color: "var(--ink-3)", fontSize: 14 }}>No matrimony profiles yet.</p>}
            {matrimonyProfiles.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProfile(p)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  textAlign: "left",
                  width: "100%",
                  background: "var(--bg)",
                  border: "1px solid var(--rule)",
                  padding: "1rem 1.4rem",
                  cursor: "pointer",
                  font: "inherit",
                  color: "inherit",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{p.applicant_name || "Unknown applicant"}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
                    {[p.age ? `${p.age} yrs` : null, p.city].filter(Boolean).join(" · ") || "—"} · Updated {formatDate(p.created_at)}
                  </div>
                </div>
                <span className={`status-badge ${STATUS_CLASS[p.status]}`}>{p.status}</span>
              </button>
            ))}
          </div>

          {selectedProfile && (
            <div
              className="modal-overlay open"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedProfile(null);
              }}
            >
              <div className="modal-box">
                <button type="button" className="modal-close" onClick={() => setSelectedProfile(null)} aria-label="Close">
                  &#x2715;
                </button>

                <h3 style={{ marginBottom: ".3rem", fontSize: 22 }}>{selectedProfile.applicant_name || "Unknown applicant"}</h3>
                <span className={`status-badge ${STATUS_CLASS[selectedProfile.status]}`} style={{ marginBottom: "1.5rem", display: "inline-block" }}>
                  {selectedProfile.status}
                </span>

                {selectedProfile.photo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedProfile.photo_url}
                    alt=""
                    style={{ width: 96, height: 96, objectFit: "cover", marginBottom: "1rem" }}
                  />
                )}

                <div className="fg-section-title" style={{ marginTop: 0 }}>Profile</div>
                <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.9 }}>
                  Age: {selectedProfile.age ?? "—"}
                  <br />
                  Height: {selectedProfile.height || "—"}
                  <br />
                  Education: {selectedProfile.education || "—"}
                  <br />
                  Profession: {selectedProfile.profession || "—"}
                  <br />
                  Gotra: {selectedProfile.gotra || "—"}
                  <br />
                  City: {selectedProfile.city || "—"}
                </p>

                <div className="fg-section-title">About</div>
                <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.9 }}>{selectedProfile.about || "—"}</p>

                <div className="fg-section-title">Contact (admin only)</div>
                <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.9 }}>{selectedProfile.applicant_phone || "—"}</p>

                {error && <p style={{ fontSize: 13, color: "#B91C1C", margin: "1rem 0" }}>{error}</p>}

                {selectedProfile.status === "pending" && (
                  <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                    <button
                      type="button"
                      className="btn btn-brand"
                      disabled={pending}
                      style={{ flex: 1, justifyContent: "center", opacity: pending ? 0.6 : 1 }}
                      onClick={() => runAction(approveMatrimonyProfile, selectedProfile.id)}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      disabled={pending}
                      style={{ flex: 1, justifyContent: "center", opacity: pending ? 0.6 : 1 }}
                      onClick={() => runAction(rejectMatrimonyProfile, selectedProfile.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
