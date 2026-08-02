import { NextRequest, NextResponse } from "next/server";

const ALLOWED_DIRS = ["projects", "avatar", "wallpapers"];
const IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
const VIDEO_EXTS = ["mp4", "webm", "mov"];

function sanitizeProjectFolder(value: string) {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}._-]/gu, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const dir = formData.get("dir") as string | null;
    const projectFolder = formData.get("projectFolder") as string | null;

    if (!file) {
      return NextResponse.json({ error: "没有上传文件" }, { status: 400 });
    }

    if (!dir || !ALLOWED_DIRS.includes(dir)) {
      return NextResponse.json(
        { error: `目录参数无效，允许: ${ALLOWED_DIRS.join(", ")}` },
        { status: 400 }
      );
    }

    if (projectFolder && dir !== "projects") {
      return NextResponse.json({ error: "Only project uploads may use a project folder" }, { status: 400 });
    }

    const safeProjectFolder = projectFolder ? sanitizeProjectFolder(projectFolder) : "";
    if (projectFolder && !safeProjectFolder) {
      return NextResponse.json({ error: "Invalid project folder name" }, { status: 400 });
    }
    const uploadDir = safeProjectFolder ? `projects/${safeProjectFolder}` : dir;

    // Sanitize filename
    const safeName = file.name
      .replace(/[\\/]/g, "_")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._\-一-鿿]/g, "");

    if (!safeName || safeName.length > 200) {
      return NextResponse.json({ error: "文件名无效或过长" }, { status: 400 });
    }

    const ext = safeName.split(".").pop()?.toLowerCase();
    const allowedExts = [...IMAGE_EXTS, ...VIDEO_EXTS];
    if (!ext || !allowedExts.includes(ext)) {
      return NextResponse.json({ error: `不支持的文件类型 .${ext}` }, { status: 400 });
    }

    // Try Vercel Blob first, fall back to local filesystem
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

    if (hasBlobToken) {
      // --- Vercel Blob (production) ---
      const { put } = await import("@vercel/blob");
      const blob = await put(`${uploadDir}/${safeName}`, file, {
        access: "public",
        addRandomSuffix: false,
      });
      return NextResponse.json({
        success: true,
        path: blob.url,
        filename: safeName,
        size: 0,
        type: IMAGE_EXTS.includes(ext) ? "image" : "video",
      });
    } else {
      // --- Local filesystem (development) ---
      const { writeFile, mkdir } = await import("fs/promises");
      const { join } = await import("path");

      const targetDir = join(process.cwd(), "public", uploadDir);
      await mkdir(targetDir, { recursive: true });

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(targetDir, safeName);
      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        path: `/${uploadDir}/${safeName}`,
        filename: safeName,
        size: buffer.length,
        type: IMAGE_EXTS.includes(ext) ? "image" : "video",
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "上传失败，请重试" }, { status: 500 });
  }
}
