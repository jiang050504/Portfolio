"use client";

import { useEffect, useRef } from "react";
import { useContent } from "@/context/ContentContext";

export default function MouseGlow() {
  const { content } = useContent();
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -999, y: -999 });
  const targetRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    if (content.theme !== "hongyue") return;

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    let raf: number;
    const animate = () => {
      const el = glowRef.current;
      if (!el) return;
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.08;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.08;
      el.style.background = `radial-gradient(circle 300px at ${posRef.current.x}px ${posRef.current.y}px, rgba(200,100,240,0.06) 0%, rgba(240,100,200,0.03) 40%, transparent 70%)`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [content.theme]);

  if (content.theme !== "hongyue") return null;

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
