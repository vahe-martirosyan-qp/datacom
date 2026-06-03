import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { HomeContentResponse } from "@/types";

export async function fetchEquipmentCategoryContent(
  lang: string,
  categorySlug: string
): Promise<HomeContentResponse> {
  const { data } = await api.get<HomeContentResponse>("/content", {
    params: { lang, page: "equipmentCategory", slug: categorySlug },
  });
  return data;
}

export function useEquipmentCategoryContentQuery(
  lang: string,
  categorySlug: string
) {
  return useQuery({
    queryKey: queryKeys.contentEquipmentCategory(lang, categorySlug),
    queryFn: () => fetchEquipmentCategoryContent(lang, categorySlug),
    enabled: Boolean(lang && categorySlug),
  });
}
