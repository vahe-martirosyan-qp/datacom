"use client";

import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AdminSectionDef } from "@/lib/adminSections";
import { entriesToMap } from "@/lib/contentUtils";
import { useBlogContentQuery } from "@/hooks/useBlogContentQuery";
import { useEquipmentContentQuery } from "@/hooks/useEquipmentContentQuery";
import { useCompanyContentQuery } from "@/hooks/useCompanyContentQuery";
import { useContactsContentQuery } from "@/hooks/useContactsContentQuery";
import { usePrivacyContentQuery } from "@/hooks/usePrivacyContentQuery";
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
  /** CMS bucket: homepage keys (`home.*`) or company page (`page.company.*`). */
  contentPage?:
    | "home"
    | "company"
    | "contacts"
    | "privacy"
    | "blog"
    | "equipment";
}

export function AdminSectionGrid({
  pageTitle,
  pageLead,
  sections,
  contentPage = "home",
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

  const homeQuery = useHomeContentQuery(editLang);
  const companyQuery = useCompanyContentQuery(editLang);
  const contactsQuery = useContactsContentQuery(editLang);
  const privacyQuery = usePrivacyContentQuery(editLang);
  const blogQuery = useBlogContentQuery(editLang);
  const equipmentQuery = useEquipmentContentQuery(editLang);
  const contentQuery =
    contentPage === "company"
      ? companyQuery
      : contentPage === "contacts"
        ? contactsQuery
        : contentPage === "privacy"
          ? privacyQuery
          : contentPage === "blog"
            ? blogQuery
            : contentPage === "equipment"
              ? equipmentQuery
              : homeQuery;

  const map = useMemo(() => {
    const base = contentQuery.data
      ? entriesToMap(contentQuery.data.entries)
      : {};
    if (contentPage === "equipment" && homeQuery.data) {
      const homeMap = entriesToMap(homeQuery.data.entries);
      if (homeMap["home.nav.megaMenu"] !== undefined) {
        return { ...base, "home.nav.megaMenu": homeMap["home.nav.megaMenu"] };
      }
    }
    return base;
  }, [contentQuery.data, contentPage, homeQuery.data]);

  const activeSection =
    sections.find((s) => s.id === activeSectionId) ?? null;

  if (contentQuery.isError || (contentPage === "equipment" && homeQuery.isError)) {
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

        {contentQuery.isLoading ||
        (contentPage === "equipment" && homeQuery.isLoading) ? (
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
        contentPage={contentPage}
        syncKeysAcrossLanguages={
          activeSection?.id === "clients"
            ? ["home.clients.brands"]
            : activeSection?.id === "media"
              ? ["page.company.heroImageUrl"]
              : undefined
        }
        syncLanguageCodes={languageOptions.map((l) => l.code)}
        onClose={() => setActiveSectionId(null)}
      />
    </>
  );
}
