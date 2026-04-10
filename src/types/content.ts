import type { Language } from "./language";

export type ContentValueType = "text" | "image" | "json";

export interface ContentEntry {
  key: string;
  value: string;
  type: ContentValueType;
}

export interface HomeContentResponse {
  page: string;
  lang: string;
  entries: ContentEntry[];
}

export interface LanguagesResponse {
  languages: Language[];
}

/** Full list for admin (includes inactive). */
export interface LanguagesAdminResponse {
  languages: Language[];
}
