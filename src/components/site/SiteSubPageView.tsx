"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import { entriesToMap } from "@/lib/contentUtils";
import { titleFromSlugSegments } from "@/lib/slugTitle";
import { SiteChrome } from "./SiteChrome";
import styles from "./SiteSubPageView.module.scss";

interface SiteSubPageViewProps {
  lang: string;
  slug: string[];
}

export function SiteSubPageView({ lang, slug }: SiteSubPageViewProps) {
  const contentQuery = useHomeContentQuery(lang);
  const languagesQuery = useLanguagesQuery();
  const map = useMemo(
    () =>
      contentQuery.data ? entriesToMap(contentQuery.data.entries) : {},
    [contentQuery.data]
  );
  const languages = languagesQuery.data ?? [];
  const isLoading = contentQuery.isLoading || languagesQuery.isLoading;
  const heading = titleFromSlugSegments(slug);
  const homeLabel = map["home.header.logoText"]?.trim() || "Home";

  return (
    <SiteChrome
      lang={lang}
      map={map}
      languages={languages}
      isLoading={isLoading}
      loadError={contentQuery.isError}
    >
      <main className={styles.siteSubPage}>
        <div className={styles.siteSubPage__inner}>
          <nav className={styles.siteSubPage__crumb} aria-label="Breadcrumb">
            <Link href={`/${lang}`} className={styles.siteSubPage__crumbLink}>
              {homeLabel}
            </Link>
            <span aria-hidden> / </span>
            <span>{heading}</span>
          </nav>
          <h1 className={styles.siteSubPage__title}>{heading}</h1>
          <p className={styles.siteSubPage__lead}>
            This page is a placeholder. Replace with CMS-driven content or a
            dedicated route when you build out this section.
          </p>
        </div>
      </main>
    </SiteChrome>
  );
}
