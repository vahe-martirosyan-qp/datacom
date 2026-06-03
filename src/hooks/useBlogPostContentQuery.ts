import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { HomeContentResponse } from "@/types";

export async function fetchBlogPostContent(
  lang: string,
  blogSlug: string
): Promise<HomeContentResponse> {
  const { data } = await api.get<HomeContentResponse>("/content", {
    params: { lang, page: "blogPost", slug: blogSlug },
  });
  return data;
}

export function useBlogPostContentQuery(lang: string, blogSlug: string) {
  return useQuery({
    queryKey: queryKeys.contentBlogPost(lang, blogSlug),
    queryFn: () => fetchBlogPostContent(lang, blogSlug),
    enabled: Boolean(lang && blogSlug),
  });
}
