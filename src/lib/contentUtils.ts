import type { ContentEntry } from "@/types";
import type { NavItem, NavMegaItem, NavMegaMenuDocument } from "@/types/site";

export function entriesToMap(
  entries: ContentEntry[]
): Record<string, string> {
  return Object.fromEntries(entries.map((e) => [e.key, e.value]));
}

export function parseJsonArray<T>(raw: string, fallback: T[]): T[] {
  try {
    const value = JSON.parse(raw) as unknown;
    return Array.isArray(value) ? (value as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export function buildContentPutPath(key: string): string {
  return `/content/${key.split(".").join("/")}`;
}

/** Resolves CMS hrefs: `contacts` → `/en/contacts`, `#id` → `/en#id`, URLs unchanged. */
export function buildLocalizedHref(lang: string, href: string): string {
  const h = (href ?? "").trim();
  if (!h) return `/${lang}`;
  if (h.startsWith("http://") || h.startsWith("https://")) return h;
  if (h.startsWith("#")) return `/${lang}${h}`;
  const path = h.startsWith("/") ? h.slice(1) : h;
  return `/${lang}/${path}`;
}

/** Legacy CMS used `#projects`; flat nav sometimes uses `/projects`. Prefer route segment `projects`. */
function normalizeProjectsNavHref(href: string): string {
  const t = (href ?? "").trim();
  if (t === "#projects" || t === "/projects") return "projects";
  return href ?? "";
}

function normalizeNavMegaItems(items: NavMegaItem[]): NavMegaItem[] {
  return items.map((item) => ({
    ...item,
    href: normalizeProjectsNavHref(item.href),
    children: item.children?.map((c) => ({
      ...c,
      href: normalizeProjectsNavHref(c.href),
    })),
  }));
}

export function parseNavMegaMenu(map: Record<string, string>): NavMegaItem[] {
  const raw = map["home.nav.megaMenu"];
  if (raw) {
    try {
      const doc = JSON.parse(raw) as unknown;
      if (
        doc &&
        typeof doc === "object" &&
        "items" in doc &&
        Array.isArray((doc as NavMegaMenuDocument).items)
      ) {
        return normalizeNavMegaItems((doc as NavMegaMenuDocument).items);
      }
    } catch {
      /* fall through */
    }
  }
  const flat = parseJsonArray<NavItem>(map["home.nav.items"] ?? "[]", []);
  return normalizeNavMegaItems(flat.map((item) => ({ ...item })));
}
