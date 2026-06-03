"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { buildEquipmentCategoryAdminSections } from "@/lib/adminEquipmentSection";
import { resolveEquipmentCategorySlug } from "@/lib/equipmentHrefUtils";
import { equipmentProductContentPrefix } from "@/lib/equipmentProductHrefUtils";
import { collectAdminCategoryProductSlugs } from "@/lib/equipmentCategoryProductsUtils";
import { parseEquipmentProductImages } from "@/lib/equipmentProductUtils";
import { entriesToMap } from "@/lib/contentUtils";
import { queryKeys } from "@/lib/queryKeys";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import { fetchEquipmentCategoryContent } from "@/hooks/useEquipmentCategoryContentQuery";
import { fetchHomeContent } from "@/hooks/useHomeContentQuery";
import { SectionEditorModal } from "./SectionEditorModal";
import type { HomeContentResponse } from "@/types";
import styles from "./AdminOverview.module.scss";

const FALLBACK_LANGUAGES: { code: string; name: string }[] = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
];

interface AdminEquipmentSlugClientProps {
  slug: string;
}

function equipmentHeroImageKey(segment: string): string {
  return `equipment.${segment}.heroImage`;
}

function resolveSharedHeroImage(
  segment: string,
  queries: { data?: HomeContentResponse }[],
  langCodes: string[],
  preferLang: string
): string {
  const key = equipmentHeroImageKey(segment);
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

export function AdminEquipmentSlugClient({
  slug: rawSlug,
}: AdminEquipmentSlugClientProps) {
  const segment = useMemo(
    () => resolveEquipmentCategorySlug(rawSlug) ?? "",
    [rawSlug]
  );
  const router = useRouter();
  const queryClient = useQueryClient();
  const languagesQuery = useLanguagesQuery();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [newProductTitle, setNewProductTitle] = useState("");
  const [newProductCode, setNewProductCode] = useState("");
  const [newProductError, setNewProductError] = useState<string | null>(null);

  const createProduct = useMutation({
    mutationFn: async (payload: { title: string; productSlug?: string }) => {
      const { data } = await api.post<{
        ok: boolean;
        categorySlug: string;
        productSlug: string;
      }>("/admin/equipment-products", {
        categorySlug: segment,
        productSlug: payload.productSlug,
        title: payload.title,
      });
      if (!data?.productSlug) {
        throw new Error("NO_SLUG");
      }
      return data.productSlug;
    },
    onError: (err) => {
      if (err instanceof Error && err.message === "NO_SLUG") {
        setNewProductError("Сервер не вернул код товара.");
        return;
      }
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { error?: string } } }).response?.data
          ?.error;
      setNewProductError(
        typeof msg === "string" && msg.trim()
          ? msg
          : "Не удалось создать товар."
      );
    },
    onSuccess: async (productSlug) => {
      setNewProductError(null);
      setNewProductTitle("");
      setNewProductCode("");
      await queryClient.invalidateQueries({
        queryKey: ["content", "equipmentCategory"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["content", "equipmentProduct"],
      });
      router.push(
        `/admin/equipment/${encodeURIComponent(segment)}/${encodeURIComponent(productSlug)}`
      );
    },
  });

  const handleCreateProduct = (e: FormEvent) => {
    e.preventDefault();
    const title = newProductTitle.trim();
    if (!title) {
      setNewProductError("Укажите название товара.");
      return;
    }
    setNewProductError(null);
    createProduct.mutate({
      title,
      productSlug: newProductCode.trim() || undefined,
    });
  };

  const removeCategory = useMutation({
    mutationFn: async () => {
      await api.delete(
        `/admin/equipment-categories/${encodeURIComponent(segment)}`
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content", "equipment"] });
      await queryClient.invalidateQueries({ queryKey: ["content", "home"] });
      await queryClient.invalidateQueries({
        queryKey: ["content", "equipmentCategory"],
      });
      router.push("/admin/equipment");
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
      queryKey: queryKeys.contentEquipmentCategory(code, segment),
      queryFn: () => fetchEquipmentCategoryContent(code, segment),
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
    const heroKey = equipmentHeroImageKey(segment);
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
    () => buildEquipmentCategoryAdminSections(segment),
    [segment]
  );

  const activeSection =
    sections.find((s) => s.id === activeSectionId) ?? null;

  const categoryTitle =
    map[`equipment.${segment}.title`]?.trim() || segment;

  const productSlugs = useMemo(() => {
    const maps = categoryQueries
      .map((q) => (q.data ? entriesToMap(q.data.entries) : null))
      .filter((m): m is Record<string, string> => m !== null);
    return collectAdminCategoryProductSlugs(segment, maps);
  }, [categoryQueries, segment, queriesTick]);

  const productRows = useMemo(
    () =>
      productSlugs.map((prodSlug) => {
        const p = equipmentProductContentPrefix(segment, prodSlug);
        const images = parseEquipmentProductImages(map[`${p}.images`] ?? "[]");
        return {
          slug: prodSlug,
          title: map[`${p}.title`]?.trim() || prodSlug,
          thumb:
            images[0]?.imageUrl?.trim() ||
            map[`equipment.${segment}.heroImage`]?.trim() ||
            "",
        };
      }),
    [productSlugs, map, segment]
  );

  const deleteProduct = useMutation({
    mutationFn: async (prodSlug: string) => {
      await api.delete(
        `/admin/equipment-products/${encodeURIComponent(segment)}/${encodeURIComponent(prodSlug)}`
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["content", "equipmentCategory"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["content", "equipmentProduct"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["content", "equipment"],
      });
    },
  });

  const handleDeleteProduct = (prodSlug: string, label: string) => {
    if (
      !window.confirm(
        `Удалить товар «${label}» полностью? Сотрутся страница со слайдером и карточка в «Решения в категории» для всех языков.`
      )
    ) {
      return;
    }
    deleteProduct.mutate(prodSlug);
  };

  if (!segment) {
    return (
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>
          Некорректный slug в адресе. Вернитесь к списку категорий.
        </p>
        <Link href="/admin/equipment" className={styles.adminOverview__editBtn}>
          К списку категорий
        </Link>
      </div>
    );
  }

  if (primaryQuery?.isError) {
    return (
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>
          Не удалось загрузить категорию. Проверьте slug или обновите страницу.
        </p>
        <Link href="/admin/equipment" className={styles.adminOverview__editBtn}>
          К списку категорий
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>
          <Link href="/admin/equipment">← Все категории</Link>
        </p>
        <h1 className={styles.adminOverview__title}>{categoryTitle}</h1>
        <div className={styles.adminOverview__toolbar}>
          <p className={styles.adminOverview__lead}>
            Страница на сайте: <code>/ru/equipment/{segment}</code>. Весь контент
            страницы редактируется блоками ниже: шапка, пункты «+», текст
            TipTap, карточки с фото, технические характеристики, кнопки и
            ссылка «назад». Полоса контактов и форма внизу — из раздела «Главная
            страница» / «Глобальное».
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

        <form
          className={styles.adminProjectsCreate}
          onSubmit={handleCreateProduct}
          aria-label="Новый товар в категории"
          noValidate
        >
          <h2 className={styles.adminProjectsCreate__title}>
            Добавить товар (страница со слайдером)
          </h2>
          <p className={styles.adminProjectsCreate__hint}>
            <strong>Товар</strong> — это отдельная страница: слайдер с фото, текст,
            характеристики, кнопка «Запросить стоимость» (как Omnitec GAUDI). Только для
            этой категории. В блоке «Решения в категории» на сайте появится карточка,
            по клику — полная страница товара.
          </p>
          <label className={styles.adminProjectsCreate__field}>
            <span className={styles.adminProjectsCreate__label}>
              Название товара *
            </span>
            <input
              className={styles.adminProjectsCreate__input}
              value={newProductTitle}
              onChange={(e) => setNewProductTitle(e.target.value)}
              placeholder="Например: Omnitec GAUDI FIT-IN"
            />
          </label>
          <label className={styles.adminProjectsCreate__field}>
            <span className={styles.adminProjectsCreate__label}>
              Код страницы латиницей (необязательно)
            </span>
            <input
              className={styles.adminProjectsCreate__input}
              value={newProductCode}
              onChange={(e) => setNewProductCode(e.target.value)}
              placeholder="omnitec-gaudi-fit-in — если пусто, из названия"
            />
          </label>
          {newProductError ? (
            <p className={styles.adminProjectsCreate__error} role="alert">
              {newProductError}
            </p>
          ) : null}
          <button
            type="submit"
            className={styles.adminProjectsCreate__submit}
            disabled={createProduct.isPending}
          >
            {createProduct.isPending
              ? "Создание…"
              : "Создать товар → слайдер и контент"}
          </button>
        </form>

        {primaryQuery?.isPending && !primaryQuery.data ? (
          <div className={styles.adminOverview__skeleton}>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} variant="card" />
            ))}
          </div>
        ) : (
          <>
            <h2 className={styles.adminOverview__sectionTitle}>
              Товары в этой категории
            </h2>
            <p className={styles.adminOverview__lead}>
              Список страниц товаров (слайдер, текст, характеристики). Карточки в блоке
              «Решения в категории» на сайте — в разделе ниже в сетке.
            </p>
            {productRows.length === 0 ? (
              <p className={styles.adminOverview__lead}>
                Пока нет товаров. Создайте формой выше.
              </p>
            ) : (
              <ul
                className={styles.adminProjectsList}
                style={{ maxWidth: "100%" }}
              >
                {productRows.map((row) => (
                  <li key={row.slug} className={styles.adminProjectsList__item}>
                    <div className={styles.adminProjectsList__main}>
                      {row.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={row.thumb}
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
                        <strong>{row.title}</strong>
                        <div className={styles.adminProjectsList__meta}>
                          <code>{row.slug}</code>
                          <span>
                            /ru/equipment/{segment}/{row.slug}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.adminProjectsList__actions}>
                      <Link
                        href={`/admin/equipment/${encodeURIComponent(segment)}/${encodeURIComponent(row.slug)}`}
                        className={styles.adminOverview__editBtn}
                      >
                        Редактировать
                      </Link>
                      <button
                        type="button"
                        className={styles.adminProjectDanger__btn}
                        disabled={deleteProduct.isPending}
                        onClick={() => handleDeleteProduct(row.slug, row.title)}
                      >
                        {deleteProduct.isPending &&
                        deleteProduct.variables === row.slug
                          ? "Удаление…"
                          : "Удалить"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <h2
              className={styles.adminOverview__sectionTitle}
              style={{ marginTop: "var(--space-10)" }}
            >
              Страница категории
            </h2>
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
          </>
        )}

        <div className={styles.adminProjectDanger}>
          <h2 className={styles.adminProjectDanger__title}>Опасная зона</h2>
          <p className={styles.adminProjectDanger__text}>
            Удаление сотрёт контент категории для всех языков и уберёт пункт из
            меню и страницы /equipment.
          </p>
          <button
            type="button"
            className={styles.adminProjectDanger__btn}
            disabled={removeCategory.isPending}
            onClick={() => {
              if (
                window.confirm(
                  `Удалить категорию «${categoryTitle}» полностью для всех языков?`
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
        syncKeysAcrossLanguages={[equipmentHeroImageKey(segment)]}
        equipmentCategorySlug={segment}
        contentPage="equipment"
        onClose={() => setActiveSectionId(null)}
      />
    </>
  );
}
