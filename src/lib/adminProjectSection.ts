import type { AdminSectionDef } from "@/lib/adminSections";

/** Keys edited on `/admin/projects/[projectId]` for one case study. */
export function buildProjectSectionDef(projectKeySegment: string): AdminSectionDef {
  const p = `project.${projectKeySegment}`;
  return {
    id: `project-${projectKeySegment}`,
    title: `Проект: ${projectKeySegment}`,
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
