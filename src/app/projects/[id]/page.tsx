import ProjectDetailClient from "./ProjectDetailClient";
import { notFound } from "next/navigation";
import { loadSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await loadSiteContent();
  const legacyIndex = /^\d+$/.test(id) ? Number.parseInt(id, 10) : -1;
  const exists = content.projects.some((project, index) => project.slug === id || index === legacyIndex);
  if (!exists) notFound();
  return <ProjectDetailClient projectId={id} />;
}
