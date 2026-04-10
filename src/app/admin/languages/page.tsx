"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguagesAdminQuery } from "@/hooks/useLanguagesAdminQuery";
import { useLanguagesSaveMutation } from "@/hooks/useLanguagesSaveMutation";
import type { Language } from "@/types";
import styles from "@/components/admin/AdminLanguagesPage.module.scss";

function emptyRow(): Language {
  return { code: "", name: "", active: true, dir: "ltr" };
}

export default function AdminLanguagesPage() {
  const q = useLanguagesAdminQuery();
  const save = useLanguagesSaveMutation();
  const [rows, setRows] = useState<Language[]>([]);

  useEffect(() => {
    if (q.data) {
      setRows(q.data.map((l) => ({ ...l })));
    }
  }, [q.data]);

  const dirty = useMemo(() => {
    if (!q.data || rows.length !== q.data.length) return true;
    return rows.some((r, i) => {
      const o = q.data![i];
      if (!o) return true;
      return (
        r.code !== o.code ||
        r.name !== o.name ||
        r.active !== o.active ||
        (r.dir ?? "ltr") !== (o.dir ?? "ltr")
      );
    });
  }, [q.data, rows]);

  const updateRow = (index: number, patch: Partial<Language>) => {
    setRows((prev) => {
      const next = [...prev];
      const cur = next[index];
      if (!cur) return prev;
      next[index] = { ...cur, ...patch };
      return next;
    });
  };

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const onSave = () => {
    const normalized = rows
      .map((r) => ({
        code: r.code.trim().toLowerCase(),
        name: r.name.trim(),
        active: r.active,
        dir: r.dir === "rtl" ? ("rtl" as const) : ("ltr" as const),
      }))
      .filter((r) => r.code && r.name);
    if (normalized.length === 0) {
      return;
    }
    save.mutate(normalized);
  };

  return (
    <div className={styles.adminLanguages}>
      <h1 className={styles.adminLanguages__title}>Языки сайта</h1>
      <p className={styles.adminLanguages__lead}>
        Список хранится на сервере (пока в памяти). Активные языки попадают в
        публичный API и в переключатель в шапке. Для нового кода создаётся копия
        контента с английской главной — затем заполните переводы в разделах
        контента.
      </p>

      {q.isLoading ? (
        <p className={styles.adminLanguages__muted}>Загрузка…</p>
      ) : null}
      {q.isError ? (
        <p className={styles.adminLanguages__error}>
          Не удалось загрузить список. Нужна авторизация в админке.
        </p>
      ) : null}

      {q.data ? (
        <>
          <div className={styles.adminLanguages__toolbar}>
            <button
              type="button"
              className={styles.adminLanguages__btnSecondary}
              onClick={() => setRows((r) => [...r, emptyRow()])}
            >
              + Добавить язык
            </button>
            <button
              type="button"
              className={styles.adminLanguages__btnPrimary}
              onClick={onSave}
              disabled={save.isPending || !dirty || rows.length === 0}
            >
              {save.isPending ? "Сохранение…" : "Сохранить"}
            </button>
          </div>

          {save.isError ? (
            <p className={styles.adminLanguages__error}>Ошибка сохранения.</p>
          ) : null}
          {save.isSuccess && !dirty ? (
            <p className={styles.adminLanguages__ok}>Сохранено.</p>
          ) : null}

          <div className={styles.adminLanguages__tableWrap}>
            <table className={styles.adminLanguages__table}>
              <thead>
                <tr>
                  <th>Код</th>
                  <th>Название</th>
                  <th>Направление</th>
                  <th>Активен</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${row.code}-${index}`}>
                    <td>
                      <input
                        className={styles.adminLanguages__input}
                        value={row.code}
                        onChange={(e) =>
                          updateRow(index, {
                            code: e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, ""),
                          })
                        }
                        placeholder="en"
                        spellCheck={false}
                      />
                    </td>
                    <td>
                      <input
                        className={styles.adminLanguages__input}
                        value={row.name}
                        onChange={(e) =>
                          updateRow(index, { name: e.target.value })
                        }
                        placeholder="English"
                      />
                    </td>
                    <td>
                      <select
                        className={styles.adminLanguages__select}
                        value={row.dir === "rtl" ? "rtl" : "ltr"}
                        onChange={(e) =>
                          updateRow(index, {
                            dir: e.target.value === "rtl" ? "rtl" : "ltr",
                          })
                        }
                      >
                        <option value="ltr">LTR</option>
                        <option value="rtl">RTL</option>
                      </select>
                    </td>
                    <td>
                      <label className={styles.adminLanguages__checkLabel}>
                        <input
                          type="checkbox"
                          checked={row.active}
                          onChange={(e) =>
                            updateRow(index, { active: e.target.checked })
                          }
                        />
                      </label>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.adminLanguages__btnRemove}
                        onClick={() => removeRow(index)}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
