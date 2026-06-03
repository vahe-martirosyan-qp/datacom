import { parseJsonArray } from "@/lib/contentUtils";
import type { ClientLogoItem } from "@/types/site";

function isLogoItem(value: unknown): value is ClientLogoItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as ClientLogoItem).imageUrl === "string"
  );
}

/** Parses `home.clients.brands` — supports legacy string[] (skipped on site) and logo objects. */
export function parseClientLogos(raw: string): ClientLogoItem[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    if (parsed.length > 0 && typeof parsed[0] === "string") {
      return [];
    }
    return parsed
      .filter(isLogoItem)
      .map((item) => ({
        imageUrl: item.imageUrl.trim(),
        alt: item.alt?.trim() || undefined,
      }))
      .filter((item) => item.imageUrl.length > 0);
  } catch {
    return [];
  }
}

export function isLegacyTextBrandsJson(raw: string): boolean {
  const first = parseJsonArray<unknown>(raw, [])[0];
  return typeof first === "string";
}
