import type { ContentEntry, ContentValueType, Language } from "@/types";
import { prisma } from "@/lib/server/prisma";
import type {
  BlogTeaserPost,
  EquipmentProductItem,
  ProjectCardItem,
} from "@/types/site";
import {
  buildCategoryProductsForDisplay,
  parseEquipmentCategoryProductCatalog,
} from "@/lib/equipmentCategoryProductsUtils";
import {
  canonicalizeProjectCardHref,
  normalizeProjectId,
  projectKeyAliasesForLookup,
  projectKeySegmentFromCardHref,
  resolveProjectKeySegment,
} from "@/lib/projectHrefUtils";
import {
  DEFAULT_NAV_MEGA_MENU_EN,
  DEFAULT_NAV_MEGA_MENU_RU,
  DEFAULT_NAV_ITEMS_EN,
  DEFAULT_NAV_ITEMS_RU,
} from "@/lib/server/defaultNavMegaMenu";
import { DEFAULT_CLIENT_LOGOS_JSON } from "@/lib/server/defaultClientLogos";
import { reconcileHomeClientBrandsAcrossLanguages } from "@/lib/server/clientBrandsSync";
import {
  removeHotezaFromContentInStore,
  repairLegacyNavKeysInStore,
} from "@/lib/server/navHrefRepair";
import {
  loadPersistedContentInto,
  loadPersistedLanguages,
  savePersistedContent,
  savePersistedLanguages,
} from "@/lib/server/contentPersistence";
import {
  COMPANY_BODY_HTML_EN,
  COMPANY_BODY_HTML_RU,
  COMPANY_HERO_IMAGE_URL,
  COMPANY_STATS_EN,
  COMPANY_STATS_RU,
} from "@/lib/server/companyPageSeedContent";
import {
  CONTACTS_OFFICES_EN,
  CONTACTS_OFFICES_RU,
} from "@/lib/server/contactsPageSeedContent";
import {
  BLOG_POSTS_EN,
  BLOG_POSTS_RU,
} from "@/lib/server/blogPageSeedContent";
import {
  EQUIPMENT_PAGE_SUBTITLE_EN,
  EQUIPMENT_PAGE_SUBTITLE_RU,
} from "@/lib/server/equipmentPageSeedContent";
import {
  INTEGRATIONS_ITEMS_EN,
  INTEGRATIONS_ITEMS_RU,
  INTEGRATIONS_PAGE_SUBTITLE_EN,
  INTEGRATIONS_PAGE_SUBTITLE_RU,
} from "@/lib/server/integrationsPageSeedContent";
import { blogPostSeedEntriesForLang } from "@/lib/server/blogPostSeedContent";
import { equipmentCategorySeedEntriesForLang } from "@/lib/server/equipmentCategorySeedContent";
import { integrationCategorySeedEntriesForLang } from "@/lib/server/integrationCategorySeedContent";
import { equipmentProductSeedEntriesForLang } from "@/lib/server/equipmentProductSeedContent";
import {
  buildProductCatalogJsonForCategory,
  collectCategorySlugsFromStore,
  reconcileEquipmentCategoryProductCards,
  slugsFromCategoryProductCards,
} from "@/lib/server/equipmentCategoryProductsSync";
import {
  equipmentProductContentPrefix,
  normalizeEquipmentProductSlug,
  parseEquipmentProductRouteSlug,
  resolveEquipmentProductSlug,
  slugifyEquipmentProductTitle,
} from "@/lib/equipmentProductHrefUtils";
import { blogKeySegmentFromCardHref } from "@/lib/blogHrefUtils";
import {
  equipmentCategoryHrefFromSlug,
  equipmentCategorySlugFromNavHref,
  normalizeEquipmentCategorySlug,
  slugifyEquipmentCategoryTitle,
} from "@/lib/equipmentHrefUtils";
import {
  integrationCategoryHrefFromSlug,
  integrationCategorySlugFromNavHref,
  normalizeIntegrationCategorySlug,
  slugifyIntegrationCategoryTitle,
} from "@/lib/integrationsHrefUtils";
import {
  findEquipmentMegaItemIndex,
  parseMegaMenuItems,
  serializeMegaMenuItems,
} from "@/lib/equipmentNavUtils";
import { findIntegrationsMegaItemIndex } from "@/lib/integrationsNavUtils";
import type { SpotlightCard } from "@/types/site";
import { parseJsonArray } from "@/lib/contentUtils";
import { cookieConsentSeedEntriesForLang } from "@/lib/server/cookieConsentSeedContent";
import { privacyPageSeedEntriesForLang } from "@/lib/server/privacyPageSeedContent";
import { reconcileCookieConsentSeeds } from "@/lib/server/cookieConsentSeedSync";
import { reconcilePrivacyPageSeeds } from "@/lib/server/privacyPageSeedSync";
import {
  MAIDENS_BODY_HTML_EN,
  MAIDENS_BODY_HTML_RU,
  MAIDENS_EQUIPMENT,
  RIVERSIDE_BODY_HTML_EN,
  RIVERSIDE_BODY_HTML_RU,
  RIVERSIDE_EQUIPMENT,
  URBAN_BODY_HTML_EN,
  URBAN_BODY_HTML_RU,
  URBAN_EQUIPMENT,
} from "@/lib/server/projectSeedContent";

type LangCode = string;

const enHome: Record<string, ContentEntry> = {
  "home.seo.title": {
    key: "home.seo.title",
    value: "Datacom — Hotel solutions: equipment and integrations",
    type: "text",
  },
  "home.seo.description": {
    key: "home.seo.description",
    value:
      "Equipment and systems for hotels of any category: locks, minibars, TV, PBX, integrations across Russia.",
    type: "text",
  },
  "home.header.phone": {
    key: "home.header.phone",
    value: "8 800 775 6676",
    type: "text",
  },
  "home.header.ctaConsult": {
    key: "home.header.ctaConsult",
    value: "Consultation",
    type: "text",
  },
  "home.header.logoText": {
    key: "home.header.logoText",
    value: "Datacom",
    type: "text",
  },
  "home.nav.items": {
    key: "home.nav.items",
    value: DEFAULT_NAV_ITEMS_EN,
    type: "json",
  },
  "home.nav.megaMenu": {
    key: "home.nav.megaMenu",
    value: DEFAULT_NAV_MEGA_MENU_EN,
    type: "json",
  },
  "home.hero.title": {
    key: "home.hero.title",
    value: "Solutions for hotels, apartments, clinics, cruise ships and sports venues",
    type: "text",
  },
  "home.hero.subtitle": {
    key: "home.hero.subtitle",
    value:
      "Equipment, interactive guest services, integrations — everything to exceed guest expectations.",
    type: "text",
  },
  "home.hero.ctaLabel": {
    key: "home.hero.ctaLabel",
    value: "Get a consultation",
    type: "text",
  },
  "home.hero.ctaHref": {
    key: "home.hero.ctaHref",
    value: "contacts",
    type: "text",
  },
  "home.hero.imageUrl": {
    key: "home.hero.imageUrl",
    value:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80",
    type: "image",
  },
  "home.stats.equipmentTitle": {
    key: "home.stats.equipmentTitle",
    value: "Equipment & systems",
    type: "text",
  },
  "home.stats.equipmentCount": {
    key: "home.stats.equipmentCount",
    value: "8",
    type: "text",
  },
  "home.stats.equipmentDesc": {
    key: "home.stats.equipmentDesc",
    value: "Reliable solutions from leading brands for any property",
    type: "text",
  },
  "home.stats.integrationTitle": {
    key: "home.stats.integrationTitle",
    value: "Integrations",
    type: "text",
  },
  "home.stats.integrationCount": {
    key: "home.stats.integrationCount",
    value: "4",
    type: "text",
  },
  "home.stats.integrationDesc": {
    key: "home.stats.integrationDesc",
    value: "Design, supply, installation, support and modernization",
    type: "text",
  },
  "home.spotlight.items": {
    key: "home.spotlight.items",
    value: JSON.stringify([
      {
        title: "TV headends & reception",
        desc: "Head-end systems and signal distribution for in-room TV",
        href: "equipment/headends-tv-reception",
      },
      {
        title: "Upgrading existing systems",
        desc: "Modernization and migration without disrupting operations",
        href: "integrations/updating-modernizing-systems",
      },
    ]),
    type: "json",
  },
  "home.features.title": {
    key: "home.features.title",
    value: "What we deliver",
    type: "text",
  },
  "home.features.items": {
    key: "home.features.items",
    value: JSON.stringify([
      { title: "Electronic locks", desc: "Secure access for staff and guests" },
      { title: "Minibars & safes", desc: "In-room revenue and guest peace of mind" },
      { title: "Hotel TV & pro panels", desc: "Branded entertainment and signage" },
      { title: "Hotel PBX", desc: "Voice and unified communications" },
      { title: "Room automation", desc: "Climate, lighting, scenes" },
      { title: "TV headends & LAN", desc: "Signal distribution and infrastructure" },
    ]),
    type: "json",
  },
  "home.about.title": {
    key: "home.about.title",
    value: "15+ years helping hotels exceed guest expectations",
    type: "text",
  },
  "home.about.body": {
    key: "home.about.body",
    value:
      "We integrate hotel IT, TV and guest-facing platforms: room automation, interactive TV, PBX, locks, safes, minibars, displays and professional panels. Our team has deep experience outfitting hotel rooms and public areas.",
    type: "text",
  },
  "home.about.counterValue": {
    key: "home.about.counterValue",
    value: "98 789",
    type: "text",
  },
  "home.about.counterLabel": {
    key: "home.about.counterLabel",
    value: "rooms successfully delivered",
    type: "text",
  },
  "home.about.timelineCaption": {
    key: "home.about.timelineCaption",
    value: "On the market — from launch to today",
    type: "text",
  },
  "home.about.imageUrl": {
    key: "home.about.imageUrl",
    value:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&q=80",
    type: "image",
  },
  "home.steps.title": {
    key: "home.steps.title",
    value: "How we work with you",
    type: "text",
  },
  "home.steps.items": {
    key: "home.steps.items",
    value: JSON.stringify([
      { title: "Audit & design", desc: "We align scope, budget and timelines." },
      { title: "Supply & install", desc: "Certified equipment and clean project delivery." },
      { title: "Launch & support", desc: "Commissioning, training and 24/7 care." },
    ]),
    type: "json",
  },
  "home.clients.title": {
    key: "home.clients.title",
    value: "Trusted by hundreds of hotels",
    type: "text",
  },
  "home.clients.subtitle": {
    key: "home.clients.subtitle",
    value: "Including leading international chains across the country",
    type: "text",
  },
  "home.clients.brands": {
    key: "home.clients.brands",
    value: DEFAULT_CLIENT_LOGOS_JSON,
    type: "json",
  },
  "home.blog.title": {
    key: "home.blog.title",
    value: "News & articles",
    type: "text",
  },
  "home.blog.subtitle": {
    key: "home.blog.subtitle",
    value: "Industry insights, product updates and project stories.",
    type: "text",
  },
  "home.blog.posts": {
    key: "home.blog.posts",
    value: JSON.stringify([
      {
        title: "Hotel TV trends in 2026",
        href: "blog/hotel-tv-trends",
        meta: "Jan 2026",
        imageUrl:
          "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80",
      },
      {
        title: "Integrating locks with PMS",
        href: "blog/locks-pms",
        meta: "Guide",
        imageUrl:
          "https://images.unsplash.com/photo-1558008280-b9d87398e043?w=800&q=80",
      },
      {
        title: "Case study: flagship opening",
        href: "blog/case-flagship",
        meta: "Projects",
        imageUrl:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      },
    ]),
    type: "json",
  },
  "home.blog.ctaLabel": {
    key: "home.blog.ctaLabel",
    value: "All news & articles",
    type: "text",
  },
  "home.blog.ctaHref": {
    key: "home.blog.ctaHref",
    value: "blog",
    type: "text",
  },
  "home.contactStrip.title": {
    key: "home.contactStrip.title",
    value: "Contact us — we will pick the best solutions for your property",
    type: "text",
  },
  "home.contactStrip.subtitle": {
    key: "home.contactStrip.subtitle",
    value: "Free call · Mon–Fri 10:00–18:00 MSK",
    type: "text",
  },
  "home.contactStrip.ctaLabel": {
    key: "home.contactStrip.ctaLabel",
    value: "Request a call",
    type: "text",
  },
  "home.contactStrip.ctaHref": {
    key: "home.contactStrip.ctaHref",
    value: "#contacts",
    type: "text",
  },
  "home.projects.sectionTitle": {
    key: "home.projects.sectionTitle",
    value: "Projects",
    type: "text",
  },
  "projects.list": {
    key: "projects.list",
    value: JSON.stringify([
      {
        title: "Maidens Hotel Moscow",
        location: "Moscow",
        imageUrl: "/images/project-maiden-moscow.png",
        href: "projects/00000001-0001-4001-8001-000000000001",
      },
      {
        title: "Riverside Conference & Spa",
        location: "Sochi",
        imageUrl:
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
        href: "projects/00000002-0002-4002-8002-000000000002",
      },
      {
        title: "Urban Loft Apartments",
        location: "Saint Petersburg",
        imageUrl:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
        href: "projects/00000003-0003-4003-8003-000000000003",
      },
    ]),
    type: "json",
  },
  "home.projects.ctaLabel": {
    key: "home.projects.ctaLabel",
    value: "View all projects",
    type: "text",
  },
  "home.projects.ctaHref": {
    key: "home.projects.ctaHref",
    value: "projects",
    type: "text",
  },
  "project.00000001-0001-4001-8001-000000000001.title": {
    key: "project.00000001-0001-4001-8001-000000000001.title",
    value: "Maidens Hotel Moscow",
    type: "text",
  },
  "project.00000001-0001-4001-8001-000000000001.location": {
    key: "project.00000001-0001-4001-8001-000000000001.location",
    value: "Moscow",
    type: "text",
  },
  "project.00000001-0001-4001-8001-000000000001.heroImage": {
    key: "project.00000001-0001-4001-8001-000000000001.heroImage",
    value: "/images/project-maiden-moscow.png",
    type: "image",
  },
  "project.00000001-0001-4001-8001-000000000001.bodyHtml": {
    key: "project.00000001-0001-4001-8001-000000000001.bodyHtml",
    value: MAIDENS_BODY_HTML_EN,
    type: "text",
  },
  "project.00000001-0001-4001-8001-000000000001.equipment": {
    key: "project.00000001-0001-4001-8001-000000000001.equipment",
    value: MAIDENS_EQUIPMENT,
    type: "json",
  },
  "project.00000001-0001-4001-8001-000000000001.year": {
    key: "project.00000001-0001-4001-8001-000000000001.year",
    value: "2025",
    type: "text",
  },
  "project.00000002-0002-4002-8002-000000000002.title": {
    key: "project.00000002-0002-4002-8002-000000000002.title",
    value: "Riverside Conference & Spa",
    type: "text",
  },
  "project.00000002-0002-4002-8002-000000000002.location": {
    key: "project.00000002-0002-4002-8002-000000000002.location",
    value: "Sochi",
    type: "text",
  },
  "project.00000002-0002-4002-8002-000000000002.heroImage": {
    key: "project.00000002-0002-4002-8002-000000000002.heroImage",
    value:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=80",
    type: "image",
  },
  "project.00000002-0002-4002-8002-000000000002.bodyHtml": {
    key: "project.00000002-0002-4002-8002-000000000002.bodyHtml",
    value: RIVERSIDE_BODY_HTML_EN,
    type: "text",
  },
  "project.00000002-0002-4002-8002-000000000002.equipment": {
    key: "project.00000002-0002-4002-8002-000000000002.equipment",
    value: RIVERSIDE_EQUIPMENT,
    type: "json",
  },
  "project.00000002-0002-4002-8002-000000000002.year": {
    key: "project.00000002-0002-4002-8002-000000000002.year",
    value: "2024",
    type: "text",
  },
  "project.00000003-0003-4003-8003-000000000003.title": {
    key: "project.00000003-0003-4003-8003-000000000003.title",
    value: "Urban Loft Apartments",
    type: "text",
  },
  "project.00000003-0003-4003-8003-000000000003.location": {
    key: "project.00000003-0003-4003-8003-000000000003.location",
    value: "Saint Petersburg",
    type: "text",
  },
  "project.00000003-0003-4003-8003-000000000003.heroImage": {
    key: "project.00000003-0003-4003-8003-000000000003.heroImage",
    value:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
    type: "image",
  },
  "project.00000003-0003-4003-8003-000000000003.bodyHtml": {
    key: "project.00000003-0003-4003-8003-000000000003.bodyHtml",
    value: URBAN_BODY_HTML_EN,
    type: "text",
  },
  "project.00000003-0003-4003-8003-000000000003.equipment": {
    key: "project.00000003-0003-4003-8003-000000000003.equipment",
    value: URBAN_EQUIPMENT,
    type: "json",
  },
  "project.00000003-0003-4003-8003-000000000003.year": {
    key: "project.00000003-0003-4003-8003-000000000003.year",
    value: "2023",
    type: "text",
  },
  "home.about.pdfLabel": {
    key: "home.about.pdfLabel",
    value: "Corporate brief (PDF)",
    type: "text",
  },
  "home.about.pdfHref": {
    key: "home.about.pdfHref",
    value: "https://datacom.example/",
    type: "text",
  },
  "home.about.companyCtaLabel": {
    key: "home.about.companyCtaLabel",
    value: "More about the company",
    type: "text",
  },
  "home.about.companyCtaHref": {
    key: "home.about.companyCtaHref",
    value: "company",
    type: "text",
  },
  "home.about.timelineStart": {
    key: "home.about.timelineStart",
    value: "2009",
    type: "text",
  },
  "home.about.timelineEnd": {
    key: "home.about.timelineEnd",
    value: "2024",
    type: "text",
  },
  "page.company.seo.title": {
    key: "page.company.seo.title",
    value: "Company — Datacom",
    type: "text",
  },
  "page.company.seo.description": {
    key: "page.company.seo.description",
    value:
      "Hotel IT integrator and equipment supplier: room automation, interactive TV, integrations across Russia.",
    type: "text",
  },
  "page.company.title": {
    key: "page.company.title",
    value: "Company",
    type: "text",
  },
  "page.company.intro": {
    key: "page.company.intro",
    value:
      "A hotel IT systems integrator and television supplier, and equipment provider for hotels.",
    type: "text",
  },
  "page.company.timelineStart": {
    key: "page.company.timelineStart",
    value: "2009",
    type: "text",
  },
  "page.company.timelineEnd": {
    key: "page.company.timelineEnd",
    value: "2024",
    type: "text",
  },
  "page.company.stats": {
    key: "page.company.stats",
    value: COMPANY_STATS_EN,
    type: "json",
  },
  "page.company.heroImageUrl": {
    key: "page.company.heroImageUrl",
    value: COMPANY_HERO_IMAGE_URL,
    type: "text",
  },
  "page.company.bodyHtml": {
    key: "page.company.bodyHtml",
    value: COMPANY_BODY_HTML_EN,
    type: "text",
  },
  "page.company.pdfLabel": {
    key: "page.company.pdfLabel",
    value: "Corporate brief (PDF)",
    type: "text",
  },
  "page.company.pdfHref": {
    key: "page.company.pdfHref",
    value: "https://datacom.example/",
    type: "text",
  },
  "page.company.clientsTitle": {
    key: "page.company.clientsTitle",
    value: "Trusted by hundreds of hotels across the country",
    type: "text",
  },
  "page.company.clientsSubtitle": {
    key: "page.company.clientsSubtitle",
    value: "Including leading international chains",
    type: "text",
  },
  "page.contacts.seo.title": {
    key: "page.contacts.seo.title",
    value: "Contacts — Datacom",
    type: "text",
  },
  "page.contacts.seo.description": {
    key: "page.contacts.seo.description",
    value:
      "Offices in Saint Petersburg and Moscow, technical support hotline, contact form.",
    type: "text",
  },
  "page.contacts.title": {
    key: "page.contacts.title",
    value: "Contacts",
    type: "text",
  },
  "page.contacts.offices": {
    key: "page.contacts.offices",
    value: CONTACTS_OFFICES_EN,
    type: "json",
  },
  "page.contacts.formTitle": {
    key: "page.contacts.formTitle",
    value: "Write to us",
    type: "text",
  },
  "page.contacts.formSubtitle": {
    key: "page.contacts.formSubtitle",
    value: "",
    type: "text",
  },
  "page.blog.seo.title": {
    key: "page.blog.seo.title",
    value: "News & publications — Datacom",
    type: "text",
  },
  "page.blog.seo.description": {
    key: "page.blog.seo.description",
    value:
      "Industry news, product updates and project stories from the Datacom team.",
    type: "text",
  },
  "page.blog.title": {
    key: "page.blog.title",
    value: "News & publications",
    type: "text",
  },
  "page.blog.subtitle": {
    key: "page.blog.subtitle",
    value: "",
    type: "text",
  },
  "page.blog.posts": {
    key: "page.blog.posts",
    value: BLOG_POSTS_EN,
    type: "json",
  },
  "page.blog.loadMoreLabel": {
    key: "page.blog.loadMoreLabel",
    value: "Show more",
    type: "text",
  },
  "page.equipment.seo.title": {
    key: "page.equipment.seo.title",
    value: "Equipment & systems — Datacom",
    type: "text",
  },
  "page.equipment.seo.description": {
    key: "page.equipment.seo.description",
    value:
      "Electronic locks, minibars, safes, TV, hotel PBX, room automation, headends and LAN for hotels.",
    type: "text",
  },
  "page.equipment.title": {
    key: "page.equipment.title",
    value: "Equipment & systems",
    type: "text",
  },
  "page.equipment.subtitle": {
    key: "page.equipment.subtitle",
    value: EQUIPMENT_PAGE_SUBTITLE_EN,
    type: "text",
  },
  "page.integrations.seo.title": {
    key: "page.integrations.seo.title",
    value: "Integrations — Datacom",
    type: "text",
  },
  "page.integrations.seo.description": {
    key: "page.integrations.seo.description",
    value:
      "Hotel IT system design, support, modernization, audit and commissioning across Russia.",
    type: "text",
  },
  "page.integrations.title": {
    key: "page.integrations.title",
    value: "Integrations",
    type: "text",
  },
  "page.integrations.subtitle": {
    key: "page.integrations.subtitle",
    value: INTEGRATIONS_PAGE_SUBTITLE_EN,
    type: "text",
  },
  "page.integrations.items": {
    key: "page.integrations.items",
    value: INTEGRATIONS_ITEMS_EN,
    type: "json",
  },
  "home.lead.title": {
    key: "home.lead.title",
    value: "Leave your details and we will get back to you",
    type: "text",
  },
  "home.lead.subtitle": {
    key: "home.lead.subtitle",
    value: "We will contact you to discuss equipment or integrations.",
    type: "text",
  },
  "home.lead.namePh": {
    key: "home.lead.namePh",
    value: "Name",
    type: "text",
  },
  "home.lead.phonePh": {
    key: "home.lead.phonePh",
    value: "Phone",
    type: "text",
  },
  "home.lead.emailPh": {
    key: "home.lead.emailPh",
    value: "E-mail",
    type: "text",
  },
  "home.lead.commentsPh": {
    key: "home.lead.commentsPh",
    value: "Comment or question",
    type: "text",
  },
  "home.lead.privacyLabel": {
    key: "home.lead.privacyLabel",
    value:
      "I agree to the privacy policy regarding personal data processing.",
    type: "text",
  },
  "home.lead.agreementLabel": {
    key: "home.lead.agreementLabel",
    value: "I consent to the processing of my personal data.",
    type: "text",
  },
  "home.lead.submitLabel": {
    key: "home.lead.submitLabel",
    value: "Send",
    type: "text",
  },
  "home.lead.consent": {
    key: "home.lead.consent",
    value: "",
    type: "text",
  },
  "home.lead.successMessage": {
    key: "home.lead.successMessage",
    value: "Thank you! We will contact you shortly.",
    type: "text",
  },
  "home.footer.tagline": {
    key: "home.footer.tagline",
    value: "Smart solutions for hotels",
    type: "text",
  },
  "home.footer.phone": {
    key: "home.footer.phone",
    value: "8 800 775 6676",
    type: "text",
  },
  "home.footer.phoneNote": {
    key: "home.footer.phoneNote",
    value: "Toll-free · 10:00–18:00 MSK",
    type: "text",
  },
  "home.footer.email": {
    key: "home.footer.email",
    value: "support@datacom.example",
    type: "text",
  },
  "home.footer.emailNote": {
    key: "home.footer.emailNote",
    value: "Technical support",
    type: "text",
  },
  "home.footer.columns": {
    key: "home.footer.columns",
    value: JSON.stringify([
      {
        title: "Equipment",
        links: [
          { label: "Locks", href: "#" },
          { label: "Minibars", href: "#" },
          { label: "Safes", href: "#" },
          { label: "TV", href: "#" },
        ],
      },
      {
        title: "Integrations",
        links: [
          { label: "Design", href: "#" },
          { label: "Support", href: "#" },
          { label: "Upgrade", href: "#" },
        ],
      },
    ]),
    type: "json",
  },
  "home.footer.copyright": {
    key: "home.footer.copyright",
    value: "© 2009—2026, Datacom LLC. All rights reserved.",
    type: "text",
  },
};

const ruHome: Record<string, ContentEntry> = {
  "home.seo.title": {
    key: "home.seo.title",
    value:
      "Datacom — Решения для отелей: оборудование и интеграции",
    type: "text",
  },
  "home.seo.description": {
    key: "home.seo.description",
    value:
      "Оборудование и системы для отелей любой категории: замки, минибары, ТВ, АТС, интеграции.",
    type: "text",
  },
  "home.header.phone": {
    key: "home.header.phone",
    value: "8 800 775 6676",
    type: "text",
  },
  "home.header.ctaConsult": {
    key: "home.header.ctaConsult",
    value: "Консультация",
    type: "text",
  },
  "home.header.logoText": {
    key: "home.header.logoText",
    value: "Datacom",
    type: "text",
  },
  "home.nav.items": {
    key: "home.nav.items",
    value: DEFAULT_NAV_ITEMS_RU,
    type: "json",
  },
  "home.nav.megaMenu": {
    key: "home.nav.megaMenu",
    value: DEFAULT_NAV_MEGA_MENU_RU,
    type: "json",
  },
  "home.hero.title": {
    key: "home.hero.title",
    value:
      "Решения для гостиниц, апартаментов, медицинских учреждений, круизных лайнеров и спортивных объектов",
    type: "text",
  },
  "home.hero.subtitle": {
    key: "home.hero.subtitle",
    value:
      "Оборудование, интерактивный сервис для гостей, интеграции — всё, чтобы оправдать ожидания.",
    type: "text",
  },
  "home.hero.ctaLabel": {
    key: "home.hero.ctaLabel",
    value: "Получить консультацию",
    type: "text",
  },
  "home.hero.ctaHref": {
    key: "home.hero.ctaHref",
    value: "contacts",
    type: "text",
  },
  "home.hero.imageUrl": {
    key: "home.hero.imageUrl",
    value:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80",
    type: "image",
  },
  "home.stats.equipmentTitle": {
    key: "home.stats.equipmentTitle",
    value: "Оборудование и системы",
    type: "text",
  },
  "home.stats.equipmentCount": {
    key: "home.stats.equipmentCount",
    value: "8",
    type: "text",
  },
  "home.stats.equipmentDesc": {
    key: "home.stats.equipmentDesc",
    value: "Надёжные решения для объектов размещения от ведущих брендов",
    type: "text",
  },
  "home.stats.integrationTitle": {
    key: "home.stats.integrationTitle",
    value: "Интеграции",
    type: "text",
  },
  "home.stats.integrationCount": {
    key: "home.stats.integrationCount",
    value: "4",
    type: "text",
  },
  "home.stats.integrationDesc": {
    key: "home.stats.integrationDesc",
    value:
      "Проектирование, бюджетирование, поставка, монтаж, обслуживание и модернизация",
    type: "text",
  },
  "home.spotlight.items": {
    key: "home.spotlight.items",
    value: JSON.stringify([
      {
        title: "Головные станции для приёма ТВ",
        desc: "Распределение сигнала и оборудование для номерного ТВ",
        href: "equipment/headends-tv-reception",
      },
      {
        title: "Обновление и модернизация систем",
        desc: "Модернизация без остановки объекта",
        href: "integrations/updating-modernizing-systems",
      },
    ]),
    type: "json",
  },
  "home.features.title": {
    key: "home.features.title",
    value: "Направления",
    type: "text",
  },
  "home.features.items": {
    key: "home.features.items",
    value: JSON.stringify([
      { title: "Электронные замки", desc: "Безопасный доступ для персонала и гостей" },
      { title: "Минибары и сейфы", desc: "Доход номера и спокойствие гостя" },
      { title: "ТВ и профпанели", desc: "Развлечения и навигация под брендом отеля" },
      { title: "Гостиничные АТС", desc: "Голос и единые коммуникации" },
      { title: "Автоматизация номеров", desc: "Климат, свет, сценарии" },
      { title: "Головные станции и ЛВС", desc: "Сигнал и инфраструктура" },
    ]),
    type: "json",
  },
  "home.about.title": {
    key: "home.about.title",
    value: "15 лет мы помогаем отелям предвосхищать ожидания гостей",
    type: "text",
  },
  "home.about.body": {
    key: "home.about.body",
    value:
      "Компания уже более 15 лет — интегратор гостиничных IT-систем и телевидения, поставщик оборудования. Автоматизация номеров, интерактивное ТВ, АТС, замки, сейфы, минибары, телевизоры и профессиональные панели.",
    type: "text",
  },
  "home.about.counterValue": {
    key: "home.about.counterValue",
    value: "98 789",
    type: "text",
  },
  "home.about.counterLabel": {
    key: "home.about.counterLabel",
    value: "успешно реализованный номерной фонд",
    type: "text",
  },
  "home.about.timelineCaption": {
    key: "home.about.timelineCaption",
    value: "Развитие компании на рынке гостиничных технологий",
    type: "text",
  },
  "home.about.imageUrl": {
    key: "home.about.imageUrl",
    value:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&q=80",
    type: "image",
  },
  "home.steps.title": {
    key: "home.steps.title",
    value: "Как мы работаем",
    type: "text",
  },
  "home.steps.items": {
    key: "home.steps.items",
    value: JSON.stringify([
      { title: "Аудит и проект", desc: "Согласуем объём, бюджет и сроки." },
      { title: "Поставка и монтаж", desc: "Сертифицированное оборудование и чистая сдача." },
      { title: "Запуск и поддержка", desc: "ПНР, обучение и сопровождение." },
    ]),
    type: "json",
  },
  "home.clients.title": {
    key: "home.clients.title",
    value: "Нам доверяют сотни отелей",
    type: "text",
  },
  "home.clients.subtitle": {
    key: "home.clients.subtitle",
    value: "Включая объекты ведущих международных сетей",
    type: "text",
  },
  "home.clients.brands": {
    key: "home.clients.brands",
    value: DEFAULT_CLIENT_LOGOS_JSON,
    type: "json",
  },
  "home.blog.title": {
    key: "home.blog.title",
    value: "Новости и статьи",
    type: "text",
  },
  "home.blog.subtitle": {
    key: "home.blog.subtitle",
    value: "Обзоры, обновления продуктов и истории проектов.",
    type: "text",
  },
  "home.blog.posts": {
    key: "home.blog.posts",
    value: JSON.stringify([
      {
        title: "Тренды гостиничного ТВ в 2026",
        href: "blog/hotel-tv-trends",
        meta: "Янв 2026",
        imageUrl:
          "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80",
      },
      {
        title: "Интеграция замков с PMS",
        href: "blog/locks-pms",
        meta: "Гайд",
        imageUrl:
          "https://images.unsplash.com/photo-1558008280-b9d87398e043?w=800&q=80",
      },
      {
        title: "Кейс: открытие флагмана",
        href: "blog/case-flagship",
        meta: "Проекты",
        imageUrl:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      },
    ]),
    type: "json",
  },
  "home.blog.ctaLabel": {
    key: "home.blog.ctaLabel",
    value: "Все новости и статьи",
    type: "text",
  },
  "home.blog.ctaHref": {
    key: "home.blog.ctaHref",
    value: "blog",
    type: "text",
  },
  "home.contactStrip.title": {
    key: "home.contactStrip.title",
    value:
      "Свяжитесь с нами — мы подберём идеальные решения для вашего объекта",
    type: "text",
  },
  "home.contactStrip.subtitle": {
    key: "home.contactStrip.subtitle",
    value: "Звонок бесплатный · пн–пт 10—18 МСК",
    type: "text",
  },
  "home.contactStrip.ctaLabel": {
    key: "home.contactStrip.ctaLabel",
    value: "Оставить заявку",
    type: "text",
  },
  "home.contactStrip.ctaHref": {
    key: "home.contactStrip.ctaHref",
    value: "#contacts",
    type: "text",
  },
  "home.projects.sectionTitle": {
    key: "home.projects.sectionTitle",
    value: "Проекты",
    type: "text",
  },
  "projects.list": {
    key: "projects.list",
    value: JSON.stringify([
      {
        title: "Maidens Hotel Moscow",
        location: "Москва",
        imageUrl: "/images/project-maiden-moscow.png",
        href: "projects/00000001-0001-4001-8001-000000000001",
      },
      {
        title: "Riverside Conference & Spa",
        location: "Сочи",
        imageUrl:
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
        href: "projects/00000002-0002-4002-8002-000000000002",
      },
      {
        title: "Urban Loft Apartments",
        location: "Санкт-Петербург",
        imageUrl:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
        href: "projects/00000003-0003-4003-8003-000000000003",
      },
    ]),
    type: "json",
  },
  "home.projects.ctaLabel": {
    key: "home.projects.ctaLabel",
    value: "Смотреть все проекты",
    type: "text",
  },
  "home.projects.ctaHref": {
    key: "home.projects.ctaHref",
    value: "projects",
    type: "text",
  },
  "project.00000001-0001-4001-8001-000000000001.title": {
    key: "project.00000001-0001-4001-8001-000000000001.title",
    value: "Maidens Hotel Moscow",
    type: "text",
  },
  "project.00000001-0001-4001-8001-000000000001.location": {
    key: "project.00000001-0001-4001-8001-000000000001.location",
    value: "Москва",
    type: "text",
  },
  "project.00000001-0001-4001-8001-000000000001.heroImage": {
    key: "project.00000001-0001-4001-8001-000000000001.heroImage",
    value: "/images/project-maiden-moscow.png",
    type: "image",
  },
  "project.00000001-0001-4001-8001-000000000001.bodyHtml": {
    key: "project.00000001-0001-4001-8001-000000000001.bodyHtml",
    value: MAIDENS_BODY_HTML_RU,
    type: "text",
  },
  "project.00000001-0001-4001-8001-000000000001.equipment": {
    key: "project.00000001-0001-4001-8001-000000000001.equipment",
    value: MAIDENS_EQUIPMENT,
    type: "json",
  },
  "project.00000001-0001-4001-8001-000000000001.year": {
    key: "project.00000001-0001-4001-8001-000000000001.year",
    value: "2025",
    type: "text",
  },
  "project.00000002-0002-4002-8002-000000000002.title": {
    key: "project.00000002-0002-4002-8002-000000000002.title",
    value: "Riverside Conference & Spa",
    type: "text",
  },
  "project.00000002-0002-4002-8002-000000000002.location": {
    key: "project.00000002-0002-4002-8002-000000000002.location",
    value: "Сочи",
    type: "text",
  },
  "project.00000002-0002-4002-8002-000000000002.heroImage": {
    key: "project.00000002-0002-4002-8002-000000000002.heroImage",
    value:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=80",
    type: "image",
  },
  "project.00000002-0002-4002-8002-000000000002.bodyHtml": {
    key: "project.00000002-0002-4002-8002-000000000002.bodyHtml",
    value: RIVERSIDE_BODY_HTML_RU,
    type: "text",
  },
  "project.00000002-0002-4002-8002-000000000002.equipment": {
    key: "project.00000002-0002-4002-8002-000000000002.equipment",
    value: RIVERSIDE_EQUIPMENT,
    type: "json",
  },
  "project.00000002-0002-4002-8002-000000000002.year": {
    key: "project.00000002-0002-4002-8002-000000000002.year",
    value: "2024",
    type: "text",
  },
  "project.00000003-0003-4003-8003-000000000003.title": {
    key: "project.00000003-0003-4003-8003-000000000003.title",
    value: "Urban Loft Apartments",
    type: "text",
  },
  "project.00000003-0003-4003-8003-000000000003.location": {
    key: "project.00000003-0003-4003-8003-000000000003.location",
    value: "Санкт-Петербург",
    type: "text",
  },
  "project.00000003-0003-4003-8003-000000000003.heroImage": {
    key: "project.00000003-0003-4003-8003-000000000003.heroImage",
    value:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
    type: "image",
  },
  "project.00000003-0003-4003-8003-000000000003.bodyHtml": {
    key: "project.00000003-0003-4003-8003-000000000003.bodyHtml",
    value: URBAN_BODY_HTML_RU,
    type: "text",
  },
  "project.00000003-0003-4003-8003-000000000003.equipment": {
    key: "project.00000003-0003-4003-8003-000000000003.equipment",
    value: URBAN_EQUIPMENT,
    type: "json",
  },
  "project.00000003-0003-4003-8003-000000000003.year": {
    key: "project.00000003-0003-4003-8003-000000000003.year",
    value: "2023",
    type: "text",
  },
  "home.about.pdfLabel": {
    key: "home.about.pdfLabel",
    value: "Корпоративный бриф [PDF]",
    type: "text",
  },
  "home.about.pdfHref": {
    key: "home.about.pdfHref",
    value: "https://datacom.example/",
    type: "text",
  },
  "home.about.companyCtaLabel": {
    key: "home.about.companyCtaLabel",
    value: "Подробнее о компании",
    type: "text",
  },
  "home.about.companyCtaHref": {
    key: "home.about.companyCtaHref",
    value: "company",
    type: "text",
  },
  "home.about.timelineStart": {
    key: "home.about.timelineStart",
    value: "2009",
    type: "text",
  },
  "home.about.timelineEnd": {
    key: "home.about.timelineEnd",
    value: "2024",
    type: "text",
  },
  "page.company.seo.title": {
    key: "page.company.seo.title",
    value: "Компания — Datacom",
    type: "text",
  },
  "page.company.seo.description": {
    key: "page.company.seo.description",
    value:
      "Системный интегратор гостиничных IT-систем и поставщик оборудования: автоматизация номеров, интеграции по всей России.",
    type: "text",
  },
  "page.company.title": {
    key: "page.company.title",
    value: "Компания",
    type: "text",
  },
  "page.company.intro": {
    key: "page.company.intro",
    value:
      "Системный интегратор гостиничных IT-систем и телевидения, а также поставщик оборудования для гостиниц.",
    type: "text",
  },
  "page.company.timelineStart": {
    key: "page.company.timelineStart",
    value: "2009",
    type: "text",
  },
  "page.company.timelineEnd": {
    key: "page.company.timelineEnd",
    value: "2024",
    type: "text",
  },
  "page.company.stats": {
    key: "page.company.stats",
    value: COMPANY_STATS_RU,
    type: "json",
  },
  "page.company.heroImageUrl": {
    key: "page.company.heroImageUrl",
    value: COMPANY_HERO_IMAGE_URL,
    type: "text",
  },
  "page.company.bodyHtml": {
    key: "page.company.bodyHtml",
    value: COMPANY_BODY_HTML_RU,
    type: "text",
  },
  "page.company.pdfLabel": {
    key: "page.company.pdfLabel",
    value: "Корпоративный бриф (PDF)",
    type: "text",
  },
  "page.company.pdfHref": {
    key: "page.company.pdfHref",
    value: "https://datacom.example/",
    type: "text",
  },
  "page.company.clientsTitle": {
    key: "page.company.clientsTitle",
    value:
      "Нам доверяют сотни отелей по всей стране, включая отели ведущих международных сетей",
    type: "text",
  },
  "page.company.clientsSubtitle": {
    key: "page.company.clientsSubtitle",
    value: "",
    type: "text",
  },
  "page.contacts.seo.title": {
    key: "page.contacts.seo.title",
    value: "Контакты — Datacom",
    type: "text",
  },
  "page.contacts.seo.description": {
    key: "page.contacts.seo.description",
    value:
      "Офисы в Санкт-Петербурге и Москве, линия технической поддержки, форма обратной связи.",
    type: "text",
  },
  "page.contacts.title": {
    key: "page.contacts.title",
    value: "Контакты",
    type: "text",
  },
  "page.contacts.offices": {
    key: "page.contacts.offices",
    value: CONTACTS_OFFICES_RU,
    type: "json",
  },
  "page.contacts.formTitle": {
    key: "page.contacts.formTitle",
    value: "Напишите нам",
    type: "text",
  },
  "page.contacts.formSubtitle": {
    key: "page.contacts.formSubtitle",
    value: "",
    type: "text",
  },
  "page.blog.seo.title": {
    key: "page.blog.seo.title",
    value: "Новости и публикации — Datacom",
    type: "text",
  },
  "page.blog.seo.description": {
    key: "page.blog.seo.description",
    value:
      "Новости отрасли, обновления продуктов и истории проектов от команды Datacom.",
    type: "text",
  },
  "page.blog.title": {
    key: "page.blog.title",
    value: "Новости и публикации",
    type: "text",
  },
  "page.blog.subtitle": {
    key: "page.blog.subtitle",
    value: "",
    type: "text",
  },
  "page.blog.posts": {
    key: "page.blog.posts",
    value: BLOG_POSTS_RU,
    type: "json",
  },
  "page.blog.loadMoreLabel": {
    key: "page.blog.loadMoreLabel",
    value: "Показать ещё",
    type: "text",
  },
  "page.equipment.seo.title": {
    key: "page.equipment.seo.title",
    value: "Оборудование и системы — Datacom",
    type: "text",
  },
  "page.equipment.seo.description": {
    key: "page.equipment.seo.description",
    value:
      "Электронные замки, минибары, сейфы, ТВ, АТС, автоматизация номеров, головные станции и ЛВС для отелей.",
    type: "text",
  },
  "page.equipment.title": {
    key: "page.equipment.title",
    value: "Оборудование и системы",
    type: "text",
  },
  "page.equipment.subtitle": {
    key: "page.equipment.subtitle",
    value: EQUIPMENT_PAGE_SUBTITLE_RU,
    type: "text",
  },
  "page.integrations.seo.title": {
    key: "page.integrations.seo.title",
    value: "Интеграции — Datacom",
    type: "text",
  },
  "page.integrations.seo.description": {
    key: "page.integrations.seo.description",
    value:
      "Проектирование, поддержка, модернизация, аудит и пуско-наладка гостиничных IT-систем по России.",
    type: "text",
  },
  "page.integrations.title": {
    key: "page.integrations.title",
    value: "Интеграции",
    type: "text",
  },
  "page.integrations.subtitle": {
    key: "page.integrations.subtitle",
    value: INTEGRATIONS_PAGE_SUBTITLE_RU,
    type: "text",
  },
  "page.integrations.items": {
    key: "page.integrations.items",
    value: INTEGRATIONS_ITEMS_RU,
    type: "json",
  },
  "home.lead.title": {
    key: "home.lead.title",
    value: "Оставьте контакты — мы свяжемся с вами",
    type: "text",
  },
  "home.lead.subtitle": {
    key: "home.lead.subtitle",
    value:
      "Мы перезвоним, чтобы обсудить оборудование или интеграции.",
    type: "text",
  },
  "home.lead.namePh": {
    key: "home.lead.namePh",
    value: "Имя",
    type: "text",
  },
  "home.lead.phonePh": {
    key: "home.lead.phonePh",
    value: "Телефон",
    type: "text",
  },
  "home.lead.emailPh": {
    key: "home.lead.emailPh",
    value: "E-mail",
    type: "text",
  },
  "home.lead.commentsPh": {
    key: "home.lead.commentsPh",
    value: "Комментарий или вопрос",
    type: "text",
  },
  "home.lead.privacyLabel": {
    key: "home.lead.privacyLabel",
    value:
      "Согласен(на) с политикой в отношении обработки персональных данных.",
    type: "text",
  },
  "home.lead.agreementLabel": {
    key: "home.lead.agreementLabel",
    value: "Даю согласие на обработку персональных данных.",
    type: "text",
  },
  "home.lead.submitLabel": {
    key: "home.lead.submitLabel",
    value: "Отправить",
    type: "text",
  },
  "home.lead.consent": {
    key: "home.lead.consent",
    value: "",
    type: "text",
  },
  "home.lead.successMessage": {
    key: "home.lead.successMessage",
    value: "Спасибо! Мы свяжемся с вами в ближайшее время.",
    type: "text",
  },
  "home.footer.tagline": {
    key: "home.footer.tagline",
    value: "Умные решения для отелей",
    type: "text",
  },
  "home.footer.phone": {
    key: "home.footer.phone",
    value: "8 800 775 6676",
    type: "text",
  },
  "home.footer.phoneNote": {
    key: "home.footer.phoneNote",
    value: "Звонок бесплатный · 10—18 МСК",
    type: "text",
  },
  "home.footer.email": {
    key: "home.footer.email",
    value: "support@datacom.example",
    type: "text",
  },
  "home.footer.emailNote": {
    key: "home.footer.emailNote",
    value: "Техническая поддержка",
    type: "text",
  },
  "home.footer.columns": {
    key: "home.footer.columns",
    value: JSON.stringify([
      {
        title: "Оборудование",
        links: [
          { label: "Замки", href: "#" },
          { label: "Минибары", href: "#" },
          { label: "Сейфы", href: "#" },
          { label: "ТВ", href: "#" },
        ],
      },
      {
        title: "Интеграции",
        links: [
          { label: "Проектирование", href: "#" },
          { label: "Поддержка", href: "#" },
          { label: "Модернизация", href: "#" },
        ],
      },
    ]),
    type: "json",
  },
  "home.footer.copyright": {
    key: "home.footer.copyright",
    value: "© 2009—2026, ООО «Датаком»",
    type: "text",
  },
};

Object.assign(enHome, blogPostSeedEntriesForLang("en"));
Object.assign(ruHome, blogPostSeedEntriesForLang("ru"));
Object.assign(enHome, equipmentCategorySeedEntriesForLang("en"));
Object.assign(ruHome, equipmentCategorySeedEntriesForLang("ru"));
Object.assign(enHome, integrationCategorySeedEntriesForLang("en"));
Object.assign(ruHome, integrationCategorySeedEntriesForLang("ru"));
Object.assign(enHome, equipmentProductSeedEntriesForLang("en"));
Object.assign(ruHome, equipmentProductSeedEntriesForLang("ru"));
Object.assign(enHome, cookieConsentSeedEntriesForLang("en"));
Object.assign(ruHome, cookieConsentSeedEntriesForLang("ru"));
Object.assign(enHome, privacyPageSeedEntriesForLang("en"));
Object.assign(ruHome, privacyPageSeedEntriesForLang("ru"));

function cloneEntries(
  source: Record<string, ContentEntry>
): Record<string, ContentEntry> {
  const out: Record<string, ContentEntry> = {};
  for (const k of Object.keys(source)) {
    const e = source[k];
    if (e) {
      out[k] = { ...e };
    }
  }
  return out;
}

function seedTemplateForLang(code: string): Record<string, ContentEntry> {
  /** Only `ru` has a dedicated seed file; every other locale copies EN defaults. */
  return code === "ru" ? ruHome : enHome;
}

/** All language codes that should have a CMS bucket (registry + any loaded store keys). */
function allLangCodesInStore(): string[] {
  const codes = new Set<string>();
  for (const lang of languages) {
    codes.add(lang.code);
  }
  for (const code of Object.keys(byLang)) {
    codes.add(code);
  }
  return [...codes];
}

/** Add missing seed keys for every configured language (e.g. new `page.company.*` after an upgrade). */
function mergeMissingSeedKeys(): boolean {
  let changed = false;
  for (const code of allLangCodesInStore()) {
    const seed = seedTemplateForLang(code);
    if (!byLang[code]) {
      byLang[code] = cloneEntries(seed);
      changed = true;
      continue;
    }
    const bucket = byLang[code];
    for (const [key, entry] of Object.entries(seed)) {
      if (!bucket[key]) {
        bucket[key] = { ...entry };
        changed = true;
      }
    }
  }
  if (repairLegacyNavKeysInStore(byLang)) {
    changed = true;
  }
  if (removeHotezaFromContentInStore(byLang)) {
    changed = true;
  }
  if (reconcileHomeClientBrandsAcrossLanguages(byLang)) {
    changed = true;
  }
  if (ensureEquipmentProductStubsFromCategoryCards(byLang)) {
    changed = true;
  }
  if (reconcileEquipmentCategoryProductCards(byLang)) {
    changed = true;
  }
  if (reconcilePrivacyPageSeeds(byLang)) {
    changed = true;
  }
  if (reconcileCookieConsentSeeds(byLang)) {
    changed = true;
  }
  return changed;
}

async function persistMissingSeedKeysToDatabase(): Promise<void> {
  const rows: {
    langCode: string;
    key: string;
    value: string;
    type: string;
  }[] = [];
  for (const lang of languages) {
    const bucket = byLang[lang.code];
    if (!bucket) {
      continue;
    }
    for (const entry of Object.values(bucket)) {
      rows.push({
        langCode: lang.code,
        key: entry.key,
        value: entry.value,
        type: entry.type,
      });
    }
  }
  if (rows.length === 0) {
    return;
  }
  await prisma.contentEntry.createMany({ data: rows, skipDuplicates: true });
}

const NAV_CONTENT_KEYS = ["home.nav.megaMenu", "home.nav.items"] as const;

async function persistNavKeysToDatabase(): Promise<void> {
  for (const [langCode, bucket] of Object.entries(byLang)) {
    for (const key of NAV_CONTENT_KEYS) {
      const entry = bucket[key];
      if (entry) {
        await upsertContentRow(langCode, key, entry);
      }
    }
  }
}

const byLang: Record<string, Record<string, ContentEntry>> = {
  en: cloneEntries(enHome),
  ru: cloneEntries(ruHome),
  ar: cloneEntries(enHome),
};

Object.assign(byLang.ar, privacyPageSeedEntriesForLang("ar"));
Object.assign(byLang.ar, cookieConsentSeedEntriesForLang("ar"));

/** File-backed store is only used when Postgres is not configured. */
const useFileBackedStore = !process.env.DATABASE_URL?.trim();

let languages: Language[] = [
  { code: "en", name: "English", active: true, dir: "ltr" },
  { code: "ru", name: "Русский", active: true, dir: "ltr" },
  { code: "ar", name: "العربية", active: true, dir: "rtl" },
];

if (useFileBackedStore) {
  const loadedLangs = loadPersistedLanguages();
  if (loadedLangs !== null) {
    languages = loadedLangs;
  }
  loadPersistedContentInto(byLang);
  if (mergeMissingSeedKeys()) {
    savePersistedContent(byLang);
  }
}

/** True after a failed Prisma connection so we fall back to JSON/seeds for this process. */
let cmsDatabaseUnavailable = false;

function isDbEnabled(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim()) && !cmsDatabaseUnavailable;
}

let contentHydrationPromise: Promise<void> | null = null;
let contentStoreHydrated = false;

async function seedDatabaseFromMemory(): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.language.createMany({
      data: languages.map((l) => ({
        code: l.code,
        name: l.name,
        active: l.active,
        dir: l.dir === "rtl" ? "rtl" : "ltr",
      })),
      skipDuplicates: true,
    });
    const rows: {
      langCode: string;
      key: string;
      value: string;
      type: string;
    }[] = [];
    for (const [langCode, bucket] of Object.entries(byLang)) {
      for (const entry of Object.values(bucket)) {
        rows.push({
          langCode,
          key: entry.key,
          value: entry.value,
          type: entry.type,
        });
      }
    }
    if (rows.length > 0) {
      await tx.contentEntry.createMany({ data: rows, skipDuplicates: true });
    }
  });
}

async function loadMemoryFromDatabase(): Promise<void> {
  const [langRows, contentRows] = await Promise.all([
    prisma.language.findMany({ orderBy: { code: "asc" } }),
    prisma.contentEntry.findMany(),
  ]);

  const nextByLang: Record<string, Record<string, ContentEntry>> = {};
  for (const row of contentRows) {
    if (!nextByLang[row.langCode]) {
      nextByLang[row.langCode] = {};
    }
    nextByLang[row.langCode][row.key] = {
      key: row.key,
      value: row.value,
      type: row.type as ContentValueType,
    };
  }

  for (const k of Object.keys(byLang)) {
    delete byLang[k];
  }
  for (const [code, bucket] of Object.entries(nextByLang)) {
    byLang[code] = bucket;
  }

  if (langRows.length > 0) {
    languages = langRows.map((r) => ({
      code: r.code,
      name: r.name,
      active: r.active,
      dir: r.dir === "rtl" ? ("rtl" as const) : ("ltr" as const),
    }));
  } else {
    const codes = Object.keys(byLang).sort();
    languages = codes.map((code) => ({
      code,
      name: code,
      active: true,
      dir: code === "ar" ? ("rtl" as const) : ("ltr" as const),
    }));
  }
}

async function performContentHydration(): Promise<void> {
  const count = await prisma.contentEntry.count();
  if (count === 0) {
    await seedDatabaseFromMemory();
  } else {
    await loadMemoryFromDatabase();
    if (reconcileHomeClientBrandsAcrossLanguages(byLang) && isDbEnabled()) {
      for (const [langCode, bucket] of Object.entries(byLang)) {
        const entry = bucket["home.clients.brands"];
        if (entry) {
          await upsertContentRow(langCode, entry.key, entry);
        }
      }
    }
    if (mergeMissingSeedKeys() && isDbEnabled()) {
      await persistMissingSeedKeysToDatabase();
      await persistNavKeysToDatabase();
    }
  }
}

/**
 * When `DATABASE_URL` is set, loads CMS state from PostgreSQL (or seeds the DB once from in-memory
 * seeds — not from `data/content-store.json`, which is ignored in DB mode).
 * If Postgres is unreachable, logs once and falls back to seeds + JSON files for this process.
 */
export async function ensureContentStoreHydrated(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    return;
  }
  if (contentStoreHydrated) {
    return;
  }
  if (!contentHydrationPromise) {
    contentHydrationPromise = (async () => {
      try {
        await performContentHydration();
      } catch (e) {
        console.error(
          "[datacom] PostgreSQL unreachable (check DATABASE_URL, Docker on port 5433, or local Postgres on 5432). CMS falls back to in-memory seeds plus data/content-store.json if present.",
          e
        );
        cmsDatabaseUnavailable = true;
        if (Object.keys(byLang).length === 0) {
          for (const lang of languages) {
            byLang[lang.code] = cloneEntries(seedTemplateForLang(lang.code));
          }
        }
        loadPersistedContentInto(byLang);
        const loadedLangs = loadPersistedLanguages();
        if (loadedLangs !== null) {
          languages = loadedLangs;
        }
        if (mergeMissingSeedKeys()) {
          savePersistedContent(byLang);
        }
      } finally {
        contentStoreHydrated = true;
      }
    })();
  }
  await contentHydrationPromise;
}

function assignContentEntry(
  lang: string,
  key: string,
  value: string,
  typeOverride?: ContentValueType
): void {
  if (!byLang[lang]) {
    byLang[lang] = {};
  }
  const existing = byLang[lang][key];
  const type = typeOverride ?? existing?.type ?? "text";
  byLang[lang][key] = { key, value, type };
}

async function upsertContentRow(
  lang: string,
  key: string,
  entry: ContentEntry
): Promise<void> {
  await prisma.contentEntry.upsert({
    where: { langCode_key: { langCode: lang, key } },
    create: {
      langCode: lang,
      key,
      value: entry.value,
      type: entry.type,
    },
    update: { value: entry.value, type: entry.type },
  });
}

function collectLanguageRowsForDb(): {
  code: string;
  name: string;
  active: boolean;
  dir: string;
}[] {
  return languages.map((l) => ({
    code: l.code,
    name: l.name,
    active: l.active,
    dir: l.dir === "rtl" ? "rtl" : "ltr",
  }));
}

function collectContentRowsForDb(): {
  langCode: string;
  key: string;
  value: string;
  type: string;
}[] {
  const rows: {
    langCode: string;
    key: string;
    value: string;
    type: string;
  }[] = [];
  for (const [langCode, bucket] of Object.entries(byLang)) {
    for (const entry of Object.values(bucket)) {
      rows.push({
        langCode,
        key: entry.key,
        value: entry.value,
        type: entry.type,
      });
    }
  }
  return rows;
}

/**
 * Writes the current in-memory CMS snapshot to PostgreSQL (seeds + optional JSON merge if you
 * loaded file-backed data before calling this). Run from `scripts/migrate-to-db.ts` after
 * `DATABASE_URL` is set and the schema exists.
 */
export async function pushLocalStoreToDatabase(options?: {
  /** When true (default), clears `Language` and `ContentEntry` before insert. */
  replace?: boolean;
}): Promise<{ languageCount: number; entryCount: number }> {
  const replace = options?.replace ?? true;
  const langRows = collectLanguageRowsForDb();
  const contentRows = collectContentRowsForDb();
  const chunkSize = 250;

  await prisma.$transaction(async (tx) => {
    if (replace) {
      await tx.contentEntry.deleteMany();
      await tx.language.deleteMany();
    }
    if (langRows.length > 0) {
      await tx.language.createMany({ data: langRows });
    }
    for (let i = 0; i < contentRows.length; i += chunkSize) {
      const slice = contentRows.slice(i, i + chunkSize);
      if (slice.length > 0) {
        await tx.contentEntry.createMany({ data: slice });
      }
    }
  });

  return {
    languageCount: langRows.length,
    entryCount: contentRows.length,
  };
}

export function getLanguages(): Language[] {
  return languages.filter((l) => l.active);
}

/** All configured languages (admin UI). */
export function getLanguagesAll(): Language[] {
  return languages.map((l) => ({ ...l }));
}

export async function setLanguages(next: Language[]): Promise<void> {
  const prevCodes = new Set(languages.map((l) => l.code));
  const nextCodes = new Set(next.map((l) => l.code));
  const dropped = [...prevCodes].filter((c) => !nextCodes.has(c));
  languages = next.map((l) => ({ ...l }));

  if (mergeMissingSeedKeys() && !isDbEnabled()) {
    savePersistedContent(byLang);
  }

  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    await prisma.$transaction(async (tx) => {
      if (dropped.length > 0) {
        await tx.contentEntry.deleteMany({
          where: { langCode: { in: dropped } },
        });
      }
      await tx.language.deleteMany();
      await tx.language.createMany({
        data: languages.map((l) => ({
          code: l.code,
          name: l.name,
          active: l.active,
          dir: l.dir === "rtl" ? "rtl" : "ltr",
        })),
      });
    });
  } else {
    savePersistedLanguages(languages);
  }
}

export function getLanguageByCode(code: string): Language | undefined {
  return languages.find((l) => l.code === code);
}

/** Ensure content bucket exists when adding a new language (copy from EN seed). */
export async function ensureLangContentBucket(langCode: string): Promise<void> {
  const seed = seedTemplateForLang(langCode);
  if (!byLang[langCode]) {
    byLang[langCode] = cloneEntries(seed);
  } else {
    const bucket = byLang[langCode];
    for (const [key, entry] of Object.entries(seed)) {
      if (!bucket[key]) {
        bucket[key] = { ...entry };
      }
    }
  }
  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    const rows = Object.values(byLang[langCode]!).map((e) => ({
      langCode,
      key: e.key,
      value: e.value,
      type: e.type,
    }));
    if (rows.length > 0) {
      await prisma.contentEntry.createMany({
        data: rows,
        skipDuplicates: true,
      });
    }
  } else {
    savePersistedContent(byLang);
  }
}

/** Same field resolution as project page: current lang bucket, then EN fallback. */
function resolveProjectFieldForLang(
  slug: string,
  lang: string,
  field: "heroImage" | "title" | "location"
): string {
  const bucket = byLang[lang] ?? byLang.en;
  for (const seg of projectKeyAliasesForLookup(slug)) {
    const key = `project.${seg}.${field}`;
    const direct = bucket[key]?.value?.trim();
    if (direct) {
      return direct;
    }
    if (lang !== "en" && byLang.en) {
      const enVal = byLang.en[key]?.value?.trim();
      if (enVal) {
        return enVal;
      }
    }
  }
  return "";
}

/**
 * Homepage teaser cards (`projects.list`) can duplicate slug/title/image. When `href` points at a
 * case study, overlay hero, title, and location from `project.{slug}.*` (same source as the project page).
 */
function mergeProjectFieldsIntoProjectCardsJson(raw: string, lang: string): string {
  let items: ProjectCardItem[] = [];
  try {
    const parsed = JSON.parse(raw ?? "[]") as unknown;
    items = Array.isArray(parsed) ? (parsed as ProjectCardItem[]) : [];
  } catch {
    return raw;
  }
  let changed = false;
  const next = items.map((item) => {
    const segment = projectKeySegmentFromCardHref(item.href);
    if (!segment) {
      return item;
    }
    let out = item;

    const hero = resolveProjectFieldForLang(segment, lang, "heroImage");
    if (hero && (out.imageUrl ?? "").trim() !== hero) {
      out = { ...out, imageUrl: hero };
      changed = true;
    }

    const title = resolveProjectFieldForLang(segment, lang, "title");
    if (title && (out.title ?? "").trim() !== title) {
      out = { ...out, title };
      changed = true;
    }

    const location = resolveProjectFieldForLang(segment, lang, "location");
    if (location && (out.location ?? "").trim() !== location) {
      out = { ...out, location };
      changed = true;
    }

    const canonHref = canonicalizeProjectCardHref(item.href ?? "");
    if (canonHref !== (item.href ?? "").trim()) {
      out = { ...out, href: canonHref };
      changed = true;
    }

    return out;
  });
  return changed ? JSON.stringify(next) : raw;
}

export function getPageContent(
  lang: string,
  page: string,
  slug?: string | null
): ContentEntry[] | null {
  const bucket = byLang[lang] ?? byLang.en;
  if (page === "home") {
    const entries = Object.values(bucket).sort((a, b) =>
      a.key.localeCompare(b.key)
    );
    return entries.map((e) => {
      if (e.key === "projects.list" || e.key === "home.projects.items") {
        const next = mergeProjectFieldsIntoProjectCardsJson(e.value, lang);
        return next === e.value ? e : { ...e, value: next };
      }
      return e;
    });
  }
  if (page === "project" && slug) {
    const segment = resolveProjectKeySegment(slug);
    if (!segment) {
      return null;
    }
    const canonicalSegment = normalizeProjectId(segment) ?? segment;
    let dataSegment: string | null = null;
    let entries: ContentEntry[] = [];
    for (const cand of projectKeyAliasesForLookup(segment)) {
      const p = `project.${cand}.`;
      const found = Object.values(bucket).filter((e) => e.key.startsWith(p));
      if (found.length > 0) {
        dataSegment = cand;
        entries = found;
        break;
      }
    }
    if (entries.length === 0 || dataSegment === null) {
      return null;
    }
    let outEntries =
      dataSegment !== canonicalSegment
        ? entries.map((e) => ({
            ...e,
            key: e.key.replace(
              `project.${dataSegment}.`,
              `project.${canonicalSegment}.`
            ),
          }))
        : entries;
    const heroKey = `project.${canonicalSegment}.heroImage`;
    const byKey = new Map(outEntries.map((e) => [e.key, { ...e }]));
    const heroEntry = byKey.get(heroKey);
    const heroEmpty = !heroEntry?.value?.trim();
    if (heroEmpty && lang !== "en" && byLang.en) {
      let enSource: ContentEntry | undefined;
      for (const seg of projectKeyAliasesForLookup(canonicalSegment)) {
        const k = `project.${seg}.heroImage`;
        const cand = byLang.en[k];
        if (cand?.value?.trim()) {
          enSource = cand;
          break;
        }
      }
      if (enSource?.value?.trim()) {
        if (heroEntry) {
          byKey.set(heroKey, { ...heroEntry, value: enSource.value });
        } else {
          byKey.set(heroKey, {
            key: heroKey,
            value: enSource.value,
            type: enSource.type,
          });
        }
      }
    }
    return [...byKey.values()].sort((a, b) => a.key.localeCompare(b.key));
  }
  if (page === "company") {
    const prefix = "page.company.";
    const entries = Object.values(bucket).filter((e) => e.key.startsWith(prefix));
    if (entries.length === 0) {
      return null;
    }
    return entries.sort((a, b) => a.key.localeCompare(b.key));
  }
  if (page === "contacts") {
    const prefix = "page.contacts.";
    const entries = Object.values(bucket).filter((e) => e.key.startsWith(prefix));
    if (entries.length === 0) {
      return null;
    }
    return entries.sort((a, b) => a.key.localeCompare(b.key));
  }
  if (page === "privacy") {
    const prefix = "page.privacy.";
    const entries = Object.values(bucket).filter((e) => e.key.startsWith(prefix));
    if (entries.length === 0) {
      return null;
    }
    return entries.sort((a, b) => a.key.localeCompare(b.key));
  }
  if (page === "blog") {
    const prefix = "page.blog.";
    const entries = Object.values(bucket).filter((e) => e.key.startsWith(prefix));
    if (entries.length === 0) {
      return null;
    }
    return entries.sort((a, b) => a.key.localeCompare(b.key));
  }
  if (page === "equipment") {
    const prefix = "page.equipment.";
    const entries = Object.values(bucket).filter((e) => e.key.startsWith(prefix));
    if (entries.length === 0) {
      return null;
    }
    return entries.sort((a, b) => a.key.localeCompare(b.key));
  }
  if (page === "integrations") {
    const prefix = "page.integrations.";
    const entries = Object.values(bucket).filter((e) => e.key.startsWith(prefix));
    if (entries.length === 0) {
      return null;
    }
    return entries.sort((a, b) => a.key.localeCompare(b.key));
  }
  if (page === "integrationCategory" && slug) {
    const segment = normalizeIntegrationCategorySlug(slug);
    if (!segment) {
      return null;
    }
    const prefix = `integration.${segment}.`;
    const entries = Object.values(bucket).filter((e) => e.key.startsWith(prefix));
    if (entries.length === 0) {
      return null;
    }
    let outEntries = entries.sort((a, b) => a.key.localeCompare(b.key));
    const heroKey = `integration.${segment}.heroImage`;
    const byKey = new Map(outEntries.map((e) => [e.key, { ...e }]));
    const heroEntry = byKey.get(heroKey);
    const heroEmpty = !heroEntry?.value?.trim();
    if (heroEmpty && lang !== "en" && byLang.en) {
      const enHero = byLang.en[heroKey];
      if (enHero?.value?.trim()) {
        if (heroEntry) {
          byKey.set(heroKey, { ...heroEntry, value: enHero.value });
        } else {
          byKey.set(heroKey, {
            key: heroKey,
            value: enHero.value,
            type: enHero.type,
          });
        }
      }
    }
    return [...byKey.values()].sort((a, b) => a.key.localeCompare(b.key));
  }
  if (page === "equipmentCategory" && slug) {
    const segment = normalizeEquipmentCategorySlug(slug);
    if (!segment) {
      return null;
    }
    const prefix = `equipment.${segment}.`;
    const entries = Object.values(bucket).filter((e) => e.key.startsWith(prefix));
    if (entries.length === 0) {
      return null;
    }
    let outEntries = entries.sort((a, b) => a.key.localeCompare(b.key));
    const heroKey = `equipment.${segment}.heroImage`;
    const byKey = new Map(outEntries.map((e) => [e.key, { ...e }]));
    const heroEntry = byKey.get(heroKey);
    const heroEmpty = !heroEntry?.value?.trim();
    if (heroEmpty && lang !== "en" && byLang.en) {
      const enHero = byLang.en[heroKey];
      if (enHero?.value?.trim()) {
        if (heroEntry) {
          byKey.set(heroKey, { ...heroEntry, value: enHero.value });
        } else {
          byKey.set(heroKey, {
            key: heroKey,
            value: enHero.value,
            type: enHero.type,
          });
        }
      }
    }
    const productSlugs = listEquipmentProductSlugsInCategory(segment);
    byKey.set(`equipment.${segment}._productSlugs`, {
      key: `equipment.${segment}._productSlugs`,
      value: JSON.stringify(productSlugs),
      type: "json",
    });
    byKey.set(`equipment.${segment}._productCatalog`, {
      key: `equipment.${segment}._productCatalog`,
      value: buildProductCatalogJsonForCategory(byLang, segment, lang),
      type: "json",
    });
    const productsKey = `equipment.${segment}.products`;
    const productsEntry = byKey.get(productsKey);
    if (productsEntry?.value) {
      const catalog = parseEquipmentCategoryProductCatalog(
        byKey.get(`equipment.${segment}._productCatalog`)?.value ?? "[]"
      );
      let cards: EquipmentProductItem[] = [];
      try {
        const parsed = JSON.parse(productsEntry.value) as unknown;
        if (Array.isArray(parsed)) {
          cards = parsed as EquipmentProductItem[];
        }
      } catch {
        cards = [];
      }
      const merged = buildCategoryProductsForDisplay(cards, catalog);
      byKey.set(productsKey, {
        ...productsEntry,
        value: JSON.stringify(merged),
      });
    }
    return [...byKey.values()].sort((a, b) => a.key.localeCompare(b.key));
  }
  if (page === "equipmentProduct" && slug) {
    const parsed = parseEquipmentProductRouteSlug(slug);
    if (!parsed) {
      return null;
    }
    const prefix = `${equipmentProductContentPrefix(
      parsed.categorySlug,
      parsed.productSlug
    )}.`;
    const entries = Object.values(bucket).filter((e) => e.key.startsWith(prefix));
    if (entries.length === 0) {
      return null;
    }
    let outEntries = entries.sort((a, b) => a.key.localeCompare(b.key));
    const imagesKey = `${equipmentProductContentPrefix(
      parsed.categorySlug,
      parsed.productSlug
    )}.images`;
    const byKey = new Map(outEntries.map((e) => [e.key, { ...e }]));
    const imagesEntry = byKey.get(imagesKey);
    const imagesEmpty = !imagesEntry?.value?.trim();
    if (imagesEmpty && lang !== "en" && byLang.en) {
      const enImages = byLang.en[imagesKey];
      if (enImages?.value?.trim()) {
        if (imagesEntry) {
          byKey.set(imagesKey, { ...imagesEntry, value: enImages.value });
        } else {
          byKey.set(imagesKey, {
            key: imagesKey,
            value: enImages.value,
            type: enImages.type,
          });
        }
      }
    }
    return [...byKey.values()].sort((a, b) => a.key.localeCompare(b.key));
  }
  if (page === "blogPost" && slug) {
    const segment = slug.trim().toLowerCase();
    if (!segment) {
      return null;
    }
    const prefix = `blog.${segment}.`;
    const entries = Object.values(bucket).filter((e) => e.key.startsWith(prefix));
    if (entries.length === 0) {
      return null;
    }
    let outEntries = entries.sort((a, b) => a.key.localeCompare(b.key));
    const heroKey = `blog.${segment}.heroImage`;
    const byKey = new Map(outEntries.map((e) => [e.key, { ...e }]));
    const heroEntry = byKey.get(heroKey);
    const heroEmpty = !heroEntry?.value?.trim();
    if (heroEmpty && lang !== "en" && byLang.en) {
      const enHero = byLang.en[heroKey];
      if (enHero?.value?.trim()) {
        if (heroEntry) {
          byKey.set(heroKey, { ...heroEntry, value: enHero.value });
        } else {
          byKey.set(heroKey, {
            key: heroKey,
            value: enHero.value,
            type: enHero.type,
          });
        }
      }
    }
    return [...byKey.values()].sort((a, b) => a.key.localeCompare(b.key));
  }
  return null;
}

export async function setContentValue(
  lang: string,
  key: string,
  value: string
): Promise<boolean> {
  /** Case-study hero is shared: any save updates every locale bucket (admin often edits from RU only). */
  const isSharedProjectHero = /^project\.[^.]+\.heroImage$/.test(key);
  const isSharedBlogHero = /^blog\.[^.]+\.heroImage$/.test(key);
  const isSharedEquipmentHero = /^equipment\.[^.]+\.heroImage$/.test(key);
  const isSharedClientLogos = key === "home.clients.brands";
  const isSharedCompanyMedia = key === "page.company.heroImageUrl";
  const isSharedEquipmentProductImages =
    /^equipment\.product\.[^.]+\.[^.]+\.images$/.test(key);
  const targetLangs =
    isSharedProjectHero ||
    isSharedBlogHero ||
    isSharedEquipmentHero ||
    isSharedClientLogos ||
    isSharedCompanyMedia ||
    isSharedEquipmentProductImages
      ? [...new Set([lang, ...Object.keys(byLang)])]
      : [lang];

  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
  }

  for (const lc of targetLangs) {
    if (!byLang[lc]) {
      byLang[lc] = {};
    }
    const existing = byLang[lc][key];
    if (!existing) {
      byLang[lc][key] = { key, value, type: "text" };
    } else {
      byLang[lc][key] = { ...existing, value };
    }
    const entry = byLang[lc][key]!;
    if (isDbEnabled()) {
      await upsertContentRow(lc, key, entry);
    }
  }

  if (!isDbEnabled()) {
    savePersistedContent(byLang);
  }

  const blogFieldMatch = key.match(/^blog\.([^.]+)\.(title|heroImage)$/);
  if (blogFieldMatch?.[1]) {
    syncBlogListCardFromPost(blogFieldMatch[1], lang);
    if (!isDbEnabled()) {
      savePersistedContent(byLang);
    }
  }

  const categoryProductsMatch = key.match(/^equipment\.([^.]+)\.products$/);
  if (categoryProductsMatch?.[1]) {
    const cat = normalizeEquipmentCategorySlug(categoryProductsMatch[1]);
    if (cat) {
      try {
        const parsed = JSON.parse(value) as unknown;
        if (Array.isArray(parsed)) {
          for (const row of parsed) {
            if (!row || typeof row !== "object") {
              continue;
            }
            const card = row as EquipmentProductItem;
            const slug = card.slug?.trim()
              ? resolveEquipmentProductSlug(card.slug)
              : null;
            if (slug) {
              await ensureEquipmentProductStub(cat, slug, card.title);
            }
          }
        }
      } catch {
        /* invalid JSON — skip stub sync */
      }
    }
  }

  return true;
}

const PROJECT_STUB_FIELDS = [
  "title",
  "location",
  "year",
  "heroImage",
  "bodyHtml",
  "equipment",
] as const;

/**
 * Creates empty `project.{id}.*` entries for every language bucket (admin: new case study).
 * `projectId` is a UUID (new projects) or a legacy slug segment.
 */
export async function ensureProjectStub(projectId: string): Promise<void> {
  const toPersist: { lang: string; key: string }[] = [];
  for (const lang of Object.keys(byLang)) {
    for (const field of PROJECT_STUB_FIELDS) {
      const key = `project.${projectId}.${field}`;
      if (!byLang[lang]?.[key]) {
        const initial = field === "equipment" ? "[]" : "";
        const type: ContentValueType = field === "equipment" ? "json" : "text";
        assignContentEntry(lang, key, initial, type);
        toPersist.push({ lang, key });
      }
    }
  }
  if (toPersist.length === 0) {
    return;
  }
  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    await Promise.all(
      toPersist.map(({ lang, key }) =>
        upsertContentRow(lang, key, byLang[lang]![key]!)
      )
    );
  } else {
    savePersistedContent(byLang);
  }
}

/** Appends a teaser card to `projects.list` for each language if that project id is not already linked. */
export async function appendProjectHomeCard(projectId: string): Promise<void> {
  const href = `projects/${projectId}`;
  const langsUpdated: string[] = [];
  const cardTitle =
    projectId.length > 13 ? `${projectId.slice(0, 8)}…` : projectId;
  for (const lang of Object.keys(byLang)) {
    const bucket = byLang[lang];
    if (!bucket) {
      continue;
    }
    const raw = bucket["projects.list"]?.value ?? "[]";
    let items: ProjectCardItem[] = [];
    try {
      const parsed = JSON.parse(raw) as unknown;
      items = Array.isArray(parsed) ? (parsed as ProjectCardItem[]) : [];
    } catch {
      items = [];
    }
    const exists = items.some(
      (it) => projectKeySegmentFromCardHref(it.href) === projectId
    );
    if (exists) {
      continue;
    }
    items.push({
      title: cardTitle,
      location: "",
      imageUrl: "",
      href,
    });
    assignContentEntry(
      lang,
      "projects.list",
      JSON.stringify(items),
      "json"
    );
    langsUpdated.push(lang);
  }
  if (langsUpdated.length === 0) {
    return;
  }
  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    await Promise.all(
      langsUpdated.map((lang) =>
        upsertContentRow(lang, "projects.list", byLang[lang]!["projects.list"]!)
      )
    );
  } else {
    savePersistedContent(byLang);
  }
}

function filterProjectCardsJson(
  raw: string | undefined,
  targetSegment: string
): { next: string; changed: boolean } {
  let items: ProjectCardItem[] = [];
  try {
    const parsed = JSON.parse(raw ?? "[]") as unknown;
    items = Array.isArray(parsed) ? (parsed as ProjectCardItem[]) : [];
  } catch {
    items = [];
  }
  const filtered = items.filter(
    (it) => projectKeySegmentFromCardHref(it.href) !== targetSegment
  );
  const changed = filtered.length !== items.length;
  return { next: JSON.stringify(filtered), changed };
}

/**
 * Removes all `project.{id}.*` keys and teaser cards pointing at this project
 * (`projects.list`, legacy `home.projects.items`) for every language bucket.
 */
export async function deleteProject(rawSegment: string): Promise<boolean> {
  const segment = resolveProjectKeySegment(rawSegment);
  if (!segment) {
    return false;
  }
  const prefix = `project.${segment}.`;

  for (const lang of Object.keys(byLang)) {
    const bucket = byLang[lang];
    if (!bucket) {
      continue;
    }

    for (const key of Object.keys(bucket)) {
      if (key.startsWith(prefix)) {
        delete bucket[key];
      }
    }

    const listEntry = bucket["projects.list"];
    if (listEntry) {
      const { next, changed } = filterProjectCardsJson(listEntry.value, segment);
      if (changed) {
        assignContentEntry(
          lang,
          "projects.list",
          next,
          listEntry.type
        );
      }
    }

    const legacy = bucket["home.projects.items"];
    if (legacy) {
      const { next, changed } = filterProjectCardsJson(legacy.value, segment);
      if (changed) {
        assignContentEntry(
          lang,
          "home.projects.items",
          next,
          legacy.type
        );
      }
    }
  }

  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    const listKeys = ["projects.list", "home.projects.items"] as const;
    await prisma.$transaction(async (tx) => {
      await tx.contentEntry.deleteMany({
        where: { key: { startsWith: prefix } },
      });
      const listRows = await tx.contentEntry.findMany({
        where: { key: { in: [...listKeys] } },
      });
      for (const row of listRows) {
        const { next, changed } = filterProjectCardsJson(row.value, segment);
        if (changed) {
          await tx.contentEntry.update({
            where: {
              langCode_key: { langCode: row.langCode, key: row.key },
            },
            data: { value: next },
          });
          assignContentEntry(
            row.langCode,
            row.key,
            next,
            row.type as ContentValueType
          );
        }
      }
    });
  } else {
    savePersistedContent(byLang);
  }
  return true;
}

const BLOG_STUB_FIELDS = [
  "title",
  "location",
  "year",
  "heroImage",
  "bodyHtml",
  "equipment",
] as const;

export function blogPostSlugExists(slug: string): boolean {
  const prefix = `blog.${slug}.`;
  for (const bucket of Object.values(byLang)) {
    if (Object.keys(bucket).some((k) => k.startsWith(prefix))) {
      return true;
    }
  }
  return false;
}

export async function ensureBlogPostStub(
  slug: string,
  initialTitle = ""
): Promise<void> {
  const toPersist: { lang: string; key: string }[] = [];
  for (const lang of Object.keys(byLang)) {
    for (const field of BLOG_STUB_FIELDS) {
      const key = `blog.${slug}.${field}`;
      if (!byLang[lang]?.[key]) {
        let initial = "";
        if (field === "equipment") {
          initial = "[]";
        } else if (field === "title") {
          initial = initialTitle;
        }
        const type: ContentValueType =
          field === "equipment" ? "json" : field === "heroImage" ? "image" : "text";
        assignContentEntry(lang, key, initial, type);
        toPersist.push({ lang, key });
      } else if (field === "title" && initialTitle) {
        const cur = byLang[lang]![key]!.value.trim();
        if (!cur) {
          assignContentEntry(lang, key, initialTitle, "text");
          toPersist.push({ lang, key });
        }
      }
    }
  }
  if (toPersist.length === 0) {
    return;
  }
  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    await Promise.all(
      toPersist.map(({ lang, key }) =>
        upsertContentRow(lang, key, byLang[lang]![key]!)
      )
    );
  } else {
    savePersistedContent(byLang);
  }
}

function readBlogPostCardFields(slug: string, lang: string): {
  title: string;
  imageUrl: string;
  meta: string;
} {
  const bucket = byLang[lang] ?? byLang.en ?? {};
  const title = bucket[`blog.${slug}.title`]?.value?.trim() ?? slug;
  const hero =
    bucket[`blog.${slug}.heroImage`]?.value?.trim() ??
    byLang.en?.[`blog.${slug}.heroImage`]?.value?.trim() ??
    "";
  const meta =
    bucket[`blog.${slug}.location`]?.value?.trim() ??
    bucket[`blog.${slug}.year`]?.value?.trim() ??
    "";
  return { title, imageUrl: hero, meta };
}

function upsertBlogCardInJson(
  raw: string | undefined,
  slug: string,
  lang: string
): { next: string; changed: boolean } {
  let items: BlogTeaserPost[] = [];
  try {
    const parsed = JSON.parse(raw ?? "[]") as unknown;
    items = Array.isArray(parsed) ? (parsed as BlogTeaserPost[]) : [];
  } catch {
    items = [];
  }
  const href = `blog/${slug}`;
  const fields = readBlogPostCardFields(slug, lang);
  const idx = items.findIndex(
    (it) => blogKeySegmentFromCardHref(it.href) === slug
  );
  const card: BlogTeaserPost = {
    title: fields.title,
    href,
    meta: fields.meta || undefined,
    imageUrl: fields.imageUrl || undefined,
  };
  if (idx >= 0) {
    const prev = items[idx]!;
    const same =
      prev.title === card.title &&
      prev.href === card.href &&
      (prev.meta ?? "") === (card.meta ?? "") &&
      (prev.imageUrl ?? "") === (card.imageUrl ?? "");
    if (same) {
      return { next: raw ?? "[]", changed: false };
    }
    const nextItems = [...items];
    nextItems[idx] = card;
    return { next: JSON.stringify(nextItems), changed: true };
  }
  items.push(card);
  return { next: JSON.stringify(items), changed: true };
}

/** Updates list cards in `page.blog.posts` / `home.blog.posts` from article fields. */
function syncBlogListCardFromPost(slug: string, lang: string): void {
  const bucket = byLang[lang];
  if (!bucket) {
    return;
  }
  for (const listKey of ["page.blog.posts", "home.blog.posts"] as const) {
    const entry = bucket[listKey];
    if (!entry) {
      continue;
    }
    const { next, changed } = upsertBlogCardInJson(entry.value, slug, lang);
    if (changed) {
      assignContentEntry(lang, listKey, next, entry.type);
    }
  }
}

export async function appendBlogListCard(
  slug: string,
  options: {
    title?: string;
    addToBlogIndex?: boolean;
    addToHomeTeaser?: boolean;
  }
): Promise<void> {
  const href = `blog/${slug}`;
  const langsUpdated: string[] = [];

  for (const lang of Object.keys(byLang)) {
    const bucket = byLang[lang];
    if (!bucket) {
      continue;
    }
    const cardTitle =
      options.title?.trim() ||
      bucket[`blog.${slug}.title`]?.value?.trim() ||
      slug;
    const hero =
      bucket[`blog.${slug}.heroImage`]?.value?.trim() ??
      byLang.en?.[`blog.${slug}.heroImage`]?.value?.trim() ??
      "";
    const meta =
      bucket[`blog.${slug}.location`]?.value?.trim() ??
      bucket[`blog.${slug}.year`]?.value?.trim() ??
      "";

    const keysToUpdate: ("page.blog.posts" | "home.blog.posts")[] = [];
    if (options.addToBlogIndex !== false) {
      keysToUpdate.push("page.blog.posts");
    }
    if (options.addToHomeTeaser) {
      keysToUpdate.push("home.blog.posts");
    }

    for (const listKey of keysToUpdate) {
      let items: BlogTeaserPost[] = [];
      try {
        const parsed = JSON.parse(bucket[listKey]?.value ?? "[]") as unknown;
        items = Array.isArray(parsed) ? (parsed as BlogTeaserPost[]) : [];
      } catch {
        items = [];
      }
      if (items.some((it) => blogKeySegmentFromCardHref(it.href) === slug)) {
        continue;
      }
      items.push({
        title: cardTitle,
        href,
        meta: meta || undefined,
        imageUrl: hero || undefined,
      });
      assignContentEntry(lang, listKey, JSON.stringify(items), "json");
      if (!langsUpdated.includes(lang)) {
        langsUpdated.push(lang);
      }
    }
  }

  if (langsUpdated.length === 0) {
    return;
  }
  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    await Promise.all(
      langsUpdated.flatMap((lang) =>
        (["page.blog.posts", "home.blog.posts"] as const)
          .filter((k) => byLang[lang]?.[k])
          .map((k) => upsertContentRow(lang, k, byLang[lang]![k]!))
      )
    );
  } else {
    savePersistedContent(byLang);
  }
}

function filterBlogCardsJson(
  raw: string | undefined,
  targetSlug: string
): { next: string; changed: boolean } {
  let items: BlogTeaserPost[] = [];
  try {
    const parsed = JSON.parse(raw ?? "[]") as unknown;
    items = Array.isArray(parsed) ? (parsed as BlogTeaserPost[]) : [];
  } catch {
    items = [];
  }
  const filtered = items.filter(
    (it) => blogKeySegmentFromCardHref(it.href) !== targetSlug
  );
  return {
    next: JSON.stringify(filtered),
    changed: filtered.length !== items.length,
  };
}

export async function deleteBlogPost(rawSlug: string): Promise<boolean> {
  const slug = rawSlug.trim().toLowerCase();
  if (!slug) {
    return false;
  }
  const prefix = `blog.${slug}.`;
  const listKeys = ["page.blog.posts", "home.blog.posts"] as const;

  for (const lang of Object.keys(byLang)) {
    const bucket = byLang[lang];
    if (!bucket) {
      continue;
    }
    for (const key of Object.keys(bucket)) {
      if (key.startsWith(prefix)) {
        delete bucket[key];
      }
    }
    for (const listKey of listKeys) {
      const entry = bucket[listKey];
      if (!entry) {
        continue;
      }
      const { next, changed } = filterBlogCardsJson(entry.value, slug);
      if (changed) {
        assignContentEntry(lang, listKey, next, entry.type);
      }
    }
  }

  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    await prisma.$transaction(async (tx) => {
      await tx.contentEntry.deleteMany({
        where: { key: { startsWith: prefix } },
      });
      const listRows = await tx.contentEntry.findMany({
        where: { key: { in: [...listKeys] } },
      });
      for (const row of listRows) {
        const { next, changed } = filterBlogCardsJson(row.value, slug);
        if (changed) {
          await tx.contentEntry.update({
            where: {
              langCode_key: { langCode: row.langCode, key: row.key },
            },
            data: { value: next },
          });
          assignContentEntry(
            row.langCode,
            row.key,
            next,
            row.type as ContentValueType
          );
        }
      }
    });
  } else {
    savePersistedContent(byLang);
  }
  return true;
}

const EQUIPMENT_CATEGORY_STUB_FIELDS = [
  "seo.title",
  "seo.description",
  "eyebrow",
  "title",
  "subtitle",
  "heroImage",
  "highlights",
  "featureSections",
  "productsTitle",
  "products",
  "specsTitle",
  "specs",
  "ctaLabel",
  "ctaHref",
  "pdfLabel",
  "pdfHref",
  "backLabel",
  "bodyHtml",
] as const;

export function equipmentCategorySlugExists(slug: string): boolean {
  const segment = normalizeEquipmentCategorySlug(slug);
  if (!segment) {
    return false;
  }
  const prefix = `equipment.${segment}.`;
  for (const bucket of Object.values(byLang)) {
    if (Object.keys(bucket).some((k) => k.startsWith(prefix))) {
      return true;
    }
  }
  return false;
}

function equipmentCategoryInMegaMenu(slug: string): boolean {
  const href = equipmentCategoryHrefFromSlug(slug);
  for (const bucket of Object.values(byLang)) {
    const raw = bucket["home.nav.megaMenu"]?.value ?? "";
    const items = parseMegaMenuItems(raw);
    const idx = findEquipmentMegaItemIndex(items);
    if (idx < 0) {
      continue;
    }
    const children = items[idx]?.children ?? [];
    if (
      children.some(
        (c) => equipmentCategorySlugFromNavHref(c.href) === slug
      )
    ) {
      return true;
    }
    if (children.some((c) => c.href === href)) {
      return true;
    }
  }
  return false;
}

export async function ensureEquipmentCategoryStub(
  slug: string,
  initialTitle = ""
): Promise<void> {
  const segment = normalizeEquipmentCategorySlug(slug);
  if (!segment) {
    return;
  }
  const toPersist: { lang: string; key: string }[] = [];
  for (const lang of Object.keys(byLang)) {
    for (const field of EQUIPMENT_CATEGORY_STUB_FIELDS) {
      const key = `equipment.${segment}.${field}`;
      if (!byLang[lang]?.[key]) {
        let initial = "";
        if (field === "title") {
          initial = initialTitle;
        } else if (
          field === "highlights" ||
          field === "featureSections" ||
          field === "products" ||
          field === "specs"
        ) {
          initial = "[]";
        }
        const type: ContentValueType =
          field === "heroImage"
            ? "image"
            : field === "highlights" ||
                field === "featureSections" ||
                field === "products" ||
                field === "specs"
              ? "json"
              : "text";
        assignContentEntry(lang, key, initial, type);
        toPersist.push({ lang, key });
      } else if (field === "title" && initialTitle) {
        const cur = byLang[lang]![key]!.value.trim();
        if (!cur) {
          assignContentEntry(lang, key, initialTitle, "text");
          toPersist.push({ lang, key });
        }
      }
    }
  }
  if (toPersist.length === 0) {
    return;
  }
  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    await Promise.all(
      toPersist.map(({ lang, key }) =>
        upsertContentRow(lang, key, byLang[lang]![key]!)
      )
    );
  } else {
    savePersistedContent(byLang);
  }
}

export async function appendEquipmentMegaMenuChild(
  slug: string,
  options: { title?: string; desc?: string; imageUrl?: string }
): Promise<void> {
  const segment = normalizeEquipmentCategorySlug(slug);
  if (!segment) {
    return;
  }
  const href = equipmentCategoryHrefFromSlug(segment);
  const langsUpdated: string[] = [];

  for (const lang of Object.keys(byLang)) {
    const bucket = byLang[lang];
    if (!bucket) {
      continue;
    }
    const entry = bucket["home.nav.megaMenu"];
    const items = parseMegaMenuItems(entry?.value ?? "");
    const idx = findEquipmentMegaItemIndex(items);
    if (idx < 0) {
      continue;
    }
    const row = items[idx];
    if (!row) {
      continue;
    }
    const children = [...(row.children ?? [])];
    if (
      children.some(
        (c) => equipmentCategorySlugFromNavHref(c.href) === segment
      )
    ) {
      continue;
    }
    const label =
      options.title?.trim() ||
      bucket[`equipment.${segment}.title`]?.value?.trim() ||
      segment;
    const desc =
      options.desc?.trim() ||
      bucket[`equipment.${segment}.subtitle`]?.value?.trim() ||
      "";
    const imageUrl =
      options.imageUrl?.trim() ||
      bucket[`equipment.${segment}.heroImage`]?.value?.trim() ||
      "";
    children.push({
      label,
      href,
      desc: desc || undefined,
      imageUrl: imageUrl || undefined,
    });
    items[idx] = { ...row, children };
    const next = serializeMegaMenuItems(items);
    assignContentEntry(lang, "home.nav.megaMenu", next, "json");
    langsUpdated.push(lang);
  }

  if (langsUpdated.length === 0) {
    return;
  }
  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    await Promise.all(
      langsUpdated.map((lang) =>
        upsertContentRow(
          lang,
          "home.nav.megaMenu",
          byLang[lang]!["home.nav.megaMenu"]!
        )
      )
    );
  } else {
    savePersistedContent(byLang);
  }
}

export async function deleteEquipmentCategory(rawSlug: string): Promise<boolean> {
  const segment = normalizeEquipmentCategorySlug(rawSlug);
  if (!segment) {
    return false;
  }
  const prefix = `equipment.${segment}.`;
  const href = equipmentCategoryHrefFromSlug(segment);

  for (const lang of Object.keys(byLang)) {
    const bucket = byLang[lang];
    if (!bucket) {
      continue;
    }
    for (const key of Object.keys(bucket)) {
      if (key.startsWith(prefix)) {
        delete bucket[key];
      }
    }
    const entry = bucket["home.nav.megaMenu"];
    if (entry) {
      const items = parseMegaMenuItems(entry.value);
      const idx = findEquipmentMegaItemIndex(items);
      if (idx >= 0) {
        const row = items[idx];
        if (row) {
          const children = (row.children ?? []).filter(
            (c) =>
              equipmentCategorySlugFromNavHref(c.href) !== segment &&
              c.href !== href
          );
          items[idx] = { ...row, children };
          assignContentEntry(
            lang,
            "home.nav.megaMenu",
            serializeMegaMenuItems(items),
            "json"
          );
        }
      }
    }
  }

  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    await prisma.$transaction(async (tx) => {
      await tx.contentEntry.deleteMany({
        where: { key: { startsWith: prefix } },
      });
      const megaRows = await tx.contentEntry.findMany({
        where: { key: "home.nav.megaMenu" },
      });
      for (const row of megaRows) {
        const items = parseMegaMenuItems(row.value);
        const idx = findEquipmentMegaItemIndex(items);
        if (idx < 0) {
          continue;
        }
        const equipmentRow = items[idx];
        if (!equipmentRow) {
          continue;
        }
        const children = (equipmentRow.children ?? []).filter(
          (c) =>
            equipmentCategorySlugFromNavHref(c.href) !== segment &&
            c.href !== href
        );
        if (children.length === (equipmentRow.children ?? []).length) {
          continue;
        }
        items[idx] = { ...equipmentRow, children };
        const next = serializeMegaMenuItems(items);
        await tx.contentEntry.update({
          where: {
            langCode_key: { langCode: row.langCode, key: row.key },
          },
          data: { value: next },
        });
        assignContentEntry(row.langCode, row.key, next, "json");
      }
    });
  } else {
    savePersistedContent(byLang);
  }
  return true;
}

export function uniqueEquipmentCategorySlug(base: string): string {
  let slug =
    normalizeEquipmentCategorySlug(base) ??
    slugifyEquipmentCategoryTitle(base);
  if (!equipmentCategorySlugExists(slug) && !equipmentCategoryInMegaMenu(slug)) {
    return slug;
  }
  let n = 2;
  while (
    equipmentCategorySlugExists(`${slug}-${n}`) ||
    equipmentCategoryInMegaMenu(`${slug}-${n}`)
  ) {
    n++;
  }
  return `${slug}-${n}`;
}

const INTEGRATION_CATEGORY_STUB_FIELDS = [
  "seo.title",
  "seo.description",
  "eyebrow",
  "title",
  "subtitle",
  "heroImage",
  "highlights",
  "specsTitle",
  "specs",
  "ctaLabel",
  "ctaHref",
  "pdfLabel",
  "pdfHref",
  "backLabel",
  "bodyHtml",
] as const;

export function integrationCategorySlugExists(slug: string): boolean {
  const segment = normalizeIntegrationCategorySlug(slug);
  if (!segment) {
    return false;
  }
  const prefix = `integration.${segment}.`;
  for (const bucket of Object.values(byLang)) {
    if (bucket && Object.keys(bucket).some((k) => k.startsWith(prefix))) {
      return true;
    }
  }
  return false;
}

function integrationCategoryInMegaMenu(slug: string): boolean {
  const segment = normalizeIntegrationCategorySlug(slug);
  if (!segment) {
    return false;
  }
  const href = integrationCategoryHrefFromSlug(segment);
  for (const bucket of Object.values(byLang)) {
    const entry = bucket?.["home.nav.megaMenu"];
    const items = parseMegaMenuItems(entry?.value ?? "");
    const idx = findIntegrationsMegaItemIndex(items);
    if (idx < 0) {
      continue;
    }
    const children = items[idx]?.children ?? [];
    if (
      children.some(
        (c) => integrationCategorySlugFromNavHref(c.href) === segment
      )
    ) {
      return true;
    }
    if (children.some((c) => c.href === href)) {
      return true;
    }
  }
  return false;
}

export function uniqueIntegrationCategorySlug(base: string): string {
  let slug =
    normalizeIntegrationCategorySlug(base) ??
    slugifyIntegrationCategoryTitle(base);
  if (
    !integrationCategorySlugExists(slug) &&
    !integrationCategoryInMegaMenu(slug)
  ) {
    return slug;
  }
  let n = 2;
  while (
    integrationCategorySlugExists(`${slug}-${n}`) ||
    integrationCategoryInMegaMenu(`${slug}-${n}`)
  ) {
    n++;
  }
  return `${slug}-${n}`;
}

function syncIntegrationsHubItemsForLang(
  lang: string,
  segment: string,
  mode: "upsert" | "remove"
): void {
  const bucket = byLang[lang];
  if (!bucket) {
    return;
  }
  const hubKey = "page.integrations.items";
  const hubEntry = bucket[hubKey];
  const items = parseJsonArray<SpotlightCard>(hubEntry?.value ?? "[]", []);
  const href = integrationCategoryHrefFromSlug(segment);
  const title =
    bucket[`integration.${segment}.title`]?.value?.trim() || segment;
  const desc =
    bucket[`integration.${segment}.subtitle`]?.value?.trim() || "";
  const imageUrl =
    bucket[`integration.${segment}.heroImage`]?.value?.trim() || "";
  const idx = items.findIndex(
    (item) =>
      integrationCategorySlugFromNavHref(item.href) === segment ||
      item.href === href
  );
  if (mode === "remove") {
    if (idx < 0) {
      return;
    }
    const next = items.filter((_, i) => i !== idx);
    assignContentEntry(lang, hubKey, JSON.stringify(next), "json");
    return;
  }
  const row: SpotlightCard = {
    title,
    desc,
    href,
    ...(imageUrl ? { imageUrl } : {}),
  };
  const next = [...items];
  if (idx >= 0) {
    next[idx] = { ...next[idx], ...row };
  } else {
    next.push(row);
  }
  assignContentEntry(lang, hubKey, JSON.stringify(next), "json");
}

export async function ensureIntegrationCategoryStub(
  slug: string,
  initialTitle = ""
): Promise<void> {
  const segment = normalizeIntegrationCategorySlug(slug);
  if (!segment) {
    return;
  }
  const toPersist: { lang: string; key: string }[] = [];
  for (const lang of Object.keys(byLang)) {
    for (const field of INTEGRATION_CATEGORY_STUB_FIELDS) {
      const key = `integration.${segment}.${field}`;
      if (!byLang[lang]?.[key]) {
        let initial = "";
        if (field === "title") {
          initial = initialTitle;
        } else if (field === "highlights" || field === "specs") {
          initial = "[]";
        }
        const type: ContentValueType =
          field === "heroImage"
            ? "image"
            : field === "highlights" || field === "specs"
              ? "json"
              : "text";
        assignContentEntry(lang, key, initial, type);
        toPersist.push({ lang, key });
      } else if (field === "title" && initialTitle) {
        const cur = byLang[lang]![key]!.value.trim();
        if (!cur) {
          assignContentEntry(lang, key, initialTitle, "text");
          toPersist.push({ lang, key });
        }
      }
    }
    syncIntegrationsHubItemsForLang(lang, segment, "upsert");
    toPersist.push({ lang, key: "page.integrations.items" });
  }
  if (toPersist.length === 0) {
    return;
  }
  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    await Promise.all(
      toPersist.map(({ lang, key }) =>
        upsertContentRow(lang, key, byLang[lang]![key]!)
      )
    );
  } else {
    savePersistedContent(byLang);
  }
}

export async function appendIntegrationsMegaMenuChild(
  slug: string,
  options: { title?: string; desc?: string; imageUrl?: string }
): Promise<void> {
  const segment = normalizeIntegrationCategorySlug(slug);
  if (!segment) {
    return;
  }
  const href = integrationCategoryHrefFromSlug(segment);
  const langsUpdated: string[] = [];

  for (const lang of Object.keys(byLang)) {
    const bucket = byLang[lang];
    if (!bucket) {
      continue;
    }
    const entry = bucket["home.nav.megaMenu"];
    const items = parseMegaMenuItems(entry?.value ?? "");
    const idx = findIntegrationsMegaItemIndex(items);
    if (idx < 0) {
      continue;
    }
    const row = items[idx];
    if (!row) {
      continue;
    }
    const children = [...(row.children ?? [])];
    if (
      children.some(
        (c) => integrationCategorySlugFromNavHref(c.href) === segment
      )
    ) {
      syncIntegrationsHubItemsForLang(lang, segment, "upsert");
      continue;
    }
    const label =
      options.title?.trim() ||
      bucket[`integration.${segment}.title`]?.value?.trim() ||
      segment;
    const desc =
      options.desc?.trim() ||
      bucket[`integration.${segment}.subtitle`]?.value?.trim() ||
      "";
    const imageUrl =
      options.imageUrl?.trim() ||
      bucket[`integration.${segment}.heroImage`]?.value?.trim() ||
      "";
    children.push({
      label,
      href,
      desc: desc || undefined,
      imageUrl: imageUrl || undefined,
    });
    items[idx] = { ...row, children };
    assignContentEntry(
      lang,
      "home.nav.megaMenu",
      serializeMegaMenuItems(items),
      "json"
    );
    syncIntegrationsHubItemsForLang(lang, segment, "upsert");
    langsUpdated.push(lang);
  }

  if (langsUpdated.length === 0) {
    return;
  }
  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    await Promise.all(
      langsUpdated.flatMap((lang) => [
        upsertContentRow(
          lang,
          "home.nav.megaMenu",
          byLang[lang]!["home.nav.megaMenu"]!
        ),
        upsertContentRow(
          lang,
          "page.integrations.items",
          byLang[lang]!["page.integrations.items"]!
        ),
      ])
    );
  } else {
    savePersistedContent(byLang);
  }
}

export async function deleteIntegrationCategory(
  rawSlug: string
): Promise<boolean> {
  const segment = normalizeIntegrationCategorySlug(rawSlug);
  if (!segment) {
    return false;
  }
  const prefix = `integration.${segment}.`;
  const href = integrationCategoryHrefFromSlug(segment);

  for (const lang of Object.keys(byLang)) {
    const bucket = byLang[lang];
    if (!bucket) {
      continue;
    }
    for (const key of Object.keys(bucket)) {
      if (key.startsWith(prefix)) {
        delete bucket[key];
      }
    }
    const entry = bucket["home.nav.megaMenu"];
    if (entry) {
      const items = parseMegaMenuItems(entry.value);
      const idx = findIntegrationsMegaItemIndex(items);
      if (idx >= 0) {
        const row = items[idx];
        if (row) {
          const children = (row.children ?? []).filter(
            (c) =>
              integrationCategorySlugFromNavHref(c.href) !== segment &&
              c.href !== href
          );
          items[idx] = { ...row, children };
          assignContentEntry(
            lang,
            "home.nav.megaMenu",
            serializeMegaMenuItems(items),
            "json"
          );
        }
      }
    }
    syncIntegrationsHubItemsForLang(lang, segment, "remove");
  }

  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    await prisma.$transaction(async (tx) => {
      await tx.contentEntry.deleteMany({
        where: { key: { startsWith: prefix } },
      });
      const megaRows = await tx.contentEntry.findMany({
        where: { key: "home.nav.megaMenu" },
      });
      for (const row of megaRows) {
        const items = parseMegaMenuItems(row.value);
        const idx = findIntegrationsMegaItemIndex(items);
        if (idx < 0) {
          continue;
        }
        const integrationsRow = items[idx];
        if (!integrationsRow) {
          continue;
        }
        const children = (integrationsRow.children ?? []).filter(
          (c) =>
            integrationCategorySlugFromNavHref(c.href) !== segment &&
            c.href !== href
        );
        if (children.length === (integrationsRow.children ?? []).length) {
          continue;
        }
        items[idx] = { ...integrationsRow, children };
        const next = serializeMegaMenuItems(items);
        await tx.contentEntry.update({
          where: {
            langCode_key: { langCode: row.langCode, key: "home.nav.megaMenu" },
          },
          data: { value: next },
        });
      }
      for (const lang of Object.keys(byLang)) {
        const hub = byLang[lang]?.["page.integrations.items"];
        if (!hub) {
          continue;
        }
        await tx.contentEntry.upsert({
          where: {
            langCode_key: {
              langCode: lang,
              key: "page.integrations.items",
            },
          },
          create: {
            langCode: lang,
            key: "page.integrations.items",
            value: hub.value,
            type: hub.type,
          },
          update: { value: hub.value },
        });
      }
    });
  } else {
    savePersistedContent(byLang);
  }

  return true;
}

const EQUIPMENT_PRODUCT_STUB_FIELDS = [
  "seo.title",
  "seo.description",
  "title",
  "subtitle",
  "images",
  "highlights",
  "bodyHtml",
  "specsTitle",
  "specs",
  "orderLabel",
  "orderHref",
  "ctaLabel",
  "ctaHref",
  "pdfLabel",
  "pdfHref",
] as const;

/** Slugs with `equipment.product.{category}.{slug}.*` content in any locale. */
export function listEquipmentProductSlugsInCategory(
  categorySlug: string
): string[] {
  const cat = normalizeEquipmentCategorySlug(categorySlug);
  if (!cat) {
    return [];
  }
  const prefix = `equipment.product.${cat}.`;
  const slugs = new Set<string>();
  for (const bucket of Object.values(byLang)) {
    for (const key of Object.keys(bucket)) {
      if (!key.startsWith(prefix)) {
        continue;
      }
      const remainder = key.slice(prefix.length);
      const dot = remainder.indexOf(".");
      if (dot <= 0) {
        continue;
      }
      slugs.add(remainder.slice(0, dot));
    }
  }
  return [...slugs].sort();
}

export function equipmentProductExists(
  categorySlug: string,
  productSlug: string
): boolean {
  const cat = normalizeEquipmentCategorySlug(categorySlug);
  const prod = normalizeEquipmentProductSlug(productSlug);
  if (!cat || !prod) {
    return false;
  }
  const prefix = `${equipmentProductContentPrefix(cat, prod)}.`;
  for (const bucket of Object.values(byLang)) {
    if (Object.keys(bucket).some((k) => k.startsWith(prefix))) {
      return true;
    }
  }
  return false;
}

export function uniqueEquipmentProductSlug(
  categorySlug: string,
  base: string
): string {
  const cat = normalizeEquipmentCategorySlug(categorySlug);
  if (!cat) {
    return "product";
  }
  let slug =
    normalizeEquipmentProductSlug(base) ??
    slugifyEquipmentProductTitle(base);
  if (!equipmentProductExists(cat, slug)) {
    return slug;
  }
  let n = 2;
  while (equipmentProductExists(cat, `${slug}-${n}`)) {
    n++;
  }
  return `${slug}-${n}`;
}

function ensureEquipmentProductStubSync(
  categorySlug: string,
  productSlug: string,
  title?: string
): boolean {
  const cat = normalizeEquipmentCategorySlug(categorySlug);
  const prod = normalizeEquipmentProductSlug(productSlug);
  if (!cat || !prod) {
    return false;
  }
  const initialTitle = title?.trim() || prod;
  let changed = false;

  for (const lang of Object.keys(byLang)) {
    if (!byLang[lang]) {
      byLang[lang] = {};
    }
    for (const field of EQUIPMENT_PRODUCT_STUB_FIELDS) {
      const key = `${equipmentProductContentPrefix(cat, prod)}.${field}`;
      if (!byLang[lang]![key]) {
        const initial =
          field === "images" || field === "highlights" || field === "specs"
            ? "[]"
            : field === "orderHref" || field === "ctaHref"
              ? "contacts"
              : "";
        const type: ContentValueType =
          field === "images" || field === "highlights" || field === "specs"
            ? "json"
            : "text";
        assignContentEntry(lang, key, initial, type);
        changed = true;
      } else if (field === "title" && initialTitle) {
        const cur = byLang[lang]![key]!.value.trim();
        if (!cur) {
          assignContentEntry(lang, key, initialTitle, "text");
          changed = true;
        }
      }
    }
  }

  return changed;
}

function ensureEquipmentProductStubsFromCategoryCards(
  byLang: Record<string, Record<string, ContentEntry>>
): boolean {
  let changed = false;
  for (const categorySlug of collectCategorySlugsFromStore(byLang)) {
    for (const { slug, title } of slugsFromCategoryProductCards(
      byLang,
      categorySlug
    )) {
      if (!equipmentProductExists(categorySlug, slug)) {
        if (ensureEquipmentProductStubSync(categorySlug, slug, title)) {
          changed = true;
        }
      }
    }
  }
  return changed;
}

export async function ensureEquipmentProductStub(
  categorySlug: string,
  productSlug: string,
  title?: string
): Promise<void> {
  const changed = ensureEquipmentProductStubSync(categorySlug, productSlug, title);
  if (!changed) {
    return;
  }

  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    const cat = normalizeEquipmentCategorySlug(categorySlug);
    const prod = normalizeEquipmentProductSlug(productSlug);
    if (!cat || !prod) {
      return;
    }
    const prefix = `${equipmentProductContentPrefix(cat, prod)}.`;
    await Promise.all(
      Object.keys(byLang).flatMap((lang) =>
        Object.keys(byLang[lang] ?? {})
          .filter((key) => key.startsWith(prefix))
          .map((key) => {
            const entry = byLang[lang]![key];
            return entry
              ? upsertContentRow(lang, key, entry)
              : Promise.resolve();
          })
      )
    );
  } else {
    savePersistedContent(byLang);
  }
}

function appendProductToCategoryListJson(
  raw: string,
  card: { slug: string; title: string; desc?: string; imageUrl: string }
): string {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const list = Array.isArray(parsed) ? [...parsed] : [];
    const exists = list.some(
      (row) =>
        typeof row === "object" &&
        row !== null &&
        (row as { slug?: string }).slug === card.slug
    );
    if (exists) {
      return raw;
    }
    list.unshift(card);
    return JSON.stringify(list);
  } catch {
    return JSON.stringify([card]);
  }
}

export async function appendEquipmentProductCard(
  categorySlug: string,
  productSlug: string,
  options: { title?: string; desc?: string; imageUrl?: string }
): Promise<void> {
  const cat = normalizeEquipmentCategorySlug(categorySlug);
  const prod = normalizeEquipmentProductSlug(productSlug);
  if (!cat || !prod) {
    return;
  }
  const productsKey = `equipment.${cat}.products`;
  const title =
    options.title?.trim() ||
    byLang.en?.[`equipment.product.${cat}.${prod}.title`]?.value?.trim() ||
    prod;
  const imageUrl =
    options.imageUrl?.trim() ||
    (() => {
      try {
        const imgs = JSON.parse(
          byLang.en?.[`equipment.product.${cat}.${prod}.images`]?.value ?? "[]"
        ) as { imageUrl?: string }[];
        return imgs[0]?.imageUrl?.trim() ?? "";
      } catch {
        return "";
      }
    })() ||
    "";
  const card = {
    slug: prod,
    title,
    desc: options.desc?.trim() || undefined,
    imageUrl:
      imageUrl ||
      byLang.en?.[`equipment.${cat}.heroImage`]?.value?.trim() ||
      "",
  };

  for (const lang of Object.keys(byLang)) {
    const bucket = byLang[lang];
    if (!bucket) {
      continue;
    }
    const entry = bucket[productsKey];
    if (!entry) {
      continue;
    }
    const next = appendProductToCategoryListJson(entry.value, card);
    if (next !== entry.value) {
      assignContentEntry(lang, productsKey, next, entry.type);
    }
  }

  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    await Promise.all(
      Object.keys(byLang).map((lang) => {
        const entry = byLang[lang]?.[productsKey];
        if (!entry) {
          return Promise.resolve();
        }
        return upsertContentRow(lang, productsKey, entry);
      })
    );
  } else {
    savePersistedContent(byLang);
  }
}

export async function deleteEquipmentProduct(
  categorySlug: string,
  productSlug: string
): Promise<boolean> {
  const cat = normalizeEquipmentCategorySlug(categorySlug);
  const prod = normalizeEquipmentProductSlug(productSlug);
  if (!cat || !prod) {
    return false;
  }
  const prefix = `${equipmentProductContentPrefix(cat, prod)}.`;
  const productsKey = `equipment.${cat}.products`;

  for (const lang of Object.keys(byLang)) {
    const bucket = byLang[lang];
    if (!bucket) {
      continue;
    }
    for (const key of Object.keys(bucket)) {
      if (key.startsWith(prefix)) {
        delete bucket[key];
      }
    }
    const entry = bucket[productsKey];
    if (entry) {
      try {
        const parsed = JSON.parse(entry.value) as unknown;
        if (Array.isArray(parsed)) {
          const next = parsed.filter(
            (row) =>
              !(
                typeof row === "object" &&
                row !== null &&
                (row as { slug?: string }).slug === prod
              )
          );
          if (next.length !== parsed.length) {
            assignContentEntry(lang, productsKey, JSON.stringify(next), entry.type);
          }
        }
      } catch {
        /* ignore */
      }
    }
  }

  if (isDbEnabled()) {
    await ensureContentStoreHydrated();
    await prisma.$transaction(async (tx) => {
      await tx.contentEntry.deleteMany({
        where: { key: { startsWith: prefix } },
      });
      const rows = await tx.contentEntry.findMany({
        where: { key: productsKey },
      });
      for (const row of rows) {
        try {
          const parsed = JSON.parse(row.value) as unknown;
          if (!Array.isArray(parsed)) {
            continue;
          }
          const next = parsed.filter(
            (item) =>
              !(
                typeof item === "object" &&
                item !== null &&
                (item as { slug?: string }).slug === prod
              )
          );
          if (next.length === parsed.length) {
            continue;
          }
          const value = JSON.stringify(next);
          await tx.contentEntry.update({
            where: {
              langCode_key: { langCode: row.langCode, key: row.key },
            },
            data: { value },
          });
          assignContentEntry(row.langCode, row.key, value, row.type as ContentValueType);
        } catch {
          /* ignore */
        }
      }
    });
  } else {
    savePersistedContent(byLang);
  }
  return true;
}
