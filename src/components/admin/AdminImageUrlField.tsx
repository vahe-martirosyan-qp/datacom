"use client";

import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { uploadAdminImageFile } from "@/lib/adminUpload";
import styles from "./AdminImageUrlField.module.scss";

export interface AdminImageUrlFieldProps {
  label: string;
  value: string;
  onChange: (next: string) => void;
  id?: string;
  /** Tighter layout for nested editors (e.g. project cards). */
  compact?: boolean;
}

export function AdminImageUrlField({
  label,
  value,
  onChange,
  id: idProp,
  compact,
}: AdminImageUrlFieldProps) {
  const autoId = useId();
  const id = idProp ?? `img-${autoId}`;
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const showPreview =
    Boolean(value?.trim()) &&
    (value.startsWith("/") ||
      value.startsWith("http://") ||
      value.startsWith("https://"));

  const onPick = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) {
      return;
    }
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
          {busy ? "…" : "Загрузить"}
        </button>
      </div>
      {err ? (
        <p className={styles.adminImageUrlField__error} role="alert">
          {err}
        </p>
      ) : null}
    </div>
  );
}
