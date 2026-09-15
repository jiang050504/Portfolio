"use client";

import SectionTitle from "@/components/ui/SectionTitle";
import PersonalWorkItem from "@/components/projects/PersonalWorkItem";
import { useContent } from "@/context/ContentContext";

export default function PersonalWorksPage() {
  const { content } = useContent();
  const { personalWorksTitle, personalWorksSubtitle, personalWorks } = content;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle title={personalWorksTitle} subtitle={personalWorksSubtitle} />
        {personalWorks.length > 0 ? (
          <div className="mx-auto max-w-3xl space-y-10">
            {personalWorks.map((work, index) => (
              <PersonalWorkItem
                key={`${work.slug || work.title}-${index}`}
                {...work}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.02] px-6 py-16 text-center text-[var(--text-muted)]">
            个人作品正在整理中
          </div>
        )}
      </div>
    </div>
  );
}
