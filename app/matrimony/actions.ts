"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

export async function sendRequest(profileId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const { error } = await supabase.from("matrimony_requests").insert({ from_member_id: user.id, to_profile_id: profileId });

  if (error) {
    return { error: error.code === "23505" ? "You've already sent a request to this profile." : "Could not send request." };
  }

  revalidatePath("/matrimony");
  revalidatePath("/matrimony/my-profile");
  return { error: null };
}

export async function respondToRequest(requestId: string, accept: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("matrimony_requests")
    .update({ status: accept ? "accepted" : "declined" })
    .eq("id", requestId);

  if (error) {
    return { error: "Could not update this request." };
  }

  revalidatePath("/matrimony/my-profile");
  return { error: null };
}

export async function approveMatrimonyProfile(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("matrimony_profiles").update({ status: "approved" }).eq("id", id);

  if (error) {
    return { error: "Approval failed — you may not have admin access." };
  }

  revalidatePath("/admin");
  revalidatePath("/matrimony");
  return { error: null };
}

export async function rejectMatrimonyProfile(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("matrimony_profiles").update({ status: "draft" }).eq("id", id);

  if (error) {
    return { error: "Action failed — you may not have admin access." };
  }

  revalidatePath("/admin");
  revalidatePath("/matrimony");
  return { error: null };
}
