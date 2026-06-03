import { AdminEquipmentProductSlugClient } from "@/components/admin/AdminEquipmentProductSlugClient";

interface Props {
  params: { slug: string; productSlug: string };
}

export default function AdminEquipmentProductPage({ params }: Props) {
  return (
    <AdminEquipmentProductSlugClient
      categorySlug={params.slug}
      productSlug={params.productSlug}
    />
  );
}
