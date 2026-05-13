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

  const { data: users, error } = await supabaseAdmin
    .from("users")
    .select("id, full_name, phone, city, ban_reason, banned_at, cnic_front_url, cnic_back_url, selfie_url")
    .eq("banned", true)
    .order("banned_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!users || users.length === 0) return NextResponse.json([]);

  const emailMap: Record<string, string> = {};
  await Promise.all(
    users.map(async (u) => {
      const { data } = await supabaseAdmin.auth.admin.getUserById(u.id);
      if (data?.user?.email) emailMap[u.id] = data.user.email;
    })
  );

  const result = await Promise.all(
    users.map(async (u) => ({
      ...u,
      email: emailMap[u.id] ?? null,
      cnic_front_signed: await signedUrl(u.cnic_front_url),
      cnic_back_signed: await signedUrl(u.cnic_back_url),
      selfie_signed: await signedUrl(u.selfie_url),
    }))
  );

  return NextResponse.json(result);
}
