"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

export async function upsertMyProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const age = Number(formData.get("age") || 0) || null;
  const height = String(formData.get("height") || "").trim() || null;
  const education = String(formData.get("education") || "").trim() || null;
  const profession = String(formData.get("profession") || "").trim() || null;
  const gotra = String(formData.get("gotra") || "").trim() || null;
  const city = String(formData.get("city") || "").trim() || null;
  const about = String(formData.get("about") || "").trim() || null;
  const photoPath = String(formData.get("photo_path") || "").trim() || null;

  const { error } = await supabase.from("matrimony_profiles").upsert(
    {
      member_id: user.id,
      age,
      height,
      education,
      profession,
      gotra,
      city,
      about,
      ...(photoPath ? { photo_path: photoPath } : {}),
    },
    { onConflict: "member_id" }
  );

  if (error) {
    return { error: "Could not save your profile. Please try again." };
  }

  revalidatePath("/matrimony/my-profile");
  return { error: null };
}

export async function submitForReview() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const { error } = await supabase.from("matrimony_profiles").update({ status: "pending" }).eq("member_id", user.id);

  if (error) {
    return { error: "Could not submit your profile." };
  }

  revalidatePath("/matrimony/my-profile");
  return { error: null };
}
