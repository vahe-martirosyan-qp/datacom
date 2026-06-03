import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { HomeContentResponse } from "@/types";

export async function fetchEquipmentContent(
  lang: string
): Promise<HomeContentResponse> {
  const { data } = await api.get<HomeContentResponse>("/content", {
    params: { lang, page: "equipment" },
  });
  return data;
}

export function useEquipmentContentQuery(lang: string) {
  return useQuery({
    queryKey: queryKeys.contentEquipment(lang),
    queryFn: () => fetchEquipmentContent(lang),
    enabled: Boolean(lang),
  });
}
