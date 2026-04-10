import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { HomeContentResponse } from "@/types";

export async function fetchProjectContent(
  lang: string,
  slug: string
): Promise<HomeContentResponse> {
  const { data } = await api.get<HomeContentResponse>("/content", {
    params: { lang, page: "project", slug },
  });
  return data;
}

export function useProjectContentQuery(lang: string, slug: string) {
  return useQuery({
    queryKey: queryKeys.contentProject(lang, slug),
    queryFn: () => fetchProjectContent(lang, slug),
    enabled: Boolean(lang && slug),
  });
}
