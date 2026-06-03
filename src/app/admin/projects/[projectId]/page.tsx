import { AdminProjectSlugClient } from "@/components/admin/AdminProjectSlugClient";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function AdminProjectPage({ params }: Props) {
  const { projectId } = await params;
  return <AdminProjectSlugClient projectId={projectId} />;
}
