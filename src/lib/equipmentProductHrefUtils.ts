import { buildLocalizedHref } from "@/lib/contentUtils";
import {
  normalizeEquipmentCategorySlug,
  resolveEquipmentCategorySlug,
} from "@/lib/equipmentHrefUtils";
import type { EquipmentProductItem } from "@/types/site";

/** Slug for `equipment.product.{category}.{product}.*` keys. */
export function normalizeEquipmentProductSlug(raw: string): string | null {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
  if (!s || s.length > 96 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) {
    return null;
  }
  return s;
}

export function resolveEquipmentProductSlug(raw: string): string | null {
  let s = raw.trim();
  try {
    s = decodeURIComponent(s);
  } catch {
    return null;
  }
  return normalizeEquipmentProductSlug(s);
}

export function equipmentProductContentPrefix(
  categorySlug: string,
  productSlug: string
): string {
  return `equipment.product.${categorySlug}.${productSlug}`;
}

/** Product slugs with CMS keys under `equipment.product.{category}.*` in one or more maps. */
export function listEquipmentProductSlugsFromMaps(
  categorySlug: string,
  maps: Iterable<Record<string, string>>
): string[] {
  const cat = resolveEquipmentCategorySlug(categorySlug);
  if (!cat) {
    return [];
  }
  const fullPrefix = `equipment.product.${cat}.`;
  const slugs = new Set<string>();
  for (const map of maps) {
    for (const key of Object.keys(map)) {
      if (!key.startsWith(fullPrefix)) {
        continue;
      }
      const remainder = key.slice(fullPrefix.length);
      const dot = remainder.indexOf(".");
      if (dot <= 0) {
        continue;
      }
      const slug = resolveEquipmentProductSlug(remainder.slice(0, dot));
      if (slug) {
        slugs.add(slug);
      }
    }
  }
  return [...slugs].sort();
}

/** API/content `slug` param: `electronic-locks/omnitec-gaudi-fit-in`. */
export function parseEquipmentProductRouteSlug(
  composite: string
): { categorySlug: string; productSlug: string } | null {
  const parts = composite.split("/").filter(Boolean);
  if (parts.length !== 2) {
    return null;
  }
  const categorySlug = resolveEquipmentCategorySlug(parts[0] ?? "");
  const productSlug = resolveEquipmentProductSlug(parts[1] ?? "");
  if (!categorySlug || !productSlug) {
    return null;
  }
  return { categorySlug, productSlug };
}

export function equipmentProductPublicPath(
  categorySlug: string,
  productSlug: string
): string {
  return `equipment/${categorySlug}/${productSlug}`;
}

export function slugifyEquipmentProductTitle(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "product";
}

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

/** Link target for a solution card on a category page (product detail route). */
export function resolveEquipmentCategoryProductCardLink(
  lang: string,
  categorySlug: string,
  item: EquipmentProductItem
): { href: string; external: boolean } | null {
  const productSlug = item.slug?.trim()
    ? resolveEquipmentProductSlug(item.slug)
    : null;

  if (productSlug) {
    return {
      href: `/${lang}/equipment/${categorySlug}/${productSlug}`,
      external: false,
    };
  }

  const rawHref = item.href?.trim() ?? "";
  if (rawHref) {
    if (isExternalHref(rawHref)) {
      return { href: rawHref, external: true };
    }
    return { href: buildLocalizedHref(lang, rawHref), external: false };
  }

  return null;
}
