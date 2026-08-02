"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useContent } from "@/context/ContentContext";
import type { SiteContent, Project, Experience } from "@/data/defaults";
import { asset } from "@/lib/path";
import AuthGate from "@/components/admin/AuthGate";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
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
  Bookmark,
} from "lucide-react";

type TabKey =
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "contact"
  | "wallpaper";

function createProjectMediaFolder(title: string, index: number) {
  const projectNumber = String(index + 1).padStart(2, "0");
  const safeTitle = title
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}._-]/gu, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${projectNumber}-${safeTitle || "new-project"}`;
}

function normalizeProjectSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "hero", label: "首页", icon: null },
  { key: "about", label: "关于我", icon: null },
  { key: "skills", label: "技能", icon: null },
  { key: "projects", label: "项目", icon: null },
  { key: "experience", label: "经历", icon: null },
  { key: "contact", label: "联系", icon: null },
  { key: "wallpaper", label: "壁纸", icon: <Layers size={14} /> },
];

const COVER_POSITION_OPTIONS = [
  { value: "left top", label: "↖", title: "左上" },
  { value: "center top", label: "↑", title: "上方" },
  { value: "right top", label: "↗", title: "右上" },
  { value: "left center", label: "←", title: "左侧" },
  { value: "center", label: "•", title: "居中" },
  { value: "right center", label: "→", title: "右侧" },
  { value: "left bottom", label: "↙", title: "左下" },
  { value: "center bottom", label: "↓", title: "下方" },
  { value: "right bottom", label: "↘", title: "右下" },
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
      <span className={`mb-1.5 block text-sm font-semibold ${color || "text-zinc-200"}`}>
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
      className="w-full rounded-lg border border-white/[0.16] bg-[#070b14]/85 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] outline-none backdrop-blur-md transition-colors focus:border-cyan-400/70 focus:bg-[#090f1d]/95"
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
      className="w-full resize-none rounded-lg border border-white/[0.16] bg-[#070b14]/85 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] outline-none backdrop-blur-md transition-colors focus:border-cyan-400/70 focus:bg-[#090f1d]/95"
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
  projectFolder,
  currentPath,
  onUploaded,
  accept = "image/*",
  icon,
}: {
  label: string;
  dir: "projects" | "avatar" | "wallpapers";
  projectFolder?: string;
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
        if (projectFolder) formData.append("projectFolder", projectFolder);
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
    [dir, onUploaded, projectFolder]
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
  projectIndex,
  onChange,
  onDelete,
}: {
  project: Project;
  projectIndex: number;
  onChange: (p: Project) => void;
  onDelete: () => void;
}) {
  const mediaFolder = project.mediaFolder || createProjectMediaFolder(project.title, projectIndex);
  const updateProject = (changes: Partial<Project>) =>
    onChange({ ...project, ...changes, mediaFolder });

  return (
    <div className="relative space-y-3 rounded-xl border border-white/[0.14] bg-black/35 p-4 shadow-[0_12px_30px_rgba(0,0,0,.18)] backdrop-blur-md">
      <button
        onClick={onDelete}
        className="absolute right-3 top-3 rounded p-1 text-zinc-600 hover:bg-red-500/10 hover:text-red-400"
      >
        <Trash2 size={14} />
      </button>
      <Field label="项目名称">
        <Input
          value={project.title}
          onChange={(v) => onChange({ ...project, title: v })}
        />
      </Field>
      <Field label="演示链接（飞书/网页等）" color="text-green-400">
        <Input
          value={project.demo}
          onChange={(v) => onChange({ ...project, demo: v })}
          placeholder="https://..."
        />
      </Field>
      <Field label="项目网页后缀">
        <Input
          value={project.slug || ""}
          onChange={(value) => updateProject({ slug: normalizeProjectSlug(value) })}
          placeholder="kaiju-tianzai"
        />
        <p className="mt-1 text-xs text-zinc-500">项目地址：/projects/{project.slug || "网页后缀"}</p>
      </Field>
      <FileUpload
        label="项目封面"
        dir="projects"
        projectFolder={mediaFolder}
        currentPath={project.coverImage || ""}
        onUploaded={(path) => updateProject({ coverImage: path })}
        accept="image/*"
        icon={<ImageIcon size={16} />}
      />
      <Field label="项目列表封面取景位置" hint="选择卡片裁切时要保留的区域">
        <div className="grid max-w-48 grid-cols-3 gap-1.5">
          {COVER_POSITION_OPTIONS.map((option) => {
            const selected = (project.coverPosition || "center") === option.value;
            return (
              <button
                key={option.value}
                type="button"
                title={option.title}
                onClick={() => updateProject({ coverPosition: option.value })}
                className={`h-9 rounded-md border text-sm transition-colors ${
                  selected
                    ? "border-cyan-400/70 bg-cyan-400/15 text-cyan-200"
                    : "border-white/[0.1] bg-black/20 text-zinc-500 hover:border-cyan-400/35 hover:text-zinc-200"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-zinc-500">当前：{COVER_POSITION_OPTIONS.find((option) => option.value === (project.coverPosition || "center"))?.title}</p>
      </Field>
      {/* Multiple images */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-400">
            <span className="text-purple-400">画面截图（{project.images?.length || 0} 张）</span>
          </span>
          <button
            onClick={() => onChange({ ...project, images: [...(project.images || []), ""] })}
            className="inline-flex items-center gap-1 rounded-lg border border-dashed border-cyan-400/30 px-2 py-1 text-xs text-cyan-400 transition-colors hover:bg-cyan-400/5"
          >
            <Plus size={12} /> 添加图片
          </button>
        </div>
        <div className="space-y-2">
          {(project.images || []).map((img, i) => (
            <FileUpload
              key={i}
              label={`截图 ${i + 1}`}
              dir="projects"
              projectFolder={mediaFolder}
              currentPath={img}
              onUploaded={(path) => {
                const imgs = [...(project.images || [])];
                imgs[i] = path;
                updateProject({ images: imgs });
              }}
              accept="image/*"
              icon={<ImageIcon size={16} />}
            />
          ))}
        </div>
      </div>

      {/* Character and scene design images */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-400">
            <span className="text-amber-400">角色与场景设计（{project.designImages?.length || 0} 张）</span>
          </span>
          <button
            onClick={() => onChange({ ...project, designImages: [...(project.designImages || []), ""] })}
            className="inline-flex items-center gap-1 rounded-lg border border-dashed border-amber-400/30 px-2 py-1 text-xs text-amber-400 transition-colors hover:bg-amber-400/5"
          >
            <Plus size={12} /> 添加图片
          </button>
        </div>
        <div className="space-y-2">
          {(project.designImages || []).map((img, i) => (
            <FileUpload
              key={i}
              label={`设计图 ${i + 1}`}
              dir="projects"
              projectFolder={mediaFolder}
              currentPath={img}
              onUploaded={(path) => {
                const designImages = [...(project.designImages || [])];
                designImages[i] = path;
                updateProject({ designImages });
              }}
              accept="image/*"
              icon={<ImageIcon size={16} />}
            />
          ))}
        </div>
      </div>

      {/* Multiple videos */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-400">
            <span className="text-purple-400">演示视频（{project.videos?.length || 0} 个）</span>
          </span>
          <button
            onClick={() => onChange({ ...project, videos: [...(project.videos || []), ""] })}
            className="inline-flex items-center gap-1 rounded-lg border border-dashed border-purple-400/30 px-2 py-1 text-xs text-purple-400 transition-colors hover:bg-purple-400/5"
          >
            <Plus size={12} /> 添加视频
          </button>
        </div>
        <div className="space-y-2">
          {(project.videos || []).map((vid, i) => (
            <FileUpload
              key={i}
              label={`视频 ${i + 1}`}
              dir="projects"
              projectFolder={mediaFolder}
              currentPath={vid}
              onUploaded={(path) => {
                const vids = [...(project.videos || [])];
                vids[i] = path;
                updateProject({ videos: vids });
              }}
              accept="video/*"
              icon={<Video size={16} />}
            />
          ))}
        </div>
      </div>
      <Field label="项目描述（卡片上显示的简短描述）">
        <Textarea
          value={project.description}
          onChange={(v) => onChange({ ...project, description: v })}
          rows={2}
        />
      </Field>
      <Field label="详细介绍（项目详情页展示的完整内容）">
        <Textarea
          value={project.detail || ""}
          onChange={(v) => onChange({ ...project, detail: v })}
          rows={5}
          placeholder="在详情页展示的完整项目介绍..."
        />
      </Field>
      <Field label="技术标签（逗号分隔）">
        <Input
          value={project.tags.join(", ")}
          onChange={(v) =>
            onChange({
              ...project,
              tags: v.split(",").map((t) => t.trim()).filter(Boolean),
            })
          }
          placeholder="React, Node.js, TypeScript"
        />
      </Field>
    </div>
  );
}

// ======================= Experience Editor =======================

function ExperienceEditor({
  exp,
  onChange,
  onDelete,
}: {
  exp: Experience;
  onChange: (e: Experience) => void;
  onDelete: () => void;
}) {
  return (
    <div className="relative space-y-3 rounded-xl border border-white/[0.14] bg-black/35 p-4 shadow-[0_12px_30px_rgba(0,0,0,.18)] backdrop-blur-md">
      <button
        onClick={onDelete}
        className="absolute right-3 top-3 rounded p-1 text-zinc-600 hover:bg-red-500/10 hover:text-red-400"
      >
        <Trash2 size={14} />
      </button>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="时间">
          <Input
            value={exp.period}
            onChange={(v) => onChange({ ...exp, period: v })}
          />
        </Field>
        <Field label="职位/学位">
          <Input
            value={exp.title}
            onChange={(v) => onChange({ ...exp, title: v })}
          />
        </Field>
        <Field label="公司/学校">
          <Input
            value={exp.organization}
            onChange={(v) => onChange({ ...exp, organization: v })}
          />
        </Field>
      </div>
      <Field label="描述">
        <Textarea
          value={exp.description}
          onChange={(v) => onChange({ ...exp, description: v })}
        />
      </Field>
    </div>
  );
}

// ======================= Main Page =======================

export default function AdminPage() {
  const { content, updateContent, resetContent, setDefaultContent } = useContent();
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<SiteContent>(() =>
    JSON.parse(JSON.stringify(content))
  );
  const [saved, setSaved] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  const handleSave = () => {
    const slugs = draft.projects.map((project) => project.slug).filter(Boolean) as string[];
    if (new Set(slugs).size !== slugs.length) {
      alert("每个项目的网页后缀必须唯一，请修改重复的后缀后再保存。");
      return;
    }
    updateContent(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("确定要恢复所有默认内容吗？你当前的修改将丢失。")) {
      const restoredContent = resetContent();
      setDraft(JSON.parse(JSON.stringify(restoredContent)));
    }
  };

  const handleSetCurrentAsDefault = () => {
    setDefaultContent(draft);
    alert("当前整站内容已设为默认。以后点击“恢复默认”会回到这一版。");
  };

  const updateDraft = (partial: Partial<SiteContent>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  };

  const moveProject = (from: number, direction: -1 | 1) => {
    const to = from + direction;
    if (to < 0 || to >= draft.projects.length) return;

    const projects = [...draft.projects];
    [projects[from], projects[to]] = [projects[to], projects[from]];
    updateDraft({ projects });
    setSelectedProjectIndex(to);
  };

  return (
    <AuthGate>
    <div className="min-h-screen pt-20 pb-16 relative z-10">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-2xl border border-white/[0.14] bg-[#070a13]/[0.86] p-4 shadow-[0_28px_90px_rgba(0,0,0,.5)] backdrop-blur-2xl sm:p-6">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 rounded-lg border border-white/[0.16] bg-black/30 px-4 py-2.5 text-base text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft size={14} />
              <ArrowLeft size={18} />
              回到网站
            </button>
            <h1 className="text-2xl font-bold text-zinc-100">内容编辑后台</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
            >
              <Undo2 size={14} />
              恢复默认
            </button>
            <button
              onClick={handleSetCurrentAsDefault}
              className="flex items-center gap-1.5 rounded-lg border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-sm text-amber-300 transition-colors hover:bg-amber-400/15"
            >
              <Bookmark size={14} />
              设为默认
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Save size={14} />
              {saved ? "已保存！" : "保存修改"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-1 rounded-xl border border-white/[0.14] bg-black/35 p-1.5 backdrop-blur-md">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.key !== "projects") setSelectedProjectIndex(null);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-cyan-400/10 text-cyan-400 shadow-sm"
                  : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${selectedProjectIndex ?? "list"}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* ---- HERO ---- */}
            {activeTab === "hero" && (
              <>
                <Field label="问候语（如：你好，我是）">
                  <Input
                    value={draft.heroGreeting}
                    onChange={(v) => updateDraft({ heroGreeting: v })}
                  />
                </Field>
                <Field label="你的姓名">
                  <Input
                    value={draft.heroName}
                    onChange={(v) => updateDraft({ heroName: v })}
                  />
                </Field>
                <Field label="身份标签（逗号分隔，打字机效果轮播）">
                  <Input
                    value={draft.heroRoles.join(", ")}
                    onChange={(v) =>
                      updateDraft({
                        heroRoles: v.split(",").map((r) => r.trim()).filter(Boolean),
                      })
                    }
                  />
                </Field>
                <Field label="简介描述">
                  <Textarea
                    value={draft.heroDescription}
                    onChange={(v) => updateDraft({ heroDescription: v })}
                    rows={3}
                  />
                </Field>
                {/* Avatar upload + preview */}
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <FileUpload
                      label="头像图片（上传后点保存即可生效）"
                      dir="avatar"
                      currentPath={draft.avatarPath}
                      onUploaded={(path) => updateDraft({ avatarPath: path })}
                      accept="image/*"
                      icon={<ImageIcon size={18} />}
                    />
                  </div>
                  {/* Avatar preview */}
                  <div className="shrink-0">
                    <span className="mb-1.5 block text-sm font-medium text-zinc-400">预览</span>
                    <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                      {draft.avatarPath ? (
                        <img src={asset(draft.avatarPath)} alt="头像预览" className="h-full w-full object-cover cursor-pointer" onClick={() => window.open(asset(draft.avatarPath), "_blank")} title="点击查看大图" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl font-bold text-cyan-400">
                          {draft.aboutName.slice(0, 3).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ---- ABOUT ---- */}
            {activeTab === "about" && (
              <>
                <Field label="页面标题">
                  <Input value={draft.aboutTitle} onChange={(v) => updateDraft({ aboutTitle: v })} />
                </Field>
                <Field label="页面副标题">
                  <Input value={draft.aboutSubtitle} onChange={(v) => updateDraft({ aboutSubtitle: v })} />
                </Field>
                <Field label="姓名">
                  <Input value={draft.aboutName} onChange={(v) => updateDraft({ aboutName: v })} />
                </Field>
                <Field label="职位">
                  <Input value={draft.aboutRole} onChange={(v) => updateDraft({ aboutRole: v })} />
                </Field>
                <Field label="个人简介（每行一段）">
                  <Textarea
                    value={draft.aboutBio.join("\n")}
                    onChange={(v) => updateDraft({ aboutBio: v.split("\n").filter(Boolean) })}
                    rows={6}
                  />
                </Field>
                <h3 className="mt-6 text-sm font-medium text-zinc-300">快速信息</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {draft.aboutQuickInfo.map((info, i) => (
                    <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-2">
                      <Input value={info.label} onChange={(v) => {
                        const arr = [...draft.aboutQuickInfo];
                        arr[i] = { ...arr[i], label: v };
                        updateDraft({ aboutQuickInfo: arr });
                      }} placeholder="标签" />
                      <Input value={info.value} onChange={(v) => {
                        const arr = [...draft.aboutQuickInfo];
                        arr[i] = { ...arr[i], value: v };
                        updateDraft({ aboutQuickInfo: arr });
                      }} placeholder="值" />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ---- SKILLS ---- */}
            {activeTab === "skills" && (
              <>
                {draft.skills.map((cat, catIdx) => (
                  <div key={catIdx} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Field label="分类名称">
                        <Input value={cat.title} onChange={(v) => {
                          const arr = [...draft.skills];
                          arr[catIdx] = { ...arr[catIdx], title: v };
                          updateDraft({ skills: arr });
                        }} />
                      </Field>
                      <button
                        onClick={() => updateDraft({ skills: draft.skills.filter((_, i) => i !== catIdx) })}
                        className="mt-5 rounded p-1 text-zinc-600 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <Field label="技能（逗号分隔）">
                      <Input
                        value={cat.items.join(", ")}
                        onChange={(v) => {
                          const arr = [...draft.skills];
                          arr[catIdx] = { ...arr[catIdx], items: v.split(",").map((s) => s.trim()).filter(Boolean) };
                          updateDraft({ skills: arr });
                        }}
                      />
                    </Field>
                  </div>
                ))}
                <button
                  onClick={() => updateDraft({ skills: [...draft.skills, { title: "新分类", items: [] }] })}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/[0.1] py-3 text-sm text-zinc-500 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
                >
                  <Plus size={14} /> 添加技能分类
                </button>
              </>
            )}

            {/* ---- PROJECTS ---- */}
            {activeTab === "projects" && (
              <>
                {selectedProjectIndex === null ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-zinc-100">项目管理</h2>
                        <p className="mt-1 text-sm text-zinc-500">选择一个项目进入独立编辑页</p>
                      </div>
                      <button
                        onClick={() => {
                          const newIndex = draft.projects.length;
                          updateDraft({
                            projects: [...draft.projects, { title: "新项目", description: "", detail: "", tags: [], github: "", demo: "", slug: `project-${newIndex + 1}`, mediaFolder: createProjectMediaFolder("new-project", newIndex), coverImage: "", coverPosition: "center", images: [], videos: [], designImages: [] }],
                          });
                          setSelectedProjectIndex(newIndex);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-400/10 px-3 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-400/15"
                      >
                        <Plus size={15} /> 新建项目
                      </button>
                    </div>
                    <Field label="页面标题">
                      <Input value={draft.projectsTitle} onChange={(v) => updateDraft({ projectsTitle: v })} />
                    </Field>
                    <Field label="页面副标题">
                      <Input value={draft.projectsSubtitle} onChange={(v) => updateDraft({ projectsSubtitle: v })} />
                    </Field>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {draft.projects.map((project, i) => {
                        const cover = project.coverImage || project.images?.find(Boolean);
                        return (
                          <button
                            key={`${project.title}-${i}`}
                            onClick={() => setSelectedProjectIndex(i)}
                            className="group overflow-hidden rounded-xl border border-white/[0.14] bg-black/35 text-left shadow-[0_8px_24px_rgba(0,0,0,.14)] transition-all hover:-translate-y-0.5 hover:border-cyan-400/55 hover:bg-black/50"
                          >
                            <div className="flex min-h-24 items-stretch">
                              <div className="flex w-28 shrink-0 items-center justify-center overflow-hidden border-r border-white/[0.06] bg-white/[0.02]">
                                {cover ? (
                                  <img src={asset(cover)} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <ImageIcon size={20} className="text-zinc-700" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1 p-4">
                                <p className="truncate font-medium text-zinc-200 transition-colors group-hover:text-cyan-300">{project.title || "未命名项目"}</p>
                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{project.description || "尚未填写项目简介"}</p>
                                <p className="mt-2 text-xs text-cyan-400/70">编辑项目 →</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedProjectIndex(null)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-2 text-sm text-zinc-400 transition-colors hover:border-cyan-400/30 hover:text-cyan-300"
                      >
                        <ArrowLeft size={15} /> 返回项目列表
                      </button>
                      <span className="truncate text-sm text-zinc-500">项目 {selectedProjectIndex + 1} / {draft.projects.length}</span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => moveProject(selectedProjectIndex, -1)}
                        disabled={selectedProjectIndex === 0}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] px-2.5 py-2 text-xs text-zinc-400 transition-colors hover:border-cyan-400/30 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <ArrowUp size={14} /> 上移
                      </button>
                      <button
                        type="button"
                        onClick={() => moveProject(selectedProjectIndex, 1)}
                        disabled={selectedProjectIndex === draft.projects.length - 1}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] px-2.5 py-2 text-xs text-zinc-400 transition-colors hover:border-cyan-400/30 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <ArrowDown size={14} /> 下移
                      </button>
                    </div>
                    {draft.projects[selectedProjectIndex] && (
                      <ProjectEditor
                        project={draft.projects[selectedProjectIndex]}
                        projectIndex={selectedProjectIndex}
                        onChange={(project) => {
                          const arr = [...draft.projects];
                          arr[selectedProjectIndex] = project;
                          updateDraft({ projects: arr });
                        }}
                        onDelete={() => {
                          updateDraft({ projects: draft.projects.filter((_, index) => index !== selectedProjectIndex) });
                          setSelectedProjectIndex(null);
                        }}
                      />
                    )}
                  </>
                )}
              </>
            )}

            {/* ---- EXPERIENCE ---- */}
            {activeTab === "experience" && (
              <>
                <Field label="页面标题">
                  <Input value={draft.experienceTitle} onChange={(v) => updateDraft({ experienceTitle: v })} />
                </Field>
                <Field label="页面副标题">
                  <Input value={draft.experienceSubtitle} onChange={(v) => updateDraft({ experienceSubtitle: v })} />
                </Field>
                <div className="space-y-4">
                  {draft.experiences.map((exp, i) => (
                    <ExperienceEditor
                      key={i}
                      exp={exp}
                      onChange={(e) => {
                        const arr = [...draft.experiences];
                        arr[i] = e;
                        updateDraft({ experiences: arr });
                      }}
                      onDelete={() => updateDraft({ experiences: draft.experiences.filter((_, idx) => idx !== i) })}
                    />
                  ))}
                </div>
                <button
                  onClick={() => updateDraft({
                    experiences: [...draft.experiences, { period: "2025 — 至今", title: "新职位", organization: "公司名称", description: "" }],
                  })}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/[0.1] py-3 text-sm text-zinc-500 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
                >
                  <Plus size={14} /> 添加经历
                </button>
              </>
            )}

            {/* ---- CONTACT ---- */}
            {activeTab === "contact" && (
              <>
                <Field label="页面标题">
                  <Input value={draft.contactTitle} onChange={(v) => updateDraft({ contactTitle: v })} />
                </Field>
                <Field label="页面副标题">
                  <Input value={draft.contactSubtitle} onChange={(v) => updateDraft({ contactSubtitle: v })} />
                </Field>
                <h3 className="mt-6 text-sm font-medium text-zinc-300">联系方式</h3>
                <div className="space-y-3">
                  {draft.contacts.map((c, i) => (
                    <div key={i} className="grid gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 sm:grid-cols-4">
                      <Input value={c.label} onChange={(v) => {
                        const arr = [...draft.contacts]; arr[i] = { ...arr[i], label: v }; updateDraft({ contacts: arr });
                      }} placeholder="标签" />
                      <Input value={c.value} onChange={(v) => {
                        const arr = [...draft.contacts]; arr[i] = { ...arr[i], value: v }; updateDraft({ contacts: arr });
                      }} placeholder="显示值" />
                      <Input value={c.href} onChange={(v) => {
                        const arr = [...draft.contacts]; arr[i] = { ...arr[i], href: v }; updateDraft({ contacts: arr });
                      }} placeholder="链接" />
                      <div className="flex items-center gap-2">
                        <select
                          value={c.icon}
                          onChange={(v) => { const arr = [...draft.contacts]; arr[i] = { ...arr[i], icon: v.target.value }; updateDraft({ contacts: arr }); }}
                          className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-2 text-xs text-zinc-300 outline-none"
                        >
                          <option value="mail">邮件</option>
                          <option value="globe">网站</option>
                          <option value="link2">链接</option>
                          <option value="message-circle">聊天</option>
                          <option value="map-pin">位置</option>
                        </select>
                        <button onClick={() => updateDraft({ contacts: draft.contacts.filter((_, idx) => idx !== i) })} className="rounded p-1 text-zinc-600 hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => updateDraft({ contacts: [...draft.contacts, { label: "新方式", value: "", href: "", icon: "globe" }] })}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/[0.1] py-3 text-sm text-zinc-500 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
                >
                  <Plus size={14} /> 添加联系方式
                </button>
                <Field label="状态标题">
                  <Input value={draft.contactStatusTitle} onChange={(v) => updateDraft({ contactStatusTitle: v })} />
                </Field>
                <Field label="状态文字">
                  <Textarea value={draft.contactStatusText} onChange={(v) => updateDraft({ contactStatusText: v })} />
                </Field>
              </>
            )}

            {/* ---- WALLPAPER ---- */}
            {activeTab === "wallpaper" && (
              <>
                {/* Theme selector */}
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-4">
                  <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <Layers size={16} className="text-purple-400" />
                    主题选择
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <button onClick={() => updateDraft({ theme: "cyber" })} className={`rounded-xl border p-3 text-left transition-all ${draft.theme === "cyber" ? "border-cyan-400/40 bg-cyan-400/10" : "border-white/[0.06] bg-white/[0.02] hover:border-cyan-400/20"}`}>
                      <div className="mb-2 h-2 w-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-600" />
                      <p className="text-sm font-medium text-zinc-200">暗夜科技</p>
                      <p className="text-xs text-zinc-500 mt-1">青紫渐变 · 粒子网格</p>
                    </button>
                    <button onClick={() => updateDraft({ theme: "frostmoon" })} className={`rounded-xl border p-3 text-left transition-all ${draft.theme === "frostmoon" ? "border-blue-400/40 bg-blue-400/10" : "border-white/[0.06] bg-white/[0.02] hover:border-blue-300/20"}`}>
                      <div className="mb-2 h-2 w-full rounded-full bg-gradient-to-r from-[#f7fbff] via-[#a9ddff] to-[#5fa8d6]" />
                      <p className="text-sm font-medium text-zinc-200">霜月</p>
                      <p className="text-xs text-zinc-500 mt-1">深寒夜 · 冰月辉光</p>
                    </button>
                    <button onClick={() => updateDraft({ theme: "hengyue" })} className={`rounded-xl border p-3 text-left transition-all ${draft.theme === "hengyue" ? "border-amber-400/40 bg-amber-400/10" : "border-white/[0.06] bg-white/[0.02] hover:border-amber-400/20"}`}>
                      <div className="mb-2 h-2 w-full rounded-full bg-gradient-to-r from-[#fff9ec] via-[#ffd56f] to-[#b69ce8]" />
                      <p className="text-sm font-medium text-zinc-200">恒月</p>
                      <p className="text-xs text-zinc-500 mt-1">金月光辉 · 鎏金星野</p>
                    </button>
                    <button onClick={() => updateDraft({ theme: "hongyue" })} className={`rounded-xl border p-3 text-left transition-all ${draft.theme === "hongyue" ? "border-red-400/40 bg-red-400/10" : "border-white/[0.06] bg-white/[0.02] hover:border-red-400/20"}`}>
                      <div className="mb-2 h-2 w-full rounded-full bg-gradient-to-r from-[#ff7869] via-[#ff424f] to-[#d790aa]" />
                      <p className="text-sm font-medium text-zinc-200">虹月</p>
                      <p className="text-xs text-zinc-500 mt-1">赤月光辉 · 暗红涌动</p>
                    </button>
                  </div>
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
    </div>
    </AuthGate>
  );
}
