import { NextResponse } from "next/server";
import { resolveBlogKeySegment } from "@/lib/blogHrefUtils";
import { assertAdminSession } from "@/lib/server/adminSession";
import {
  deleteBlogPost,
  ensureContentStoreHydrated,
} from "@/lib/server/contentStore";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const resolvedParams = await params;
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const raw = decodeURIComponent(resolvedParams.slug ?? "");
  const segment = resolveBlogKeySegment(raw);
  if (!segment) {
    return NextResponse.json(
      { error: "Некорректный slug статьи." },
      { status: 400 }
    );
  }

  await ensureContentStoreHydrated();
  await deleteBlogPost(segment);
  return NextResponse.json({ ok: true, slug: segment });
}
