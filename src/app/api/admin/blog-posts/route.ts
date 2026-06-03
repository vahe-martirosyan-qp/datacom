import { NextResponse } from "next/server";
import {
  normalizeBlogSlug,
  slugifyBlogTitle,
} from "@/lib/blogHrefUtils";
import { assertAdminSession } from "@/lib/server/adminSession";
import {
  appendBlogListCard,
  blogPostSlugExists,
  ensureBlogPostStub,
  ensureContentStoreHydrated,
} from "@/lib/server/contentStore";

interface PostBody {
  title?: string;
  slug?: string;
  addToBlogIndex?: boolean;
  addToHomeTeaser?: boolean;
}

function uniqueBlogSlug(base: string): string {
  let slug = normalizeBlogSlug(base) ?? slugifyBlogTitle(base);
  if (!blogPostSlugExists(slug)) {
    return slug;
  }
  let n = 2;
  while (blogPostSlugExists(`${slug}-${n}`)) {
    n++;
  }
  return `${slug}-${n}`;
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
    ? normalizeBlogSlug(requestedSlug)
    : title
      ? uniqueBlogSlug(slugifyBlogTitle(title))
      : null;

  if (!slug) {
    return NextResponse.json(
      { error: "Укажите заголовок или корректный slug." },
      { status: 400 }
    );
  }

  if (blogPostSlugExists(slug)) {
    return NextResponse.json(
      { error: "Статья с таким slug уже существует." },
      { status: 409 }
    );
  }

  await ensureContentStoreHydrated();
  await ensureBlogPostStub(slug, title);
  if (body.addToBlogIndex !== false || body.addToHomeTeaser) {
    await appendBlogListCard(slug, {
      title: title || slug,
      addToBlogIndex: body.addToBlogIndex !== false,
      addToHomeTeaser: Boolean(body.addToHomeTeaser),
    });
  }

  return NextResponse.json({ ok: true, slug });
}
