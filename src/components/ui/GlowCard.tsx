"use client";

import { motion } from "framer-motion";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function GlowCard({
  children,
  className = "",
  delay = 0,
}: GlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative rounded-xl border p-6 backdrop-blur-sm cursor-pointer transition-all duration-300
        before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity before:duration-300
        before:bg-gradient-to-b before:from-purple-500/5 before:to-pink-500/5
        hover:before:opacity-100
        ${className}`}
        style={{
          borderColor: 'color-mix(in srgb, var(--accent-primary) 45%, transparent)',
          background: 'var(--bg-card)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent-primary)';
          e.currentTarget.style.boxShadow = '0 0 30px var(--accent-glow)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-primary) 45%, transparent)';
          e.currentTarget.style.boxShadow = 'none';
        }}
    >
      {children}
    </motion.div>
  );
}
