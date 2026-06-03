import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { HomeContentResponse } from "@/types";

export async function fetchBlogContent(
  lang: string
): Promise<HomeContentResponse> {
  const { data } = await api.get<HomeContentResponse>("/content", {
    params: { lang, page: "blog" },
  });
  return data;
}

export function useBlogContentQuery(lang: string) {
  return useQuery({
    queryKey: queryKeys.contentBlog(lang),
    queryFn: () => fetchBlogContent(lang),
    enabled: Boolean(lang),
  });
}
