import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSession,
  getAdminPassword,
  isAdminAuthConfigured,
  passwordMatches,
  verifyAdminSession,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: verifyAdminSession(request),
    configured: isAdminAuthConfigured(),
  });
}

export async function POST(request: NextRequest) {
  const expectedPassword = getAdminPassword();
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: "服务器尚未配置 ADMIN_PASSWORD 和 ADMIN_SESSION_SECRET。" },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  if (!passwordMatches(password, expectedPassword)) {
    return NextResponse.json({ error: "密码错误，请重试" }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSession(), adminCookieOptions);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_COOKIE, "", { ...adminCookieOptions, maxAge: 0 });
  return response;
}
