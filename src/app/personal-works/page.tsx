"use client";

import SectionTitle from "@/components/ui/SectionTitle";
import ProjectCard from "@/components/projects/ProjectCard";
import { useContent } from "@/context/ContentContext";

export default function PersonalWorksPage() {
  const { content } = useContent();
  const { personalWorksTitle, personalWorksSubtitle, personalWorks } = content;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle title={personalWorksTitle} subtitle={personalWorksSubtitle} />
        {personalWorks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {personalWorks.map((work, index) => (
              <ProjectCard
                key={`${work.slug || work.title}-${index}`}
                {...work}
                index={index}
                basePath="/personal-works"
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.02] px-6 py-16 text-center text-[var(--text-muted)]">
            个人作品正在整理中
          </div>
        )}
      </div>
    </div>
  );
}
