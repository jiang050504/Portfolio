"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type SiteContent,
  defaultContent,
} from "@/data/defaults";

const STORAGE_KEY = "portfolio-content";

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextType>({
  content: defaultContent,
  updateContent: () => {},
  resetContent: () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to handle new fields
        setContent({ ...defaultContent, ...parsed });
      }
    } catch {
      // If parse fails, use defaults
    }
    setMounted(true);
  }, []);

  const updateContent = useCallback((newContent: SiteContent) => {
    setContent(newContent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
    } catch {
      // localStorage might be full
    }
  }, []);

  const resetContent = useCallback(() => {
    setContent(defaultContent);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Don't render children until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
