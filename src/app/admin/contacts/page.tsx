import { AdminSectionGrid } from "@/components/admin/AdminSectionGrid";
import { CONTACTS_PAGE_ADMIN_SECTIONS } from "@/lib/adminSections";

export default function AdminContactsPage() {
  return (
    <AdminSectionGrid
      pageTitle="Страница «Контакты»"
      pageLead="Контент для `/[lang]/contacts`. Поля формы (имя, телефон, чекбоксы) редактируются в «Главная → Форма заявки» (home.lead.*)."
      sections={CONTACTS_PAGE_ADMIN_SECTIONS}
      contentPage="contacts"
    />
  );
}
