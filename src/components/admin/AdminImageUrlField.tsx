"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { uploadAdminImageFile } from "@/lib/adminUpload";
import { isImageUrlCropSafe } from "@/lib/imageCropUtils";
import { AdminImageCropModal } from "./AdminImageCropModal";
import styles from "./AdminImageUrlField.module.scss";

export interface AdminImageCropConfig {
  aspect: number;
  outputMaxWidth?: number;
  outputMime?: "image/png" | "image/jpeg" | "image/webp";
  modalTitle?: string;
  modalHint?: string;
}

export interface AdminImageUrlFieldProps {
  label: string;
  value: string;
  onChange: (next: string) => void;
  id?: string;
  /** Tighter layout for nested editors (e.g. project cards). */
  compact?: boolean;
  /** Opens crop UI before upload (file pick and re-crop for same-origin URLs). */
  crop?: AdminImageCropConfig;
}

export function AdminImageUrlField({
  label,
  value,
  onChange,
  id: idProp,
  compact,
  crop,
}: AdminImageUrlFieldProps) {
  const autoId = useId();
  const id = idProp ?? `img-${autoId}`;
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropObjectUrl, setCropObjectUrl] = useState<string | null>(null);

  const showPreview =
    Boolean(value?.trim()) &&
    (value.startsWith("/") ||
      value.startsWith("http://") ||
      value.startsWith("https://"));

  const closeCrop = useCallback(() => {
    setCropSrc(null);
    if (cropObjectUrl) {
      URL.revokeObjectURL(cropObjectUrl);
      setCropObjectUrl(null);
    }
  }, [cropObjectUrl]);

  useEffect(() => {
    return () => {
      if (cropObjectUrl) {
        URL.revokeObjectURL(cropObjectUrl);
      }
    };
  }, [cropObjectUrl]);

  const uploadFile = async (file: File) => {
    setErr(null);
    setBusy(true);
    try {
      const url = await uploadAdminImageFile(file);
      onChange(url);
    } catch (unknown) {
      setErr(unknown instanceof Error ? unknown.message : "Ошибка загрузки");
    } finally {
      setBusy(false);
    }
  };

  const onPick = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) {
      return;
    }
    setErr(null);
    if (crop) {
      const objectUrl = URL.createObjectURL(file);
      setCropObjectUrl(objectUrl);
      setCropSrc(objectUrl);
      return;
    }
    await uploadFile(file);
  };

  const openRecrop = () => {
    const trimmed = value.trim();
    if (!trimmed || !crop) {
      return;
    }
    if (!isImageUrlCropSafe(trimmed)) {
      setErr(
        "Обрезка недоступна для внешних ссылок. Загрузите файл с компьютера."
      );
      return;
    }
    setErr(null);
    setCropSrc(trimmed);
  };

  const handleCropConfirm = async (file: File) => {
    await uploadFile(file);
    closeCrop();
  };

  const canRecrop = Boolean(crop && value.trim() && isImageUrlCropSafe(value));

  return (
    <div
      className={`${styles.adminImageUrlField}${
        compact ? ` ${styles["adminImageUrlField--compact"]}` : ""
      }`}
    >
      <span className={styles.adminImageUrlField__label}>{label}</span>
      {showPreview ? (
        <div className={styles.adminImageUrlField__preview}>
          {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary URLs */}
          <img src={value} alt="" className={styles.adminImageUrlField__thumb} />
        </div>
      ) : null}
      <div className={styles.adminImageUrlField__row}>
        <input
          id={id}
          className={styles.adminImageUrlField__input}
          type="text"
          inputMode="url"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…, /uploads/… или загрузите файл"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className={styles.adminImageUrlField__file}
          aria-hidden
          tabIndex={-1}
          onChange={onPick}
        />
        <button
          type="button"
          className={styles.adminImageUrlField__uploadBtn}
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          {busy ? "…" : crop ? "Выбрать и обрезать" : "Загрузить"}
        </button>
        {canRecrop ? (
          <button
            type="button"
            className={styles.adminImageUrlField__cropBtn}
            disabled={busy}
            onClick={openRecrop}
          >
            Обрезать
          </button>
        ) : null}
      </div>
      {err ? (
        <p className={styles.adminImageUrlField__error} role="alert">
          {err}
        </p>
      ) : null}
      {crop && cropSrc ? (
        <AdminImageCropModal
          open
          imageSrc={cropSrc}
          aspect={crop.aspect}
          outputMaxWidth={crop.outputMaxWidth}
          outputMime={crop.outputMime}
          title={crop.modalTitle}
          hint={crop.modalHint}
          onClose={closeCrop}
          onConfirm={handleCropConfirm}
        />
      ) : null}
    </div>
  );
}
