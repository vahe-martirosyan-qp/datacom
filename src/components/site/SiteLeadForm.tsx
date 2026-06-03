"use client";

import { useState, type FormEvent } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSubmitLeadMutation } from "@/hooks/useSubmitLeadMutation";
import {
  leadConsentErrorMessage,
  leadSubmitErrorMessage,
  leadSubmittingLabel,
} from "@/lib/leadFormMessages";
import type { LeadFormSource } from "@/types/lead";
import styles from "./SiteLeadForm.module.scss";

interface SiteLeadFormContentProps {
  map: Record<string, string>;
  isLoading: boolean;
  source: LeadFormSource;
  lang: string;
}

export function SiteLeadFormContent({
  map,
  isLoading,
  source,
  lang,
}: SiteLeadFormContentProps) {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitMutation = useSubmitLeadMutation();

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
  const requirePrivacy = Boolean(privacyLabel);
  const requireAgreement = Boolean(agreementLabel);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const fd = new FormData(form);
    const companyWebsite = String(fd.get("companyWebsite") ?? "").trim();
    if (companyWebsite) {
      return;
    }

    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const comments = String(fd.get("comments") ?? "").trim();
    const privacyAccepted = fd.get("privacy") === "on";
    const agreementAccepted = fd.get("agreement") === "on";
    const pageUrl =
      typeof window !== "undefined" ? window.location.href : undefined;

    if (
      (requirePrivacy && !privacyAccepted) ||
      (requireAgreement && !agreementAccepted)
    ) {
      setSubmitError(leadConsentErrorMessage(lang));
      return;
    }

    try {
      await submitMutation.mutateAsync({
        name,
        phone,
        email: email || undefined,
        comments: comments || undefined,
        source,
        lang,
        pageUrl,
        requirePrivacy,
        requireAgreement,
        privacyAccepted: requirePrivacy ? privacyAccepted : undefined,
        agreementAccepted: requireAgreement ? agreementAccepted : undefined,
      });
      setSent(true);
    } catch {
      setSubmitError(leadSubmitErrorMessage(lang));
    }
  };

  if (isLoading) {
    return <Skeleton variant="title" />;
  }

  if (sent) {
    return <p className={styles.siteLeadForm__done}>{successMessage}</p>;
  }

  const isSubmitting = submitMutation.isPending;
  const buttonLabel = isSubmitting ? leadSubmittingLabel(lang) : submitLabel;

  return (
    <form className={styles.siteLeadForm__form} onSubmit={onSubmit}>
      <div className={styles.siteLeadForm__honeypot} aria-hidden>
        <label>
          Company website
          <input
            type="text"
            name="companyWebsite"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>
      <div className={styles.siteLeadForm__field}>
        <input
          name="name"
          className={styles.siteLeadForm__input}
          placeholder={namePh}
          autoComplete="name"
          required
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>
      <div className={styles.siteLeadForm__field}>
        <input
          name="email"
          type="email"
          className={styles.siteLeadForm__input}
          placeholder={emailPh}
          autoComplete="email"
          disabled={isSubmitting}
        />
      </div>
      <div className={styles.siteLeadForm__field}>
        <textarea
          name="comments"
          className={styles.siteLeadForm__textarea}
          placeholder={commentsPh}
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      {privacyLabel ? (
        <label className={styles.siteLeadForm__check}>
          <input
            type="checkbox"
            name="privacy"
            required
            className={styles.siteLeadForm__checkbox}
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
          <span>{agreementLabel}</span>
        </label>
      ) : null}

      {submitError ? (
        <p className={styles.siteLeadForm__error} role="alert">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        className={styles.siteLeadForm__submit}
        disabled={isSubmitting}
      >
        {buttonLabel}
      </button>
    </form>
  );
}

interface SiteLeadFormProps {
  map: Record<string, string>;
  isLoading: boolean;
  source: LeadFormSource;
  lang: string;
  titleOverride?: string;
  subtitleOverride?: string;
  sectionId?: string;
}

export function SiteLeadForm({
  map,
  isLoading,
  source,
  lang,
  titleOverride,
  subtitleOverride,
  sectionId = "contacts",
}: SiteLeadFormProps) {
  const title = titleOverride ?? map["home.lead.title"] ?? "";
  const subtitle = subtitleOverride ?? map["home.lead.subtitle"] ?? "";

  if (isLoading) {
    return (
      <section className={styles.siteLeadForm} id={sectionId} aria-busy="true">
        <div className={styles.siteLeadForm__inner}>
          <Skeleton variant="title" />
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${styles.siteLeadForm} ${styles["siteLeadForm--section"]}`}
      id={sectionId}
    >
      <div className={styles.siteLeadForm__inner}>
        <h2 className={styles.siteLeadForm__title}>{title}</h2>
        {subtitle ? (
          <p className={styles.siteLeadForm__subtitle}>{subtitle}</p>
        ) : null}
        <SiteLeadFormContent
          map={map}
          isLoading={isLoading}
          source={source}
          lang={lang}
        />
      </div>
    </section>
  );
}
