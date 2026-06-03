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
  | "integrationServices"
  | "blogPosts"
  | "stepItems"
  | "brandList"
  | "footerColumns"
  | "tiptap"
  | "imageUpload"
  | "companyStats"
  | "contactOffices"
  | "equipmentHighlights"
  | "equipmentFeatureSections"
  | "equipmentProducts"
  | "equipmentSpecs"
  | "equipmentProductImages";

const KIND_BY_KEY: Record<string, AdminFieldKind> = {
  "home.nav.megaMenu": "navMega",
  "home.nav.items": "navItems",
  "home.features.items": "featureCards",
  "projects.list": "projectCards",
  "home.spotlight.items": "spotlightCards",
  "home.blog.posts": "blogPosts",
  "page.blog.posts": "blogPosts",
  "home.steps.items": "stepItems",
  "home.clients.brands": "brandList",
  "home.footer.columns": "footerColumns",
  "home.seo.description": "textarea",
  "home.hero.subtitle": "textarea",
  "home.about.body": "textarea",
  "home.lead.subtitle": "textarea",
  "global.cookies.message": "textarea",
  "global.cookies.settingsIntro": "textarea",
  "global.cookies.essentialDesc": "textarea",
  "global.cookies.analyticsDesc": "textarea",
  "global.cookies.marketingDesc": "textarea",
  "global.cookies.privacyHref": "url",
  "home.hero.imageUrl": "url",
  "home.about.imageUrl": "url",
  "home.about.pdfHref": "url",
  "page.company.stats": "companyStats",
  "page.company.heroImageUrl": "imageUpload",
  "page.company.seo.description": "textarea",
  "page.company.intro": "textarea",
  "page.company.pdfHref": "url",
  "page.contacts.offices": "contactOffices",
  "page.contacts.seo.description": "textarea",
  "page.contacts.formSubtitle": "textarea",
  "page.privacy.seo.description": "textarea",
  "page.privacy.intro": "textarea",
  "page.privacy.bodyHtml": "tiptap",
  "page.blog.seo.description": "textarea",
  "page.blog.subtitle": "textarea",
  "page.equipment.seo.description": "textarea",
  "page.equipment.subtitle": "textarea",
  "page.integrations.items": "integrationServices",
  "page.integrations.seo.description": "textarea",
  "page.integrations.subtitle": "textarea",
};

export function getAdminFieldKind(key: string): AdminFieldKind {
  const mapped = KIND_BY_KEY[key];
  if (mapped) {
    return mapped;
  }
  if (/^equipment\.product\.[^.]+\.[^.]+\.images$/.test(key)) {
    return "equipmentProductImages";
  }
  if (key.endsWith(".bodyHtml")) {
    return "tiptap";
  }
  if (key.endsWith(".highlights")) {
    return "equipmentHighlights";
  }
  if (key.endsWith(".featureSections")) {
    return "equipmentFeatureSections";
  }
  if (key.endsWith(".products")) {
    return "equipmentProducts";
  }
  if (key.endsWith(".specs")) {
    return "equipmentSpecs";
  }
  if (key.endsWith(".equipment")) {
    return "textarea";
  }
  if (key.endsWith(".heroImage")) {
    return "imageUpload";
  }
  if (key.match(/^equipment\.[^.]+\.seo\.description$/)) {
    return "textarea";
  }
  if (key.endsWith(".subtitle")) {
    return "textarea";
  }
  return "text";
}
