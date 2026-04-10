"use client";

import { useEffect, useState } from "react";
import { parseJsonArray } from "@/lib/contentUtils";
import type {
  BlogTeaserPost,
  FeatureCard,
  FooterColumn,
  NavItem,
  NavMegaItem,
  NavMegaMenuDocument,
  ProjectCardItem,
  SpotlightCard,
  StepItem,
} from "@/types/site";
import { AdminImageUrlField } from "./AdminImageUrlField";
import styles from "./StructuredFieldEditors.module.scss";

function safeParseNavItems(raw: string): NavItem[] {
  return parseJsonArray<NavItem>(raw, []);
}

function safeParseFeatureCards(raw: string): FeatureCard[] {
  return parseJsonArray<FeatureCard>(raw, []);
}

function safeParseProjectCards(raw: string): ProjectCardItem[] {
  return parseJsonArray<ProjectCardItem>(raw, []);
}

function safeParseSpotlight(raw: string): SpotlightCard[] {
  return parseJsonArray<SpotlightCard>(raw, []);
}

function safeParseBlogPosts(raw: string): BlogTeaserPost[] {
  return parseJsonArray<BlogTeaserPost>(raw, []);
}

function safeParseSteps(raw: string): StepItem[] {
  return parseJsonArray<StepItem>(raw, []);
}

function safeParseBrands(raw: string): string[] {
  return parseJsonArray<string>(raw, []);
}

function safeParseFooterColumns(raw: string): FooterColumn[] {
  return parseJsonArray<FooterColumn>(raw, []);
}

interface NavItemsEditorProps {
  value: string;
  onChange: (json: string) => void;
}

export function NavItemsEditor({ value, onChange }: NavItemsEditorProps) {
  const [items, setItems] = useState<NavItem[]>(() => safeParseNavItems(value));

  useEffect(() => {
    setItems(safeParseNavItems(value));
  }, [value]);

  const sync = (next: NavItem[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>Пункты меню</h3>
      <p className={styles.structuredField__hint}>
        Ссылки на страницы: <code>contacts</code>, <code>equipment/locks</code>{" "}
        (будут с префиксом языка). Якорь на главной: <code>#contacts</code>.
      </p>
      {items.map((item, index) => (
        <div key={index} className={styles.structuredField__row}>
          <div className={styles.structuredField__rowGrid}>
            <div className={styles.structuredField__field}>
              <span className={styles.structuredField__label}>Название</span>
              <input
                className={styles.structuredField__input}
                value={item.label}
                onChange={(e) => {
                  const next = [...items];
                  const row = next[index];
                  if (row) {
                    next[index] = { ...row, label: e.target.value };
                    sync(next);
                  }
                }}
              />
            </div>
            <div className={styles.structuredField__field}>
              <span className={styles.structuredField__label}>Ссылка</span>
              <input
                className={styles.structuredField__input}
                value={item.href}
                onChange={(e) => {
                  const next = [...items];
                  const row = next[index];
                  if (row) {
                    next[index] = { ...row, href: e.target.value };
                    sync(next);
                  }
                }}
              />
            </div>
          </div>
          <button
            type="button"
            className={styles.structuredField__remove}
            onClick={() => {
              sync(items.filter((_, i) => i !== index));
            }}
          >
            Удалить пункт
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.structuredField__add}
        onClick={() => sync([...items, { label: "", href: "#" }])}
      >
        + Добавить пункт
      </button>
    </div>
  );
}

interface FeatureCardsEditorProps {
  value: string;
  onChange: (json: string) => void;
}

export function FeatureCardsEditor({ value, onChange }: FeatureCardsEditorProps) {
  const [items, setItems] = useState<FeatureCard[]>(() =>
    safeParseFeatureCards(value)
  );

  useEffect(() => {
    setItems(safeParseFeatureCards(value));
  }, [value]);

  const sync = (next: FeatureCard[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>Карточки услуг</h3>
      {items.map((item, index) => (
        <div key={index} className={styles.structuredField__row}>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Заголовок</span>
            <input
              className={styles.structuredField__input}
              value={item.title}
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, title: e.target.value };
                  sync(next);
                }
              }}
            />
          </div>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Описание</span>
            <textarea
              className={`${styles.structuredField__input} ${styles.structuredField__textarea}`}
              value={item.desc}
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, desc: e.target.value };
                  sync(next);
                }
              }}
              rows={3}
            />
          </div>
          <button
            type="button"
            className={styles.structuredField__remove}
            onClick={() => sync(items.filter((_, i) => i !== index))}
          >
            Удалить карточку
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.structuredField__add}
        onClick={() => sync([...items, { title: "", desc: "" }])}
      >
        + Добавить карточку
      </button>
    </div>
  );
}

interface ProjectCardsEditorProps {
  value: string;
  onChange: (json: string) => void;
}

export function ProjectCardsEditor({ value, onChange }: ProjectCardsEditorProps) {
  const [items, setItems] = useState<ProjectCardItem[]>(() =>
    safeParseProjectCards(value)
  );

  useEffect(() => {
    setItems(safeParseProjectCards(value));
  }, [value]);

  const sync = (next: ProjectCardItem[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>Карточки проектов</h3>
      {items.map((item, index) => (
        <div key={index} className={styles.structuredField__row}>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Название</span>
            <input
              className={styles.structuredField__input}
              value={item.title}
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, title: e.target.value };
                  sync(next);
                }
              }}
            />
          </div>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Локация</span>
            <input
              className={styles.structuredField__input}
              value={item.location}
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, location: e.target.value };
                  sync(next);
                }
              }}
            />
          </div>
          <div className={styles.structuredField__field}>
            <AdminImageUrlField
              compact
              label="Изображение (URL или загрузка)"
              value={item.imageUrl}
              onChange={(nextUrl) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, imageUrl: nextUrl };
                  sync(next);
                }
              }}
            />
          </div>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>
              Ссылка (необязательно)
            </span>
            <input
              className={styles.structuredField__input}
              value={item.href ?? ""}
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, href: e.target.value || undefined };
                  sync(next);
                }
              }}
            />
          </div>
          <button
            type="button"
            className={styles.structuredField__remove}
            onClick={() => sync(items.filter((_, i) => i !== index))}
          >
            Удалить карточку
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.structuredField__add}
        onClick={() =>
          sync([
            ...items,
            { title: "", location: "", imageUrl: "", href: undefined },
          ])
        }
      >
        + Добавить карточку
      </button>
    </div>
  );
}

interface SpotlightCardsEditorProps {
  value: string;
  onChange: (json: string) => void;
}

export function SpotlightCardsEditor({
  value,
  onChange,
}: SpotlightCardsEditorProps) {
  const [items, setItems] = useState<SpotlightCard[]>(() =>
    safeParseSpotlight(value)
  );

  useEffect(() => {
    setItems(safeParseSpotlight(value));
  }, [value]);

  const sync = (next: SpotlightCard[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>Крупные ссылки</h3>
      <p className={styles.structuredField__hint}>
        Обычно 2 карточки. Ссылка — путь без языка, например{" "}
        <code>equipment/headends</code>.
      </p>
      {items.map((item, index) => (
        <div key={index} className={styles.structuredField__row}>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Заголовок</span>
            <input
              className={styles.structuredField__input}
              value={item.title}
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, title: e.target.value };
                  sync(next);
                }
              }}
            />
          </div>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Описание</span>
            <textarea
              className={`${styles.structuredField__input} ${styles.structuredField__textarea}`}
              value={item.desc}
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, desc: e.target.value };
                  sync(next);
                }
              }}
              rows={2}
            />
          </div>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Ссылка</span>
            <input
              className={styles.structuredField__input}
              value={item.href}
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, href: e.target.value };
                  sync(next);
                }
              }}
            />
          </div>
          <button
            type="button"
            className={styles.structuredField__remove}
            onClick={() => sync(items.filter((_, i) => i !== index))}
          >
            Удалить
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.structuredField__add}
        onClick={() =>
          sync([...items, { title: "", desc: "", href: "" }])
        }
      >
        + Добавить карточку
      </button>
    </div>
  );
}

interface BlogPostsEditorProps {
  value: string;
  onChange: (json: string) => void;
}

export function BlogPostsEditor({ value, onChange }: BlogPostsEditorProps) {
  const [items, setItems] = useState<BlogTeaserPost[]>(() =>
    safeParseBlogPosts(value)
  );

  useEffect(() => {
    setItems(safeParseBlogPosts(value));
  }, [value]);

  const sync = (next: BlogTeaserPost[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>Карточки статей</h3>
      {items.map((item, index) => (
        <div key={index} className={styles.structuredField__row}>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Заголовок</span>
            <input
              className={styles.structuredField__input}
              value={item.title}
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, title: e.target.value };
                  sync(next);
                }
              }}
            />
          </div>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Ссылка</span>
            <input
              className={styles.structuredField__input}
              value={item.href}
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, href: e.target.value };
                  sync(next);
                }
              }}
            />
          </div>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>
              Подпись (дата / рубрика)
            </span>
            <input
              className={styles.structuredField__input}
              value={item.meta ?? ""}
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, meta: e.target.value };
                  sync(next);
                }
              }}
            />
          </div>
          <button
            type="button"
            className={styles.structuredField__remove}
            onClick={() => sync(items.filter((_, i) => i !== index))}
          >
            Удалить
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.structuredField__add}
        onClick={() => sync([...items, { title: "", href: "", meta: "" }])}
      >
        + Добавить статью
      </button>
    </div>
  );
}

interface StepItemsEditorProps {
  value: string;
  onChange: (json: string) => void;
}

export function StepItemsEditor({ value, onChange }: StepItemsEditorProps) {
  const [items, setItems] = useState<StepItem[]>(() => safeParseSteps(value));

  useEffect(() => {
    setItems(safeParseSteps(value));
  }, [value]);

  const sync = (next: StepItem[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>Шаги</h3>
      {items.map((item, index) => (
        <div key={index} className={styles.structuredField__row}>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Заголовок шага</span>
            <input
              className={styles.structuredField__input}
              value={item.title}
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, title: e.target.value };
                  sync(next);
                }
              }}
            />
          </div>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Описание</span>
            <textarea
              className={`${styles.structuredField__input} ${styles.structuredField__textarea}`}
              value={item.desc}
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, desc: e.target.value };
                  sync(next);
                }
              }}
              rows={3}
            />
          </div>
          <button
            type="button"
            className={styles.structuredField__remove}
            onClick={() => sync(items.filter((_, i) => i !== index))}
          >
            Удалить шаг
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.structuredField__add}
        onClick={() => sync([...items, { title: "", desc: "" }])}
      >
        + Добавить шаг
      </button>
    </div>
  );
}

interface BrandListEditorProps {
  value: string;
  onChange: (json: string) => void;
}

export function BrandListEditor({ value, onChange }: BrandListEditorProps) {
  const [items, setItems] = useState<string[]>(() => safeParseBrands(value));

  useEffect(() => {
    setItems(safeParseBrands(value));
  }, [value]);

  const sync = (next: string[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>Названия брендов</h3>
      <p className={styles.structuredField__hint}>
        Каждая строка — отдельный бренд в блоке «Клиенты».
      </p>
      {items.map((name, index) => (
        <div key={index} className={styles.structuredField__row}>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Бренд</span>
            <input
              className={styles.structuredField__input}
              value={name}
              onChange={(e) => {
                const next = [...items];
                next[index] = e.target.value;
                sync(next);
              }}
            />
          </div>
          <button
            type="button"
            className={styles.structuredField__remove}
            onClick={() => sync(items.filter((_, i) => i !== index))}
          >
            Удалить
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.structuredField__add}
        onClick={() => sync([...items, ""])}
      >
        + Добавить бренд
      </button>
    </div>
  );
}

interface FooterColumnsEditorProps {
  value: string;
  onChange: (json: string) => void;
}

export function FooterColumnsEditor({
  value,
  onChange,
}: FooterColumnsEditorProps) {
  const [columns, setColumns] = useState<FooterColumn[]>(() =>
    safeParseFooterColumns(value)
  );

  useEffect(() => {
    setColumns(safeParseFooterColumns(value));
  }, [value]);

  const sync = (next: FooterColumn[]) => {
    setColumns(next);
    onChange(JSON.stringify(next));
  };

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>Колонки ссылок в подвале</h3>
      {columns.map((col, colIndex) => (
        <div key={colIndex} className={styles.structuredField__columnCard}>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Заголовок колонки</span>
            <input
              className={styles.structuredField__input}
              value={col.title}
              onChange={(e) => {
                const next = [...columns];
                const c = next[colIndex];
                if (c) {
                  next[colIndex] = { ...c, title: e.target.value };
                  sync(next);
                }
              }}
            />
          </div>
          <div className={styles.structuredField__subBlock}>
            <p className={styles.structuredField__subTitle}>Ссылки в колонке</p>
            {col.links.map((link, linkIndex) => (
              <div key={linkIndex} className={styles.structuredField__row}>
                <div className={styles.structuredField__rowGrid}>
                  <div className={styles.structuredField__field}>
                    <span className={styles.structuredField__label}>Текст</span>
                    <input
                      className={styles.structuredField__input}
                      value={link.label}
                      onChange={(e) => {
                        const next = [...columns];
                        const c = next[colIndex];
                        if (!c) {
                          return;
                        }
                        const links = [...c.links];
                        const lk = links[linkIndex];
                        if (lk) {
                          links[linkIndex] = {
                            ...lk,
                            label: e.target.value,
                          };
                          next[colIndex] = { ...c, links };
                          sync(next);
                        }
                      }}
                    />
                  </div>
                  <div className={styles.structuredField__field}>
                    <span className={styles.structuredField__label}>Ссылка</span>
                    <input
                      className={styles.structuredField__input}
                      value={link.href}
                      onChange={(e) => {
                        const next = [...columns];
                        const c = next[colIndex];
                        if (!c) {
                          return;
                        }
                        const links = [...c.links];
                        const lk = links[linkIndex];
                        if (lk) {
                          links[linkIndex] = {
                            ...lk,
                            href: e.target.value,
                          };
                          next[colIndex] = { ...c, links };
                          sync(next);
                        }
                      }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.structuredField__remove}
                  onClick={() => {
                    const next = [...columns];
                    const c = next[colIndex];
                    if (c) {
                      next[colIndex] = {
                        ...c,
                        links: c.links.filter((_, i) => i !== linkIndex),
                      };
                      sync(next);
                    }
                  }}
                >
                  Удалить ссылку
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.structuredField__add}
              onClick={() => {
                const next = [...columns];
                const c = next[colIndex];
                if (c) {
                  next[colIndex] = {
                    ...c,
                    links: [...c.links, { label: "", href: "#" }],
                  };
                  sync(next);
                }
              }}
            >
              + Добавить ссылку
            </button>
          </div>
          <button
            type="button"
            className={styles.structuredField__remove}
            onClick={() => sync(columns.filter((_, i) => i !== colIndex))}
          >
            Удалить колонку
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.structuredField__add}
        onClick={() =>
          sync([
            ...columns,
            { title: "", links: [{ label: "", href: "#" }] },
          ])
        }
      >
        + Добавить колонку
      </button>
    </div>
  );
}

function safeParseMegaNav(raw: string): NavMegaItem[] {
  try {
    const doc = JSON.parse(raw) as unknown;
    if (
      doc &&
      typeof doc === "object" &&
      "items" in doc &&
      Array.isArray((doc as NavMegaMenuDocument).items)
    ) {
      return (doc as NavMegaMenuDocument).items;
    }
  } catch {
    /* ignore */
  }
  return [];
}

interface MegaNavEditorProps {
  value: string;
  onChange: (json: string) => void;
}

export function MegaNavEditor({ value, onChange }: MegaNavEditorProps) {
  const [items, setItems] = useState<NavMegaItem[]>(() =>
    safeParseMegaNav(value)
  );

  useEffect(() => {
    setItems(safeParseMegaNav(value));
  }, [value]);

  const sync = (next: NavMegaItem[]) => {
    setItems(next);
    onChange(JSON.stringify({ items: next }));
  };

  const updateChild = (
    itemIndex: number,
    childIndex: number,
    patch: Partial<NavItem>
  ) => {
    const next = [...items];
    const item = next[itemIndex];
    if (!item) {
      return;
    }
    const children = [...(item.children ?? [])];
    const ch = children[childIndex];
    if (!ch) {
      return;
    }
    children[childIndex] = { ...ch, ...patch };
    next[itemIndex] = { ...item, children };
    sync(next);
  };

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>Меню с подпунктами</h3>
      <p className={styles.structuredField__hint}>
        Верхний уровень — пункты строки меню. Для выпадающего блока добавьте
        подпункты. Без подпунктов ссылка ведёт сразу на раздел.
      </p>
      {items.map((item, itemIndex) => (
        <div key={itemIndex} className={styles.structuredField__columnCard}>
          <div className={styles.structuredField__rowGrid}>
            <div className={styles.structuredField__field}>
              <span className={styles.structuredField__label}>
                Название (верхний уровень)
              </span>
              <input
                className={styles.structuredField__input}
                value={item.label}
                onChange={(e) => {
                  const next = [...items];
                  const row = next[itemIndex];
                  if (row) {
                    next[itemIndex] = { ...row, label: e.target.value };
                    sync(next);
                  }
                }}
              />
            </div>
            <div className={styles.structuredField__field}>
              <span className={styles.structuredField__label}>
                Ссылка верхнего уровня
              </span>
              <input
                className={styles.structuredField__input}
                value={item.href}
                onChange={(e) => {
                  const next = [...items];
                  const row = next[itemIndex];
                  if (row) {
                    next[itemIndex] = { ...row, href: e.target.value };
                    sync(next);
                  }
                }}
              />
            </div>
          </div>
          <div className={styles.structuredField__subBlock}>
            <p className={styles.structuredField__subTitle}>
              Подпункты (выпадающий список)
            </p>
            {(item.children ?? []).map((child, childIndex) => (
              <div key={childIndex} className={styles.structuredField__row}>
                <div className={styles.structuredField__rowGrid}>
                  <div className={styles.structuredField__field}>
                    <span className={styles.structuredField__label}>
                      Название
                    </span>
                    <input
                      className={styles.structuredField__input}
                      value={child.label}
                      onChange={(e) =>
                        updateChild(itemIndex, childIndex, {
                          label: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.structuredField__field}>
                    <span className={styles.structuredField__label}>Ссылка</span>
                    <input
                      className={styles.structuredField__input}
                      value={child.href}
                      onChange={(e) =>
                        updateChild(itemIndex, childIndex, {
                          href: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.structuredField__remove}
                  onClick={() => {
                    const next = [...items];
                    const row = next[itemIndex];
                    if (row) {
                      next[itemIndex] = {
                        ...row,
                        children: (row.children ?? []).filter(
                          (_, i) => i !== childIndex
                        ),
                      };
                      sync(next);
                    }
                  }}
                >
                  Удалить подпункт
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.structuredField__add}
              onClick={() => {
                const next = [...items];
                const row = next[itemIndex];
                if (row) {
                  next[itemIndex] = {
                    ...row,
                    children: [...(row.children ?? []), { label: "", href: "#" }],
                  };
                  sync(next);
                }
              }}
            >
              + Добавить подпункт
            </button>
          </div>
          <button
            type="button"
            className={styles.structuredField__remove}
            onClick={() => sync(items.filter((_, i) => i !== itemIndex))}
          >
            Удалить пункт меню
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.structuredField__add}
        onClick={() =>
          sync([
            ...items,
            { label: "", href: "#", children: [{ label: "", href: "#" }] },
          ])
        }
      >
        + Добавить пункт верхнего уровня
      </button>
    </div>
  );
}
