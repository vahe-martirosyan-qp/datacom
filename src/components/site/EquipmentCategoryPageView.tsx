"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  buildLocalizedHref,
  entriesToMap,
  parseJsonArray,
} from "@/lib/contentUtils";
import { useEquipmentCategoryContentQuery } from "@/hooks/useEquipmentCategoryContentQuery";
import { useEquipmentContentQuery } from "@/hooks/useEquipmentContentQuery";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import {
  buildCategoryProductsForDisplay,
  parseEquipmentCategoryProductCatalog,
} from "@/lib/equipmentCategoryProductsUtils";
import { resolveEquipmentCategoryProductCardLink } from "@/lib/equipmentProductHrefUtils";
import type { EquipmentProductItem, EquipmentSpecItem } from "@/types/site";
import { SiteChrome } from "./SiteChrome";
import { SiteContactStrip } from "./SiteContactStrip";
import { SiteLeadForm } from "./SiteLeadForm";
import styles from "./EquipmentCategoryPageView.module.scss";

const CATEGORY_PRODUCTS_INITIAL = 4;
const CATEGORY_PRODUCTS_STEP = 4;

interface EquipmentCategoryPageViewProps {
  lang: string;
  categorySlug: string;
}

function nonEmptyLines(items: string[]): string[] {
  return items.map((s) => s.trim()).filter(Boolean);
}

export function EquipmentCategoryPageView({
  lang,
  categorySlug,
}: EquipmentCategoryPageViewProps) {
  const homeQuery = useHomeContentQuery(lang);
  const equipmentQuery = useEquipmentContentQuery(lang);
  const categoryQuery = useEquipmentCategoryContentQuery(lang, categorySlug);
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

  const map = useMemo(
    () => (categoryQuery.data ? entriesToMap(categoryQuery.data.entries) : {}),
    [categoryQuery.data]
  );

  const prefix = `equipment.${categorySlug}`;
  const eyebrow = map[`${prefix}.eyebrow`]?.trim() ?? "";
  const title = map[`${prefix}.title`]?.trim() ?? "";
  const subtitle = map[`${prefix}.subtitle`]?.trim() ?? "";
  const heroImage = map[`${prefix}.heroImage`]?.trim() ?? "";
  const bodyHtml = map[`${prefix}.bodyHtml`]?.trim() ?? "";
  const highlights = nonEmptyLines(
    parseJsonArray<string>(map[`${prefix}.highlights`] ?? "[]", [])
  );
  const productsTitle = map[`${prefix}.productsTitle`]?.trim() ?? "";
  const products = useMemo(() => {
    const catalog = parseEquipmentCategoryProductCatalog(
      map[`${prefix}._productCatalog`] ?? "[]"
    );
    const cards = parseJsonArray<EquipmentProductItem>(
      map[`${prefix}.products`] ?? "[]",
      []
    );
    return buildCategoryProductsForDisplay(cards, catalog).filter(
      (p) => p.title?.trim() && p.imageUrl?.trim() && p.slug?.trim()
    );
  }, [map, prefix]);
  const productsLoadMoreLabel =
    map[`${prefix}.productsLoadMoreLabel`]?.trim() ||
    equipmentMap["page.equipment.productsLoadMoreLabel"]?.trim() ||
    (lang === "ru" ? "Показать ещё" : "Show more");

  const [shownProductCount, setShownProductCount] = useState(
    CATEGORY_PRODUCTS_INITIAL
  );

  useEffect(() => {
    setShownProductCount(CATEGORY_PRODUCTS_INITIAL);
  }, [lang, categorySlug, products.length]);

  const visibleProducts = useMemo(
    () => products.slice(0, shownProductCount),
    [products, shownProductCount]
  );
  const hasMoreProducts = shownProductCount < products.length;
  const specsTitle = map[`${prefix}.specsTitle`]?.trim() ?? "";
  const specs = parseJsonArray<EquipmentSpecItem>(
    map[`${prefix}.specs`] ?? "[]",
    []
  ).filter((s) => s.title?.trim());
  const ctaLabel = map[`${prefix}.ctaLabel`]?.trim() ?? "";
  const ctaHrefRaw = map[`${prefix}.ctaHref`]?.trim() ?? "";
  const pdfLabel = map[`${prefix}.pdfLabel`]?.trim() ?? "";
  const pdfHref = map[`${prefix}.pdfHref`]?.trim() ?? "";
  const backLabel = map[`${prefix}.backLabel`]?.trim() ?? "";

  const languages = languagesQuery.data ?? [];
  const isLoading =
    homeQuery.isLoading ||
    equipmentQuery.isLoading ||
    categoryQuery.isLoading ||
    languagesQuery.isLoading;

  const homeLabel = homeMap["home.header.logoText"]?.trim() || "Home";
  const equipmentIndexLabel =
    equipmentMap["page.equipment.title"]?.trim() || "";
  const showCta = Boolean(ctaLabel && ctaHrefRaw);
  const showPdf = Boolean(pdfLabel && pdfHref);
  const ctaHref = showCta ? buildLocalizedHref(lang, ctaHrefRaw) : "";

  return (
    <SiteChrome
      lang={lang}
      map={homeMap}
      languages={languages}
      isLoading={isLoading}
      loadError={
        homeQuery.isError || equipmentQuery.isError || categoryQuery.isError
      }
    >
      <article
        key={`${lang}-${categorySlug}`}
        className={styles.equipmentCategoryPage}
        lang={lang}
      >
        {isLoading ? (
          <div className={styles.equipmentCategoryPage__loading}>
            <Skeleton variant="title" />
            <Skeleton variant="image" />
            <Skeleton variant="text" />
          </div>
        ) : (
          <>
            <header className={styles.equipmentCategoryPage__hero}>
              {heroImage ? (
                <div
                  className={styles.equipmentCategoryPage__heroBg}
                  aria-hidden
                >
                  <Image
                    src={heroImage}
                    alt=""
                    fill
                    className={styles.equipmentCategoryPage__heroBgImg}
                    sizes="100vw"
                    priority
                  />
                </div>
              ) : null}
              <div className={styles.equipmentCategoryPage__heroInner}>
                <nav
                  className={styles.equipmentCategoryPage__crumb}
                  aria-label="Breadcrumb"
                >
                  <Link
                    href={`/${lang}`}
                    className={styles.equipmentCategoryPage__crumbLink}
                  >
                    {homeLabel}
                  </Link>
                  {equipmentIndexLabel ? (
                    <>
                      <span aria-hidden> / </span>
                      <Link
                        href={`/${lang}/equipment`}
                        className={styles.equipmentCategoryPage__crumbLink}
                      >
                        {equipmentIndexLabel}
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

                {eyebrow ? (
                  <span className={styles.equipmentCategoryPage__eyebrow}>
                    {eyebrow}
                  </span>
                ) : null}
                {title ? (
                  <h1 className={styles.equipmentCategoryPage__title}>{title}</h1>
                ) : null}
                {subtitle ? (
                  <p className={styles.equipmentCategoryPage__subtitle}>
                    {subtitle}
                  </p>
                ) : null}

                {highlights.length > 0 ? (
                  <ul className={styles.equipmentCategoryPage__highlights}>
                    {highlights.map((line) => (
                      <li
                        key={line}
                        className={styles.equipmentCategoryPage__highlight}
                      >
                        <span
                          className={
                            styles.equipmentCategoryPage__highlightMark
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
              </div>
            </header>

            {bodyHtml ? (
              <section className={styles.equipmentCategoryPage__section}>
                <div className={styles.equipmentCategoryPage__sectionInner}>
                  <div
                    className={styles.equipmentCategoryPage__body}
                    dangerouslySetInnerHTML={{ __html: bodyHtml }}
                  />
                </div>
              </section>
            ) : null}

            {showCta || showPdf ? (
              <section
                className={`${styles.equipmentCategoryPage__section} ${styles["equipmentCategoryPage__section--compact"]}`}
              >
                <div className={styles.equipmentCategoryPage__sectionInner}>
                  <div className={styles.equipmentCategoryPage__actions}>
                    {showCta ? (
                      <Link
                        href={ctaHref}
                        className={styles.equipmentCategoryPage__cta}
                      >
                        {ctaLabel}
                        <span aria-hidden>↗</span>
                      </Link>
                    ) : null}
                    {showPdf ? (
                      <a
                        href={pdfHref}
                        className={styles.equipmentCategoryPage__pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pdfLabel}
                      </a>
                    ) : null}
                  </div>
                </div>
              </section>
            ) : null}

            {products.length > 0 ? (
              <section
                className={`${styles.equipmentCategoryPage__section} ${styles["equipmentCategoryPage__section--alt"]}`}
                aria-label={productsTitle || undefined}
              >
                <div className={styles.equipmentCategoryPage__sectionInner}>
                  {productsTitle ? (
                    <h2 className={styles.equipmentCategoryPage__sectionTitle}>
                      {productsTitle}
                    </h2>
                  ) : null}
                  <ul className={styles.equipmentCategoryPage__products}>
                    {visibleProducts.map((item, index) => {
                      const link = resolveEquipmentCategoryProductCardLink(
                        lang,
                        categorySlug,
                        item
                      );
                      const cardInner = (
                        <>
                          <div
                            className={styles.equipmentCategoryPage__productMedia}
                          >
                            <Image
                              src={item.imageUrl}
                              alt=""
                              fill
                              className={styles.equipmentCategoryPage__productImg}
                              sizes="(max-width: 768px) 100vw, 25vw"
                            />
                          </div>
                          <div
                            className={styles.equipmentCategoryPage__productBody}
                          >
                            <h3
                              className={
                                styles.equipmentCategoryPage__productTitle
                              }
                            >
                              {item.title}
                            </h3>
                            {item.desc?.trim() ? (
                              <p
                                className={
                                  styles.equipmentCategoryPage__productDesc
                                }
                              >
                                {item.desc}
                              </p>
                            ) : null}
                          </div>
                        </>
                      );
                      return (
                        <li
                          key={
                            (item.slug?.trim() || "") +
                            item.title +
                            item.imageUrl +
                            String(index)
                          }
                        >
                          {link && !link.external ? (
                            <Link
                              href={link.href}
                              className={styles.equipmentCategoryPage__product}
                            >
                              {cardInner}
                            </Link>
                          ) : link?.external ? (
                            <a
                              href={link.href}
                              className={styles.equipmentCategoryPage__product}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {cardInner}
                            </a>
                          ) : (
                            <div
                              className={`${styles.equipmentCategoryPage__product} ${styles["equipmentCategoryPage__product--static"]}`}
                            >
                              {cardInner}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {hasMoreProducts ? (
                    <div className={styles.equipmentCategoryPage__productsMore}>
                      <button
                        type="button"
                        className={styles.equipmentCategoryPage__productsMoreBtn}
                        onClick={() =>
                          setShownProductCount((n) =>
                            Math.min(
                              n + CATEGORY_PRODUCTS_STEP,
                              products.length
                            )
                          )
                        }
                      >
                        {productsLoadMoreLabel}
                      </button>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            {specs.length > 0 ? (
              <section className={styles.equipmentCategoryPage__section}>
                <div className={styles.equipmentCategoryPage__sectionInner}>
                  {specsTitle ? (
                    <h2 className={styles.equipmentCategoryPage__sectionTitle}>
                      {specsTitle}
                    </h2>
                  ) : null}
                  <ul className={styles.equipmentCategoryPage__specs}>
                    {specs.map((spec) => (
                      <li
                        key={spec.title}
                        className={styles.equipmentCategoryPage__spec}
                      >
                        <h3 className={styles.equipmentCategoryPage__specTitle}>
                          {spec.title}
                        </h3>
                        {spec.desc?.trim() ? (
                          <p className={styles.equipmentCategoryPage__specDesc}>
                            {spec.desc}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null}

            {backLabel ? (
              <div className={styles.equipmentCategoryPage__footer}>
                <div className={styles.equipmentCategoryPage__footerInner}>
                  <Link
                    href={`/${lang}/equipment`}
                    className={styles.equipmentCategoryPage__back}
                  >
                    {backLabel}
                  </Link>
                </div>
              </div>
            ) : null}
          </>
        )}

        <SiteContactStrip lang={lang} map={homeMap} isLoading={isLoading} />
        <SiteLeadForm
          map={homeMap}
          isLoading={isLoading}
          source="equipment-category"
          lang={lang}
        />
      </article>
    </SiteChrome>
  );
}
