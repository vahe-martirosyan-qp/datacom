"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { parseJsonArray } from "@/lib/contentUtils";
import type { FeatureCard } from "@/types/site";
import styles from "./SiteFeatures.module.scss";

interface SiteFeaturesProps {
  map: Record<string, string>;
  isLoading: boolean;
}

export function SiteFeatures({ map, isLoading }: SiteFeaturesProps) {
  const title = map["home.features.title"] ?? "";
  const items = parseJsonArray<FeatureCard>(
    map["home.features.items"] ?? "[]",
    []
  );

  if (isLoading) {
    return (
      <section className={styles.siteFeatures} aria-busy="true">
        <div className={styles.siteFeatures__inner}>
          <Skeleton variant="title" />
          <div className={styles.siteFeatures__grid}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.siteFeatures__card}>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.siteFeatures} id="services">
      <div className={styles.siteFeatures__inner}>
        <h2 className={styles.siteFeatures__title}>{title}</h2>
        <div className={styles.siteFeatures__grid}>
          {items.map((item) => (
            <article key={item.title} className={styles.siteFeatures__card}>
              <h3 className={styles.siteFeatures__cardTitle}>{item.title}</h3>
              <p className={styles.siteFeatures__cardDesc}>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
