"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { entriesToMap } from "@/lib/contentUtils";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import { usePrivacyContentQuery } from "@/hooks/usePrivacyContentQuery";
import { SiteChrome } from "./SiteChrome";
import styles from "./PrivacyPageView.module.scss";

interface PrivacyPageViewProps {
  lang: string;
}

export function PrivacyPageView({ lang }: PrivacyPageViewProps) {
  const homeQuery = useHomeContentQuery(lang);
  const privacyQuery = usePrivacyContentQuery(lang);
  const languagesQuery = useLanguagesQuery();

  const homeMap = useMemo(
    () => (homeQuery.data ? entriesToMap(homeQuery.data.entries) : {}),
    [homeQuery.data]
  );

  const privacyMap = useMemo(
    () => (privacyQuery.data ? entriesToMap(privacyQuery.data.entries) : {}),
    [privacyQuery.data]
  );

  const languages = languagesQuery.data ?? [];
  const isLoading =
    homeQuery.isLoading || privacyQuery.isLoading || languagesQuery.isLoading;
  const loadError = homeQuery.isError || privacyQuery.isError;

  const homeLabel = homeMap["home.header.logoText"]?.trim() || "Home";
  const title = privacyMap["page.privacy.title"]?.trim() || "";
  const intro = privacyMap["page.privacy.intro"]?.trim() || "";
  const updatedLabel = privacyMap["page.privacy.updatedLabel"]?.trim() || "";
  const updatedDate = privacyMap["page.privacy.updatedDate"]?.trim() || "";
  const bodyHtml = privacyMap["page.privacy.bodyHtml"] ?? "";

  return (
    <SiteChrome
      lang={lang}
      map={homeMap}
      languages={languages}
      isLoading={isLoading}
      loadError={loadError}
    >
      <article className={styles.privacyPage} lang={lang}>
        <div className={styles.privacyPage__heroBand}>
          <header className={styles.privacyPage__hero}>
            <div className={styles.privacyPage__heroInner}>
              <nav className={styles.privacyPage__crumb} aria-label="Breadcrumb">
                <Link href={`/${lang}`} className={styles.privacyPage__crumbLink}>
                  {homeLabel}
                </Link>
                <span aria-hidden> / </span>
                <span>{title || "Privacy"}</span>
              </nav>

              {isLoading ? (
                <div className={styles.privacyPage__loading}>
                  <Skeleton variant="title" />
                  <Skeleton variant="text" />
                </div>
              ) : (
                <>
                  <h1 className={styles.privacyPage__title}>{title}</h1>
                  {intro ? (
                    <p className={styles.privacyPage__intro}>{intro}</p>
                  ) : null}
                  {updatedLabel && updatedDate ? (
                    <p className={styles.privacyPage__updated}>
                      <span className={styles.privacyPage__updatedLabel}>
                        {updatedLabel}
                      </span>{" "}
                      {updatedDate}
                    </p>
                  ) : null}
                </>
              )}
            </div>
          </header>
        </div>

        {!isLoading ? (
          <section className={styles.privacyPage__content}>
            <div className={styles.privacyPage__contentInner}>
              {bodyHtml ? (
                <div
                  className={styles.privacyPage__body}
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              ) : null}
            </div>
          </section>
        ) : null}
      </article>
    </SiteChrome>
  );
}
