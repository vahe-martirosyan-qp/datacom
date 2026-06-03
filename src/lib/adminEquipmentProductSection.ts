import type { AdminSectionDef } from "@/lib/adminSections";
import { equipmentProductContentPrefix } from "@/lib/equipmentProductHrefUtils";

export function buildEquipmentProductAdminSections(
  categorySlug: string,
  productSlug: string
): AdminSectionDef[] {
  const p = equipmentProductContentPrefix(categorySlug, productSlug);
  return [
    {
      id: "seo",
      title: "SEO",
      description: "Meta title и description страницы товара",
      keys: [`${p}.seo.title`, `${p}.seo.description`],
    },
    {
      id: "hero",
      title: "Название и описание",
      description: "H1 и краткий текст под заголовком",
      keys: [`${p}.title`, `${p}.subtitle`],
    },
    {
      id: "highlights",
      title: "Пункты (+)",
      description: "Список преимуществ под галереей",
      keys: [`${p}.highlights`],
    },
    {
      id: "actions",
      title: "Кнопка «Запросить стоимость»",
      description:
        "Текст кнопки. Ссылка contacts (или пусто) — открывает форму в модальном окне.",
      keys: [`${p}.ctaLabel`, `${p}.ctaHref`],
    },
    {
      id: "body",
      title: "Текст (TipTap)",
      description: "Секция с заголовком и абзацами",
      keys: [`${p}.bodyHtml`],
    },
    {
      id: "specs",
      title: "Технические характеристики",
      description: "Заголовок блока и карточки характеристик",
      keys: [`${p}.specsTitle`, `${p}.specs`],
    },
    {
      id: "pdf",
      title: "PDF-каталог",
      description: "Необязательная ссылка на каталог",
      keys: [`${p}.pdfLabel`, `${p}.pdfHref`],
    },
  ];
}
