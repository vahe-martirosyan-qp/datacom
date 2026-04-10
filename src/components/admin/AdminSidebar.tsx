"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLogoutMutation } from "@/hooks/useLogoutMutation";
import styles from "./AdminSidebar.module.scss";

const NAV: { href: string; label: string }[] = [
  { href: "/admin/dashboard", label: "Обзор" },
  { href: "/admin/global", label: "Глобальное" },
  { href: "/admin/home", label: "Главная страница" },
  { href: "/admin/projects", label: "Проекты" },
  { href: "/admin/navigation", label: "Меню (просмотр)" },
  { href: "/admin/languages", label: "Языки" },
  { href: "/admin/media", label: "Медиа" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogoutMutation();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.push("/admin/login");
      },
    });
  };

  return (
    <aside className={styles.adminSidebar}>
      <div className={styles.adminSidebar__brand}>Панель Datacom</div>
      <nav className={styles.adminSidebar__nav} aria-label="Админ-меню">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.adminSidebar__link}${
                active ? ` ${styles["adminSidebar__link--active"]}` : ""
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className={styles.adminSidebar__logout}>
        <button
          type="button"
          className={styles.adminSidebar__logoutBtn}
          onClick={handleLogout}
          disabled={logout.isPending}
        >
          Выход
        </button>
      </div>
    </aside>
  );
}
