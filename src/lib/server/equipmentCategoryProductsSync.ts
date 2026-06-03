import type { ContentEntry } from "@/types";
import type { EquipmentProductItem } from "@/types/site";
import { normalizeEquipmentCategorySlug } from "@/lib/equipmentHrefUtils";
import { resolveEquipmentProductSlug } from "@/lib/equipmentProductHrefUtils";
import {
  buildCategoryProductsForDisplay,
  buildEquipmentCategoryProductCatalogEntry,
  type EquipmentCategoryProductCatalogEntry,
} from "@/lib/equipmentCategoryProductsUtils";

function listProductSlugsInCategory(
  byLang: Record<string, Record<string, ContentEntry>>,
  categorySlug: string
): string[] {
  const prefix = `equipment.product.${categorySlug}.`;
  const slugs = new Set<string>();
  for (const bucket of Object.values(byLang)) {
    for (const key of Object.keys(bucket)) {
      if (!key.startsWith(prefix)) {
        continue;
      }
      const remainder = key.slice(prefix.length);
      const dot = remainder.indexOf(".");
      if (dot <= 0) {
        continue;
      }
      slugs.add(remainder.slice(0, dot));
    }
  }
  return [...slugs].sort();
}

function parseProductsJson(raw: string): EquipmentProductItem[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (row): row is EquipmentProductItem =>
        Boolean(row) &&
        typeof row === "object" &&
        typeof (row as EquipmentProductItem).title === "string" &&
        typeof (row as EquipmentProductItem).imageUrl === "string"
    );
  } catch {
    return [];
  }
}

function buildCatalogForCategory(
  byLang: Record<string, Record<string, ContentEntry>>,
  categorySlug: string,
  lang: string
): EquipmentCategoryProductCatalogEntry[] {
  const readValue = (langCode: string, key: string): string | undefined =>
    byLang[langCode]?.[key]?.value;

  const slugs = listProductSlugsInCategory(byLang, categorySlug);
  const catalog: EquipmentCategoryProductCatalogEntry[] = [];
  for (const productSlug of slugs) {
    const entry = buildEquipmentCategoryProductCatalogEntry(
      lang,
      categorySlug,
      productSlug,
      readValue
    );
    if (entry) {
      catalog.push(entry);
    }
  }
  return catalog;
}

export function collectCategorySlugsFromStore(
  byLang: Record<string, Record<string, ContentEntry>>
): string[] {
  const slugs = new Set<string>();
  for (const bucket of Object.values(byLang)) {
    for (const key of Object.keys(bucket)) {
      const m = key.match(/^equipment\.([^.]+)\.products$/);
      if (!m?.[1]) {
        continue;
      }
      const cat = normalizeEquipmentCategorySlug(m[1]);
      if (cat) {
        slugs.add(cat);
      }
    }
  }
  for (const cat of listProductSlugsFromProductKeys(byLang)) {
    slugs.add(cat);
  }
  return [...slugs].sort();
}

function listProductSlugsFromProductKeys(
  byLang: Record<string, Record<string, ContentEntry>>
): string[] {
  const cats = new Set<string>();
  for (const bucket of Object.values(byLang)) {
    for (const key of Object.keys(bucket)) {
      const m = key.match(/^equipment\.product\.([^.]+)\./);
      if (m?.[1]) {
        const cat = normalizeEquipmentCategorySlug(m[1]);
        if (cat) {
          cats.add(cat);
        }
      }
    }
  }
  return [...cats];
}

/** Sync CMS product cards with detail pages in the same category (slug + order). */
export function reconcileEquipmentCategoryProductCards(
  byLang: Record<string, Record<string, ContentEntry>>
): boolean {
  let changed = false;

  for (const categorySlug of collectCategorySlugsFromStore(byLang)) {
    const productsKey = `equipment.${categorySlug}.products`;

    for (const lang of Object.keys(byLang)) {
      const entry = byLang[lang]?.[productsKey];
      if (!entry?.value) {
        continue;
      }
      const cards = parseProductsJson(entry.value);
      const catalog = buildCatalogForCategory(byLang, categorySlug, lang);
      const merged = buildCategoryProductsForDisplay(cards, catalog);
      const next = JSON.stringify(merged);
      if (next !== entry.value) {
        byLang[lang]![productsKey] = { ...entry, value: next };
        changed = true;
      }
    }
  }

  return changed;
}

/** Slugs declared on category cards (for stub creation). */
export function slugsFromCategoryProductCards(
  byLang: Record<string, Record<string, ContentEntry>>,
  categorySlug: string
): { slug: string; title?: string }[] {
  const productsKey = `equipment.${categorySlug}.products`;
  const seen = new Set<string>();
  const out: { slug: string; title?: string }[] = [];
  for (const bucket of Object.values(byLang)) {
    const entry = bucket[productsKey];
    if (!entry?.value) {
      continue;
    }
    for (const card of parseProductsJson(entry.value)) {
      const slug = card.slug?.trim()
        ? resolveEquipmentProductSlug(card.slug)
        : null;
      if (!slug || seen.has(slug)) {
        continue;
      }
      seen.add(slug);
      out.push({ slug, title: card.title?.trim() });
    }
  }
  return out;
}

export function buildProductCatalogJsonForCategory(
  byLang: Record<string, Record<string, ContentEntry>>,
  categorySlug: string,
  lang: string
): string {
  const catalog = buildCatalogForCategory(byLang, categorySlug, lang);
  return JSON.stringify(catalog);
}
