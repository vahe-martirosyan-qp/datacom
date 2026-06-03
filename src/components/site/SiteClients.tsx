"use client";

import Image from "next/image";
import { Skeleton } from "@/components/ui/Skeleton";
import { parseClientLogos } from "@/lib/clientLogosUtils";
import styles from "./SiteClients.module.scss";

interface SiteClientsProps {
  map: Record<string, string>;
  isLoading: boolean;
  /** Overrides `home.clients.title` on pages like `/company`. */
  titleOverride?: string;
  /** Overrides `home.clients.subtitle`. */
  subtitleOverride?: string;
}

export function SiteClients({
  map,
  isLoading,
  titleOverride,
  subtitleOverride,
}: SiteClientsProps) {
  const title = titleOverride ?? map["home.clients.title"] ?? "";
  const subtitle = subtitleOverride ?? map["home.clients.subtitle"] ?? "";
  const logos = parseClientLogos(map["home.clients.brands"] ?? "[]");

  if (isLoading) {
    return (
      <section className={styles.siteClients} aria-busy="true">
        <div className={styles.siteClients__inner}>
          <Skeleton variant="title" />
          <Skeleton variant="text" />
          <ul className={styles.siteClients__logos}>
            {Array.from({ length: 10 }, (_, i) => (
              <li key={i} className={styles.siteClients__logoItem}>
                <Skeleton variant="image" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.siteClients} id="clients">
      <div className={styles.siteClients__inner}>
        <h2 className={styles.siteClients__title}>{title}</h2>
        {subtitle ? (
          <p className={styles.siteClients__subtitle}>{subtitle}</p>
        ) : null}
        {logos.length > 0 ? (
          <ul className={styles.siteClients__logos}>
            {logos.map((logo, index) => (
              <li
                key={`${logo.imageUrl}-${index}`}
                className={styles.siteClients__logoItem}
              >
                <div className={styles.siteClients__logoFrame}>
                  <Image
                    className={styles.siteClients__logoImg}
                    src={logo.imageUrl}
                    alt={logo.alt ?? ""}
                    width={280}
                    height={112}
                    sizes="(max-width: 768px) 42vw, (max-width: 1024px) 28vw, 280px"
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
