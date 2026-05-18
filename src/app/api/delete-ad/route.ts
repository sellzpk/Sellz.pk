import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { adId } = await req.json();
    if (!adId) return NextResponse.json({ error: "Missing adId" }, { status: 400 });

    // Verify ownership before deleting
    const { data: ad } = await supabaseAdmin
      .from("ads")
      .select("seller_id")
      .eq("id", Number(adId))
      .single();

    if (!ad || ad.seller_id !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete photos first, then ad
    await supabaseAdmin.from("ad_photos").delete().eq("ad_id", Number(adId));
    const { error } = await supabaseAdmin.from("ads").delete().eq("id", Number(adId));

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
