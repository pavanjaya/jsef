"use client";

import { useEffect, useState } from "react";
import Reveal from "../components/Reveal";

const PLAN_FEATS = [
  "Full Event Access",
  "Voting & Leadership Rights",
  "Scholarship Eligibility",
  "Business Directory Listing",
  "JangidTimes Subscription",
  "Networking & Mentorship",
] as const;

const CITIES = [
  "Nashik",
  "Nashik Road",
  "Malegaon",
  "Manmad",
  "Yeola",
  "Sinnar",
  "Igatpuri",
  "Deolali",
  "Dindori",
  "Niphad",
  "Mumbai",
  "Pune",
  "Thane",
  "Nagpur",
  "Aurangabad (Chhatrapati Sambhajinagar)",
  "Ahmednagar",
  "Jalgaon",
  "Dhule",
  "Kolhapur",
  "Solapur",
  "Other",
] as const;

const STATES = [
  "Maharashtra",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
  "Other",
] as const;

const COUNTRIES = ["India", "United States", "United Kingdom", "United Arab Emirates", "Canada", "Australia", "Other"] as const;

export default function MembershipApplication() {
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");

  const closeModal = () => {
    setOpen(false);
    setPhoto(null);
    setCity("");
    setState("");
    setCountry("India");
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

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Application submitted. We will contact you within 5–7 business days.");
    closeModal();
  };

  return (
    <>
      <div className="mem-plans">
        <Reveal className="mem-plan featured">
          <div className="mem-plan-name">JSEC Membership</div>
          <div className="mem-plan-price">₹1,100</div>
          <div className="mem-plan-period">Lifetime membership · one-time fee</div>
          <ul className="mem-plan-feats">
            {PLAN_FEATS.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button type="button" className="btn btn-brand" style={{ width: "100%", justifyContent: "center" }} onClick={() => setOpen(true)}>
            Apply Now →
          </button>
        </Reveal>
      </div>

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

          <h3 style={{ marginBottom: ".5rem", fontSize: 22 }}>Membership Application</h3>
          <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: "2rem" }}>
            We&apos;ll review your application and get in touch within 5–7 business days.
          </p>

          <form onSubmit={onSubmit}>
            <label className="photo-upload">
              <span className="photo-upload-preview">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt="" />
                ) : (
                  "PHOTO"
                )}
              </span>
              <span>
                <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Passport-size photo</span>
                <span style={{ display: "block", fontSize: 12, color: "var(--ink-3)" }}>Used for your member ID card. Optional.</span>
              </span>
              <input type="file" accept="image/*" onChange={onPhotoChange} style={{ display: "none" }} />
            </label>

            <div className="fg-section-title">Personal Details</div>
            <div className="form-row">
              <div className="fg">
                <label>Full Name *</label>
                <input type="text" placeholder="Your full name" required />
              </div>
              <div className="fg">
                <label>Father&apos;s / Husband&apos;s Name *</label>
                <input type="text" placeholder="As per Aadhaar" required />
              </div>
            </div>
            <div className="form-row">
              <div className="fg">
                <label>Date of Birth</label>
                <input type="date" />
              </div>
              <div className="fg">
                <label>Gotra</label>
                <input type="text" placeholder="e.g. Kashyap" />
              </div>
            </div>
            <div className="form-row">
              <div className="fg">
                <label>Phone *</label>
                <input type="tel" placeholder="+91 XXXXX XXXXX" required />
              </div>
              <div className="fg">
                <label>Email</label>
                <input type="email" placeholder="you@example.com" />
              </div>
            </div>
            <div className="form-row">
              <div className="fg">
                <label>Occupation</label>
                <input type="text" placeholder="e.g. Student, Business" />
              </div>
              <div className="fg">
                <label>Native Village / Hometown</label>
                <input type="text" placeholder="Ancestral village, if applicable" />
              </div>
            </div>

            <div className="fg-section-title">Identity Verification</div>
            <div className="fg">
              <label>Aadhaar Card Number *</label>
              <input type="text" inputMode="numeric" pattern="\d{12}" maxLength={12} placeholder="12-digit Aadhaar number" required />
            </div>
            <p style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: "-.6rem", marginBottom: "1.4rem" }}>
              Used only for identity verification and membership records. Kept strictly confidential.
            </p>

            <div className="fg-section-title">Address</div>
            <div className="fg">
              <label>Address Line *</label>
              <input type="text" placeholder="House no., street, area" required />
            </div>
            <div className="form-row">
              <div className="fg">
                <label>City *</label>
                <select required value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="" disabled>
                    Select…
                  </option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {city === "Other" && (
                  <input type="text" placeholder="Enter your city" required style={{ marginTop: ".6rem" }} />
                )}
              </div>
              <div className="fg">
                <label>State *</label>
                <select required value={state} onChange={(e) => setState(e.target.value)}>
                  <option value="" disabled>
                    Select…
                  </option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {state === "Other" && (
                  <input type="text" placeholder="Enter your state" required style={{ marginTop: ".6rem" }} />
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="fg">
                <label>PIN Code</label>
                <input type="text" inputMode="numeric" pattern="\d{6}" maxLength={6} placeholder="422001" />
              </div>
              <div className="fg">
                <label>Country *</label>
                <select required value={country} onChange={(e) => setCountry(e.target.value)}>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {country === "Other" && (
                  <input type="text" placeholder="Enter your country" required style={{ marginTop: ".6rem" }} />
                )}
              </div>
            </div>

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
              <span style={{ fontSize: 13, color: "var(--ink-2)" }}>JSEC Membership — Lifetime</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--brand)" }}>₹1,100</span>
            </div>

            <button type="submit" className="btn btn-ink" style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 14 }}>
              Submit Application →
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
