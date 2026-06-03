import { NextResponse } from "next/server";
import {
  normalizeIntegrationCategorySlug,
  slugifyIntegrationCategoryTitle,
} from "@/lib/integrationsHrefUtils";
import { assertAdminSession } from "@/lib/server/adminSession";
import {
  appendIntegrationsMegaMenuChild,
  ensureContentStoreHydrated,
  ensureIntegrationCategoryStub,
  integrationCategorySlugExists,
  uniqueIntegrationCategorySlug,
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
    ? normalizeIntegrationCategorySlug(requestedSlug)
    : title
      ? uniqueIntegrationCategorySlug(slugifyIntegrationCategoryTitle(title))
      : null;

  if (!slug) {
    return NextResponse.json(
      { error: "Укажите название или корректный slug." },
      { status: 400 }
    );
  }

  if (integrationCategorySlugExists(slug)) {
    return NextResponse.json(
      { error: "Услуга с таким slug уже существует." },
      { status: 409 }
    );
  }

  await ensureContentStoreHydrated();
  await ensureIntegrationCategoryStub(slug, title);
  await appendIntegrationsMegaMenuChild(slug, { title });

  return NextResponse.json({ ok: true, slug });
}
