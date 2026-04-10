"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import styles from "./AdminSubPage.module.scss";

interface UploadRow {
  id: string;
  url: string;
  originalName: string;
  sizeBytes: number;
  createdAtIso: string;
}

export function AdminUploadsRegistryClient() {
  const q = useQuery({
    queryKey: ["admin", "uploads"],
    queryFn: async () => {
      const { data } = await api.get<{ uploads: UploadRow[] }>("/admin/uploads");
      return data.uploads;
    },
  });

  if (q.isLoading) {
    return <p className={styles.adminSubPage__lead}>Загрузка списка…</p>;
  }
  if (q.isError) {
    return (
      <p className={styles.adminSubPage__lead}>
        Не удалось загрузить список (нужна авторизация).
      </p>
    );
  }

  const list = q.data ?? [];
  if (list.length === 0) {
    return (
      <p className={styles.adminSubPage__lead}>
        Пока нет загрузок в этой сессии. Загрузите изображение в карточке проекта
        или в поле «герой» кейса — файл сохранится в{" "}
        <code>public/uploads/projects/</code>, запись появится здесь (в памяти
        сервера до перезапуска).
      </p>
    );
  }

  return (
    <ul className={styles.adminSubPage__uploadList}>
      {list.map((u) => (
        <li key={u.id} className={styles.adminSubPage__uploadItem}>
          <a href={u.url} target="_blank" rel="noopener noreferrer">
            {u.originalName}
          </a>
          <span className={styles.adminSubPage__uploadMeta}>
            {(u.sizeBytes / 1024).toFixed(0)} КБ · {u.url}
          </span>
        </li>
      ))}
    </ul>
  );
}
