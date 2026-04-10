import { AdminSectionGrid } from "@/components/admin/AdminSectionGrid";
import { HOME_PAGE_ADMIN_SECTIONS } from "@/lib/adminSections";

export default function AdminHomeContentPage() {
  return (
    <AdminSectionGrid
      pageTitle="Главная страница"
      pageLead="Контент только для маршрута главной (`/[lang]`): баннер, секции, форма, проекты и т.д. Общие элементы — в разделе «Глобальные блоки»."
      sections={HOME_PAGE_ADMIN_SECTIONS}
    />
  );
}
