"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  buildLocalizedHref,
  entriesToMap,
  parseJsonArray,
  parseNavMegaMenu,
} from "@/lib/contentUtils";
import { findIntegrationsMegaItem } from "@/lib/integrationsNavUtils";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useIntegrationsContentQuery } from "@/hooks/useIntegrationsContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import type { SpotlightCard } from "@/types/site";
import { SiteChrome } from "./SiteChrome";
import styles from "./IntegrationsPageView.module.scss";

interface IntegrationsPageViewProps {
  lang: string;
}

export function IntegrationsPageView({ lang }: IntegrationsPageViewProps) {
  const homeQuery = useHomeContentQuery(lang);
  const integrationsQuery = useIntegrationsContentQuery(lang);
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

  const languages = languagesQuery.data ?? [];
  const isLoading =
    homeQuery.isLoading ||
    integrationsQuery.isLoading ||
    languagesQuery.isLoading;
  const loadError = homeQuery.isError || integrationsQuery.isError;

  const homeLabel = homeMap["home.header.logoText"]?.trim() || "Home";
  const navItems = parseNavMegaMenu(homeMap);
  const integrationsNav = findIntegrationsMegaItem(navItems);

  const cmsItems = parseJsonArray<SpotlightCard>(
    integrationsMap["page.integrations.items"] ?? "[]",
    []
  );

  const navFallback: SpotlightCard[] = (integrationsNav?.children ?? []).map(
    (child) => ({
      title: child.label,
      desc: child.desc?.trim() ?? "",
      href: child.href,
      imageUrl: child.imageUrl,
    })
  );

  const services =
    cmsItems.length > 0
      ? cmsItems.filter((item) => item.title?.trim() && item.href?.trim())
      : navFallback;

  const title =
    integrationsMap["page.integrations.title"]?.trim() ||
    integrationsNav?.label?.trim() ||
    (lang === "ru" ? "Интеграции" : "Integrations");
  const subtitle =
    integrationsMap["page.integrations.subtitle"]?.trim() ||
    homeMap["home.stats.integrationsDesc"]?.trim() ||
    "";

  return (
    <SiteChrome
      lang={lang}
      map={homeMap}
      languages={languages}
      isLoading={isLoading}
      loadError={loadError}
    >
      <article className={styles.integrationsPage} lang={lang}>
        <header className={styles.integrationsPage__hero}>
          <div className={styles.integrationsPage__heroInner}>
            <nav
              className={styles.integrationsPage__crumb}
              aria-label="Breadcrumb"
            >
              <Link
                href={`/${lang}`}
                className={styles.integrationsPage__crumbLink}
              >
                {homeLabel}
              </Link>
              <span aria-hidden> / </span>
              <span>{title}</span>
            </nav>

            {isLoading ? (
              <div className={styles.integrationsPage__loading}>
                <Skeleton variant="title" />
                <Skeleton variant="text" />
              </div>
            ) : (
              <>
                <h1 className={styles.integrationsPage__title}>{title}</h1>
                {subtitle ? (
                  <p className={styles.integrationsPage__subtitle}>
                    {subtitle}
                  </p>
                ) : null}
              </>
            )}
          </div>
        </header>

        <section
          className={styles.integrationsPage__gridSection}
          aria-label={title}
        >
          <div className={styles.integrationsPage__gridInner}>
            {isLoading ? (
              <ul className={styles.integrationsPage__grid}>
                {[0, 1, 2, 3].map((i) => (
                  <li key={i}>
                    <Skeleton variant="card" />
                  </li>
                ))}
              </ul>
            ) : services.length > 0 ? (
              <ul className={styles.integrationsPage__grid}>
                {services.map((item) => (
                  <li
                    key={`${item.href}-${item.title}`}
                    className={styles.integrationsPage__item}
                  >
                    <IntegrationServiceCard lang={lang} item={item} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.integrationsPage__empty}>
                {lang === "ru"
                  ? "Услуги скоро появятся."
                  : "Services coming soon."}
              </p>
            )}
          </div>
        </section>
      </article>
    </SiteChrome>
  );
}

function IntegrationServiceCard({
  lang,
  item,
}: {
  lang: string;
  item: SpotlightCard;
}) {
  const href = buildLocalizedHref(lang, item.href);
  const desc = item.desc?.trim() ?? "";

  return (
    <Link href={href} className={styles.integrationsPage__card}>
      <div className={styles.integrationsPage__cardMedia} aria-hidden>
        <span className={styles.integrationsPage__cardArrow} aria-hidden>
          →
        </span>
      </div>
      <div className={styles.integrationsPage__cardContent}>
        <h2 className={styles.integrationsPage__cardTitle}>{item.title}</h2>
        {desc ? (
          <p className={styles.integrationsPage__cardDesc}>{desc}</p>
        ) : null}
      </div>
    </Link>
  );
}
