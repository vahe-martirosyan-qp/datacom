import { AdminSectionGrid } from "@/components/admin/AdminSectionGrid";
import { GLOBAL_ADMIN_SECTIONS } from "@/lib/adminSections";

export default function AdminGlobalPage() {
  return (
    <AdminSectionGrid
      pageTitle="Глобальные блоки"
      pageLead="Эти поля задают шапку, навигацию и подвал на всех страницах публичного сайта. Выберите язык — правки сохраняются отдельно для каждого языка."
      sections={GLOBAL_ADMIN_SECTIONS}
    />
  );
}
