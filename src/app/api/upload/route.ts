import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

const ALLOWED_DIRS = ["projects", "avatar", "wallpapers"];
const IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp"];
const VIDEO_EXTS = ["mp4", "webm", "mov"];
const IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);
const VIDEO_MIME_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_VIDEO_BYTES = 150 * 1024 * 1024;

function sanitizeProjectFolder(value: string) {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}._-]/gu, "")
    .replace(/^\.+|\.+$/g, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST(request: NextRequest) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: "请先登录后台" }, { status: 401 });
  }

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

    const isImage = IMAGE_EXTS.includes(ext);
    const validMime = isImage ? IMAGE_MIME_TYPES.has(file.type) : VIDEO_MIME_TYPES.has(file.type);
    const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
    if (!validMime) {
      return NextResponse.json({ error: "文件内容类型与扩展名不匹配" }, { status: 400 });
    }
    if (file.size <= 0 || file.size > maxBytes) {
      const maxMb = Math.round(maxBytes / 1024 / 1024);
      return NextResponse.json({ error: `文件大小必须在 1 字节到 ${maxMb}MB 之间` }, { status: 413 });
    }

    // Try Vercel Blob first, fall back to local filesystem
    const hasBlobToken = Boolean(
      process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID)
    );

    if (hasBlobToken) {
      // --- Vercel Blob (production) ---
      const { put } = await import("@vercel/blob");
      const blob = await put(`${uploadDir}/${safeName}`, file, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: file.type,
      });
      return NextResponse.json({
        success: true,
        path: blob.url,
        filename: safeName,
        size: 0,
        type: isImage ? "image" : "video",
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
        type: isImage ? "image" : "video",
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "上传失败，请重试" }, { status: 500 });
  }
}
