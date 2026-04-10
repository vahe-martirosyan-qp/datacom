"use client";

import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { buildLocalizedHref } from "@/lib/contentUtils";
import styles from "./SiteHero.module.scss";

interface SiteHeroProps {
  lang: string;
  map: Record<string, string>;
  isLoading: boolean;
}

export function SiteHero({ lang, map, isLoading }: SiteHeroProps) {
  const title = map["home.hero.title"] ?? "";
  const subtitle = map["home.hero.subtitle"] ?? "";
  const ctaLabel = map["home.hero.ctaLabel"] ?? "";
  const ctaHrefRaw = map["home.hero.ctaHref"] ?? "contacts";
  const imageUrl = map["home.hero.imageUrl"] ?? "";
  const ctaHref = buildLocalizedHref(lang, ctaHrefRaw);

  if (isLoading) {
    return (
      <section className={styles.siteHero} aria-busy="true">
        <div className={styles.siteHero__inner}>
          <Skeleton variant="title" />
          <Skeleton variant="text" />
          <Skeleton variant="button" />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.siteHero} id="top">
      <div className={styles.siteHero__media} aria-hidden>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority
            className={styles.siteHero__image}
            sizes="100vw"
          />
        ) : null}
      </div>
      <div className={styles.siteHero__inner}>
        <h1 className={styles.siteHero__title}>{title}</h1>
        <p className={styles.siteHero__subtitle}>{subtitle}</p>
        <div className={styles.siteHero__actions}>
          <Link className={styles.siteHero__cta} href={ctaHref}>
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
