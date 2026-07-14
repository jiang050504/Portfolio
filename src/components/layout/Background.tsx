"use client";

import { useEffect, useRef, useCallback } from "react";
import { useContent } from "@/context/ContentContext";
import { asset } from "@/lib/path";

// Theme default wallpapers
const DEFAULT_WALLPAPERS: Record<string, string> = {
  frostmoon: "/wallpapers/霜月.png",
  hengyue: "/wallpapers/恒月.png",
  hongyue: "/wallpapers/虹月.png",
};

// ==================== Cyber ====================
function useCyberParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>, active: boolean) {
  const pRef = useRef<{x:number;y:number;vx:number;vy:number;r:number}[]>([]);
  const aRef = useRef(0);
  const init = useCallback(() => {
    if(!active)return;const c=canvasRef.current;if(!c)return;const ctx=c.getContext("2d");if(!ctx)return;
    const R=()=>{c.width=window.innerWidth;c.height=window.innerHeight};R();window.addEventListener("resize",R);
    const n=Math.min(80,Math.floor(window.innerWidth/15));
    pRef.current=Array.from({length:n},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,r:Math.random()*2+.5}));
    const D=()=>{if(!ctx||!c)return;ctx.clearRect(0,0,c.width,c.height);
    pRef.current.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=c.width;if(p.x>c.width)p.x=0;if(p.y<0)p.y=c.height;if(p.y>c.height)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle="rgba(6,182,212,0.15)";ctx.fill()});
    pRef.current.forEach((a,i)=>{pRef.current.slice(i+1).forEach(b=>{const dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);if(d<120){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(6,182,212,${0.04*(1-d/120)})`;ctx.stroke()}})});
    aRef.current=requestAnimationFrame(D)};D();return()=>{window.removeEventListener("resize",R);cancelAnimationFrame(aRef.current)}},[active,canvasRef]);
  useEffect(()=>{const c=init();return()=>c?.()},[init]);
}

// ==================== Frostmoon ====================
function useSnowflakes(canvasRef: React.RefObject<HTMLCanvasElement | null>, active: boolean) {
  const fRef = useRef<{x:number;y:number;r:number;vy:number;vx:number;o:number;rot:number;rs:number}[]>([]);
  const aRef = useRef(0);const mRef=useRef({x:0,y:0});const tRef=useRef({x:0,y:0});
  const init = useCallback(() => {
    if(!active)return;const c=canvasRef.current;if(!c)return;const ctx=c.getContext("2d");if(!ctx)return;
    const R=()=>{c.width=window.innerWidth;c.height=window.innerHeight};R();window.addEventListener("resize",R);
    const n=Math.min(100,Math.floor(window.innerWidth/10));
    fRef.current=Array.from({length:n},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*3+.5,vy:Math.random()*.4+.15,vx:(Math.random()-.5)*.3,o:Math.random()*.5+.2,rot:Math.random()*360,rs:(Math.random()-.5)*.5}));
    const M=(e:MouseEvent)=>{tRef.current={x:e.clientX,y:e.clientY}};window.addEventListener("mousemove",M);
    const D=()=>{if(!ctx||!c)return;mRef.current.x+=(tRef.current.x-mRef.current.x)*.02;mRef.current.y+=(tRef.current.y-mRef.current.y)*.02;ctx.clearRect(0,0,c.width,c.height);
    fRef.current.forEach(f=>{f.y+=f.vy;const mx=(mRef.current.x-c.width/2)/c.width;f.x+=f.vx+mx*.3;f.rot+=f.rs;if(f.y>c.height+10){f.y=-10;f.x=Math.random()*c.width}if(f.x>c.width+10)f.x=-10;if(f.x<-10)f.x=c.width+10;ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.rot*Math.PI/180);ctx.beginPath();ctx.arc(0,0,f.r,0,Math.PI*2);ctx.fillStyle=`rgba(210,230,245,${f.o})`;ctx.fill();const g=ctx.createRadialGradient(0,0,0,0,0,f.r*3);g.addColorStop(0,`rgba(220,240,255,${f.o*.6})`);g.addColorStop(1,"transparent");ctx.beginPath();ctx.arc(0,0,f.r*3,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();ctx.restore()});
    for(let i=0;i<fRef.current.length;i++)for(let j=i+1;j<fRef.current.length;j++){const a=fRef.current[i],b=fRef.current[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);if(d<90){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(200,225,245,${.03*(1-d/90)})`;ctx.stroke()}}
    aRef.current=requestAnimationFrame(D)};D();return()=>{window.removeEventListener("resize",R);window.removeEventListener("mousemove",M);cancelAnimationFrame(aRef.current)}},[active,canvasRef]);
  useEffect(()=>{const c=init();return()=>c?.()},[init]);
}

// ==================== Hengyue ====================
function useGoldDust(canvasRef: React.RefObject<HTMLCanvasElement | null>, active: boolean) {
  const dRef=useRef<{x:number;y:number;r:number;vy:number;vx:number;o:number;p:number;s:number}[]>([]);
  const aRef=useRef(0);const tRef=useRef(0);
  const init=useCallback(()=>{
    if(!active)return;const c=canvasRef.current;if(!c)return;const ctx=c.getContext("2d");if(!ctx)return;
    const R=()=>{c.width=window.innerWidth;c.height=window.innerHeight};R();window.addEventListener("resize",R);
    const n=Math.min(80,Math.floor(window.innerWidth/12));
    dRef.current=Array.from({length:n},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*2+.5,vy:Math.random()*.3+.1,vx:(Math.random()-.5)*.4,o:Math.random()*.5+.3,p:Math.random()*Math.PI*2,s:Math.random()*1.5+.5}));
    const D=()=>{if(!ctx||!c)return;tRef.current+=.016;const t=tRef.current;ctx.clearRect(0,0,c.width,c.height);
    dRef.current.forEach(d=>{d.y+=d.vy;d.x+=d.vx+Math.sin(t*d.s+d.p)*.3;if(d.y>c.height+10){d.y=-10;d.x=Math.random()*c.width}if(d.x<0)d.x=c.width;if(d.x>c.width)d.x=0;const a=d.o*(.6+.4*Math.sin(t*2+d.p));ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,224,139,${a})`;ctx.fill();const g=ctx.createRadialGradient(d.x,d.y,0,d.x,d.y,d.r*4);g.addColorStop(0,`rgba(255,213,111,${a*.5})`);g.addColorStop(1,"transparent");ctx.beginPath();ctx.arc(d.x,d.y,d.r*4,0,Math.PI*2);ctx.fillStyle=g;ctx.fill()});
    aRef.current=requestAnimationFrame(D)};D();return()=>{window.removeEventListener("resize",R);cancelAnimationFrame(aRef.current)}},[active,canvasRef]);
  useEffect(()=>{const c=init();return()=>c?.()},[init]);
}

// ==================== Hongyue ====================
function useEmbers(canvasRef: React.RefObject<HTMLCanvasElement | null>, active: boolean) {
  const eRef=useRef<{x:number;y:number;r:number;vy:number;vx:number;o:number;t:number;p:number}[]>([]);
  const aRef=useRef(0);const tRef=useRef(0);
  const init=useCallback(()=>{
    if(!active)return;const c=canvasRef.current;if(!c)return;const ctx=c.getContext("2d");if(!ctx)return;
    const R=()=>{c.width=window.innerWidth;c.height=window.innerHeight};R();window.addEventListener("resize",R);
    const n=Math.min(60,Math.floor(window.innerWidth/16));
    eRef.current=Array.from({length:n},()=>({x:Math.random()*c.width*.4,y:Math.random()*c.height,r:Math.random()*2.5+.5,vy:Math.random()*.5+.2,vx:Math.random()*.4+.2,o:Math.random()*.5+.3,t:Math.random()*4+3,p:Math.random()*Math.PI*2}));
    const D=()=>{if(!ctx||!c)return;tRef.current+=.016;const t=tRef.current;ctx.clearRect(0,0,c.width,c.height);
    eRef.current.forEach(e=>{e.y+=e.vy;e.x+=e.vx;if(e.y>c.height+10){e.y=-10;e.x=Math.random()*c.width*.4}if(e.x>c.width+10){e.x=-10;e.y=Math.random()*c.height}const a=e.o*(.6+.4*Math.sin(t*1.5+e.p));
    for(let j=1;j<=e.t;j++){const tx=e.x-j*1.5,ty=e.y-j*2;ctx.beginPath();ctx.arc(tx,ty,e.r*(1-j*.15),0,Math.PI*2);ctx.fillStyle=`rgba(200,40,45,${a*(1-j*.2)})`;ctx.fill()}
    ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);const g=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,e.r*3);g.addColorStop(0,`rgba(255,80,70,${a})`);g.addColorStop(.4,`rgba(220,50,50,${a*.7})`);g.addColorStop(1,"transparent");ctx.fillStyle=g;ctx.fill()});
    const bp=(Math.sin(t*.15)+1)/2;if(bp>.7){const ba=(bp-.7)/.3*.06;
    ctx.save();ctx.beginPath();ctx.moveTo(c.width*.15,-10);ctx.lineTo(c.width*.5,c.height*.7);ctx.lineTo(c.width*.55,c.height*.7);ctx.lineTo(c.width*.2,-10);ctx.closePath();const bg1=ctx.createLinearGradient(0,0,0,c.height*.7);bg1.addColorStop(0,`rgba(200,50,60,${ba})`);bg1.addColorStop(1,`rgba(140,20,30,${ba*.3})`);ctx.fillStyle=bg1;ctx.fill();ctx.restore();
    ctx.save();ctx.beginPath();ctx.moveTo(c.width*.6,-10);ctx.lineTo(c.width*.85,c.height*.6);ctx.lineTo(c.width*.9,c.height*.6);ctx.lineTo(c.width*.65,-10);ctx.closePath();const bg2=ctx.createLinearGradient(0,0,0,c.height*.6);bg2.addColorStop(0,`rgba(180,40,50,${ba*.7})`);bg2.addColorStop(1,`rgba(120,15,20,${ba*.2})`);ctx.fillStyle=bg2;ctx.fill();ctx.restore()}
    aRef.current=requestAnimationFrame(D)};D();return()=>{window.removeEventListener("resize",R);cancelAnimationFrame(aRef.current)}},[active,canvasRef]);
  useEffect(()=>{const c=init();return()=>c?.()},[init]);
}

// ==================== Wrapper ====================
export default function Background() {
  const { content } = useContent();
  const { theme, wallpaperEnabled, wallpaperPath, wallpaperOpacity, wallpaperBlur, particlesOnWallpaper } = content;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const showParticles = !wallpaperEnabled || particlesOnWallpaper;

  useCyberParticles(canvasRef, theme==="cyber" && showParticles);
  useSnowflakes(canvasRef, theme==="frostmoon" && showParticles);
  useGoldDust(canvasRef, theme==="hengyue" && showParticles);
  useEmbers(canvasRef, theme==="hongyue" && showParticles);

  // Use theme default wallpaper if none set
  const displayWallpaper = wallpaperPath || (theme !== "cyber" ? DEFAULT_WALLPAPERS[theme] || "" : "");

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0" style={{opacity:.03,backgroundImage:"linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",backgroundSize:"60px 60px"}} />

      {wallpaperEnabled && displayWallpaper && (
        <div className="absolute inset-0">
          <img src={asset(displayWallpaper)} alt="" className="h-full w-full" style={{objectFit:"cover",opacity:wallpaperOpacity,filter:wallpaperBlur>0?`blur(${wallpaperBlur}px)`:undefined}} />
        </div>
      )}

      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
