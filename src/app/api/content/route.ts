import { NextResponse } from "next/server";
import {
  ensureContentStoreHydrated,
  getPageContent,
} from "@/lib/server/contentStore";
import type { HomeContentResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await ensureContentStoreHydrated();
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") ?? "en";
  const page = searchParams.get("page") ?? "home";
  const slug = searchParams.get("slug");

  const entries = getPageContent(lang, page, slug);
  if (!entries) {
    return NextResponse.json(
      { error: "Page not found" },
      {
        status: 404,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      }
    );
  }

  const body: HomeContentResponse = { page, lang, entries };
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}
