"use client";

import { motion } from "framer-motion";
import GlowCard from "@/components/ui/GlowCard";

interface TimelineItem {
  period: string;
  title: string;
  organization: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-cyan-400/30 via-purple-400/30 to-transparent sm:left-1/2 sm:-translate-x-px" />

      <div className="space-y-8">
        {items.map((item, index) => {
          const isLeft = index % 2 === 0;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative flex items-start gap-6 sm:gap-0 ${
                isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div className="absolute left-4 top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-cyan-400 bg-[var(--bg-deep)] sm:left-1/2 sm:top-6" />

              {/* Card */}
              <div
                className={`ml-10 sm:ml-0 sm:w-1/2 ${
                  isLeft ? "sm:pr-10" : "sm:pl-10"
                }`}
              >
                <GlowCard>
                  <span className="mb-1 inline-block font-mono text-xs text-cyan-400">
                    {item.period}
                  </span>
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="mb-2 text-sm text-purple-400">
                    {item.organization}
                  </p>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                </GlowCard>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
