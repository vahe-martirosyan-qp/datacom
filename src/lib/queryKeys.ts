export const queryKeys = {
  languages: ["languages"] as const,
  languagesAdmin: ["languages", "admin"] as const,
  content: (page: string, lang: string) => ["content", page, lang] as const,
  contentProject: (lang: string, slug: string) =>
    ["content", "project", lang, slug] as const,
  authMe: ["auth", "me"] as const,
};
