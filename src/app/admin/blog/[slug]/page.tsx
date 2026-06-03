import { AdminBlogSlugClient } from "@/components/admin/AdminBlogSlugClient";

interface Props {
  params: { slug: string };
}

export default function AdminBlogPostPage({ params }: Props) {
  return <AdminBlogSlugClient slug={params.slug} />;
}
