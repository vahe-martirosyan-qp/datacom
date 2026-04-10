import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/server/adminSession";
import { listUploadRecords } from "@/lib/server/uploadRegistry";

export async function GET() {
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  return NextResponse.json({ uploads: listUploadRecords() });
}
