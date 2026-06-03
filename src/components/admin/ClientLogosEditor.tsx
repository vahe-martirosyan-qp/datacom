"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState } from "react";
import { AdminImageUrlField } from "@/components/admin/AdminImageUrlField";
import {
  CLIENT_LOGO_CROP_ASPECT,
  CLIENT_LOGO_CROP_MIME,
  CLIENT_LOGO_CROP_OUTPUT_WIDTH,
  CLIENT_LOGO_DISPLAY_MAX_H,
  CLIENT_LOGO_DISPLAY_MAX_W,
} from "@/lib/clientLogoCrop";
import {
  createEmptyClientLogo,
  ensureClientLogoIds,
  parseClientLogosForAdmin,
  serializeClientLogos,
} from "@/lib/clientLogosAdminUtils";
import type { ClientLogoItem } from "@/types/site";
import styles from "./ClientLogosEditor.module.scss";

interface ClientLogosEditorProps {
  value: string;
  onChange: (json: string) => void;
}

interface SortableLogoRowProps {
  item: ClientLogoItem;
  onImageUrlChange: (imageUrl: string) => void;
  onAltChange: (alt: string | undefined) => void;
  onRemove: () => void;
}

function SortableLogoRow({
  item,
  onImageUrlChange,
  onAltChange,
  onRemove,
}: SortableLogoRowProps) {
  const sortId = item.id ?? item.imageUrl;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`${styles.clientLogosEditor__row}${isDragging ? ` ${styles["clientLogosEditor__row--dragging"]}` : ""}`}
    >
      <button
        type="button"
        className={styles.clientLogosEditor__dragHandle}
        aria-label="Перетащить для изменения порядка"
        {...attributes}
        {...listeners}
      >
        ⋮⋮
      </button>
      <div className={styles.clientLogosEditor__body}>
        <AdminImageUrlField
          label="Логотип (URL или загрузка)"
          value={item.imageUrl}
          onChange={onImageUrlChange}
          crop={{
            aspect: CLIENT_LOGO_CROP_ASPECT,
            outputMaxWidth: CLIENT_LOGO_CROP_OUTPUT_WIDTH,
            outputMime: CLIENT_LOGO_CROP_MIME,
            modalTitle: "Обрезка логотипа",
            modalHint: `Рамка ${CLIENT_LOGO_DISPLAY_MAX_W}×${CLIENT_LOGO_DISPLAY_MAX_H} px — как на сайте. PNG сохраняет прозрачность.`,
          }}
        />
        <div className={styles.clientLogosEditor__field}>
          <span className={styles.clientLogosEditor__label}>
            Подпись (alt, необяз.)
          </span>
          <input
            className={styles.clientLogosEditor__input}
            value={item.alt ?? ""}
            onChange={(e) => onAltChange(e.target.value || undefined)}
          />
        </div>
        <button
          type="button"
          className={styles.clientLogosEditor__remove}
          onClick={onRemove}
        >
          Удалить логотип
        </button>
      </div>
    </li>
  );
}

export function ClientLogosEditor({ value, onChange }: ClientLogosEditorProps) {
  const [items, setItems] = useState<ClientLogoItem[]>(() =>
    parseClientLogosForAdmin(value)
  );

  useEffect(() => {
    setItems(parseClientLogosForAdmin(value));
  }, [value]);

  const sync = (next: ClientLogoItem[]) => {
    const withIds = ensureClientLogoIds(next);
    setItems(withIds);
    onChange(serializeClientLogos(withIds));
  };

  const sortableIds = useMemo(
    () => items.map((item) => item.id ?? item.imageUrl),
    [items]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = sortableIds.indexOf(String(active.id));
    const newIndex = sortableIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) {
      return;
    }
    sync(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div className={styles.clientLogosEditor}>
      <h3 className={styles.clientLogosEditor__heading}>Логотипы клиентов</h3>
      <p className={styles.clientLogosEditor__hint}>
        Блок «Нам доверяют сотни отелей» на главной и на странице компании.
        Перетащите за ручку слева, чтобы изменить порядок. При загрузке откроется
        обрезка под сетку {CLIENT_LOGO_DISPLAY_MAX_W}×{CLIENT_LOGO_DISPLAY_MAX_H} px
        (PNG с прозрачным фоном). Логотипы одинаковы на всех языках сайта.
        После загрузки нажмите «Сохранить» внизу формы.
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortableIds}
          strategy={verticalListSortingStrategy}
        >
          <ul className={styles.clientLogosEditor__list}>
            {items.map((item) => {
              const rowId = item.id ?? item.imageUrl;
              return (
                <SortableLogoRow
                  key={rowId}
                  item={item}
                  onImageUrlChange={(imageUrl) => {
                    setItems((prev) => {
                      const next = prev.map((row) =>
                        row.id === item.id ? { ...row, imageUrl } : row
                      );
                      const withIds = ensureClientLogoIds(next);
                      onChange(serializeClientLogos(withIds));
                      return withIds;
                    });
                  }}
                  onAltChange={(alt) => {
                    setItems((prev) => {
                      const next = prev.map((row) =>
                        row.id === item.id ? { ...row, alt } : row
                      );
                      const withIds = ensureClientLogoIds(next);
                      onChange(serializeClientLogos(withIds));
                      return withIds;
                    });
                  }}
                  onRemove={() => {
                    setItems((prev) => {
                      const next = prev.filter((row) => row.id !== item.id);
                      const withIds = ensureClientLogoIds(next);
                      onChange(serializeClientLogos(withIds));
                      return withIds;
                    });
                  }}
                />
              );
            })}
          </ul>
        </SortableContext>
      </DndContext>
      <button
        type="button"
        className={styles.clientLogosEditor__add}
        onClick={() => sync([...items, createEmptyClientLogo()])}
      >
        + Добавить логотип
      </button>
    </div>
  );
}

/** @deprecated Use `ClientLogosEditor` — kept for `brandList` field kind. */
export function BrandListEditor(props: ClientLogosEditorProps) {
  return <ClientLogosEditor {...props} />;
}
