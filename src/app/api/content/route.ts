import { NextRequest, NextResponse } from "next/server";
import type { SiteContent } from "@/data/defaults";
import { verifyAdminSession } from "@/lib/admin-auth";
import { isSiteContent, loadSiteContent, persistSiteContent } from "@/lib/content-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CONTENT_BYTES = 2 * 1024 * 1024;

function response(content: SiteContent) {
  return NextResponse.json(content, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function GET() {
  return response(await loadSiteContent());
}

export async function POST(request: NextRequest) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: "请先登录后台" }, { status: 401 });
  }

  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_CONTENT_BYTES) {
    return NextResponse.json({ error: "内容数据过大" }, { status: 413 });
  }

  try {
    const content = await request.json() as unknown;
    if (!isSiteContent(content)) {
      return NextResponse.json({ error: "内容格式不正确" }, { status: 400 });
    }

    const serialized = `${JSON.stringify(content, null, 2)}\n`;
    if (Buffer.byteLength(serialized, "utf8") > MAX_CONTENT_BYTES) {
      return NextResponse.json({ error: "内容数据过大" }, { status: 413 });
    }

    await persistSiteContent(content);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Content write error:", error);
    return NextResponse.json({ error: "内容保存失败" }, { status: 500 });
  }
}
