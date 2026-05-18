import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("keep_alive").insert({ pinged_at: new Date().toISOString() });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Unknown" }, { status: 500 });
  }
}
