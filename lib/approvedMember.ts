import { createClient } from "./supabase/server";

export type ApprovedMember = {
  member_id: string;
  full_name: string;
  gotra: string | null;
  city: string;
  state: string;
  approved_at: string;
  photoDataUri: string | null;
};

/**
 * Verifies the current session belongs to an approved member and returns
 * their public-facing details (plus their photo as an embeddable data URI,
 * if they uploaded one). Returns null if unauthenticated or not approved —
 * callers should respond with 401/403 accordingly.
 */
export async function getApprovedMember(): Promise<ApprovedMember | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: member } = await supabase.from("members").select("*").eq("id", user.id).single();
  if (!member || member.status !== "approved" || !member.member_id || !member.approved_at) return null;

  let photoDataUri: string | null = null;
  if (member.photo_path) {
    const { data: signed } = await supabase.storage.from("member-photos").createSignedUrl(member.photo_path, 60);
    if (signed?.signedUrl) {
      try {
        const res = await fetch(signed.signedUrl);
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer());
          const contentType = res.headers.get("content-type") || "image/jpeg";
          photoDataUri = `data:${contentType};base64,${buf.toString("base64")}`;
        }
      } catch {
        // Photo fetch failed — PDFs render fine without it.
      }
    }
  }

  return {
    member_id: member.member_id,
    full_name: member.full_name,
    gotra: member.gotra,
    city: member.city,
    state: member.state,
    approved_at: member.approved_at,
    photoDataUri,
  };
}
