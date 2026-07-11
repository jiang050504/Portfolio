import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// Allowed directories under public/
const ALLOWED_DIRS = ["projects", "avatar", "wallpapers"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const dir = formData.get("dir") as string | null;

    if (!file) {
      return NextResponse.json({ error: "没有上传文件" }, { status: 400 });
    }

    if (!dir || !ALLOWED_DIRS.includes(dir)) {
      return NextResponse.json(
        { error: `目录参数无效，允许: ${ALLOWED_DIRS.join(", ")}` },
        { status: 400 }
      );
    }

    // Sanitize filename: remove path separators and special chars
    const originalName = file.name;
    const safeName = originalName
      .replace(/[\\/]/g, "_")      // Remove path separators
      .replace(/\s+/g, "_")         // Replace spaces with underscore
      .replace(/[^a-zA-Z0-9._\-一-鿿]/g, ""); // Allow Chinese chars

    if (!safeName || safeName.length > 200) {
      return NextResponse.json({ error: "文件名无效或过长" }, { status: 400 });
    }

    // Allowed extensions
    const ext = safeName.split(".").pop()?.toLowerCase();
    const imageExts = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
    const videoExts = ["mp4", "webm", "mov"];
    const allowedExts = [...imageExts, ...videoExts];

    if (!ext || !allowedExts.includes(ext)) {
      return NextResponse.json(
        { error: `不支持的文件类型 .${ext}` },
        { status: 400 }
      );
    }

    // Ensure directory exists
    const targetDir = join(process.cwd(), "public", dir);
    await mkdir(targetDir, { recursive: true });

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(targetDir, safeName);
    await writeFile(filePath, buffer);

    // Return the public URL path
    const publicPath = `/${dir}/${safeName}`;

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename: safeName,
      size: buffer.length,
      type: imageExts.includes(ext!) ? "image" : "video",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "上传失败，请重试" }, { status: 500 });
  }
}
