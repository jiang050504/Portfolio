import "server-only";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { defaultContent, type SiteContent } from "@/data/defaults";

const CONTENT_BLOB_PATH = "content/site-content.json";

export function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") return false;
  const content = value as Partial<SiteContent>;
  return (
    typeof content.heroName === "string" &&
    Array.isArray(content.heroRoles) &&
    Array.isArray(content.projects) &&
    Array.isArray(content.experiences) &&
    Array.isArray(content.contacts)
  );
}

export function sanitizeContent(content: SiteContent) {
  const sanitized = { ...content } as SiteContent & { adminPassword?: string };
  delete sanitized.adminPassword;
  return {
    ...sanitized,
    personalWorksTitle: sanitized.personalWorksTitle || "个人作品",
    personalWorksSubtitle: sanitized.personalWorksSubtitle || "我的独立创作与个人项目",
    personalWorks: Array.isArray(sanitized.personalWorks) ? sanitized.personalWorks : [],
  };
}

function snapshotPath() {
  return path.join(process.cwd(), "src", "data", "content-snapshot.json");
}

export function hasBlobStorage() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
    (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID)
  );
}

export async function loadSiteContent() {
  try {
    if (hasBlobStorage()) {
      const { get } = await import("@vercel/blob");
      const blob = await get(CONTENT_BLOB_PATH, { access: "public", useCache: false });
      if (blob) {
        const parsed = JSON.parse(await new Response(blob.stream).text()) as unknown;
        if (isSiteContent(parsed)) return sanitizeContent(parsed);
      }
    } else if (process.env.NODE_ENV !== "production") {
      const parsed = JSON.parse(await readFile(snapshotPath(), "utf8")) as unknown;
      if (isSiteContent(parsed)) return sanitizeContent(parsed);
    }
  } catch (error) {
    console.error("Content read error:", error);
  }
  return sanitizeContent(defaultContent);
}

export async function persistSiteContent(content: SiteContent) {
  const serialized = `${JSON.stringify(sanitizeContent(content), null, 2)}\n`;
  if (hasBlobStorage()) {
    const { put } = await import("@vercel/blob");
    await put(CONTENT_BLOB_PATH, serialized, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json; charset=utf-8",
      cacheControlMaxAge: 60,
    });
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    await writeFile(snapshotPath(), serialized, "utf8");
    return;
  }
  throw new Error("生产环境尚未配置 Blob 存储");
}
