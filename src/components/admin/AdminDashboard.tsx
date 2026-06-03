"use client";

import Link from "next/link";
import styles from "./AdminDashboard.module.scss";

const LINKS: { href: string; title: string; desc: string }[] = [
  {
    href: "/admin/global",
    title: "Глобальные блоки",
    desc: "Шапка, меню и мега-меню, подвал — общие для всех страниц.",
  },
  {
    href: "/admin/home",
    title: "Главная страница",
    desc: "SEO, баннер, цифры, блоки контента, форма, проекты, клиенты, блог.",
  },
  {
    href: "/admin/company",
    title: "Компания",
    desc: "Страница `/[lang]/company`.",
  },
  {
    href: "/admin/contacts",
    title: "Контакты",
    desc: "Страница `/[lang]/contacts`.",
  },
  {
    href: "/admin/equipment",
    title: "Оборудование и системы",
    desc:
      "Пункты меню «Equipment & systems»: категории, карточки на странице категории и отдельные страницы товаров с галереей.",
  },
  {
    href: "/admin/integrations",
    title: "Интеграции",
    desc: "Страница `/[lang]/integrations` — услуги интегратора (карточки со ссылками).",
  },
  {
    href: "/admin/privacy",
    title: "Политика конфиденциальности",
    desc: "Страница `/[lang]/privacy-policy` — текст политики в TipTap.",
  },
  {
    href: "/admin/navigation",
    title: "Предпросмотр меню",
    desc: "Дерево пунктов мега-меню (только просмотр; правки — в «Глобальные»).",
  },
  {
    href: "/admin/languages",
    title: "Языки",
    desc: "Список языков сайта.",
  },
  {
    href: "/admin/media",
    title: "Медиафайлы",
    desc: "Медиа-библиотека (заглушка).",
  },
];

export function AdminDashboard() {
  return (
    <div className={styles.adminDashboard}>
      <h1 className={styles.adminDashboard__title}>Панель управления</h1>
      <p className={styles.adminDashboard__lead}>
        Разделите правки: общие элементы интерфейса — в «Глобальные блоки»,
        контент только главной — в «Главная страница». Другие страницы сайта
        появятся здесь отдельными пунктами по мере добавления маршрутов.
      </p>
      <ul className={styles.adminDashboard__grid}>
        {LINKS.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={styles.adminDashboard__card}>
              <span className={styles.adminDashboard__cardTitle}>
                {item.title}
              </span>
              <span className={styles.adminDashboard__cardDesc}>
                {item.desc}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
