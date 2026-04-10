"use client";

import { useState, type FormEvent } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./SiteLeadForm.module.scss";

interface SiteLeadFormProps {
  map: Record<string, string>;
  isLoading: boolean;
}

export function SiteLeadForm({ map, isLoading }: SiteLeadFormProps) {
  const [sent, setSent] = useState(false);
  const title = map["home.lead.title"] ?? "";
  const subtitle = map["home.lead.subtitle"] ?? "";
  const namePh = map["home.lead.namePh"] ?? "";
  const phonePh = map["home.lead.phonePh"] ?? "";
  const emailPh = map["home.lead.emailPh"] ?? "";
  const commentsPh = map["home.lead.commentsPh"] ?? "";
  const submitLabel = map["home.lead.submitLabel"] ?? "";
  const successMessage = map["home.lead.successMessage"] ?? "";
  const privacyLabel =
    map["home.lead.privacyLabel"]?.trim() ||
    map["home.lead.consent"]?.trim() ||
    "";
  const agreementLabel = map["home.lead.agreementLabel"]?.trim() || "";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (isLoading) {
    return (
      <section className={styles.siteLeadForm} id="contacts" aria-busy="true">
        <div className={styles.siteLeadForm__inner}>
          <Skeleton variant="title" />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.siteLeadForm} id="contacts">
      <div className={styles.siteLeadForm__inner}>
        <h2 className={styles.siteLeadForm__title}>{title}</h2>
        {subtitle ? (
          <p className={styles.siteLeadForm__subtitle}>{subtitle}</p>
        ) : null}
        {sent ? (
          <p className={styles.siteLeadForm__done}>{successMessage}</p>
        ) : (
          <form className={styles.siteLeadForm__form} onSubmit={onSubmit}>
            <div className={styles.siteLeadForm__field}>
              <input
                name="name"
                className={styles.siteLeadForm__input}
                placeholder={namePh}
                autoComplete="name"
                required
              />
            </div>
            <div className={styles.siteLeadForm__field}>
              <input
                name="phone"
                type="tel"
                className={styles.siteLeadForm__input}
                placeholder={phonePh}
                autoComplete="tel"
                required
              />
            </div>
            <div className={styles.siteLeadForm__field}>
              <input
                name="email"
                type="email"
                className={styles.siteLeadForm__input}
                placeholder={emailPh}
                autoComplete="email"
              />
            </div>
            <div className={styles.siteLeadForm__field}>
              <textarea
                name="comments"
                className={styles.siteLeadForm__textarea}
                placeholder={commentsPh}
                rows={3}
              />
            </div>

            {privacyLabel ? (
              <label className={styles.siteLeadForm__check}>
                <input
                  type="checkbox"
                  name="privacy"
                  required
                  className={styles.siteLeadForm__checkbox}
                />
                <span>{privacyLabel}</span>
              </label>
            ) : null}
            {agreementLabel ? (
              <label className={styles.siteLeadForm__check}>
                <input
                  type="checkbox"
                  name="agreement"
                  required
                  className={styles.siteLeadForm__checkbox}
                />
                <span>{agreementLabel}</span>
              </label>
            ) : null}

            <button type="submit" className={styles.siteLeadForm__submit}>
              {submitLabel}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
