"use client";

import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";

export default function SkillsGrid() {
  const { content } = useContent();
  const { skills } = content;

  return (
    <div className="space-y-8">
      {skills.map((category, catIdx) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: catIdx * 0.15 }}
        >
          <h3 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[var(--text-primary)]">
            <span className="h-px w-6 bg-gradient-to-r from-cyan-400 to-transparent" />
            {category.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((skill, idx) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: catIdx * 0.15 + idx * 0.05 }}
                className="rounded-full border border-[var(--accent-primary)]/10 bg-[var(--accent-primary)]/5 px-4 py-1.5 text-sm text-[var(--accent-primary)]/80 transition-colors hover:border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)]"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
