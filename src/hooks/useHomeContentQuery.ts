"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { HomeContentResponse } from "@/types";

async function fetchHomeContent(lang: string): Promise<HomeContentResponse> {
  const { data } = await api.get<HomeContentResponse>("/content", {
    params: { lang, page: "home" },
  });
  return data;
}

export function useHomeContentQuery(lang: string) {
  return useQuery({
    queryKey: queryKeys.content("home", lang),
    queryFn: () => fetchHomeContent(lang),
  });
}
