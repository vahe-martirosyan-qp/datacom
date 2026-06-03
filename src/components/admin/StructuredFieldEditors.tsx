"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { uploadAdminImageFile } from "@/lib/adminUpload";
import { parseJsonArray } from "@/lib/contentUtils";
import {
  parseEquipmentProductImages,
  serializeEquipmentProductImages,
} from "@/lib/equipmentProductUtils";
import type {
  BlogTeaserPost,
  CompanyStatItem,
  EquipmentProductImage,
  ContactOfficeItem,
  EquipmentProductItem,
  EquipmentSpecItem,
  FeatureCard,
  FooterColumn,
  NavItem,
  NavMegaItem,
  NavMegaMenuDocument,
  ProjectCardItem,
  SpotlightCard,
  StepItem,
} from "@/types/site";
import {
  findEquipmentMegaItemIndex,
  parseMegaMenuItems,
  serializeMegaMenuItems,
} from "@/lib/equipmentNavUtils";
import {
  equipmentCategoryHrefFromSlug,
  equipmentCategorySlugFromNavHref,
} from "@/lib/equipmentHrefUtils";
import { resolveEquipmentProductSlug } from "@/lib/equipmentProductHrefUtils";
import { AdminImageUrlField } from "./AdminImageUrlField";
import styles from "./StructuredFieldEditors.module.scss";

function safeParseCompanyStats(raw: string): CompanyStatItem[] {
  return parseJsonArray<CompanyStatItem>(raw, []);
}

function safeParseContactOffices(raw: string): ContactOfficeItem[] {
  return parseJsonArray<ContactOfficeItem>(raw, []);
}

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

interface CompanyStatsEditorProps {
  value: string;
  onChange: (json: string) => void;
}

export function CompanyStatsEditor({
  value,
  onChange,
}: CompanyStatsEditorProps) {
  const [items, setItems] = useState<CompanyStatItem[]>(() =>
    safeParseCompanyStats(value)
  );

  useEffect(() => {
    setItems(safeParseCompanyStats(value));
  }, [value]);

  const sync = (next: CompanyStatItem[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>Цифры на странице «Компания»</h3>
      <p className={styles.structuredField__hint}>
        Обычно 4 карточки: значение (1000+, 15 лет…) и подпись.
      </p>
      {items.map((item, index) => (
        <div key={index} className={styles.structuredField__row}>
          <div className={styles.structuredField__rowGrid}>
            <div className={styles.structuredField__field}>
              <span className={styles.structuredField__label}>Значение</span>
              <input
                className={styles.structuredField__input}
                value={item.value}
                onChange={(e) => {
                  const next = [...items];
                  const row = next[index];
                  if (row) {
                    next[index] = { ...row, value: e.target.value };
                    sync(next);
                  }
                }}
              />
            </div>
            <div className={styles.structuredField__field}>
              <span className={styles.structuredField__label}>Подпись</span>
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
          </div>
          <button
            type="button"
            className={styles.structuredField__remove}
            onClick={() => {
              sync(items.filter((_, i) => i !== index));
            }}
          >
            Удалить
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.structuredField__add}
        onClick={() => sync([...items, { value: "", label: "" }])}
      >
        + Добавить карточку
      </button>
    </div>
  );
}

interface EquipmentProductImagesEditorProps {
  value: string;
  onChange: (json: string) => void;
  /** Saves slider to CMS after each successful upload (optional). */
  onPersist?: (json: string) => void;
}

export function EquipmentProductImagesEditor({
  value,
  onChange,
  onPersist,
}: EquipmentProductImagesEditorProps) {
  const multiFileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<EquipmentProductImage[]>(() =>
    parseEquipmentProductImages(value)
  );
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);

  useEffect(() => {
    setItems(parseEquipmentProductImages(value));
  }, [value]);

  const sync = (next: EquipmentProductImage[], persist = false) => {
    setItems(next);
    const json = serializeEquipmentProductImages(next);
    onChange(json);
    if (persist && onPersist && json !== "[]") {
      onPersist(json);
    }
  };

  const rows =
    items.length > 0
      ? items
      : [{ imageUrl: "", alt: undefined as string | undefined }];

  const onBulkPick = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files ?? [])];
    e.target.value = "";
    if (files.length === 0) {
      return;
    }
    setBulkError(null);
    setBulkBusy(true);
    try {
      const next = [...items];
      for (const file of files) {
        const url = await uploadAdminImageFile(file);
        next.push({ imageUrl: url, alt: undefined });
      }
      sync(next, true);
    } catch (unknown) {
      setBulkError(
        unknown instanceof Error ? unknown.message : "Ошибка загрузки"
      );
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>
        Слайдер этого товара ({items.length} фото)
      </h3>
      <p className={styles.structuredField__hint}>
        Все фото слайдера на странице товара (стрелки, миниатюры, zoom). Порядок = порядок
        на сайте. Одинаково для всех языков.
      </p>
      <div className={styles.structuredField__bulkUpload}>
        <input
          ref={multiFileRef}
          type="file"
          accept="image/*"
          multiple
          className={styles.structuredField__fileInput}
          onChange={onBulkPick}
        />
        <button
          type="button"
          className={styles.structuredField__bulkBtn}
          disabled={bulkBusy}
          onClick={() => multiFileRef.current?.click()}
        >
          {bulkBusy ? "Загрузка…" : "Загрузить несколько фото сразу"}
        </button>
      </div>
      {bulkError ? (
        <p className={styles.structuredField__error} role="alert">
          {bulkError}
        </p>
      ) : null}
      {rows.map((item, index) => (
        <div key={index} className={styles.structuredField__row}>
          <p className={styles.structuredField__slideLabel}>
            Слайд {index + 1}
          </p>
          <AdminImageUrlField
            compact
            label="Изображение"
            value={item.imageUrl}
            onChange={(imageUrl) => {
              const base =
                items.length > 0
                  ? items
                  : [{ imageUrl: "", alt: undefined as string | undefined }];
              const next = [...base];
              const row = next[index];
              if (row) {
                next[index] = { ...row, imageUrl };
              }
              sync(next, Boolean(imageUrl.trim()));
            }}
          />
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Alt (необяз.)</span>
            <input
              className={styles.structuredField__input}
              value={item.alt ?? ""}
              onChange={(e) => {
                const next = [...rows];
                next[index] = {
                  ...item,
                  alt: e.target.value || undefined,
                };
                sync(next);
              }}
            />
          </div>
          <button
            type="button"
            className={styles.structuredField__remove}
            onClick={() => {
              const next = rows.filter((_, i) => i !== index);
              sync(next.length > 0 ? next : [{ imageUrl: "", alt: undefined }]);
            }}
            disabled={rows.length <= 1 && !item.imageUrl.trim()}
          >
            Удалить слайд
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.structuredField__add}
        onClick={() => sync([...rows, { imageUrl: "", alt: undefined }])}
      >
        + Ещё один слайд
      </button>
    </div>
  );
}

interface ContactOfficesEditorProps {
  value: string;
  onChange: (json: string) => void;
}

export function ContactOfficesEditor({
  value,
  onChange,
}: ContactOfficesEditorProps) {
  const [items, setItems] = useState<ContactOfficeItem[]>(() =>
    safeParseContactOffices(value)
  );

  useEffect(() => {
    setItems(safeParseContactOffices(value));
  }, [value]);

  const sync = (next: ContactOfficeItem[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  const update = (index: number, patch: Partial<ContactOfficeItem>) => {
    const next = [...items];
    const row = next[index];
    if (row) {
      next[index] = { ...row, ...patch };
      sync(next);
    }
  };

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>Офисы и контакты</h3>
      <p className={styles.structuredField__hint}>
        Карточки как на smarteq.ru/contacts: телефон, email, адрес, часы, ссылка на карту.
      </p>
      {items.map((item, index) => (
        <div key={index} className={styles.structuredField__columnCard}>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Название</span>
            <input
              className={styles.structuredField__input}
              value={item.title}
              onChange={(e) => update(index, { title: e.target.value })}
            />
          </div>
          <div className={styles.structuredField__rowGrid}>
            <div className={styles.structuredField__field}>
              <span className={styles.structuredField__label}>Телефон</span>
              <input
                className={styles.structuredField__input}
                value={item.phone ?? ""}
                onChange={(e) => update(index, { phone: e.target.value })}
              />
            </div>
            <div className={styles.structuredField__field}>
              <span className={styles.structuredField__label}>Email</span>
              <input
                className={styles.structuredField__input}
                value={item.email ?? ""}
                onChange={(e) => update(index, { email: e.target.value })}
              />
            </div>
          </div>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Адрес</span>
            <textarea
              className={`${styles.structuredField__input} ${styles.structuredField__textarea}`}
              value={item.address ?? ""}
              onChange={(e) => update(index, { address: e.target.value })}
              rows={2}
            />
          </div>
          <div className={styles.structuredField__rowGrid}>
            <div className={styles.structuredField__field}>
              <span className={styles.structuredField__label}>Часы работы</span>
              <input
                className={styles.structuredField__input}
                value={item.hours ?? ""}
                onChange={(e) => update(index, { hours: e.target.value })}
              />
            </div>
            <div className={styles.structuredField__field}>
              <span className={styles.structuredField__label}>Текст ссылки на карту</span>
              <input
                className={styles.structuredField__input}
                value={item.mapLabel ?? ""}
                onChange={(e) => update(index, { mapLabel: e.target.value })}
              />
            </div>
          </div>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>URL карты</span>
            <input
              className={styles.structuredField__input}
              value={item.mapHref ?? ""}
              onChange={(e) => update(index, { mapHref: e.target.value })}
              placeholder="https://maps.google.com/…"
            />
          </div>
          <button
            type="button"
            className={styles.structuredField__remove}
            onClick={() => sync(items.filter((_, i) => i !== index))}
          >
            Удалить офис
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.structuredField__add}
        onClick={() =>
          sync([
            ...items,
            {
              title: "",
              phone: "",
              email: "",
              address: "",
              hours: "",
              mapLabel: "",
              mapHref: "",
            },
          ])
        }
      >
        + Добавить офис
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
          <AdminImageUrlField
            compact
            label="Обложка (URL или загрузка)"
            value={item.imageUrl ?? ""}
            onChange={(nextUrl) => {
              const next = [...items];
              const row = next[index];
              if (row) {
                next[index] = { ...row, imageUrl: nextUrl };
                sync(next);
              }
            }}
          />
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
          sync([...items, { title: "", href: "", meta: "", imageUrl: "" }])
        }
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

export { BrandListEditor, ClientLogosEditor } from "./ClientLogosEditor";

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

interface EquipmentCategoriesEditorProps {
  value: string;
  onChange: (json: string) => void;
}

/** Edits children under «Оборудование и системы» in `home.nav.megaMenu`. */
export function EquipmentCategoriesEditor({
  value,
  onChange,
}: EquipmentCategoriesEditorProps) {
  const [items, setItems] = useState<NavMegaItem[]>(() =>
    parseMegaMenuItems(value)
  );

  useEffect(() => {
    setItems(parseMegaMenuItems(value));
  }, [value]);

  const equipmentIndex = findEquipmentMegaItemIndex(items);
  const equipmentItem = equipmentIndex >= 0 ? items[equipmentIndex] : undefined;
  const children = equipmentItem?.children ?? [];

  const syncChildren = (nextChildren: NavItem[]) => {
    if (equipmentIndex < 0) {
      return;
    }
    const next = [...items];
    const row = next[equipmentIndex];
    if (!row) {
      return;
    }
    next[equipmentIndex] = { ...row, children: nextChildren };
    setItems(next);
    onChange(serializeMegaMenuItems(next));
  };

  if (equipmentIndex < 0) {
    return (
      <p className={styles.structuredField__hint}>
        В меню нет раздела «Оборудование» (<code>equipment</code>). Добавьте его в{" "}
        «Главная → Меню» или восстановите seed-контент.
      </p>
    );
  }

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>
        Категории (как в шапке сайта)
      </h3>
      <p className={styles.structuredField__hint}>
        Эти пункты совпадают с подменю «Оборудование и системы» в шапке. Название
        и ссылка — для меню и страницы /equipment; описание и изображение — для
        карточек на /equipment.
      </p>
      {children.map((child, childIndex) => (
        <div key={childIndex} className={styles.structuredField__columnCard}>
          <div className={styles.structuredField__rowGrid}>
            <div className={styles.structuredField__field}>
              <span className={styles.structuredField__label}>Название</span>
              <input
                className={styles.structuredField__input}
                value={child.label}
                onChange={(e) => {
                  const next = [...children];
                  const row = next[childIndex];
                  if (row) {
                    next[childIndex] = { ...row, label: e.target.value };
                    syncChildren(next);
                  }
                }}
              />
            </div>
            <div className={styles.structuredField__field}>
              <span className={styles.structuredField__label}>Ссылка</span>
              <input
                className={styles.structuredField__input}
                value={child.href}
                onChange={(e) => {
                  const next = [...children];
                  const row = next[childIndex];
                  if (row) {
                    next[childIndex] = { ...row, href: e.target.value };
                    syncChildren(next);
                  }
                }}
              />
            </div>
          </div>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>
              Описание на странице /equipment
            </span>
            <textarea
              className={styles.structuredField__input}
              rows={3}
              value={child.desc ?? ""}
              onChange={(e) => {
                const next = [...children];
                const row = next[childIndex];
                if (row) {
                  next[childIndex] = { ...row, desc: e.target.value };
                  syncChildren(next);
                }
              }}
            />
          </div>
          <AdminImageUrlField
            compact
            label="Изображение категории"
            value={child.imageUrl ?? ""}
            onChange={(nextUrl) => {
              const next = [...children];
              const row = next[childIndex];
              if (row) {
                next[childIndex] = { ...row, imageUrl: nextUrl };
                syncChildren(next);
              }
            }}
          />
          <button
            type="button"
            className={styles.structuredField__remove}
            onClick={() =>
              syncChildren(children.filter((_, i) => i !== childIndex))
            }
          >
            Удалить категорию
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.structuredField__add}
        onClick={() =>
          syncChildren([
            ...children,
            {
              label: "",
              href: "equipment/new-category",
              desc: "",
              imageUrl: "",
            },
          ])
        }
      >
        + Добавить категорию
      </button>
    </div>
  );
}

interface EquipmentSingleCategoryEditorProps {
  categorySlug: string;
  value: string;
  onChange: (json: string) => void;
}

/** Edits one equipment category row in `home.nav.megaMenu` (card + nav). */
export function EquipmentSingleCategoryEditor({
  categorySlug,
  value,
  onChange,
}: EquipmentSingleCategoryEditorProps) {
  const [items, setItems] = useState<NavMegaItem[]>(() =>
    parseMegaMenuItems(value)
  );

  useEffect(() => {
    setItems(parseMegaMenuItems(value));
  }, [value]);

  const equipmentIndex = findEquipmentMegaItemIndex(items);
  const equipmentItem = equipmentIndex >= 0 ? items[equipmentIndex] : undefined;
  const children = equipmentItem?.children ?? [];
  const childIndex = children.findIndex(
    (c) => equipmentCategorySlugFromNavHref(c.href) === categorySlug
  );
  const child = childIndex >= 0 ? children[childIndex] : undefined;

  const syncChild = (nextChild: NavItem) => {
    if (equipmentIndex < 0 || childIndex < 0) {
      return;
    }
    const next = [...items];
    const row = next[equipmentIndex];
    if (!row) {
      return;
    }
    const nextChildren = [...(row.children ?? [])];
    nextChildren[childIndex] = nextChild;
    next[equipmentIndex] = { ...row, children: nextChildren };
    setItems(next);
    onChange(serializeMegaMenuItems(next));
  };

  if (equipmentIndex < 0 || !child) {
    return (
      <p className={styles.structuredField__hint}>
        Пункт «{categorySlug}» не найден в меню. Вернитесь к списку категорий или
        создайте категорию заново.
      </p>
    );
  }

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>
        Карточка и пункт меню
      </h3>
      <p className={styles.structuredField__hint}>
        Название и ссылка — в шапке и на /equipment; короткое описание и
        превью — только на странице списка. Полный текст категории — в блоке
        «Текст страницы категории».
      </p>
      <div className={styles.structuredField__field}>
        <span className={styles.structuredField__label}>Название в меню</span>
        <input
          className={styles.structuredField__input}
          value={child.label}
          onChange={(e) => syncChild({ ...child, label: e.target.value })}
        />
      </div>
      <div className={styles.structuredField__field}>
        <span className={styles.structuredField__label}>Адрес в меню и на сайте</span>
        <input
          className={styles.structuredField__input}
          value={child.href}
          onChange={(e) => syncChild({ ...child, href: e.target.value })}
          placeholder={equipmentCategoryHrefFromSlug(categorySlug)}
        />
        <span className={styles.structuredField__fieldHint}>
          Обычно не меняют — подставляется автоматически при создании категории.
        </span>
      </div>
      <div className={styles.structuredField__field}>
        <span className={styles.structuredField__label}>
          Краткое описание на /equipment
        </span>
        <textarea
          className={styles.structuredField__input}
          rows={3}
          value={child.desc ?? ""}
          onChange={(e) => syncChild({ ...child, desc: e.target.value })}
        />
      </div>
      <AdminImageUrlField
        compact
        label="Превью на /equipment"
        value={child.imageUrl ?? ""}
        onChange={(nextUrl) =>
          syncChild({ ...child, imageUrl: nextUrl || undefined })
        }
      />
    </div>
  );
}

function safeParseStringList(raw: string): string[] {
  return parseJsonArray<string>(raw, []);
}

interface EquipmentHighlightsEditorProps {
  value: string;
  onChange: (json: string) => void;
}

export function EquipmentHighlightsEditor({
  value,
  onChange,
}: EquipmentHighlightsEditorProps) {
  const [items, setItems] = useState<string[]>(() => safeParseStringList(value));

  useEffect(() => {
    setItems(safeParseStringList(value));
  }, [value]);

  const sync = (next: string[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>Быстрые пункты (+)</h3>
      <p className={styles.structuredField__hint}>
        Короткие преимущества под заголовком страницы — отображаются с «+».
      </p>
      {items.map((line, index) => (
        <div key={index} className={styles.structuredField__row}>
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>Пункт</span>
            <input
              className={styles.structuredField__input}
              value={line}
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
        + Добавить пункт
      </button>
    </div>
  );
}

function safeParseEquipmentProducts(raw: string): EquipmentProductItem[] {
  return parseJsonArray<EquipmentProductItem>(raw, []);
}

interface EquipmentProductsEditorProps {
  value: string;
  onChange: (json: string) => void;
  /** When set, shows admin link to full product page per card slug. */
  categorySlug?: string;
}

export function EquipmentProductsEditor({
  value,
  onChange,
  categorySlug,
}: EquipmentProductsEditorProps) {
  const [items, setItems] = useState<EquipmentProductItem[]>(() =>
    safeParseEquipmentProducts(value)
  );

  useEffect(() => {
    setItems(safeParseEquipmentProducts(value));
  }, [value]);

  const sync = (next: EquipmentProductItem[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>
        Карточки в «Решения в категории»
      </h3>
      <p className={styles.structuredField__hint}>
        Каждая строка — <strong>товар</strong> этой категории: на сайте карточка в списке,
        по клику — его страница со <strong>слайдером</strong>, текстом и характеристиками.
        Здесь только превью (название, одно фото, код страницы). Слайдер и весь контент —
        в редакторе товара (ссылка под полем кода или зелёный блок на экране категории).
      </p>
      {items.map((item, index) => (
        <div key={index} className={styles.structuredField__columnCard}>
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
            <span className={styles.structuredField__label}>Описание</span>
            <textarea
              className={styles.structuredField__input}
              rows={2}
              value={item.desc ?? ""}
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, desc: e.target.value };
                  sync(next);
                }
              }}
            />
          </div>
          <AdminImageUrlField
            compact
            label="Превью товара на карточке (1 фото, не слайдер)"
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
          <div className={styles.structuredField__field}>
            <span className={styles.structuredField__label}>
              Код страницы товара
            </span>
            <input
              className={styles.structuredField__input}
              value={item.slug ?? ""}
              placeholder="omnitec-gaudi-fit-in"
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = {
                    ...row,
                    slug: e.target.value || undefined,
                    href: e.target.value.trim()
                      ? undefined
                      : row.href,
                  };
                  sync(next);
                }
              }}
            />
            <span className={styles.structuredField__fieldHint}>
              Латиницей, без пробелов — тот же код, что в адресе полной страницы
              товара на сайте.
            </span>
            {categorySlug &&
            item.slug?.trim() &&
            resolveEquipmentProductSlug(item.slug) ? (
              <Link
                href={`/admin/equipment/${encodeURIComponent(categorySlug)}/${encodeURIComponent(resolveEquipmentProductSlug(item.slug)!)}`}
                className={styles.structuredField__adminProductLink}
              >
                Открыть страницу товара (слайдер, текст) →
              </Link>
            ) : null}
          </div>
          {!item.slug?.trim() ? (
            <div className={styles.structuredField__field}>
              <span className={styles.structuredField__label}>
                Ссылка при клике (без своей страницы)
              </span>
              <input
                className={styles.structuredField__input}
                value={item.href ?? ""}
                placeholder="https://… или contacts"
                onChange={(e) => {
                  const next = [...items];
                  const row = next[index];
                  if (row) {
                    next[index] = {
                      ...row,
                      href: e.target.value || undefined,
                    };
                    sync(next);
                  }
                }}
              />
              <span className={styles.structuredField__fieldHint}>
                Только если у товара нет отдельной страницы на сайте. Обычно заполняют
                код страницы выше — тогда это поле не нужно.
              </span>
            </div>
          ) : null}
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
            { title: "", desc: "", imageUrl: "", slug: undefined, href: undefined },
          ])
        }
      >
        + Добавить карточку
      </button>
    </div>
  );
}

function safeParseEquipmentSpecs(raw: string): EquipmentSpecItem[] {
  return parseJsonArray<EquipmentSpecItem>(raw, []);
}

interface EquipmentSpecsEditorProps {
  value: string;
  onChange: (json: string) => void;
}

export function EquipmentSpecsEditor({
  value,
  onChange,
}: EquipmentSpecsEditorProps) {
  const [items, setItems] = useState<EquipmentSpecItem[]>(() =>
    safeParseEquipmentSpecs(value)
  );

  useEffect(() => {
    setItems(safeParseEquipmentSpecs(value));
  }, [value]);

  const sync = (next: EquipmentSpecItem[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  return (
    <div className={styles.structuredField}>
      <h3 className={styles.structuredField__heading}>
        Технические характеристики
      </h3>
      <p className={styles.structuredField__hint}>
        Карточки в блоке «Технические характеристики» на странице категории.
        Заголовок блока — поле «Заголовок блока характеристик» в этой же форме.
      </p>
      {items.map((item, index) => (
        <div key={index} className={styles.structuredField__columnCard}>
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
            <span className={styles.structuredField__label}>Описание</span>
            <textarea
              className={styles.structuredField__input}
              rows={3}
              value={item.desc}
              onChange={(e) => {
                const next = [...items];
                const row = next[index];
                if (row) {
                  next[index] = { ...row, desc: e.target.value };
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
            Удалить характеристику
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.structuredField__add}
        onClick={() => sync([...items, { title: "", desc: "" }])}
      >
        + Добавить характеристику
      </button>
    </div>
  );
}
