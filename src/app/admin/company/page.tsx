import { AdminSectionGrid } from "@/components/admin/AdminSectionGrid";
import { COMPANY_PAGE_ADMIN_SECTIONS } from "@/lib/adminSections";

export default function AdminCompanyPage() {
  return (
    <AdminSectionGrid
      pageTitle="Страница «Компания»"
      pageLead="Контент для `/[lang]/company`. Выберите язык — правки сохраняются отдельно для каждой локали. Полоса контактов и форма внизу страницы берутся из блоков главной (contactStrip, lead)."
      sections={COMPANY_PAGE_ADMIN_SECTIONS}
      contentPage="company"
    />
  );
}
