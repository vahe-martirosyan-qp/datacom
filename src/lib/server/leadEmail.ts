import { Resend } from "resend";
import type { LeadFormSource } from "@/types/lead";
import {
  buildLeadNotificationHtml,
  buildLeadNotificationText,
} from "@/lib/server/leadEmailTemplate";

const SOURCE_LABELS: Record<LeadFormSource, string> = {
  home: "Homepage",
  contacts: "Contacts page",
  company: "Company page",
  "equipment-category": "Equipment category",
  "equipment-product-modal": "Equipment product (quote modal)",
};

export interface LeadEmailPayload {
  name: string;
  phone: string;
  email: string;
  comments: string;
  source: LeadFormSource;
  lang: string;
  pageUrl: string;
  privacyAccepted: boolean;
  agreementAccepted: boolean;
}

function getLeadEmailConfig():
  | { ok: true; apiKey: string; from: string; to: string }
  | { ok: false; error: string } {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.LEADS_FROM_EMAIL?.trim();
  const to = process.env.LEADS_TO_EMAIL?.trim();

  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not set" };
  }
  if (!from) {
    return { ok: false, error: "LEADS_FROM_EMAIL is not set" };
  }
  if (!to) {
    return { ok: false, error: "LEADS_TO_EMAIL is not set" };
  }

  return { ok: true, apiKey, from, to };
}

function buildLeadEmailBodies(payload: LeadEmailPayload): {
  subject: string;
  text: string;
  html: string;
} {
  const sourceLabel = SOURCE_LABELS[payload.source];
  const subject = `[Datacom] Lead — ${sourceLabel}`;
  const templateInput = {
    sourceLabel,
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    comments: payload.comments,
    lang: payload.lang,
    pageUrl: payload.pageUrl,
    privacyAccepted: payload.privacyAccepted,
    agreementAccepted: payload.agreementAccepted,
  };

  return {
    subject,
    text: buildLeadNotificationText(templateInput),
    html: buildLeadNotificationHtml(templateInput),
  };
}

export async function sendLeadEmail(
  payload: LeadEmailPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const config = getLeadEmailConfig();
  if (!config.ok) {
    return config;
  }

  const { subject, text, html } = buildLeadEmailBodies(payload);
  const resend = new Resend(config.apiKey);

  const replyTo = payload.email.trim() || undefined;

  const { error } = await resend.emails.send({
    from: config.from,
    to: [config.to],
    replyTo,
    subject,
    text,
    html,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export function isLeadEmailConfigured(): boolean {
  return getLeadEmailConfig().ok;
}
