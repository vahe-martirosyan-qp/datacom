import {
  equipmentProductContentPrefix,
  listEquipmentProductSlugsFromMaps,
  resolveEquipmentProductSlug,
} from "@/lib/equipmentProductHrefUtils";
import { resolveEquipmentCategorySlug } from "@/lib/equipmentHrefUtils";
import { parseJsonArray } from "@/lib/contentUtils";
import type { EquipmentProductItem } from "@/types/site";

/** Slugs from category «карточки» JSON (`equipment.{cat}.products`). */
export function productSlugsFromCategoryCardsJson(
  categorySlug: string,
  productsJson: string | undefined
): string[] {
  const cat = resolveEquipmentCategorySlug(categorySlug);
  if (!cat) {
    return [];
  }
  const items = parseJsonArray<EquipmentProductItem>(productsJson ?? "[]", []);
  const slugs = new Set<string>();
  for (const item of items) {
    const raw = item.slug?.trim();
    if (!raw) {
      continue;
    }
    const slug = resolveEquipmentProductSlug(raw);
    if (slug) {
      slugs.add(slug);
    }
  }
  return [...slugs].sort();
}

/** CMS product pages + slugs declared on category cards (admin product list). */
export function collectAdminCategoryProductSlugs(
  categorySlug: string,
  maps: Iterable<Record<string, string>>
): string[] {
  const cat = resolveEquipmentCategorySlug(categorySlug);
  if (!cat) {
    return [];
  }
  const mapList = [...maps];
  const merged = new Set(listEquipmentProductSlugsFromMaps(cat, mapList));
  for (const map of mapList) {
    for (const slug of productSlugsFromCategoryCardsJson(
      cat,
      map[`equipment.${cat}.products`]
    )) {
      merged.add(slug);
    }
  }
  return [...merged].sort();
}

export interface EquipmentCategoryProductCatalogEntry {
  slug: string;
  title: string;
  desc?: string;
  imageUrl: string;
}

function cardProductSlug(card: EquipmentProductItem): string | null {
  const raw = card.slug?.trim();
  return raw ? resolveEquipmentProductSlug(raw) : null;
}

function normalizeTitle(title: string): string {
  return title.trim().toLowerCase();
}

function catalogSlugMap(
  catalog: EquipmentCategoryProductCatalogEntry[]
): Map<string, EquipmentCategoryProductCatalogEntry> {
  const catalogBySlug = new Map<string, EquipmentCategoryProductCatalogEntry>();
  for (const entry of catalog) {
    const slug = resolveEquipmentProductSlug(entry.slug);
    if (slug) {
      catalogBySlug.set(slug, entry);
    }
  }
  return catalogBySlug;
}

/**
 * Products shown on a category page: only items with a detail page in this category.
 * CMS card order is preserved; cards without a matching product page are omitted.
 */
export function buildCategoryProductsForDisplay(
  cards: EquipmentProductItem[],
  catalog: EquipmentCategoryProductCatalogEntry[]
): EquipmentProductItem[] {
  const catalogBySlug = catalogSlugMap(catalog);
  if (catalogBySlug.size === 0) {
    return [];
  }

  const result: EquipmentProductItem[] = [];
  const seen = new Set<string>();

  for (const card of cards) {
    let slug = cardProductSlug(card);
    if (!slug) {
      const titleNorm = normalizeTitle(card.title);
      for (const [s, entry] of catalogBySlug) {
        if (normalizeTitle(entry.title) === titleNorm) {
          slug = s;
          break;
        }
      }
    }
    if (!slug || !catalogBySlug.has(slug) || seen.has(slug)) {
      continue;
    }
    const entry = catalogBySlug.get(slug)!;
    seen.add(slug);
    result.push({
      slug,
      title: card.title?.trim() || entry.title,
      desc: card.desc?.trim() || entry.desc,
      imageUrl: card.imageUrl?.trim() || entry.imageUrl,
      href: card.href,
    });
  }

  for (const [slug, entry] of catalogBySlug) {
    if (seen.has(slug)) {
      continue;
    }
    result.push({
      slug,
      title: entry.title,
      desc: entry.desc,
      imageUrl: entry.imageUrl,
    });
  }

  return result;
}

/** @deprecated Use buildCategoryProductsForDisplay — kept for reconcile slug backfill. */
export function mergeCategoryProductsWithCatalog(
  cards: EquipmentProductItem[],
  catalog: EquipmentCategoryProductCatalogEntry[]
): EquipmentProductItem[] {
  return buildCategoryProductsForDisplay(cards, catalog);
}

export function parseEquipmentCategoryProductCatalog(
  raw: string
): EquipmentCategoryProductCatalogEntry[] {
  return parseJsonArray<EquipmentCategoryProductCatalogEntry>(raw, []).filter(
    (e) =>
      Boolean(e.slug?.trim()) &&
      Boolean(e.title?.trim()) &&
      Boolean(e.imageUrl?.trim())
  );
}

export function buildEquipmentCategoryProductCatalogEntry(
  lang: string,
  categorySlug: string,
  productSlug: string,
  readValue: (langCode: string, key: string) => string | undefined
): EquipmentCategoryProductCatalogEntry | null {
  const slug = resolveEquipmentProductSlug(productSlug);
  if (!slug) {
    return null;
  }
  const prefix = equipmentProductContentPrefix(categorySlug, slug);
  const title =
    readValue(lang, `${prefix}.title`)?.trim() ||
    readValue("en", `${prefix}.title`)?.trim() ||
    slug;
  const desc =
    readValue(lang, `${prefix}.subtitle`)?.trim() ||
    readValue("en", `${prefix}.subtitle`)?.trim() ||
    undefined;
  let imageUrl = "";
  try {
    const imagesRaw =
      readValue(lang, `${prefix}.images`) ||
      readValue("en", `${prefix}.images`) ||
      "[]";
    const images = JSON.parse(imagesRaw) as { imageUrl?: string }[];
    imageUrl = images[0]?.imageUrl?.trim() ?? "";
  } catch {
    imageUrl = "";
  }
  if (!imageUrl) {
    imageUrl =
      readValue(lang, `equipment.${categorySlug}.heroImage`)?.trim() ||
      readValue("en", `equipment.${categorySlug}.heroImage`)?.trim() ||
      "";
  }
  if (!title || !imageUrl) {
    return null;
  }
  return { slug, title, desc, imageUrl };
}
