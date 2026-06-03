import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { HomeContentResponse } from "@/types";

export async function fetchIntegrationCategoryContent(
  lang: string,
  categorySlug: string
): Promise<HomeContentResponse> {
  const { data } = await api.get<HomeContentResponse>("/content", {
    params: { lang, page: "integrationCategory", slug: categorySlug },
  });
  return data;
}

export function useIntegrationCategoryContentQuery(
  lang: string,
  categorySlug: string
) {
  return useQuery({
    queryKey: queryKeys.contentIntegrationCategory(lang, categorySlug),
    queryFn: () => fetchIntegrationCategoryContent(lang, categorySlug),
    enabled: Boolean(lang && categorySlug),
  });
}
