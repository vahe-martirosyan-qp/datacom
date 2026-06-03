import { AdminEquipmentSlugClient } from "@/components/admin/AdminEquipmentSlugClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AdminEquipmentCategoryPage({ params }: Props) {
  const { slug } = await params;
  return <AdminEquipmentSlugClient slug={slug} />;
}
