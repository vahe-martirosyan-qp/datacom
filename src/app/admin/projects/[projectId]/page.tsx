import { AdminProjectSlugClient } from "@/components/admin/AdminProjectSlugClient";

interface Props {
  params: { projectId: string };
}

export default function AdminProjectPage({ params }: Props) {
  return <AdminProjectSlugClient projectId={params.projectId} />;
}
