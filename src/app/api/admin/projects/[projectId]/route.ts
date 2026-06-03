import { NextResponse } from "next/server";
import { resolveProjectKeySegment } from "@/lib/projectHrefUtils";
import { assertAdminSession } from "@/lib/server/adminSession";
import {
  deleteProject,
  ensureContentStoreHydrated,
} from "@/lib/server/contentStore";

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const resolvedParams = await params;
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const raw = decodeURIComponent(resolvedParams.projectId ?? "");
  const segment = resolveProjectKeySegment(raw);
  if (!segment) {
    return NextResponse.json(
      { error: "Некорректный id проекта." },
      { status: 400 }
    );
  }

  await ensureContentStoreHydrated();
  await deleteProject(segment);
  return NextResponse.json({ ok: true, id: segment });
}
