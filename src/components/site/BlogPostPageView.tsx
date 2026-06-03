"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { entriesToMap, parseJsonArray } from "@/lib/contentUtils";
import { useBlogPostContentQuery } from "@/hooks/useBlogPostContentQuery";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import { SiteChrome } from "./SiteChrome";
import styles from "./BlogPostPageView.module.scss";

interface BlogPostPageViewProps {
  lang: string;
  blogSlug: string;
}

export function BlogPostPageView({ lang, blogSlug }: BlogPostPageViewProps) {
  const homeQuery = useHomeContentQuery(lang);
  const blogPostQuery = useBlogPostContentQuery(lang, blogSlug);
  const languagesQuery = useLanguagesQuery();

  const homeMap = useMemo(
    () => (homeQuery.data ? entriesToMap(homeQuery.data.entries) : {}),
    [homeQuery.data]
  );

  const map = useMemo(
    () =>
      blogPostQuery.data ? entriesToMap(blogPostQuery.data.entries) : {},
    [blogPostQuery.data]
  );

  const prefix = `blog.${blogSlug}`;
  const title = map[`${prefix}.title`] ?? "";
  const location = map[`${prefix}.location`] ?? "";
  const year = map[`${prefix}.year`] ?? "";
  const heroImage = map[`${prefix}.heroImage`]?.trim() ?? "";
  const bodyHtml = map[`${prefix}.bodyHtml`] ?? "";
  const equipment = parseJsonArray<string>(
    map[`${prefix}.equipment`] ?? "[]",
    []
  );

  const languages = languagesQuery.data ?? [];
  const isLoading =
    homeQuery.isLoading ||
    blogPostQuery.isLoading ||
    languagesQuery.isLoading;

  const homeLabel = homeMap["home.header.logoText"]?.trim() || "Home";
  const blogLabel =
    homeMap["page.blog.title"]?.trim() ||
    homeMap["home.blog.title"]?.trim() ||
    "Blog";
  const equipmentHeading =
    lang === "ru" ? "Поставленное оборудование:" : "Equipment supplied:";
  const yearLabel = lang === "ru" ? "Год поставки" : "Year";

  return (
    <SiteChrome
      lang={lang}
      map={homeMap}
      languages={languages}
      isLoading={isLoading}
      loadError={homeQuery.isError || blogPostQuery.isError}
    >
      <article
        key={`${lang}-${blogSlug}`}
        className={styles.blogPostPage}
        lang={lang}
      >
        <div className={styles.blogPostPage__heroBand}>
          <div className={styles.blogPostPage__heroInner}>
            <nav className={styles.blogPostPage__crumb} aria-label="Breadcrumb">
              <Link href={`/${lang}`} className={styles.blogPostPage__crumbLink}>
                {homeLabel}
              </Link>
              <span aria-hidden> / </span>
              <Link
                href={`/${lang}/blog`}
                className={styles.blogPostPage__crumbLink}
              >
                {blogLabel}
              </Link>
              <span aria-hidden> / </span>
              <span>{title || blogSlug}</span>
            </nav>

            {isLoading ? (
              <div className={styles.blogPostPage__loading}>
                <Skeleton variant="title" />
              </div>
            ) : (
              <header className={styles.blogPostPage__header}>
                <h1 className={styles.blogPostPage__title}>{title}</h1>
                {location ? (
                  <p className={styles.blogPostPage__location}>{location}</p>
                ) : null}
              </header>
            )}
          </div>
        </div>

        <div className={styles.blogPostPage__inner}>
          {isLoading ? (
            <div className={styles.blogPostPage__loading}>
              <Skeleton variant="image" />
              <Skeleton variant="text" />
            </div>
          ) : (
            <>
              {heroImage ? (
                <div className={styles.blogPostPage__hero}>
                  <Image
                    src={heroImage}
                    alt=""
                    fill
                    className={styles.blogPostPage__heroImg}
                    sizes="(max-width: 960px) 100vw, 960px"
                    priority
                  />
                </div>
              ) : null}

              {bodyHtml ? (
                <div
                  className={styles.blogPostPage__body}
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              ) : null}

              {equipment.length > 0 || year ? (
                <div className={styles.blogPostPage__footerBlock}>
                  {equipment.length > 0 ? (
                    <section
                      className={styles.blogPostPage__equipment}
                      aria-label={equipmentHeading}
                    >
                      <h2 className={styles.blogPostPage__equipmentTitle}>
                        {equipmentHeading}
                      </h2>
                      <ul className={styles.blogPostPage__equipmentList}>
                        {equipment.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                  {year ? (
                    <p className={styles.blogPostPage__year}>
                      {yearLabel}: {year}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
        </div>
      </article>
    </SiteChrome>
  );
}
