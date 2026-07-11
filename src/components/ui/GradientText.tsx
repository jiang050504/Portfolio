"use client";

import { motion } from "framer-motion";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export default function GradientText({
  children,
  className = "",
  animate = false,
}: GradientTextProps) {
  const gradientClass =
    "bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent";

  if (animate) {
    return (
      <motion.span
        className={`${gradientClass} ${className}`}
        initial={{ backgroundPosition: "0% center" }}
        animate={{ backgroundPosition: "200% center" }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        {children}
      </motion.span>
    );
  }

  return <span className={`${gradientClass} ${className}`}>{children}</span>;
}
