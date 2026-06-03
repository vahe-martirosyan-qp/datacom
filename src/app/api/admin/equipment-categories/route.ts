import { NextResponse } from "next/server";
import {
  normalizeEquipmentCategorySlug,
  slugifyEquipmentCategoryTitle,
} from "@/lib/equipmentHrefUtils";
import { assertAdminSession } from "@/lib/server/adminSession";
import {
  appendEquipmentMegaMenuChild,
  ensureContentStoreHydrated,
  ensureEquipmentCategoryStub,
  equipmentCategorySlugExists,
  uniqueEquipmentCategorySlug,
} from "@/lib/server/contentStore";

interface PostBody {
  title?: string;
  slug?: string;
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
    /* empty body OK */
  }

  const title = (body.title ?? "").trim();
  const requestedSlug = body.slug?.trim();
  const slug = requestedSlug
    ? normalizeEquipmentCategorySlug(requestedSlug)
    : title
      ? uniqueEquipmentCategorySlug(slugifyEquipmentCategoryTitle(title))
      : null;

  if (!slug) {
    return NextResponse.json(
      { error: "Укажите название или корректный slug." },
      { status: 400 }
    );
  }

  if (equipmentCategorySlugExists(slug)) {
    return NextResponse.json(
      { error: "Категория с таким slug уже существует." },
      { status: 409 }
    );
  }

  await ensureContentStoreHydrated();
  await ensureEquipmentCategoryStub(slug, title);
  await appendEquipmentMegaMenuChild(slug, { title });

  return NextResponse.json({ ok: true, slug });
}
