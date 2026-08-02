"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Globe, Play, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import { asset } from "@/lib/path";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  slug?: string;
  coverImage?: string;
  coverPosition?: string;
  images?: string[];
  videos?: string[];
  index: number;
}

export default function ProjectCard({
  title,
  description,
  tags,
  github,
  demo,
  slug,
  coverImage,
  coverPosition,
  images = [],
  videos = [],
  index,
}: ProjectCardProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const allImages = [coverImage, ...images].filter(
    (image, index, entries): image is string => Boolean(image) && entries.indexOf(image) === index
  );
  const allVideos = videos.filter(Boolean);
  const currentImage = allImages[imgIdx];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((prev) => (prev + 1) % allImages.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <GlowCard delay={index * 0.1}>
      {/* Full-card clickable overlay — the entire card navigates to detail */}
      <Link
        href={`/projects/${slug || index}`}
        className="absolute inset-0 z-10 rounded-xl"
        aria-label={`查看 ${title} 详情`}
      />

      {/* Media area */}
      <div className="relative mb-4 aspect-video rounded-lg border border-white/[0.04] bg-gradient-to-br from-cyan-500/10 to-purple-500/10 overflow-hidden group">
        {showVideo && allVideos.length > 0 ? (
          <>
            <video
              src={allVideos[0]}
              className="h-full w-full object-contain"
              muted loop playsInline autoPlay
              controlsList="nodownload noplaybackrate noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
            />
          </>
        ) : currentImage ? (
          <img
            src={asset(currentImage)}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: coverPosition || "center" }}
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-3xl opacity-30 transition-transform duration-500 group-hover:scale-110">🚀</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white">
            查看详情 <ArrowRight size={14} />
          </span>
        </div>

        {/* Image nav arrows */}
        {allImages.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white/70 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white">
              <ChevronLeft size={14} />
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white/70 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white">
              <ChevronRight size={14} />
            </button>
            <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {allImages.map((_, i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === imgIdx ? "bg-white" : "bg-white/40"}`} />
              ))}
            </div>
          </>
        )}

        {/* Media badges */}
        <div className="absolute right-2 top-2 z-20 flex gap-1">
          {allVideos.length > 0 && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowVideo(!showVideo); }}
              className="rounded-lg bg-black/60 p-1.5 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white"
              title={showVideo ? "查看图片" : "播放视频"}
            >
              <Play size={14} />
            </button>
          )}
          {allImages.length > 1 && (
            <span className="rounded-lg bg-black/60 px-1.5 py-1 text-xs text-white/80 backdrop-blur-sm">
              {imgIdx + 1}/{allImages.length}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="relative z-10 mb-2 text-lg font-semibold text-[var(--text-primary)] transition-colors group-hover/title:text-[var(--accent-primary)]">
        {title}
      </h3>

      {/* Description */}
      <p className="relative z-10 mb-4 text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-2">
        {description}
      </p>

      {/* Tags */}
      <div className="relative z-10 mb-4 flex flex-wrap gap-2 pointer-events-none">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-xs text-[var(--text-secondary)]">
            {tag}
          </span>
        ))}
      </div>

      {/* External links — above overlay, stopPropagation to avoid card navigation */}
      <div className="relative z-20 flex gap-3">
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]">
            <Globe size={14} /> 源码
          </a>
        )}
        {demo && (
          <a href={demo} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-secondary)]">
            <ExternalLink size={14} /> 演示
          </a>
        )}
      </div>
    </GlowCard>
  );
}
