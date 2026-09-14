"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = checking
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { authenticated?: boolean }) => {
        if (!cancelled) setAuthed(Boolean(data.authenticated));
      })
      .catch(() => {
        if (!cancelled) setAuthed(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: password.trim() }),
    }).catch(() => null);

    if (response?.ok) {
      setAuthed(true);
      setPassword("");
    } else {
      const data = await response?.json().catch(() => null) as { error?: string } | null;
      setError(data?.error || "登录失败，请重试");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => null);
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
                  autoComplete="current-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 pr-12 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors focus:border-cyan-400/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "隐藏密码" : "显示密码"}
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
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white transition-all active:scale-[0.98]"
            style={{ background: 'var(--gradient-btn)', boxShadow: '0 0 20px var(--accent-glow)' }}
              >
                进入后台 <ArrowRight size={16} />
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-zinc-600">
              管理凭据由服务器环境变量配置
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
