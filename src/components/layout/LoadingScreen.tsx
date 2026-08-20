"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import { asset } from "@/lib/path";

const DEFAULT_WALLPAPERS: Record<string, string> = {
  frostmoon: "/wallpapers/霜月.png",
  hengyue: "/wallpapers/恒月.png",
  hongyue: "/wallpapers/虹月.png",
};

export default function LoadingScreen() {
  const { content } = useContent();
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const wallpaper = content.wallpaperEnabled
    ? content.wallpaperPath || DEFAULT_WALLPAPERS[content.theme] || ""
    : "";
  const firstWallpaper = useRef(wallpaper);

  useEffect(() => {
    let cancelled = false;
    let finished = false;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    let safetyTimer: ReturnType<typeof setTimeout> | undefined;
    const startedAt = performance.now();

    const finish = () => {
      if (finished) return;
      finished = true;
      if (safetyTimer) clearTimeout(safetyTimer);
      const remaining = Math.max(0, 850 - (performance.now() - startedAt));
      exitTimer = setTimeout(() => {
        if (cancelled) return;
        setLeaving(true);
        exitTimer = setTimeout(() => {
          if (!cancelled) setVisible(false);
        }, 450);
      }, remaining);
    };

    safetyTimer = setTimeout(finish, 8000);

    if (!firstWallpaper.current) {
      requestAnimationFrame(finish);
    } else {
      const image = new Image();
      image.onload = finish;
      image.onerror = finish;
      image.src = asset(firstWallpaper.current);
    }

    return () => {
      cancelled = true;
      if (safetyTimer) clearTimeout(safetyTimer);
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      aria-live="polite"
      aria-label="页面加载中"
      animate={{ opacity: leaving ? 0 : 1, scale: leaving ? 1.015 : 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[var(--bg-deep)]"
    >
      <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(circle at center, var(--accent-glow-strong), transparent 42%)" }} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <div className="relative flex flex-col items-center text-center">
        <div className="relative mb-8 h-32 w-32">
          <div className="absolute inset-0 rounded-full border border-[var(--accent-primary)]/25 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-3 rounded-full border border-dashed border-[var(--accent-secondary)]/40 animate-[spin_5s_linear_infinite_reverse]" />
          <div className="absolute inset-7 rounded-full border border-[var(--accent-primary)]/45 shadow-[0_0_28px_var(--accent-glow-strong)]" />
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-primary)] shadow-[0_0_28px_var(--accent-primary)] animate-pulse" />
          <span className="absolute -right-1 top-7 h-2 w-2 rounded-full bg-[var(--accent-secondary)] shadow-[0_0_14px_var(--accent-secondary)]" />
        </div>
        <p className="font-mono text-xs font-medium uppercase tracking-[0.35em] text-[var(--accent-primary)]">Initializing Portfolio</p>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">正在同步视觉空间</p>
        <div className="mt-6 h-px w-44 overflow-hidden bg-white/10">
          <div className="h-full w-1/2 bg-[var(--accent-primary)] shadow-[0_0_12px_var(--accent-primary)] animate-[loading-scan_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </motion.div>
  );
}
