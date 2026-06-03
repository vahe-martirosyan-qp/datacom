import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/server/adminSession";
import {
  deleteEquipmentCategory,
  ensureContentStoreHydrated,
} from "@/lib/server/contentStore";

export async function DELETE(
  _request: Request,
  context: { params: { slug: string } }
) {
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const slug = context.params.slug?.trim();
  if (!slug) {
    return NextResponse.json({ error: "Укажите slug." }, { status: 400 });
  }

  await ensureContentStoreHydrated();
  const ok = await deleteEquipmentCategory(slug);
  if (!ok) {
    return NextResponse.json({ error: "Категория не найдена." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
