"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { entriesToMap, parseJsonArray } from "@/lib/contentUtils";
import { useCompanyContentQuery } from "@/hooks/useCompanyContentQuery";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import type { CompanyStatItem } from "@/types/site";
import { SiteChrome } from "./SiteChrome";
import { SiteClients } from "./SiteClients";
import { SiteContactStrip } from "./SiteContactStrip";
import { SiteLeadForm } from "./SiteLeadForm";
import styles from "./CompanyPageView.module.scss";

interface CompanyPageViewProps {
  lang: string;
}

export function CompanyPageView({ lang }: CompanyPageViewProps) {
  const homeQuery = useHomeContentQuery(lang);
  const companyQuery = useCompanyContentQuery(lang);
  const languagesQuery = useLanguagesQuery();

  const homeMap = useMemo(
    () => (homeQuery.data ? entriesToMap(homeQuery.data.entries) : {}),
    [homeQuery.data]
  );

  const companyMap = useMemo(
    () => (companyQuery.data ? entriesToMap(companyQuery.data.entries) : {}),
    [companyQuery.data]
  );

  const languages = languagesQuery.data ?? [];
  const isLoading =
    homeQuery.isLoading || companyQuery.isLoading || languagesQuery.isLoading;
  const loadError = homeQuery.isError || companyQuery.isError;

  const homeLabel = homeMap["home.header.logoText"]?.trim() || "Home";
  const title = companyMap["page.company.title"]?.trim() || "";
  const intro = companyMap["page.company.intro"]?.trim() || "";
  const yearStart = companyMap["page.company.timelineStart"]?.trim() || "";
  const yearEnd = companyMap["page.company.timelineEnd"]?.trim() || "";
  const stats = parseJsonArray<CompanyStatItem>(
    companyMap["page.company.stats"] ?? "[]",
    []
  );
  const bodyHtml = companyMap["page.company.bodyHtml"] ?? "";
  const pdfLabel = companyMap["page.company.pdfLabel"]?.trim() || "";
  const pdfHref = companyMap["page.company.pdfHref"]?.trim() || "";
  const heroImageUrl = companyMap["page.company.heroImageUrl"]?.trim() || "";

  return (
    <SiteChrome
      lang={lang}
      map={homeMap}
      languages={languages}
      isLoading={isLoading}
      loadError={loadError}
    >
      <article className={styles.companyPage} lang={lang}>
        <div className={styles.companyPage__heroBand}>
          <header className={styles.companyPage__hero}>
            <div className={styles.companyPage__heroInner}>
              <nav className={styles.companyPage__crumb} aria-label="Breadcrumb">
                <Link
                  href={`/${lang}`}
                  className={styles.companyPage__crumbLink}
                >
                  {homeLabel}
                </Link>
                <span aria-hidden> / </span>
                <span>{title || "Company"}</span>
              </nav>

              {isLoading ? (
                <div className={styles.companyPage__loading}>
                  <Skeleton variant="title" />
                  <Skeleton variant="text" />
                </div>
              ) : (
                <>
                  <h1 className={styles.companyPage__title}>{title}</h1>
                  {intro ? (
                    <p className={styles.companyPage__intro}>{intro}</p>
                  ) : null}
                  {yearStart && yearEnd ? (
                    <div className={styles.companyPage__timeline}>
                      <span className={styles.companyPage__timelineYear}>
                        {yearStart}
                      </span>
                      <span
                        className={styles.companyPage__timelineTrack}
                        aria-hidden
                      />
                      <span className={styles.companyPage__timelineYear}>
                        {yearEnd}
                      </span>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </header>

          {!isLoading && heroImageUrl ? (
            <div className={styles.companyPage__feature}>
              <Image
                className={styles.companyPage__featureImg}
                src={heroImageUrl}
                alt=""
                width={1280}
                height={640}
                sizes="100vw"
                priority
              />
            </div>
          ) : null}
        </div>

        {!isLoading && stats.length > 0 ? (
          <section className={styles.companyPage__stats} aria-label={title}>
            <div className={styles.companyPage__statsInner}>
              {stats.map((stat) => (
                <div key={stat.value + stat.label} className={styles.companyPage__stat}>
                  <span className={styles.companyPage__statValue}>
                    {stat.value}
                  </span>
                  <p className={styles.companyPage__statLabel}>{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {!isLoading ? (
          <section className={styles.companyPage__content}>
            <div className={styles.companyPage__contentInner}>
              {bodyHtml ? (
                <div
                  className={styles.companyPage__body}
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              ) : null}
              {pdfLabel && pdfHref ? (
                <a
                  className={styles.companyPage__pdf}
                  href={pdfHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.companyPage__pdfIcon} aria-hidden>
                    ↓
                  </span>
                  {pdfLabel}
                </a>
              ) : null}
            </div>
          </section>
        ) : null}

        <div className={styles.companyPage__clientsWrap}>
          <SiteClients
            map={homeMap}
            isLoading={isLoading}
            titleOverride={companyMap["page.company.clientsTitle"]}
            subtitleOverride={companyMap["page.company.clientsSubtitle"]}
          />
        </div>

        <SiteContactStrip lang={lang} map={homeMap} isLoading={isLoading} />
        <SiteLeadForm
          map={homeMap}
          isLoading={isLoading}
          source="company"
          lang={lang}
        />
      </article>
    </SiteChrome>
  );
}
