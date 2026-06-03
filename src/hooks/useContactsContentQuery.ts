import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { HomeContentResponse } from "@/types";

export async function fetchContactsContent(
  lang: string
): Promise<HomeContentResponse> {
  const { data } = await api.get<HomeContentResponse>("/content", {
    params: { lang, page: "contacts" },
  });
  return data;
}

export function useContactsContentQuery(lang: string) {
  return useQuery({
    queryKey: queryKeys.contentContacts(lang),
    queryFn: () => fetchContactsContent(lang),
    enabled: Boolean(lang),
  });
}
