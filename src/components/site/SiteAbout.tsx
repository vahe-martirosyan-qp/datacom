"use client";

import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { buildLocalizedHref } from "@/lib/contentUtils";
import styles from "./SiteAbout.module.scss";

interface SiteAboutProps {
  lang: string;
  map: Record<string, string>;
  isLoading: boolean;
}

export function SiteAbout({ lang, map, isLoading }: SiteAboutProps) {
  const title = map["home.about.title"] ?? "";
  const body = map["home.about.body"] ?? "";
  const counterValue = map["home.about.counterValue"] ?? "";
  const counterLabel = map["home.about.counterLabel"] ?? "";
  const imageUrl = map["home.about.imageUrl"] ?? "";
  const pdfLabel = map["home.about.pdfLabel"] ?? "";
  const pdfHref = map["home.about.pdfHref"] ?? "#";
  const companyLabel = map["home.about.companyCtaLabel"] ?? "";
  const companyHrefRaw = map["home.about.companyCtaHref"] ?? "company";
  const yearStart = map["home.about.timelineStart"] ?? "";
  const yearEnd = map["home.about.timelineEnd"] ?? "";

  const companyHref = companyHrefRaw.startsWith("http")
    ? companyHrefRaw
    : buildLocalizedHref(lang, companyHrefRaw);

  if (isLoading) {
    return (
      <section className={styles.siteAbout} id="about" aria-busy="true">
        <div className={styles.siteAbout__inner}>
          <div className={styles.siteAbout__content}>
            <Skeleton variant="title" />
            <Skeleton variant="text" />
          </div>
          <Skeleton variant="image" />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.siteAbout} id="about">
      <div className={styles.siteAbout__inner}>
        <div className={styles.siteAbout__content}>
          <h2 className={styles.siteAbout__title}>{title}</h2>
          <p className={styles.siteAbout__body}>{body}</p>

          <div className={styles.siteAbout__timeline}>
            <span className={styles.siteAbout__timelineYear}>{yearStart}</span>
            <span className={styles.siteAbout__timelineTrack} aria-hidden />
            <span className={styles.siteAbout__timelineYear}>{yearEnd}</span>
          </div>
          <p className={styles.siteAbout__timelineCaption}>
            {map["home.about.timelineCaption"] ?? ""}
          </p>

          <div className={styles.siteAbout__counter}>
            <span className={styles.siteAbout__counterValue}>
              {counterValue}
            </span>
            <p className={styles.siteAbout__counterLabel}>{counterLabel}</p>
          </div>

          <div className={styles.siteAbout__meta}>
            <a
              className={styles.siteAbout__metaLink}
              href={pdfHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.siteAbout__metaIcon} aria-hidden>
                ↓
              </span>
              {pdfLabel}
            </a>
            <Link className={styles.siteAbout__metaCta} href={companyHref}>
              {companyLabel}
              <span className={styles.siteAbout__metaArrow} aria-hidden>
                →
              </span>
            </Link>
          </div>
        </div>
        <figure className={styles.siteAbout__figure}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              className={styles.siteAbout__image}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          ) : null}
        </figure>
      </div>
    </section>
  );
}
