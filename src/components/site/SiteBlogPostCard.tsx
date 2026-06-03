"use client";

import Image from "next/image";
import Link from "next/link";
import { buildLocalizedHref } from "@/lib/contentUtils";
import type { BlogTeaserPost } from "@/types/site";
import styles from "./SiteBlogPostCard.module.scss";

interface SiteBlogPostCardProps {
  lang: string;
  post: BlogTeaserPost;
  /** Homepage teaser grid vs full blog index row */
  variant?: "teaser" | "index";
}

export function SiteBlogPostCard({
  lang,
  post,
  variant = "teaser",
}: SiteBlogPostCardProps) {
  const hasImage = Boolean(post.imageUrl?.trim());
  const href = buildLocalizedHref(lang, post.href);
  const modifier =
    variant === "index"
      ? ` ${styles["siteBlogPostCard--index"]}`
      : ` ${styles["siteBlogPostCard--teaser"]}`;

  return (
    <Link
      href={href}
      className={`${styles.siteBlogPostCard}${modifier}`}
    >
      <div className={styles.siteBlogPostCard__media} aria-hidden={!hasImage}>
        {hasImage ? (
          <Image
            src={post.imageUrl ?? ""}
            alt=""
            fill
            className={styles.siteBlogPostCard__img}
            sizes={
              variant === "index"
                ? "(max-width: 768px) 100vw, 240px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
          />
        ) : (
          <div className={styles.siteBlogPostCard__placeholder} aria-hidden />
        )}
      </div>
      <div className={styles.siteBlogPostCard__body}>
        {post.meta ? (
          <span className={styles.siteBlogPostCard__meta}>{post.meta}</span>
        ) : null}
        <span className={styles.siteBlogPostCard__title}>{post.title}</span>
        <span className={styles.siteBlogPostCard__arrow} aria-hidden>
          →
        </span>
      </div>
    </Link>
  );
}
