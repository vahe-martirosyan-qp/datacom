"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { HomeContentResponse } from "@/types";

export async function fetchEquipmentProductContent(
  lang: string,
  categorySlug: string,
  productSlug: string
): Promise<HomeContentResponse> {
  const { data } = await api.get<HomeContentResponse>("/content", {
    params: {
      lang,
      page: "equipmentProduct",
      slug: `${categorySlug}/${productSlug}`,
    },
  });
  return data;
}

export function useEquipmentProductContentQuery(
  lang: string,
  categorySlug: string,
  productSlug: string
) {
  return useQuery({
    queryKey: queryKeys.contentEquipmentProduct(lang, categorySlug, productSlug),
    queryFn: () =>
      fetchEquipmentProductContent(lang, categorySlug, productSlug),
    enabled: Boolean(categorySlug && productSlug),
  });
}
