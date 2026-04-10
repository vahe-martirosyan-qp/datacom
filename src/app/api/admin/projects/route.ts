import { NextResponse } from "next/server";
import { normalizeNewProjectSlug } from "@/lib/projectHrefUtils";
import { assertAdminSession } from "@/lib/server/adminSession";
import {
  appendProjectHomeCard,
  ensureContentStoreHydrated,
  ensureProjectStub,
} from "@/lib/server/contentStore";

interface PostBody {
  slug?: string;
  /** If false, only create `project.{slug}.*` keys; skip `projects.list` card. Default true. */
  addHomeCard?: boolean;
}

export async function POST(request: Request) {
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    return NextResponse.json(
      { error: "Некорректное тело запроса" },
      { status: 400 }
    );
  }

  const slug = normalizeNewProjectSlug(typeof body.slug === "string" ? body.slug : "");
  if (!slug) {
    return NextResponse.json(
      {
        error:
          "Некорректный slug: только латиница, цифры и дефисы (например my-hotel).",
      },
      { status: 400 }
    );
  }

  await ensureContentStoreHydrated();
  await ensureProjectStub(slug);
  if (body.addHomeCard !== false) {
    await appendProjectHomeCard(slug);
  }

  return NextResponse.json({ ok: true, slug });
}
