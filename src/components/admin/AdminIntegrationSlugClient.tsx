"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/Skeleton";
import { buildIntegrationCategoryAdminSections } from "@/lib/adminIntegrationSection";
import { resolveIntegrationCategorySlug } from "@/lib/integrationsHrefUtils";
import { entriesToMap } from "@/lib/contentUtils";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import { fetchIntegrationCategoryContent } from "@/hooks/useIntegrationCategoryContentQuery";
import { fetchHomeContent } from "@/hooks/useHomeContentQuery";
import { SectionEditorModal } from "./SectionEditorModal";
import type { HomeContentResponse } from "@/types";
import styles from "./AdminOverview.module.scss";

const FALLBACK_LANGUAGES: { code: string; name: string }[] = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
];

interface AdminIntegrationSlugClientProps {
  slug: string;
}

function integrationHeroImageKey(segment: string): string {
  return `integration.${segment}.heroImage`;
}

function resolveSharedHeroImage(
  segment: string,
  queries: { data?: HomeContentResponse }[],
  langCodes: string[],
  preferLang: string
): string {
  const key = integrationHeroImageKey(segment);
  const order: string[] = [];
  if (preferLang && langCodes.includes(preferLang)) {
    order.push(preferLang);
  }
  if (!order.includes("en") && langCodes.includes("en")) {
    order.push("en");
  }
  for (const c of langCodes) {
    if (!order.includes(c)) {
      order.push(c);
    }
  }
  for (const code of order) {
    const idx = langCodes.indexOf(code);
    if (idx < 0) {
      continue;
    }
    const raw = queries[idx]?.data;
    if (!raw) {
      continue;
    }
    const v = entriesToMap(raw.entries)[key]?.trim();
    if (v) {
      return v;
    }
  }
  return "";
}

export function AdminIntegrationSlugClient({
  slug: rawSlug,
}: AdminIntegrationSlugClientProps) {
  const segment = useMemo(
    () => resolveIntegrationCategorySlug(rawSlug) ?? "",
    [rawSlug]
  );
  const router = useRouter();
  const queryClient = useQueryClient();
  const languagesQuery = useLanguagesQuery();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const removeCategory = useMutation({
    mutationFn: async () => {
      await api.delete(
        `/admin/integration-categories/${encodeURIComponent(segment)}`
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["content", "integrations"],
      });
      await queryClient.invalidateQueries({ queryKey: ["content", "home"] });
      await queryClient.invalidateQueries({
        queryKey: ["content", "integrationCategory"],
      });
      router.push("/admin/integrations");
    },
  });

  const languageOptions = useMemo(() => {
    const fromApi = (languagesQuery.data ?? [])
      .filter((l) => l.active)
      .map((l) => ({ code: l.code, name: l.name }));
    return fromApi.length > 0 ? fromApi : FALLBACK_LANGUAGES;
  }, [languagesQuery.data]);

  const [editLang, setEditLang] = useState<string>("ru");

  useEffect(() => {
    const codes = languageOptions.map((l) => l.code);
    if (codes.length > 0 && !codes.includes(editLang)) {
      setEditLang(codes[0] ?? "en");
    }
  }, [languageOptions, editLang]);

  const langCodes = useMemo(
    () => languageOptions.map((l) => l.code),
    [languageOptions]
  );

  const categoryQueries = useQueries({
    queries: langCodes.map((code) => ({
      queryKey: queryKeys.contentIntegrationCategory(code, segment),
      queryFn: () => fetchIntegrationCategoryContent(code, segment),
      enabled: Boolean(segment) && langCodes.length > 0,
    })),
  });

  const homeQueries = useQueries({
    queries: langCodes.map((code) => ({
      queryKey: queryKeys.content("home", code),
      queryFn: () => fetchHomeContent(code),
      enabled: Boolean(segment) && langCodes.length > 0,
    })),
  });

  const editIdx = langCodes.indexOf(editLang);
  const primaryQuery =
    editIdx >= 0 ? categoryQueries[editIdx] : categoryQueries[0];
  const homeQuery = editIdx >= 0 ? homeQueries[editIdx] : homeQueries[0];

  const queriesTick = useMemo(
    () =>
      categoryQueries
        .map((q) => `${q.fetchStatus}:${q.dataUpdatedAt}`)
        .join("|"),
    [categoryQueries]
  );

  const map = useMemo(() => {
    if (!primaryQuery?.data) {
      return {};
    }
    const base = entriesToMap(primaryQuery.data.entries);
    const heroKey = integrationHeroImageKey(segment);
    const shared = resolveSharedHeroImage(
      segment,
      categoryQueries,
      langCodes,
      editLang
    );
    if (shared) {
      base[heroKey] = shared;
    }
    if (homeQuery?.data) {
      const homeMap = entriesToMap(homeQuery.data.entries);
      if (homeMap["home.nav.megaMenu"] !== undefined) {
        base["home.nav.megaMenu"] = homeMap["home.nav.megaMenu"];
      }
    }
    return base;
  }, [
    primaryQuery?.data,
    segment,
    langCodes,
    categoryQueries,
    queriesTick,
    editLang,
    homeQuery?.data,
  ]);

  const sections = useMemo(
    () => buildIntegrationCategoryAdminSections(segment),
    [segment]
  );

  const activeSection =
    sections.find((s) => s.id === activeSectionId) ?? null;

  const categoryTitle =
    map[`integration.${segment}.title`]?.trim() || segment;

  if (!segment) {
    return (
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>Некорректный адрес услуги.</p>
        <Link href="/admin/integrations" className={styles.adminOverview__editBtn}>
          ← К списку
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={styles.adminOverview}>
        <div className={styles.adminOverview__toolbar}>
          <div className={styles.adminOverview__toolbarText}>
            <h1 className={styles.adminOverview__title}>{categoryTitle}</h1>
            <p className={styles.adminOverview__lead}>
              Редактор страницы <code>/[lang]/integrations/{segment}</code>.
              Публичная ссылка:{" "}
              <a
                href={`/ru/integrations/${encodeURIComponent(segment)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                открыть на сайте
              </a>
            </p>
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

        <p className={styles.adminOverview__lead}>
          <Link href="/admin/integrations">← Все услуги</Link>
          {" · "}
          <Link href="/admin/integrations/settings">Настройки /integrations</Link>
        </p>

        {primaryQuery?.isPending && !primaryQuery.data ? (
          <div className={styles.adminOverview__skeleton}>
            {[0, 1, 2, 3].map((i) => (
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

        <div className={styles.adminProjectDanger}>
          <h2 className={styles.adminProjectDanger__title}>Опасная зона</h2>
          <p className={styles.adminProjectDanger__text}>
            Удаление сотрёт контент услуги для всех языков, пункт в меню и
            карточку на /integrations.
          </p>
          <button
            type="button"
            className={styles.adminProjectDanger__btn}
            disabled={removeCategory.isPending}
            onClick={() => {
              if (
                window.confirm(
                  `Удалить услугу «${categoryTitle}» полностью для всех языков?`
                )
              ) {
                removeCategory.mutate();
              }
            }}
          >
            {removeCategory.isPending ? "Удаление…" : "Удалить полностью"}
          </button>
        </div>
      </div>

      <SectionEditorModal
        open={Boolean(activeSection)}
        section={activeSection}
        lang={editLang}
        contentMap={map}
        syncLanguageCodes={langCodes}
        syncKeysAcrossLanguages={[integrationHeroImageKey(segment)]}
        integrationCategorySlug={segment}
        contentPage="integrationCategory"
        onClose={() => setActiveSectionId(null)}
      />
    </>
  );
}
