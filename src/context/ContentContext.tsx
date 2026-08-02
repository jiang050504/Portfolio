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
  type Project,
  type SiteContent,
  defaultContent,
} from "@/data/defaults";

const STORAGE_KEY = "portfolio-content";
const DEFAULT_SNAPSHOT_KEY = "portfolio-default-content";
const CONTENT_VERSION_KEY = "portfolio-content-version";
const CONTENT_VERSION = "2026-08-02-complete-media-v1";

function mergeProject(defaultProject: Project, savedProject?: Partial<Project>): Project {
  if (!savedProject) return defaultProject;

  // Older browser data predates the dedicated cover/design fields. Keep the
  // user's existing content, while filling the fields introduced afterwards.
  const usesLegacyMediaLayout =
    !Object.prototype.hasOwnProperty.call(savedProject, "coverImage") &&
    !Object.prototype.hasOwnProperty.call(savedProject, "designImages");

  const hasNoSavedDesignImages =
    !Array.isArray(savedProject.designImages) || savedProject.designImages.length === 0;

  return {
    ...defaultProject,
    ...savedProject,
    ...(usesLegacyMediaLayout
      ? {
          coverImage: defaultProject.coverImage,
          designImages: defaultProject.designImages,
        }
      : hasNoSavedDesignImages && defaultProject.designImages?.length
        ? { designImages: defaultProject.designImages }
        : {}),
  };
}

function mergeSavedContent(saved: Partial<SiteContent>): SiteContent {
  const savedProjects = Array.isArray(saved.projects) ? saved.projects : [];

  return {
    ...defaultContent,
    ...saved,
    projects: [
      ...defaultContent.projects.map((project, index) =>
        mergeProject(project, savedProjects[index])
      ),
      ...savedProjects.slice(defaultContent.projects.length),
    ],
  };
}

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => void;
  resetContent: () => SiteContent;
  setDefaultContent: (newContent: SiteContent) => void;
}

const ContentContext = createContext<ContentContextType>({
  content: defaultContent,
  updateContent: () => {},
  resetContent: () => defaultContent,
  setDefaultContent: () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // A deployed content update must take precedence over stale browser data.
      // Once migrated, later admin edits continue to persist normally.
      const savedVersion = localStorage.getItem(CONTENT_VERSION_KEY);
      if (savedVersion !== CONTENT_VERSION) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultContent));
        localStorage.setItem(DEFAULT_SNAPSHOT_KEY, JSON.stringify(defaultContent));
        localStorage.setItem(CONTENT_VERSION_KEY, CONTENT_VERSION);
        setContent(defaultContent);
        setMounted(true);
        return;
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<SiteContent>;
        const currentContent = mergeSavedContent(parsed);
        setContent(currentContent);

        // The first run after this feature is introduced preserves the user's
        // entire existing local site as their restore-default baseline.
        if (!localStorage.getItem(DEFAULT_SNAPSHOT_KEY)) {
          localStorage.setItem(DEFAULT_SNAPSHOT_KEY, JSON.stringify(currentContent));
        }
      } else {
        const savedDefault = localStorage.getItem(DEFAULT_SNAPSHOT_KEY);
        if (savedDefault) {
          setContent(mergeSavedContent(JSON.parse(savedDefault) as Partial<SiteContent>));
        }
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
    try {
      const savedDefault = localStorage.getItem(DEFAULT_SNAPSHOT_KEY);
      const restoredContent = savedDefault
        ? mergeSavedContent(JSON.parse(savedDefault) as Partial<SiteContent>)
        : defaultContent;

      setContent(restoredContent);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restoredContent));
      return restoredContent;
    } catch {
      setContent(defaultContent);
      return defaultContent;
    }
  }, []);

  const setDefaultContent = useCallback((newContent: SiteContent) => {
    try {
      localStorage.setItem(DEFAULT_SNAPSHOT_KEY, JSON.stringify(newContent));
    } catch {
      // localStorage might be full
    }
  }, []);

  // Don't render children until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent, setDefaultContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
