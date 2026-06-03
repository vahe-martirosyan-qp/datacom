"use client";

import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { getCroppedImageFile } from "@/lib/imageCropUtils";
import styles from "./AdminImageCropModal.module.scss";

export interface AdminImageCropModalProps {
  open: boolean;
  imageSrc: string;
  aspect: number;
  title?: string;
  hint?: string;
  outputMaxWidth?: number;
  outputMime?: "image/png" | "image/jpeg" | "image/webp";
  onClose: () => void;
  onConfirm: (file: File) => void | Promise<void>;
}

export function AdminImageCropModal({
  open,
  imageSrc,
  aspect,
  title = "Обрезка изображения",
  hint = "Перемещайте и масштабируйте изображение в рамке. Прозрачный фон сохраняется в PNG.",
  outputMaxWidth,
  outputMime = "image/png",
  onClose,
  onConfirm,
}: AdminImageCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!croppedAreaPixels) {
      setErr("Подождите, пока загрузится область обрезки");
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      const ext =
        outputMime === "image/jpeg"
          ? "jpg"
          : outputMime === "image/webp"
            ? "webp"
            : "png";
      const file = await getCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
        `cropped.${ext}`,
        outputMime,
        outputMaxWidth
      );
      await onConfirm(file);
      onClose();
    } catch (unknown) {
      setErr(
        unknown instanceof Error ? unknown.message : "Ошибка обрезки"
      );
    } finally {
      setBusy(false);
    }
  };

  if (!open || !mounted) {
    return null;
  }

  const handleBackdropClick = () => {
    if (!busy) {
      onClose();
    }
  };

  const panel = (
    <div
      className={styles.adminImageCropModal__backdrop}
      role="presentation"
      onClick={handleBackdropClick}
    >
      <div
        className={styles.adminImageCropModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-image-crop-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape" && !busy) {
            e.stopPropagation();
            onClose();
          }
        }}
      >
        <h2
          id="admin-image-crop-title"
          className={styles.adminImageCropModal__title}
        >
          {title}
        </h2>
        {hint ? (
          <p className={styles.adminImageCropModal__hint}>{hint}</p>
        ) : null}
        <div className={styles.adminImageCropModal__cropArea}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className={styles.adminImageCropModal__controls}>
          <span className={styles.adminImageCropModal__zoomLabel}>Масштаб</span>
          <input
            type="range"
            className={styles.adminImageCropModal__zoom}
            min={1}
            max={3}
            step={0.02}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Масштаб изображения"
          />
        </div>
        {err ? (
          <p className={styles.adminImageCropModal__error} role="alert">
            {err}
          </p>
        ) : null}
        <div className={styles.adminImageCropModal__actions}>
          <button
            type="button"
            className={styles.adminImageCropModal__btnSecondary}
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Отмена
          </button>
          <button
            type="button"
            className={styles.adminImageCropModal__btnPrimary}
            disabled={busy}
            onClick={handleApply}
          >
            {busy ? "Загрузка…" : "Применить и загрузить"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}
