import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const adId = parseInt(id);
  if (isNaN(adId)) return NextResponse.json({ error: "Invalid ad id" }, { status: 400 });

  // Verify requester owns this ad
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adCheck } = await supabaseAdmin
    .from("ads")
    .select("seller_id, total_views, total_clicks, total_favorites, created_at")
    .eq("id", adId)
    .single();

  if (!adCheck || adCheck.seller_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const period = parseInt(req.nextUrl.searchParams.get("period") ?? "7");
  const since = new Date();
  since.setDate(since.getDate() - period);

  const [{ data: viewsData }, { data: clicksData }] = await Promise.all([
    supabaseAdmin
      .from("ad_views")
      .select("viewed_at")
      .eq("ad_id", adId)
      .gte("viewed_at", since.toISOString())
      .order("viewed_at", { ascending: true }),
    supabaseAdmin
      .from("ad_clicks")
      .select("click_type")
      .eq("ad_id", adId)
      .gte("clicked_at", since.toISOString()),
  ]);

  // Group views by day
  const viewsByDay: Record<string, number> = {};
  viewsData?.forEach(v => {
    const day = new Date(v.viewed_at).toLocaleDateString("en-PK", { month: "short", day: "numeric" });
    viewsByDay[day] = (viewsByDay[day] || 0) + 1;
  });

  const clicksByType = { whatsapp: 0, message: 0, phone: 0 };
  clicksData?.forEach(c => {
    const k = c.click_type as keyof typeof clicksByType;
    if (k in clicksByType) clicksByType[k]++;
  });

  const totalViews = adCheck.total_views ?? 0;
  const totalClicks = adCheck.total_clicks ?? 0;

  return NextResponse.json({
    totals: {
      views: totalViews,
      clicks: totalClicks,
      favorites: adCheck.total_favorites ?? 0,
    },
    period_views: Object.entries(viewsByDay).map(([date, count]) => ({ date, count })),
    clicks_breakdown: clicksByType,
    conversion_rate: totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0",
  });
}
