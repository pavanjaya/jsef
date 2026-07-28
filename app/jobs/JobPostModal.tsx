"use client";

import { useEffect, useState } from "react";
import { createJobPost } from "./actions";

export default function JobPostModal() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const closeModal = () => {
    setOpen(false);
    setError(null);
    setSubmitted(false);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const onSubmit = async (formData: FormData) => {
    setError(null);
    setSubmitting(true);
    const result = await createJobPost(formData);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
      <button type="button" className="btn btn-brand" onClick={() => setOpen(true)}>
        Post a Job →
      </button>

      <div
        className={`modal-overlay${open ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className="modal-box">
          <button type="button" className="modal-close" onClick={closeModal} aria-label="Close">
            &#x2715;
          </button>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <h3 style={{ marginBottom: ".6rem" }}>Submitted for review</h3>
              <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7 }}>
                Thanks — your post will appear on the Job Board once an admin approves it.
              </p>
              <button type="button" className="btn btn-ghost" style={{ marginTop: "1.5rem" }} onClick={closeModal}>
                Close
              </button>
            </div>
          ) : (
            <>
              <h3 style={{ marginBottom: "1.5rem", fontSize: 20 }}>Post a Job</h3>
              <form action={onSubmit}>
                <div className="fg">
                  <label htmlFor="job-title">Job Title *</label>
                  <input id="job-title" name="title" type="text" required />
                </div>
                <div className="form-row">
                  <div className="fg">
                    <label htmlFor="job-company">Company</label>
                    <input id="job-company" name="company" type="text" />
                  </div>
                  <div className="fg">
                    <label htmlFor="job-location">Location</label>
                    <input id="job-location" name="location" type="text" placeholder="e.g. Nashik / Remote" />
                  </div>
                </div>
                <div className="fg">
                  <label htmlFor="job-description">Description *</label>
                  <textarea id="job-description" name="description" required />
                </div>
                <div className="fg">
                  <label htmlFor="job-contact">Contact Email *</label>
                  <input id="job-contact" name="contact_email" type="email" required />
                </div>

                {error && <p style={{ fontSize: 13, color: "#B91C1C", marginBottom: "1rem" }}>{error}</p>}

                <button
                  type="submit"
                  className="btn btn-brand"
                  disabled={submitting}
                  style={{ width: "100%", justifyContent: "center", padding: 13, fontSize: 14, opacity: submitting ? 0.6 : 1 }}
                >
                  {submitting ? "Submitting…" : "Submit for Review →"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
