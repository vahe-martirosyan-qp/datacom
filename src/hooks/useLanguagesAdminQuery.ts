import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { Language, LanguagesAdminResponse } from "@/types";

async function fetchLanguagesAdmin(): Promise<Language[]> {
  const { data } = await api.get<LanguagesAdminResponse>("/admin/languages");
  return data.languages;
}

export function useLanguagesAdminQuery() {
  return useQuery({
    queryKey: queryKeys.languagesAdmin,
    queryFn: fetchLanguagesAdmin,
  });
}
