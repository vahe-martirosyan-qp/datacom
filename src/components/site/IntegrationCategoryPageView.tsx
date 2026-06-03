"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { buildLocalizedHref, entriesToMap, parseJsonArray } from "@/lib/contentUtils";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useIntegrationCategoryContentQuery } from "@/hooks/useIntegrationCategoryContentQuery";
import { useIntegrationsContentQuery } from "@/hooks/useIntegrationsContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import type { EquipmentSpecItem } from "@/types/site";
import { SiteChrome } from "./SiteChrome";
import { SiteContactStrip } from "./SiteContactStrip";
import { SiteLeadForm } from "./SiteLeadForm";
import styles from "./IntegrationCategoryPageView.module.scss";

interface IntegrationCategoryPageViewProps {
  lang: string;
  categorySlug: string;
}

function nonEmptyLines(items: string[]): string[] {
  return items.map((s) => s.trim()).filter(Boolean);
}

export function IntegrationCategoryPageView({
  lang,
  categorySlug,
}: IntegrationCategoryPageViewProps) {
  const homeQuery = useHomeContentQuery(lang);
  const integrationsQuery = useIntegrationsContentQuery(lang);
  const categoryQuery = useIntegrationCategoryContentQuery(lang, categorySlug);
  const languagesQuery = useLanguagesQuery();

  const homeMap = useMemo(
    () => (homeQuery.data ? entriesToMap(homeQuery.data.entries) : {}),
    [homeQuery.data]
  );

  const integrationsMap = useMemo(
    () =>
      integrationsQuery.data
        ? entriesToMap(integrationsQuery.data.entries)
        : {},
    [integrationsQuery.data]
  );

  const map = useMemo(
    () => (categoryQuery.data ? entriesToMap(categoryQuery.data.entries) : {}),
    [categoryQuery.data]
  );

  const prefix = `integration.${categorySlug}`;
  const eyebrow = map[`${prefix}.eyebrow`]?.trim() ?? "";
  const title = map[`${prefix}.title`]?.trim() ?? "";
  const subtitle = map[`${prefix}.subtitle`]?.trim() ?? "";
  const heroImage = map[`${prefix}.heroImage`]?.trim() ?? "";
  const bodyHtml = map[`${prefix}.bodyHtml`]?.trim() ?? "";
  const highlights = nonEmptyLines(
    parseJsonArray<string>(map[`${prefix}.highlights`] ?? "[]", [])
  );
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
    integrationsQuery.isLoading ||
    categoryQuery.isLoading ||
    languagesQuery.isLoading;

  const homeLabel = homeMap["home.header.logoText"]?.trim() || "Home";
  const integrationsIndexLabel =
    integrationsMap["page.integrations.title"]?.trim() || "";
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
        homeQuery.isError ||
        integrationsQuery.isError ||
        categoryQuery.isError
      }
    >
      <article
        key={`${lang}-${categorySlug}`}
        className={styles.integrationCategoryPage}
        lang={lang}
      >
        {isLoading ? (
          <div className={styles.integrationCategoryPage__loading}>
            <Skeleton variant="title" />
            <Skeleton variant="image" />
            <Skeleton variant="text" />
          </div>
        ) : (
          <>
            <header className={styles.integrationCategoryPage__hero}>
              {heroImage ? (
                <div
                  className={styles.integrationCategoryPage__heroBg}
                  aria-hidden
                >
                  <Image
                    src={heroImage}
                    alt=""
                    fill
                    className={styles.integrationCategoryPage__heroBgImg}
                    sizes="100vw"
                    priority
                  />
                </div>
              ) : null}
              <div className={styles.integrationCategoryPage__heroInner}>
                <nav
                  className={styles.integrationCategoryPage__crumb}
                  aria-label="Breadcrumb"
                >
                  <Link
                    href={`/${lang}`}
                    className={styles.integrationCategoryPage__crumbLink}
                  >
                    {homeLabel}
                  </Link>
                  {integrationsIndexLabel ? (
                    <>
                      <span aria-hidden> / </span>
                      <Link
                        href={`/${lang}/integrations`}
                        className={styles.integrationCategoryPage__crumbLink}
                      >
                        {integrationsIndexLabel}
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
                  <span className={styles.integrationCategoryPage__eyebrow}>
                    {eyebrow}
                  </span>
                ) : null}
                {title ? (
                  <h1 className={styles.integrationCategoryPage__title}>
                    {title}
                  </h1>
                ) : null}
                {subtitle ? (
                  <p className={styles.integrationCategoryPage__subtitle}>
                    {subtitle}
                  </p>
                ) : null}

                {highlights.length > 0 ? (
                  <ul className={styles.integrationCategoryPage__highlights}>
                    {highlights.map((line) => (
                      <li
                        key={line}
                        className={styles.integrationCategoryPage__highlight}
                      >
                        <span
                          className={
                            styles.integrationCategoryPage__highlightMark
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
              <section className={styles.integrationCategoryPage__section}>
                <div className={styles.integrationCategoryPage__sectionInner}>
                  <div
                    className={styles.integrationCategoryPage__body}
                    dangerouslySetInnerHTML={{ __html: bodyHtml }}
                  />
                </div>
              </section>
            ) : null}

            {showCta || showPdf ? (
              <section
                className={`${styles.integrationCategoryPage__section} ${styles["integrationCategoryPage__section--compact"]}`}
              >
                <div className={styles.integrationCategoryPage__sectionInner}>
                  <div className={styles.integrationCategoryPage__actions}>
                    {showCta ? (
                      <Link
                        href={ctaHref}
                        className={styles.integrationCategoryPage__cta}
                      >
                        {ctaLabel}
                        <span aria-hidden>↗</span>
                      </Link>
                    ) : null}
                    {showPdf ? (
                      <a
                        href={pdfHref}
                        className={styles.integrationCategoryPage__pdf}
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

            {specs.length > 0 ? (
              <section className={styles.integrationCategoryPage__section}>
                <div className={styles.integrationCategoryPage__sectionInner}>
                  {specsTitle ? (
                    <h2
                      className={styles.integrationCategoryPage__sectionTitle}
                    >
                      {specsTitle}
                    </h2>
                  ) : null}
                  <ul className={styles.integrationCategoryPage__specs}>
                    {specs.map((spec) => (
                      <li
                        key={spec.title}
                        className={styles.integrationCategoryPage__spec}
                      >
                        <h3
                          className={styles.integrationCategoryPage__specTitle}
                        >
                          {spec.title}
                        </h3>
                        {spec.desc?.trim() ? (
                          <p
                            className={styles.integrationCategoryPage__specDesc}
                          >
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
              <div className={styles.integrationCategoryPage__footer}>
                <div className={styles.integrationCategoryPage__footerInner}>
                  <Link
                    href={`/${lang}/integrations`}
                    className={styles.integrationCategoryPage__back}
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
          source="integration-category"
          lang={lang}
        />
      </article>
    </SiteChrome>
  );
}
