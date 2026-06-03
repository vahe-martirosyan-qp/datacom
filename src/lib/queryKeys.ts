export const queryKeys = {
  languages: ["languages"] as const,
  languagesAdmin: ["languages", "admin"] as const,
  content: (page: string, lang: string) => ["content", page, lang] as const,
  contentProject: (lang: string, projectKeySegment: string) =>
    ["content", "project", lang, projectKeySegment] as const,
  contentCompany: (lang: string) => ["content", "company", lang] as const,
  contentPrivacy: (lang: string) => ["content", "privacy", lang] as const,
  contentContacts: (lang: string) => ["content", "contacts", lang] as const,
  contentBlog: (lang: string) => ["content", "blog", lang] as const,
  contentBlogPost: (lang: string, blogSlug: string) =>
    ["content", "blogPost", lang, blogSlug] as const,
  contentEquipment: (lang: string) => ["content", "equipment", lang] as const,
  contentEquipmentCategory: (lang: string, categorySlug: string) =>
    ["content", "equipmentCategory", lang, categorySlug] as const,
  contentEquipmentProduct: (
    lang: string,
    categorySlug: string,
    productSlug: string
  ) =>
    ["content", "equipmentProduct", lang, categorySlug, productSlug] as const,
  authMe: ["auth", "me"] as const,
};
