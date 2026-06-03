import type { ContentEntry } from "@/types";
import type { EquipmentProductItem, EquipmentSpecItem } from "@/types/site";

const IMG_LOCK =
  "https://images.unsplash.com/photo-1558008280-b9d87398e043?w=1600&q=80";
const IMG_MINIBAR =
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=80";
const IMG_SAFE =
  "https://images.unsplash.com/photo-1614064641938-3bbee5293b8e?w=1600&q=80";
const IMG_TV =
  "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1600&q=80";
const IMG_PBX =
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80";
const IMG_AUTO =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80";
const IMG_HEADEND =
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80";
const IMG_LAN =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80";

interface EquipmentCategorySeedDef {
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
  productsTitleEn: string;
  productsTitleRu: string;
  productsEn: EquipmentProductItem[];
  productsRu: EquipmentProductItem[];
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

const IMG_LOCK_CARD =
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80";
const IMG_CARD =
  "https://images.unsplash.com/photo-1631545245587-78c8d4e7f2b8?w=800&q=80";
const IMG_CARD2 =
  "https://images.unsplash.com/photo-1584438784890-49aece132725?w=800&q=80";
const IMG_CARD3 =
  "https://images.unsplash.com/photo-1558008280-b9d87398e043?w=800&q=80";

const LOCKS_PRODUCTS_EN: EquipmentProductItem[] = [
  {
    slug: "omnitec-gaudi-fit-in",
    title: "Omnitec GAUDI FIT-IN",
    desc: "Surface-mounted lock for easy system upgrades",
    imageUrl: IMG_LOCK_CARD,
  },
  {
    title: "Surface-mounted lock",
    desc: "Retrofit-friendly install for existing doors",
    imageUrl: IMG_LOCK_CARD,
  },
  {
    title: "Mortise electronic lock",
    desc: "Minimal in-door design for new builds",
    imageUrl: IMG_CARD2,
  },
  {
    title: "Mobile key (BLE)",
    desc: "Open with smartphone — no plastic card",
    imageUrl: IMG_CARD3,
  },
  {
    title: "RFID encoder & cards",
    desc: "Open-format MIFARE 1K cards and encoders",
    imageUrl: IMG_CARD,
  },
];

const LOCKS_PRODUCTS_RU: EquipmentProductItem[] = [
  {
    slug: "omnitec-gaudi-fit-in",
    title: "Omnitec GAUDI FIT-IN",
    desc: "Замок-накладка для обновления системы",
    imageUrl: IMG_LOCK_CARD,
  },
  {
    title: "Замок-накладка",
    desc: "Удобный монтаж на существующие двери",
    imageUrl: IMG_LOCK_CARD,
  },
  {
    title: "Врезной электронный замок",
    desc: "Минималистичный вид для новых объектов",
    imageUrl: IMG_CARD2,
  },
  {
    title: "Мобильный ключ (BLE)",
    desc: "Открытие смартфоном без пластиковой карты",
    imageUrl: IMG_CARD3,
  },
  {
    title: "RFID-кодировщик и карты",
    desc: "Карты открытого формата MIFARE 1K",
    imageUrl: IMG_CARD,
  },
];

const LOCKS_SPECS_EN: EquipmentSpecItem[] = [
  {
    title: "Memory",
    desc: "Stores the last 400 events including user, date and time of each opening.",
  },
  {
    title: "Access control",
    desc: "Multiple access levels for staff and guests help prevent unauthorized check-ins.",
  },
  {
    title: "Portable programmer",
    desc: "Configure locks and read audit logs in the field with a handheld programmer.",
  },
  {
    title: "Integration",
    desc: "Works with major PMS and access platforms: TravelLine, Opera, Fidelio, Logus, 1C and others.",
  },
];

const LOCKS_SPECS_RU: EquipmentSpecItem[] = [
  {
    title: "Память",
    desc: "Сохраняет информацию о последних 400 событиях, включая пользователя, дату и время открытия.",
  },
  {
    title: "Контроль доступа",
    desc: "Различные уровни доступа для персонала и гостей помогают избежать несанкционированных заселений.",
  },
  {
    title: "Портативный программатор",
    desc: "Конфигурирование замков и считывание журнала событий с помощью портативного программатора.",
  },
  {
    title: "Интеграция",
    desc: "Интеграция с PMS и системами контроля доступа: TravelLine, Opera, Fidelio, Logus, 1C и др.",
  },
];

const LOCKS_BODY_EN = `<h2>Electronic hotel locks for every property type</h2><p>Stylish, minimal design with multiple ways to open guest rooms — RFID cards, BLE mobile keys and numeric codes.</p><ul><li>Surface-mounted and mortise lock sets</li><li>Open-format MIFARE 1K cards</li><li>Centralized management for large properties</li><li>App-based control for smaller hotels</li></ul><h2>Omnitec electronic locks</h2><p>For more than 25 years Omnitec has designed and manufactured electronic locks, safes and minibars for hospitality worldwide. Omnitec products meet hotel safety standards on both mechanical and electronic levels.</p>`;

const LOCKS_BODY_RU = `<h2>Широкая линейка электронных гостиничных замков</h2><p>Стильный минималистичный дизайн и различные способы доступа в номера — RFID-карты, BLE на смартфоне и цифровой код.</p><ul><li>Замки-накладки и врезные комплекты</li><li>Открытые карты стандарта MIFARE 1K</li><li>Централизованное управление для крупных объектов</li><li>Управление через приложение для небольших отелей</li></ul><h2>Электронные замки Omnitec</h2><p>Более 25 лет Omnitec разрабатывает и производит электронные замки, сейфы и минибары для гостиничного рынка. Оборудование соответствует стандартам безопасности, применяемым в отелях на механическом и электронном уровнях.</p>`;

const GENERIC_BODY_EN =
  "<p>Datacom supplies, integrates and supports this equipment category for hotels and hospitality projects across Russia.</p><p>Contact us for specifications, project design and commissioning.</p>";
const GENERIC_BODY_RU =
  "<p>Datacom поставляет, интегрирует и обслуживает эту категорию оборудования для гостиниц и объектов размещения по всей России.</p><p>Свяжитесь с нами для спецификаций, проектирования и пуско-наладки.</p>";

const GENERIC_HIGHLIGHTS_EN = [
  "Supply and installation",
  "Integration with hotel systems",
  "Commissioning and support",
];
const GENERIC_HIGHLIGHTS_RU = [
  "Поставка и монтаж",
  "Интеграция с системами отеля",
  "Пуско-наладка и поддержка",
];

const SEED_DEFS: EquipmentCategorySeedDef[] = [
  {
    slug: "electronic-locks",
    eyebrowEn: "Electronic locks",
    eyebrowRu: "Электронные замки",
    titleEn: "Electronic locks for hotels",
    titleRu: "Электронные замки для гостиниц",
    subtitleEn: "Access control for every property type",
    subtitleRu:
      "Система управления и контроля доступа для любых типов размещения",
    seoTitleEn: "Electronic locks for hotels — Datacom",
    seoTitleRu: "Электронные замки для гостиниц — Datacom",
    seoDescEn:
      "Hotel electronic locks, RFID and mobile keys, PMS integration — Omnitec and access control systems.",
    seoDescRu:
      "Электронные замки для отелей, RFID и мобильные ключи, интеграция с PMS — Omnitec и системы контроля доступа.",
    heroImage: IMG_LOCK,
    highlightsEn: [
      "Surface-mounted lock",
      "Open-format access cards",
      "PMS integration",
      "Smartphone opening",
    ],
    highlightsRu: [
      "Замок-накладка",
      "Карты доступа открытого формата",
      "Интеграции с PMS",
      "Открытие смартфоном",
    ],
    specsTitleEn: "Technical specifications",
    specsTitleRu: "Технические характеристики",
    specsEn: LOCKS_SPECS_EN,
    specsRu: LOCKS_SPECS_RU,
    productsTitleEn: "Solutions in this category",
    productsTitleRu: "Решения в категории",
    productsEn: LOCKS_PRODUCTS_EN,
    productsRu: LOCKS_PRODUCTS_RU,
    ctaLabelEn: "Free consultation",
    ctaLabelRu: "Бесплатная консультация",
    ctaHref: "contacts",
    pdfLabelEn: "↓ Omnitec hotel lock catalog [pdf]",
    pdfLabelRu: "↓ Каталог замков для гостиниц Omnitec [pdf]",
    pdfHref: "",
    backLabelEn: "← Equipment & systems",
    backLabelRu: "← Оборудование и системы",
    bodyHtmlEn: LOCKS_BODY_EN,
    bodyHtmlRu: LOCKS_BODY_RU,
  },
  {
    slug: "minibars",
    eyebrowEn: "Minibars",
    eyebrowRu: "Минибары",
    titleEn: "Hotel minibars",
    titleRu: "Минибары для гостиниц",
    subtitleEn: "Quiet, energy-efficient minibars in multiple sizes",
    subtitleRu:
      "Бесшумные минибары с низким энергопотреблением и различными типоразмерами",
    seoTitleEn: "Hotel minibars — Datacom",
    seoTitleRu: "Минибары для гостиниц — Datacom",
    seoDescEn:
      "Absorption and compressor minibars for hotels — supply and integration.",
    seoDescRu:
      "Абсорбционные и компрессорные минибары для отелей — поставка и интеграция.",
    heroImage: IMG_MINIBAR,
    highlightsEn: GENERIC_HIGHLIGHTS_EN,
    highlightsRu: GENERIC_HIGHLIGHTS_RU,
    specsTitleEn: "Features",
    specsTitleRu: "Особенности",
    specsEn: [],
    specsRu: [],
    productsTitleEn: "Featured products",
    productsTitleRu: "Популярные решения",
    productsEn: [],
    productsRu: [],
    ctaLabelEn: "Free consultation",
    ctaLabelRu: "Бесплатная консультация",
    ctaHref: "contacts",
    pdfLabelEn: "",
    pdfLabelRu: "",
    pdfHref: "",
    backLabelEn: "← Equipment & systems",
    backLabelRu: "← Оборудование и системы",
    bodyHtmlEn: GENERIC_BODY_EN,
    bodyHtmlRu: GENERIC_BODY_RU,
  },
  {
    slug: "safes",
    eyebrowEn: "Safes",
    eyebrowRu: "Сейфы",
    titleEn: "In-room safes",
    titleRu: "Гостиничные сейфы",
    subtitleEn: "Simple guest operation, reliable protection",
    subtitleRu: "Простое управление для гостя, надёжная защита",
    seoTitleEn: "Hotel safes — Datacom",
    seoTitleRu: "Гостиничные сейфы — Datacom",
    seoDescEn: "In-room safes for hotels — multiple sizes and electronic locking.",
    seoDescRu: "Сейфы для номеров отелей — разные размеры и электронные замки.",
    heroImage: IMG_SAFE,
    highlightsEn: GENERIC_HIGHLIGHTS_EN,
    highlightsRu: GENERIC_HIGHLIGHTS_RU,
    specsTitleEn: "Features",
    specsTitleRu: "Особенности",
    specsEn: [],
    specsRu: [],
    productsTitleEn: "Featured products",
    productsTitleRu: "Популярные решения",
    productsEn: [],
    productsRu: [],
    ctaLabelEn: "Free consultation",
    ctaLabelRu: "Бесплатная консультация",
    ctaHref: "contacts",
    pdfLabelEn: "",
    pdfLabelRu: "",
    pdfHref: "",
    backLabelEn: "← Equipment & systems",
    backLabelRu: "← Оборудование и системы",
    bodyHtmlEn: GENERIC_BODY_EN,
    bodyHtmlRu: GENERIC_BODY_RU,
  },
  {
    slug: "tv-panels",
    eyebrowEn: "TV & panels",
    eyebrowRu: "Телевизоры и профпанели",
    titleEn: "TV & professional panels",
    titleRu: "Телевизоры и профпанели",
    subtitleEn: "Reliable displays and in-room entertainment",
    subtitleRu: "Надёжные дисплеи и интерактивное ТВ в номере",
    seoTitleEn: "Hotel TV and panels — Datacom",
    seoTitleRu: "Телевизоры и профпанели для отелей — Datacom",
    seoDescEn:
      "Professional hotel TV, hospitality panels and interactive in-room entertainment.",
    seoDescRu:
      "Профессиональное гостиничное ТВ, панели и интерактивное телевидение в номере.",
    heroImage: IMG_TV,
    highlightsEn: GENERIC_HIGHLIGHTS_EN,
    highlightsRu: GENERIC_HIGHLIGHTS_RU,
    specsTitleEn: "Features",
    specsTitleRu: "Особенности",
    specsEn: [],
    specsRu: [],
    productsTitleEn: "Featured products",
    productsTitleRu: "Популярные решения",
    productsEn: [],
    productsRu: [],
    ctaLabelEn: "Free consultation",
    ctaLabelRu: "Бесплатная консультация",
    ctaHref: "contacts",
    pdfLabelEn: "",
    pdfLabelRu: "",
    pdfHref: "",
    backLabelEn: "← Equipment & systems",
    backLabelRu: "← Оборудование и системы",
    bodyHtmlEn: GENERIC_BODY_EN,
    bodyHtmlRu: GENERIC_BODY_RU,
  },
  {
    slug: "hotel-pbx",
    eyebrowEn: "Hotel PBX",
    eyebrowRu: "Гостиничные АТС",
    titleEn: "Hotel PBX",
    titleRu: "Гостиничные АТС",
    subtitleEn: "Analog/IP, DECT, call centers, PMS integration",
    subtitleRu:
      "Аналоговые и IP-абоненты, DECT, колл-центры, интеграция с PMS",
    seoTitleEn: "Hotel PBX — Datacom",
    seoTitleRu: "Гостиничные АТС — Datacom",
    seoDescEn: "Telephony for hotels — PBX, DECT handsets and PMS interfaces.",
    seoDescRu: "Телефония для отелей — АТС, DECT и интерфейсы с PMS.",
    heroImage: IMG_PBX,
    highlightsEn: GENERIC_HIGHLIGHTS_EN,
    highlightsRu: GENERIC_HIGHLIGHTS_RU,
    specsTitleEn: "Features",
    specsTitleRu: "Особенности",
    specsEn: [],
    specsRu: [],
    productsTitleEn: "Featured products",
    productsTitleRu: "Популярные решения",
    productsEn: [],
    productsRu: [],
    ctaLabelEn: "Free consultation",
    ctaLabelRu: "Бесплатная консультация",
    ctaHref: "contacts",
    pdfLabelEn: "",
    pdfLabelRu: "",
    pdfHref: "",
    backLabelEn: "← Equipment & systems",
    backLabelRu: "← Оборудование и системы",
    bodyHtmlEn: GENERIC_BODY_EN,
    bodyHtmlRu: GENERIC_BODY_RU,
  },
  {
    slug: "room-automation",
    eyebrowEn: "Room automation",
    eyebrowRu: "Автоматизация номеров",
    titleEn: "Room automation",
    titleRu: "Автоматизация номеров",
    subtitleEn: "Full in-room control and energy efficiency",
    subtitleRu:
      "Полное управление возможностями номера и энергоэффективностью",
    seoTitleEn: "Hotel room automation — Datacom",
    seoTitleRu: "Автоматизация номеров — Datacom",
    seoDescEn: "Lighting, HVAC and scene control for hotel rooms.",
    seoDescRu: "Управление освещением, климатом и сценариями в номере.",
    heroImage: IMG_AUTO,
    highlightsEn: GENERIC_HIGHLIGHTS_EN,
    highlightsRu: GENERIC_HIGHLIGHTS_RU,
    specsTitleEn: "Features",
    specsTitleRu: "Особенности",
    specsEn: [],
    specsRu: [],
    productsTitleEn: "Featured products",
    productsTitleRu: "Популярные решения",
    productsEn: [],
    productsRu: [],
    ctaLabelEn: "Free consultation",
    ctaLabelRu: "Бесплатная консультация",
    ctaHref: "contacts",
    pdfLabelEn: "",
    pdfLabelRu: "",
    pdfHref: "",
    backLabelEn: "← Equipment & systems",
    backLabelRu: "← Оборудование и системы",
    bodyHtmlEn: GENERIC_BODY_EN,
    bodyHtmlRu: GENERIC_BODY_RU,
  },
  {
    slug: "headends-tv-reception",
    eyebrowEn: "TV headends",
    eyebrowRu: "Головные станции ТВ",
    titleEn: "TV headends",
    titleRu: "Головные станции для приёма ТВ",
    subtitleEn: "Head-end systems for TV reception and distribution",
    subtitleRu:
      "Головные станции для приёма и распределения телевизионного сигнала",
    seoTitleEn: "TV headends for hotels — Datacom",
    seoTitleRu: "Головные станции ТВ — Datacom",
    seoDescEn: "IPTV and satellite headends for hospitality properties.",
    seoDescRu: "IPTV и спутниковые головные станции для гостиниц.",
    heroImage: IMG_HEADEND,
    highlightsEn: GENERIC_HIGHLIGHTS_EN,
    highlightsRu: GENERIC_HIGHLIGHTS_RU,
    specsTitleEn: "Features",
    specsTitleRu: "Особенности",
    specsEn: [],
    specsRu: [],
    productsTitleEn: "Featured products",
    productsTitleRu: "Популярные решения",
    productsEn: [],
    productsRu: [],
    ctaLabelEn: "Free consultation",
    ctaLabelRu: "Бесплатная консультация",
    ctaHref: "contacts",
    pdfLabelEn: "",
    pdfLabelRu: "",
    pdfHref: "",
    backLabelEn: "← Equipment & systems",
    backLabelRu: "← Оборудование и системы",
    bodyHtmlEn: GENERIC_BODY_EN,
    bodyHtmlRu: GENERIC_BODY_RU,
  },
  {
    slug: "lan-equipment",
    eyebrowEn: "LAN equipment",
    eyebrowRu: "Оборудование для ЛВС",
    titleEn: "LAN equipment",
    titleRu: "Оборудование для ЛВС",
    subtitleEn: "Switches, routers, Wi‑Fi access points and controllers",
    subtitleRu:
      "Коммутаторы, маршрутизаторы, точки доступа Wi‑Fi, контроллеры сети",
    seoTitleEn: "Hotel LAN and Wi‑Fi — Datacom",
    seoTitleRu: "Оборудование для ЛВС — Datacom",
    seoDescEn: "Structured cabling, switching and Wi‑Fi for hotels.",
    seoDescRu: "СКС, коммутация и Wi‑Fi для гостиничных объектов.",
    heroImage: IMG_LAN,
    highlightsEn: GENERIC_HIGHLIGHTS_EN,
    highlightsRu: GENERIC_HIGHLIGHTS_RU,
    specsTitleEn: "Features",
    specsTitleRu: "Особенности",
    specsEn: [],
    specsRu: [],
    productsTitleEn: "Featured products",
    productsTitleRu: "Популярные решения",
    productsEn: [],
    productsRu: [],
    ctaLabelEn: "Free consultation",
    ctaLabelRu: "Бесплатная консультация",
    ctaHref: "contacts",
    pdfLabelEn: "",
    pdfLabelRu: "",
    pdfHref: "",
    backLabelEn: "← Equipment & systems",
    backLabelRu: "← Оборудование и системы",
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

export function equipmentCategorySeedEntriesForLang(
  langCode: string
): Record<string, ContentEntry> {
  const isRu = langCode === "ru";
  const out: Record<string, ContentEntry> = {};

  for (const def of SEED_DEFS) {
    const p = `equipment.${def.slug}`;
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
    out[`${p}.title`] = entry(
      `${p}.title`,
      isRu ? def.titleRu : def.titleEn
    );
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
    out[`${p}.productsTitle`] = entry(
      `${p}.productsTitle`,
      isRu ? def.productsTitleRu : def.productsTitleEn
    );
    out[`${p}.products`] = entry(
      `${p}.products`,
      JSON.stringify(isRu ? def.productsRu : def.productsEn),
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

export const EQUIPMENT_CATEGORY_SEED_SLUGS = SEED_DEFS.map((d) => d.slug);
