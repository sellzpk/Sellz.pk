import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("id, city")
          .eq("id", user.id)
          .single();
        if (!profile) {
          const fullName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? null;
          await supabase.from("users").insert({
            id: user.id,
            full_name: fullName,
            email: user.email,
          });
          return NextResponse.redirect(`${siteUrl}/onboarding`);
        }
        if (!profile.city) {
          return NextResponse.redirect(`${siteUrl}/onboarding`);
        }
      }
      return NextResponse.redirect(`${siteUrl}${next}`);
    }
  }

  return NextResponse.redirect(`${siteUrl}/auth?error=oauth`);
}
