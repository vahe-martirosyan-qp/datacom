import { NextResponse } from "next/server";
import {
  normalizeEquipmentCategorySlug,
  resolveEquipmentCategorySlug,
} from "@/lib/equipmentHrefUtils";
import {
  normalizeEquipmentProductSlug,
  resolveEquipmentProductSlug,
  slugifyEquipmentProductTitle,
} from "@/lib/equipmentProductHrefUtils";
import { assertAdminSession } from "@/lib/server/adminSession";
import {
  appendEquipmentProductCard,
  ensureContentStoreHydrated,
  ensureEquipmentProductStub,
  equipmentProductExists,
  uniqueEquipmentProductSlug,
} from "@/lib/server/contentStore";

interface PostBody {
  categorySlug?: string;
  productSlug?: string;
  title?: string;
}

export async function POST(request: Request) {
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  let body: PostBody = {};
  try {
    const parsed = (await request.json()) as PostBody;
    if (parsed && typeof parsed === "object") {
      body = parsed;
    }
  } catch {
    return NextResponse.json({ error: "Некорректный JSON." }, { status: 400 });
  }

  const categorySlug =
    resolveEquipmentCategorySlug(body.categorySlug ?? "") ??
    normalizeEquipmentCategorySlug(body.categorySlug ?? "");
  if (!categorySlug) {
    return NextResponse.json(
      { error: "Укажите корректный адрес категории." },
      { status: 400 }
    );
  }

  const title = body.title?.trim() ?? "";
  let productSlug =
    resolveEquipmentProductSlug(body.productSlug ?? "") ??
    normalizeEquipmentProductSlug(body.productSlug ?? "");
  if (!productSlug && title) {
    productSlug = uniqueEquipmentProductSlug(
      categorySlug,
      slugifyEquipmentProductTitle(title)
    );
  }

  if (!productSlug) {
    return NextResponse.json(
      { error: "Укажите название товара или код страницы латиницей." },
      { status: 400 }
    );
  }

  await ensureContentStoreHydrated();
  const existed = equipmentProductExists(categorySlug, productSlug);
  await ensureEquipmentProductStub(categorySlug, productSlug, title);
  await appendEquipmentProductCard(categorySlug, productSlug, { title });

  return NextResponse.json({
    ok: true,
    categorySlug,
    productSlug,
    existed,
  });
}
