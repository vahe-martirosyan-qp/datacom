import type { ClientLogoItem } from "@/types/site";

function newLogoId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `logo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ensureClientLogoIds(items: ClientLogoItem[]): ClientLogoItem[] {
  return items.map((item) => ({
    ...item,
    id: item.id ?? newLogoId(),
  }));
}

function isLogoItem(value: unknown): value is ClientLogoItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as ClientLogoItem).imageUrl === "string"
  );
}

/** Parses `home.clients.brands` for the admin editor (keeps empty rows and assigns ids). */
export function parseClientLogosForAdmin(raw: string): ClientLogoItem[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    if (parsed.length > 0 && typeof parsed[0] === "string") {
      return (parsed as string[]).map((name) => ({
        id: newLogoId(),
        imageUrl: "",
        alt: name,
      }));
    }
    const items = parsed
      .filter(isLogoItem)
      .map((item) => ({
        id: typeof item.id === "string" ? item.id : undefined,
        imageUrl: item.imageUrl,
        alt: item.alt,
      }));
    return ensureClientLogoIds(items);
  } catch {
    return [];
  }
}

export function createEmptyClientLogo(): ClientLogoItem {
  return { id: newLogoId(), imageUrl: "", alt: undefined };
}

export function serializeClientLogos(items: ClientLogoItem[]): string {
  return JSON.stringify(items);
}
