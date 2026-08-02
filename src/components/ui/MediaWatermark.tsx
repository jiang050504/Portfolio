"use client";

export default function MediaWatermark({ visible = false }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 select-none overflow-hidden"
    >
      <div className="absolute -inset-x-16 top-1/2 -translate-y-1/2 -rotate-[24deg] whitespace-nowrap text-center text-[10px] font-semibold tracking-[0.34em] text-white/45 drop-shadow-[0_1px_2px_rgba(0,0,0,.85)] sm:text-xs">
        浅梦 · 浅梦 · 浅梦 · 浅梦 · 浅梦 · 浅梦
      </div>
      <div className="absolute -inset-x-16 top-[22%] -rotate-[24deg] whitespace-nowrap text-center text-[9px] font-medium tracking-[0.3em] text-white/25 sm:text-[11px]">
        浅梦 · 浅梦 · 浅梦 · 浅梦
      </div>
      <div className="absolute -inset-x-16 top-[78%] -rotate-[24deg] whitespace-nowrap text-center text-[9px] font-medium tracking-[0.3em] text-white/25 sm:text-[11px]">
        浅梦 · 浅梦 · 浅梦 · 浅梦
      </div>
    </div>
  );
}
