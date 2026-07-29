import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestId = request.nextUrl.searchParams.get("requestId");
  if (!requestId) {
    return NextResponse.json({ error: "Missing requestId." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("get_matrimony_contact", { p_request_id: requestId });

  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: "This request hasn't been accepted yet, or you're not a party to it." }, { status: 403 });
  }

  return NextResponse.json(data[0]);
}
