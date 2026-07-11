"use client";

import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import { ImageIcon, Sparkles } from "lucide-react";

export default function WallpaperToggle() {
  const { content, updateContent } = useContent();
  const { wallpaperEnabled } = content;

  const toggle = () => {
    updateContent({ ...content, wallpaperEnabled: !wallpaperEnabled });
  };

  return (
    <motion.button
      onClick={toggle}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      title={wallpaperEnabled ? "切换为粒子背景" : "切换为壁纸背景"}
      className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full border border-white/[0.08] bg-[var(--bg-deep)]/80 backdrop-blur-xl px-4 py-2.5 text-xs text-zinc-400 transition-all hover:border-cyan-500/30 hover:text-zinc-200"
    >
      {wallpaperEnabled ? (
        <>
          <Sparkles size={14} className="text-cyan-400" />
          <span>粒子背景</span>
        </>
      ) : (
        <>
          <ImageIcon size={14} className="text-purple-400" />
          <span>壁纸模式</span>
        </>
      )}
    </motion.button>
  );
}
