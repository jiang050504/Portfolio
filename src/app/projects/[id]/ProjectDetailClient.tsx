"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import GlowCard from "@/components/ui/GlowCard";
import {
  ArrowLeft, ExternalLink, Globe, Tag,
  ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { asset } from "@/lib/path";
import MediaWatermark from "@/components/ui/MediaWatermark";

interface Props {
  projectId: string;
}

function GalleryImage({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick: () => void;
}) {
  const [isPortrait, setIsPortrait] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full cursor-pointer overflow-hidden rounded-xl border border-white/[0.06] bg-black/20 transition-transform hover:scale-[1.02] ${
        isPortrait ? "aspect-[3/4]" : "aspect-video"
      }`}
    >
      <img
        src={asset(src)}
        alt={alt}
        onLoad={(event) => {
          setIsPortrait(event.currentTarget.naturalHeight > event.currentTarget.naturalWidth);
        }}
        className="h-full w-full object-contain"
        draggable={false}
        onContextMenu={(event) => event.preventDefault()}
      />
    </button>
  );
}

function DesignImageTile({
  src,
  alt,
  onClick,
  portrait = false,
}: {
  src: string;
  alt: string;
  onClick: () => void;
  portrait?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-2xl border border-white/[0.1] bg-[#090b15]/70 shadow-[0_12px_30px_rgba(0,0,0,.22)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-primary)]/55 hover:shadow-[0_18px_38px_rgba(0,0,0,.36)] ${
        portrait ? "aspect-[3/4]" : "aspect-[16/7]"
      }`}
    >
      <img src={asset(src)} alt={alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]" draggable={false} onContextMenu={(event) => event.preventDefault()} />
      <MediaWatermark />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </button>
  );
}

export default function ProjectDetailClient({ projectId }: Props) {
  const { content } = useContent();
  const [fullscreenIdx, setFullscreenIdx] = useState<number | null>(null);
  const [coverIsPortrait, setCoverIsPortrait] = useState(false);
  const [coverLayoutReady, setCoverLayoutReady] = useState(false);
  const [featuredLandscapeDesigns, setFeaturedLandscapeDesigns] = useState<string[]>([]);
  const [landscapeDesignImages, setLandscapeDesignImages] = useState<string[]>([]);
  const [portraitDesignImages, setPortraitDesignImages] = useState<string[]>([]);

  const legacyIndex = /^\d+$/.test(projectId) ? Number.parseInt(projectId, 10) : -1;
  const projectIndex = content.projects.findIndex((item) => item.slug === projectId);
  const resolvedIndex = projectIndex >= 0 ? projectIndex : legacyIndex;
  const project = content.projects[resolvedIndex];
  const projectCoverImage = project?.coverImage || project?.images?.find(Boolean) || "";
  const designImages = useMemo(
    () => project?.designImages?.filter(Boolean) || [],
    [project?.designImages]
  );

  useEffect(() => {
    let cancelled = false;

    if (!projectCoverImage) {
      setCoverLayoutReady(true);
      return;
    }

    setCoverLayoutReady(false);
    const image = new Image();
    image.onload = () => {
      if (cancelled) return;
      setCoverIsPortrait(image.naturalHeight > image.naturalWidth);
      setCoverLayoutReady(true);
    };
    image.onerror = () => {
      if (!cancelled) setCoverLayoutReady(true);
    };
    image.src = asset(projectCoverImage);

    return () => {
      cancelled = true;
    };
  }, [projectCoverImage]);

  useEffect(() => {
    let cancelled = false;

    const detectLandscapeDesigns = async () => {
      const candidates = await Promise.all(
        designImages.map(
          (imagePath) =>
            new Promise<{ path: string; isLandscape: boolean } | null>((resolve) => {
              const image = new Image();
              image.onload = () =>
                resolve({ path: imagePath, isLandscape: image.naturalWidth >= image.naturalHeight });
              image.onerror = () => resolve(null);
              image.src = asset(imagePath);
            })
        )
      );

      if (cancelled) return;
      const resolved = candidates.filter(
        (candidate): candidate is { path: string; isLandscape: boolean } => Boolean(candidate)
      );
      const landscapes = resolved.filter((candidate) => candidate.isLandscape).map((candidate) => candidate.path);
      const portraits = resolved.filter((candidate) => !candidate.isLandscape).map((candidate) => candidate.path);
      const shuffled = [...landscapes].sort(() => Math.random() - 0.5);
      setFeaturedLandscapeDesigns(shuffled.slice(0, 2));
      setLandscapeDesignImages(landscapes);
      setPortraitDesignImages(portraits);
    };

    detectLandscapeDesigns();
    return () => {
      cancelled = true;
    };
  }, [designImages]);

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
  const coverImage = projectCoverImage;
  const screenshots = project.coverImage
    ? images.filter((imagePath) => asset(imagePath) !== asset(projectCoverImage))
    : images.slice(1);
  const galleryImages = [coverImage, ...screenshots, ...designImages].filter(Boolean);
  const coverSideDesigns = coverIsPortrait ? featuredLandscapeDesigns : [];
  const remainingLandscapeDesigns = coverIsPortrait
    ? landscapeDesignImages.filter((imagePath) => !coverSideDesigns.includes(imagePath))
    : landscapeDesignImages;
  const remainingDesignImages = [...remainingLandscapeDesigns, ...portraitDesignImages];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <Link href="/projects" className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-4 py-2.5 text-base text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)]/30 hover:text-[var(--accent-primary)]">
          <ArrowLeft size={18} /> 返回作品列表
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="mb-4 text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">{project.title}</h1>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 px-3 py-1.5 text-sm text-[var(--accent-primary)]">
                    <Tag size={12} /> {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3 sm:justify-end">
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-all hover:scale-105"
                  style={{ background: 'var(--gradient-btn)' }}>
                  <ExternalLink size={16} /> 查看演示
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:bg-white/[0.06]">
                  <Globe size={16} /> 查看源码
                </a>
              )}
            </div>
          </div>

          {/* Introduction */}
          <GlowCard className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">项目介绍</h2>
            <p className="leading-relaxed text-[var(--text-secondary)] whitespace-pre-line">
              {project.detail || project.description}
            </p>
          </GlowCard>

          {/* Project cover */}
          {coverImage && (
            <div className="mb-8">
              {!coverLayoutReady ? (
                <div className="flex min-h-80 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm text-[var(--text-muted)]">
                  正在整理项目封面
                </div>
              ) : coverIsPortrait ? (
                <div className="grid gap-6 md:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
                  <div>
                    <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">项目封面</h2>
                    <div onClick={() => setFullscreenIdx(0)}
                      className="cursor-pointer overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-transform hover:scale-[1.01]">
                      <img
                        src={asset(coverImage)}
                        alt={`${project.title} 项目封面`}
                        className="mx-auto max-h-[72vh] w-full object-contain"
                        draggable={false}
                        onContextMenu={(event) => event.preventDefault()}
                      />
                      <MediaWatermark />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">角色与场景设计</h2>
                    <div className="grid gap-4">
                      {[0, 1].map((index) => {
                        const imagePath = coverSideDesigns[index];
                        return imagePath ? (
                          <button
                            key={imagePath}
                            type="button"
                            onClick={() => setFullscreenIdx(galleryImages.indexOf(imagePath))}
                            className="aspect-video overflow-hidden rounded-xl border border-white/[0.06] bg-black/20 transition-transform hover:scale-[1.01]"
                          >
                            <img
                              src={asset(imagePath)}
                              alt={`${project.title} 角色与场景设计 ${index + 1}`}
                              className="h-full w-full object-cover"
                              draggable={false}
                              onContextMenu={(event) => event.preventDefault()}
                            />
                            <MediaWatermark />
                          </button>
                        ) : (
                          <div
                            key={`placeholder-${index}`}
                            className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-white/[0.16] bg-black/15 px-6 text-center text-sm text-[var(--text-muted)]"
                          >
                            暂无横版角色或场景设计图
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">项目封面</h2>
                  <div onClick={() => setFullscreenIdx(0)}
                    className="cursor-pointer overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-transform hover:scale-[1.01]">
                    <img
                      src={asset(coverImage)}
                      alt={`${project.title} 项目封面`}
                      className="mx-auto max-h-[75vh] max-w-full object-contain"
                      draggable={false}
                      onContextMenu={(event) => event.preventDefault()}
                    />
                    <MediaWatermark />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Screenshots */}
          {screenshots.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">画面截图（{screenshots.length} 张）</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {screenshots.map((img, i) => (
                  <GalleryImage
                    key={img}
                    src={img}
                    alt={`${project.title} 画面截图 ${i + 1}`}
                    onClick={() => setFullscreenIdx(galleryImages.indexOf(img))}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Demo videos */}
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
                      <>
                        <video
                          src={asset(vid)}
                          controls
                          controlsList="nodownload noplaybackrate noremoteplayback"
                          disablePictureInPicture
                          onContextMenu={(e) => e.preventDefault()}
                          className="w-full max-h-[60vh] object-contain bg-black rounded-lg"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(remainingLandscapeDesigns.length > 0 || portraitDesignImages.length > 0) && (
            <section className="mb-10 rounded-2xl border border-white/[0.08] bg-black/15 p-4 shadow-[0_16px_40px_rgba(0,0,0,.18)] backdrop-blur-sm sm:p-6">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-[0.22em] text-[var(--accent-primary)]">VISUAL DEVELOPMENT</p>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">角色与场景设计</h2>
                </div>
                <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-xs text-[var(--text-secondary)]">
                  {remainingLandscapeDesigns.length + portraitDesignImages.length} 张素材
                </span>
              </div>

              {remainingLandscapeDesigns.length > 0 && (
                <div className="mb-6">
                  <p className="mb-3 text-sm font-medium text-[var(--text-secondary)]">场景设定</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {remainingLandscapeDesigns.map((img, index) => (
                      <DesignImageTile
                        key={img}
                        src={img}
                        alt={`${project.title} 场景设定 ${index + 1}`}
                        onClick={() => setFullscreenIdx(galleryImages.indexOf(img))}
                      />
                    ))}
                  </div>
                </div>
              )}

              {portraitDesignImages.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-medium text-[var(--text-secondary)]">角色设定</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {portraitDesignImages.map((img, index) => (
                      <DesignImageTile
                        key={img}
                        src={img}
                        alt={`${project.title} 角色设定 ${index + 1}`}
                        portrait
                        onClick={() => setFullscreenIdx(galleryImages.indexOf(img))}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Character and scene design */}
          {false && remainingDesignImages.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">角色与场景设计（{remainingDesignImages.length} 张）</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {remainingDesignImages.map((img, i) => (
                  <GalleryImage
                    key={img}
                    src={img}
                    alt={`${project.title} 角色与场景设计 ${i + 1}`}
                    onClick={() => setFullscreenIdx(galleryImages.indexOf(img))}
                  />
                ))}
              </div>
            </div>
          )}
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
          <div className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-lg">
            <img src={asset(galleryImages[fullscreenIdx])} alt="" className="max-h-[85vh] max-w-[90vw] object-contain" draggable={false} onContextMenu={(event) => event.preventDefault()} />
            <MediaWatermark visible />
          </div>
          {fullscreenIdx < galleryImages.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); setFullscreenIdx(fullscreenIdx + 1); }}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
              <ChevronRight size={24} />
            </button>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
            {fullscreenIdx + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
