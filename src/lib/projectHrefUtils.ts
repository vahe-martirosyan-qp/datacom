/** Slug for URLs and keys: lowercase, `projects/foo` or `foo` → `foo`. */
export function normalizeNewProjectSlug(raw: string): string | null {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/^projects\/+/, "");
  if (!s || s.length > 96 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) {
    return null;
  }
  return s;
}

/** `projects/some-slug` → `some-slug` */
export function projectSlugFromCardHref(href: string | undefined): string | null {
  const h = (href ?? "").trim();
  if (!h) {
    return null;
  }
  const path = h.replace(/^https?:\/\/[^/]+/i, "").replace(/^\/[^/]+/, ""); // drop origin + first /lang
  const normalized = path.replace(/^\/+|\/+$/g, "");
  if (!normalized.startsWith("projects/")) {
    return null;
  }
  const slug = normalized.slice("projects/".length).split("/")[0]?.trim();
  return slug || null;
}
