import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { adId, action } = await req.json();
    if (!adId || !["add", "remove"].includes(action)) {
      return NextResponse.json({ error: "Invalid params" }, { status: 400 });
    }

    if (action === "add") {
      await supabaseAdmin.rpc("increment_ad_favorites", { ad_id_param: adId });
    } else {
      await supabaseAdmin.rpc("decrement_ad_favorites", { ad_id_param: adId });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
