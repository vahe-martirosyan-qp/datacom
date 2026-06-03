export const LEAD_FORM_SOURCES = [
  "home",
  "contacts",
  "company",
  "equipment-category",
  "equipment-product-modal",
] as const;

export type LeadFormSource = (typeof LEAD_FORM_SOURCES)[number];

export interface SubmitLeadRequest {
  name: string;
  phone: string;
  email?: string;
  comments?: string;
  source: LeadFormSource;
  lang?: string;
  pageUrl?: string;
  /** Honeypot — must be empty */
  companyWebsite?: string;
  /** Sent when the privacy checkbox is shown in CMS */
  requirePrivacy?: boolean;
  /** Sent when the agreement checkbox is shown in CMS */
  requireAgreement?: boolean;
  privacyAccepted?: boolean;
  agreementAccepted?: boolean;
}

export interface SubmitLeadResponse {
  ok: true;
}
