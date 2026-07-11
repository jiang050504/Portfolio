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
      className={`relative rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-6
        before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-cyan-500/5 before:to-purple-500/5 before:opacity-0 before:transition-opacity before:duration-300
        hover:before:opacity-100 hover:border-cyan-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]
        ${className}`}
    >
      {children}
    </motion.div>
  );
}
