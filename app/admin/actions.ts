"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

export async function approveMember(memberId: string) {
  const supabase = await createClient();

  const { data: newMemberId, error: idError } = await supabase.rpc("next_member_id");
  if (idError || !newMemberId) {
    return { error: "Could not generate a member ID. Please try again." };
  }

  const { error } = await supabase
    .from("members")
    .update({ status: "approved", member_id: newMemberId, approved_at: new Date().toISOString() })
    .eq("id", memberId);

  if (error) {
    return { error: "Approval failed — you may not have admin access, or the update was blocked." };
  }

  revalidatePath("/admin");
  return { error: null };
}

export async function rejectMember(memberId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("members").update({ status: "rejected" }).eq("id", memberId);

  if (error) {
    return { error: "Action failed — you may not have admin access, or the update was blocked." };
  }

  revalidatePath("/admin");
  return { error: null };
}
