import { NextResponse } from "next/server";
import {
  ensureContentStoreHydrated,
  getLanguages,
} from "@/lib/server/contentStore";
import type { LanguagesResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureContentStoreHydrated();
  const body: LanguagesResponse = { languages: getLanguages() };
  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store, must-revalidate" },
  });
}
