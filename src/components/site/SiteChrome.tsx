"use client";

import type { ReactNode } from "react";
import type { Language } from "@/types";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import styles from "./HomePageView.module.scss";

interface SiteChromeProps {
  lang: string;
  map: Record<string, string>;
  languages: Language[];
  isLoading: boolean;
  loadError?: boolean;
  children: ReactNode;
}

export function SiteChrome({
  lang,
  map,
  languages,
  isLoading,
  loadError,
  children,
}: SiteChromeProps) {
  if (loadError) {
    return (
      <div className={styles.homePageView__error}>
        <p className={styles.homePageView__errorText}>
          Unable to load page content. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.homePageView}>
      <SiteHeader
        lang={lang}
        map={map}
        languages={languages}
        isLoading={isLoading}
      />
      {children}
      <SiteFooter lang={lang} map={map} isLoading={isLoading} />
    </div>
  );
}
