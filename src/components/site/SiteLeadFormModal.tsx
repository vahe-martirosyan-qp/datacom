"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { lockPageScroll } from "@/lib/lockPageScroll";
import { SiteLeadFormContent } from "./SiteLeadForm";
import type { LeadFormSource } from "@/types/lead";
import styles from "./SiteLeadFormModal.module.scss";

interface SiteLeadFormModalProps {
  open: boolean;
  onClose: () => void;
  map: Record<string, string>;
  isLoading: boolean;
  source: LeadFormSource;
  lang: string;
  titleOverride?: string;
  subtitleOverride?: string;
}

export function SiteLeadFormModal({
  open,
  onClose,
  map,
  isLoading,
  source,
  lang,
  titleOverride,
  subtitleOverride,
}: SiteLeadFormModalProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const unlockScroll = lockPageScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    const onWheel = (e: WheelEvent) => {
      const root = dialogRef.current;
      if (root && e.target instanceof Node && root.contains(e.target)) {
        return;
      }
      e.preventDefault();
    };
    const onTouchMove = (e: TouchEvent) => {
      const root = dialogRef.current;
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
  }, [open, onClose]);

  if (!open || !mounted) {
    return null;
  }

  const title = titleOverride ?? map["home.lead.title"] ?? "";
  const subtitle = subtitleOverride ?? map["home.lead.subtitle"] ?? "";

  const panel = (
    <div
      ref={dialogRef}
      className={styles.siteLeadFormModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "site-lead-form-modal-title" : undefined}
      aria-label={title ? undefined : "Contact form"}
      onClick={onClose}
    >
      <div
        className={styles.siteLeadFormModal__dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.siteLeadFormModal__close}
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        {title ? (
          <h2
            id="site-lead-form-modal-title"
            className={styles.siteLeadFormModal__title}
          >
            {title}
          </h2>
        ) : null}
        {subtitle ? (
          <p className={styles.siteLeadFormModal__subtitle}>{subtitle}</p>
        ) : null}
        <SiteLeadFormContent
          map={map}
          isLoading={isLoading}
          source={source}
          lang={lang}
        />
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}
