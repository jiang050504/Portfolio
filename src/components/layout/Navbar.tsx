"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useContent } from "@/context/ContentContext";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于我" },
  { href: "/projects", label: "项目作品" },
  { href: "/experience", label: "经历" },
  { href: "/contact", label: "联系" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { content } = useContent();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[var(--bg-deep)]/80 backdrop-blur-xl transition-colors duration-700">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
        >
          {content.heroName}
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-5 py-2.5 text-base font-medium transition-colors ${
                  isActive
                    ? "text-cyan-400"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 rounded-lg bg-cyan-400/10 border border-cyan-400/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-zinc-400 transition-colors hover:text-zinc-200 sm:hidden"
          aria-label="切换菜单"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/[0.06] bg-[var(--bg-deep)]/95 backdrop-blur-xl sm:hidden transition-colors duration-700"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-lg px-5 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-cyan-400/10 text-cyan-400"
                        : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
