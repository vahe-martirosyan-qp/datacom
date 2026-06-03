"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { buildEquipmentProductAdminSections } from "@/lib/adminEquipmentProductSection";
import { resolveEquipmentCategorySlug } from "@/lib/equipmentHrefUtils";
import {
  equipmentProductContentPrefix,
  resolveEquipmentProductSlug,
} from "@/lib/equipmentProductHrefUtils";
import { buildContentPutPath, entriesToMap } from "@/lib/contentUtils";
import { EquipmentProductImagesEditor } from "./StructuredFieldEditors";
import { queryKeys } from "@/lib/queryKeys";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import { fetchEquipmentProductContent } from "@/hooks/useEquipmentProductContentQuery";
import { SectionEditorModal } from "./SectionEditorModal";
import type { HomeContentResponse } from "@/types";
import styles from "./AdminOverview.module.scss";

const FALLBACK_LANGUAGES: { code: string; name: string }[] = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
];

interface AdminEquipmentProductSlugClientProps {
  categorySlug: string;
  productSlug: string;
}

function equipmentProductImagesKey(
  categorySlug: string,
  productSlug: string
): string {
  return `${equipmentProductContentPrefix(categorySlug, productSlug)}.images`;
}

function resolveSharedProductImages(
  categorySlug: string,
  productSlug: string,
  queries: { data?: HomeContentResponse }[],
  langCodes: string[],
  preferLang: string
): string {
  const key = equipmentProductImagesKey(categorySlug, productSlug);
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

export function AdminEquipmentProductSlugClient({
  categorySlug: rawCategorySlug,
  productSlug: rawProductSlug,
}: AdminEquipmentProductSlugClientProps) {
  const categorySlug = useMemo(
    () => resolveEquipmentCategorySlug(rawCategorySlug) ?? "",
    [rawCategorySlug]
  );
  const productSlug = useMemo(
    () => resolveEquipmentProductSlug(rawProductSlug) ?? "",
    [rawProductSlug]
  );
  const queryClient = useQueryClient();
  const languagesQuery = useLanguagesQuery();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [galleryDraft, setGalleryDraft] = useState("[]");

  const createStub = useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{
        ok: boolean;
        categorySlug: string;
        productSlug: string;
      }>("/admin/equipment-products", {
        categorySlug,
        productSlug,
        title: productSlug,
      });
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["content", "equipmentProduct"],
      });
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

  const productQueries = useQueries({
    queries: langCodes.map((code) => ({
      queryKey: queryKeys.contentEquipmentProduct(
        code,
        categorySlug,
        productSlug
      ),
      queryFn: () =>
        fetchEquipmentProductContent(code, categorySlug, productSlug),
      enabled: Boolean(categorySlug && productSlug) && langCodes.length > 0,
    })),
  });

  const editIdx = langCodes.indexOf(editLang);
  const primaryQuery =
    editIdx >= 0 ? productQueries[editIdx] : productQueries[0];

  const queriesTick = useMemo(
    () =>
      productQueries.map((q) => `${q.fetchStatus}:${q.dataUpdatedAt}`).join("|"),
    [productQueries]
  );

  const map = useMemo(() => {
    if (!primaryQuery?.data) {
      return {};
    }
    const base = entriesToMap(primaryQuery.data.entries);
    const imagesKey = equipmentProductImagesKey(categorySlug, productSlug);
    const shared = resolveSharedProductImages(
      categorySlug,
      productSlug,
      productQueries,
      langCodes,
      editLang
    );
    if (shared) {
      base[imagesKey] = shared;
    }
    return base;
  }, [
    primaryQuery?.data,
    categorySlug,
    productSlug,
    langCodes,
    productQueries,
    queriesTick,
    editLang,
  ]);

  const sections = useMemo(
    () => buildEquipmentProductAdminSections(categorySlug, productSlug),
    [categorySlug, productSlug]
  );

  const imagesKey = equipmentProductImagesKey(categorySlug, productSlug);
  const serverGallery = map[imagesKey] ?? "[]";
  const gallerySyncedRef = useRef(serverGallery);
  const [gallerySaveOk, setGallerySaveOk] = useState(false);

  useEffect(() => {
    if (serverGallery !== gallerySyncedRef.current) {
      gallerySyncedRef.current = serverGallery;
      setGalleryDraft(serverGallery);
      setGallerySaveOk(false);
    }
  }, [serverGallery, imagesKey]);

  const saveGallery = useMutation({
    mutationFn: async (json: string) => {
      const path = buildContentPutPath(imagesKey);
      for (const lc of langCodes) {
        await api.put(path, { lang: lc, value: json });
      }
      return json;
    },
    onSuccess: async (json) => {
      if (json) {
        gallerySyncedRef.current = json;
      }
      setGallerySaveOk(true);
      await queryClient.invalidateQueries({
        queryKey: ["content", "equipmentProduct"],
      });
    },
    onError: () => {
      setGallerySaveOk(false);
    },
  });

  const persistGallery = (json: string) => {
    if (!json.trim() || json === "[]") {
      return;
    }
    saveGallery.mutate(json);
  };

  const activeSection =
    sections.find((s) => s.id === activeSectionId) ?? null;

  const prefix = equipmentProductContentPrefix(categorySlug, productSlug);
  const productTitle =
    map[`${prefix}.title`]?.trim() || productSlug;

  if (!categorySlug || !productSlug) {
    return (
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>
          Некорректный адрес. Вернитесь к категории оборудования.
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
          Контент страницы товара ещё не создан. Нажмите кнопку ниже (или сохраните
          карточку в категории «Решения в категории»).
        </p>
        <button
          type="button"
          className={styles.adminOverview__editBtn}
          disabled={createStub.isPending}
          onClick={() => createStub.mutate()}
        >
          {createStub.isPending ? "Создание…" : "Создать страницу товара"}
        </button>
        <Link
          href={`/admin/equipment/${encodeURIComponent(categorySlug)}`}
          className={styles.adminOverview__editBtn}
        >
          К категории
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>
          <Link href="/admin/equipment">← Все категории</Link>
          {" · "}
          <Link href={`/admin/equipment/${encodeURIComponent(categorySlug)}`}>
            ← {categorySlug}
          </Link>
        </p>
        <h1 className={styles.adminOverview__title}>Товар: {productTitle}</h1>
        <div className={styles.adminOverview__toolbar}>
          <p className={styles.adminOverview__lead}>
            Это <strong>страница товара</strong> на сайте:{" "}
            <code>
              /ru/equipment/{categorySlug}/{productSlug}
            </code>
            — слайдер, текст, характеристики, кнопка запроса стоимости. Слайдер — в блоке
            ниже. Карточка в «Решения в категории» — только превью, правится в категории.
            Галерея на все языки; остальной текст — по выбранному языку.
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
          <>
            <section className={styles.adminOverview__inlineGallery}>
              <h2 className={styles.adminOverview__cardTitle}>
                Слайдер товара (несколько фото)
              </h2>
              <EquipmentProductImagesEditor
                value={galleryDraft}
                onChange={setGalleryDraft}
                onPersist={persistGallery}
              />
              <button
                type="button"
                className={styles.adminOverview__editBtn}
                disabled={saveGallery.isPending}
                onClick={() => saveGallery.mutate(galleryDraft)}
              >
                {saveGallery.isPending ? "Сохранение…" : "Сохранить слайдер"}
              </button>
              {gallerySaveOk && !saveGallery.isPending ? (
                <p className={styles.adminOverview__galleryOk}>Слайдер сохранён.</p>
              ) : null}
              {saveGallery.isError ? (
                <p className={styles.adminOverview__galleryError} role="alert">
                  {saveGallery.error &&
                  typeof saveGallery.error === "object" &&
                  "response" in saveGallery.error
                    ? String(
                        (
                          saveGallery.error as {
                            response?: { data?: { error?: string } };
                          }
                        ).response?.data?.error ?? "Не удалось сохранить слайдер."
                      )
                    : "Не удалось сохранить слайдер."}
                </p>
              ) : null}
            </section>
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
      </div>

      <SectionEditorModal
        open={Boolean(activeSection)}
        section={activeSection}
        lang={editLang}
        contentMap={map}
        syncLanguageCodes={langCodes}
        syncKeysAcrossLanguages={[imagesKey]}
        contentPage="equipmentProduct"
        equipmentProductCategorySlug={categorySlug}
        equipmentProductSlug={productSlug}
        onClose={() => setActiveSectionId(null)}
      />
    </>
  );
}
