import type { AdminSectionDef } from "@/lib/adminSections";

/** Section cards on `/admin/equipment/[slug]` — full category page (all public blocks). */
export function buildEquipmentCategoryAdminSections(
  categorySlug: string
): AdminSectionDef[] {
  const p = `equipment.${categorySlug}`;
  return [
    {
      id: "seo",
      title: "SEO",
      description: "Meta title и description для страницы категории в поиске",
      keys: [`${p}.seo.title`, `${p}.seo.description`],
    },
    {
      id: "hero",
      title: "Шапка (H1, подзаголовок, фон)",
      description:
        "Подпись над заголовком, H1, подзаголовок и фоновое изображение в шапке",
      keys: [
        `${p}.eyebrow`,
        `${p}.title`,
        `${p}.subtitle`,
        `${p}.heroImage`,
      ],
    },
    {
      id: "highlights",
      title: "Быстрые пункты (+)",
      description:
        "Чипы под заголовком («+ Замок-накладка»). Пустой список — блок скрыт.",
      keys: [`${p}.highlights`],
    },
    {
      id: "body",
      title: "Основной текст (TipTap)",
      description:
        "Секции с заголовками, абзацами и списками — середина страницы",
      keys: [`${p}.bodyHtml`],
    },
    {
      id: "products",
      title: "Решения в категории (карточки товаров)",
      description:
        "Заголовок блока и карточки на странице категории — превью тех же товаров. Слайдер, текст и характеристики товара — в редакторе товара (форма или зелёный блок вверху).",
      keys: [`${p}.productsTitle`, `${p}.products`],
    },
    {
      id: "specs",
      title: "Технические характеристики",
      description:
        "Заголовок блока и карточки характеристик (название + описание). Без карточек блок скрыт.",
      keys: [`${p}.specsTitle`, `${p}.specs`],
    },
    {
      id: "cta",
      title: "Кнопка и PDF",
      description:
        "Кнопка консультации (текст + ссылка, напр. contacts) и необязательная ссылка на PDF-каталог",
      keys: [`${p}.ctaLabel`, `${p}.ctaHref`, `${p}.pdfLabel`, `${p}.pdfHref`],
    },
    {
      id: "footer",
      title: "Ссылка «назад»",
      description: "Текст ссылки возврата на страницу списка /equipment",
      keys: [`${p}.backLabel`],
    },
    {
      id: "card",
      title: "Карточка на /equipment и в меню",
      description:
        "Превью на странице списка и пункт в шапке (название, ссылка, описание, изображение)",
      keys: ["home.nav.megaMenu"],
    },
  ];
}
