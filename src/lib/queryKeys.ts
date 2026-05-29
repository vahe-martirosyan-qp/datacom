export const queryKeys = {
  languages: ["languages"] as const,
  languagesAdmin: ["languages", "admin"] as const,
  content: (page: string, lang: string) => ["content", page, lang] as const,
  contentProject: (lang: string, projectKeySegment: string) =>
    ["content", "project", lang, projectKeySegment] as const,
  authMe: ["auth", "me"] as const,
};
