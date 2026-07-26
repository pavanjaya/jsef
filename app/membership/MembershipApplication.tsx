"use client";

import { useEffect, useState } from "react";
import Reveal from "../components/Reveal";
import { createClient } from "../../lib/supabase/client";

const PLAN_FEATS = [
  "Full Event Access",
  "Voting & Leadership Rights",
  "Scholarship Eligibility",
  "Business Directory Listing",
  "JangidTimes Subscription",
  "Networking & Mentorship",
] as const;

const CITIES_BY_STATE: Record<string, string[]> = {
  Maharashtra: [
    "Nashik", "Nashik Road", "Malegaon", "Manmad", "Yeola", "Sinnar", "Igatpuri", "Deolali", "Dindori", "Niphad",
    "Mumbai", "Pune", "Thane", "Nagpur", "Aurangabad (Chhatrapati Sambhajinagar)", "Ahmednagar", "Jalgaon", "Dhule",
    "Kolhapur", "Solapur",
  ],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun"],
  Assam: ["Guwahati", "Silchar", "Dibrugarh"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur"],
  Goa: ["Panaji", "Margao", "Vasco da Gama"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Manali"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad"],
  Karnataka: ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior"],
  Manipur: ["Imphal"],
  Meghalaya: ["Shillong"],
  Mizoram: ["Aizawl"],
  Nagaland: ["Kohima", "Dimapur"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  Sikkim: ["Gangtok"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  Telangana: ["Hyderabad", "Warangal"],
  Tripura: ["Agartala"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Noida"],
  Uttarakhand: ["Dehradun", "Haridwar", "Nainital"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
  "Andaman and Nicobar Islands": ["Port Blair"],
  Chandigarh: ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa"],
  Delhi: ["New Delhi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu"],
  Ladakh: ["Leh"],
  Lakshadweep: ["Kavaratti"],
  Puducherry: ["Puducherry"],
};

const STATES = [...Object.keys(CITIES_BY_STATE).sort((a, b) => (a === "Maharashtra" ? -1 : b === "Maharashtra" ? 1 : a.localeCompare(b))), "Other"];

const COUNTRIES = ["India", "United States", "United Kingdom", "United Arab Emirates", "Canada", "Australia", "Other"] as const;

export default function MembershipApplication() {
  const [open, setOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const closeModal = () => {
    setOpen(false);
    setPhotoPreview(null);
    setPhotoFile(null);
    setCity("");
    setState("");
    setCountry("India");
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

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onCountryChange = (value: string) => {
    setCountry(value);
    setState("");
    setCity("");
  };

  const onStateChange = (value: string) => {
    setState(value);
    setCity("");
  };

  const isIndia = country === "India";
  const cityOptions = isIndia && state && state !== "Other" ? [...(CITIES_BY_STATE[state] ?? []), "Other"] : [];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!state || !city) {
      setError("Please select your state and city.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError || !signUpData.user) {
      setError(signUpError?.message || "Could not create your account. Please try again.");
      setSubmitting(false);
      return;
    }

    const userId = signUpData.user.id;
    let photoPath: string | null = null;

    if (photoFile) {
      const ext = photoFile.name.split(".").pop() || "jpg";
      const path = `${userId}/photo.${ext}`;
      const { error: uploadError } = await supabase.storage.from("member-photos").upload(path, photoFile, { upsert: true });
      if (!uploadError) photoPath = path;
    }

    const { error: insertError } = await supabase.from("members").insert({
      id: userId,
      full_name: form.get("full_name"),
      fathers_or_husbands_name: form.get("fathers_or_husbands_name"),
      dob: form.get("dob") || null,
      gotra: form.get("gotra") || null,
      phone: form.get("phone"),
      email,
      occupation: form.get("occupation") || null,
      native_village: form.get("native_village") || null,
      aadhaar_number: form.get("aadhaar_number"),
      address_line: form.get("address_line"),
      city,
      state,
      country,
      pin_code: form.get("pin_code") || null,
      photo_path: photoPath,
    });

    setSubmitting(false);

    if (insertError) {
      setError("Your account was created, but we couldn't save your application details. Please contact us at hello@jsec.org.");
      return;
    }

    setSubmitted(true);
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

          {submitted ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div style={{ fontSize: 40, marginBottom: "1rem" }}>✅</div>
              <h3 style={{ marginBottom: ".8rem", fontSize: 22 }}>Application submitted</h3>
              <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7, marginBottom: "2rem" }}>
                Check your email to confirm your account, then log in to track your application. We&apos;ll review it
                within 5–7 business days.
              </p>
              <a href="/login" className="btn btn-ink" style={{ justifyContent: "center" }}>
                Go to Login →
              </a>
            </div>
          ) : (
            <>
              <h3 style={{ marginBottom: ".5rem", fontSize: 22 }}>Membership Application</h3>
              <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: "2rem" }}>
                We&apos;ll review your application and get in touch within 5–7 business days.
              </p>

              <form onSubmit={onSubmit}>
                <label className="photo-upload">
                  <span className="photo-upload-preview">
                    {photoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photoPreview} alt="" />
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
                    <input type="text" name="full_name" placeholder="Your full name" required />
                  </div>
                  <div className="fg">
                    <label>Father&apos;s / Husband&apos;s Name *</label>
                    <input type="text" name="fathers_or_husbands_name" placeholder="As per Aadhaar" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="fg">
                    <label>Date of Birth</label>
                    <input type="date" name="dob" />
                  </div>
                  <div className="fg">
                    <label>Gotra</label>
                    <input type="text" name="gotra" placeholder="e.g. Kashyap" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="fg">
                    <label>Phone *</label>
                    <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" required />
                  </div>
                  <div className="fg">
                    <label>Occupation</label>
                    <input type="text" name="occupation" placeholder="e.g. Student, Business" />
                  </div>
                </div>
                <div className="fg">
                  <label>Native Village / Hometown</label>
                  <input type="text" name="native_village" placeholder="Ancestral village, if applicable" />
                </div>

                <div className="fg-section-title">Identity Verification</div>
                <div className="fg">
                  <label>Aadhaar Card Number *</label>
                  <input type="text" name="aadhaar_number" inputMode="numeric" pattern="\d{12}" maxLength={12} placeholder="12-digit Aadhaar number" required />
                </div>
                <p style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: "-.6rem", marginBottom: "1.4rem" }}>
                  Used only for identity verification and membership records. Kept strictly confidential.
                </p>

                <div className="fg-section-title">Address</div>
                <div className="fg">
                  <label>Address Line *</label>
                  <input type="text" name="address_line" placeholder="House no., street, area" required />
                </div>
                <div className="form-row">
                  <div className="fg">
                    <label>Country *</label>
                    <select required value={country} onChange={(e) => onCountryChange(e.target.value)}>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="fg">
                    <label>State / Province *</label>
                    {isIndia ? (
                      <select required value={state} onChange={(e) => onStateChange(e.target.value)}>
                        <option value="" disabled>
                          Select…
                        </option>
                        {STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" placeholder="State / Province" required value={state} onChange={(e) => setState(e.target.value)} />
                    )}
                  </div>
                </div>
                <div className="form-row">
                  <div className="fg">
                    <label>City *</label>
                    {isIndia ? (
                      state === "Other" ? (
                        <input type="text" placeholder="Enter your city" required value={city} onChange={(e) => setCity(e.target.value)} />
                      ) : (
                        <select required value={city} disabled={!state} onChange={(e) => setCity(e.target.value)}>
                          <option value="" disabled>
                            {state ? "Select…" : "Select a state first"}
                          </option>
                          {cityOptions.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      )
                    ) : (
                      <input type="text" placeholder="City" required value={city} onChange={(e) => setCity(e.target.value)} />
                    )}
                  </div>
                  <div className="fg">
                    <label>{isIndia ? "PIN Code" : "Postal Code"}</label>
                    {isIndia ? (
                      <input type="text" name="pin_code" inputMode="numeric" pattern="\d{6}" maxLength={6} placeholder="422001" />
                    ) : (
                      <input type="text" name="pin_code" placeholder="Postal code" />
                    )}
                  </div>
                </div>

                <div className="fg-section-title">Create Your Login</div>
                <div className="fg">
                  <label>Email *</label>
                  <input type="email" name="email" placeholder="you@example.com" required />
                </div>
                <div className="form-row">
                  <div className="fg">
                    <label>Password *</label>
                    <input type="password" name="password" placeholder="At least 6 characters" minLength={6} required />
                  </div>
                  <div className="fg">
                    <label>Confirm Password *</label>
                    <input type="password" name="confirmPassword" placeholder="Re-enter password" minLength={6} required />
                  </div>
                </div>
                <p style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: "-.6rem", marginBottom: "1.4rem" }}>
                  You&apos;ll use this email and password to log in and track your application status.
                </p>

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

                {error && (
                  <p style={{ fontSize: 13, color: "#B91C1C", marginBottom: "1rem" }}>{error}</p>
                )}

                <button
                  type="submit"
                  className="btn btn-ink"
                  disabled={submitting}
                  style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 14, opacity: submitting ? 0.6 : 1 }}
                >
                  {submitting ? "Submitting…" : "Submit Application →"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
