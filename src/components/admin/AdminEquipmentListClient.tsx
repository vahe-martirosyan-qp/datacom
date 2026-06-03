"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/Skeleton";
import { equipmentCategorySlugFromNavHref } from "@/lib/equipmentHrefUtils";
import { entriesToMap, parseNavMegaMenu } from "@/lib/contentUtils";
import { useEquipmentContentQuery } from "@/hooks/useEquipmentContentQuery";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
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

function equipmentSlugsFromContentMap(map: Record<string, string>): string[] {
  const slugs = new Set<string>();
  for (const key of Object.keys(map)) {
    const m = key.match(/^equipment\.(?!product\.)([^.]+)\./);
    if (m?.[1]) {
      slugs.add(m[1]);
    }
  }
  return [...slugs];
}

export function AdminEquipmentListClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const homeQuery = useHomeContentQuery("ru");
  const equipmentQuery = useEquipmentContentQuery("ru");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const createCategory = useMutation({
    mutationFn: async (payload: { title: string; slug?: string }) => {
      const { data } = await api.post<{ ok: boolean; slug: string }>(
        "/admin/equipment-categories",
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
      await queryClient.invalidateQueries({ queryKey: ["content", "equipment"] });
      await queryClient.invalidateQueries({ queryKey: ["content", "home"] });
      await queryClient.invalidateQueries({
        queryKey: ["content", "equipmentCategory"],
      });
      await router.push(`/admin/equipment/${encodeURIComponent(newSlug)}`);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (slug: string) => {
      await api.delete(
        `/admin/equipment-categories/${encodeURIComponent(slug)}`
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content", "equipment"] });
      await queryClient.invalidateQueries({ queryKey: ["content", "home"] });
      await queryClient.invalidateQueries({
        queryKey: ["content", "equipmentCategory"],
      });
    },
  });

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const trimmed = title.trim();
    if (!trimmed) {
      setFormError("Укажите название новой категории.");
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
        `Полностью удалить категорию «${label}» (${slug}) для всех языков? ` +
          `Сотрутся ключи equipment.${slug}.* и пункт в меню.`
      )
    ) {
      return;
    }
    deleteCategory.mutate(slug);
  };

  const categories = useMemo(() => {
    const homeMap = homeQuery.data ? entriesToMap(homeQuery.data.entries) : {};
    const equipmentMap = equipmentQuery.data
      ? entriesToMap(equipmentQuery.data.entries)
      : {};
    const merged = { ...equipmentMap, ...homeMap };

    const bySlug = new Map<
      string,
      { slug: string; title: string; thumb: string }
    >();

    const navItems = parseNavMegaMenu(homeMap);
    for (const item of navItems) {
      for (const child of item.children ?? []) {
        const slug = equipmentCategorySlugFromNavHref(child.href);
        if (!slug) {
          continue;
        }
        bySlug.set(slug, {
          slug,
          title: child.label?.trim() || slug,
          thumb: child.imageUrl?.trim() ?? "",
        });
      }
    }

    for (const slug of equipmentSlugsFromContentMap(merged)) {
      if (bySlug.has(slug)) {
        continue;
      }
      const t =
        merged[`equipment.${slug}.title`]?.trim() ||
        merged[`equipment.${slug}.seo.title`]?.trim() ||
        slug;
      const thumb = merged[`equipment.${slug}.heroImage`]?.trim() ?? "";
      bySlug.set(slug, { slug, title: t, thumb });
    }

    return [...bySlug.values()].sort((a, b) =>
      a.title.localeCompare(b.title, "ru")
    );
  }, [homeQuery.data, equipmentQuery.data]);

  const isListLoading = homeQuery.isLoading || equipmentQuery.isLoading;

  if (homeQuery.isError || equipmentQuery.isError) {
    return (
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>
          Не удалось загрузить список категорий. Обновите страницу.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.adminOverview}>
      <h1 className={styles.adminOverview__title}>Оборудование и системы</h1>
      <p className={styles.adminOverview__lead}>
        В шапке сайта один раздел — <strong>Equipment &amp; systems</strong> (не
        два отдельных пункта). Здесь вы управляете его{" "}
        <strong>категориями</strong>: «Электронные замки», «Минибары», «ТВ» и т.д.
        Каждая категория — страница <code>/[lang]/equipment/категория</code> и строка
        в выпадающем меню. Внутри категории — отдельные страницы товаров: их
        превью задаётся в категории, полная страница с галереей — по ссылке «Страницы
        товаров» на экране категории.{" "}
        <Link href="/admin/equipment/settings">
          Настройки общей страницы /equipment
        </Link>
        .
      </p>

      <form
        className={styles.adminProjectsCreate}
        onSubmit={handleCreate}
        aria-label="Новая категория"
        noValidate
      >
        <h2 className={styles.adminProjectsCreate__title}>Добавить категорию</h2>
        <p className={styles.adminProjectsCreate__hint}>
          После создания откроется редактор страницы категории (SEO, текст, фото,
          характеристики). Категория появится в меню «Оборудование и системы» и на
          странице /equipment.
        </p>
        <label className={styles.adminProjectsCreate__field}>
          <span className={styles.adminProjectsCreate__label}>
            Название категории *
          </span>
          <input
            className={styles.adminProjectsCreate__input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Электронные замки"
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
            placeholder="electronic-locks — если пусто, сформируется из названия"
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
          {createCategory.isPending ? "Создание…" : "Создать категорию"}
        </button>
      </form>

      <h2 className={styles.adminOverview__sectionTitle}>Категории</h2>
      {isListLoading ? (
        <div className={styles.adminOverview__skeleton}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className={styles.adminOverview__lead}>
          Категорий пока нет. Создайте первую или восстановите seed-контент.
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
                      /ru/equipment/{cat.slug}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.adminProjectsList__actions}>
                <Link
                  href={`/admin/equipment/${encodeURIComponent(cat.slug)}`}
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
