import { AdminIntegrationSlugClient } from "@/components/admin/AdminIntegrationSlugClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AdminIntegrationCategoryPage({ params }: Props) {
  const { slug } = await params;
  return <AdminIntegrationSlugClient slug={slug} />;
}
