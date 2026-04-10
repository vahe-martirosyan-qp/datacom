"use client";

import { useMemo } from "react";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { entriesToMap, parseNavMegaMenu } from "@/lib/contentUtils";
import styles from "@/components/admin/AdminSubPage.module.scss";

const PREVIEW_LANG = "ru";

export default function AdminNavigationPage() {
  const contentQuery = useHomeContentQuery(PREVIEW_LANG);
  const map = useMemo(
    () =>
      contentQuery.data ? entriesToMap(contentQuery.data.entries) : {},
    [contentQuery.data]
  );
  const items = parseNavMegaMenu(map);

  return (
    <div className={styles.adminSubPage}>
      <h1 className={styles.adminSubPage__title}>Навигация</h1>
      <p className={styles.adminSubPage__lead}>
        Предпросмотр мега-меню для языка {PREVIEW_LANG.toUpperCase()}. Редактировать
        — «Меню и мега-меню» в разделе секций.
      </p>
      {contentQuery.isLoading ? (
        <p className={styles.adminSubPage__muted}>Загрузка…</p>
      ) : (
        <ul className={styles.adminSubPage__navTree}>
          {items.map((item) => (
            <li key={item.label + item.href} className={styles.adminSubPage__navTreeItem}>
              <span className={styles.adminSubPage__navTreeTop}>
                <strong>{item.label}</strong>
                <code className={styles.adminSubPage__navTreeCode}>{item.href}</code>
                {item.children?.length ? (
                  <span className={styles.adminSubPage__navTreeBadge}>
                    {item.children.length} подпункт.
                  </span>
                ) : null}
              </span>
              {item.children?.length ? (
                <ul className={styles.adminSubPage__navTreeSub}>
                  {item.children.map((ch) => (
                    <li key={ch.label + ch.href}>
                      <span className={styles.adminSubPage__navLabel}>{ch.label}</span>
                      <code className={styles.adminSubPage__navHref}>{ch.href}</code>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
