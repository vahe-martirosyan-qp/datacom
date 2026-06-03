/** Inline palette for email clients (cannot use site CSS variables). */
const EMAIL = {
  bg: "#f5f5f5",
  card: "#ffffff",
  border: "#e0e0e0",
  text: "#141414",
  muted: "#6b6b6b",
  accent: "#141414",
  accentText: "#ffffff",
  link: "#333333",
  metaBg: "#fafafa",
} as const;

export interface LeadEmailTemplateInput {
  sourceLabel: string;
  name: string;
  phone: string;
  email: string;
  comments: string;
  lang: string;
  pageUrl: string;
  privacyAccepted: boolean;
  agreementAccepted: boolean;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string, valueHtml?: string): string {
  if (!value.trim() && !valueHtml) {
    return "";
  }
  const cell = valueHtml ?? escapeHtml(value);
  return `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid ${EMAIL.border};font-size:13px;font-weight:600;color:${EMAIL.muted};width:120px;vertical-align:top;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid ${EMAIL.border};font-size:15px;line-height:1.45;color:${EMAIL.text};vertical-align:top;">
        ${cell}
      </td>
    </tr>`;
}

export function buildLeadNotificationHtml(input: LeadEmailTemplateInput): string {
  const phoneHref = `tel:${input.phone.replace(/\s/g, "")}`;
  const emailRow = input.email.trim()
    ? row(
        "Email",
        input.email,
        `<a href="mailto:${escapeHtml(input.email)}" style="color:${EMAIL.link};text-decoration:underline;">${escapeHtml(input.email)}</a>`
      )
    : "";
  const commentsBlock = input.comments.trim()
    ? `
      <tr>
        <td colspan="2" style="padding:16px;border-bottom:1px solid ${EMAIL.border};">
          <div style="font-size:13px;font-weight:600;color:${EMAIL.muted};margin-bottom:8px;">Comment</div>
          <div style="font-size:15px;line-height:1.5;color:${EMAIL.text};white-space:pre-wrap;">${escapeHtml(input.comments)}</div>
        </td>
      </tr>`
    : "";

  const metaParts: string[] = [];
  if (input.lang) {
    metaParts.push(`Language: <strong>${escapeHtml(input.lang)}</strong>`);
  }
  if (input.pageUrl) {
    metaParts.push(
      `Page: <a href="${escapeHtml(input.pageUrl)}" style="color:${EMAIL.link};">${escapeHtml(input.pageUrl)}</a>`
    );
  }
  const metaBlock =
    metaParts.length > 0
      ? `
        <tr>
          <td colspan="2" style="padding:14px 16px;background:${EMAIL.metaBg};font-size:13px;line-height:1.5;color:${EMAIL.muted};">
            ${metaParts.join("<br />")}
          </td>
        </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New lead</title>
</head>
<body style="margin:0;padding:0;background:${EMAIL.bg};font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL.bg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${EMAIL.card};border:1px solid ${EMAIL.border};border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:24px 24px 16px;background:${EMAIL.accent};">
              <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.75);margin-bottom:8px;">
                Datacom
              </div>
              <div style="font-size:22px;font-weight:700;line-height:1.3;color:${EMAIL.accentText};">
                New lead
              </div>
              <div style="display:inline-block;margin-top:12px;padding:6px 12px;font-size:12px;font-weight:600;color:${EMAIL.accentText};background:rgba(255,255,255,0.15);border-radius:6px;">
                ${escapeHtml(input.sourceLabel)}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row("Name", input.name)}
                ${row(
                  "Phone",
                  input.phone,
                  `<a href="${escapeHtml(phoneHref)}" style="color:${EMAIL.link};text-decoration:none;font-weight:600;">${escapeHtml(input.phone)}</a>`
                )}
                ${emailRow}
                ${commentsBlock}
                ${row("Privacy policy", input.privacyAccepted ? "Accepted" : "—")}
                ${row("Data consent", input.agreementAccepted ? "Accepted" : "—")}
                ${metaBlock}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 24px;font-size:12px;line-height:1.45;color:${EMAIL.muted};text-align:center;">
              Sent from the website contact form. Reply to this email to reach the visitor when they left an address.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildLeadNotificationText(input: LeadEmailTemplateInput): string {
  const lines = [
    "New lead — Datacom",
    `Source: ${input.sourceLabel}`,
    input.lang ? `Language: ${input.lang}` : null,
    input.pageUrl ? `Page: ${input.pageUrl}` : null,
    "",
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    input.email ? `Email: ${input.email}` : null,
    input.comments ? `Comment:\n${input.comments}` : null,
    "",
    `Privacy policy: ${input.privacyAccepted ? "Accepted" : "—"}`,
    `Data consent: ${input.agreementAccepted ? "Accepted" : "—"}`,
  ].filter((line): line is string => line !== null);

  return lines.join("\n");
}
