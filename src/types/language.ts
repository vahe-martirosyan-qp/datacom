export interface Language {
  code: string;
  name: string;
  active: boolean;
  /** If omitted, direction is inferred from `code` (e.g. ar → rtl). */
  dir?: "ltr" | "rtl";
}
