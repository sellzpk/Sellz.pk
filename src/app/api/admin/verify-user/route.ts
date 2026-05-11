import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const SESSION_TOKEN = "s3llzpk-adm1n-v3rified-2026";

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("admin_session")?.value;
  if (cookie !== SESSION_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { userId, action, banReason } = body as { userId: string; action: string; banReason?: string };

  if (!userId || !action) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (action === "verify") {
    const { error } = await supabaseAdmin
      .from("users")
      .update({ cnic_verified: true })
      .eq("id", userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (action === "reject") {
    const { error } = await supabaseAdmin
      .from("users")
      .update({ cnic_front_url: null, cnic_back_url: null, selfie_url: null })
      .eq("id", userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (action === "ban") {
    const { error } = await supabaseAdmin
      .from("users")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ banned: true, banned_at: new Date().toISOString(), ban_reason: banReason ?? null } as any)
      .eq("id", userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
