import type { ContentEntry } from "@/types";

const IMG_TV =
  "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1600&q=80";
const IMG_LOCK =
  "https://images.unsplash.com/photo-1558008280-b9d87398e043?w=1600&q=80";
const IMG_LOBBY =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80";
const IMG_WIFI =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80";
const IMG_MOBILE =
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&q=80";
const IMG_DOOR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80";
const IMG_MINIBAR =
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=80";
const IMG_NETWORK =
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80";
const IMG_SUPPORT =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80";
const IMG_TABLET =
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80";
const IMG_HERITAGE =
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=80";

interface BlogPostSeedDef {
  slug: string;
  titleEn: string;
  titleRu: string;
  locationEn: string;
  locationRu: string;
  year: string;
  heroImage: string;
  bodyHtmlEn: string;
  bodyHtmlRu: string;
  equipmentEn: string[];
  equipmentRu: string[];
}

const AKYAN_BODY_EN = `<p>The renowned Akyan Hotel in Saint Petersburg chose interactive in-room solutions for contactless guest service.</p><p>Interactive TV was already installed; we upgraded it to the PRO package so guests can order in-room services, message staff, view their bill, leave feedback and more — not only watch TV channels.</p><p>Guests who prefer their smartphone can use our web app: it mirrors TV features and works as a remote control. Scan the QR code on the TV, enter the room number and surname to connect.</p>`;

const AKYAN_BODY_RU = `<p>Знаменитый отель Akyan в Санкт-Петербурге выбрал интерактивные решения для бесконтактного обслуживания гостей.</p><p>Интерактивное ТВ уже было установлено; мы обновили его до пакета PRO — гости могут делать заказы в номер, обращаться к персоналу, просматривать счёт, оставлять отзывы и не только смотреть ТВ-каналы.</p><p>Для смартфона доступно веб-приложение с теми же функциями и пультом для телевизора: наведите камеру на QR-код на экране, введите номер комнаты и фамилию.</p>`;

const SHORT_BODY_EN =
  "<p>Industry insight and product update from the Datacom team.</p>";
const SHORT_BODY_RU =
  "<p>Обзор отрасли и новости продуктов от команды Datacom.</p>";

const SEED_DEFS: BlogPostSeedDef[] = [
  {
    slug: "hotel-tv-trends",
    titleEn: "Hotel TV trends in 2026",
    titleRu: "Тренды гостиничного ТВ в 2026",
    locationEn: "Industry report",
    locationRu: "Обзор отрасли",
    year: "2026",
    heroImage: IMG_TV,
    bodyHtmlEn: `<p>Interactive TV remains the primary in-room touchpoint for upscale hotels. In 2026, operators focus on unified guest journeys: one profile across TV, mobile and kiosk.</p><p>Key trends include 4K headends with lower latency, tighter PMS integration for folio and messaging, and analytics on service uptake from the TV UI.</p>`,
    bodyHtmlRu: `<p>Интерактивное ТВ остаётся главной точкой контакта в номере. В 2026 отели выстраивают единый guest journey: один профиль на ТВ, смартфоне и киоске.</p><p>Тренды — 4K-головные станции, интеграция с PMS для счёта и сообщений, аналитика использования сервисов с экрана телевизора.</p>`,
    equipmentEn: ["Interactive TV PRO", "Guest mobile app"],
    equipmentRu: ["Интерактивное ТВ PRO", "Мобильное приложение"],
  },
  {
    slug: "locks-pms",
    titleEn: "Integrating locks with PMS",
    titleRu: "Интеграция замков с PMS",
    locationEn: "Guide",
    locationRu: "Гайд",
    year: "2025",
    heroImage: IMG_LOCK,
    bodyHtmlEn: `<p>Electronic locks should issue keys automatically from PMS reservations — mobile and RFID — without front-desk bottlenecks.</p><p>Plan interfaces early: room moves, early check-in, staff overrides and audit logs must stay consistent across vendors.</p>`,
    bodyHtmlRu: `<p>Электронные замки должны выдавать ключи из PMS автоматически — mobile и RFID — без очередей на ресепшене.</p><p>Заложите интеграцию заранее: переселения, ранний заезд, права персонала и журнал событий должны совпадать у всех систем.</p>`,
    equipmentEn: ["Electronic locks", "PMS interface"],
    equipmentRu: ["Электронные замки", "Интерфейс PMS"],
  },
  {
    slug: "case-flagship",
    titleEn: "Case study: flagship opening",
    titleRu: "Кейс: открытие флагмана",
    locationEn: "Saint Petersburg",
    locationRu: "Санкт-Петербург",
    year: "2023",
    heroImage: IMG_LOBBY,
    bodyHtmlEn: AKYAN_BODY_EN,
    bodyHtmlRu: AKYAN_BODY_RU,
    equipmentEn: ["Interactive TV PRO", "Guest web app"],
    equipmentRu: ["Интерактивное ТВ PRO", "Веб-приложение для гостей"],
  },
  {
    slug: "hsia-boutique",
    titleEn: "HSIA for boutique hotels",
    titleRu: "HSIA для бутик-отелей",
    locationEn: "Product",
    locationRu: "Продукт",
    year: "2026",
    heroImage: IMG_WIFI,
    bodyHtmlEn: SHORT_BODY_EN,
    bodyHtmlRu: SHORT_BODY_RU,
    equipmentEn: ["Guest Wi‑Fi (HSIA)"],
    equipmentRu: ["Гостевой Wi‑Fi (HSIA)"],
  },
  {
    slug: "guest-app-metrics",
    titleEn: "Guest app adoption metrics",
    titleRu: "Метрики внедрения Guest App",
    locationEn: "Analytics",
    locationRu: "Аналитика",
    year: "2025",
    heroImage: IMG_MOBILE,
    bodyHtmlEn: SHORT_BODY_EN,
    bodyHtmlRu: SHORT_BODY_RU,
    equipmentEn: ["Guest mobile app"],
    equipmentRu: ["Мобильное приложение для гостей"],
  },
  {
    slug: "iptv-headend",
    titleEn: "IPTV headend sizing guide",
    titleRu: "Как рассчитать головную станцию IPTV",
    locationEn: "Guide",
    locationRu: "Гайд",
    year: "2025",
    heroImage: IMG_TV,
    bodyHtmlEn: SHORT_BODY_EN,
    bodyHtmlRu: SHORT_BODY_RU,
    equipmentEn: ["IPTV headend"],
    equipmentRu: ["Головная станция IPTV"],
  },
  {
    slug: "locks-retrofit",
    titleEn: "Electronic locks: retrofit vs new build",
    titleRu: "Электронные замки: ретрофит и новострой",
    locationEn: "Infrastructure",
    locationRu: "Инфраструктура",
    year: "2026",
    heroImage: IMG_DOOR,
    bodyHtmlEn: SHORT_BODY_EN,
    bodyHtmlRu: SHORT_BODY_RU,
    equipmentEn: ["Electronic locks"],
    equipmentRu: ["Электронные замки"],
  },
  {
    slug: "minibar-pms",
    titleEn: "Minibar telemetry and PMS billing",
    titleRu: "Минибары: телеметрия и биллинг в PMS",
    locationEn: "Integration",
    locationRu: "Интеграция",
    year: "2024",
    heroImage: IMG_MINIBAR,
    bodyHtmlEn: SHORT_BODY_EN,
    bodyHtmlRu: SHORT_BODY_RU,
    equipmentEn: ["Minibar telemetry"],
    equipmentRu: ["Телеметрия минибаров"],
  },
  {
    slug: "lan-4k-tv",
    titleEn: "Designing hotel LAN for 4K TV",
    titleRu: "Проектирование ЛВС отеля под 4K ТВ",
    locationEn: "Infrastructure",
    locationRu: "Инфраструктура",
    year: "2025",
    heroImage: IMG_NETWORK,
    bodyHtmlEn: SHORT_BODY_EN,
    bodyHtmlRu: SHORT_BODY_RU,
    equipmentEn: ["LAN switches"],
    equipmentRu: ["Коммутаторы ЛВС"],
  },
  {
    slug: "support-sla",
    titleEn: "Support SLA for multi-property groups",
    titleRu: "SLA поддержки для сетей отелей",
    locationEn: "Service",
    locationRu: "Сервис",
    year: "2025",
    heroImage: IMG_SUPPORT,
    bodyHtmlEn: SHORT_BODY_EN,
    bodyHtmlRu: SHORT_BODY_RU,
    equipmentEn: ["24/7 support"],
    equipmentRu: ["Поддержка 24/7"],
  },
  {
    slug: "hotsign-checklist",
    titleEn: "Digital signage rollout checklist",
    titleRu: "Чек-лист внедрения цифровых вывесок",
    locationEn: "Checklist",
    locationRu: "Чек-лист",
    year: "2025",
    heroImage: IMG_TABLET,
    bodyHtmlEn: SHORT_BODY_EN,
    bodyHtmlRu: SHORT_BODY_RU,
    equipmentEn: ["Digital signage"],
    equipmentRu: ["Цифровые вывески"],
  },
  {
    slug: "heritage-safety",
    titleEn: "Safety systems in heritage hotels",
    titleRu: "Системы безопасности в исторических отелях",
    locationEn: "Projects",
    locationRu: "Проекты",
    year: "2024",
    heroImage: IMG_HERITAGE,
    bodyHtmlEn: SHORT_BODY_EN,
    bodyHtmlRu: SHORT_BODY_RU,
    equipmentEn: ["Safety systems"],
    equipmentRu: ["Системы безопасности"],
  },
];

function entry(
  key: string,
  value: string,
  type: ContentEntry["type"] = "text"
): ContentEntry {
  return { key, value, type };
}

/** CMS keys `blog.{slug}.*` merged into language seed buckets. */
export function blogPostSeedEntriesForLang(
  lang: "en" | "ru"
): Record<string, ContentEntry> {
  const out: Record<string, ContentEntry> = {};
  const isRu = lang === "ru";

  for (const def of SEED_DEFS) {
    const p = `blog.${def.slug}`;
    out[`${p}.title`] = entry(
      `${p}.title`,
      isRu ? def.titleRu : def.titleEn
    );
    out[`${p}.location`] = entry(
      `${p}.location`,
      isRu ? def.locationRu : def.locationEn
    );
    out[`${p}.year`] = entry(`${p}.year`, def.year);
    out[`${p}.heroImage`] = entry(`${p}.heroImage`, def.heroImage, "image");
    out[`${p}.bodyHtml`] = entry(
      `${p}.bodyHtml`,
      isRu ? def.bodyHtmlRu : def.bodyHtmlEn
    );
    out[`${p}.equipment`] = entry(
      `${p}.equipment`,
      JSON.stringify(isRu ? def.equipmentRu : def.equipmentEn),
      "json"
    );
  }

  return out;
}
