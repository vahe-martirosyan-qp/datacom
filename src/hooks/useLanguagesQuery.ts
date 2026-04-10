"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { Language, LanguagesResponse } from "@/types";

async function fetchLanguages(): Promise<Language[]> {
  const { data } = await api.get<LanguagesResponse>("/languages");
  return data.languages;
}

export function useLanguagesQuery() {
  return useQuery({
    queryKey: queryKeys.languages,
    queryFn: fetchLanguages,
  });
}
