import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { Language } from "@/types";

export function useLanguagesSaveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (languages: Language[]) => {
      const { data } = await api.put<{ ok: boolean; languages: Language[] }>(
        "/admin/languages",
        { languages }
      );
      return data.languages;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.languages });
      await queryClient.invalidateQueries({ queryKey: queryKeys.languagesAdmin });
    },
  });
}
