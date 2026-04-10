"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type KeyboardEvent } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  buildLocalizedHref,
  parseNavMegaMenu,
} from "@/lib/contentUtils";
import { pathAfterLocale } from "@/lib/languagePath";
import type { Language } from "@/types";
import type { NavItem, NavMegaItem } from "@/types/site";
import styles from "./SiteHeader.module.scss";

function buildNavHref(lang: string, href: string): string {
  return buildLocalizedHref(lang, href);
}

function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

interface SiteHeaderProps {
  lang: string;
  map: Record<string, string>;
  languages: Language[];
  isLoading: boolean;
}

export function SiteHeader({
  lang,
  map,
  languages,
  isLoading,
}: SiteHeaderProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const pathSuffix = pathAfterLocale(pathname);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const megaItems = parseNavMegaMenu(map);
  const phone = map["home.header.phone"] ?? "";
  const logoText = map["home.header.logoText"] ?? "";
  const cta = map["home.header.ctaConsult"] ?? "";
  const telHref = `tel:+${phone.replace(/\D/g, "")}`;

  const onLanguageChange = (nextCode: string) => {
    if (!nextCode || nextCode === lang) {
      return;
    }
    router.push(`/${nextCode}${pathSuffix}`, { scroll: false });
    setMobileOpen(false);
  };

  const renderChildLink = (
    link: NavItem,
    className: string,
    opts?: { onNavigate?: () => void }
  ) => {
    const href = buildNavHref(lang, link.href);
    const after = () => opts?.onNavigate?.();
    if (isExternal(link.href)) {
      return (
        <a
          key={link.label + link.href}
          href={href}
          className={className}
          rel="noopener noreferrer"
          target="_blank"
          onClick={after}
        >
          {link.label}
        </a>
      );
    }
    return (
      <Link key={link.label + link.href} href={href} className={className} onClick={after}>
        {link.label}
      </Link>
    );
  };

  const onKeyMenu = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setMobileOpen(false);
    }
  };

  const toggleMobileSub = (index: number) => {
    setMobileExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const renderDesktopItem = (item: NavMegaItem, index: number) => {
    const hasChildren = Boolean(item.children && item.children.length > 0);

    if (!hasChildren) {
      return (
        <li key={`${item.label}-${index}`} className={styles.siteHeader__megaRoot}>
          <div className={styles.siteHeader__megaTrigger}>
            {renderChildLink(item, styles.siteHeader__navLink)}
          </div>
        </li>
      );
    }

    return (
      <li key={`${item.label}-${index}`} className={styles.siteHeader__megaRoot}>
        <div className={styles.siteHeader__megaTrigger}>
          {renderChildLink(item, styles.siteHeader__navLink)}
          <span
            className={`${styles.siteHeader__chevron} u-headerChevron`}
            aria-hidden
          />
        </div>
        <div className={styles.siteHeader__mega}>
          <div className={styles.siteHeader__megaInner}>
            <p className={styles.siteHeader__megaTitle}>{item.label}</p>
            <div className={styles.siteHeader__megaGrid}>
              {item.children?.map((child) =>
                renderChildLink(
                  child,
                  `${styles.siteHeader__megaLink} u-rtlSlideEnd`
                )
              )}
            </div>
          </div>
        </div>
      </li>
    );
  };

  const languageSelect = (mobile?: boolean) => (
    <label
      className={`${styles.siteHeader__langField}${
        mobile ? ` ${styles.siteHeader__langFieldMobile}` : ""
      }`}
    >
      <span className={styles.siteHeader__langLabel}>Language</span>
      <select
        className={styles.siteHeader__langSelect}
        value={lang}
        disabled={languages.length === 0}
        onChange={(e) => onLanguageChange(e.target.value)}
        aria-label="Language"
        title={languages.find((l) => l.code === lang)?.code.toUpperCase() ?? ""}
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <header
      className={styles.siteHeader}
      data-site-header
      onKeyDown={onKeyMenu}
    >
      <div className={styles.siteHeader__inner}>
        <div className={styles.siteHeader__brand}>
          {isLoading ? (
            <Skeleton variant="title" />
          ) : (
            <Link className={styles.siteHeader__logo} href={`/${lang}`}>
              {logoText}
            </Link>
          )}
        </div>

        <nav className={styles.siteHeader__nav} aria-label="Primary">
          {isLoading ? (
            <Skeleton variant="text" />
          ) : (
            <ul className={styles.siteHeader__navList}>
              {megaItems.map((item, index) => renderDesktopItem(item, index))}
            </ul>
          )}
        </nav>

        <div className={styles.siteHeader__actions}>
          {languages.length === 0 && isLoading ? (
            <Skeleton variant="button" />
          ) : (
            <div className={styles.siteHeader__langDesktop}>
              {languageSelect(false)}
            </div>
          )}

          {isLoading ? (
            <Skeleton variant="button" />
          ) : (
            <>
              <a className={styles.siteHeader__phone} href={telHref}>
                {phone}
              </a>
              <Link
                className={styles.siteHeader__cta}
                href={buildLocalizedHref(lang, "contacts")}
              >
                {cta}
              </Link>
            </>
          )}

          <button
            type="button"
            className={`${styles.siteHeader__burger}${
              mobileOpen ? ` ${styles["siteHeader__burger--open"]}` : ""
            }`}
            aria-expanded={mobileOpen}
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className={styles.siteHeader__burgerLine} />
            <span className={styles.siteHeader__burgerLine} />
            <span className={styles.siteHeader__burgerLine} />
          </button>
        </div>
      </div>

      <div
        className={`${styles.siteHeader__mobile}${
          mobileOpen ? "" : ` ${styles["siteHeader__mobile--closed"]}`
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className={styles.siteHeader__mobileSheet}>
          <div className={styles.siteHeader__mobileHeader}>
            <button
              type="button"
              className={styles.siteHeader__mobileClose}
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <span className={styles.siteHeader__mobileCloseIcon} aria-hidden />
            </button>
          </div>
        <div className={styles.siteHeader__mobileTopBar}>
          {languageSelect(true)}
          <a className={styles.siteHeader__mobilePhone} href={telHref}>
            {phone}
          </a>
        </div>
        <ul className={styles.siteHeader__mobileList}>
          {megaItems.map((item, index) => {
            const hasChildren = Boolean(item.children?.length);
            if (!hasChildren) {
              return (
                <li key={`m-${item.label}`}>
                  {renderChildLink(item, styles.siteHeader__mobileLink, {
                    onNavigate: () => setMobileOpen(false),
                  })}
                </li>
              );
            }
            const open = Boolean(mobileExpanded[index]);
            return (
              <li key={`m-${item.label}`} className={styles.siteHeader__mobileRow}>
                <div className={styles.siteHeader__mobileTop}>
                  {renderChildLink(item, styles.siteHeader__mobileLink, {
                    onNavigate: () => setMobileOpen(false),
                  })}
                  <button
                    type="button"
                    className={styles.siteHeader__mobileToggle}
                    aria-expanded={open}
                    aria-label={open ? "Collapse" : "Expand"}
                    onClick={() => toggleMobileSub(index)}
                  >
                    {open ? "−" : "+"}
                  </button>
                </div>
                {open ? (
                  <ul className={styles.siteHeader__mobileSub}>
                    {item.children?.map((child) => (
                      <li key={child.label + child.href}>
                        {renderChildLink(
                          child,
                          `${styles.siteHeader__mobileSubLink} u-rtlSlideEnd`,
                          { onNavigate: () => setMobileOpen(false) }
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
        <div className={styles.siteHeader__mobileFooter}>
          <Link
            href={buildLocalizedHref(lang, "contacts")}
            className={styles.siteHeader__mobileCta}
            onClick={() => setMobileOpen(false)}
          >
            {cta}
          </Link>
        </div>
        </div>
      </div>
    </header>
  );
}
