import ProjectDetailClient from "./ProjectDetailClient";

export function generateStaticParams() {
  return [
    { id: "0" }, { id: "1" }, { id: "2" }, { id: "3" },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetailClient id={parseInt(id, 10)} />;
}
