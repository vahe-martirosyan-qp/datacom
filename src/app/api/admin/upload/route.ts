import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/server/adminSession";
import { registerUpload, type UploadRecord } from "@/lib/server/uploadRegistry";

const MAX_BYTES = 10 * 1024 * 1024;

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(request: Request) {
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Ожидается multipart/form-data" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Нет файла (поле file)" }, { status: 400 });
  }

  const blob = file as File;
  const mime = blob.type || "application/octet-stream";
  const ext = ALLOWED[mime];
  if (!ext) {
    return NextResponse.json(
      { error: "Допустимы только JPEG, PNG, WebP, GIF" },
      { status: 400 }
    );
  }

  const buf = Buffer.from(await blob.arrayBuffer());
  if (buf.length > MAX_BYTES) {
    return NextResponse.json(
      { error: "Файл больше 10 МБ" },
      { status: 400 }
    );
  }

  const id = randomUUID();
  const filename = `${id}${ext}`;
  const relativeDir = path.join("uploads", "projects");
  const publicDir = path.join(process.cwd(), "public", relativeDir);
  await mkdir(publicDir, { recursive: true });
  const diskPath = path.join(publicDir, filename);
  await writeFile(diskPath, buf);

  const url = `/${relativeDir.replace(/\\/g, "/")}/${filename}`;
  const record: UploadRecord = {
    id,
    url,
    filename,
    originalName: blob.name || filename,
    mimeType: mime,
    sizeBytes: buf.length,
    createdAtIso: new Date().toISOString(),
  };
  registerUpload(record);

  return NextResponse.json({ ok: true, url, id });
}
