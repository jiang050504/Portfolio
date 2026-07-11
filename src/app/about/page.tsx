"use client";

import SectionTitle from "@/components/ui/SectionTitle";
import BioCard from "@/components/about/BioCard";
import SkillsGrid from "@/components/about/SkillsGrid";
import { useContent } from "@/context/ContentContext";

export default function AboutPage() {
  const { content } = useContent();
  const { aboutTitle, aboutSubtitle } = content;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle title={aboutTitle} subtitle={aboutSubtitle} />
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <BioCard />
          </div>
          <div className="lg:col-span-2">
            <SkillsGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
