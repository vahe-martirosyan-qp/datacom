import { AdminEquipmentSlugClient } from "@/components/admin/AdminEquipmentSlugClient";

interface Props {
  params: { slug: string };
}

export default function AdminEquipmentCategoryPage({ params }: Props) {
  return <AdminEquipmentSlugClient slug={params.slug} />;
}
