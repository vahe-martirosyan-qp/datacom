import { AdminBlogListClient } from "@/components/admin/AdminBlogListClient";
import { AdminSectionGrid } from "@/components/admin/AdminSectionGrid";
import { BLOG_PAGE_ADMIN_SECTIONS } from "@/lib/adminSections";

export default function AdminBlogPage() {
  return (
    <>
      <AdminBlogListClient />
      <AdminSectionGrid
        pageTitle="Настройки страницы списка /blog"
        pageLead="SEO, заголовок H1 на /blog, карточки в сетке и кнопка «Показать ещё». Текст внутри каждой статьи редактируется выше — откройте статью и блок «Текст статьи»."
        sections={BLOG_PAGE_ADMIN_SECTIONS}
        contentPage="blog"
      />
    </>
  );
}
