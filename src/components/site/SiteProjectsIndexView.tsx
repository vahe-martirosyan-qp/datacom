"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { entriesToMap, parseJsonArray } from "@/lib/contentUtils";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import type { ProjectCardItem } from "@/types/site";
import { SiteChrome } from "./SiteChrome";
import { SiteProjectsTeaserCard } from "./SiteProjectsTeaser";
import styles from "./SiteProjectsIndexView.module.scss";

const PROJECTS_PAGE_INITIAL = 6;
const PROJECTS_PAGE_STEP = 6;

interface SiteProjectsIndexViewProps {
  lang: string;
}

export function SiteProjectsIndexView({ lang }: SiteProjectsIndexViewProps) {
  const contentQuery = useHomeContentQuery(lang);
  const languagesQuery = useLanguagesQuery();

  const map = useMemo(
    () =>
      contentQuery.data ? entriesToMap(contentQuery.data.entries) : {},
    [contentQuery.data]
  );

  const languages = languagesQuery.data ?? [];
  const isLoading = contentQuery.isLoading || languagesQuery.isLoading;
  const title = map["home.projects.sectionTitle"]?.trim() || "Projects";
  const homeLabel = map["home.header.logoText"]?.trim() || "Home";
  const items = parseJsonArray<ProjectCardItem>(
    map["projects.list"] ?? map["home.projects.items"] ?? "[]",
    []
  );

  const [shownCount, setShownCount] = useState(PROJECTS_PAGE_INITIAL);

  useEffect(() => {
    setShownCount(PROJECTS_PAGE_INITIAL);
  }, [lang, items.length]);

  const visibleItems = useMemo(
    () => items.slice(0, shownCount),
    [items, shownCount]
  );

  const hasMore = shownCount < items.length;

  return (
    <SiteChrome
      lang={lang}
      map={map}
      languages={languages}
      isLoading={isLoading}
      loadError={contentQuery.isError}
    >
      <main className={styles.siteProjectsIndex}>
        <div className={styles.siteProjectsIndex__inner}>
          <nav className={styles.siteProjectsIndex__crumb} aria-label="Breadcrumb">
            <Link href={`/${lang}`} className={styles.siteProjectsIndex__crumbLink}>
              {homeLabel}
            </Link>
            <span aria-hidden> / </span>
            <span>{title}</span>
          </nav>

          {isLoading ? (
            <>
              <Skeleton variant="title" />
              <div className={styles.siteProjectsIndex__skeletonGrid}>
                {[0, 1, 2].map((i) => (
                  <div key={i} className={styles.siteProjectsIndex__skeletonCard}>
                    <Skeleton variant="image" />
                    <Skeleton variant="title" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1 className={styles.siteProjectsIndex__title}>{title}</h1>
              {items.length > 0 ? (
                <>
                  <div className={styles.siteProjectsIndex__grid}>
                    {visibleItems.map((item) => (
                      <SiteProjectsTeaserCard
                        key={item.title + item.imageUrl + item.href}
                        lang={lang}
                        item={item}
                      />
                    ))}
                  </div>
                  {hasMore ? (
                    <div className={styles.siteProjectsIndex__moreWrap}>
                      <button
                        type="button"
                        className={styles.siteProjectsIndex__showMore}
                        onClick={() =>
                          setShownCount((n) =>
                            Math.min(n + PROJECTS_PAGE_STEP, items.length)
                          )
                        }
                      >
                        {lang === "ru" ? "Показать ещё" : "Show more"}
                      </button>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className={styles.siteProjectsIndex__empty}>
                  {lang === "ru"
                    ? "Проекты скоро появятся."
                    : "Projects coming soon."}
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </SiteChrome>
  );
}
