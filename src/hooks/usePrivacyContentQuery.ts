import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { HomeContentResponse } from "@/types";

export async function fetchPrivacyContent(
  lang: string
): Promise<HomeContentResponse> {
  const { data } = await api.get<HomeContentResponse>("/content", {
    params: { lang, page: "privacy" },
  });
  return data;
}

export function usePrivacyContentQuery(lang: string) {
  return useQuery({
    queryKey: queryKeys.contentPrivacy(lang),
    queryFn: () => fetchPrivacyContent(lang),
    enabled: Boolean(lang),
  });
}
