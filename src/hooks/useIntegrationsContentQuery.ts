import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { HomeContentResponse } from "@/types";

export async function fetchIntegrationsContent(
  lang: string
): Promise<HomeContentResponse> {
  const { data } = await api.get<HomeContentResponse>("/content", {
    params: { lang, page: "integrations" },
  });
  return data;
}

export function useIntegrationsContentQuery(lang: string) {
  return useQuery({
    queryKey: queryKeys.contentIntegrations(lang),
    queryFn: () => fetchIntegrationsContent(lang),
    enabled: Boolean(lang),
  });
}
