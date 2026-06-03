import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { HomeContentResponse } from "@/types";

export async function fetchCompanyContent(
  lang: string
): Promise<HomeContentResponse> {
  const { data } = await api.get<HomeContentResponse>("/content", {
    params: { lang, page: "company" },
  });
  return data;
}

export function useCompanyContentQuery(lang: string) {
  return useQuery({
    queryKey: queryKeys.contentCompany(lang),
    queryFn: () => fetchCompanyContent(lang),
    enabled: Boolean(lang),
  });
}
