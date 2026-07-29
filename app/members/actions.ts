"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

export async function setDirectoryVisible(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const visible = formData.get("directory_visible") === "on";

  await supabase.from("members").update({ directory_visible: visible }).eq("id", user.id);

  revalidatePath("/account");
  revalidatePath("/members");
}
