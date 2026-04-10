import { NextResponse } from "next/server";
import { normalizeNewProjectSlug } from "@/lib/projectHrefUtils";
import { assertAdminSession } from "@/lib/server/adminSession";
import {
  deleteProject,
  ensureContentStoreHydrated,
} from "@/lib/server/contentStore";

interface RouteParams {
  params: { slug: string };
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const raw = decodeURIComponent(params.slug ?? "");
  const slug = normalizeNewProjectSlug(raw);
  if (!slug) {
    return NextResponse.json(
      { error: "Некорректный slug." },
      { status: 400 }
    );
  }

  await ensureContentStoreHydrated();
  await deleteProject(slug);
  return NextResponse.json({ ok: true, slug });
}
