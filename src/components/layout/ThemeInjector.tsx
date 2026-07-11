"use client";

import { useEffect } from "react";
import { useContent } from "@/context/ContentContext";

export default function ThemeInjector() {
  const { content } = useContent();

  useEffect(() => {
    document.documentElement.dataset.theme = content.theme || "cyber";
  }, [content.theme]);

  return null;
}
