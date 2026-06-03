import type { NavMegaItem, NavMegaMenuDocument } from "@/types/site";

/** Matches the «Equipment & systems» top-level mega-menu entry. */
export function isEquipmentNavHref(href: string): boolean {
  const h = (href ?? "").trim().toLowerCase();
  if (!h || h === "#") {
    return false;
  }
  const normalized = h.replace(/^#/, "");
  return normalized === "equipment" || normalized.startsWith("equipment/");
}

export function findEquipmentMegaItemIndex(items: NavMegaItem[]): number {
  const idx = items.findIndex((item) => isEquipmentNavHref(item.href));
  if (idx >= 0) {
    return idx;
  }
  return items.findIndex((item) => (item.children?.length ?? 0) > 0);
}

export function findEquipmentMegaItem(
  items: NavMegaItem[]
): NavMegaItem | undefined {
  const idx = findEquipmentMegaItemIndex(items);
  return idx >= 0 ? items[idx] : undefined;
}

export function parseMegaMenuItems(raw: string): NavMegaItem[] {
  try {
    const doc = JSON.parse(raw) as unknown;
    if (
      doc &&
      typeof doc === "object" &&
      "items" in doc &&
      Array.isArray((doc as NavMegaMenuDocument).items)
    ) {
      return (doc as NavMegaMenuDocument).items;
    }
  } catch {
    /* ignore */
  }
  return [];
}

export function serializeMegaMenuItems(items: NavMegaItem[]): string {
  return JSON.stringify({ items });
}

export function equipmentCategoriesFromMegaMenuRaw(
  raw: string
): NavMegaItem["children"] {
  const items = parseMegaMenuItems(raw);
  return findEquipmentMegaItem(items)?.children ?? [];
}
