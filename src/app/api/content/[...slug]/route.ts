import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/server/adminSession";
import {
  ensureContentStoreHydrated,
  setContentValue,
} from "@/lib/server/contentStore";

interface PutBody {
  lang?: string;
  value?: string;
}

export async function PUT(
  request: Request,
  context: { params: { slug: string[] } }
) {
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const key = context.params.slug.join(".");

  let body: PutBody;
  try {
    body = (await request.json()) as PutBody;
  } catch {
    return NextResponse.json(
      { error: "Некорректное тело запроса" },
      { status: 400 }
    );
  }

  const lang = typeof body.lang === "string" ? body.lang : "";
  const value = typeof body.value === "string" ? body.value : "";

  if (!lang) {
    return NextResponse.json({ error: "Укажите язык" }, { status: 400 });
  }

  await ensureContentStoreHydrated();
  await setContentValue(lang, key, value);
  return NextResponse.json({ ok: true, key, lang });
}
