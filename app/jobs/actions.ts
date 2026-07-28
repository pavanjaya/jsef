"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

export async function createJobPost(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in as an approved member to post a job." };
  }

  const title = String(formData.get("title") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const contactEmail = String(formData.get("contact_email") || "").trim();

  if (!title || !description || !contactEmail) {
    return { error: "Title, description, and contact email are required." };
  }

  const { error } = await supabase.from("job_posts").insert({
    posted_by: user.id,
    title,
    company: company || null,
    location: location || null,
    description,
    contact_email: contactEmail,
  });

  if (error) {
    return { error: "Could not submit your job post — you may need to be an approved member first." };
  }

  revalidatePath("/jobs");
  return { error: null };
}

export async function approveJobPost(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("job_posts").update({ status: "approved" }).eq("id", id);

  if (error) {
    return { error: "Approval failed — you may not have admin access." };
  }

  revalidatePath("/admin");
  revalidatePath("/jobs");
  return { error: null };
}

export async function rejectJobPost(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("job_posts").update({ status: "rejected" }).eq("id", id);

  if (error) {
    return { error: "Action failed — you may not have admin access." };
  }

  revalidatePath("/admin");
  revalidatePath("/jobs");
  return { error: null };
}
