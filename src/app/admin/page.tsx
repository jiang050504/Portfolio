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
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="项目名称">
          <Input
            value={project.title}
            onChange={(v) => onChange({ ...project, title: v })}
          />
        </Field>
        <Field label="GitHub 链接">
          <Input
            value={project.github}
            onChange={(v) => onChange({ ...project, github: v })}
            placeholder="https://github.com/..."
          />
        </Field>
      </div>
      <Field label="演示链接（飞书/网页等）" color="text-green-400">
        <Input
          value={project.demo}
          onChange={(v) => onChange({ ...project, demo: v })}
          placeholder="https://..."
        />
      </Field>
      {/* Multiple images */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-400">
            <span className="text-purple-400">项目截图（{project.images?.length || 0} 张）</span>
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
              currentPath={img}
              onUploaded={(path) => {
                const imgs = [...(project.images || [])];
                imgs[i] = path;
                onChange({ ...project, images: imgs });
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
              currentPath={vid}
              onUploaded={(path) => {
                const vids = [...(project.videos || [])];
                vids[i] = path;
                onChange({ ...project, videos: vids });
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
    <div className="relative rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
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
  const { content, updateContent, resetContent } = useContent();
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [draft, setDraft] = useState<SiteContent>(() =>
    JSON.parse(JSON.stringify(content))
  );
  const [saved, setSaved] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  const handleSave = () => {
    updateContent(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("确定要恢复所有默认内容吗？你当前的修改将丢失。")) {
      resetContent();
      setDraft(JSON.parse(JSON.stringify(defaultContent)));
    }
  };

  const updateDraft = (partial: Partial<SiteContent>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  };

  return (
    <AuthGate>
    <div className="min-h-screen pt-20 pb-16 relative z-10">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 rounded-lg border border-white/[0.08] px-4 py-2.5 text-base text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200"
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
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Save size={14} />
              {saved ? "已保存！" : "保存修改"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-cyan-400/10 text-cyan-400 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
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
            key={activeTab}
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
                <Field label="页面标题">
                  <Input value={draft.projectsTitle} onChange={(v) => updateDraft({ projectsTitle: v })} />
                </Field>
                <Field label="页面副标题">
                  <Input value={draft.projectsSubtitle} onChange={(v) => updateDraft({ projectsSubtitle: v })} />
                </Field>
                <div className="space-y-4">
                  {draft.projects.map((project, i) => (
                    <ProjectEditor
                      key={i}
                      project={project}
                      onChange={(p) => {
                        const arr = [...draft.projects];
                        arr[i] = p;
                        updateDraft({ projects: arr });
                      }}
                      onDelete={() => updateDraft({ projects: draft.projects.filter((_, idx) => idx !== i) })}
                    />
                  ))}
                </div>
                <button
                  onClick={() => updateDraft({
                    projects: [...draft.projects, { title: "新项目", description: "", detail: "", tags: [], github: "", demo: "", images: [], videos: [] }],
                  })}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/[0.1] py-3 text-sm text-zinc-500 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
                >
                  <Plus size={14} /> 添加项目
                </button>
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
                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Cyber theme */}
                    <button
                      onClick={() => updateDraft({ theme: "cyber" })}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        draft.theme === "cyber"
                          ? "border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-cyan-400/20"
                      }`}
                    >
                      <div className="mb-2 h-2 w-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-600" />
                      <p className="text-sm font-medium text-zinc-200">暗夜科技</p>
                      <p className="text-xs text-zinc-500 mt-1">青紫渐变 · 粒子网格 · 科技感</p>
                    </button>

                    {/* Frost Moon theme */}
                    <button
                      onClick={() => updateDraft({ theme: "frostmoon" })}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        draft.theme === "frostmoon"
                          ? "border-[var(--accent-primary)]/40 bg-[var(--accent-glow)] shadow-[0_0_20px_rgba(140,200,212,0.1)]"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-blue-300/20"
                      }`}
                    >
                      <div className="mb-2 h-2 w-full rounded-full bg-gradient-to-r from-[#c8dff0] via-[#8ec8d4] to-[#9bb4d4]" />
                      <p className="text-sm font-medium text-zinc-200">霜月</p>
                      <p className="text-xs text-zinc-500 mt-1">清冷月光 · 霜雪粒子 · 东方美学</p>
                    </button>
                  </div>
                  {draft.theme === "frostmoon" && (
                    <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                      <span className="rounded-full bg-[#c8dff0]/10 px-2 py-0.5">#c8dff0 霜白</span>
                      <span className="rounded-full bg-[#8ec8d4]/10 px-2 py-0.5">#8ec8d4 霜青</span>
                      <span className="rounded-full bg-[#7b9ec7]/10 px-2 py-0.5">#7b9ec7 月蓝</span>
                      <span className="rounded-full bg-[#a8bcd4]/10 px-2 py-0.5">#a8bcd4 银蓝</span>
                    </div>
                  )}
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
