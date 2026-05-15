import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { adId, type, viewerId, clickerId } = await req.json();
    if (!adId || !type) return NextResponse.json({ ok: false });

    if (type === "view") {
      await Promise.all([
        supabaseAdmin.from("ad_views").insert({
          ad_id: adId,
          viewer_id: viewerId ?? null,
          viewed_at: new Date().toISOString(),
        }),
        supabaseAdmin.rpc("increment_ad_views", { ad_id_param: adId }),
      ]);
    } else if (type.startsWith("click_")) {
      const clickType = type.replace("click_", "") as string;
      await Promise.all([
        supabaseAdmin.from("ad_clicks").insert({
          ad_id: adId,
          clicker_id: clickerId ?? null,
          click_type: clickType,
          clicked_at: new Date().toISOString(),
        }),
        supabaseAdmin.rpc("increment_ad_clicks", { ad_id_param: adId }),
      ]);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
