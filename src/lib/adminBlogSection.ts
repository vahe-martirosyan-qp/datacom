import type { AdminSectionDef } from "@/lib/adminSections";

/** Section cards on `/admin/blog/[slug]` — full article page content. */
export function buildBlogArticleAdminSections(
  blogSlug: string
): AdminSectionDef[] {
  const p = `blog.${blogSlug}`;
  return [
    {
      id: "meta",
      title: "Заголовок и метаданные",
      description: "H1 на странице статьи, подпись (город/рубрика), год внизу",
      keys: [`${p}.title`, `${p}.location`, `${p}.year`],
    },
    {
      id: "hero",
      title: "Обложка статьи",
      description: "Большое изображение на странице (одно на все языки)",
      keys: [`${p}.heroImage`],
    },
    {
      id: "body",
      title: "Текст статьи",
      description:
        "Основной текст на странице /blog/… — редактор TipTap (абзацы, списки, жирный)",
      keys: [`${p}.bodyHtml`],
    },
    {
      id: "equipment",
      title: "Оборудование / продукты",
      description: "Блок «Поставленное оборудование» внизу статьи",
      keys: [`${p}.equipment`],
    },
  ];
}
