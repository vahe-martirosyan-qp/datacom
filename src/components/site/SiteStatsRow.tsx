"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./SiteStatsRow.module.scss";

interface SiteStatsRowProps {
  map: Record<string, string>;
  isLoading: boolean;
}

export function SiteStatsRow({ map, isLoading }: SiteStatsRowProps) {
  const cards = [
    {
      id: "equipment",
      count: map["home.stats.equipmentCount"],
      label: map["home.stats.equipmentTitle"],
      desc: map["home.stats.equipmentDesc"],
    },
    {
      id: "hoteza",
      count: map["home.stats.hotezaCount"],
      label: map["home.stats.hotezaTitle"],
      desc: map["home.stats.hotezaDesc"],
    },
    {
      id: "integrations",
      count: map["home.stats.integrationCount"],
      label: map["home.stats.integrationTitle"],
      desc: map["home.stats.integrationDesc"],
    },
  ];

  if (isLoading) {
    return (
      <section className={styles.siteStatsRow} aria-busy="true">
        <div className={styles.siteStatsRow__inner}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.siteStatsRow__card}>
              <Skeleton variant="title" />
              <Skeleton variant="text" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.siteStatsRow}>
      <div className={styles.siteStatsRow__inner}>
        {cards.map((c) => (
          <article
            key={c.label}
            id={c.id}
            className={styles.siteStatsRow__card}
          >
            <span className={styles.siteStatsRow__count}>{c.count}</span>
            <h2 className={styles.siteStatsRow__label}>{c.label}</h2>
            <p className={styles.siteStatsRow__desc}>{c.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
