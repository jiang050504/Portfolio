"use client";

import { useEffect } from "react";
import { useContent } from "@/context/ContentContext";

export default function ThemeInjector() {
  const { content } = useContent();

  useEffect(() => {
    const savedTheme = content.theme as string;
    document.documentElement.dataset.theme = savedTheme === "cyber" ? "frostmoon" : savedTheme || "frostmoon";
  }, [content.theme]);

  return null;
}
