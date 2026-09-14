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
const PREFERENCES_KEY = "portfolio-display-preferences";

function mergeProject(defaultProject: Project, savedProject?: Partial<Project>): Project {
  if (!savedProject) return defaultProject;

  // Older browser data predates the dedicated cover/design fields. Keep the
  // user's existing content, while filling the fields introduced afterwards.
  const usesLegacyMediaLayout =
    !Object.prototype.hasOwnProperty.call(savedProject, "coverImage") &&
    !Object.prototype.hasOwnProperty.call(savedProject, "designImages");

  const hasNoSavedDesignImages =
    !Array.isArray(savedProject.designImages) || savedProject.designImages.length === 0;

  const mergedProject: Project = {
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

  const savedSlug = mergedProject.slug || "";
  const slug = (!savedSlug || /^project-\d+$/.test(savedSlug)) && defaultProject.slug
    ? defaultProject.slug
    : savedSlug || defaultProject.slug || "";
  const moveMediaToSlug = (path: string | undefined) => {
    if (!path || !slug || !path.startsWith("/projects/")) return path || "";
    const filename = path.split("/").pop();
    return filename ? `/projects/${slug}/${filename}` : "";
  };

  const normalizedProject: Project = {
    ...mergedProject,
    mediaFolder: slug || mergedProject.mediaFolder,
    coverImage: moveMediaToSlug(mergedProject.coverImage),
    images: (mergedProject.images || []).map(moveMediaToSlug).filter(Boolean),
    videos: (mergedProject.videos || []).map(moveMediaToSlug).filter(Boolean),
    designImages: (mergedProject.designImages || []).map(moveMediaToSlug).filter(Boolean),
  };

  // Repair the two projects whose media were previously split or associated
  // with the wrong backend project. The source defaults are the canonical list.
  if (slug === "kaiju-tianzai") {
    normalizedProject.designImages = defaultProject.designImages;
  }
  if (slug === "jiubuaiwodema") {
    normalizedProject.images = defaultProject.images;
    normalizedProject.videos = defaultProject.videos;
    normalizedProject.designImages = defaultProject.designImages;
  }

  return normalizedProject;
}

function mergeSavedContent(saved: Partial<SiteContent>): SiteContent {
  const safeSaved = { ...saved } as Partial<SiteContent> & { adminPassword?: string };
  delete safeSaved.adminPassword;
  const savedProjects = Array.isArray(saved.projects) ? saved.projects : [];
  const savedPersonalWorks = Array.isArray(saved.personalWorks) ? saved.personalWorks : [];
  const seenProjectSlugs = new Set<string>();

  const mergedProjects = savedProjects.flatMap((savedProject) => {
    const matchingDefault = defaultContent.projects.find((project) =>
      (savedProject.slug && project.slug === savedProject.slug) ||
      project.title === savedProject.title
    );

    const mergedProject = matchingDefault
      ? mergeProject(matchingDefault, savedProject)
      : savedProject as Project;
    const projectSlug = mergedProject.slug || "";

    if (projectSlug && seenProjectSlugs.has(projectSlug)) return [];
    if (projectSlug) seenProjectSlugs.add(projectSlug);
    return [mergedProject];
  });

  const savedTheme = (saved as { theme?: string }).theme;
  const theme = savedTheme === "cyber" ? "frostmoon" : savedTheme;

  return {
    ...defaultContent,
    ...safeSaved,
    theme: theme === "frostmoon" || theme === "hengyue" || theme === "hongyue"
      ? theme
      : defaultContent.theme,
    projects: savedProjects.length
      ? mergedProjects
      : defaultContent.projects,
    personalWorksTitle: saved.personalWorksTitle || defaultContent.personalWorksTitle,
    personalWorksSubtitle: saved.personalWorksSubtitle || defaultContent.personalWorksSubtitle,
    personalWorks: savedPersonalWorks.map((work) => mergeProject(work, work)),
  };
}

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => void;
  saveContent: (newContent: SiteContent) => Promise<boolean>;
  resetContent: () => SiteContent;
  setDefaultContent: (newContent: SiteContent) => Promise<boolean>;
}

const ContentContext = createContext<ContentContextType>({
  content: defaultContent,
  updateContent: () => {},
  saveContent: async () => false,
  resetContent: () => defaultContent,
  setDefaultContent: async () => false,
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      let nextContent = defaultContent;
      try {
        const response = await fetch("/api/content", { cache: "no-store" });
        if (response.ok) {
          nextContent = mergeSavedContent(await response.json() as Partial<SiteContent>);
        } else {
          throw new Error("Content API unavailable");
        }
      } catch {
        try {
          const fallback = localStorage.getItem(STORAGE_KEY);
          if (fallback) nextContent = mergeSavedContent(JSON.parse(fallback) as Partial<SiteContent>);
        } catch {
          nextContent = defaultContent;
        }
      }

      try {
        const preferences = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "{}") as Partial<SiteContent>;
        nextContent = {
          ...nextContent,
          ...(preferences.theme ? { theme: preferences.theme } : {}),
          ...(typeof preferences.wallpaperEnabled === "boolean"
            ? { wallpaperEnabled: preferences.wallpaperEnabled }
            : {}),
          ...(typeof preferences.particlesOnWallpaper === "boolean"
            ? { particlesOnWallpaper: preferences.particlesOnWallpaper }
            : {}),
        };
      } catch {
        // Invalid display preferences are ignored.
      }

      if (!cancelled) {
        setContent(nextContent);
        setMounted(true);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextContent));
          if (!localStorage.getItem(DEFAULT_SNAPSHOT_KEY)) {
            localStorage.setItem(DEFAULT_SNAPSHOT_KEY, JSON.stringify(nextContent));
          }
        } catch {
          // Storage is an optional offline fallback.
        }
      }
    };

    void hydrate();
    return () => { cancelled = true; };
  }, []);

  const updateContent = useCallback((newContent: SiteContent) => {
    setContent(newContent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify({
        theme: newContent.theme,
        wallpaperEnabled: newContent.wallpaperEnabled,
        particlesOnWallpaper: newContent.particlesOnWallpaper,
      }));
    } catch {
      // localStorage might be full
    }
  }, []);

  const saveContent = useCallback(async (newContent: SiteContent) => {
    const normalizedContent = mergeSavedContent(newContent);
    let response: Response;
    try {
      response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedContent),
      });
    } catch {
      return false;
    }

    if (!response.ok) return false;

    setContent(normalizedContent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedContent));
      localStorage.setItem(DEFAULT_SNAPSHOT_KEY, JSON.stringify(normalizedContent));
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify({
        theme: normalizedContent.theme,
        wallpaperEnabled: normalizedContent.wallpaperEnabled,
        particlesOnWallpaper: normalizedContent.particlesOnWallpaper,
      }));
    } catch {
      // The server save succeeded; browser storage is only a local fallback.
    }
    return true;
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

  const setDefaultContent = useCallback(async (newContent: SiteContent) => {
    const normalizedContent = mergeSavedContent(newContent);
    const saved = await saveContent(normalizedContent);
    if (!saved) return false;

    // Local development can additionally update the checked-in fallback
    // snapshot. Production uses Blob as the durable default source.
    try {
      await fetch("/api/content-default", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedContent),
      });
    } catch {
      // The durable Blob save above already succeeded.
    }
    return true;
  }, [saveContent]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ContentContext.Provider value={{ content, updateContent, saveContent, resetContent, setDefaultContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
