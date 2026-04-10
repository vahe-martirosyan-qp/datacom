/** Which widget to use in the section editor for a content key. */
export type AdminFieldKind =
  | "text"
  | "textarea"
  | "url"
  | "navItems"
  | "navMega"
  | "featureCards"
  | "projectCards"
  | "spotlightCards"
  | "blogPosts"
  | "stepItems"
  | "brandList"
  | "footerColumns"
  | "tiptap"
  | "imageUpload";

const KIND_BY_KEY: Record<string, AdminFieldKind> = {
  "home.nav.megaMenu": "navMega",
  "home.nav.items": "navItems",
  "home.features.items": "featureCards",
  "projects.list": "projectCards",
  "home.spotlight.items": "spotlightCards",
  "home.blog.posts": "blogPosts",
  "home.steps.items": "stepItems",
  "home.clients.brands": "brandList",
  "home.footer.columns": "footerColumns",
  "home.seo.description": "textarea",
  "home.hero.subtitle": "textarea",
  "home.about.body": "textarea",
  "home.lead.subtitle": "textarea",
  "home.hero.imageUrl": "url",
  "home.about.imageUrl": "url",
  "home.about.pdfHref": "url",
};

export function getAdminFieldKind(key: string): AdminFieldKind {
  const mapped = KIND_BY_KEY[key];
  if (mapped) {
    return mapped;
  }
  if (key.endsWith(".bodyHtml")) {
    return "tiptap";
  }
  if (key.endsWith(".equipment")) {
    return "textarea";
  }
  if (key.endsWith(".heroImage")) {
    return "imageUpload";
  }
  return "text";
}
