import type { AdminSectionDef } from "@/lib/adminSections";

/** Section cards on `/admin/integrations/[slug]` — full service page. */
export function buildIntegrationCategoryAdminSections(
  categorySlug: string
): AdminSectionDef[] {
  const p = `integration.${categorySlug}`;
  return [
    {
      id: "seo",
      title: "SEO",
      description: "Meta title и description для страницы услуги",
      keys: [`${p}.seo.title`, `${p}.seo.description`],
    },
    {
      id: "hero",
      title: "Шапка (H1, подзаголовок, фон)",
      description: "Подпись, заголовок, подзаголовок и фоновое изображение",
      keys: [`${p}.eyebrow`, `${p}.title`, `${p}.subtitle`, `${p}.heroImage`],
    },
    {
      id: "highlights",
      title: "Быстрые пункты (+)",
      description: "Чипы под заголовком. Пустой список — блок скрыт.",
      keys: [`${p}.highlights`],
    },
    {
      id: "body",
      title: "Основной текст (TipTap)",
      description: "Статья на странице услуги — заголовки, списки, абзацы",
      keys: [`${p}.bodyHtml`],
    },
    {
      id: "specs",
      title: "Системы / специализация",
      description:
        "Заголовок блока и карточки (название + описание). Без карточек блок скрыт.",
      keys: [`${p}.specsTitle`, `${p}.specs`],
    },
    {
      id: "cta",
      title: "Кнопка и PDF",
      description: "Кнопка консультации и необязательная ссылка на PDF",
      keys: [`${p}.ctaLabel`, `${p}.ctaHref`, `${p}.pdfLabel`, `${p}.pdfHref`],
    },
    {
      id: "footer",
      title: "Ссылка «назад»",
      description: "Текст ссылки на /integrations",
      keys: [`${p}.backLabel`],
    },
    {
      id: "card",
      title: "Карточка на /integrations и в меню",
      description:
        "Превью на списке и пункт в шапке (название, ссылка, описание, иллюстрация)",
      keys: ["home.nav.megaMenu"],
    },
  ];
}
