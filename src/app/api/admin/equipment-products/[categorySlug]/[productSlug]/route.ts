import { NextResponse } from "next/server";
import { resolveEquipmentCategorySlug } from "@/lib/equipmentHrefUtils";
import { resolveEquipmentProductSlug } from "@/lib/equipmentProductHrefUtils";
import { assertAdminSession } from "@/lib/server/adminSession";
import {
  deleteEquipmentProduct,
  ensureContentStoreHydrated,
} from "@/lib/server/contentStore";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ categorySlug: string; productSlug: string }> }
) {
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const { categorySlug: categoryRaw, productSlug: productRaw } =
    await context.params;
  const categorySlug = resolveEquipmentCategorySlug(categoryRaw ?? "");
  const productSlug = resolveEquipmentProductSlug(productRaw ?? "");

  if (!categorySlug || !productSlug) {
    return NextResponse.json({ error: "Некорректный адрес товара." }, { status: 400 });
  }

  await ensureContentStoreHydrated();
  const ok = await deleteEquipmentProduct(categorySlug, productSlug);
  if (!ok) {
    return NextResponse.json({ error: "Товар не найден." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, categorySlug, productSlug });
}
