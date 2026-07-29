"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { upsertMyProfile, submitForReview } from "./profileActions";

type Profile = {
  age: number | null;
  height: string | null;
  education: string | null;
  profession: string | null;
  gotra: string | null;
  city: string | null;
  about: string | null;
  photo_path: string | null;
  status: string;
};

export default function MyProfileForm({ profile }: { profile: Profile | null }) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (formData: FormData) => {
    setError(null);
    setSaved(false);
    setSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setSubmitting(false);
      return;
    }

    if (photoFile) {
      const ext = photoFile.name.split(".").pop() || "jpg";
      const path = `${user.id}/photo.${ext}`;
      const { error: uploadError } = await supabase.storage.from("matrimony-photos").upload(path, photoFile, { upsert: true });
      if (!uploadError) formData.set("photo_path", path);
    }

    const result = await upsertMyProfile(formData);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    setSaved(true);
  };

  const onSubmitForReview = async () => {
    setError(null);
    setSubmitting(true);
    const result = await submitForReview();
    setSubmitting(false);
    if (result.error) setError(result.error);
  };

  return (
    <form action={onSubmit}>
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
          <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Profile photo</span>
          <span style={{ display: "block", fontSize: 12, color: "var(--ink-3)" }}>
            Only shown to members who accept a request. Optional.
          </span>
        </span>
        <input type="file" accept="image/*" onChange={onPhotoChange} style={{ display: "none" }} />
      </label>

      <div className="form-row">
        <div className="fg">
          <label htmlFor="age">Age</label>
          <input id="age" name="age" type="number" min={18} defaultValue={profile?.age ?? ""} />
        </div>
        <div className="fg">
          <label htmlFor="height">Height</label>
          <input id="height" name="height" type="text" placeholder={'e.g. 5\' 6"'} defaultValue={profile?.height ?? ""} />
        </div>
      </div>
      <div className="form-row">
        <div className="fg">
          <label htmlFor="education">Education</label>
          <input id="education" name="education" type="text" defaultValue={profile?.education ?? ""} />
        </div>
        <div className="fg">
          <label htmlFor="profession">Profession</label>
          <input id="profession" name="profession" type="text" defaultValue={profile?.profession ?? ""} />
        </div>
      </div>
      <div className="form-row">
        <div className="fg">
          <label htmlFor="gotra">Gotra</label>
          <input id="gotra" name="gotra" type="text" defaultValue={profile?.gotra ?? ""} />
        </div>
        <div className="fg">
          <label htmlFor="city">City</label>
          <input id="city" name="city" type="text" defaultValue={profile?.city ?? ""} />
        </div>
      </div>
      <div className="fg">
        <label htmlFor="about">About</label>
        <textarea id="about" name="about" placeholder="A short bio for your profile." defaultValue={profile?.about ?? ""} />
      </div>

      {error && <p style={{ fontSize: 13, color: "#B91C1C", marginBottom: "1rem" }}>{error}</p>}
      {saved && <p style={{ fontSize: 13, color: "#15803D", marginBottom: "1rem" }}>Saved.</p>}

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <button type="submit" className="btn btn-ghost" disabled={submitting} style={{ flex: 1, justifyContent: "center" }}>
          {submitting ? "Saving…" : "Save Profile"}
        </button>
        <button
          type="button"
          className="btn btn-brand"
          disabled={submitting}
          onClick={onSubmitForReview}
          style={{ flex: 1, justifyContent: "center" }}
        >
          {profile?.status === "pending" ? "Awaiting Review" : "Submit for Review →"}
        </button>
      </div>
    </form>
  );
}
