import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/server/adminSession";
import {
  ensureContentStoreHydrated,
  ensureLangContentBucket,
  getLanguagesAll,
  setLanguages,
} from "@/lib/server/contentStore";
import type { Language, LanguagesAdminResponse } from "@/types";

function isValidLanguage(l: unknown): l is Language {
  if (!l || typeof l !== "object") return false;
  const o = l as Record<string, unknown>;
  return (
    typeof o.code === "string" &&
    o.code.length > 0 &&
    o.code.length <= 16 &&
    /^[a-z0-9]+(-[a-z0-9]+)*$/i.test(o.code) &&
    typeof o.name === "string" &&
    o.name.length > 0 &&
    typeof o.active === "boolean" &&
    (o.dir === undefined || o.dir === "ltr" || o.dir === "rtl")
  );
}

export async function GET() {
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  await ensureContentStoreHydrated();
  const body: LanguagesAdminResponse = { languages: getLanguagesAll() };
  return NextResponse.json(body);
}

export async function PUT(request: Request) {
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Некорректное тело запроса" },
      { status: 400 }
    );
  }

  const raw = (parsed as { languages?: unknown }).languages;
  if (!Array.isArray(raw) || raw.length === 0) {
    return NextResponse.json(
      { error: "Передайте непустой массив languages" },
      { status: 400 }
    );
  }

  const next: Language[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (!isValidLanguage(item)) {
      return NextResponse.json(
        { error: "Некорректная запись языка (code, name, active, dir?)" },
        { status: 400 }
      );
    }
    const code = item.code.toLowerCase();
    if (seen.has(code)) {
      return NextResponse.json(
        { error: `Дубликат кода: ${code}` },
        { status: 400 }
      );
    }
    seen.add(code);
    next.push({
      code,
      name: item.name.trim(),
      active: item.active,
      dir: item.dir,
    });
  }

  await ensureContentStoreHydrated();
  await setLanguages(next);
  for (const l of next) {
    await ensureLangContentBucket(l.code);
  }

  return NextResponse.json({ ok: true, languages: getLanguagesAll() });
}
