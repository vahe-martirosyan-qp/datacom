import type { ContentEntry } from "@/types";
import { cookieConsentSeedEntriesForLang } from "@/lib/server/cookieConsentSeedContent";

const LEGACY_PRIVACY_HREFS = new Set(["", "company", "contacts", "privacy"]);

/**
 * Fills missing cookie-banner keys and fixes legacy privacy link targets.
 */
export function reconcileCookieConsentSeeds(
  store: Record<string, Record<string, ContentEntry>>
): boolean {
  let changed = false;

  for (const langCode of Object.keys(store)) {
    const bucket = store[langCode];
    if (!bucket) {
      continue;
    }
    const seed = cookieConsentSeedEntriesForLang(langCode);

    for (const [key, seedEntry] of Object.entries(seed)) {
      const existing = bucket[key];
      if (!existing) {
        bucket[key] = { ...seedEntry };
        changed = true;
        continue;
      }

      const empty = !existing.value.trim();
      const legacyPrivacyHref =
        key === "global.cookies.privacyHref" &&
        LEGACY_PRIVACY_HREFS.has(existing.value.trim().toLowerCase());

      if (empty || legacyPrivacyHref) {
        bucket[key] = { ...existing, value: seedEntry.value };
        changed = true;
      }
    }
  }

  return changed;
}
