import type { Area } from "react-easy-crop";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () =>
      reject(new Error("Не удалось загрузить изображение"))
    );
    image.crossOrigin = "anonymous";
    image.src = src;
  });
}

/** Whether the URL can be drawn to canvas for cropping (same-origin or relative). */
export function isImageUrlCropSafe(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) {
    return false;
  }
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return true;
  }
  if (trimmed.startsWith("blob:")) {
    return true;
  }
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const parsed = new URL(trimmed, window.location.origin);
    return parsed.origin === window.location.origin;
  } catch {
    return false;
  }
}

export async function getCroppedImageFile(
  imageSrc: string,
  pixelCrop: Area,
  fileName: string,
  mimeType: "image/png" | "image/jpeg" | "image/webp",
  maxOutputWidth?: number
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  let outW = Math.round(pixelCrop.width);
  let outH = Math.round(pixelCrop.height);

  if (maxOutputWidth && outW > maxOutputWidth) {
    outH = Math.round((outH * maxOutputWidth) / outW);
    outW = maxOutputWidth;
  }

  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas не поддерживается");
  }

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outW,
    outH
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("Не удалось обрезать изображение"));
          return;
        }
        resolve(result);
      },
      mimeType,
      mimeType === "image/jpeg" ? 0.92 : undefined
    );
  });

  return new File([blob], fileName, { type: mimeType });
}
