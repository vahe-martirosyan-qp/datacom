import { LEAD_FORM_SOURCES, type LeadFormSource, type SubmitLeadRequest } from "@/types/lead";

const MAX_NAME = 200;
const MAX_PHONE = 64;
const MAX_EMAIL = 254;
const MAX_COMMENTS = 4000;
const MAX_URL = 2048;
const MAX_LANG = 16;

function isLeadSource(value: string): value is LeadFormSource {
  return (LEAD_FORM_SOURCES as readonly string[]).includes(value);
}

export function parseSubmitLeadBody(
  body: unknown
):
  | { ok: true; data: SubmitLeadRequest }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body" };
  }

  const raw = body as Record<string, unknown>;

  if (typeof raw.companyWebsite === "string" && raw.companyWebsite.trim()) {
    return { ok: false, error: "Invalid submission" };
  }

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const phone = typeof raw.phone === "string" ? raw.phone.trim() : "";
  const email =
    typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const comments =
    typeof raw.comments === "string" ? raw.comments.trim() : "";
  const sourceRaw = typeof raw.source === "string" ? raw.source.trim() : "";
  const lang = typeof raw.lang === "string" ? raw.lang.trim() : "";
  const pageUrl = typeof raw.pageUrl === "string" ? raw.pageUrl.trim() : "";

  if (!name || name.length > MAX_NAME) {
    return { ok: false, error: "Name is required" };
  }
  if (!phone || phone.length > MAX_PHONE) {
    return { ok: false, error: "Phone is required" };
  }
  if (email && (email.length > MAX_EMAIL || !email.includes("@"))) {
    return { ok: false, error: "Invalid email" };
  }
  if (comments.length > MAX_COMMENTS) {
    return { ok: false, error: "Comment is too long" };
  }
  if (!isLeadSource(sourceRaw)) {
    return { ok: false, error: "Invalid form source" };
  }
  if (lang.length > MAX_LANG) {
    return { ok: false, error: "Invalid language" };
  }
  if (pageUrl.length > MAX_URL) {
    return { ok: false, error: "Invalid page URL" };
  }

  const requirePrivacy = raw.requirePrivacy === true;
  const requireAgreement = raw.requireAgreement === true;
  const privacyAccepted = raw.privacyAccepted === true;
  const agreementAccepted = raw.agreementAccepted === true;

  if (requirePrivacy && !privacyAccepted) {
    return { ok: false, error: "Privacy policy must be accepted" };
  }
  if (requireAgreement && !agreementAccepted) {
    return { ok: false, error: "Data processing consent is required" };
  }

  return {
    ok: true,
    data: {
      name,
      phone,
      email: email || undefined,
      comments: comments || undefined,
      source: sourceRaw,
      lang: lang || undefined,
      pageUrl: pageUrl || undefined,
      privacyAccepted: requirePrivacy ? privacyAccepted : undefined,
      agreementAccepted: requireAgreement ? agreementAccepted : undefined,
    },
  };
}
