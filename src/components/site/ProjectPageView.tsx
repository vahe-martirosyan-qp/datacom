"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { entriesToMap, parseJsonArray } from "@/lib/contentUtils";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import { useProjectContentQuery } from "@/hooks/useProjectContentQuery";
import { SiteChrome } from "./SiteChrome";
import styles from "./ProjectPageView.module.scss";

interface ProjectPageViewProps {
  lang: string;
  slug: string;
}

export function ProjectPageView({ lang, slug }: ProjectPageViewProps) {
  const homeQuery = useHomeContentQuery(lang);
  const projectQuery = useProjectContentQuery(lang, slug);
  const languagesQuery = useLanguagesQuery();

  const homeMap = useMemo(
    () =>
      homeQuery.data ? entriesToMap(homeQuery.data.entries) : {},
    [homeQuery.data]
  );

  const map = useMemo(
    () =>
      projectQuery.data ? entriesToMap(projectQuery.data.entries) : {},
    [projectQuery.data]
  );

  const prefix = `project.${slug}`;
  const title = map[`${prefix}.title`] ?? "";
  const location = map[`${prefix}.location`] ?? "";
  const year = map[`${prefix}.year`] ?? "";
  const heroImage = map[`${prefix}.heroImage`]?.trim() ?? "";
  const bodyHtml = map[`${prefix}.bodyHtml`] ?? "";
  const equipment = parseJsonArray<string>(map[`${prefix}.equipment`] ?? "[]", []);
  const equipmentHeading = lang === "ru" ? "Оборудование" : "Equipment";

  const languages = languagesQuery.data ?? [];
  const isLoading =
    homeQuery.isLoading ||
    projectQuery.isLoading ||
    languagesQuery.isLoading;
  const homeLabel = homeMap["home.header.logoText"]?.trim() || "Home";
  const projectsLabel =
    homeMap["home.projects.sectionTitle"]?.trim() || "Projects";

  return (
    <SiteChrome
      lang={lang}
      map={homeMap}
      languages={languages}
      isLoading={isLoading}
      loadError={homeQuery.isError || projectQuery.isError}
    >
      <article
        key={`${lang}-${slug}`}
        className={styles.projectPage}
        lang={lang}
      >
        <div className={styles.projectPage__inner}>
          <nav className={styles.projectPage__crumb} aria-label="Breadcrumb">
            <Link href={`/${lang}`} className={styles.projectPage__crumbLink}>
              {homeLabel}
            </Link>
            <span aria-hidden> / </span>
            <Link
              href={`/${lang}/projects`}
              className={styles.projectPage__crumbLink}
            >
              {projectsLabel}
            </Link>
            <span aria-hidden> / </span>
            <span>{title || slug}</span>
          </nav>

          {isLoading ? (
            <div className={styles.projectPage__loading}>
              <Skeleton variant="title" />
              <Skeleton variant="image" />
              <Skeleton variant="text" />
            </div>
          ) : (
            <>
              <section
                className={styles.projectPage__heroSection}
                aria-labelledby="project-page-title"
              >
                {heroImage ? (
                  <div className={styles.projectPage__hero}>
                    <Image
                      src={heroImage}
                      alt=""
                      fill
                      className={styles.projectPage__heroImg}
                      sizes="(max-width: 960px) 100vw, 960px"
                      priority
                    />
                  </div>
                ) : null}
                <div className={styles.projectPage__intro}>
                  <h1
                    id="project-page-title"
                    className={styles.projectPage__title}
                  >
                    {title}
                  </h1>
                  {[location, year].filter(Boolean).length > 0 ? (
                    <p className={styles.projectPage__meta}>
                      {[location, year].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                </div>
              </section>

              {equipment.length > 0 ? (
                <section
                  className={styles.projectPage__equipment}
                  aria-label={equipmentHeading}
                >
                  <h2 className={styles.projectPage__equipmentTitle}>
                    {equipmentHeading}
                  </h2>
                  <ul className={styles.projectPage__equipmentList}>
                    {equipment.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {bodyHtml ? (
                <div
                  className={styles.projectPage__body}
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              ) : null}
            </>
          )}
        </div>
      </article>
    </SiteChrome>
  );
}
