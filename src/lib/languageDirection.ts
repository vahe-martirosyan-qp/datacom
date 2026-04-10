import type { Language } from "@/types";

const RTL_BASE_CODES = new Set([
  "ar",
  "he",
  "fa",
  "ur",
  "dv",
  "ps",
  "ku",
  "sd",
]);

/** Infer text direction from BCP-47 style code (e.g. ar, ar-SA). */
export function inferDirFromCode(code: string): "ltr" | "rtl" {
  const base = code.split(/[-_]/)[0]?.toLowerCase() ?? "";
  return RTL_BASE_CODES.has(base) ? "rtl" : "ltr";
}

export function resolveLanguageDir(
  lang: Language | undefined,
  code: string
): "ltr" | "rtl" {
  if (lang?.dir === "rtl" || lang?.dir === "ltr") {
    return lang.dir;
  }
  return inferDirFromCode(code);
}
