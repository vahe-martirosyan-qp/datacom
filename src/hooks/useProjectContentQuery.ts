import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { HomeContentResponse } from "@/types";

export async function fetchProjectContent(
  lang: string,
  /** UUID or legacy slug; same as CMS `project.{segment}.*`. */
  projectKeySegment: string
): Promise<HomeContentResponse> {
  const { data } = await api.get<HomeContentResponse>("/content", {
    params: { lang, page: "project", slug: projectKeySegment },
  });
  return data;
}

export function useProjectContentQuery(
  lang: string,
  projectKeySegment: string
) {
  return useQuery({
    queryKey: queryKeys.contentProject(lang, projectKeySegment),
    queryFn: () => fetchProjectContent(lang, projectKeySegment),
    enabled: Boolean(lang && projectKeySegment),
  });
}
