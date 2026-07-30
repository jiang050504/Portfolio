"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import GlowCard from "@/components/ui/GlowCard";
import {
  ArrowLeft, ExternalLink, Globe, Tag,
  ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { useState } from "react";
import { asset } from "@/lib/path";

interface Props {
  id: number;
}

export default function ProjectDetailClient({ id }: Props) {
  const { content } = useContent();
  const [fullscreenIdx, setFullscreenIdx] = useState<number | null>(null);

  const project = content.projects[id];

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[var(--text-secondary)]">项目未找到</h1>
          <p className="mt-4 text-[var(--text-muted)]">该项目不存在或已被删除</p>
          <Link href="/projects" className="mt-6 inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-primary)]">
            <ArrowLeft size={16} /> 返回作品列表
          </Link>
        </div>
      </div>
    );
  }

  const images = project.images?.filter(Boolean) || [];
  const videos = project.videos?.filter(Boolean) || [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <Link href="/projects" className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-4 py-2.5 text-base text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)]/30 hover:text-[var(--accent-primary)]">
          <ArrowLeft size={18} /> 返回作品列表
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="mb-4 text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">{project.title}</h1>
          <div className="mb-8 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 px-3 py-1.5 text-sm text-[var(--accent-primary)]">
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>

          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">项目截图（{images.length} 张）</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((img, i) => (
                  <div key={i} onClick={() => setFullscreenIdx(i)}
                    className="cursor-pointer overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-transform hover:scale-[1.02]">
                    <img src={asset(img)} alt={`${project.title} 截图 ${i + 1}`} className="aspect-video w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Gallery */}
          {videos.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">演示视频（{videos.length} 个）</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {videos.map((vid, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    {vid.includes("youtube.com") || vid.includes("youtu.be") ? (
                      <iframe src={vid.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                        className="aspect-video w-full" allowFullScreen title={`视频 ${i + 1}`} />
                    ) : vid.includes("bilibili.com") ? (
                      <iframe src={vid} className="aspect-video w-full" allowFullScreen title={`视频 ${i + 1}`} />
                    ) : (
                      <video
                        src={asset(vid)}
                        controls
                        controlsList="nodownload noplaybackrate noremoteplayback"
                        disablePictureInPicture
                        onContextMenu={(e) => e.preventDefault()}
                        className="w-full max-h-[60vh] object-contain bg-black rounded-lg"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detail */}
          <GlowCard className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">项目介绍</h2>
            <p className="leading-relaxed text-[var(--text-secondary)] whitespace-pre-line">
              {project.detail || project.description}
            </p>
          </GlowCard>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105"
            style={{ background: 'var(--gradient-btn)' }}>
                <ExternalLink size={16} /> 查看演示
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-sm font-medium text-[var(--text-secondary)] backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:bg-white/[0.06]">
                <Globe size={16} /> 查看源码
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Fullscreen image viewer */}
      {fullscreenIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setFullscreenIdx(null)}>
          <button onClick={() => setFullscreenIdx(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><X size={20} /></button>
          {fullscreenIdx > 0 && (
            <button onClick={(e) => { e.stopPropagation(); setFullscreenIdx(fullscreenIdx - 1); }}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
              <ChevronLeft size={24} />
            </button>
          )}
          <img src={asset(images[fullscreenIdx])} alt="" className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain" />
          {fullscreenIdx < images.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); setFullscreenIdx(fullscreenIdx + 1); }}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
              <ChevronRight size={24} />
            </button>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
            {fullscreenIdx + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
