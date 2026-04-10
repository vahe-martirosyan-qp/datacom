"use client";

import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AdminSectionDef } from "@/lib/adminSections";
import { entriesToMap } from "@/lib/contentUtils";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import { SectionEditorModal } from "./SectionEditorModal";
import styles from "./AdminOverview.module.scss";

const FALLBACK_LANGUAGES: { code: string; name: string }[] = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
];

interface AdminSectionGridProps {
  pageTitle: string;
  pageLead: string;
  sections: readonly AdminSectionDef[];
}

export function AdminSectionGrid({
  pageTitle,
  pageLead,
  sections,
}: AdminSectionGridProps) {
  const languagesQuery = useLanguagesQuery();
  const languageOptions = useMemo(() => {
    const fromApi = (languagesQuery.data ?? [])
      .filter((l) => l.active)
      .map((l) => ({ code: l.code, name: l.name }));
    return fromApi.length > 0 ? fromApi : FALLBACK_LANGUAGES;
  }, [languagesQuery.data]);

  const [editLang, setEditLang] = useState<string>("ru");
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    const codes = languageOptions.map((l) => l.code);
    if (codes.length > 0 && !codes.includes(editLang)) {
      setEditLang(codes[0] ?? "en");
    }
  }, [languageOptions, editLang]);

  const contentQuery = useHomeContentQuery(editLang);

  const map = useMemo(
    () =>
      contentQuery.data ? entriesToMap(contentQuery.data.entries) : {},
    [contentQuery.data]
  );

  const activeSection =
    sections.find((s) => s.id === activeSectionId) ?? null;

  if (contentQuery.isError) {
    return (
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>
          Не удалось загрузить контент. Обновите страницу.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.adminOverview}>
        <h1 className={styles.adminOverview__title}>{pageTitle}</h1>
        <div className={styles.adminOverview__toolbar}>
          <div className={styles.adminOverview__toolbarText}>
            <p className={styles.adminOverview__lead}>{pageLead}</p>
          </div>
          <label className={styles.adminOverview__lang}>
            <span className={styles.adminOverview__langLabel}>Язык контента</span>
            <select
              className={styles.adminOverview__langSelect}
              value={editLang}
              onChange={(e) => setEditLang(e.target.value)}
              disabled={languagesQuery.isLoading}
            >
              {languageOptions.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.code})
                </option>
              ))}
            </select>
          </label>
        </div>

        {contentQuery.isLoading ? (
          <div className={styles.adminOverview__skeleton}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="card" />
            ))}
          </div>
        ) : (
          <div className={styles.adminOverview__grid}>
            {sections.map((section) => (
              <article key={section.id} className={styles.adminOverview__card}>
                <h2 className={styles.adminOverview__cardTitle}>
                  {section.title}
                </h2>
                <p className={styles.adminOverview__cardDesc}>
                  {section.description}
                </p>
                <button
                  type="button"
                  className={styles.adminOverview__editBtn}
                  onClick={() => setActiveSectionId(section.id)}
                >
                  Редактировать
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      <SectionEditorModal
        open={Boolean(activeSection)}
        section={activeSection}
        lang={editLang}
        contentMap={map}
        onClose={() => setActiveSectionId(null)}
      />
    </>
  );
}
