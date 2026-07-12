import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Background from "@/components/layout/Background";
import WallpaperToggle from "@/components/layout/WallpaperToggle";
import ThemeInjector from "@/components/layout/ThemeInjector";
import MouseGlow from "@/components/layout/MouseGlow";
import { ContentProvider } from "@/context/ContentContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "个人作品集",
  description: "个人作品集网站 - 展示项目、技能与经历",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-deep)] text-[var(--text-primary)] transition-colors duration-700">
        <ContentProvider>
          <ThemeInjector />
          <MouseGlow />
          <Background />
          <Navbar />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
          <WallpaperToggle />
        </ContentProvider>
      </body>
    </html>
  );
}
