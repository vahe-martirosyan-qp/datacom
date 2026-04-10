import type { AdminSectionDef } from "@/lib/adminSections";

/** Keys edited on `/admin/projects/[slug]` for one case study. */
export function buildProjectSectionDef(slug: string): AdminSectionDef {
  const p = `project.${slug}`;
  return {
    id: `project-${slug}`,
    title: `Проект: ${slug}`,
    description:
      "Карточка кейса на сайте: заголовок, локация, год, изображение, текст (TipTap), список оборудования (JSON).",
    keys: [
      `${p}.title`,
      `${p}.location`,
      `${p}.year`,
      `${p}.heroImage`,
      `${p}.bodyHtml`,
      `${p}.equipment`,
    ],
  };
}
