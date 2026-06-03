import { AdminBlogSlugClient } from "@/components/admin/AdminBlogSlugClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AdminBlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <AdminBlogSlugClient slug={slug} />;
}
