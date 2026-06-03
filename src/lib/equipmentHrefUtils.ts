/** Slug segment for `equipment.{slug}.*` keys and `/[lang]/equipment/[slug]` routes. */

export function normalizeEquipmentCategorySlug(raw: string): string | null {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/^equipment-systems\/+/, "")
    .replace(/^equipment\/+/, "");
  if (!s || s.length > 96 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) {
    return null;
  }
  return s;
}

export function resolveEquipmentCategorySlug(raw: string): string | null {
  let s = raw.trim();
  try {
    s = decodeURIComponent(s);
  } catch {
    return null;
  }
  return normalizeEquipmentCategorySlug(s);
}

/** From nav/card `href` (`equipment/foo` or `equipment-systems/foo`) → slug `foo`. */
export function equipmentCategorySlugFromNavHref(
  href: string | undefined
): string | null {
  const h = (href ?? "").trim().toLowerCase().replace(/^#/, "");
  if (!h || h === "equipment" || h === "equipment-systems") {
    return null;
  }
  const path = h.replace(/^https?:\/\/[^/]+/i, "").replace(/^\/[^/]+/, "");
  const normalized = path.replace(/^\/+|\/+$/g, "");
  if (normalized.startsWith("equipment/")) {
    const seg = normalized.slice("equipment/".length).split("/")[0]?.trim() ?? "";
    return seg ? resolveEquipmentCategorySlug(seg) : null;
  }
  if (normalized.startsWith("equipment-systems/")) {
    const seg =
      normalized.slice("equipment-systems/".length).split("/")[0]?.trim() ?? "";
    return seg ? resolveEquipmentCategorySlug(seg) : null;
  }
  return null;
}

export function equipmentCategoryHrefFromSlug(slug: string): string {
  return `equipment/${slug}`;
}

export function slugifyEquipmentCategoryTitle(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "category";
}
