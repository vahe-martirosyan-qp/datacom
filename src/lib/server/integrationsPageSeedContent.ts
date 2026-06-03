/** Default copy for `/[lang]/integrations` (`page.integrations.*`). */

export const INTEGRATIONS_PAGE_SUBTITLE_EN =
  "Design, budgeting, supply, installation, service and modernization of systems";

export const INTEGRATIONS_PAGE_SUBTITLE_RU =
  "Проектирование, бюджетирование, поставка, монтаж, обслуживание и модернизация систем";

const IMG_DESIGN =
  "https://static.tildacdn.com/tild6337-6137-4330-b461-626330666361/download_1.svg";
const IMG_SUPPORT =
  "https://static.tildacdn.com/tild6464-3136-4030-b532-626534393136/download_1.svg";
const IMG_UPGRADE =
  "https://static.tildacdn.com/tild6533-3964-4431-a565-373438353336/download_1.svg";
const IMG_MOUNTING =
  "https://static.tildacdn.com/tild3234-6634-4430-b462-623737643633/download_1.svg";

export const INTEGRATIONS_ITEMS_EN = JSON.stringify([
  {
    title: "Design",
    desc: "Hotel IT system design and budgeting",
    href: "integrations/design",
    imageUrl: IMG_DESIGN,
  },
  {
    title: "Support & maintenance",
    desc: "Warranty and post-warranty service for hotel systems",
    href: "integrations/support-maintenance",
    imageUrl: IMG_SUPPORT,
  },
  {
    title: "Upgrading existing systems",
    desc: "Updating and modernization of installed systems",
    href: "integrations/updating-modernizing-systems",
    imageUrl: IMG_UPGRADE,
  },
  {
    title: "Audit & modernization",
    desc: "Audit and upgrade of hotel systems at operating properties",
    href: "integrations/audit",
    imageUrl: IMG_UPGRADE,
  },
  {
    title: "Commissioning",
    desc: "Commissioning of weak-current hotel systems",
    href: "integrations/mounting",
    imageUrl: IMG_MOUNTING,
  },
]);

export const INTEGRATIONS_ITEMS_RU = JSON.stringify([
  {
    title: "Проектирование",
    desc: "Проектирование ИТ-систем для гостиничного сектора",
    href: "integrations/design",
    imageUrl: IMG_DESIGN,
  },
  {
    title: "Поддержка и обслуживание",
    desc: "Сервисное, гарантийное и постгарантийное обслуживание гостиничных систем",
    href: "integrations/support-maintenance",
    imageUrl: IMG_SUPPORT,
  },
  {
    title: "Обновление и модернизация существующих систем",
    desc: "Обновление и модернизация существующих систем",
    href: "integrations/updating-modernizing-systems",
    imageUrl: IMG_UPGRADE,
  },
  {
    title: "Аудит и модернизация",
    desc: "Аудит и модернизация гостиничных систем в действующих объектах",
    href: "integrations/audit",
    imageUrl: IMG_UPGRADE,
  },
  {
    title: "Пуско-наладочные работы",
    desc: "Услуги по пуско-наладке слаботочных гостиничных систем",
    href: "integrations/mounting",
    imageUrl: IMG_MOUNTING,
  },
]);
