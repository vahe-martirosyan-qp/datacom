import type { ContentEntry } from "@/types";

const COOKIE_KEYS = [
  "global.cookies.enabled",
  "global.cookies.message",
  "global.cookies.privacyLabel",
  "global.cookies.privacyHref",
  "global.cookies.rejectLabel",
  "global.cookies.acceptAllLabel",
  "global.cookies.settingsLabel",
  "global.cookies.saveLabel",
  "global.cookies.manageLabel",
  "global.cookies.settingsTitle",
  "global.cookies.settingsIntro",
  "global.cookies.essentialTitle",
  "global.cookies.essentialDesc",
  "global.cookies.analyticsTitle",
  "global.cookies.analyticsDesc",
  "global.cookies.marketingTitle",
  "global.cookies.marketingDesc",
  "global.cookies.alwaysOnLabel",
] as const;

const EN: Record<(typeof COOKIE_KEYS)[number], string> = {
  "global.cookies.enabled": "1",
  "global.cookies.message":
    "We use cookies and similar technologies to run this website, remember your preferences, and (if you allow) measure traffic. Essential cookies are required for the site to work. You can accept all, reject non-essential cookies, or choose categories below. See our privacy policy for how we process personal data (GDPR).",
  "global.cookies.privacyLabel": "Privacy policy",
  "global.cookies.privacyHref": "privacy-policy",
  "global.cookies.rejectLabel": "Reject non-essential",
  "global.cookies.acceptAllLabel": "Accept all",
  "global.cookies.settingsLabel": "Cookie settings",
  "global.cookies.saveLabel": "Save preferences",
  "global.cookies.manageLabel": "Cookie settings",
  "global.cookies.settingsTitle": "Cookie preferences",
  "global.cookies.settingsIntro":
    "Choose which optional cookies we may use. Essential cookies are always active because they are needed for security, language, and basic site functions.",
  "global.cookies.essentialTitle": "Essential",
  "global.cookies.essentialDesc":
    "Required for the website to function (e.g. session, security, consent storage, language).",
  "global.cookies.analyticsTitle": "Analytics",
  "global.cookies.analyticsDesc":
    "Help us understand how visitors use the site (pages viewed, performance). No advertising profiles.",
  "global.cookies.marketingTitle": "Marketing",
  "global.cookies.marketingDesc":
    "Used to measure campaigns and personalize offers on other sites. Disabled until you opt in.",
  "global.cookies.alwaysOnLabel": "Always active",
};

const RU: Record<(typeof COOKIE_KEYS)[number], string> = {
  "global.cookies.enabled": "1",
  "global.cookies.message":
    "Мы используем файлы cookie и аналогичные технологии для работы сайта, сохранения настроек и (если вы разрешите) анализа посещаемости. Обязательные cookie необходимы для работы сайта. Вы можете принять все, отклонить необязательные cookie или выбрать категории ниже. Подробности об обработке персональных данных — в политике конфиденциальности (152-ФЗ / GDPR).",
  "global.cookies.privacyLabel": "Политика конфиденциальности",
  "global.cookies.privacyHref": "privacy-policy",
  "global.cookies.rejectLabel": "Только обязательные",
  "global.cookies.acceptAllLabel": "Принять все",
  "global.cookies.settingsLabel": "Настройки cookie",
  "global.cookies.saveLabel": "Сохранить выбор",
  "global.cookies.manageLabel": "Настройки cookie",
  "global.cookies.settingsTitle": "Настройки cookie",
  "global.cookies.settingsIntro":
    "Выберите, какие необязательные cookie мы можем использовать. Обязательные cookie всегда активны — они нужны для безопасности, языка и базовых функций сайта.",
  "global.cookies.essentialTitle": "Обязательные",
  "global.cookies.essentialDesc":
    "Нужны для работы сайта (сессия, безопасность, сохранение согласия, язык).",
  "global.cookies.analyticsTitle": "Аналитика",
  "global.cookies.analyticsDesc":
    "Помогают понять, как посетители используют сайт. Без рекламных профилей.",
  "global.cookies.marketingTitle": "Маркетинг",
  "global.cookies.marketingDesc":
    "Для оценки рекламных кампаний и персонализации на других сайтах. Включаются только с вашего согласия.",
  "global.cookies.alwaysOnLabel": "Всегда активны",
};

function entriesFor(
  values: Record<(typeof COOKIE_KEYS)[number], string>
): Record<string, ContentEntry> {
  const out: Record<string, ContentEntry> = {};
  for (const key of COOKIE_KEYS) {
    const value = values[key];
    const type =
      key === "global.cookies.message" ||
      key === "global.cookies.settingsIntro" ||
      key.endsWith("Desc")
        ? "text"
        : "text";
    out[key] = { key, value, type };
  }
  return out;
}

const AR: Record<(typeof COOKIE_KEYS)[number], string> = {
  "global.cookies.enabled": "1",
  "global.cookies.message":
    "نستخدم ملفات تعريف الارتباط وتقنيات مشابهة لتشغيل الموقع وحفظ تفضيلاتك و(إذا سمحت) قياس الزيارات. الملفات الأساسية مطلوبة لعمل الموقع. يمكنك قبول الكل أو رفض غير الأساسية أو اختيار الفئات أدناه. راجع سياسة الخصوصية لمعرفة كيفية معالجة البيانات الشخصية.",
  "global.cookies.privacyLabel": "سياسة الخصوصية",
  "global.cookies.privacyHref": "privacy-policy",
  "global.cookies.rejectLabel": "الأساسية فقط",
  "global.cookies.acceptAllLabel": "قبول الكل",
  "global.cookies.settingsLabel": "إعدادات ملفات تعريف الارتباط",
  "global.cookies.saveLabel": "حفظ التفضيلات",
  "global.cookies.manageLabel": "إعدادات ملفات تعريف الارتباط",
  "global.cookies.settingsTitle": "تفضيلات ملفات تعريف الارتباط",
  "global.cookies.settingsIntro":
    "اختر ملفات تعريف الارتباط الاختيارية. الملفات الأساسية نشطة دائماً لأنها ضرورية للأمان واللغة ووظائف الموقع.",
  "global.cookies.essentialTitle": "أساسية",
  "global.cookies.essentialDesc":
    "مطلوبة لتشغيل الموقع (الأمان، اللغة، حفظ موافقتك).",
  "global.cookies.analyticsTitle": "تحليلات",
  "global.cookies.analyticsDesc":
    "تساعدنا على فهم استخدام الموقع دون إنشاء ملفات إعلانية.",
  "global.cookies.marketingTitle": "تسويق",
  "global.cookies.marketingDesc":
    "لقياس الحملات والعروض — معطّلة حتى توافق.",
  "global.cookies.alwaysOnLabel": "نشطة دائماً",
};

export function cookieConsentSeedEntriesForLang(
  lang: string
): Record<string, ContentEntry> {
  if (lang === "ru") {
    return entriesFor(RU);
  }
  if (lang === "ar") {
    return entriesFor(AR);
  }
  return entriesFor(EN);
}
