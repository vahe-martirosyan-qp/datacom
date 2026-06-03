import type { ContentEntry } from "@/types";

const UPLOAD_MARKERS = ["/uploads/", "vercel-storage.com", "blob.vercel-storage.com"];

function brandsRaw(bucket: Record<string, ContentEntry>): string {
  return bucket["home.clients.brands"]?.value?.trim() ?? "";
}

function scoreBrandsJson(raw: string): number {
  let score = raw.length;
  if (UPLOAD_MARKERS.some((m) => raw.includes(m))) {
    score += 1_000_000;
  }
  return score;
}

/**
 * Keeps `home.clients.brands` identical in every locale (logos are not translated).
 * When buckets differ, picks the variant that likely came from the admin (uploads, longer JSON).
 */
/** Keys whose media is shared across all CMS languages. */
export const SHARED_MEDIA_CONTENT_KEYS = [
  "home.clients.brands",
  "page.company.heroImageUrl",
] as const;

export function reconcileHomeClientBrandsAcrossLanguages(
  byLang: Record<string, Record<string, ContentEntry>>
): boolean {
  const codes = Object.keys(byLang);
  if (codes.length < 2) {
    return false;
  }

  const raws = codes
    .map((code) => brandsRaw(byLang[code] ?? {}))
    .filter((raw) => raw.length > 0);
  if (raws.length < 2) {
    return false;
  }

  const distinct = new Set(raws);
  if (distinct.size <= 1) {
    return false;
  }

  const canonical = raws.reduce((best, cur) =>
    scoreBrandsJson(cur) > scoreBrandsJson(best) ? cur : best
  );

  let changed = false;
  for (const code of codes) {
    const bucket = byLang[code];
    if (!bucket) {
      continue;
    }
    const entry = bucket["home.clients.brands"];
    if (!entry) {
      continue;
    }
    if (entry.value !== canonical) {
      bucket["home.clients.brands"] = { ...entry, value: canonical };
      changed = true;
    }
  }
  return changed;
}
