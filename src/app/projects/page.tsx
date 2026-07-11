"use client";

import SectionTitle from "@/components/ui/SectionTitle";
import ProjectCard from "@/components/projects/ProjectCard";
import { useContent } from "@/context/ContentContext";

export default function ProjectsPage() {
  const { content } = useContent();
  const { projectsTitle, projectsSubtitle, projects } = content;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle title={projectsTitle} subtitle={projectsSubtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
