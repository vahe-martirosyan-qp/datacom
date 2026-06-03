"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { SubmitLeadRequest, SubmitLeadResponse } from "@/types/lead";

export function useSubmitLeadMutation() {
  return useMutation({
    mutationFn: async (payload: SubmitLeadRequest) => {
      const { data } = await api.post<SubmitLeadResponse>("/leads", payload);
      return data;
    },
  });
}
