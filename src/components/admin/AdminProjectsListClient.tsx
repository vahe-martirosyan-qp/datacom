"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/Skeleton";
import { entriesToMap, parseJsonArray } from "@/lib/contentUtils";
import {
  normalizeNewProjectSlug,
  projectSlugFromCardHref,
} from "@/lib/projectHrefUtils";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import { api } from "@/lib/api";
import type { ProjectCardItem } from "@/types/site";
import styles from "./AdminOverview.module.scss";

function getApiErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const r = (err as { response?: { data?: { error?: string } } }).response;
    const msg = r?.data?.error;
    if (typeof msg === "string" && msg.trim()) {
      return msg;
    }
  }
  return "Не удалось выполнить запрос. Проверьте сеть и авторизацию.";
}

export function AdminProjectsListClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const contentQuery = useHomeContentQuery("ru");
  const [newSlug, setNewSlug] = useState("");
  const [addHomeCard, setAddHomeCard] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const createProject = useMutation({
    mutationFn: async (payload: { slug: string; addHomeCard: boolean }) => {
      const { data } = await api.post<{ ok: boolean; slug: string }>(
        "/admin/projects",
        payload
      );
      if (!data?.slug) {
        throw new Error("NO_SLUG");
      }
      return data.slug;
    },
    onError: (err) => {
      if (err instanceof Error && err.message === "NO_SLUG") {
        setFormError("Сервер не вернул slug. Обновите страницу и попробуйте снова.");
        return;
      }
      setFormError(getApiErrorMessage(err));
    },
    onSuccess: async (slug) => {
      setFormError(null);
      setNewSlug("");
      await queryClient.invalidateQueries({ queryKey: ["content", "home"] });
      await router.push(`/admin/projects/${encodeURIComponent(slug)}`);
    },
  });

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (createProject.isPending) {
      return;
    }
    const trimmed = newSlug.trim();
    if (!trimmed) {
      setFormError(
        "Сначала введите slug в поле выше (латиница, цифры и дефисы, например riverside-sochi)."
      );
      return;
    }
    if (!normalizeNewProjectSlug(trimmed)) {
      setFormError(
        "Некорректный slug: только строчные латинские буквы, цифры и дефисы, без пробелов."
      );
      return;
    }
    createProject.mutate({ slug: trimmed, addHomeCard });
  };

  const deleteProject = useMutation({
    mutationFn: async (slug: string) => {
      await api.delete(`/admin/projects/${encodeURIComponent(slug)}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content", "home"] });
      await queryClient.invalidateQueries({ queryKey: ["content", "project"] });
    },
  });

  const handleDeleteFully = (slug: string) => {
    if (
      !window.confirm(
        `Полностью удалить кейс «${slug}» для всех языков в этой базе? ` +
          `Сотрутся все ключи project.${slug}.* и ссылки на кейс в projects.list / home.projects.items по каждой локали. ` +
          `Другие серверы или базы (другие «окружения») не затрагиваются. Действие необратимо.`
      )
    ) {
      return;
    }
    deleteProject.mutate(slug);
  };

  const { slugs, thumbBySlug } = useMemo(() => {
    if (!contentQuery.data) {
      return { slugs: [] as string[], thumbBySlug: {} as Record<string, string> };
    }
    const map = entriesToMap(contentQuery.data.entries);
    const raw = map["projects.list"] ?? map["home.projects.items"] ?? "[]";
    const items = parseJsonArray<ProjectCardItem>(raw, []);
    const slugSet = new Set<string>();
    const thumbs: Record<string, string> = {};
    for (const item of items) {
      const s = projectSlugFromCardHref(item.href);
      if (!s) {
        continue;
      }
      slugSet.add(s);
      const u = item.imageUrl?.trim();
      if (u && !thumbs[s]) {
        thumbs[s] = u;
      }
    }
    return {
      slugs: [...slugSet].sort((a, b) => a.localeCompare(b)),
      thumbBySlug: thumbs,
    };
  }, [contentQuery.data]);

  if (contentQuery.isError) {
    return (
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>
          Не удалось загрузить список. Обновите страницу.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.adminOverview}>
      <h1 className={styles.adminOverview__title}>Проекты (кейсы)</h1>
      <p className={styles.adminOverview__lead}>
        Создайте проект и откройте его для редактирования контента страницы кейса. Список ниже строится
        по карточкам главной (<code>projects.list</code>); сами карточки настраиваются в разделе{" "}
        <Link href="/admin/home">главной</Link>, блок «Проекты».
      </p>

      <form
        className={styles.adminProjectsCreate}
        onSubmit={handleCreate}
        aria-label="Новый проект"
        noValidate
      >
        <label className={styles.adminProjectsCreate__field}>
          <span className={styles.adminProjectsCreate__label}>
            Slug (в URL: <code>/…/projects/slug</code>)
          </span>
          <input
            className={styles.adminProjectsCreate__input}
            value={newSlug}
            onChange={(e) => {
              setNewSlug(e.target.value);
              setFormError(null);
            }}
            placeholder="например riverside-sochi"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <label className={styles.adminProjectsCreate__check}>
          <input
            type="checkbox"
            checked={addHomeCard}
            onChange={(e) => setAddHomeCard(e.target.checked)}
          />
          <span>Добавить карточку в блок «Проекты» на главной</span>
        </label>
        {formError ? (
          <p className={styles.adminProjectsCreate__error} role="alert">
            {formError}
          </p>
        ) : null}
        <button
          type="submit"
          className={styles.adminOverview__editBtn}
          disabled={createProject.isPending}
        >
          {createProject.isPending ? "Создание…" : "Создать проект"}
        </button>
      </form>

      {contentQuery.isLoading ? (
        <div className={styles.adminOverview__skeleton}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      ) : slugs.length === 0 ? (
        <p className={styles.adminOverview__lead}>
          Пока нет карточек с ссылкой <code>projects/slug</code> в{" "}
          <code>projects.list</code>. Создайте проект выше (с галочкой «добавить на главную») или
          добавьте карточки в разделе <Link href="/admin/home">главной</Link>.
        </p>
      ) : (
        <>
          <h2 className={styles.adminOverview__title} style={{ fontSize: "var(--text-xl)", marginTop: "var(--space-10)" }}>
            Проекты
          </h2>
          <ul className={styles.adminProjectsList}>
            {slugs.map((s) => (
              <li key={s} className={styles.adminProjectsList__item}>
                <div className={styles.adminProjectsList__row}>
                  <div
                    className={styles.adminProjectsList__thumbWrap}
                    aria-hidden
                  >
                    {thumbBySlug[s] ? (
                      // eslint-disable-next-line @next/next/no-img-element -- admin preview of CMS URLs
                      <img
                        src={thumbBySlug[s]}
                        alt=""
                        className={styles.adminProjectsList__thumb}
                      />
                    ) : (
                      <div className={styles.adminProjectsList__thumbPlaceholder} />
                    )}
                  </div>
                  <Link
                    href={`/admin/projects/${encodeURIComponent(s)}`}
                    className={styles.adminProjectsList__link}
                  >
                    {s}
                  </Link>
                  <Link
                    href={`/admin/projects/${encodeURIComponent(s)}`}
                    className={styles.adminProjectsList__edit}
                  >
                    Редактировать
                  </Link>
                  <button
                    type="button"
                    className={styles.adminProjectsList__delete}
                    disabled={deleteProject.isPending}
                    onClick={() => handleDeleteFully(s)}
                    title="Удалить контент кейса и карточки на главной для всех языков в CMS"
                  >
                    {deleteProject.isPending && deleteProject.variables === s
                      ? "Удаление…"
                      : "Удалить полностью (все языки)"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
