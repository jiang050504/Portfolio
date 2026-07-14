"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useContent } from "@/context/ContentContext";

export default function Hero() {
  const { content } = useContent();
  const { heroName, heroGreeting, heroRoles, heroDescription } = content;

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const currentRole = heroRoles[roleIndex];
    if (!currentRole) return;
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % heroRoles.length);
    } else {
      timeout = setTimeout(
        () => {
          setDisplayText(
            isDeleting
              ? currentRole.slice(0, displayText.length - 1)
              : currentRole.slice(0, displayText.length + 1)
          );
        },
        isDeleting ? 40 : 80
      );
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex, heroRoles]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center pt-24">
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 font-mono text-sm text-[var(--accent-primary)]"
        >
          {heroGreeting}
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl"
        >
          <span className="bg-gradient-to-r [--hue1:var(--accent-secondary)] [--hue2:var(--accent-primary)] bg-clip-text text-transparent">
            {heroName}
          </span>
        </motion.h1>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8 flex items-center justify-center gap-1 text-xl text-[var(--text-secondary)] sm:text-2xl"
        >
          <span>一名</span>
          <span className="font-semibold text-[var(--accent-primary)] min-w-[8ch] text-left">
            {displayText}
          </span>
          <span className="animate-pulse text-[var(--accent-primary)]">|</span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)]"
        >
          {heroDescription}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium text-white transition-all hover:scale-105"
            style={{ background: 'var(--gradient-btn)', boxShadow: '0 0 20px var(--accent-glow)' }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 40px var(--accent-glow-strong)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)')}
          >
            查看作品
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border px-8 py-3 text-sm font-medium backdrop-blur-sm transition-all"
            style={{ borderColor: 'var(--border-card)', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-card)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
          >
            联系我
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ChevronDown size={24} className="animate-bounce text-[var(--text-muted)]" />
        </motion.div>
      </div>
    </section>
  );
}
