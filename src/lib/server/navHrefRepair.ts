import { isLegacyTextBrandsJson } from "@/lib/clientLogosUtils";
import { DEFAULT_CLIENT_LOGOS_JSON } from "@/lib/server/defaultClientLogos";
import type { ContentEntry } from "@/types";
import {
  DEFAULT_NAV_ITEMS_EN,
  DEFAULT_NAV_ITEMS_RU,
  DEFAULT_NAV_MEGA_MENU_EN,
  DEFAULT_NAV_MEGA_MENU_RU,
  isLegacyNavContent,
} from "@/lib/server/defaultNavMegaMenu";

/** Replace outdated `#`-anchor nav with routed seeds (equipment, company, …). */
export function repairLegacyNavKeysInBucket(
  bucket: Record<string, ContentEntry>,
  langCode: string
): boolean {
  const megaEntry = bucket["home.nav.megaMenu"];
  const itemsEntry = bucket["home.nav.items"];
  if (!megaEntry && !itemsEntry) {
    return false;
  }

  const megaRaw = megaEntry?.value ?? "";
  const itemsRaw = itemsEntry?.value ?? "";
  if (!isLegacyNavContent(megaRaw, itemsRaw)) {
    return false;
  }

  const isRu = langCode === "ru";
  const nextMega = isRu ? DEFAULT_NAV_MEGA_MENU_RU : DEFAULT_NAV_MEGA_MENU_EN;
  const nextItems = isRu ? DEFAULT_NAV_ITEMS_RU : DEFAULT_NAV_ITEMS_EN;

  if (megaEntry) {
    megaEntry.value = nextMega;
  } else {
    bucket["home.nav.megaMenu"] = {
      key: "home.nav.megaMenu",
      value: nextMega,
      type: "json",
    };
  }

  if (itemsEntry) {
    itemsEntry.value = nextItems;
  } else {
    bucket["home.nav.items"] = {
      key: "home.nav.items",
      value: nextItems,
      type: "json",
    };
  }

  return true;
}

export function repairLegacyNavKeysInStore(
  byLang: Record<string, Record<string, ContentEntry>>
): boolean {
  let changed = false;
  for (const [code, bucket] of Object.entries(byLang)) {
    if (repairLegacyNavKeysInBucket(bucket, code)) {
      changed = true;
    }
  }
  return changed;
}

function isHotezaNavHref(href: string | undefined): boolean {
  const h = (href ?? "").trim().toLowerCase().replace(/^\/+/, "");
  return h === "hoteza" || h === "#hoteza" || h.startsWith("hoteza/");
}

function stripHotezaFromNavJson(raw: string): string {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const items = parsed.filter(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          !isHotezaNavHref((item as { href?: string }).href)
      );
      return JSON.stringify(items);
    }
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "items" in parsed &&
      Array.isArray((parsed as { items: unknown }).items)
    ) {
      const data = parsed as {
        items: {
          href?: string;
          children?: { href?: string }[];
        }[];
      };
      const items = data.items
        .filter((item) => !isHotezaNavHref(item.href))
        .map((item) => ({
          ...item,
          children: item.children?.filter((child) => !isHotezaNavHref(child.href)),
        }));
      return JSON.stringify({ ...data, items });
    }
  } catch {
    return raw;
  }
  return raw;
}

function stripHotezaFooterColumns(raw: string): string {
  try {
    const cols = JSON.parse(raw) as { title?: string }[];
    if (!Array.isArray(cols)) {
      return raw;
    }
    const filtered = cols.filter(
      (col) => !(col.title ?? "").trim().toLowerCase().includes("hoteza")
    );
    return JSON.stringify(filtered);
  } catch {
    return raw;
  }
}

const HOTEZA_STATS_KEYS = [
  "home.stats.hotezaTitle",
  "home.stats.hotezaCount",
  "home.stats.hotezaDesc",
] as const;

/** Strip Hoteza from persisted nav, footer, and obsolete stats keys. */
export function removeHotezaFromContentInBucket(
  bucket: Record<string, ContentEntry>
): boolean {
  let changed = false;

  for (const key of ["home.nav.megaMenu", "home.nav.items"] as const) {
    const entry = bucket[key];
    if (!entry?.value) {
      continue;
    }
    const next = stripHotezaFromNavJson(entry.value);
    if (next !== entry.value) {
      entry.value = next;
      changed = true;
    }
  }

  const footerEntry = bucket["home.footer.columns"];
  if (footerEntry?.value) {
    const nextFooter = stripHotezaFooterColumns(footerEntry.value);
    if (nextFooter !== footerEntry.value) {
      footerEntry.value = nextFooter;
      changed = true;
    }
  }

  for (const key of HOTEZA_STATS_KEYS) {
    if (bucket[key]) {
      delete bucket[key];
      changed = true;
    }
  }

  const brandsEntry = bucket["home.clients.brands"];
  if (brandsEntry?.value && isLegacyTextBrandsJson(brandsEntry.value)) {
    brandsEntry.value = DEFAULT_CLIENT_LOGOS_JSON;
    changed = true;
  }

  return changed;
}

export function removeHotezaFromContentInStore(
  byLang: Record<string, Record<string, ContentEntry>>
): boolean {
  let changed = false;
  for (const bucket of Object.values(byLang)) {
    if (removeHotezaFromContentInBucket(bucket)) {
      changed = true;
    }
  }
  return changed;
}
