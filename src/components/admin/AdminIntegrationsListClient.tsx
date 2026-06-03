"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/Skeleton";
import { integrationCategorySlugFromNavHref } from "@/lib/integrationsHrefUtils";
import { entriesToMap, parseNavMegaMenu } from "@/lib/contentUtils";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useIntegrationsContentQuery } from "@/hooks/useIntegrationsContentQuery";
import { api } from "@/lib/api";
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

function integrationSlugsFromContentMap(map: Record<string, string>): string[] {
  const slugs = new Set<string>();
  for (const key of Object.keys(map)) {
    const m = key.match(/^integration\.([^.]+)\./);
    if (m?.[1]) {
      slugs.add(m[1]);
    }
  }
  return [...slugs];
}

export function AdminIntegrationsListClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const homeQuery = useHomeContentQuery("ru");
  const integrationsQuery = useIntegrationsContentQuery("ru");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const createCategory = useMutation({
    mutationFn: async (payload: { title: string; slug?: string }) => {
      const { data } = await api.post<{ ok: boolean; slug: string }>(
        "/admin/integration-categories",
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
    onSuccess: async (newSlug) => {
      setFormError(null);
      setTitle("");
      setSlug("");
      await queryClient.invalidateQueries({
        queryKey: ["content", "integrations"],
      });
      await queryClient.invalidateQueries({ queryKey: ["content", "home"] });
      await queryClient.invalidateQueries({
        queryKey: ["content", "integrationCategory"],
      });
      await router.push(`/admin/integrations/${encodeURIComponent(newSlug)}`);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (slug: string) => {
      await api.delete(
        `/admin/integration-categories/${encodeURIComponent(slug)}`
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
    },
  });

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const trimmed = title.trim();
    if (!trimmed) {
      setFormError("Укажите название новой услуги.");
      return;
    }
    if (createCategory.isPending) {
      return;
    }
    createCategory.mutate({
      title: trimmed,
      slug: slug.trim() || undefined,
    });
  };

  const handleDelete = (slug: string, label: string) => {
    if (
      !window.confirm(
        `Полностью удалить услугу «${label}» (${slug}) для всех языков? ` +
          `Сотрутся ключи integration.${slug}.*, пункт в меню и карточка на /integrations.`
      )
    ) {
      return;
    }
    deleteCategory.mutate(slug);
  };

  const categories = useMemo(() => {
    const homeMap = homeQuery.data ? entriesToMap(homeQuery.data.entries) : {};
    const integrationsMap = integrationsQuery.data
      ? entriesToMap(integrationsQuery.data.entries)
      : {};
    const merged = { ...integrationsMap, ...homeMap };

    const bySlug = new Map<
      string,
      { slug: string; title: string; thumb: string }
    >();

    const navItems = parseNavMegaMenu(homeMap);
    for (const item of navItems) {
      for (const child of item.children ?? []) {
        const childSlug = integrationCategorySlugFromNavHref(child.href);
        if (!childSlug) {
          continue;
        }
        bySlug.set(childSlug, {
          slug: childSlug,
          title: child.label?.trim() || childSlug,
          thumb: child.imageUrl?.trim() ?? "",
        });
      }
    }

    for (const childSlug of integrationSlugsFromContentMap(merged)) {
      if (bySlug.has(childSlug)) {
        continue;
      }
      const t =
        merged[`integration.${childSlug}.title`]?.trim() ||
        merged[`integration.${childSlug}.seo.title`]?.trim() ||
        childSlug;
      const thumb =
        merged[`integration.${childSlug}.heroImage`]?.trim() ?? "";
      bySlug.set(childSlug, { slug: childSlug, title: t, thumb });
    }

    return [...bySlug.values()].sort((a, b) =>
      a.title.localeCompare(b.title, "ru")
    );
  }, [homeQuery.data, integrationsQuery.data]);

  const isListLoading = homeQuery.isLoading || integrationsQuery.isLoading;

  if (homeQuery.isError || integrationsQuery.isError) {
    return (
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>
          Не удалось загрузить список услуг. Обновите страницу.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.adminOverview}>
      <h1 className={styles.adminOverview__title}>Интеграции</h1>
      <p className={styles.adminOverview__lead}>
        Управление услугами интегратора: каждая услуга — страница{" "}
        <code>/[lang]/integrations/код</code> и карточка на{" "}
        <code>/[lang]/integrations</code>.{" "}
        <Link href="/admin/integrations/settings">
          Настройки общей страницы /integrations
        </Link>
        .
      </p>

      <form
        className={styles.adminProjectsCreate}
        onSubmit={handleCreate}
        aria-label="Новая услуга"
        noValidate
      >
        <h2 className={styles.adminProjectsCreate__title}>Добавить услугу</h2>
        <p className={styles.adminProjectsCreate__hint}>
          После создания откроется редактор страницы (SEO, TipTap-текст, системы,
          кнопка консультации). Услуга появится в меню «Интеграции» и в списке
          карточек.
        </p>
        <label className={styles.adminProjectsCreate__field}>
          <span className={styles.adminProjectsCreate__label}>
            Название услуги *
          </span>
          <input
            className={styles.adminProjectsCreate__input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Проектирование"
          />
        </label>
        <label className={styles.adminProjectsCreate__field}>
          <span className={styles.adminProjectsCreate__label}>
            Адрес страницы латиницей (необязательно)
          </span>
          <input
            className={styles.adminProjectsCreate__input}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="design — если пусто, сформируется из названия"
          />
        </label>
        {formError ? (
          <p className={styles.adminProjectsCreate__error} role="alert">
            {formError}
          </p>
        ) : null}
        <button
          type="submit"
          className={styles.adminProjectsCreate__submit}
          disabled={createCategory.isPending}
        >
          {createCategory.isPending ? "Создание…" : "Создать услугу"}
        </button>
      </form>

      <h2 className={styles.adminOverview__sectionTitle}>Услуги</h2>
      {isListLoading ? (
        <div className={styles.adminOverview__skeleton}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className={styles.adminOverview__lead}>
          Услуг пока нет. Создайте первую или перезапустите dev-сервер для seed.
        </p>
      ) : (
        <ul className={styles.adminProjectsList}>
          {categories.map((cat) => (
            <li key={cat.slug} className={styles.adminProjectsList__item}>
              <div className={styles.adminProjectsList__main}>
                {cat.thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cat.thumb}
                    alt=""
                    className={styles.adminProjectsList__thumb}
                  />
                ) : (
                  <div
                    className={styles.adminProjectsList__thumbPlaceholder}
                    aria-hidden
                  />
                )}
                <div>
                  <strong>{cat.title}</strong>
                  <div className={styles.adminProjectsList__meta}>
                    <code>{cat.slug}</code>
                    <span>
                      /ru/integrations/{cat.slug}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.adminProjectsList__actions}>
                <Link
                  href={`/admin/integrations/${encodeURIComponent(cat.slug)}`}
                  className={styles.adminOverview__editBtn}
                >
                  Редактировать страницу
                </Link>
                <button
                  type="button"
                  className={styles.adminProjectDanger__btn}
                  disabled={deleteCategory.isPending}
                  onClick={() => handleDelete(cat.slug, cat.title)}
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
