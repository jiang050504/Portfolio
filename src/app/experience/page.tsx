"use client";

import SectionTitle from "@/components/ui/SectionTitle";
import Timeline from "@/components/experience/Timeline";
import { useContent } from "@/context/ContentContext";

export default function ExperiencePage() {
  const { content } = useContent();
  const { experienceTitle, experienceSubtitle, experiences } = content;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <SectionTitle
          title={experienceTitle}
          subtitle={experienceSubtitle}
        />
        <Timeline items={experiences} />
      </div>
    </div>
  );
}
