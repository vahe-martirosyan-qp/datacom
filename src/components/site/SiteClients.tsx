"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { parseJsonArray } from "@/lib/contentUtils";
import styles from "./SiteClients.module.scss";

interface SiteClientsProps {
  map: Record<string, string>;
  isLoading: boolean;
}

export function SiteClients({ map, isLoading }: SiteClientsProps) {
  const title = map["home.clients.title"] ?? "";
  const subtitle = map["home.clients.subtitle"] ?? "";
  const brands = parseJsonArray<string>(map["home.clients.brands"] ?? "[]", []);

  if (isLoading) {
    return (
      <section className={styles.siteClients} aria-busy="true">
        <div className={styles.siteClients__inner}>
          <Skeleton variant="title" />
          <Skeleton variant="text" />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.siteClients} id="clients">
      <div className={styles.siteClients__inner}>
        <h2 className={styles.siteClients__title}>{title}</h2>
        <p className={styles.siteClients__subtitle}>{subtitle}</p>
        <ul className={styles.siteClients__brands}>
          {brands.map((name) => (
            <li key={name} className={styles.siteClients__brand}>
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
