"use client";

import Link from "next/link";
import { buildLocalizedHref, parseJsonArray } from "@/lib/contentUtils";
import type { BlogTeaserPost } from "@/types/site";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./SiteBlogTeaser.module.scss";

interface SiteBlogTeaserProps {
  lang: string;
  map: Record<string, string>;
  isLoading: boolean;
}

export function SiteBlogTeaser({
  lang,
  map,
  isLoading,
}: SiteBlogTeaserProps) {
  const title = map["home.blog.title"] ?? "";
  const subtitle = map["home.blog.subtitle"] ?? "";
  const ctaLabel = map["home.blog.ctaLabel"] ?? "";
  const ctaHrefRaw = map["home.blog.ctaHref"] ?? "blog";
  const posts = parseJsonArray<BlogTeaserPost>(
    map["home.blog.posts"] ?? "[]",
    []
  );
  const ctaHref = buildLocalizedHref(lang, ctaHrefRaw);

  if (isLoading) {
    return (
      <section className={styles.siteBlogTeaser} aria-busy="true">
        <div className={styles.siteBlogTeaser__inner}>
          <Skeleton variant="title" />
          <Skeleton variant="text" />
          <div className={styles.siteBlogTeaser__skeletonGrid}>
            <Skeleton variant="card" />
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.siteBlogTeaser} id="blog">
      <div className={styles.siteBlogTeaser__inner}>
        <header className={styles.siteBlogTeaser__header}>
          <h2 className={styles.siteBlogTeaser__title}>{title}</h2>
          {subtitle ? (
            <p className={styles.siteBlogTeaser__subtitle}>{subtitle}</p>
          ) : null}
        </header>

        {posts.length > 0 ? (
          <ul className={styles.siteBlogTeaser__list}>
            {posts.map((post) => (
              <li key={post.title + post.href}>
                <Link
                  href={buildLocalizedHref(lang, post.href)}
                  className={styles.siteBlogTeaser__card}
                >
                  {post.meta ? (
                    <span className={styles.siteBlogTeaser__meta}>
                      {post.meta}
                    </span>
                  ) : null}
                  <span className={styles.siteBlogTeaser__cardTitle}>
                    {post.title}
                  </span>
                  <span className={styles.siteBlogTeaser__cardArrow} aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {ctaLabel ? (
          <div className={styles.siteBlogTeaser__footer}>
            <Link href={ctaHref} className={styles.siteBlogTeaser__cta}>
              {ctaLabel}
              <span className={styles.siteBlogTeaser__ctaArrow} aria-hidden>
                →
              </span>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
