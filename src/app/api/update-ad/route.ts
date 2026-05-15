import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, title, description, price, condition, area, details, edit_count } = body;

    if (!id || !title || !price || !condition) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await supabase
      .from("ads")
      .update({
        title: String(title).trim(),
        description: description || null,
        price: Number(price),
        condition,
        area: area || null,
        details: details && Object.keys(details).length > 0 ? details : null,
        status: "pending",
        rejection_reason: null,
        edited_at: new Date().toISOString(),
        edit_count: Number(edit_count ?? 0),
      })
      .eq("id", Number(id))
      .eq("seller_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
