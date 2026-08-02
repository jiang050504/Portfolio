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
  const savedProjects = Array.isArray(saved.projects) ? saved.projects : [];
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

  return {
    ...defaultContent,
    ...saved,
    projects: savedProjects.length
      ? mergedProjects
      : defaultContent.projects,
  };
}

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => void;
  resetContent: () => SiteContent;
  setDefaultContent: (newContent: SiteContent) => Promise<boolean>;
}

const ContentContext = createContext<ContentContextType>({
  content: defaultContent,
  updateContent: () => {},
  resetContent: () => defaultContent,
  setDefaultContent: async () => false,
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
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

  const setDefaultContent = useCallback(async (newContent: SiteContent) => {
    const normalizedContent = mergeSavedContent(newContent);
    try {
      localStorage.setItem(DEFAULT_SNAPSHOT_KEY, JSON.stringify(normalizedContent));
    } catch {
      // localStorage might be full
    }

    try {
      const response = await fetch("/api/content-default", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedContent),
      });
      return response.ok;
    } catch {
      return false;
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
