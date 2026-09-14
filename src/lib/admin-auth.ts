import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "portfolio-admin-session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getSessionSecret() {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  return process.env.NODE_ENV === "production" ? "" : "portfolio-local-development-secret";
}

export function getAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? "" : "admin123";
}

export function isAdminAuthConfigured() {
  return Boolean(getAdminPassword() && getSessionSecret());
}

function sign(expiresAt: string) {
  const secret = getSessionSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(expiresAt).digest("hex");
}

export function createAdminSession() {
  const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function verifyAdminSession(request: NextRequest) {
  const value = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!value) return false;

  const [expiresAt, signature] = value.split(".");
  if (!expiresAt || !signature || Number(expiresAt) <= Date.now() / 1000) return false;

  const expected = sign(expiresAt);
  if (!expected || signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function passwordMatches(value: string, expected: string) {
  const left = Buffer.from(value);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
