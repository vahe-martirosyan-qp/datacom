"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { buildLocalizedHref } from "@/lib/contentUtils";
import styles from "./SiteContactStrip.module.scss";

interface SiteContactStripProps {
  lang: string;
  map: Record<string, string>;
  isLoading: boolean;
}

export function SiteContactStrip({
  lang,
  map,
  isLoading,
}: SiteContactStripProps) {
  const title = map["home.contactStrip.title"] ?? "";
  const subtitle = map["home.contactStrip.subtitle"] ?? "";
  const ctaLabel = map["home.contactStrip.ctaLabel"] ?? "";
  const ctaHrefRaw = map["home.contactStrip.ctaHref"] ?? "#contacts";
  const phone = map["home.header.phone"] ?? "";
  const telHref = `tel:+${phone.replace(/\D/g, "")}`;
  const ctaHref = buildLocalizedHref(lang, ctaHrefRaw);

  if (isLoading) {
    return (
      <section className={styles.siteContactStrip} aria-busy="true">
        <div className={styles.siteContactStrip__inner}>
          <Skeleton variant="title" />
          <Skeleton variant="text" />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.siteContactStrip}>
      <div className={styles.siteContactStrip__inner}>
        <h2 className={styles.siteContactStrip__title}>{title}</h2>
        <p className={styles.siteContactStrip__subtitle}>{subtitle}</p>
        <a className={styles.siteContactStrip__phone} href={telHref}>
          {phone}
        </a>
        <div>
          <Link className={styles.siteContactStrip__cta} href={ctaHref}>
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
