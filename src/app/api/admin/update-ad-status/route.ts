import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const SESSION_TOKEN = "s3llzpk-adm1n-v3rified-2026";

function checkAuth(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === SESSION_TOKEN;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { adId, status, reason } = await req.json();
  if (!adId || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const update: Record<string, unknown> = { status };
  if (reason) update.rejection_reason = reason;
  if (status === "active") update.rejection_reason = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabaseAdmin.from("ads").update(update as any).eq("id", adId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { adId } = await req.json();
  if (!adId) return NextResponse.json({ error: "Missing adId" }, { status: 400 });

  await supabaseAdmin.from("ad_photos").delete().eq("ad_id", adId);
  const { error } = await supabaseAdmin.from("ads").delete().eq("id", adId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
