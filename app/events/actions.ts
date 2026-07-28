"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

export async function toggleRsvp(eventSlug: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to RSVP.", going: false };
  }

  const { data: existing } = await supabase
    .from("event_rsvps")
    .select("id")
    .eq("event_slug", eventSlug)
    .eq("member_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("event_rsvps").delete().eq("id", existing.id);
    if (error) return { error: "Could not update your RSVP.", going: true };
    revalidatePath("/events");
    return { error: null, going: false };
  }

  const { error } = await supabase.from("event_rsvps").insert({ event_slug: eventSlug, member_id: user.id });
  if (error) return { error: "Could not save your RSVP.", going: false };
  revalidatePath("/events");
  return { error: null, going: true };
}
