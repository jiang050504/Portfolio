"use client";

import { useEffect, useRef, useCallback } from "react";
import { useContent } from "@/context/ContentContext";
import { asset } from "@/lib/path";

/* ================================================================
   Cyber Particles — 网络节点粒子（暗夜科技主题）
   ================================================================ */
function useCyberParticles(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  active: boolean
) {
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; r: number }[]
  >([]);
  const animRef = useRef<number>(0);

  const init = useCallback(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = Math.min(80, Math.floor(window.innerWidth / 15));
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 0.5,
    }));

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(6, 182, 212, 0.15)";
        ctx.fill();
      });

      particlesRef.current.forEach((a, i) => {
        particlesRef.current.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.04 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        });
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [active, canvasRef]);

  useEffect(() => { const c = init(); return () => c?.(); }, [init]);
}

/* ================================================================
   Snowflakes — 霜雪飘落粒子（霜月主题）
   特性：飘落 + 旋转 + 鼠标微风 + 冰晶连线 + 发光光晕
   ================================================================ */
interface Snowflake {
  x: number; y: number; r: number;
  vy: number; vx: number;
  opacity: number; rotation: number; rotSpeed: number;
}

function useSnowflakes(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  active: boolean
) {
  const flakesRef = useRef<Snowflake[]>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  const init = useCallback(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = Math.min(100, Math.floor(window.innerWidth / 10));
    flakesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 3 + 0.5,
      vy: Math.random() * 0.4 + 0.15,
      vx: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 0.5,
    }));

    const onMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    const draw = () => {
      if (!ctx || !canvas) return;
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.02;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      flakesRef.current.forEach((f) => {
        f.y += f.vy;
        const mx = (mouseRef.current.x - canvas.width / 2) / canvas.width;
        f.x += f.vx + mx * 0.3;
        f.rotation += f.rotSpeed;
        if (f.y > canvas.height + 10) { f.y = -10; f.x = Math.random() * canvas.width; }
        if (f.x > canvas.width + 10) f.x = -10;
        if (f.x < -10) f.x = canvas.width + 10;

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate((f.rotation * Math.PI) / 180);
        ctx.beginPath();
        ctx.arc(0, 0, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 230, 245, ${f.opacity})`;
        ctx.fill();
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, f.r * 3);
        glow.addColorStop(0, `rgba(220, 240, 255, ${f.opacity * 0.6})`);
        glow.addColorStop(1, "rgba(220, 240, 255, 0)");
        ctx.beginPath();
        ctx.arc(0, 0, f.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.restore();
      });

      // Frost crystal connections
      for (let i = 0; i < flakesRef.current.length; i++) {
        for (let j = i + 1; j < flakesRef.current.length; j++) {
          const a = flakesRef.current[i];
          const b = flakesRef.current[j];
          const dx = a.x - b.x; const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(200, 225, 245, ${0.03 * (1 - dist / 90)})`;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animRef.current);
    };
  }, [active, canvasRef]);

  useEffect(() => { const c = init(); return () => c?.(); }, [init]);
}

/* ================================================================
   Background — 全局背景容器
   ================================================================ */
export default function Background() {
  const { content } = useContent();
  const {
    theme,
    wallpaperEnabled,
    wallpaperPath,
    wallpaperOpacity,
    wallpaperBlur,
    particlesOnWallpaper,
  } = content;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isFrostmoon = theme === "frostmoon";
  const showParticles = !wallpaperEnabled || particlesOnWallpaper;

  // Always call both hooks — they no-op when active=false
  useCyberParticles(canvasRef, !isFrostmoon && showParticles);
  useSnowflakes(canvasRef, isFrostmoon && showParticles);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          opacity: isFrostmoon ? 0.02 : 0.03,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: isFrostmoon ? "80px 80px" : "60px 60px",
        }}
      />

      {/* Wallpaper */}
      {wallpaperEnabled && wallpaperPath && (
        <div className="absolute inset-0">
          <img
            src={asset(wallpaperPath)}
            alt=""
            className="h-full w-full"
            style={{
              objectFit: "cover",
              opacity: wallpaperOpacity,
              filter: wallpaperBlur > 0 ? `blur(${wallpaperBlur}px)` : undefined,
            }}
          />
          {isFrostmoon && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(180,210,230,0.08) 0%, rgba(140,180,210,0.04) 50%, rgba(100,140,170,0.06) 100%)",
                mixBlendMode: "overlay",
              }}
            />
          )}
        </div>
      )}

      {/* Cyber orbs */}
      {!isFrostmoon && showParticles && (
        <>
          <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
        </>
      )}

      {/* Frost Moon orbs */}
      {isFrostmoon && (
        <>
          {/* Moon */}
          <div
            className="pointer-events-none absolute -top-20 right-[15%] h-[350px] w-[350px]"
            style={{
              background:
                "radial-gradient(circle, rgba(230,240,250,0.25) 0%, rgba(200,220,240,0.1) 30%, rgba(160,200,225,0.03) 60%, transparent 70%)",
              filter: "blur(40px)",
              animation: "moon-pulse 8s ease-in-out infinite",
            }}
          />
          {/* Secondary glow */}
          <div
            className="pointer-events-none absolute -bottom-20 left-[20%] h-[250px] w-[400px]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(190,215,235,0.12) 0%, rgba(160,200,220,0.05) 40%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          {/* Ground frost */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-[30vh]"
            style={{
              background:
                "linear-gradient(0deg, rgba(170,200,220,0.06) 0%, rgba(140,180,200,0.03) 40%, transparent 100%)",
              animation: "mist-drift 20s ease-in-out infinite",
            }}
          />
          {/* Ambient glows */}
          <div
            className="pointer-events-none absolute left-0 top-[20%] h-[200px] w-[200px] opacity-30"
            style={{
              background: "radial-gradient(circle, rgba(200,220,240,0.06) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="pointer-events-none absolute right-0 top-[50%] h-[150px] w-[150px] opacity-25"
            style={{
              background: "radial-gradient(circle, rgba(180,210,230,0.05) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </>
      )}

      {/* Shared particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
