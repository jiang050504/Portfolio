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
  images = [],
  videos = [],
  index,
}: ProjectCardProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const allImages = images.filter(Boolean);
  const allVideos = videos.filter(Boolean);
  const hasMedia = allImages.length > 0 || allVideos.length > 0;
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
      <Link href={`/projects/${index}`} className="block">
        <div className="mb-4 aspect-video rounded-lg border border-white/[0.04] bg-gradient-to-br from-cyan-500/10 to-purple-500/10 overflow-hidden relative group cursor-pointer">
          {showVideo && allVideos.length > 0 ? (
            <video
              src={allVideos[0]}
              className="h-full w-full object-contain"
              muted
              loop
              playsInline
              autoPlay
            />
          ) : currentImage ? (
            <img
              src={asset(currentImage)}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-3xl opacity-30 transition-transform duration-500 group-hover:scale-110">🚀</span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white">
              查看详情 <ArrowRight size={14} />
            </span>
          </div>

          {/* Image nav arrows */}
          {allImages.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white/70 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white">
                <ChevronLeft size={14} />
              </button>
              <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white/70 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white">
                <ChevronRight size={14} />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {allImages.map((_, i) => (
                  <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === imgIdx ? "bg-white" : "bg-white/40"}`} />
                ))}
              </div>
            </>
          )}

          {/* Media badges */}
          <div className="absolute right-2 top-2 flex gap-1">
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
      </Link>

      <Link href={`/projects/${index}`} className="block group/title">
        <h3 className="mb-2 text-lg font-semibold text-zinc-100 transition-colors group-hover/title:text-cyan-400">
          {title}
        </h3>
      </Link>
      <p className="mb-4 text-sm leading-relaxed text-zinc-400 line-clamp-2">
        {description}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-xs text-zinc-400">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-cyan-400">
            <Globe size={14} /> 源码
          </a>
        )}
        {demo && (
          <a href={demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-purple-400">
            <ExternalLink size={14} /> 演示
          </a>
        )}
      </div>
    </GlowCard>
  );
}
