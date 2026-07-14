export type ThemeId = "cyber" | "frostmoon" | "hengyue" | "hongyue";

export interface ThemeDef {
  id: ThemeId;
  name: string;
  description: string;
  cssVars: Record<string, string>;
  bgEffect: "particles-cyber" | "snowflakes" | "golddust" | "stardust" | "none";
}

export const themes: Record<ThemeId, ThemeDef> = {
  cyber: {
    id: "cyber", name: "暗夜科技", description: "青紫渐变 · 粒子网络",
    cssVars: {
      "--bg-deep": "#0a0a0f", "--bg-card": "rgba(255,255,255,0.03)", "--border-card": "rgba(255,255,255,0.06)",
      "--text-primary": "#e4e4e7", "--text-secondary": "#a1a1aa", "--text-muted": "#71717a",
      "--accent-primary": "#06b6d4", "--accent-secondary": "#8b5cf6",
      "--accent-glow": "rgba(6,182,212,0.15)", "--accent-glow-strong": "rgba(6,182,212,0.30)",
      "--gradient-hero": "linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899)",
      "--gradient-btn": "linear-gradient(135deg, #06b6d4, #8b5cf6)",
      "--orb-1": "rgba(6,182,212,0.10)", "--orb-2": "rgba(139,92,246,0.10)",
      "--particle-color": "rgba(6,182,212,0.15)", "--particle-line": "rgba(6,182,212,{opacity})",
    }, bgEffect: "particles-cyber"
  },
  frostmoon: {
    id: "frostmoon", name: "霜月", description: "深寒夜 · 冰月辉光",
    cssVars: {
      "--bg-deep": "#07121d", "--bg-card": "rgba(8,22,34,0.66)", "--border-card": "rgba(216,241,255,0.28)",
      "--text-primary": "#f7fbff", "--text-secondary": "#a9c0d4", "--text-muted": "#6f879c",
      "--accent-primary": "#5fa8d6", "--accent-secondary": "#a9ddff",
      "--accent-glow": "rgba(95,168,214,0.15)", "--accent-glow-strong": "rgba(95,168,214,0.28)",
      "--gradient-hero": "linear-gradient(135deg, #f7fbff, #a9ddff, #5fa8d6)",
      "--gradient-btn": "linear-gradient(135deg, #5fa8d6, #a9ddff)",
      "--orb-1": "rgba(216,241,255,0.14)", "--orb-2": "rgba(95,168,214,0.10)",
      "--particle-color": "rgba(217,232,246,0.22)", "--particle-line": "rgba(216,241,255,{opacity})",
    }, bgEffect: "snowflakes"
  },
  hengyue: {
    id: "hengyue", name: "恒月", description: "金月光辉 · 鎏金星野",
    cssVars: {
      "--bg-deep": "#080712", "--bg-card": "rgba(17,12,26,0.72)", "--border-card": "rgba(255,213,111,0.28)",
      "--text-primary": "#fff9ec", "--text-secondary": "#c2b2c9", "--text-muted": "#8e7f9b",
      "--accent-primary": "#ffd56f", "--accent-secondary": "#b69ce8",
      "--accent-glow": "rgba(255,213,111,0.16)", "--accent-glow-strong": "rgba(255,213,111,0.30)",
      "--gradient-hero": "linear-gradient(135deg, #fff9ec, #ffd56f, #b69ce8)",
      "--gradient-btn": "linear-gradient(135deg, #ffb84d, #ffd56f)",
      "--orb-1": "rgba(255,213,111,0.10)", "--orb-2": "rgba(182,156,232,0.08)",
      "--particle-color": "rgba(255,224,139,0.24)", "--particle-line": "rgba(255,213,111,{opacity})",
    }, bgEffect: "golddust"
  },
  hongyue: {
    id: "hongyue", name: "虹月", description: "赤月光辉 · 暗红涌动",
    cssVars: {
      "--bg-deep": "#050308", "--bg-card": "rgba(19,8,17,0.74)", "--border-card": "rgba(255,122,104,0.24)",
      "--text-primary": "#fff7f8", "--text-secondary": "#c6a4b7", "--text-muted": "#937487",
      "--accent-primary": "#ff424f", "--accent-secondary": "#ff9b7b",
      "--accent-glow": "rgba(255,66,79,0.18)", "--accent-glow-strong": "rgba(255,66,79,0.32)",
      "--gradient-hero": "linear-gradient(135deg, #ff7869, #ff424f, #d790aa)",
      "--gradient-btn": "linear-gradient(135deg, #ff424f, #ff9b7b)",
      "--orb-1": "rgba(255,66,79,0.10)", "--orb-2": "rgba(215,144,170,0.08)",
      "--particle-color": "rgba(255,155,123,0.22)", "--particle-line": "rgba(255,122,104,{opacity})",
    }, bgEffect: "stardust"
  },
};

export function getTheme(id: ThemeId): ThemeDef {
  return themes[id] || themes.cyber;
}
