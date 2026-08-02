import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return NextResponse.json(
      { error: "默认内容只能在本地开发环境写入源码。" },
      { status: 403 }
    );
  }

  try {
    const content = await request.json();
    if (!content || typeof content !== "object" || !Array.isArray(content.projects)) {
      return NextResponse.json({ error: "内容格式不正确。" }, { status: 400 });
    }

    const snapshotPath = path.join(
      process.cwd(),
      "src",
      "data",
      "content-snapshot.json"
    );
    await writeFile(snapshotPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "默认内容写入失败。" }, { status: 500 });
  }
}
