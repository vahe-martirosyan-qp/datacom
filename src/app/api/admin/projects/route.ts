import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/server/adminSession";
import {
  appendProjectHomeCard,
  ensureContentStoreHydrated,
  ensureProjectStub,
} from "@/lib/server/contentStore";

interface PostBody {
  /** If false, only create `project.{id}.*` keys; skip `projects.list` card. Default true. */
  addHomeCard?: boolean;
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

  const id = randomUUID();

  await ensureContentStoreHydrated();
  await ensureProjectStub(id);
  if (body.addHomeCard !== false) {
    await appendProjectHomeCard(id);
  }

  return NextResponse.json({ ok: true, id });
}
