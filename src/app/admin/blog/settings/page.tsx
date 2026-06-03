import { AdminSectionGrid } from "@/components/admin/AdminSectionGrid";
import { BLOG_PAGE_ADMIN_SECTIONS } from "@/lib/adminSections";

export default function AdminBlogSettingsPage() {
  return (
    <AdminSectionGrid
      pageTitle="Настройки страницы «Блог»"
      pageLead="SEO, заголовок списка и карточки на `/[lang]/blog`. Текст каждой статьи редактируется в разделе «Блог» → список статей."
      sections={BLOG_PAGE_ADMIN_SECTIONS}
      contentPage="blog"
    />
  );
}
