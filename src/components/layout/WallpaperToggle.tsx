"use client";

import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import { Sparkles, Moon, Sun, Flame } from "lucide-react";

const themes = [
  { id: "cyber" as const, label: "暗夜", icon: Sun, color: "#06b6d4" },
  { id: "frostmoon" as const, label: "霜月", icon: Moon, color: "#a9ddff" },
  { id: "hengyue" as const, label: "恒月", icon: Sparkles, color: "#ffd56f" },
  { id: "hongyue" as const, label: "虹月", icon: Flame, color: "#ff424f" },
];

export default function ThemeSwitcher() {
  const { content, updateContent } = useContent();
  const current = themes.findIndex((t) => t.id === content.theme);

  const next = () => {
    const n = (current + 1) % themes.length;
    updateContent({ ...content, theme: themes[n].id, wallpaperEnabled: n > 0 });
  };

  const t = themes[current] || themes[0];
  const Icon = t.icon;

  return (
    <motion.button
      onClick={next}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      whileTap={{ scale: 0.9 }}
      title={`当前: ${t.label} — 点击切换`}
      className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full border border-white/[0.08] bg-[var(--bg-deep)]/80 backdrop-blur-xl px-4 py-2.5 text-xs text-[var(--text-secondary)] transition-all hover:border-[var(--accent-primary)]/30 hover:text-[var(--text-primary)]"
    >
      <Icon size={14} style={{ color: t.color }} />
      <span>{t.label}</span>
    </motion.button>
  );
}
