import { parseJsonArray } from "@/lib/contentUtils";
import type { EquipmentProductImage } from "@/types/site";

function isProductImage(value: unknown): value is EquipmentProductImage {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as EquipmentProductImage).imageUrl === "string"
  );
}

export function parseEquipmentProductImages(raw: string): EquipmentProductImage[] {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "[]") {
    return [];
  }

  const fromArray = parseJsonArray<EquipmentProductImage>(trimmed, [])
    .filter(isProductImage)
    .map((item) => ({
      imageUrl: item.imageUrl.trim(),
      alt: item.alt?.trim() || undefined,
    }))
    .filter((item) => item.imageUrl.length > 0);

  if (fromArray.length > 0) {
    return fromArray;
  }

  /** Legacy CMS value: a single image URL instead of a JSON array. */
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return [{ imageUrl: trimmed }];
  }

  return [];
}

export function serializeEquipmentProductImages(
  items: EquipmentProductImage[]
): string {
  return JSON.stringify(
    items
      .map((item) => ({
        imageUrl: item.imageUrl.trim(),
        alt: item.alt?.trim() || undefined,
      }))
      .filter((item) => item.imageUrl.length > 0)
  );
}
