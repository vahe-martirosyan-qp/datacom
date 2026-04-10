"use client";

import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { buildLocalizedHref, parseJsonArray } from "@/lib/contentUtils";
import type { ProjectCardItem } from "@/types/site";
import styles from "./SiteProjectsTeaser.module.scss";

/** Max cards on the homepage; full list lives on `/[lang]/projects`. */
const HOME_PROJECTS_TEASER_LIMIT = 4;

interface SiteProjectsTeaserProps {
  lang: string;
  map: Record<string, string>;
  isLoading: boolean;
}

export function SiteProjectsTeaserCard({
  lang,
  item,
}: {
  lang: string;
  item: ProjectCardItem;
}) {
  const hasImage = Boolean(item.imageUrl?.trim());
  const href = item.href?.trim()
    ? buildLocalizedHref(lang, item.href.trim())
    : null;

  const body = (
    <>
      <div className={styles.siteProjectsTeaser__media} aria-hidden={hasImage}>
        {hasImage ? (
          <Image
            src={item.imageUrl}
            alt=""
            fill
            className={styles.siteProjectsTeaser__img}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className={styles.siteProjectsTeaser__placeholder} aria-hidden />
        )}
      </div>
      <div className={styles.siteProjectsTeaser__text}>
        <h3 className={styles.siteProjectsTeaser__cardTitle}>{item.title}</h3>
        {item.location?.trim() ? (
          <p className={styles.siteProjectsTeaser__location}>{item.location}</p>
        ) : null}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={styles.siteProjectsTeaser__card}>
        {body}
      </Link>
    );
  }

  return <article className={styles.siteProjectsTeaser__card}>{body}</article>;
}

export function SiteProjectsTeaser({
  lang,
  map,
  isLoading,
}: SiteProjectsTeaserProps) {
  const title = map["home.projects.sectionTitle"] ?? "";
  const ctaLabel = map["home.projects.ctaLabel"] ?? "";
  const ctaHrefRaw = map["home.projects.ctaHref"] ?? "projects";
  const href = buildLocalizedHref(lang, ctaHrefRaw);
  const allItems = parseJsonArray<ProjectCardItem>(
    map["projects.list"] ?? map["home.projects.items"] ?? "[]",
    []
  );
  const items = allItems.slice(0, HOME_PROJECTS_TEASER_LIMIT);

  if (isLoading) {
    return (
      <section className={styles.siteProjectsTeaser} id="projects" aria-busy="true">
        <div className={styles.siteProjectsTeaser__inner}>
          <div className={styles.siteProjectsTeaser__head}>
            <Skeleton variant="title" />
            <Skeleton variant="text" />
          </div>
          <div className={styles.siteProjectsTeaser__grid}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={styles.siteProjectsTeaser__skeletonCard}>
                <Skeleton variant="image" />
                <Skeleton variant="title" />
                <Skeleton variant="text" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.siteProjectsTeaser} id="projects">
      <div className={styles.siteProjectsTeaser__inner}>
        <div className={styles.siteProjectsTeaser__head}>
          <h2 className={styles.siteProjectsTeaser__title}>{title}</h2>
          {ctaLabel ? (
            <Link className={styles.siteProjectsTeaser__cta} href={href}>
              {ctaLabel}
              <span className={styles.siteProjectsTeaser__arrow} aria-hidden>
                →
              </span>
            </Link>
          ) : null}
        </div>

        {items.length > 0 ? (
          <div className={styles.siteProjectsTeaser__grid}>
            {items.map((item) => (
              <SiteProjectsTeaserCard
                key={`${item.title}-${item.imageUrl}-${item.href ?? ""}`}
                lang={lang}
                item={item}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
