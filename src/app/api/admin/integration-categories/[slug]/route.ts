import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/server/adminSession";
import {
  deleteIntegrationCategory,
  ensureContentStoreHydrated,
} from "@/lib/server/contentStore";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const { slug: slugRaw } = await context.params;
  const slug = slugRaw?.trim();
  if (!slug) {
    return NextResponse.json({ error: "Укажите slug." }, { status: 400 });
  }

  await ensureContentStoreHydrated();
  const ok = await deleteIntegrationCategory(slug);
  if (!ok) {
    return NextResponse.json({ error: "Услуга не найдена." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
