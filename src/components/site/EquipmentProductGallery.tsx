"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { lockPageScroll } from "@/lib/lockPageScroll";
import type { EquipmentProductImage } from "@/types/site";
import styles from "./EquipmentProductGallery.module.scss";

interface EquipmentProductGalleryProps {
  images: EquipmentProductImage[];
  productTitle: string;
}

function GalleryNavChevron({ direction }: { direction: "prev" | "next" }) {
  const path =
    direction === "prev" ? "M8 2 4 6l4 4" : "M4 2l4 4-4 4";
  return (
    <svg
      className={styles.equipmentProductGallery__navIcon}
      viewBox="0 0 12 12"
      width="12"
      height="12"
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EquipmentProductGallery({
  images,
  productTitle,
}: EquipmentProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [mounted, setMounted] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = images.length;
  const active = images[activeIndex];

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i <= 0 ? count - 1 : i - 1));
    setZoom(1);
  }, [count]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i >= count - 1 ? 0 : i + 1));
    setZoom(1);
  }, [count]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoom(1);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }
    const unlockScroll = lockPageScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
      if (e.key === "ArrowLeft") {
        goPrev();
      }
      if (e.key === "ArrowRight") {
        goNext();
      }
    };
    const onWheel = (e: WheelEvent) => {
      const root = lightboxRef.current;
      if (root && e.target instanceof Node && root.contains(e.target)) {
        return;
      }
      e.preventDefault();
    };
    const onTouchMove = (e: TouchEvent) => {
      const root = lightboxRef.current;
      if (root && e.target instanceof Node && root.contains(e.target)) {
        return;
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, [lightboxOpen, closeLightbox, goPrev, goNext]);

  if (count === 0 || !active) {
    return null;
  }

  const alt = active.alt || productTitle;

  const lightboxPanel =
    lightboxOpen ? (
      <div
        ref={lightboxRef}
        className={styles.equipmentProductGallery__lightbox}
        role="dialog"
        aria-modal="true"
        aria-label="Увеличенное фото"
        onClick={closeLightbox}
      >
        <div
          className={styles.equipmentProductGallery__lightboxInner}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.equipmentProductGallery__lightboxToolbar}>
            <button
              type="button"
              className={styles.equipmentProductGallery__zoomBtn}
              aria-label="Уменьшить"
              onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
            >
              −
            </button>
            <span className={styles.equipmentProductGallery__zoomLabel}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              className={styles.equipmentProductGallery__zoomBtn}
              aria-label="Увеличить"
              onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            >
              +
            </button>
            <button
              type="button"
              className={styles.equipmentProductGallery__close}
              aria-label="Закрыть"
              onClick={closeLightbox}
            >
              ×
            </button>
          </div>
          <div className={styles.equipmentProductGallery__lightboxStage}>
            <div className={styles.equipmentProductGallery__lightboxViewport}>
              {/* eslint-disable-next-line @next/next/no-img-element -- zoom transform */}
              <img
                className={styles.equipmentProductGallery__lightboxImg}
                src={active.imageUrl}
                alt={alt}
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
            {count > 1 ? (
              <>
                <button
                  type="button"
                  className={`${styles.equipmentProductGallery__lightboxNav} ${styles["equipmentProductGallery__lightboxNav--prev"]}`}
                  aria-label="Предыдущее"
                  onClick={goPrev}
                >
                  <GalleryNavChevron direction="prev" />
                </button>
                <button
                  type="button"
                  className={`${styles.equipmentProductGallery__lightboxNav} ${styles["equipmentProductGallery__lightboxNav--next"]}`}
                  aria-label="Следующее"
                  onClick={goNext}
                >
                  <GalleryNavChevron direction="next" />
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    ) : null;

  return (
    <div className={styles.equipmentProductGallery}>
      <div className={styles.equipmentProductGallery__stage}>
        <button
          type="button"
          className={styles.equipmentProductGallery__mainBtn}
          aria-label="Увеличить фото"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            className={styles.equipmentProductGallery__mainImg}
            src={active.imageUrl}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            priority
          />
        </button>
        <button
          type="button"
          className={`${styles.equipmentProductGallery__nav} ${styles["equipmentProductGallery__nav--prev"]}`}
          aria-label="Предыдущее фото"
          onClick={goPrev}
          disabled={count < 2}
        >
          <GalleryNavChevron direction="prev" />
        </button>
        <button
          type="button"
          className={`${styles.equipmentProductGallery__nav} ${styles["equipmentProductGallery__nav--next"]}`}
          aria-label="Следующее фото"
          onClick={goNext}
          disabled={count < 2}
        >
          <GalleryNavChevron direction="next" />
        </button>
      </div>

      {count > 1 ? (
        <ul className={styles.equipmentProductGallery__thumbs}>
          {images.map((img, index) => (
            <li key={`${img.imageUrl}-${index}`}>
              <button
                type="button"
                className={`${styles.equipmentProductGallery__thumb}${
                  index === activeIndex
                    ? ` ${styles["equipmentProductGallery__thumb--active"]}`
                    : ""
                }`}
                aria-label={`Фото ${index + 1}`}
                aria-current={index === activeIndex ? true : undefined}
                onClick={() => {
                  setActiveIndex(index);
                  setZoom(1);
                }}
              >
                <Image
                  className={styles.equipmentProductGallery__thumbImg}
                  src={img.imageUrl}
                  alt=""
                  fill
                  sizes="88px"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {mounted && lightboxPanel
        ? createPortal(lightboxPanel, document.body)
        : null}
    </div>
  );
}
