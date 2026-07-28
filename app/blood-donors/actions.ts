"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

export async function upsertDonorProfile(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const bloodGroup = String(formData.get("blood_group") || "");
  const city = String(formData.get("city") || "").trim();
  const available = formData.get("available") === "on";

  if (!bloodGroup || !city) return;

  await supabase
    .from("blood_donors")
    .upsert({ member_id: user.id, blood_group: bloodGroup, city, available }, { onConflict: "member_id" });

  revalidatePath("/account");
  revalidatePath("/blood-donors");
}

export async function removeDonorProfile(): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("blood_donors").delete().eq("member_id", user.id);

  revalidatePath("/account");
  revalidatePath("/blood-donors");
}
