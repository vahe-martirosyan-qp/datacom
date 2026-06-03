"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  buildLocalizedHref,
  entriesToMap,
  parseJsonArray,
} from "@/lib/contentUtils";
import { shouldOpenLeadFormModal } from "@/lib/leadFormUtils";
import { equipmentProductContentPrefix } from "@/lib/equipmentProductHrefUtils";
import { parseEquipmentProductImages } from "@/lib/equipmentProductUtils";
import { useEquipmentCategoryContentQuery } from "@/hooks/useEquipmentCategoryContentQuery";
import { useEquipmentContentQuery } from "@/hooks/useEquipmentContentQuery";
import { useEquipmentProductContentQuery } from "@/hooks/useEquipmentProductContentQuery";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import type { EquipmentSpecItem } from "@/types/site";
import { EquipmentProductGallery } from "./EquipmentProductGallery";
import { SiteChrome } from "./SiteChrome";
import { SiteContactStrip } from "./SiteContactStrip";
import { SiteLeadFormModal } from "./SiteLeadFormModal";
import styles from "./EquipmentProductPageView.module.scss";

interface EquipmentProductPageViewProps {
  lang: string;
  categorySlug: string;
  productSlug: string;
}

function nonEmptyLines(items: string[]): string[] {
  return items.map((s) => s.trim()).filter(Boolean);
}

export function EquipmentProductPageView({
  lang,
  categorySlug,
  productSlug,
}: EquipmentProductPageViewProps) {
  const homeQuery = useHomeContentQuery(lang);
  const equipmentQuery = useEquipmentContentQuery(lang);
  const categoryQuery = useEquipmentCategoryContentQuery(lang, categorySlug);
  const productQuery = useEquipmentProductContentQuery(
    lang,
    categorySlug,
    productSlug
  );
  const languagesQuery = useLanguagesQuery();

  const homeMap = useMemo(
    () => (homeQuery.data ? entriesToMap(homeQuery.data.entries) : {}),
    [homeQuery.data]
  );

  const equipmentMap = useMemo(
    () =>
      equipmentQuery.data ? entriesToMap(equipmentQuery.data.entries) : {},
    [equipmentQuery.data]
  );

  const categoryMap = useMemo(
    () =>
      categoryQuery.data ? entriesToMap(categoryQuery.data.entries) : {},
    [categoryQuery.data]
  );

  const map = useMemo(
    () => (productQuery.data ? entriesToMap(productQuery.data.entries) : {}),
    [productQuery.data]
  );

  const catPrefix = `equipment.${categorySlug}`;
  const prefix = equipmentProductContentPrefix(categorySlug, productSlug);

  const categoryTitle = categoryMap[`${catPrefix}.title`]?.trim() ?? "";
  const categoryEyebrow = categoryMap[`${catPrefix}.eyebrow`]?.trim() ?? "";

  const title = map[`${prefix}.title`]?.trim() ?? "";
  const subtitle = map[`${prefix}.subtitle`]?.trim() ?? "";
  const images = parseEquipmentProductImages(map[`${prefix}.images`] ?? "[]");
  const highlights = nonEmptyLines(
    parseJsonArray<string>(map[`${prefix}.highlights`] ?? "[]", [])
  );
  const bodyHtml = map[`${prefix}.bodyHtml`]?.trim() ?? "";
  const specsTitle = map[`${prefix}.specsTitle`]?.trim() ?? "";
  const specs = parseJsonArray<EquipmentSpecItem>(
    map[`${prefix}.specs`] ?? "[]",
    []
  ).filter((s) => s.title?.trim());
  const ctaLabel = map[`${prefix}.ctaLabel`]?.trim() ?? "";
  const ctaHrefRaw = map[`${prefix}.ctaHref`]?.trim() ?? "";
  const pdfLabel = map[`${prefix}.pdfLabel`]?.trim() ?? "";
  const pdfHref = map[`${prefix}.pdfHref`]?.trim() ?? "";

  const languages = languagesQuery.data ?? [];
  const isLoading =
    homeQuery.isLoading ||
    equipmentQuery.isLoading ||
    categoryQuery.isLoading ||
    productQuery.isLoading ||
    languagesQuery.isLoading;

  const homeLabel = homeMap["home.header.logoText"]?.trim() || "Home";
  const equipmentIndexLabel =
    equipmentMap["page.equipment.title"]?.trim() || "";
  const showCta = Boolean(ctaLabel);
  const ctaOpensModal = showCta && shouldOpenLeadFormModal(ctaHrefRaw);
  const showPdf = Boolean(pdfLabel && pdfHref);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  return (
    <SiteChrome
      lang={lang}
      map={homeMap}
      languages={languages}
      isLoading={isLoading}
      loadError={
        homeQuery.isError ||
        equipmentQuery.isError ||
        categoryQuery.isError ||
        productQuery.isError
      }
    >
      <article
        className={styles.equipmentProductPage}
        lang={lang}
        key={`${lang}-${categorySlug}-${productSlug}`}
      >
        <header className={styles.equipmentProductPage__heroBand}>
          <div className={styles.equipmentProductPage__heroInner}>
            <nav
              className={styles.equipmentProductPage__crumb}
              aria-label="Breadcrumb"
            >
              <Link
                href={`/${lang}`}
                className={styles.equipmentProductPage__crumbLink}
              >
                {homeLabel}
              </Link>
              {equipmentIndexLabel ? (
                <>
                  <span aria-hidden> / </span>
                  <Link
                    href={`/${lang}/equipment`}
                    className={styles.equipmentProductPage__crumbLink}
                  >
                    {equipmentIndexLabel}
                  </Link>
                </>
              ) : null}
              {categoryTitle ? (
                <>
                  <span aria-hidden> / </span>
                  <Link
                    href={`/${lang}/equipment/${categorySlug}`}
                    className={styles.equipmentProductPage__crumbLink}
                  >
                    {categoryTitle}
                  </Link>
                </>
              ) : null}
              {title ? (
                <>
                  <span aria-hidden> / </span>
                  <span>{title}</span>
                </>
              ) : null}
            </nav>

            {isLoading ? (
              <div className={styles.equipmentProductPage__loading}>
                <Skeleton variant="title" />
                <Skeleton variant="image" />
              </div>
            ) : (
              <>
                {categoryEyebrow ? (
                  <span className={styles.equipmentProductPage__eyebrow}>
                    {categoryEyebrow}
                  </span>
                ) : null}
                {title ? (
                  <h1 className={styles.equipmentProductPage__title}>{title}</h1>
                ) : null}
                {subtitle ? (
                  <p className={styles.equipmentProductPage__subtitle}>
                    {subtitle}
                  </p>
                ) : null}

                <div className={styles.equipmentProductPage__layout}>
                  <EquipmentProductGallery
                    images={images}
                    productTitle={title || productSlug}
                  />
                  <div className={styles.equipmentProductPage__aside}>
                    {highlights.length > 0 ? (
                      <ul className={styles.equipmentProductPage__highlights}>
                        {highlights.map((line) => (
                          <li
                            key={line}
                            className={styles.equipmentProductPage__highlight}
                          >
                            <span
                              className={
                                styles.equipmentProductPage__highlightMark
                              }
                              aria-hidden
                            >
                              +
                            </span>
                            {line}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <div className={styles.equipmentProductPage__actions}>
                      {showCta ? (
                        ctaOpensModal ? (
                          <button
                            type="button"
                            className={styles.equipmentProductPage__cta}
                            onClick={() => setQuoteModalOpen(true)}
                          >
                            {ctaLabel}
                            <span aria-hidden>↗</span>
                          </button>
                        ) : (
                          <Link
                            href={buildLocalizedHref(lang, ctaHrefRaw)}
                            className={styles.equipmentProductPage__cta}
                          >
                            {ctaLabel}
                            <span aria-hidden>↗</span>
                          </Link>
                        )
                      ) : null}
                      {showPdf ? (
                        <a
                          href={pdfHref}
                          className={styles.equipmentProductPage__pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {pdfLabel}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {!isLoading && bodyHtml ? (
          <section className={styles.equipmentProductPage__section}>
            <div className={styles.equipmentProductPage__sectionInner}>
              <div
                className={styles.equipmentProductPage__body}
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </div>
          </section>
        ) : null}

        {!isLoading && specs.length > 0 ? (
          <section
            className={`${styles.equipmentProductPage__section} ${styles["equipmentProductPage__section--alt"]}`}
          >
            <div className={styles.equipmentProductPage__sectionInner}>
              {specsTitle ? (
                <h2 className={styles.equipmentProductPage__sectionTitle}>
                  {specsTitle}
                </h2>
              ) : null}
              <ul className={styles.equipmentProductPage__specs}>
                {specs.map((spec) => (
                  <li
                    key={spec.title}
                    className={styles.equipmentProductPage__spec}
                  >
                    <h3 className={styles.equipmentProductPage__specTitle}>
                      {spec.title}
                    </h3>
                    {spec.desc?.trim() ? (
                      <p className={styles.equipmentProductPage__specDesc}>
                        {spec.desc}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${lang}/equipment/${categorySlug}`}
                className={styles.equipmentProductPage__back}
              >
                ← {categoryTitle || categorySlug}
              </Link>
            </div>
          </section>
        ) : null}

        <SiteContactStrip lang={lang} map={homeMap} isLoading={isLoading} />
        <SiteLeadFormModal
          open={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          map={homeMap}
          isLoading={isLoading}
          source="equipment-product-modal"
          lang={lang}
        />
      </article>
    </SiteChrome>
  );
}
