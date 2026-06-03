import type { ContentEntry } from "@/types";
import type { EquipmentSpecItem } from "@/types/site";

const IMG_DESIGN =
  "https://static.tildacdn.com/tild6337-6137-4330-b461-626330666361/download_1.svg";
const IMG_SUPPORT =
  "https://static.tildacdn.com/tild6464-3136-4030-b532-626534393136/download_1.svg";
const IMG_UPGRADE =
  "https://static.tildacdn.com/tild6533-3964-4431-a565-373438353336/download_1.svg";
const IMG_MOUNTING =
  "https://static.tildacdn.com/tild3234-6634-4430-b462-623737643633/download_1.svg";

interface IntegrationCategorySeedDef {
  slug: string;
  eyebrowEn: string;
  eyebrowRu: string;
  titleEn: string;
  titleRu: string;
  subtitleEn: string;
  subtitleRu: string;
  seoTitleEn: string;
  seoTitleRu: string;
  seoDescEn: string;
  seoDescRu: string;
  heroImage: string;
  highlightsEn: string[];
  highlightsRu: string[];
  specsTitleEn: string;
  specsTitleRu: string;
  specsEn: EquipmentSpecItem[];
  specsRu: EquipmentSpecItem[];
  ctaLabelEn: string;
  ctaLabelRu: string;
  ctaHref: string;
  pdfLabelEn: string;
  pdfLabelRu: string;
  pdfHref: string;
  backLabelEn: string;
  backLabelRu: string;
  bodyHtmlEn: string;
  bodyHtmlRu: string;
}

const DESIGN_BODY_EN = `<p>Our team has extensive experience designing IT systems for the hospitality sector and can deliver the full scope of project work.</p><h2>Scope of design services</h2><ul><li>Concept design</li><li>Design brief</li><li>Project and working documentation</li><li>As-built documentation, including after audit of existing systems</li></ul><p>Drawing on years of hotel standards expertise, we can advise project teams on implementations of any complexity.</p>`;

const DESIGN_BODY_RU = `<p>Команда Datacom обладает большим опытом в области проектирования ИТ-систем для гостиничного сектора и готова осуществлять полный комплекс проектных работ.</p><h2>Комплекс проектных работ</h2><ul><li>Эскизный проект</li><li>Задание на проектирование</li><li>Проектная и рабочая документация</li><li>Исполнительная документация, в том числе после аудита существующих систем</li></ul><p>С учётом накопленного опыта и знаний в области отельных стандартов мы можем выступать консультантом проектных групп при реализации проектов различной сложности.</p>`;

const SYSTEMS_EN: EquipmentSpecItem[] = [
  {
    title: "LAN and Wi‑Fi",
    desc: "Structured cabling and wireless networks for guest and staff areas.",
  },
  {
    title: "Hotel PBX and DECT",
    desc: "Voice platforms and cordless telephony integrated with PMS.",
  },
  {
    title: "TV headends and IPTV",
    desc: "Broadcast reception, interactive TV and digital signage.",
  },
  {
    title: "GRMS",
    desc: "In-room automation and energy management.",
  },
  {
    title: "AV and multimedia",
    desc: "Conference and public-area AV systems.",
  },
];

const SYSTEMS_RU: EquipmentSpecItem[] = [
  {
    title: "ЛВС и Wi‑Fi",
    desc: "Структурированные кабельные сети и беспроводной доступ для гостей и персонала.",
  },
  {
    title: "Гостиничная АТС и DECT",
    desc: "Телефония и микросотовая связь с интеграцией в PMS.",
  },
  {
    title: "СКТВ и интерактивное ТВ",
    desc: "Приём и распределение ТВ-сигнала, интерактивное ТВ и digital signage.",
  },
  {
    title: "GRMS",
    desc: "Автоматизация номеров и энергоэффективность.",
  },
  {
    title: "Аудиовизуальные системы",
    desc: "Мультимедиа для конференц-залов и общественных зон.",
  },
];

const GENERIC_BODY_EN =
  "<p>Datacom designs, supplies, integrates and supports hotel technology across Russia.</p><p>Contact us for a consultation on your property.</p>";
const GENERIC_BODY_RU =
  "<p>Datacom проектирует, поставляет, интегрирует и сопровождает гостиничные IT-системы по всей России.</p><p>Свяжитесь с нами для консультации по вашему объекту.</p>";

const SEED_DEFS: IntegrationCategorySeedDef[] = [
  {
    slug: "design",
    eyebrowEn: "Integrations",
    eyebrowRu: "Интеграции",
    titleEn: "Design",
    titleRu: "Проектирование",
    subtitleEn: "Hotel IT system design and budgeting",
    subtitleRu: "Проектирование ИТ-систем для гостиничного сектора",
    seoTitleEn: "Hotel IT design — Datacom",
    seoTitleRu: "Проектирование ИТ-систем — Datacom",
    seoDescEn: "Full-scope hotel IT design: documentation, audits and consulting.",
    seoDescRu:
      "Полный комплекс проектных работ для гостиниц: документация, аудит и консалтинг.",
    heroImage: IMG_DESIGN,
    highlightsEn: [],
    highlightsRu: [],
    specsTitleEn: "Systems we specialize in",
    specsTitleRu: "Специализация по системам",
    specsEn: SYSTEMS_EN,
    specsRu: SYSTEMS_RU,
    ctaLabelEn: "Free consultation",
    ctaLabelRu: "Бесплатная консультация",
    ctaHref: "contacts",
    pdfLabelEn: "",
    pdfLabelRu: "",
    pdfHref: "",
    backLabelEn: "← Integrations",
    backLabelRu: "← Интеграции",
    bodyHtmlEn: DESIGN_BODY_EN,
    bodyHtmlRu: DESIGN_BODY_RU,
  },
  {
    slug: "support-maintenance",
    eyebrowEn: "Integrations",
    eyebrowRu: "Интеграции",
    titleEn: "Support & maintenance",
    titleRu: "Поддержка и обслуживание",
    subtitleEn: "Warranty and post-warranty service for hotel systems",
    subtitleRu:
      "Сервисное, гарантийное и постгарантийное обслуживание гостиничных систем",
    seoTitleEn: "Hotel systems support — Datacom",
    seoTitleRu: "Поддержка гостиничных систем — Datacom",
    seoDescEn: "Service and maintenance for hospitality IT infrastructure.",
    seoDescRu: "Сервис и обслуживание IT-инфраструктуры отелей.",
    heroImage: IMG_SUPPORT,
    highlightsEn: [],
    highlightsRu: [],
    specsTitleEn: "",
    specsTitleRu: "",
    specsEn: [],
    specsRu: [],
    ctaLabelEn: "Free consultation",
    ctaLabelRu: "Бесплатная консультация",
    ctaHref: "contacts",
    pdfLabelEn: "",
    pdfLabelRu: "",
    pdfHref: "",
    backLabelEn: "← Integrations",
    backLabelRu: "← Интеграции",
    bodyHtmlEn: GENERIC_BODY_EN,
    bodyHtmlRu: GENERIC_BODY_RU,
  },
  {
    slug: "updating-modernizing-systems",
    eyebrowEn: "Integrations",
    eyebrowRu: "Интеграции",
    titleEn: "Upgrading existing systems",
    titleRu: "Обновление и модернизация",
    subtitleEn: "Updating and modernization of installed systems",
    subtitleRu: "Обновление и модернизация существующих систем",
    seoTitleEn: "Hotel systems modernization — Datacom",
    seoTitleRu: "Модернизация гостиничных систем — Datacom",
    seoDescEn: "Upgrade paths for legacy hotel technology.",
    seoDescRu: "Модернизация устаревших гостиничных систем.",
    heroImage: IMG_UPGRADE,
    highlightsEn: [],
    highlightsRu: [],
    specsTitleEn: "",
    specsTitleRu: "",
    specsEn: [],
    specsRu: [],
    ctaLabelEn: "Free consultation",
    ctaLabelRu: "Бесплатная консультация",
    ctaHref: "contacts",
    pdfLabelEn: "",
    pdfLabelRu: "",
    pdfHref: "",
    backLabelEn: "← Integrations",
    backLabelRu: "← Интеграции",
    bodyHtmlEn: GENERIC_BODY_EN,
    bodyHtmlRu: GENERIC_BODY_RU,
  },
  {
    slug: "mounting",
    eyebrowEn: "Integrations",
    eyebrowRu: "Интеграции",
    titleEn: "Commissioning",
    titleRu: "Пуско-наладочные работы",
    subtitleEn: "Commissioning of weak-current hotel systems",
    subtitleRu: "Услуги по пуско-наладке слаботочных гостиничных систем",
    seoTitleEn: "Hotel systems commissioning — Datacom",
    seoTitleRu: "Пуско-наладка гостиничных систем — Datacom",
    seoDescEn: "Commissioning and handover of low-current hotel systems.",
    seoDescRu: "Пуско-наладка и сдача слаботочных гостиничных систем.",
    heroImage: IMG_MOUNTING,
    highlightsEn: [],
    highlightsRu: [],
    specsTitleEn: "",
    specsTitleRu: "",
    specsEn: [],
    specsRu: [],
    ctaLabelEn: "Free consultation",
    ctaLabelRu: "Бесплатная консультация",
    ctaHref: "contacts",
    pdfLabelEn: "",
    pdfLabelRu: "",
    pdfHref: "",
    backLabelEn: "← Integrations",
    backLabelRu: "← Интеграции",
    bodyHtmlEn: GENERIC_BODY_EN,
    bodyHtmlRu: GENERIC_BODY_RU,
  },
  {
    slug: "audit",
    eyebrowEn: "Integrations",
    eyebrowRu: "Интеграции",
    titleEn: "Audit & modernization",
    titleRu: "Аудит и модернизация",
    subtitleEn: "Audit and upgrade at operating properties",
    subtitleRu:
      "Аудит и модернизация гостиничных систем в действующих объектах",
    seoTitleEn: "Hotel IT audit — Datacom",
    seoTitleRu: "Аудит гостиничных IT-систем — Datacom",
    seoDescEn: "Technical audit and modernization roadmaps for hotels.",
    seoDescRu: "Технический аудит и дорожные карты модернизации для отелей.",
    heroImage: IMG_UPGRADE,
    highlightsEn: [],
    highlightsRu: [],
    specsTitleEn: "",
    specsTitleRu: "",
    specsEn: [],
    specsRu: [],
    ctaLabelEn: "Free consultation",
    ctaLabelRu: "Бесплатная консультация",
    ctaHref: "contacts",
    pdfLabelEn: "",
    pdfLabelRu: "",
    pdfHref: "",
    backLabelEn: "← Integrations",
    backLabelRu: "← Интеграции",
    bodyHtmlEn: GENERIC_BODY_EN,
    bodyHtmlRu: GENERIC_BODY_RU,
  },
];

function entry(
  key: string,
  value: string,
  type: ContentEntry["type"] = "text"
): ContentEntry {
  return { key, value, type };
}

export function integrationCategorySeedEntriesForLang(
  lang: string
): Record<string, ContentEntry> {
  const isRu = lang === "ru";
  const out: Record<string, ContentEntry> = {};

  for (const def of SEED_DEFS) {
    const p = `integration.${def.slug}`;
    out[`${p}.seo.title`] = entry(
      `${p}.seo.title`,
      isRu ? def.seoTitleRu : def.seoTitleEn
    );
    out[`${p}.seo.description`] = entry(
      `${p}.seo.description`,
      isRu ? def.seoDescRu : def.seoDescEn
    );
    out[`${p}.eyebrow`] = entry(
      `${p}.eyebrow`,
      isRu ? def.eyebrowRu : def.eyebrowEn
    );
    out[`${p}.title`] = entry(`${p}.title`, isRu ? def.titleRu : def.titleEn);
    out[`${p}.subtitle`] = entry(
      `${p}.subtitle`,
      isRu ? def.subtitleRu : def.subtitleEn
    );
    out[`${p}.heroImage`] = entry(`${p}.heroImage`, def.heroImage, "image");
    out[`${p}.highlights`] = entry(
      `${p}.highlights`,
      JSON.stringify(isRu ? def.highlightsRu : def.highlightsEn),
      "json"
    );
    out[`${p}.specsTitle`] = entry(
      `${p}.specsTitle`,
      isRu ? def.specsTitleRu : def.specsTitleEn
    );
    out[`${p}.specs`] = entry(
      `${p}.specs`,
      JSON.stringify(isRu ? def.specsRu : def.specsEn),
      "json"
    );
    out[`${p}.ctaLabel`] = entry(
      `${p}.ctaLabel`,
      isRu ? def.ctaLabelRu : def.ctaLabelEn
    );
    out[`${p}.ctaHref`] = entry(`${p}.ctaHref`, def.ctaHref);
    out[`${p}.pdfLabel`] = entry(
      `${p}.pdfLabel`,
      isRu ? def.pdfLabelRu : def.pdfLabelEn
    );
    out[`${p}.pdfHref`] = entry(`${p}.pdfHref`, def.pdfHref);
    out[`${p}.backLabel`] = entry(
      `${p}.backLabel`,
      isRu ? def.backLabelRu : def.backLabelEn
    );
    out[`${p}.bodyHtml`] = entry(
      `${p}.bodyHtml`,
      isRu ? def.bodyHtmlRu : def.bodyHtmlEn
    );
  }

  return out;
}

export const INTEGRATION_CATEGORY_SEED_SLUGS = SEED_DEFS.map((d) => d.slug);
