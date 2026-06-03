"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  entriesToMap,
  parseJsonArray,
} from "@/lib/contentUtils";
import { useBlogContentQuery } from "@/hooks/useBlogContentQuery";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import type { BlogTeaserPost } from "@/types/site";
import { SiteChrome } from "./SiteChrome";
import { SiteBlogPostCard } from "./SiteBlogPostCard";
import styles from "./BlogPageView.module.scss";

const BLOG_PAGE_INITIAL = 10;
const BLOG_PAGE_STEP = 10;

interface BlogPageViewProps {
  lang: string;
}

export function BlogPageView({ lang }: BlogPageViewProps) {
  const homeQuery = useHomeContentQuery(lang);
  const blogQuery = useBlogContentQuery(lang);
  const languagesQuery = useLanguagesQuery();

  const homeMap = useMemo(
    () => (homeQuery.data ? entriesToMap(homeQuery.data.entries) : {}),
    [homeQuery.data]
  );

  const blogMap = useMemo(
    () => (blogQuery.data ? entriesToMap(blogQuery.data.entries) : {}),
    [blogQuery.data]
  );

  const languages = languagesQuery.data ?? [];
  const isLoading =
    homeQuery.isLoading || blogQuery.isLoading || languagesQuery.isLoading;
  const loadError = homeQuery.isError || blogQuery.isError;

  const homeLabel = homeMap["home.header.logoText"]?.trim() || "Home";
  const title = blogMap["page.blog.title"]?.trim() || "Blog";
  const subtitle = blogMap["page.blog.subtitle"]?.trim() || "";
  const loadMoreLabel =
    blogMap["page.blog.loadMoreLabel"]?.trim() ||
    (lang === "ru" ? "Показать ещё" : "Show more");
  const posts = parseJsonArray<BlogTeaserPost>(
    blogMap["page.blog.posts"] ?? "[]",
    []
  );

  const [shownCount, setShownCount] = useState(BLOG_PAGE_INITIAL);

  useEffect(() => {
    setShownCount(BLOG_PAGE_INITIAL);
  }, [lang, posts.length]);

  const visiblePosts = useMemo(
    () => posts.slice(0, shownCount),
    [posts, shownCount]
  );

  const hasMore = shownCount < posts.length;

  return (
    <SiteChrome
      lang={lang}
      map={homeMap}
      languages={languages}
      isLoading={isLoading}
      loadError={loadError}
    >
      <article className={styles.blogPage} lang={lang}>
        <header className={styles.blogPage__hero}>
          <div className={styles.blogPage__heroInner}>
            <nav className={styles.blogPage__crumb} aria-label="Breadcrumb">
              <Link href={`/${lang}`} className={styles.blogPage__crumbLink}>
                {homeLabel}
              </Link>
              <span aria-hidden> / </span>
              <span>{title}</span>
            </nav>

            {isLoading ? (
              <div className={styles.blogPage__loading}>
                <Skeleton variant="title" />
                <Skeleton variant="text" />
              </div>
            ) : (
              <>
                <h1 className={styles.blogPage__title}>{title}</h1>
                {subtitle ? (
                  <p className={styles.blogPage__subtitle}>{subtitle}</p>
                ) : null}
              </>
            )}
          </div>
        </header>

        <section className={styles.blogPage__listSection} aria-label={title}>
          <div className={styles.blogPage__listInner}>
            {isLoading ? (
              <ul className={styles.blogPage__skeletonGrid}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <li key={i}>
                    <Skeleton variant="card" />
                  </li>
                ))}
              </ul>
            ) : posts.length > 0 ? (
              <>
                <ul className={styles.blogPage__list}>
                  {visiblePosts.map((post) => (
                    <li
                      key={post.title + post.href}
                      className={styles.blogPage__listItem}
                    >
                      <SiteBlogPostCard
                        lang={lang}
                        post={post}
                        variant="teaser"
                      />
                    </li>
                  ))}
                </ul>
                {hasMore ? (
                  <div className={styles.blogPage__moreWrap}>
                    <button
                      type="button"
                      className={styles.blogPage__showMore}
                      onClick={() =>
                        setShownCount((n) =>
                          Math.min(n + BLOG_PAGE_STEP, posts.length)
                        )
                      }
                    >
                      {loadMoreLabel}
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <p className={styles.blogPage__empty}>
                {lang === "ru"
                  ? "Публикации скоро появятся."
                  : "Articles coming soon."}
              </p>
            )}
          </div>
        </section>
      </article>
    </SiteChrome>
  );
}
