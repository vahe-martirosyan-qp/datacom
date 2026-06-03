"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  buildLocalizedHref,
  entriesToMap,
  parseNavMegaMenu,
} from "@/lib/contentUtils";
import { findEquipmentMegaItem } from "@/lib/equipmentNavUtils";
import { useEquipmentContentQuery } from "@/hooks/useEquipmentContentQuery";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import type { NavItem } from "@/types/site";
import { SiteChrome } from "./SiteChrome";
import styles from "./EquipmentPageView.module.scss";

interface EquipmentPageViewProps {
  lang: string;
}

export function EquipmentPageView({ lang }: EquipmentPageViewProps) {
  const homeQuery = useHomeContentQuery(lang);
  const equipmentQuery = useEquipmentContentQuery(lang);
  const languagesQuery = useLanguagesQuery();

  const homeMap = useMemo(
    () => (homeQuery.data ? entriesToMap(homeQuery.data.entries) : {}),
    [homeQuery.data]
  );

  const equipmentMap = useMemo(
    () =>
      equipmentQuery.data ? entriesToMap(equipmentQuery.data.entries) : {},
    [equipmentQuery.data]
  );

  const languages = languagesQuery.data ?? [];
  const isLoading =
    homeQuery.isLoading ||
    equipmentQuery.isLoading ||
    languagesQuery.isLoading;
  const loadError = homeQuery.isError || equipmentQuery.isError;

  const homeLabel = homeMap["home.header.logoText"]?.trim() || "Home";
  const navItems = parseNavMegaMenu(homeMap);
  const equipmentNav = findEquipmentMegaItem(navItems);
  const categories = equipmentNav?.children ?? [];

  const title =
    equipmentMap["page.equipment.title"]?.trim() ||
    equipmentNav?.label?.trim() ||
    "Equipment";
  const subtitle =
    equipmentMap["page.equipment.subtitle"]?.trim() ||
    homeMap["home.stats.equipmentDesc"]?.trim() ||
    "";

  return (
    <SiteChrome
      lang={lang}
      map={homeMap}
      languages={languages}
      isLoading={isLoading}
      loadError={loadError}
    >
      <article className={styles.equipmentPage} lang={lang}>
        <header className={styles.equipmentPage__hero}>
          <div className={styles.equipmentPage__heroInner}>
            <nav className={styles.equipmentPage__crumb} aria-label="Breadcrumb">
              <Link
                href={`/${lang}`}
                className={styles.equipmentPage__crumbLink}
              >
                {homeLabel}
              </Link>
              <span aria-hidden> / </span>
              <span>{title}</span>
            </nav>

            {isLoading ? (
              <div className={styles.equipmentPage__loading}>
                <Skeleton variant="title" />
                <Skeleton variant="text" />
              </div>
            ) : (
              <>
                <h1 className={styles.equipmentPage__title}>{title}</h1>
                {subtitle ? (
                  <p className={styles.equipmentPage__subtitle}>{subtitle}</p>
                ) : null}
              </>
            )}
          </div>
        </header>

        <section className={styles.equipmentPage__gridSection} aria-label={title}>
          <div className={styles.equipmentPage__gridInner}>
            {isLoading ? (
              <ul className={styles.equipmentPage__grid}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <li key={i}>
                    <Skeleton variant="card" />
                  </li>
                ))}
              </ul>
            ) : categories.length > 0 ? (
              <ul className={styles.equipmentPage__grid}>
                {categories.map((cat: NavItem) => (
                  <li key={cat.label + cat.href} className={styles.equipmentPage__item}>
                    <EquipmentCategoryCard lang={lang} category={cat} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.equipmentPage__empty}>
                {lang === "ru"
                  ? "Категории скоро появятся."
                  : "Categories coming soon."}
              </p>
            )}
          </div>
        </section>
      </article>
    </SiteChrome>
  );
}

function EquipmentCategoryCard({
  lang,
  category,
}: {
  lang: string;
  category: NavItem;
}) {
  const hasImage = Boolean(category.imageUrl?.trim());
  const href = buildLocalizedHref(lang, category.href);
  const desc = category.desc?.trim() ?? "";

  return (
    <Link href={href} className={styles.equipmentPage__card}>
      <div className={styles.equipmentPage__cardMedia} aria-hidden={!hasImage}>
        {hasImage ? (
          <Image
            src={category.imageUrl ?? ""}
            alt=""
            fill
            className={styles.equipmentPage__cardImg}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className={styles.equipmentPage__cardPlaceholder} aria-hidden />
        )}
      </div>
      <div className={styles.equipmentPage__cardBody}>
        <h2 className={styles.equipmentPage__cardTitle}>{category.label}</h2>
        {desc ? (
          <p className={styles.equipmentPage__cardDesc}>{desc}</p>
        ) : null}
        <span className={styles.equipmentPage__cardArrow} aria-hidden>
          →
        </span>
      </div>
    </Link>
  );
}
