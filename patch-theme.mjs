import { readFileSync, writeFileSync } from 'fs';
const c = readFileSync('src/app/admin/page.tsx', 'utf8');
const old = '<div className="grid gap-3 sm:grid-cols-2">';
const end = '                {/* Wallpaper settings */}';
const oi = c.indexOf(old), ei = c.indexOf(end);
const cards = `<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">\n` +
`                    <button onClick={() => updateDraft({ theme: "cyber" })} className={draft.theme === "cyber" ? "rounded-xl border border-cyan-400/40 bg-cyan-400/10 p-3 text-left" : "rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left hover:border-cyan-400/20"}>\n` +
`                      <div className="mb-2 h-2 w-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-600" />\n` +
`                      <p className="text-sm font-medium text-zinc-200">暗夜科技</p>\n` +
`                      <p className="text-xs text-zinc-500 mt-1">青紫渐变 · 粒子网格</p>\n` +
`                    </button>\n` +
`                    <button onClick={() => updateDraft({ theme: "frostmoon" })} className={draft.theme === "frostmoon" ? "rounded-xl border border-blue-400/40 bg-blue-400/10 p-3 text-left" : "rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left hover:border-blue-300/20"}>\n` +
`                      <div className="mb-2 h-2 w-full rounded-full bg-gradient-to-r from-[#f7fbff] via-[#a9ddff] to-[#5fa8d6]" />\n` +
`                      <p className="text-sm font-medium text-zinc-200">霜月</p>\n` +
`                      <p className="text-xs text-zinc-500 mt-1">深寒夜 · 冰月辉光</p>\n` +
`                    </button>\n` +
`                    <button onClick={() => updateDraft({ theme: "hengyue" })} className={draft.theme === "hengyue" ? "rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-left" : "rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left hover:border-amber-400/20"}>\n` +
`                      <div className="mb-2 h-2 w-full rounded-full bg-gradient-to-r from-[#fff9ec] via-[#ffd56f] to-[#b69ce8]" />\n` +
`                      <p className="text-sm font-medium text-zinc-200">恒月</p>\n` +
`                      <p className="text-xs text-zinc-500 mt-1">金月光辉 · 鎏金星野</p>\n` +
`                    </button>\n` +
`                    <button onClick={() => updateDraft({ theme: "hongyue" })} className={draft.theme === "hongyue" ? "rounded-xl border border-red-400/40 bg-red-400/10 p-3 text-left" : "rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left hover:border-red-400/20"}>\n` +
`                      <div className="mb-2 h-2 w-full rounded-full bg-gradient-to-r from-[#ff7869] via-[#ff424f] to-[#d790aa]" />\n` +
`                      <p className="text-sm font-medium text-zinc-200">虹月</p>\n` +
`                      <p className="text-xs text-zinc-500 mt-1">赤月光辉 · 暗红涌动</p>\n` +
`                    </button>\n` +
`                  </div>`;
const result = c.slice(0, oi) + cards + '\n' + c.slice(ei);
writeFileSync('src/app/admin/page.tsx', result);
console.log('Patched');
