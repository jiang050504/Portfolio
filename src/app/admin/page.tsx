"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useContent } from "@/context/ContentContext";
import type { SiteContent, Project, Experience } from "@/data/defaults";
import { defaultContent } from "@/data/defaults";
import { asset } from "@/lib/path";
import AuthGate from "@/components/admin/AuthGate";
import {
  ArrowLeft,
  Save,
  Undo2,
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  Video,
  Check,
  X,
  Layers,
  Key,
} from "lucide-react";

type TabKey =
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "contact"
  | "wallpaper";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "hero", label: "首页", icon: null },
  { key: "about", label: "关于我", icon: null },
  { key: "skills", label: "技能", icon: null },
  { key: "projects", label: "项目", icon: null },
  { key: "experience", label: "经历", icon: null },
  { key: "contact", label: "联系", icon: null },
  { key: "wallpaper", label: "壁纸", icon: <Layers size={14} /> },
];

// ======================= Shared form components =======================

function Field({
  label,
  hint,
  color,
  children,
}: {
  label: string;
  hint?: string;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={`mb-1.5 block text-sm font-medium ${color || "text-zinc-400"}`}>
        {label}
        {hint && <span className="ml-1 text-xs text-zinc-600">({hint})</span>}
      </span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors focus:border-cyan-500/40 focus:bg-white/[0.05]"
    />
  );
}

function Textarea({
  value,
  onChange,
  rows = 3,
  placeholder = "",
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full resize-none rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors focus:border-cyan-500/40 focus:bg-white/[0.05]"
    />
  );
}

function Slider({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.05,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/[0.08] accent-cyan-400 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
      />
      <span className="w-10 text-right text-xs text-zinc-500">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

// ======================= File Upload =======================

function FileUpload({
  label,
  dir,
  currentPath,
  onUploaded,
  accept = "image/*",
  icon,
}: {
  label: string;
  dir: "projects" | "avatar" | "wallpapers";
  currentPath: string;
  onUploaded: (path: string) => void;
  accept?: string;
  icon?: React.ReactNode;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const doUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError("");
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("dir", dir);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) {
          onUploaded(data.path);
        } else {
          setError(data.error || "上传失败");
        }
      } catch {
        setError("网络错误，请重试");
      }
      setUploading(false);
    },
    [dir, onUploaded]
  );

  return (
    <div>
      <Field label={label} hint="点击选择或拖拽文件">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) doUpload(f);
          }}
          onClick={() => fileRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
            dragOver
              ? "border-cyan-400/50 bg-cyan-400/5"
              : "border-white/[0.08] hover:border-cyan-400/30"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) doUpload(f);
            }}
          />
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-sm text-cyan-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              上传中...
            </div>
          ) : currentPath ? (
            <div className="flex items-center justify-center gap-2 text-sm">
              <Check size={14} className="text-green-400" />
              <span className="text-green-400 truncate">{currentPath}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onUploaded(""); }}
                className="ml-1 rounded p-0.5 text-zinc-500 hover:text-red-400"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-sm text-zinc-500">
              {icon || <Upload size={18} />}
              <span>拖拽文件到此处或点击上传</span>
            </div>
          )}
        </div>
      </Field>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ======================= Project Editor =======================

function ProjectEditor({
  project,
  onChange,
  onDelete,
}: {
  project: Project;
  onChange: (p: Project) => void;
  onDelete: () => void;
}) {
  return (
    <div className="relative rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
      <button
        onClick={onDelete}
        className="absolute right-3 top-3 rounded p-1 text-zinc-600 hover:bg-red-500/10 hover:text-red-400"
      >
        <Trash2 size={14} />
      </button>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <button onClick={() => updateDraft({ theme: "cyber" })} className={draft.theme === "cyber" ? "rounded-xl border border-cyan-400/40 bg-cyan-400/10 p-3 text-left" : "rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left hover:border-cyan-400/20"}>
                      <div className="mb-2 h-2 w-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-600" />
                      <p className="text-sm font-medium text-zinc-200">暗夜科技</p>
                      <p className="text-xs text-zinc-500 mt-1">青紫渐变 · 粒子网格</p>
                    </button>
                    <button onClick={() => updateDraft({ theme: "frostmoon" })} className={draft.theme === "frostmoon" ? "rounded-xl border border-blue-400/40 bg-blue-400/10 p-3 text-left" : "rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left hover:border-blue-300/20"}>
                      <div className="mb-2 h-2 w-full rounded-full bg-gradient-to-r from-[#f7fbff] via-[#a9ddff] to-[#5fa8d6]" />
                      <p className="text-sm font-medium text-zinc-200">霜月</p>
                      <p className="text-xs text-zinc-500 mt-1">深寒夜 · 冰月辉光</p>
                    </button>
                    <button onClick={() => updateDraft({ theme: "hengyue" })} className={draft.theme === "hengyue" ? "rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-left" : "rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left hover:border-amber-400/20"}>
                      <div className="mb-2 h-2 w-full rounded-full bg-gradient-to-r from-[#fff9ec] via-[#ffd56f] to-[#b69ce8]" />
                      <p className="text-sm font-medium text-zinc-200">恒月</p>
                      <p className="text-xs text-zinc-500 mt-1">金月光辉 · 鎏金星野</p>
                    </button>
                    <button onClick={() => updateDraft({ theme: "hongyue" })} className={draft.theme === "hongyue" ? "rounded-xl border border-red-400/40 bg-red-400/10 p-3 text-left" : "rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left hover:border-red-400/20"}>
                      <div className="mb-2 h-2 w-full rounded-full bg-gradient-to-r from-[#ff7869] via-[#ff424f] to-[#d790aa]" />
                      <p className="text-sm font-medium text-zinc-200">虹月</p>
                      <p className="text-xs text-zinc-500 mt-1">赤月光辉 · 暗红涌动</p>
                    </button>
                  </div>
                {/* Wallpaper settings */}
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-4">
                  <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <ImageIcon size={16} className="text-purple-400" />
                    壁纸设置
                  </h3>

                  <FileUpload
                    label="壁纸图片（上传后保存即可）"
                    dir="wallpapers"
                    currentPath={draft.wallpaperPath}
                    onUploaded={(path) => updateDraft({ wallpaperPath: path })}
                    accept="image/*"
                    icon={<ImageIcon size={18} />}
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">启用壁纸</span>
                    <button
                      onClick={() => updateDraft({ wallpaperEnabled: !draft.wallpaperEnabled })}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        draft.wallpaperEnabled ? "bg-cyan-500" : "bg-white/[0.08]"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                          draft.wallpaperEnabled ? "translate-x-5.5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <Field label="壁纸透明度">
                    <Slider
                      value={draft.wallpaperOpacity}
                      onChange={(v) => updateDraft({ wallpaperOpacity: v })}
                    />
                  </Field>

                  <Field label="壁纸模糊度">
                    <Slider
                      value={draft.wallpaperBlur / 10}
                      onChange={(v) => updateDraft({ wallpaperBlur: Math.round(v * 10) })}
                      max={5}
                      step={0.5}
                    />
                  </Field>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">壁纸上显示粒子</span>
                    <button
                      onClick={() => updateDraft({ particlesOnWallpaper: !draft.particlesOnWallpaper })}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        draft.particlesOnWallpaper ? "bg-cyan-500" : "bg-white/[0.08]"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                          draft.particlesOnWallpaper ? "translate-x-5.5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Preview hint */}
                  {draft.wallpaperPath && draft.wallpaperEnabled && (
                    <div className="mt-3 rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-3 text-xs text-zinc-400">
                      <p className="flex items-center gap-1">
                        <Check size={12} className="text-cyan-400" />
                        壁纸已就绪：{draft.wallpaperPath}
                      </p>
                      <p className="mt-1">点击右下角按钮可在网站前台切换壁纸/粒子模式</p>
                    </div>
                  )}
                </div>

                {/* Password change */}
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-4">
                  <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <Key size={16} className="text-amber-400" />
                    修改管理密码
                  </h3>
                  <div className="flex gap-3">
                    <input
                      type="password"
                      placeholder="输入新密码"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-amber-400/40"
                    />
                    <button
                      onClick={() => {
                        if (newPassword.length >= 3) {
                          updateDraft({ adminPassword: newPassword });
                          setNewPassword("");
                          alert("密码已更新！请保存后生效。");
                        } else {
                          alert("密码至少 3 个字符");
                        }
                      }}
                      className="rounded-lg bg-amber-500/20 px-4 py-2 text-sm text-amber-400 transition-colors hover:bg-amber-500/30"
                    >
                      更新密码
                    </button>
                  </div>
                  <p className="text-xs text-zinc-600">
                    当前密码：{draft.adminPassword.replace(/./g, "•")}（点击更新后生效）
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom save button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-10 py-3 text-base font-medium text-white transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-105"
          >
            <Save size={18} />
            {saved ? "已保存！去网站看看 →" : "保存所有修改"}
          </button>
        </div>
      </div>
    </div>
    </AuthGate>
  );
}
