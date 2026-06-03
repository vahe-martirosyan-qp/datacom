export const COOKIE_CONSENT_STORAGE_KEY = "datacom_cookie_consent_v1";
export const COOKIE_CONSENT_VERSION = "1";
export const COOKIE_CONSENT_EVENT = "datacom:cookie-consent";
export const COOKIE_SETTINGS_OPEN_EVENT = "datacom:open-cookie-settings";

export function requestOpenCookieSettings(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_OPEN_EVENT));
}

export interface CookieConsentPreferences {
  version: string;
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

export function readCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as CookieConsentPreferences;
    if (parsed.version !== COOKIE_CONSENT_VERSION) {
      return null;
    }
    if (parsed.essential !== true) {
      return null;
    }
    return {
      version: COOKIE_CONSENT_VERSION,
      essential: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      updatedAt:
        typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeCookieConsent(
  prefs: Pick<CookieConsentPreferences, "analytics" | "marketing">
): CookieConsentPreferences {
  const state: CookieConsentPreferences = {
    version: COOKIE_CONSENT_VERSION,
    essential: true,
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(
      new CustomEvent(COOKIE_CONSENT_EVENT, { detail: state })
    );
  }
  return state;
}

export function hasCookieConsentChoice(): boolean {
  return readCookieConsent() !== null;
}

export function rejectNonEssentialCookies(): CookieConsentPreferences {
  return writeCookieConsent({ analytics: false, marketing: false });
}

export function acceptAllCookies(): CookieConsentPreferences {
  return writeCookieConsent({ analytics: true, marketing: true });
}
