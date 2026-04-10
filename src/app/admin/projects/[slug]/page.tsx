import { AdminProjectSlugClient } from "@/components/admin/AdminProjectSlugClient";

interface Props {
  params: { slug: string };
}

export default function AdminProjectSlugPage({ params }: Props) {
  return <AdminProjectSlugClient slug={params.slug} />;
}
