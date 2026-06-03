"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  acceptAllCookies,
  COOKIE_SETTINGS_OPEN_EVENT,
  readCookieConsent,
  rejectNonEssentialCookies,
  writeCookieConsent,
  type CookieConsentPreferences,
} from "@/lib/cookieConsent";
import { parseCookieConsentCopy } from "@/lib/cookieConsentCopy";
import { lockPageScroll } from "@/lib/lockPageScroll";
import styles from "./SiteCookieConsent.module.scss";

interface SiteCookieConsentProps {
  lang: string;
  map: Record<string, string>;
}

export function SiteCookieConsent({ lang, map }: SiteCookieConsentProps) {
  const copy = parseCookieConsentCopy(map, lang);
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<CookieConsentPreferences | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(false);
  const [marketingOn, setMarketingOn] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = readCookieConsent();
    setConsent(stored);
    if (stored) {
      setAnalyticsOn(stored.analytics);
      setMarketingOn(stored.marketing);
    }
  }, []);

  const openSettings = useCallback(() => {
    const stored = readCookieConsent();
    if (stored) {
      setAnalyticsOn(stored.analytics);
      setMarketingOn(stored.marketing);
    }
    setSettingsOpen(true);
  }, []);

  useEffect(() => {
    if (!settingsOpen) {
      return;
    }
    return lockPageScroll();
  }, [settingsOpen]);

  useEffect(() => {
    const onOpenSettings = () => {
      openSettings();
    };
    window.addEventListener(COOKIE_SETTINGS_OPEN_EVENT, onOpenSettings);
    return () => {
      window.removeEventListener(COOKIE_SETTINGS_OPEN_EVENT, onOpenSettings);
    };
  }, [openSettings]);

  const applyConsent = useCallback((next: CookieConsentPreferences) => {
    setConsent(next);
    setAnalyticsOn(next.analytics);
    setMarketingOn(next.marketing);
    setSettingsOpen(false);
  }, []);

  if (!copy || !mounted) {
    return null;
  }

  const showBanner = !consent;

  const savePreferences = () => {
    applyConsent(writeCookieConsent({ analytics: analyticsOn, marketing: marketingOn }));
  };

  const settingsPanel = settingsOpen ? (
    <div
      className={styles.siteCookieConsent__panel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-settings-title"
      onClick={() => setSettingsOpen(false)}
    >
      <div
        className={styles.siteCookieConsent__dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="cookie-consent-settings-title"
          className={styles.siteCookieConsent__title}
        >
          {copy.settingsTitle}
        </h2>
        {copy.settingsIntro ? (
          <p className={styles.siteCookieConsent__intro}>{copy.settingsIntro}</p>
        ) : null}

        <div className={styles.siteCookieConsent__category}>
          <div className={styles.siteCookieConsent__categoryHead}>
            <h3 className={styles.siteCookieConsent__categoryTitle}>
              {copy.essentialTitle}
            </h3>
            <span className={styles.siteCookieConsent__alwaysOn}>
              {copy.alwaysOnLabel}
            </span>
          </div>
          {copy.essentialDesc ? (
            <p className={styles.siteCookieConsent__categoryDesc}>
              {copy.essentialDesc}
            </p>
          ) : null}
        </div>

        <div className={styles.siteCookieConsent__category}>
          <div className={styles.siteCookieConsent__categoryHead}>
            <h3 className={styles.siteCookieConsent__categoryTitle}>
              {copy.analyticsTitle}
            </h3>
            <label className={styles.siteCookieConsent__toggle}>
              <input
                type="checkbox"
                checked={analyticsOn}
                onChange={(e) => setAnalyticsOn(e.target.checked)}
              />
              <span />
            </label>
          </div>
          {copy.analyticsDesc ? (
            <p className={styles.siteCookieConsent__categoryDesc}>
              {copy.analyticsDesc}
            </p>
          ) : null}
        </div>

        <div className={styles.siteCookieConsent__category}>
          <div className={styles.siteCookieConsent__categoryHead}>
            <h3 className={styles.siteCookieConsent__categoryTitle}>
              {copy.marketingTitle}
            </h3>
            <label className={styles.siteCookieConsent__toggle}>
              <input
                type="checkbox"
                checked={marketingOn}
                onChange={(e) => setMarketingOn(e.target.checked)}
              />
              <span />
            </label>
          </div>
          {copy.marketingDesc ? (
            <p className={styles.siteCookieConsent__categoryDesc}>
              {copy.marketingDesc}
            </p>
          ) : null}
        </div>

        <div className={styles.siteCookieConsent__panelActions}>
          <button
            type="button"
            className={`${styles.siteCookieConsent__btn} ${styles["siteCookieConsent__btn--primary"]}`}
            onClick={savePreferences}
          >
            {copy.saveLabel}
          </button>
          <button
            type="button"
            className={styles.siteCookieConsent__btn}
            onClick={() => setSettingsOpen(false)}
          >
            {lang === "ru" ? "Закрыть" : "Close"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {showBanner ? (
        <div
          className={styles.siteCookieConsent__banner}
          role="region"
          aria-label={copy.settingsTitle}
        >
          <p className={styles.siteCookieConsent__message}>{copy.message}</p>
          <Link href={copy.privacyHref} className={styles.siteCookieConsent__privacy}>
            {copy.privacyLabel}
          </Link>
          <div className={styles.siteCookieConsent__actions}>
            <button
              type="button"
              className={styles.siteCookieConsent__btn}
              onClick={openSettings}
            >
              {copy.settingsLabel}
            </button>
            <button
              type="button"
              className={styles.siteCookieConsent__btn}
              onClick={() => applyConsent(rejectNonEssentialCookies())}
            >
              {copy.rejectLabel}
            </button>
            <button
              type="button"
              className={`${styles.siteCookieConsent__btn} ${styles["siteCookieConsent__btn--primary"]}`}
              onClick={() => applyConsent(acceptAllCookies())}
            >
              {copy.acceptAllLabel}
            </button>
          </div>
        </div>
      ) : null}

      {settingsPanel}
    </>
  );
}
