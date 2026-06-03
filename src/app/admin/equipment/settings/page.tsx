import Link from "next/link";
import { AdminSectionGrid } from "@/components/admin/AdminSectionGrid";
import { EQUIPMENT_PAGE_ADMIN_SECTIONS } from "@/lib/adminSections";
import styles from "@/components/admin/AdminOverview.module.scss";

export default function AdminEquipmentSettingsPage() {
  return (
    <>
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>
          <Link href="/admin/equipment">← К списку категорий</Link>
        </p>
      </div>
      <AdminSectionGrid
        pageTitle="Настройки страницы списка /equipment"
        pageLead="SEO и заголовок H1 на `/[lang]/equipment`. Категории и страницы категорий — в разделе «Оборудование»."
        sections={EQUIPMENT_PAGE_ADMIN_SECTIONS}
        contentPage="equipment"
      />
    </>
  );
}
