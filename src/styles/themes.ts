/*
 * 主题色板定义
 * 霜月 Frost Moon — 清冷 / 月光感 / 初冬 / 雾霜 / 低饱和 / 东方美学
 */

export type ThemeId = "cyber" | "frostmoon";

export interface ThemeDef {
  id: ThemeId;
  name: string;
  description: string;
  // CSS 自定义属性键值
  cssVars: Record<string, string>;
  // 背景特效类型
  bgEffect: "particles-cyber" | "snowflakes" | "none";
}

export const themes: Record<ThemeId, ThemeDef> = {
  cyber: {
    id: "cyber",
    name: "暗夜科技",
    description: "深色科技风，青紫渐变，粒子网格",
    cssVars: {
      "--bg-deep": "#0a0a0f",
      "--bg-card": "rgba(255,255,255,0.03)",
      "--border-card": "rgba(255,255,255,0.06)",
      "--text-primary": "#e4e4e7",
      "--text-secondary": "#a1a1aa",
      "--text-muted": "#71717a",
      "--accent-primary": "#06b6d4",
      "--accent-secondary": "#8b5cf6",
      "--accent-glow": "rgba(6,182,212,0.15)",
      "--accent-glow-strong": "rgba(6,182,212,0.3)",
      "--gradient-hero": "linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899)",
      "--gradient-btn": "linear-gradient(135deg, #06b6d4, #8b5cf6)",
      "--orb-1": "rgba(6,182,212,0.1)",
      "--orb-2": "rgba(139,92,246,0.1)",
      "--particle-color": "rgba(6, 182, 212, 0.15)",
      "--particle-line": "rgba(6, 182, 212, {opacity})",
    },
    bgEffect: "particles-cyber",
  },

  frostmoon: {
    id: "frostmoon",
    name: "霜月",
    description: "清冷月光，霜雾初冬，东方低调美学",
    cssVars: {
      // 基础
      "--bg-deep": "#0b1018",
      "--bg-card": "rgba(180,200,220,0.04)",
      "--border-card": "rgba(180,200,220,0.07)",

      // 文字
      "--text-primary": "#dce6f0",   // 霜白
      "--text-secondary": "#a8bcd4", // 银蓝
      "--text-muted": "#6b7d94",     // 雾灰

      // 强调色
      "--accent-primary": "#8ec8d4",    // 霜青
      "--accent-secondary": "#7b9ec7",  // 月蓝
      "--accent-glow": "rgba(140,200,212,0.12)",
      "--accent-glow-strong": "rgba(140,200,212,0.25)",

      // 渐变
      "--gradient-hero": "linear-gradient(135deg, #c8dff0, #8ec8d4, #9bb4d4)",
      "--gradient-btn": "linear-gradient(135deg, #8bb8c8, #7b9ec7)",

      // 光晕
      "--orb-1": "rgba(180,210,230,0.06)",
      "--orb-2": "rgba(200,220,240,0.04)",

      // 粒子
      "--particle-color": "rgba(200, 220, 240, 0.18)",
      "--particle-line": "rgba(180, 210, 230, {opacity})",
    },
    bgEffect: "snowflakes",
  },
};

export function getTheme(id: ThemeId): ThemeDef {
  return themes[id] || themes.cyber;
}
