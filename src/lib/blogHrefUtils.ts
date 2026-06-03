/** Slug segment for `blog.{slug}.*` keys and `/[lang]/blog/[slug]` routes. */

export function normalizeBlogSlug(raw: string): string | null {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/^blog\/+/, "");
  if (!s || s.length > 96 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) {
    return null;
  }
  return s;
}

export function resolveBlogKeySegment(raw: string): string | null {
  let s = raw.trim();
  try {
    s = decodeURIComponent(s);
  } catch {
    return null;
  }
  return normalizeBlogSlug(s);
}

/** From card `href`, returns blog slug (`blog/foo` → `foo`). */
export function blogKeySegmentFromCardHref(
  href: string | undefined
): string | null {
  const h = (href ?? "").trim();
  if (!h) {
    return null;
  }
  const path = h.replace(/^https?:\/\/[^/]+/i, "").replace(/^\/[^/]+/, "");
  const normalized = path.replace(/^\/+|\/+$/g, "");
  if (!normalized.startsWith("blog/")) {
    return null;
  }
  const seg = normalized.slice("blog/".length).split("/")[0]?.trim() ?? "";
  if (!seg) {
    return null;
  }
  return resolveBlogKeySegment(seg);
}

export function slugifyBlogTitle(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "post";
}
