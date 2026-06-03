import Link from "next/link";
import { AdminSectionGrid } from "@/components/admin/AdminSectionGrid";
import { INTEGRATIONS_PAGE_ADMIN_SECTIONS } from "@/lib/adminSections";
import styles from "@/components/admin/AdminOverview.module.scss";

export default function AdminIntegrationsSettingsPage() {
  return (
    <>
      <p className={styles.adminOverview__lead}>
        <Link href="/admin/integrations">← К списку услуг</Link>
      </p>
      <AdminSectionGrid
        pageTitle="Страница «Интеграции» (список)"
        pageLead="Контент для `/[lang]/integrations`: H1, подзаголовок и карточки услуг. Полный текст каждой услуги — в редакторе услуги из списка."
        sections={INTEGRATIONS_PAGE_ADMIN_SECTIONS}
        contentPage="integrations"
      />
    </>
  );
}
