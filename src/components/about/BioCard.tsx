"use client";

import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import { asset } from "@/lib/path";

interface BioCardProps {
  delay?: number;
}

export default function BioCard({ delay = 0 }: BioCardProps) {
  const { content } = useContent();
  const { aboutName, aboutRole, aboutBio, aboutQuickInfo, avatarPath } = content;

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-xl border-2 bg-white/[0.03] backdrop-blur-sm p-8
        before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-cyan-500/5 before:to-purple-500/5 before:opacity-0 before:transition-opacity before:duration-300
        hover:before:opacity-100 hover:border-cyan-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]"
      style={{
        borderColor: "color-mix(in srgb, var(--accent-primary) 72%, transparent)",
        boxShadow: "0 0 26px var(--accent-glow), inset 0 0 24px var(--accent-glow)",
      }}
    >
      {/* Avatar */}
      <div className="mb-6 flex items-center gap-5">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[var(--accent-primary)]/30 bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
          {avatarPath ? (
            <img
              src={asset(avatarPath)}
              alt={aboutName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[var(--accent-primary)]">
              {aboutName.slice(0, 3).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">{aboutName}</h3>
          <p className="text-sm text-[var(--accent-primary)]">{aboutRole}</p>
        </div>
      </div>

      <div className="space-y-4 text-sm leading-relaxed text-[var(--text-secondary)]">
        {aboutBio.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* Quick info */}
      <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
        {aboutQuickInfo.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border bg-white/[0.02] px-3 py-2"
            style={{ borderColor: "color-mix(in srgb, var(--accent-primary) 34%, transparent)" }}
          >
            <span className="text-[var(--text-muted)]">{item.label}</span>
            <p className="mt-0.5 font-medium text-[var(--text-secondary)]">{item.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
