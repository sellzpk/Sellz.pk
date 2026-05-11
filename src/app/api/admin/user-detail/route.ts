import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const SESSION_TOKEN = "s3llzpk-adm1n-v3rified-2026";

function extractPath(raw: string | null): string | null {
  if (!raw) return null;
  if (raw.includes("/object/")) {
    return raw.split("/cnic-documents/")[1]?.split("?")[0] ?? null;
  }
  return raw;
}

async function signedUrl(path: string | null): Promise<string | null> {
  const clean = extractPath(path);
  if (!clean) return null;
  const { data } = await supabaseAdmin.storage
    .from("cnic-documents")
    .createSignedUrl(clean, 3600);
  return data?.signedUrl ?? null;
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("admin_session")?.value;
  if (cookie !== SESSION_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const [{ data: user }, { count: adCount }] = await Promise.all([
    supabaseAdmin.from("users").select("*").eq("id", userId).single(),
    supabaseAdmin.from("ads").select("id", { count: "exact", head: true }).eq("seller_id", userId),
  ]);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const [front, back, selfie] = await Promise.all([
    signedUrl(user.cnic_front_url),
    signedUrl(user.cnic_back_url),
    signedUrl(user.selfie_url),
  ]);

  return NextResponse.json({
    ...user,
    cnic_front_signed: front,
    cnic_back_signed: back,
    selfie_signed: selfie,
    ad_count: adCount ?? 0,
  });
}
