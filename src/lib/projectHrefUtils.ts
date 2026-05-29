/** RFC 4122 UUID v4 (lowercase). */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Stable IDs for built-in seed projects (see `contentStore` seeds). */
export const SEED_PROJECT_IDS = {
  maidens: "00000001-0001-4001-8001-000000000001",
  riverside: "00000002-0002-4002-8002-000000000002",
  urban: "00000003-0003-4003-8003-000000000003",
} as const;

/** Old default slugs → seed UUIDs (older DBs may still store these in `projects.list` / keys). */
export const LEGACY_SEED_SLUG_TO_UUID: Record<string, string> = {
  "maidens-hotel-moscow": SEED_PROJECT_IDS.maidens,
  "riverside-sochi": SEED_PROJECT_IDS.riverside,
  "urban-loft-spb": SEED_PROJECT_IDS.urban,
};

export function legacySeedSlugToUuid(resolvedSlugSegment: string): string | null {
  const s = resolvedSlugSegment.trim().toLowerCase();
  return LEGACY_SEED_SLUG_TO_UUID[s] ?? null;
}

export function seedUuidToLegacySlug(uuid: string): string | null {
  const id = normalizeProjectId(uuid);
  if (!id) {
    return null;
  }
  for (const [leg, u] of Object.entries(LEGACY_SEED_SLUG_TO_UUID)) {
    if (u === id) {
      return leg;
    }
  }
  return null;
}

/**
 * Segments to try when loading `project.{segment}.*` (UUID URL vs legacy keys, or the reverse).
 */
export function projectKeyAliasesForLookup(resolvedSegment: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (s: string) => {
    const t = s.trim();
    if (t && !seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  };
  const id = normalizeProjectId(resolvedSegment);
  if (id) {
    add(id);
    const leg = seedUuidToLegacySlug(id);
    if (leg) {
      add(leg);
    }
  } else {
    add(resolvedSegment);
    const uuid = legacySeedSlugToUuid(resolvedSegment);
    if (uuid) {
      add(uuid);
    }
  }
  return out;
}

/**
 * Prefer `projects/<uuid>` in links for the three seed case studies when the CMS still has legacy slugs.
 */
export function canonicalizeProjectCardHref(href: string): string {
  const h = (href ?? "").trim();
  if (!h) {
    return h;
  }
  const path = h.replace(/^https?:\/\/[^/]+/i, "").replace(/^\/[^/]+/, "");
  const normalized = path.replace(/^\/+|\/+$/g, "");
  if (!normalized.startsWith("projects/")) {
    return h;
  }
  const seg =
    normalized.slice("projects/".length).split("/")[0]?.trim() ?? "";
  if (!seg) {
    return h;
  }
  const resolved = resolveProjectKeySegment(seg);
  if (!resolved) {
    return h;
  }
  const id = normalizeProjectId(resolved);
  if (id) {
    return `projects/${id}`;
  }
  const uuid = legacySeedSlugToUuid(resolved);
  if (uuid) {
    return `projects/${uuid}`;
  }
  return h;
}

/** Returns lowercase UUID if valid, else null. */
export function normalizeProjectId(raw: string): string | null {
  const s = raw.trim().toLowerCase();
  return UUID_RE.test(s) ? s : null;
}

/**
 * URL / CMS key segment for a project: UUID (new) or legacy slug (existing data).
 * Accepts a route param (Next usually decodes once; extra decode is safe for UUIDs).
 */
export function resolveProjectKeySegment(raw: string): string | null {
  let s = raw.trim();
  try {
    s = decodeURIComponent(s);
  } catch {
    return null;
  }
  const id = normalizeProjectId(s);
  if (id) {
    return id;
  }
  return normalizeNewProjectSlug(s);
}

/** Legacy slug for URLs and keys: lowercase, `projects/foo` or `foo` → `foo`. */
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

/**
 * From a card `href`, returns the project key segment (UUID or legacy slug), or null.
 * Accepts `projects/<segment>`, optional leading locale or origin.
 */
export function projectKeySegmentFromCardHref(
  href: string | undefined
): string | null {
  const h = (href ?? "").trim();
  if (!h) {
    return null;
  }
  const path = h.replace(/^https?:\/\/[^/]+/i, "").replace(/^\/[^/]+/, "");
  const normalized = path.replace(/^\/+|\/+$/g, "");
  if (!normalized.startsWith("projects/")) {
    return null;
  }
  const seg = normalized.slice("projects/".length).split("/")[0]?.trim() ?? "";
  if (!seg) {
    return null;
  }
  return resolveProjectKeySegment(seg);
}
