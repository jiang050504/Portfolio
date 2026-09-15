"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileImage,
  Globe,
  Images,
  Play,
} from "lucide-react";
import type { Project } from "@/data/defaults";
import { asset } from "@/lib/path";
import MediaWatermark from "@/components/ui/MediaWatermark";

type WorkMedia = {
  type: "image" | "video";
  src: string;
};

function videoMimeType(path: string) {
  const cleanPath = path.toLowerCase().split("?")[0];
  if (cleanPath.endsWith(".webm")) return "video/webm";
  if (cleanPath.endsWith(".mov")) return "video/quicktime";
  return "video/mp4";
}

interface PersonalWorkItemProps extends Project {
  index: number;
}

export default function PersonalWorkItem({
  title,
  description,
  detail,
  tags,
  github,
  demo,
  slug,
  coverImage,
  coverPosition,
  images = [],
  videos = [],
  index,
}: PersonalWorkItemProps) {
  const media = useMemo<WorkMedia[]>(() => {
    const imagePaths = [coverImage, ...images]
      .filter((path): path is string => Boolean(path))
      .filter((path, pathIndex, paths) => paths.indexOf(path) === pathIndex);
    const videoPaths = videos
      .filter(Boolean)
      .filter((path, pathIndex, paths) => paths.indexOf(path) === pathIndex);

    return [
      ...videoPaths.map((src) => ({ type: "video" as const, src })),
      ...imagePaths.map((src) => ({ type: "image" as const, src })),
    ];
  }, [coverImage, images, videos]);

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const resolvedMediaIndex = media.length > 0 ? activeMediaIndex % media.length : 0;
  const activeMedia = media[resolvedMediaIndex];

  const moveMedia = (direction: -1 | 1) => {
    if (media.length < 2) return;
    setActiveMediaIndex((current) => (current + direction + media.length) % media.length);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.08, 0.32) }}
      className="overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--accent-primary)_38%,transparent)] bg-[var(--bg-card)] shadow-[0_18px_55px_rgba(0,0,0,.22)] backdrop-blur-sm"
    >
      <header className="border-b border-white/[0.07] px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[var(--accent-primary)]">
              PERSONAL WORK {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">{title}</h2>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)]/50 hover:text-[var(--accent-primary)]"
              >
                <Globe size={13} /> 源码
              </a>
            )}
            {demo && (
              <a
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-secondary)]/50 hover:text-[var(--accent-secondary)]"
              >
                <ExternalLink size={13} /> 演示
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-black/45">
          <div className="flex aspect-video items-center justify-center">
            {activeMedia?.type === "image" ? (
              <div className="relative h-full w-full">
                <img
                  src={asset(activeMedia.src)}
                  alt={`${title} 图片 ${resolvedMediaIndex + 1}`}
                  className="h-full w-full object-contain"
                  style={{ objectPosition: coverPosition || "center" }}
                  draggable={false}
                  onContextMenu={(event) => event.preventDefault()}
                />
                <MediaWatermark />
              </div>
            ) : activeMedia?.type === "video" ? (
              <video
                key={activeMedia.src}
                className="h-full w-full object-contain"
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onContextMenu={(event) => event.preventDefault()}
              >
                <source src={asset(activeMedia.src)} type={videoMimeType(activeMedia.src)} />
                你的浏览器暂不支持该视频格式
              </video>
            ) : (
              <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
                <FileImage size={36} strokeWidth={1.4} />
                <span className="text-sm">暂未添加图片或视频</span>
              </div>
            )}
          </div>

          {activeMedia && (
            <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-xs text-white/85 backdrop-blur-md">
              {activeMedia.type === "video" ? <Play size={12} /> : <Images size={12} />}
              {activeMedia.type === "video" ? "视频" : "图片"} {resolvedMediaIndex + 1}/{media.length}
            </div>
          )}

          {media.length > 1 && (
            <>
              <button
                type="button"
                aria-label={`查看 ${title} 上一个媒体`}
                onClick={() => moveMedia(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/65 p-2 text-white/80 backdrop-blur-sm transition-all hover:bg-black/85 hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                aria-label={`查看 ${title} 下一个媒体`}
                onClick={() => moveMedia(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/65 p-2 text-white/80 backdrop-blur-sm transition-all hover:bg-black/85 hover:text-white"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {media.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {media.map((item, mediaIndex) => (
              <button
                key={`${item.type}-${item.src}`}
                type="button"
                aria-label={`切换到${item.type === "video" ? "视频" : "图片"} ${mediaIndex + 1}`}
                aria-pressed={mediaIndex === activeMediaIndex}
                onClick={() => setActiveMediaIndex(mediaIndex)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border bg-black/35 transition-all ${
                  mediaIndex === resolvedMediaIndex
                    ? "border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/40"
                    : "border-white/[0.08] opacity-65 hover:opacity-100"
                }`}
              >
                {item.type === "image" ? (
                  <img src={asset(item.src)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <video className="h-full w-full object-cover" muted playsInline preload="auto">
                      <source src={asset(item.src)} type={videoMimeType(item.src)} />
                    </video>
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-white">
                      <Play size={16} fill="currentColor" />
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 border-t border-white/[0.07] pt-5">
          <p className="whitespace-pre-line text-base leading-8 text-[var(--text-secondary)]">
            {description || detail || "暂未填写作品简介"}
          </p>
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-[var(--text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <Link
            href={`/personal-works/${slug || index}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)] transition-all hover:gap-3"
          >
            查看完整作品 <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
