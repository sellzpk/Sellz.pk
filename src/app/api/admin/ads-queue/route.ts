import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const SESSION_TOKEN = "s3llzpk-adm1n-v3rified-2026";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("admin_session")?.value;
  if (cookie !== SESSION_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get("status") ?? "pending";
  const validStatuses = ["pending", "active", "rejected", "sold", "all"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabaseAdmin
    .from("ads")
    .select("id, title, price, city, status, rejection_reason, created_at, ownership_proof_url, seller_id, edit_count, edited_at")
    .order("created_at", { ascending: status === "pending" });

  if (status !== "all") query = query.eq("status", status);

  const { data: ads, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!ads || ads.length === 0) return NextResponse.json([]);

  const adIds = ads.map((a: { id: number }) => a.id);
  const { data: photos } = await supabaseAdmin
    .from("ad_photos")
    .select("ad_id, url, order_index")
    .in("ad_id", adIds);

  const sellerIds = [...new Set(ads.map((a: { seller_id: string }) => a.seller_id))];
  const { data: sellers } = await supabaseAdmin
    .from("users")
    .select("id, full_name, cnic_verified")
    .in("id", sellerIds);

  const sellerMap = Object.fromEntries((sellers ?? []).map(s => [s.id, s]));
  const photosMap: Record<number, { url: string; order_index: number }[]> = {};
  for (const p of (photos ?? [])) {
    if (!photosMap[p.ad_id]) photosMap[p.ad_id] = [];
    photosMap[p.ad_id].push({ url: p.url, order_index: p.order_index });
  }

  const result = ads.map((ad: { id: number; seller_id: string }) => ({
    ...ad,
    ad_photos: photosMap[ad.id] ?? [],
    users: sellerMap[ad.seller_id] ?? null,
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("admin_session")?.value;
  if (cookie !== SESSION_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { adId, action, rejectionReason } = await req.json();
  if (!adId || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  if (action === "approve") {
    const { error } = await supabaseAdmin.from("ads").update({ status: "active" }).eq("id", adId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (action === "reject") {
    const { error } = await supabaseAdmin
      .from("ads")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ status: "rejected", rejection_reason: rejectionReason ?? null } as any)
      .eq("id", adId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
