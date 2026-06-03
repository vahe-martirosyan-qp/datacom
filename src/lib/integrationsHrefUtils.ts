/** Slug segment for `integration.{slug}.*` keys and `/[lang]/integrations/[slug]` routes. */

export function normalizeIntegrationCategorySlug(raw: string): string | null {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/^integrations\/+/, "")
    .replace(/^integration\/+/, "");
  if (!s || s.length > 96 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) {
    return null;
  }
  return s;
}

export function resolveIntegrationCategorySlug(raw: string): string | null {
  let s = raw.trim();
  try {
    s = decodeURIComponent(s);
  } catch {
    return null;
  }
  return normalizeIntegrationCategorySlug(s);
}

/** From nav/card `href` (`integrations/foo`) → slug `foo`. */
export function integrationCategorySlugFromNavHref(
  href: string | undefined
): string | null {
  const h = (href ?? "").trim().toLowerCase().replace(/^#/, "");
  if (!h || h === "integrations" || h === "integration") {
    return null;
  }
  const path = h.replace(/^https?:\/\/[^/]+/i, "").replace(/^\/[^/]+/, "");
  const normalized = path.replace(/^\/+|\/+$/g, "");
  if (normalized.startsWith("integrations/")) {
    const seg =
      normalized.slice("integrations/".length).split("/")[0]?.trim() ?? "";
    return seg ? resolveIntegrationCategorySlug(seg) : null;
  }
  if (normalized.startsWith("integration/")) {
    const seg =
      normalized.slice("integration/".length).split("/")[0]?.trim() ?? "";
    return seg ? resolveIntegrationCategorySlug(seg) : null;
  }
  return null;
}

export function integrationCategoryHrefFromSlug(slug: string): string {
  return `integrations/${slug}`;
}

export function slugifyIntegrationCategoryTitle(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "service";
}
