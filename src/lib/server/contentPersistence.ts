import fs from "fs";
import path from "path";
import type { ContentEntry, Language } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content-store.json");
const LANGUAGES_FILE = path.join(DATA_DIR, "languages.json");

function isContentBucket(v: unknown): v is Record<string, ContentEntry> {
  if (!v || typeof v !== "object") {
    return false;
  }
  for (const e of Object.values(v)) {
    if (!e || typeof e !== "object") {
      return false;
    }
    const o = e as Record<string, unknown>;
    if (typeof o.key !== "string" || typeof o.value !== "string") {
      return false;
    }
    if (
      o.type !== undefined &&
      o.type !== "text" &&
      o.type !== "image" &&
      o.type !== "json"
    ) {
      return false;
    }
  }
  return true;
}

/** Merge persisted buckets into the live store (called once at startup). */
export function loadPersistedContentInto(
  byLang: Record<string, Record<string, ContentEntry>>
): void {
  try {
    const raw = fs.readFileSync(CONTENT_FILE, "utf-8");
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== "object") {
      return;
    }
    for (const [code, bucket] of Object.entries(data)) {
      if (isContentBucket(bucket)) {
        const normalized: Record<string, ContentEntry> = {};
        for (const [k, e] of Object.entries(bucket)) {
          normalized[k] = {
            ...e,
            type: e.type ?? "text",
          };
        }
        byLang[code] = normalized;
      }
    }
  } catch {
    /* no file or invalid JSON — keep seeded defaults */
  }
}

export function savePersistedContent(
  byLang: Record<string, Record<string, ContentEntry>>
): void {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(byLang, null, 2), "utf-8");
  } catch (e) {
    console.error("[datacom] Failed to persist content store:", e);
  }
}

export function loadPersistedLanguages(): Language[] | null {
  try {
    const raw = fs.readFileSync(LANGUAGES_FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return null;
    }
    const out: Language[] = [];
    for (const row of parsed) {
      if (
        row &&
        typeof row === "object" &&
        typeof (row as Language).code === "string" &&
        typeof (row as Language).name === "string" &&
        typeof (row as Language).active === "boolean" &&
        ((row as Language).dir === "ltr" || (row as Language).dir === "rtl")
      ) {
        out.push(row as Language);
      }
    }
    return out.length > 0 ? out : null;
  } catch {
    return null;
  }
}

export function savePersistedLanguages(languages: Language[]): void {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(
      LANGUAGES_FILE,
      JSON.stringify(languages, null, 2),
      "utf-8"
    );
  } catch (e) {
    console.error("[datacom] Failed to persist languages:", e);
  }
}
