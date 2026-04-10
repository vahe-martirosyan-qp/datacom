/** Upload without forcing JSON Content-Type (axios default breaks multipart). */

export async function uploadAdminImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  const data = (await res.json()) as { error?: string; url?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "Ошибка загрузки");
  }
  if (!data.url) {
    throw new Error("Сервер не вернул URL");
  }
  return data.url;
}
