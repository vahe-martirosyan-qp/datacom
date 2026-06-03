import { AdminEquipmentProductSlugClient } from "@/components/admin/AdminEquipmentProductSlugClient";

interface Props {
  params: Promise<{ slug: string; productSlug: string }>;
}

export default async function AdminEquipmentProductPage({ params }: Props) {
  const { slug, productSlug } = await params;
  return (
    <AdminEquipmentProductSlugClient
      categorySlug={slug}
      productSlug={productSlug}
    />
  );
}
