"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useContent } from "@/context/ContentContext";

const AUTH_KEY = "portfolio-admin-authed";

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { content } = useContent();
  const [authed, setAuthed] = useState<boolean | null>(null); // null = checking
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  // Check auth status on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_KEY);
    setAuthed(stored === "true");
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === content.adminPassword) {
      sessionStorage.setItem(AUTH_KEY, "true");
      setAuthed(true);
      setError("");
      setPassword("");
    } else {
      setError("密码错误，请重试");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  // Still checking
  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  // Not authed — show login
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm px-6"
        >
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-8">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/20">
                <Lock size={28} className="text-cyan-400" />
              </div>
            </div>

            <h2 className="mb-2 text-center text-xl font-bold text-zinc-100">
              需要密码
            </h2>
            <p className="mb-6 text-center text-sm text-zinc-500">
              请输入管理密码以进入编辑后台
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="输入密码"
                  autoFocus
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 pr-12 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors focus:border-cyan-400/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-sm text-red-400"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 text-sm font-medium text-white transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-[0.98]"
              >
                进入后台 <ArrowRight size={16} />
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-zinc-600">
              默认密码：admin123（可在后台修改）
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Authed — show children + logout bar
  return (
    <>
      {/* Subtle logout bar at top */}
      <div className="fixed top-16 right-0 z-40 flex items-center gap-3 px-4 py-2">
        <span className="text-xs text-zinc-600">已登录</span>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-white/[0.08] px-3 py-1 text-xs text-zinc-500 transition-colors hover:border-red-500/30 hover:text-red-400"
        >
          退出登录
        </button>
      </div>
      {children}
    </>
  );
}
