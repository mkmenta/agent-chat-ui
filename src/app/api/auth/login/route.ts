import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const expectedPassword = process.env.AUTH_PASSWORD;
  if (!expectedPassword) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 500 });
  }

  const { username, password } = await request.json();
  const expectedUsername = process.env.AUTH_USERNAME || "admin";

  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const secret = process.env.AUTH_SECRET || expectedPassword;
  const token = await createSessionToken(secret);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return response;
}
