/** Default mega-menu JSON for seed content. */

const IMG_LOCK =
  "https://images.unsplash.com/photo-1558008280-b9d87398e043?w=800&q=80";
const IMG_MINIBAR =
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80";
const IMG_SAFE =
  "https://images.unsplash.com/photo-1614064641938-3bbee5293b8e?w=800&q=80";
const IMG_TV =
  "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80";
const IMG_PBX =
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80";
const IMG_AUTO =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80";
const IMG_HEADEND =
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80";
const IMG_LAN =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80";

/** Flat mobile / fallback nav — top-level mega-menu links only. */
export const DEFAULT_NAV_ITEMS_EN = JSON.stringify([
  { label: "Equipment & systems", href: "equipment" },
  { label: "Integrations", href: "integrations" },
  { label: "Company", href: "company" },
  { label: "Projects", href: "projects" },
  { label: "Blog", href: "blog" },
  { label: "Contacts", href: "contacts" },
]);

export const DEFAULT_NAV_ITEMS_RU = JSON.stringify([
  { label: "Оборудование и системы", href: "equipment" },
  { label: "Интеграции", href: "integrations" },
  { label: "Компания", href: "company" },
  { label: "Проекты", href: "projects" },
  { label: "Блог", href: "blog" },
  { label: "Контакты", href: "contacts" },
]);

export const DEFAULT_NAV_MEGA_MENU_EN = JSON.stringify({
  items: [
    {
      label: "Equipment & systems",
      href: "equipment",
      children: [
        {
          label: "Electronic locks",
          href: "equipment/electronic-locks",
          desc: "Access control for every property type",
          imageUrl: IMG_LOCK,
        },
        {
          label: "Minibars",
          href: "equipment/minibars",
          desc: "Quiet, energy-efficient minibars in multiple sizes",
          imageUrl: IMG_MINIBAR,
        },
        {
          label: "Safes",
          href: "equipment/safes",
          desc: "In-room safes with simple guest operation",
          imageUrl: IMG_SAFE,
        },
        {
          label: "TV & professional panels",
          href: "equipment/tv-panels",
          desc: "Reliable displays and revenue-ready in-room entertainment",
          imageUrl: IMG_TV,
        },
        {
          label: "Hotel PBX",
          href: "equipment/hotel-pbx",
          desc: "Analog/IP PBX, DECT, call centers, PMS integration",
          imageUrl: IMG_PBX,
        },
        {
          label: "Room automation",
          href: "equipment/room-automation",
          desc: "Full in-room control and energy efficiency",
          imageUrl: IMG_AUTO,
        },
        {
          label: "TV headends",
          href: "equipment/headends-tv-reception",
          desc: "Head-end systems for TV reception and distribution",
          imageUrl: IMG_HEADEND,
        },
        {
          label: "LAN equipment",
          href: "equipment/lan-equipment",
          desc: "Switches, routers, Wi‑Fi access points and controllers",
          imageUrl: IMG_LAN,
        },
      ],
    },
    {
      label: "Integrations",
      href: "integrations",
      children: [
        { label: "Design & budgeting", href: "integrations/design" },
        {
          label: "Support & maintenance",
          href: "integrations/support-maintenance",
        },
        {
          label: "Upgrading existing systems",
          href: "integrations/updating-modernizing-systems",
        },
        { label: "Commissioning", href: "integrations/mounting" },
      ],
    },
    { label: "Company", href: "company" },
    { label: "Projects", href: "projects" },
    { label: "Blog", href: "blog" },
    { label: "Contacts", href: "contacts" },
  ],
});

export const DEFAULT_NAV_MEGA_MENU_RU = JSON.stringify({
  items: [
    {
      label: "Оборудование и системы",
      href: "equipment",
      children: [
        {
          label: "Электронные замки",
          href: "equipment/electronic-locks",
          desc: "Система управления и контроля доступа для любых типов размещения",
          imageUrl: IMG_LOCK,
        },
        {
          label: "Минибары",
          href: "equipment/minibars",
          desc: "Бесшумные минибары с низким энергопотреблением и различными типоразмерами",
          imageUrl: IMG_MINIBAR,
        },
        {
          label: "Сейфы",
          href: "equipment/safes",
          desc: "Гостиничные сейфы, гарантирующие полную безопасность и простое управление",
          imageUrl: IMG_SAFE,
        },
        {
          label: "Телевизоры и профпанели",
          href: "equipment/tv-panels",
          desc: "Надёжная техника и эффективный инструмент для дополнительного дохода",
          imageUrl: IMG_TV,
        },
        {
          label: "Гостиничные АТС",
          href: "equipment/hotel-pbx",
          desc: "Аналоговые и/или IP-абоненты, DECT, колл-центры, интеграция с PMS",
          imageUrl: IMG_PBX,
        },
        {
          label: "Автоматизация номеров",
          href: "equipment/room-automation",
          desc: "Полное управление возможностями номера и энергоэффективностью",
          imageUrl: IMG_AUTO,
        },
        {
          label: "Головные станции для приёма ТВ",
          href: "equipment/headends-tv-reception",
          desc: "Головные станции для приёма и распределения телевизионного сигнала",
          imageUrl: IMG_HEADEND,
        },
        {
          label: "Оборудование для ЛВС",
          href: "equipment/lan-equipment",
          desc: "Коммутаторы, маршрутизаторы, точки доступа Wi‑Fi, контроллеры сети",
          imageUrl: IMG_LAN,
        },
      ],
    },
    {
      label: "Интеграции",
      href: "integrations",
      children: [
        { label: "Проектирование", href: "integrations/design" },
        {
          label: "Поддержка и обслуживание",
          href: "integrations/support-maintenance",
        },
        {
          label: "Обновление и модернизация",
          href: "integrations/updating-modernizing-systems",
        },
        {
          label: "Пуско-наладочные работы",
          href: "integrations/mounting",
        },
      ],
    },
    { label: "Компания", href: "company" },
    { label: "Проекты", href: "projects" },
    { label: "Блог", href: "blog" },
    { label: "Контакты", href: "contacts" },
  ],
});

/** Detects pre-route-fix nav JSON (`#equipment`, `#about`, bare `#` children). */
export function isLegacyNavContent(megaMenuRaw: string, itemsRaw: string): boolean {
  const blob = `${megaMenuRaw}\n${itemsRaw}`;
  return (
    blob.includes('"#equipment"') ||
    blob.includes('"#hoteza"') ||
    blob.includes('"#integrations"') ||
    blob.includes('"#about"') ||
    blob.includes('"#blog"') ||
    blob.includes('"#contacts"') ||
    blob.includes('"#projects"') ||
    /"href"\s*:\s*"#"/.test(blob)
  );
}
