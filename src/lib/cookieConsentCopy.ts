import { buildLocalizedHref } from "@/lib/contentUtils";

export interface CookieConsentCopy {
  enabled: boolean;
  message: string;
  privacyLabel: string;
  privacyHref: string;
  rejectLabel: string;
  acceptAllLabel: string;
  settingsLabel: string;
  saveLabel: string;
  manageLabel: string;
  settingsTitle: string;
  settingsIntro: string;
  essentialTitle: string;
  essentialDesc: string;
  analyticsTitle: string;
  analyticsDesc: string;
  marketingTitle: string;
  marketingDesc: string;
  alwaysOnLabel: string;
}

export function parseCookieConsentCopy(
  map: Record<string, string>,
  lang: string
): CookieConsentCopy | null {
  const enabled = (map["global.cookies.enabled"] ?? "1").trim() !== "0";
  const message = map["global.cookies.message"]?.trim() ?? "";
  if (!enabled || !message) {
    return null;
  }

  const privacyHrefRaw =
    map["global.cookies.privacyHref"]?.trim() || "privacy-policy";

  return {
    enabled: true,
    message,
    privacyLabel:
      map["global.cookies.privacyLabel"]?.trim() || "Privacy policy",
    privacyHref: buildLocalizedHref(lang, privacyHrefRaw),
    rejectLabel:
      map["global.cookies.rejectLabel"]?.trim() || "Reject non-essential",
    acceptAllLabel: map["global.cookies.acceptAllLabel"]?.trim() || "Accept all",
    settingsLabel:
      map["global.cookies.settingsLabel"]?.trim() || "Cookie settings",
    saveLabel: map["global.cookies.saveLabel"]?.trim() || "Save preferences",
    manageLabel:
      map["global.cookies.manageLabel"]?.trim() || "Cookie settings",
    settingsTitle:
      map["global.cookies.settingsTitle"]?.trim() || "Cookie preferences",
    settingsIntro: map["global.cookies.settingsIntro"]?.trim() ?? "",
    essentialTitle:
      map["global.cookies.essentialTitle"]?.trim() || "Essential",
    essentialDesc: map["global.cookies.essentialDesc"]?.trim() ?? "",
    analyticsTitle:
      map["global.cookies.analyticsTitle"]?.trim() || "Analytics",
    analyticsDesc: map["global.cookies.analyticsDesc"]?.trim() ?? "",
    marketingTitle:
      map["global.cookies.marketingTitle"]?.trim() || "Marketing",
    marketingDesc: map["global.cookies.marketingDesc"]?.trim() ?? "",
    alwaysOnLabel:
      map["global.cookies.alwaysOnLabel"]?.trim() || "Always active",
  };
}
