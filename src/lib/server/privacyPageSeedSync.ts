import type { ContentEntry } from "@/types";
import { privacyPageSeedEntriesForLang } from "@/lib/server/privacyPageSeedContent";

const PRIVACY_KEYS = [
  "page.privacy.seo.title",
  "page.privacy.seo.description",
  "page.privacy.title",
  "page.privacy.intro",
  "page.privacy.updatedLabel",
  "page.privacy.updatedDate",
  "page.privacy.bodyHtml",
] as const;

function shouldApplySeedValue(
  langCode: string,
  key: (typeof PRIVACY_KEYS)[number],
  existingValue: string
): boolean {
  if (!existingValue.trim()) {
    return true;
  }
  if (langCode === "en") {
    return false;
  }
  const enValue =
    privacyPageSeedEntriesForLang("en")[key]?.value?.trim() ?? "";
  return existingValue.trim() === enValue;
}

/**
 * Ensures `page.privacy.*` exists for every locale with Datacom default copy.
 * Non-English buckets still showing English clone text are upgraded to RU/AR seeds.
 */
export function reconcilePrivacyPageSeeds(
  store: Record<string, Record<string, ContentEntry>>
): boolean {
  let changed = false;

  for (const langCode of Object.keys(store)) {
    const bucket = store[langCode];
    if (!bucket) {
      continue;
    }
    const seed = privacyPageSeedEntriesForLang(langCode);

    for (const key of PRIVACY_KEYS) {
      const seedEntry = seed[key];
      if (!seedEntry) {
        continue;
      }
      const existing = bucket[key];
      if (!existing) {
        bucket[key] = { ...seedEntry };
        changed = true;
        continue;
      }

      if (shouldApplySeedValue(langCode, key, existing.value)) {
        bucket[key] = { ...existing, value: seedEntry.value };
        changed = true;
      }
    }
  }

  return changed;
}
