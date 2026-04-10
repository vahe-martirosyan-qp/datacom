"use client";

import Link from "next/link";
import { buildLocalizedHref, parseJsonArray } from "@/lib/contentUtils";
import type { SpotlightCard } from "@/types/site";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./SiteSpotlight.module.scss";

interface SiteSpotlightProps {
  lang: string;
  map: Record<string, string>;
  isLoading: boolean;
}

export function SiteSpotlight({ lang, map, isLoading }: SiteSpotlightProps) {
  const items = parseJsonArray<SpotlightCard>(
    map["home.spotlight.items"] ?? "[]",
    []
  );

  if (isLoading) {
    return (
      <section className={styles.siteSpotlight} aria-busy="true">
        <div className={styles.siteSpotlight__inner}>
          <div className={styles.siteSpotlight__grid}>
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.siteSpotlight} aria-label="Featured links">
      <div className={styles.siteSpotlight__inner}>
        <div className={styles.siteSpotlight__grid}>
          {items.map((item) => {
            const href = buildLocalizedHref(lang, item.href);
            const external =
              item.href.startsWith("http://") ||
              item.href.startsWith("https://");
            const inner = (
              <>
                <span className={styles.siteSpotlight__title}>{item.title}</span>
                {item.desc ? (
                  <span className={styles.siteSpotlight__desc}>{item.desc}</span>
                ) : null}
                <span className={styles.siteSpotlight__arrow} aria-hidden>
                  →
                </span>
              </>
            );
            return external ? (
              <a
                key={item.title + item.href}
                href={href}
                className={styles.siteSpotlight__card}
                target="_blank"
                rel="noopener noreferrer"
              >
                {inner}
              </a>
            ) : (
              <Link
                key={item.title + item.href}
                href={href}
                className={styles.siteSpotlight__card}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
