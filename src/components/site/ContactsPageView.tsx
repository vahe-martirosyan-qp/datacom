"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { entriesToMap, parseJsonArray } from "@/lib/contentUtils";
import { useContactsContentQuery } from "@/hooks/useContactsContentQuery";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import type { ContactOfficeItem } from "@/types/site";
import { SiteChrome } from "./SiteChrome";
import { SiteLeadForm } from "./SiteLeadForm";
import styles from "./ContactsPageView.module.scss";

interface ContactsPageViewProps {
  lang: string;
}

function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits ? `tel:+${digits}` : "";
}

export function ContactsPageView({ lang }: ContactsPageViewProps) {
  const homeQuery = useHomeContentQuery(lang);
  const contactsQuery = useContactsContentQuery(lang);
  const languagesQuery = useLanguagesQuery();

  const homeMap = useMemo(
    () => (homeQuery.data ? entriesToMap(homeQuery.data.entries) : {}),
    [homeQuery.data]
  );

  const contactsMap = useMemo(
    () =>
      contactsQuery.data ? entriesToMap(contactsQuery.data.entries) : {},
    [contactsQuery.data]
  );

  const languages = languagesQuery.data ?? [];
  const isLoading =
    homeQuery.isLoading || contactsQuery.isLoading || languagesQuery.isLoading;
  const loadError = homeQuery.isError || contactsQuery.isError;

  const homeLabel = homeMap["home.header.logoText"]?.trim() || "Home";
  const title = contactsMap["page.contacts.title"]?.trim() || "Contacts";
  const offices = parseJsonArray<ContactOfficeItem>(
    contactsMap["page.contacts.offices"] ?? "[]",
    []
  );
  const formTitle = contactsMap["page.contacts.formTitle"]?.trim();
  const formSubtitle = contactsMap["page.contacts.formSubtitle"]?.trim();

  return (
    <SiteChrome
      lang={lang}
      map={homeMap}
      languages={languages}
      isLoading={isLoading}
      loadError={loadError}
    >
      <article className={styles.contactsPage} lang={lang}>
        <header className={styles.contactsPage__hero}>
          <div className={styles.contactsPage__heroInner}>
            <nav className={styles.contactsPage__crumb} aria-label="Breadcrumb">
              <Link href={`/${lang}`} className={styles.contactsPage__crumbLink}>
                {homeLabel}
              </Link>
              <span aria-hidden> / </span>
              <span>{title}</span>
            </nav>

            {isLoading ? (
              <div className={styles.contactsPage__loading}>
                <Skeleton variant="title" />
              </div>
            ) : (
              <h1 className={styles.contactsPage__title}>{title}</h1>
            )}
          </div>
        </header>

        {!isLoading && offices.length > 0 ? (
          <section className={styles.contactsPage__offices} aria-label={title}>
            <div className={styles.contactsPage__officesInner}>
              {offices.map((office) => {
                const phone = office.phone?.trim() ?? "";
                const email = office.email?.trim() ?? "";
                const address = office.address?.trim() ?? "";
                const hours = office.hours?.trim() ?? "";
                const mapLabel = office.mapLabel?.trim() ?? "";
                const mapHref = office.mapHref?.trim() ?? "";
                const key = `${office.title}-${phone}-${email}`;

                return (
                  <article key={key} className={styles.contactsPage__office}>
                    <h2 className={styles.contactsPage__officeTitle}>
                      {office.title}
                    </h2>
                    {phone ? (
                      <a
                        className={styles.contactsPage__officeLink}
                        href={telHref(phone)}
                      >
                        {phone}
                      </a>
                    ) : null}
                    {email ? (
                      <a
                        className={styles.contactsPage__officeLink}
                        href={`mailto:${email}`}
                      >
                        {email}
                      </a>
                    ) : null}
                    {address ? (
                      <p className={styles.contactsPage__officeText}>{address}</p>
                    ) : null}
                    {hours ? (
                      <p className={styles.contactsPage__officeText}>{hours}</p>
                    ) : null}
                    {mapLabel && mapHref ? (
                      <a
                        className={styles.contactsPage__officeMap}
                        href={mapHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {mapLabel}
                      </a>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        <div className={styles.contactsPage__formWrap}>
          <SiteLeadForm
            map={homeMap}
            isLoading={isLoading}
            source="contacts"
            lang={lang}
            titleOverride={formTitle}
            subtitleOverride={formSubtitle}
            sectionId="contacts-form"
          />
        </div>
      </article>
    </SiteChrome>
  );
}
