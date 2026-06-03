"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { buildBlogArticleAdminSections } from "@/lib/adminBlogSection";
import { resolveBlogKeySegment } from "@/lib/blogHrefUtils";
import { entriesToMap } from "@/lib/contentUtils";
import { queryKeys } from "@/lib/queryKeys";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import { fetchBlogPostContent } from "@/hooks/useBlogPostContentQuery";
import { SectionEditorModal } from "./SectionEditorModal";
import type { HomeContentResponse } from "@/types";
import styles from "./AdminOverview.module.scss";

const FALLBACK_LANGUAGES: { code: string; name: string }[] = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
];

interface AdminBlogSlugClientProps {
  slug: string;
}

function blogHeroImageKey(segment: string): string {
  return `blog.${segment}.heroImage`;
}

function resolveSharedHeroImage(
  segment: string,
  queries: { data?: HomeContentResponse }[],
  langCodes: string[],
  preferLang: string
): string {
  const key = blogHeroImageKey(segment);
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

export function AdminBlogSlugClient({ slug: rawSlug }: AdminBlogSlugClientProps) {
  const segment = useMemo(
    () => resolveBlogKeySegment(rawSlug) ?? "",
    [rawSlug]
  );
  const router = useRouter();
  const queryClient = useQueryClient();
  const languagesQuery = useLanguagesQuery();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const removePost = useMutation({
    mutationFn: async () => {
      await api.delete(`/admin/blog-posts/${encodeURIComponent(segment)}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content", "blog"] });
      await queryClient.invalidateQueries({ queryKey: ["content", "home"] });
      await queryClient.invalidateQueries({ queryKey: ["content", "blogPost"] });
      router.push("/admin/blog");
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

  const postQueries = useQueries({
    queries: langCodes.map((code) => ({
      queryKey: queryKeys.contentBlogPost(code, segment),
      queryFn: () => fetchBlogPostContent(code, segment),
      enabled: Boolean(segment) && langCodes.length > 0,
    })),
  });

  const editIdx = langCodes.indexOf(editLang);
  const primaryQuery =
    editIdx >= 0 ? postQueries[editIdx] : postQueries[0];

  const queriesTick = useMemo(
    () =>
      postQueries.map((q) => `${q.fetchStatus}:${q.dataUpdatedAt}`).join("|"),
    [postQueries]
  );

  const map = useMemo(() => {
    if (!primaryQuery?.data) {
      return {};
    }
    const base = entriesToMap(primaryQuery.data.entries);
    const heroKey = blogHeroImageKey(segment);
    const shared = resolveSharedHeroImage(
      segment,
      postQueries,
      langCodes,
      editLang
    );
    if (shared) {
      base[heroKey] = shared;
    }
    return base;
  }, [
    primaryQuery?.data,
    segment,
    langCodes,
    postQueries,
    queriesTick,
    editLang,
  ]);

  const sections = useMemo(
    () => buildBlogArticleAdminSections(segment),
    [segment]
  );

  const activeSection =
    sections.find((s) => s.id === activeSectionId) ?? null;

  const articleTitle = map[`blog.${segment}.title`]?.trim() || segment;

  if (!segment) {
    return (
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>
          Некорректный slug в адресе. Вернитесь к списку статей.
        </p>
        <Link href="/admin/blog" className={styles.adminOverview__editBtn}>
          К списку статей
        </Link>
      </div>
    );
  }

  if (primaryQuery?.isError) {
    return (
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>
          Не удалось загрузить статью. Проверьте slug или обновите страницу.
        </p>
        <Link href="/admin/blog" className={styles.adminOverview__editBtn}>
          К списку статей
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>
          <Link href="/admin/blog">← Все статьи</Link>
        </p>
        <h1 className={styles.adminOverview__title}>{articleTitle}</h1>
        <div className={styles.adminOverview__toolbar}>
          <p className={styles.adminOverview__lead}>
            Страница на сайте: <code>/ru/blog/{segment}</code> (и другие языки).
            Выберите блок ниже — для основного текста откройте{" "}
            <strong>«Текст статьи»</strong> (TipTap). Карточка в списке /blog
            (картинка + заголовок в сетке) — в{" "}
            <Link href="/admin/blog/settings">настройках списка</Link>.
          </p>
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
            Удаление сотрёт контент статьи для всех языков и уберёт карточки из
            списка блога и тизера на главной.
          </p>
          <button
            type="button"
            className={styles.adminProjectDanger__btn}
            disabled={removePost.isPending}
            onClick={() => {
              if (
                window.confirm(
                  `Удалить статью «${articleTitle}» полностью для всех языков?`
                )
              ) {
                removePost.mutate();
              }
            }}
          >
            {removePost.isPending ? "Удаление…" : "Удалить полностью"}
          </button>
        </div>
      </div>

      <SectionEditorModal
        open={Boolean(activeSection)}
        section={activeSection}
        lang={editLang}
        contentMap={map}
        syncLanguageCodes={langCodes}
        syncKeysAcrossLanguages={[blogHeroImageKey(segment)]}
        contentPage="home"
        onClose={() => setActiveSectionId(null)}
      />
    </>
  );
}
