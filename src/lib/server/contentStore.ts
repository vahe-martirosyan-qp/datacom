import type { ContentEntry, ContentValueType, Language } from "@/types";
import { prisma } from "@/lib/server/prisma";
import type { ProjectCardItem } from "@/types/site";
import {
  normalizeNewProjectSlug,
  projectSlugFromCardHref,
} from "@/lib/projectHrefUtils";
import {
  DEFAULT_NAV_MEGA_MENU_EN,
  DEFAULT_NAV_MEGA_MENU_RU,
} from "@/lib/server/defaultNavMegaMenu";
import {
  loadPersistedContentInto,
  loadPersistedLanguages,
  savePersistedContent,
  savePersistedLanguages,
} from "@/lib/server/contentPersistence";
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
    value: "Datacom — Hotel solutions: equipment, Hoteza platform, integrations",
    type: "text",
  },
  "home.seo.description": {
    key: "home.seo.description",
    value:
      "Equipment and systems for hotels of any category: locks, minibars, TV, PBX, Hoteza, integrations across Russia.",
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
    value: JSON.stringify([
      { label: "Equipment & systems", href: "#equipment" },
      { label: "Hoteza platform", href: "#hoteza" },
      { label: "Integrations", href: "#integrations" },
      { label: "Company", href: "#about" },
      { label: "Projects", href: "projects" },
      { label: "Blog", href: "#blog" },
      { label: "Contacts", href: "#contacts" },
    ]),
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
  "home.stats.hotezaTitle": {
    key: "home.stats.hotezaTitle",
    value: "Hoteza platform",
    type: "text",
  },
  "home.stats.hotezaCount": {
    key: "home.stats.hotezaCount",
    value: "6",
    type: "text",
  },
  "home.stats.hotezaDesc": {
    key: "home.stats.hotezaDesc",
    value: "Interactive solutions for perfect in-room guest experience",
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
    value: JSON.stringify([
      "Marriott",
      "Hilton",
      "Hyatt",
      "IHG",
      "Accor",
      "Local flagship",
    ]),
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
      },
      {
        title: "Integrating locks with PMS",
        href: "blog/locks-pms",
        meta: "Guide",
      },
      {
        title: "Case study: flagship opening",
        href: "blog/case-flagship",
        meta: "Projects",
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
        href: "projects/maidens-hotel-moscow",
      },
      {
        title: "Riverside Conference & Spa",
        location: "Sochi",
        imageUrl:
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
        href: "projects/riverside-sochi",
      },
      {
        title: "Urban Loft Apartments",
        location: "Saint Petersburg",
        imageUrl:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
        href: "projects/urban-loft-spb",
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
  "project.maidens-hotel-moscow.title": {
    key: "project.maidens-hotel-moscow.title",
    value: "Maidens Hotel Moscow",
    type: "text",
  },
  "project.maidens-hotel-moscow.location": {
    key: "project.maidens-hotel-moscow.location",
    value: "Moscow",
    type: "text",
  },
  "project.maidens-hotel-moscow.heroImage": {
    key: "project.maidens-hotel-moscow.heroImage",
    value: "/images/project-maiden-moscow.png",
    type: "image",
  },
  "project.maidens-hotel-moscow.bodyHtml": {
    key: "project.maidens-hotel-moscow.bodyHtml",
    value: MAIDENS_BODY_HTML_EN,
    type: "text",
  },
  "project.maidens-hotel-moscow.equipment": {
    key: "project.maidens-hotel-moscow.equipment",
    value: MAIDENS_EQUIPMENT,
    type: "json",
  },
  "project.maidens-hotel-moscow.year": {
    key: "project.maidens-hotel-moscow.year",
    value: "2025",
    type: "text",
  },
  "project.riverside-sochi.title": {
    key: "project.riverside-sochi.title",
    value: "Riverside Conference & Spa",
    type: "text",
  },
  "project.riverside-sochi.location": {
    key: "project.riverside-sochi.location",
    value: "Sochi",
    type: "text",
  },
  "project.riverside-sochi.heroImage": {
    key: "project.riverside-sochi.heroImage",
    value:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=80",
    type: "image",
  },
  "project.riverside-sochi.bodyHtml": {
    key: "project.riverside-sochi.bodyHtml",
    value: RIVERSIDE_BODY_HTML_EN,
    type: "text",
  },
  "project.riverside-sochi.equipment": {
    key: "project.riverside-sochi.equipment",
    value: RIVERSIDE_EQUIPMENT,
    type: "json",
  },
  "project.riverside-sochi.year": {
    key: "project.riverside-sochi.year",
    value: "2024",
    type: "text",
  },
  "project.urban-loft-spb.title": {
    key: "project.urban-loft-spb.title",
    value: "Urban Loft Apartments",
    type: "text",
  },
  "project.urban-loft-spb.location": {
    key: "project.urban-loft-spb.location",
    value: "Saint Petersburg",
    type: "text",
  },
  "project.urban-loft-spb.heroImage": {
    key: "project.urban-loft-spb.heroImage",
    value:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
    type: "image",
  },
  "project.urban-loft-spb.bodyHtml": {
    key: "project.urban-loft-spb.bodyHtml",
    value: URBAN_BODY_HTML_EN,
    type: "text",
  },
  "project.urban-loft-spb.equipment": {
    key: "project.urban-loft-spb.equipment",
    value: URBAN_EQUIPMENT,
    type: "json",
  },
  "project.urban-loft-spb.year": {
    key: "project.urban-loft-spb.year",
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
  "home.lead.title": {
    key: "home.lead.title",
    value: "Leave your details and we will get back to you",
    type: "text",
  },
  "home.lead.subtitle": {
    key: "home.lead.subtitle",
    value: "We will contact you to discuss equipment, Hoteza or integrations.",
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
        title: "Hoteza",
        links: [
          { label: "Hoteza TV", href: "#" },
          { label: "Guest App", href: "#" },
          { label: "HSIA", href: "#" },
          { label: "HotPad", href: "#" },
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
      "Datacom — Решения для отелей: оборудование, платформа Hoteza, интеграции",
    type: "text",
  },
  "home.seo.description": {
    key: "home.seo.description",
    value:
      "Оборудование и системы для отелей любой категории: замки, минибары, ТВ, АТС, Hoteza, интеграции.",
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
    value: JSON.stringify([
      { label: "Оборудование и системы", href: "#equipment" },
      { label: "Платформа Hoteza", href: "#hoteza" },
      { label: "Интеграции", href: "#integrations" },
      { label: "Компания", href: "#about" },
      { label: "Проекты", href: "projects" },
      { label: "Блог", href: "#blog" },
      { label: "Контакты", href: "#contacts" },
    ]),
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
  "home.stats.hotezaTitle": {
    key: "home.stats.hotezaTitle",
    value: "Платформа Hoteza",
    type: "text",
  },
  "home.stats.hotezaCount": {
    key: "home.stats.hotezaCount",
    value: "6",
    type: "text",
  },
  "home.stats.hotezaDesc": {
    key: "home.stats.hotezaDesc",
    value: "Интерактивные решения для идеального гостевого сервиса",
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
    value: JSON.stringify([
      "Marriott",
      "Hilton",
      "Hyatt",
      "IHG",
      "Accor",
      "Флагманы РФ",
    ]),
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
      },
      {
        title: "Интеграция замков с PMS",
        href: "blog/locks-pms",
        meta: "Гайд",
      },
      {
        title: "Кейс: открытие флагмана",
        href: "blog/case-flagship",
        meta: "Проекты",
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
        href: "projects/maidens-hotel-moscow",
      },
      {
        title: "Riverside Conference & Spa",
        location: "Сочи",
        imageUrl:
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
        href: "projects/riverside-sochi",
      },
      {
        title: "Urban Loft Apartments",
        location: "Санкт-Петербург",
        imageUrl:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
        href: "projects/urban-loft-spb",
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
  "project.maidens-hotel-moscow.title": {
    key: "project.maidens-hotel-moscow.title",
    value: "Maidens Hotel Moscow",
    type: "text",
  },
  "project.maidens-hotel-moscow.location": {
    key: "project.maidens-hotel-moscow.location",
    value: "Москва",
    type: "text",
  },
  "project.maidens-hotel-moscow.heroImage": {
    key: "project.maidens-hotel-moscow.heroImage",
    value: "/images/project-maiden-moscow.png",
    type: "image",
  },
  "project.maidens-hotel-moscow.bodyHtml": {
    key: "project.maidens-hotel-moscow.bodyHtml",
    value: MAIDENS_BODY_HTML_RU,
    type: "text",
  },
  "project.maidens-hotel-moscow.equipment": {
    key: "project.maidens-hotel-moscow.equipment",
    value: MAIDENS_EQUIPMENT,
    type: "json",
  },
  "project.maidens-hotel-moscow.year": {
    key: "project.maidens-hotel-moscow.year",
    value: "2025",
    type: "text",
  },
  "project.riverside-sochi.title": {
    key: "project.riverside-sochi.title",
    value: "Riverside Conference & Spa",
    type: "text",
  },
  "project.riverside-sochi.location": {
    key: "project.riverside-sochi.location",
    value: "Сочи",
    type: "text",
  },
  "project.riverside-sochi.heroImage": {
    key: "project.riverside-sochi.heroImage",
    value:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=80",
    type: "image",
  },
  "project.riverside-sochi.bodyHtml": {
    key: "project.riverside-sochi.bodyHtml",
    value: RIVERSIDE_BODY_HTML_RU,
    type: "text",
  },
  "project.riverside-sochi.equipment": {
    key: "project.riverside-sochi.equipment",
    value: RIVERSIDE_EQUIPMENT,
    type: "json",
  },
  "project.riverside-sochi.year": {
    key: "project.riverside-sochi.year",
    value: "2024",
    type: "text",
  },
  "project.urban-loft-spb.title": {
    key: "project.urban-loft-spb.title",
    value: "Urban Loft Apartments",
    type: "text",
  },
  "project.urban-loft-spb.location": {
    key: "project.urban-loft-spb.location",
    value: "Санкт-Петербург",
    type: "text",
  },
  "project.urban-loft-spb.heroImage": {
    key: "project.urban-loft-spb.heroImage",
    value:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
    type: "image",
  },
  "project.urban-loft-spb.bodyHtml": {
    key: "project.urban-loft-spb.bodyHtml",
    value: URBAN_BODY_HTML_RU,
    type: "text",
  },
  "project.urban-loft-spb.equipment": {
    key: "project.urban-loft-spb.equipment",
    value: URBAN_EQUIPMENT,
    type: "json",
  },
  "project.urban-loft-spb.year": {
    key: "project.urban-loft-spb.year",
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
  "home.lead.title": {
    key: "home.lead.title",
    value: "Оставьте контакты — мы свяжемся с вами",
    type: "text",
  },
  "home.lead.subtitle": {
    key: "home.lead.subtitle",
    value:
      "Мы перезвоним, чтобы обсудить оборудование, Hoteza или интеграции.",
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
        title: "Hoteza",
        links: [
          { label: "Hoteza TV", href: "#" },
          { label: "Guest App", href: "#" },
          { label: "HSIA", href: "#" },
          { label: "HotPad", href: "#" },
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

const byLang: Record<string, Record<string, ContentEntry>> = {
  en: cloneEntries(enHome),
  ru: cloneEntries(ruHome),
  ar: cloneEntries(enHome),
};

/** File-backed store is only used when Postgres is not configured. */
const useFileBackedStore = !process.env.DATABASE_URL?.trim();

if (useFileBackedStore) {
  loadPersistedContentInto(byLang);
}

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
          byLang.en = cloneEntries(enHome);
          byLang.ru = cloneEntries(ruHome);
          byLang.ar = cloneEntries(enHome);
        }
        loadPersistedContentInto(byLang);
        const loadedLangs = loadPersistedLanguages();
        if (loadedLangs !== null) {
          languages = loadedLangs;
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

/** Ensure content bucket exists when adding a new language (copy from English). */
export async function ensureLangContentBucket(langCode: string): Promise<void> {
  if (byLang[langCode]) {
    return;
  }
  byLang[langCode] = cloneEntries(enHome);
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

/** Same hero resolution as project page: current lang, then EN fallback. */
function resolveProjectHeroImageForLang(slug: string, lang: string): string {
  const heroKey = `project.${slug}.heroImage`;
  const bucket = byLang[lang] ?? byLang.en;
  const direct = bucket[heroKey]?.value?.trim();
  if (direct) {
    return direct;
  }
  if (lang !== "en" && byLang.en) {
    const enVal = byLang.en[heroKey]?.value?.trim();
    if (enVal) {
      return enVal;
    }
  }
  return "";
}

/**
 * Homepage teaser cards store their own `imageUrl` in `projects.list`. When a card links to a
 * case study, use `project.{slug}.heroImage` so the main project image and the home grid stay in sync.
 */
function mergeHeroIntoProjectCardsJson(raw: string, lang: string): string {
  let items: ProjectCardItem[] = [];
  try {
    const parsed = JSON.parse(raw ?? "[]") as unknown;
    items = Array.isArray(parsed) ? (parsed as ProjectCardItem[]) : [];
  } catch {
    return raw;
  }
  let changed = false;
  const next = items.map((item) => {
    const slug = projectSlugFromCardHref(item.href);
    if (!slug) {
      return item;
    }
    const hero = resolveProjectHeroImageForLang(slug, lang);
    if (!hero) {
      return item;
    }
    if ((item.imageUrl ?? "").trim() === hero) {
      return item;
    }
    changed = true;
    return { ...item, imageUrl: hero };
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
        const next = mergeHeroIntoProjectCardsJson(e.value, lang);
        return next === e.value ? e : { ...e, value: next };
      }
      return e;
    });
  }
  if (page === "project" && slug) {
    const prefix = `project.${slug}.`;
    const entries = Object.values(bucket).filter((e) => e.key.startsWith(prefix));
    if (entries.length === 0) {
      return null;
    }
    const heroKey = `${prefix}heroImage`;
    const byKey = new Map(entries.map((e) => [e.key, { ...e }]));
    const hero = byKey.get(heroKey);
    const heroEmpty = !hero?.value?.trim();
    if (heroEmpty && lang !== "en" && byLang.en) {
      const enHero = byLang.en[heroKey];
      const enVal = enHero?.value?.trim();
      if (enVal) {
        if (hero) {
          byKey.set(heroKey, { ...hero, value: enHero!.value });
        } else if (enHero) {
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
  const targetLangs = isSharedProjectHero
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
 * Creates empty `project.{slug}.*` entries for every language bucket (admin: new case study).
 * `slug` must already be normalized (e.g. `normalizeNewProjectSlug`).
 */
export async function ensureProjectStub(slug: string): Promise<void> {
  const toPersist: { lang: string; key: string }[] = [];
  for (const lang of Object.keys(byLang)) {
    for (const field of PROJECT_STUB_FIELDS) {
      const key = `project.${slug}.${field}`;
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

/** Appends a teaser card to `projects.list` for each language if that slug is not already linked. */
export async function appendProjectHomeCard(slug: string): Promise<void> {
  const href = `projects/${slug}`;
  const langsUpdated: string[] = [];
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
      (it) => projectSlugFromCardHref(it.href) === slug
    );
    if (exists) {
      continue;
    }
    items.push({
      title: slug,
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
  slug: string
): { next: string; changed: boolean } {
  let items: ProjectCardItem[] = [];
  try {
    const parsed = JSON.parse(raw ?? "[]") as unknown;
    items = Array.isArray(parsed) ? (parsed as ProjectCardItem[]) : [];
  } catch {
    items = [];
  }
  const filtered = items.filter(
    (it) => projectSlugFromCardHref(it.href) !== slug
  );
  const changed = filtered.length !== items.length;
  return { next: JSON.stringify(filtered), changed };
}

/**
 * Removes all `project.{slug}.*` keys and teaser cards pointing at this slug
 * (`projects.list`, legacy `home.projects.items`) for every language bucket.
 */
export async function deleteProject(rawSlug: string): Promise<boolean> {
  const slug = normalizeNewProjectSlug(rawSlug);
  if (!slug) {
    return false;
  }
  const prefix = `project.${slug}.`;

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
      const { next, changed } = filterProjectCardsJson(listEntry.value, slug);
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
      const { next, changed } = filterProjectCardsJson(legacy.value, slug);
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
        const { next, changed } = filterProjectCardsJson(row.value, slug);
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
