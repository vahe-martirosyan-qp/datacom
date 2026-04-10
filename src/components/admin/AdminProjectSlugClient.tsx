"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { buildProjectSectionDef } from "@/lib/adminProjectSection";
import { entriesToMap } from "@/lib/contentUtils";
import { queryKeys } from "@/lib/queryKeys";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import { fetchProjectContent } from "@/hooks/useProjectContentQuery";
import { SectionEditorModal } from "./SectionEditorModal";
import type { HomeContentResponse } from "@/types";
import styles from "./AdminOverview.module.scss";

const FALLBACK_LANGUAGES: { code: string; name: string }[] = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
];

interface AdminProjectSlugClientProps {
  slug: string;
}

function projectHeroImageKey(slug: string): string {
  return `project.${slug}.heroImage`;
}

/**
 * One hero URL in the UI: prefer the language you are editing, then `en`, then others.
 * (Previously `en` always won, so after saving from RU an outdated EN URL could mask the new image.)
 */
function resolveSharedHeroImage(
  slug: string,
  queries: { data?: HomeContentResponse }[],
  langCodes: string[],
  preferLang: string
): string {
  const key = projectHeroImageKey(slug);
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
  for (let i = 0; i < queries.length; i++) {
    const raw = queries[i]?.data;
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

export function AdminProjectSlugClient({ slug }: AdminProjectSlugClientProps) {
  const normalizedSlug = slug.trim();
  const router = useRouter();
  const queryClient = useQueryClient();
  const languagesQuery = useLanguagesQuery();

  const removeProject = useMutation({
    mutationFn: async () => {
      await api.delete(`/admin/projects/${encodeURIComponent(normalizedSlug)}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content", "home"] });
      await queryClient.invalidateQueries({ queryKey: ["content", "project"] });
      router.push("/admin/projects");
    },
  });

  const handleDeleteProjectFully = () => {
    if (
      !window.confirm(
        `Полностью удалить «${normalizedSlug}» для всех языков в этой базе? ` +
          `Сотрутся все ключи project.${normalizedSlug}.* и карточки в projects.list / home.projects.items по каждой локали. ` +
          `Другие развёртывания с отдельной базой не затрагиваются. Действие необратимо.`
      )
    ) {
      return;
    }
    removeProject.mutate();
  };
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

  const projectQueries = useQueries({
    queries: langCodes.map((code) => ({
      queryKey: queryKeys.contentProject(code, normalizedSlug),
      queryFn: () => fetchProjectContent(code, normalizedSlug),
      enabled: Boolean(normalizedSlug) && langCodes.length > 0,
    })),
  });

  const editIdx = langCodes.indexOf(editLang);
  const primaryQuery =
    editIdx >= 0 ? projectQueries[editIdx] : projectQueries[0];

  const queriesTick = useMemo(
    () =>
      projectQueries.map((q) => `${q.fetchStatus}:${q.dataUpdatedAt}`).join("|"),
    [projectQueries]
  );

  const map = useMemo(() => {
    if (!primaryQuery?.data) {
      return {};
    }
    const base = entriesToMap(primaryQuery.data.entries);
    const heroKey = projectHeroImageKey(normalizedSlug);
    const shared = resolveSharedHeroImage(
      normalizedSlug,
      projectQueries,
      langCodes,
      editLang
    );
    if (shared) {
      base[heroKey] = shared;
    }
    return base;
  }, [
    primaryQuery?.data,
    normalizedSlug,
    langCodes,
    projectQueries,
    queriesTick,
    editLang,
  ]);

  const section = useMemo(
    () => buildProjectSectionDef(normalizedSlug),
    [normalizedSlug]
  );

  if (primaryQuery?.isError) {
    return (
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>
          Не удалось загрузить проект. Проверьте slug или обновите страницу.
        </p>
        <button
          type="button"
          className={styles.adminOverview__editBtn}
          onClick={() => router.push("/admin/projects")}
        >
          К списку проектов
        </button>
        <div className={styles.adminProjectDanger}>
          <h2 className={styles.adminProjectDanger__title}>Удалить этот slug</h2>
          <p className={styles.adminProjectDanger__text}>
            Если записи контента повреждены или slug лишний, можно полностью удалить кейс
            для всех языков: ключи <code>project.{normalizedSlug}.*</code> и карточки на главной
            по каждой локали в этой базе.
          </p>
          <button
            type="button"
            className={styles.adminProjectDanger__btn}
            disabled={removeProject.isPending}
            onClick={handleDeleteProjectFully}
          >
            {removeProject.isPending ? "Удаление…" : "Удалить полностью (все языки)"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.adminOverview}>
        <h1 className={styles.adminOverview__title}>Редактирование кейса</h1>
        <div className={styles.adminOverview__toolbar}>
          <p className={styles.adminOverview__lead}>
            Slug: <code>{normalizedSlug}</code> — это страница{" "}
            <strong>самого кейса</strong> (поля <code>{`project.${normalizedSlug}.*`}</code>
            ). Заголовок, локация, год, текст и оборудование — отдельно по языкам.{" "}
            <strong>Герой-картинка</strong> одна на все языки (сохраняется во все локали). Маленькая
            карточка на главной (другая картинка/подпись) — в разделе{" "}
            <Link href="/admin/home">Главная страница</Link>, блок «Проекты» (
            <code>projects.list</code>).
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
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} variant="card" />
            ))}
          </div>
        ) : (
          <>
            <SectionEditorModal
              key={`${normalizedSlug}:${editLang}`}
              open
              variant="embedded"
              section={section}
              lang={editLang}
              contentMap={map}
              syncLanguageCodes={langCodes}
              onClose={() => router.push("/admin/projects")}
            />
            <div className={styles.adminProjectDanger}>
              <h2 className={styles.adminProjectDanger__title}>Опасная зона</h2>
              <p className={styles.adminProjectDanger__text}>
                Удаление навсегда сотрёт контент кейса для всех языков в этой базе и уберёт
                карточку из блока «Проекты» на главной (и из устаревшего{" "}
                <code>home.projects.items</code>, если использовался), для каждой локали.
              </p>
              <button
                type="button"
                className={styles.adminProjectDanger__btn}
                disabled={removeProject.isPending}
                onClick={handleDeleteProjectFully}
              >
                {removeProject.isPending ? "Удаление…" : "Удалить полностью (все языки)"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
