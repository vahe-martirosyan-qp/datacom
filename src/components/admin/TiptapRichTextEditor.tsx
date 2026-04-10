"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useCallback, useRef } from "react";
import styles from "./TiptapRichTextEditor.module.scss";

export interface TiptapRichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** For admin form labels / a11y */
  id?: string;
}

export function TiptapRichTextEditor({
  value,
  onChange,
  placeholder = "Текст страницы…",
  id,
}: TiptapRichTextEditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3] },
          link: {
            openOnClick: false,
          },
        }),
        Placeholder.configure({ placeholder }),
      ],
      content: value || "",
      editorProps: {
        attributes: {
          class: styles.tiptapRichTextEditor__prose,
          ...(id ? { id } : {}),
        },
      },
      onUpdate: ({ editor: ed }) => {
        onChangeRef.current(ed.getHTML());
      },
    },
    [placeholder]
  );

  useEffect(() => {
    if (!editor) return;
    const next = value || "";
    if (next === editor.getHTML()) return;
    editor.commands.setContent(next, { emitUpdate: false });
  }, [value, editor]);

  const run = useCallback(
    (fn: () => boolean) => {
      if (!editor) return;
      fn();
      editor.commands.focus();
    },
    [editor]
  );

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL ссылки", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className={styles.tiptapRichTextEditor}>
        <div className={styles.tiptapRichTextEditor__loading}>Загрузка редактора…</div>
      </div>
    );
  }

  return (
    <div className={styles.tiptapRichTextEditor}>
      <div
        className={styles.tiptapRichTextEditor__toolbar}
        role="toolbar"
        aria-label="Форматирование"
      >
        <button
          type="button"
          className={`${styles.tiptapRichTextEditor__btn}${
            editor.isActive("bold")
              ? ` ${styles["tiptapRichTextEditor__btn--active"]}`
              : ""
          }`}
          onClick={() => run(() => editor.chain().toggleBold().run())}
        >
          B
        </button>
        <button
          type="button"
          className={`${styles.tiptapRichTextEditor__btn}${
            editor.isActive("italic")
              ? ` ${styles["tiptapRichTextEditor__btn--active"]}`
              : ""
          }`}
          onClick={() => run(() => editor.chain().toggleItalic().run())}
        >
          I
        </button>
        <button
          type="button"
          className={`${styles.tiptapRichTextEditor__btn}${
            editor.isActive("strike")
              ? ` ${styles["tiptapRichTextEditor__btn--active"]}`
              : ""
          }`}
          onClick={() => run(() => editor.chain().toggleStrike().run())}
        >
          S
        </button>
        <span className={styles.tiptapRichTextEditor__sep} aria-hidden />
        <button
          type="button"
          className={`${styles.tiptapRichTextEditor__btn}${
            editor.isActive("heading", { level: 2 })
              ? ` ${styles["tiptapRichTextEditor__btn--active"]}`
              : ""
          }`}
          onClick={() =>
            run(() => editor.chain().toggleHeading({ level: 2 }).run())
          }
        >
          H2
        </button>
        <button
          type="button"
          className={`${styles.tiptapRichTextEditor__btn}${
            editor.isActive("heading", { level: 3 })
              ? ` ${styles["tiptapRichTextEditor__btn--active"]}`
              : ""
          }`}
          onClick={() =>
            run(() => editor.chain().toggleHeading({ level: 3 }).run())
          }
        >
          H3
        </button>
        <span className={styles.tiptapRichTextEditor__sep} aria-hidden />
        <button
          type="button"
          className={`${styles.tiptapRichTextEditor__btn}${
            editor.isActive("bulletList")
              ? ` ${styles["tiptapRichTextEditor__btn--active"]}`
              : ""
          }`}
          onClick={() => run(() => editor.chain().toggleBulletList().run())}
        >
          • Список
        </button>
        <button
          type="button"
          className={`${styles.tiptapRichTextEditor__btn}${
            editor.isActive("orderedList")
              ? ` ${styles["tiptapRichTextEditor__btn--active"]}`
              : ""
          }`}
          onClick={() => run(() => editor.chain().toggleOrderedList().run())}
        >
          1. Список
        </button>
        <span className={styles.tiptapRichTextEditor__sep} aria-hidden />
        <button
          type="button"
          className={`${styles.tiptapRichTextEditor__btn}${
            editor.isActive("link")
              ? ` ${styles["tiptapRichTextEditor__btn--active"]}`
              : ""
          }`}
          onClick={setLink}
        >
          Ссылка
        </button>
        <button
          type="button"
          className={styles.tiptapRichTextEditor__btn}
          onClick={() => run(() => editor.chain().setHorizontalRule().run())}
        >
          ─
        </button>
        <span className={styles.tiptapRichTextEditor__sep} aria-hidden />
        <button
          type="button"
          className={styles.tiptapRichTextEditor__btn}
          onClick={() => run(() => editor.chain().undo().run())}
          disabled={!editor.can().undo()}
        >
          Отмена
        </button>
        <button
          type="button"
          className={styles.tiptapRichTextEditor__btn}
          onClick={() => run(() => editor.chain().redo().run())}
          disabled={!editor.can().redo()}
        >
          Вернуть
        </button>
      </div>
      <div className={styles.tiptapRichTextEditor__frame}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
