"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-12 text-center"
    >
      <h2 className="text-3xl font-bold sm:text-4xl">
        <span className="bg-clip-text text-transparent" style={{backgroundImage:"var(--gradient-hero)"}}>
          {title}
        </span>
      </h2>
      {subtitle && (
        <p className="mt-3 text-[var(--text-secondary)] text-lg">{subtitle}</p>
      )}
      <div className="mx-auto mt-4 h-px w-20" style={{backgroundImage:"var(--gradient-btn)"}} />
    </motion.div>
  );
}
