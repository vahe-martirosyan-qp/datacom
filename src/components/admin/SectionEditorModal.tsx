"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useLayoutEffect,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { api } from "@/lib/api";
import type { AdminSectionDef } from "@/lib/adminSections";
import { getAdminFieldKind } from "@/lib/adminFieldKinds";
import { adminFormLabel } from "@/lib/adminFormLabels";
import { buildContentPutPath } from "@/lib/contentUtils";
import { queryKeys } from "@/lib/queryKeys";
import type { HomeContentResponse } from "@/types";
import { AdminImageUrlField } from "./AdminImageUrlField";
import {
  BlogPostsEditor,
  BrandListEditor,
  FeatureCardsEditor,
  FooterColumnsEditor,
  ProjectCardsEditor,
  MegaNavEditor,
  NavItemsEditor,
  SpotlightCardsEditor,
  StepItemsEditor,
} from "./StructuredFieldEditors";
import { TiptapRichTextEditor } from "./TiptapRichTextEditor";
import styles from "./SectionEditorModal.module.scss";

interface SectionEditorModalProps {
  open: boolean;
  onClose: () => void;
  section: AdminSectionDef | null;
  lang: string;
  contentMap: Record<string, string>;
  /** `embedded` — форма на странице без затемнённого оверлея (например `/admin/projects/[slug]`). */
  variant?: "modal" | "embedded";
  /**
   * Keys whose values are written to every `syncLanguageCodes` locale on save
   * (e.g. one hero image for all languages).
   */
  syncKeysAcrossLanguages?: string[];
  /**
   * When set (e.g. all active CMS codes on `/admin/projects/[slug]`), used to invalidate every
   * locale after a project save. Also required when `syncKeysAcrossLanguages` is used.
   */
  syncLanguageCodes?: string[];
}

interface SimpleFieldProps {
  fieldKey: string;
  value: string;
  onChange: (v: string) => void;
  kind: "text" | "textarea" | "url";
}

function SimpleField({ fieldKey, value, onChange, kind }: SimpleFieldProps) {
  const label = adminFormLabel(fieldKey);

  if (kind === "textarea") {
    const rows = fieldKey.endsWith(".equipment") ? 10 : 5;
    return (
      <label className={styles.sectionEditorModal__field}>
        <span className={styles.sectionEditorModal__label}>{label}</span>
        <textarea
          className={styles.sectionEditorModal__input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
        />
      </label>
    );
  }

  return (
    <label className={styles.sectionEditorModal__field}>
      <span className={styles.sectionEditorModal__label}>{label}</span>
      <input
        className={styles.sectionEditorModal__input}
        type={kind === "url" ? "url" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={kind === "url" ? "https://…" : undefined}
      />
    </label>
  );
}

export function SectionEditorModal({
  open,
  onClose,
  section,
  lang,
  contentMap,
  variant = "modal",
  syncKeysAcrossLanguages,
  syncLanguageCodes,
}: SectionEditorModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  /** Sync CMS map → form before paint so inputs and TipTap see loaded data immediately. */
  useLayoutEffect(() => {
    if (!section || !open) {
      return;
    }
    const next: Record<string, string> = {};
    for (const k of section.keys) {
      next[k] = contentMap[k] ?? "";
    }
    setValues(next);
  }, [section, open, contentMap]);

  const syncKeys = syncKeysAcrossLanguages ?? [];
  const syncLangs =
    syncLanguageCodes && syncLanguageCodes.length > 0
      ? syncLanguageCodes
      : null;

  const mutation = useMutation({
    mutationFn: async (payload: {
      lang: string;
      values: Record<string, string>;
    }) => {
      for (const [key, value] of Object.entries(payload.values)) {
        if (syncLangs && syncKeys.includes(key)) {
          for (const lc of syncLangs) {
            await api.put(buildContentPutPath(key), {
              lang: lc,
              value,
            });
          }
        } else {
          await api.put(buildContentPutPath(key), {
            lang: payload.lang,
            value,
          });
        }
      }
    },
    onMutate: async (payload) => {
      const qk = queryKeys.content("home", payload.lang);
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<HomeContentResponse>(qk);
      if (previous) {
        queryClient.setQueryData<HomeContentResponse>(qk, {
          ...previous,
          entries: previous.entries.map((e) =>
            payload.values[e.key] !== undefined
              ? { ...e, value: payload.values[e.key] ?? "" }
              : e
          ),
        });
      }
      return { previous, qk };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(ctx.qk, ctx.previous);
      }
    },
    onSettled: async (_data, _err, payload) => {
      if (!payload) {
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: queryKeys.content("home", payload.lang),
      });
      const slugs = new Set<string>();
      for (const k of Object.keys(payload.values)) {
        const m = k.match(/^project\.([^.]+)\./);
        if (m?.[1]) {
          slugs.add(m[1]);
        }
      }
      /** Project saves: refresh every locale for this slug (hero is shared; fields differ per lang). */
      const langsToRefresh =
        syncLangs && (syncKeys.length > 0 || slugs.size > 0)
          ? syncLangs
          : [payload.lang];
      for (const s of slugs) {
        for (const lc of langsToRefresh) {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.contentProject(lc, s),
          });
        }
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate(
      { lang, values },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleDialogKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const setKey = (key: string, v: string) => {
    setValues((s) => ({ ...s, [key]: v }));
  };

  const renderField = (key: string) => {
    const kind = getAdminFieldKind(key);
    const value = values[key] ?? "";

    switch (kind) {
      case "navItems":
        return (
          <NavItemsEditor
            key={key}
            value={value}
            onChange={(v) => setKey(key, v)}
          />
        );
      case "navMega":
        return (
          <MegaNavEditor
            key={key}
            value={value}
            onChange={(v) => setKey(key, v)}
          />
        );
      case "featureCards":
        return (
          <FeatureCardsEditor
            key={key}
            value={value}
            onChange={(v) => setKey(key, v)}
          />
        );
      case "projectCards":
        return (
          <ProjectCardsEditor
            key={key}
            value={value}
            onChange={(v) => setKey(key, v)}
          />
        );
      case "spotlightCards":
        return (
          <SpotlightCardsEditor
            key={key}
            value={value}
            onChange={(v) => setKey(key, v)}
          />
        );
      case "blogPosts":
        return (
          <BlogPostsEditor
            key={key}
            value={value}
            onChange={(v) => setKey(key, v)}
          />
        );
      case "stepItems":
        return (
          <StepItemsEditor
            key={key}
            value={value}
            onChange={(v) => setKey(key, v)}
          />
        );
      case "brandList":
        return (
          <BrandListEditor
            key={key}
            value={value}
            onChange={(v) => setKey(key, v)}
          />
        );
      case "footerColumns":
        return (
          <FooterColumnsEditor
            key={key}
            value={value}
            onChange={(v) => setKey(key, v)}
          />
        );
      case "tiptap":
        return (
          <label key={key} className={styles.sectionEditorModal__field}>
            <span className={styles.sectionEditorModal__label}>
              {adminFormLabel(key)}
            </span>
            <TiptapRichTextEditor
              id={`field-${key.replace(/\./g, "-")}`}
              value={value}
              onChange={(v) => setKey(key, v)}
              placeholder="Текст страницы проекта…"
            />
          </label>
        );
      case "imageUpload":
        return (
          <AdminImageUrlField
            key={key}
            id={`field-${key.replace(/\./g, "-")}`}
            label={adminFormLabel(key)}
            value={value}
            onChange={(v) => setKey(key, v)}
          />
        );
      case "text":
      case "textarea":
      case "url":
        return (
          <SimpleField
            key={key}
            fieldKey={key}
            value={value}
            onChange={(v) => setKey(key, v)}
            kind={kind}
          />
        );
    }
  };

  if (!open || !section) {
    return null;
  }

  const panel = (
    <div
      className={`${styles.sectionEditorModal}${
        variant === "embedded"
          ? ` ${styles["sectionEditorModal--embedded"]}`
          : ""
      }`}
      role={variant === "embedded" ? "region" : "dialog"}
      aria-modal={variant === "modal" ? true : undefined}
      aria-labelledby="section-editor-title"
      onClick={variant === "modal" ? (e) => e.stopPropagation() : undefined}
      onKeyDown={handleDialogKeyDown}
    >
      <h2
        id="section-editor-title"
        className={styles.sectionEditorModal__title}
      >
        {section.title}
      </h2>
      <p className={styles.sectionEditorModal__desc}>{section.description}</p>
      <form onSubmit={handleSubmit} noValidate>
        {section.keys.map((key) => renderField(key))}
        {mutation.isError ? (
          <p className={styles.sectionEditorModal__error}>
            Не удалось сохранить. Проверьте авторизацию.
          </p>
        ) : null}
        <div className={styles.sectionEditorModal__actions}>
          <button
            type="button"
            className={styles.sectionEditorModal__btnSecondary}
            onClick={onClose}
          >
            {variant === "embedded" ? "Назад" : "Отмена"}
          </button>
          <button
            type="submit"
            className={styles.sectionEditorModal__btnPrimary}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );

  if (variant === "embedded") {
    return panel;
  }

  return (
    <div
      className={styles.sectionEditorModal__backdrop}
      role="presentation"
      onClick={onClose}
    >
      {panel}
    </div>
  );
}
