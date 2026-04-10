import { AdminUploadsRegistryClient } from "@/components/admin/AdminUploadsRegistryClient";
import styles from "@/components/admin/AdminSubPage.module.scss";

export default function AdminMediaPage() {
  return (
    <div className={styles.adminSubPage}>
      <h1 className={styles.adminSubPage__title}>Медиафайлы</h1>
      <p className={styles.adminSubPage__lead}>
        Изображения проектов загружаются кнопкой «Загрузить» в разделе{" "}
        <strong>Проекты</strong> (карточки на главной и поле «герой» кейса).
        Файлы пишутся в <code>public/uploads/projects/</code>; публичный URL
        сохраняется в контенте. Ниже — журнал загрузок текущей сессии сервера
        (до перезапуска dev/prod процесса).
      </p>
      <AdminUploadsRegistryClient />
    </div>
  );
}
