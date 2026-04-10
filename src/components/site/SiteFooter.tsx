"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { parseJsonArray } from "@/lib/contentUtils";
import type { FooterColumn, NavItem } from "@/types/site";
import styles from "./SiteFooter.module.scss";

interface SiteFooterProps {
  lang: string;
  map: Record<string, string>;
  isLoading: boolean;
}

function buildHref(lang: string, href: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }
  if (href.startsWith("#")) {
    return `/${lang}${href}`;
  }
  return href;
}

function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function SiteFooter({ lang, map, isLoading }: SiteFooterProps) {
  const brand = map["home.header.logoText"] ?? "Datacom";
  const tagline = map["home.footer.tagline"] ?? "";
  const phone = map["home.footer.phone"] ?? "";
  const phoneNote = map["home.footer.phoneNote"] ?? "";
  const email = map["home.footer.email"] ?? "";
  const emailNote = map["home.footer.emailNote"] ?? "";
  const copyright = map["home.footer.copyright"] ?? "";
  const columns = parseJsonArray<FooterColumn>(
    map["home.footer.columns"] ?? "[]",
    []
  );
  const telHref = `tel:+${phone.replace(/\D/g, "")}`;

  const renderLink = (link: NavItem) => {
    const href = buildHref(lang, link.href);
    if (isExternal(link.href)) {
      return (
        <a
          key={link.label}
          href={href}
          className={styles.siteFooter__colLink}
          rel="noopener noreferrer"
          target="_blank"
        >
          {link.label}
        </a>
      );
    }
    return (
      <Link
        key={link.label}
        href={href}
        className={styles.siteFooter__colLink}
      >
        {link.label}
      </Link>
    );
  };

  if (isLoading) {
    return (
      <footer className={styles.siteFooter} aria-busy="true">
        <div className={styles.siteFooter__inner}>
          <Skeleton variant="text" />
        </div>
      </footer>
    );
  }

  return (
    <footer className={styles.siteFooter} id="contacts">
      <div className={styles.siteFooter__inner}>
        <div className={styles.siteFooter__top}>
          <div>
            <p className={styles.siteFooter__brand}>{brand}</p>
            <p className={styles.siteFooter__tagline}>{tagline}</p>
          </div>
          <div className={styles.siteFooter__contacts}>
            <div>
              <a className={styles.siteFooter__phone} href={telHref}>
                {phone}
              </a>
              <p className={styles.siteFooter__phoneNote}>{phoneNote}</p>
            </div>
            <div>
              <a className={styles.siteFooter__email} href={`mailto:${email}`}>
                {email}
              </a>
              <p className={styles.siteFooter__emailNote}>{emailNote}</p>
            </div>
          </div>
        </div>

        <div className={styles.siteFooter__columns}>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className={styles.siteFooter__colTitle}>{col.title}</h3>
              <ul className={styles.siteFooter__colList}>
                {col.links.map((link) => (
                  <li key={link.label + link.href}>{renderLink(link)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.siteFooter__bottom}>{copyright}</div>
      </div>
    </footer>
  );
}
