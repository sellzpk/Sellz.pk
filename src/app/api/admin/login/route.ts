import { NextRequest, NextResponse } from "next/server";

const ADMIN_USERNAME = "nadeali";
const ADMIN_PASSWORD = "sellzpk@admin2026";
const SESSION_TOKEN = "s3llzpk-adm1n-v3rified-2026";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
  return response;
}
