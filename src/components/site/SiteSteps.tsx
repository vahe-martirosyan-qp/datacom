"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { parseJsonArray } from "@/lib/contentUtils";
import type { StepItem } from "@/types/site";
import styles from "./SiteSteps.module.scss";

interface SiteStepsProps {
  map: Record<string, string>;
  isLoading: boolean;
}

export function SiteSteps({ map, isLoading }: SiteStepsProps) {
  const title = map["home.steps.title"] ?? "";
  const items = parseJsonArray<StepItem>(map["home.steps.items"] ?? "[]", []);

  if (isLoading) {
    return (
      <section className={styles.siteSteps} aria-busy="true">
        <div className={styles.siteSteps__inner}>
          <Skeleton variant="title" />
          <ul className={styles.siteSteps__list}>
            {[0, 1, 2].map((i) => (
              <li key={i} className={styles.siteSteps__item}>
                <Skeleton variant="text" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.siteSteps}>
      <div className={styles.siteSteps__inner}>
        <h2 className={styles.siteSteps__title}>{title}</h2>
        <ol className={styles.siteSteps__list}>
          {items.map((item, index) => (
            <li key={item.title} className={styles.siteSteps__item}>
              <span className={styles.siteSteps__index}>{index + 1}</span>
              <h3 className={styles.siteSteps__itemTitle}>{item.title}</h3>
              <p className={styles.siteSteps__itemDesc}>{item.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
