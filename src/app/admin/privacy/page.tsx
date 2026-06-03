import { AdminSectionGrid } from "@/components/admin/AdminSectionGrid";
import { PRIVACY_PAGE_ADMIN_SECTIONS } from "@/lib/adminSections";

export default function AdminPrivacyPage() {
  return (
    <AdminSectionGrid
      pageTitle="Политика конфиденциальности"
      pageLead="Контент для `/[lang]/privacy-policy` (короткий `/privacy` перенаправляет сюда). В cookie: global.cookies.privacyHref = privacy-policy. Текст политики — TipTap."
      sections={PRIVACY_PAGE_ADMIN_SECTIONS}
      contentPage="privacy"
    />
  );
}
