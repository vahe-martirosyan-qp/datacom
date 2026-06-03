import type { NavMegaItem } from "@/types/site";

export function isIntegrationsNavHref(href: string): boolean {
  const h = (href ?? "").trim().toLowerCase();
  if (!h || h === "#") {
    return false;
  }
  const normalized = h.replace(/^#/, "");
  return (
    normalized === "integrations" ||
    normalized === "integration" ||
    normalized.startsWith("integrations/") ||
    normalized.startsWith("integration/")
  );
}

export function findIntegrationsMegaItemIndex(items: NavMegaItem[]): number {
  return items.findIndex((item) => isIntegrationsNavHref(item.href));
}

export function findIntegrationsMegaItem(
  items: NavMegaItem[]
): NavMegaItem | undefined {
  const idx = findIntegrationsMegaItemIndex(items);
  return idx >= 0 ? items[idx] : undefined;
}
