import type { ContentEntry } from "@/types";

type PrivacyLocale = "en" | "ru" | "ar";

function privacyLocale(lang: string): PrivacyLocale {
  if (lang === "ru") {
    return "ru";
  }
  if (lang === "ar") {
    return "ar";
  }
  return "en";
}

export const PRIVACY_BODY_HTML_EN = `<h2>1. Controller</h2><p><strong>Datacom LLC</strong> (“Datacom”, “we”) is a hotel IT systems integrator and supplier of in-room technology: electronic locks, minibars, interactive TV, PBX, PMS integrations, and related equipment. We operate <strong>datacom.ru</strong> and process personal data when you browse the site, submit a request, or contact our sales and support teams.</p><h2>2. What data we collect</h2><ul><li><strong>Enquiry forms</strong> (homepage, contacts, equipment pages, quote modal): name, phone number, e-mail, comment, page URL, and interface language.</li><li><strong>Technical data</strong>: IP address, browser type, device data, and cookie/consent choices required to run the site securely.</li><li><strong>Business communication</strong>: content of e-mails and calls to our offices in Saint Petersburg and Moscow or to the hotline <strong>8&nbsp;800&nbsp;775&nbsp;6676</strong>.</li></ul><h2>3. Why we use it</h2><ul><li>To answer your request, prepare a commercial proposal, or provide technical support.</li><li>To operate, protect, and improve the website (including optional analytics/marketing cookies only with your consent).</li><li>To comply with Russian law and, where applicable, the GDPR.</li></ul><h2>4. Legal bases</h2><p>Depending on the case we rely on <em>your consent</em> (non-essential cookies, marketing), <em>steps prior to a contract</em> and <em>legitimate interest</em> (responding to B2B enquiries, site security), or <em>legal obligation</em>.</p><h2>5. Cookies</h2><p>Essential cookies are always on (security, language, storing your cookie choice). Analytics and marketing cookies are off until you accept them in the cookie banner or in <strong>Cookie settings</strong> in the footer. See the cookie notice when you first visit the site.</p><h2>6. Sharing</h2><p>We do not sell personal data. We may share data with hosting, e-mail (transactional notifications), and IT providers under confidentiality and data-processing terms, and with authorities when required by law.</p><h2>7. Retention</h2><p>Enquiry and correspondence data are kept for as long as needed for the business relationship and statutory periods, then deleted or anonymised unless law requires longer storage.</p><h2>8. Your rights</h2><p>You may request access, correction, deletion, restriction, objection, or withdrawal of consent. Contact us via the <a href="/en/contacts">Contacts</a> page or the e-mail/phone published there. You may also complain to your supervisory authority.</p><h2>9. Security</h2><p>We use organisational and technical measures suited to the nature of the data. Transmission over the Internet cannot be guaranteed to be fully secure.</p><h2>10. Updates</h2><p>We may change this policy; the date below shows the latest version. Continued use of the site after material changes may mean the updated policy applies.</p>`;

export const PRIVACY_BODY_HTML_RU = `<h2>1. Оператор</h2><p><strong>ООО «Датаком»</strong> («Датаком», «мы») — интегратор гостиничных IT-систем и поставщик оборудования для номерного фонда: электронные замки, минибары, интерактивное ТВ, АТС, интеграции с PMS и сопутствующие решения. Мы администрируем сайт <strong>datacom.ru</strong> и обрабатываем персональные данные при посещении сайта, отправке заявки и обращении в коммерческую службу или техподдержку.</p><h2>2. Какие данные</h2><ul><li><strong>Формы заявок</strong> (главная, контакты, оборудование, запрос стоимости): имя, телефон, e-mail, комментарий, URL страницы, язык интерфейса.</li><li><strong>Технические данные</strong>: IP-адрес, тип браузера, сведения об устройстве, выбор в баннере cookie.</li><li><strong>Деловая переписка</strong>: содержание писем и звонков в офисы в Санкт-Петербурге и Москве или на линию <strong>8&nbsp;800&nbsp;775&nbsp;6676</strong>.</li></ul><h2>3. Цели обработки</h2><ul><li>Ответ на запрос, подготовка коммерческого предложения, техническая поддержка.</li><li>Работа, защита и развитие сайта (аналитика/маркетинговые cookie — только с вашего согласия).</li><li>Соблюдение законодательства РФ, в т.ч. 152-ФЗ, и при необходимости GDPR.</li></ul><h2>4. Правовые основания</h2><p>В зависимости от ситуации: <em>согласие</em> (необязательные cookie), <em>заключение и исполнение договора</em> / <em>законный интерес</em> (обработка B2B-обращений, безопасность сайта), <em>обязанность по закону</em>.</p><h2>5. Cookie</h2><p>Обязательные cookie всегда активны (безопасность, язык, запись выбора). Аналитика и маркетинг отключены, пока вы не разрешите их в баннере или в <strong>Настройках cookie</strong> в подвале сайта.</p><h2>6. Передача третьим лицам</h2><p>Мы не продаём персональные данные. Передача возможна хостинг-провайдерам, сервисам почтовых уведомлений и иным обработчикам по договору, а также органам власти по закону.</p><h2>7. Срок хранения</h2><p>Данные обращений хранятся в срок, необходимый для взаимодействия и с учётом сроков по закону, затем удаляются или обезличиваются.</p><h2>8. Права субъекта</h2><p>Вы вправе запросить доступ, уточнение, удаление, ограничение, возражение, отзыв согласия. Свяжитесь с нами через страницу <a href="/ru/contacts">Контакты</a> или указанные там телефон/e-mail. Жалоба — в Роскомнадзор или иной уполномоченный орган.</p><h2>9. Безопасность</h2><p>Применяются организационные и технические меры, соответствующие рискам. Передача данных в сети Интернет не может быть абсолютно защищённой.</p><h2>10. Изменения</h2><p>Мы можем обновлять политику; актуальная дата указана ниже. Продолжение использования сайта после существенных изменений может означать принятие новой редакции.</p>`;

export const PRIVACY_BODY_HTML_AR = `<h2>١. المسؤول عن المعالجة</h2><p><strong>Datacom LLC</strong> («داتاكوم»، «نحن») مُكامل لأنظمة تكنولوجيا المعلومات الفندقية ومورّد معدات الغرف: الأقفال الإلكترونية، الثلاجات الصغيرة، التلفزيون التفاعلي، المقاسم، تكامل أنظمة PMS وغيرها. نُدير موقع <strong>datacom.ru</strong> ونعالج البيانات الشخصية عند تصفحك للموقع أو إرسال طلب أو التواصل مع المبيعات والدعم.</p><h2>٢. البيانات التي نجمعها</h2><ul><li><strong>نماذج الطلب</strong> (الصفحة الرئيسية، جهات الاتصال، المعدات، طلب عرض السعر): الاسم، الهاتف، البريد الإلكتروني، التعليق، رابط الصفحة، لغة الواجهة.</li><li><strong>بيانات تقنية</strong>: عنوان IP، نوع المتصفح، الجهاز، وخيارات ملفات تعريف الارتباط/الموافقة.</li><li><strong>التواصل التجاري</strong>: محتوى البريد والمكالمات إلى مكاتبنا في سانت بطرسبرغ وموسكو أو الخط الساخن <strong>8&nbsp;800&nbsp;775&nbsp;6676</strong>.</li></ul><h2>٣. أغراض المعالجة</h2><ul><li>الرد على طلبك وإعداد عرض تجاري أو تقديم دعم فني.</li><li>تشغيل الموقع وحمايته (التحليلات/التسويق — فقط بموافقتك).</li><li>الامتثال للقانون المعمول به بما في ذلك GDPR عند انطباقه.</li></ul><h2>٤. الأساس القانوني</h2><p>حسب الحالة: <em>الموافقة</em> (ملفات غير أساسية)، <em>خطوات قبل العقد</em> و<em>المصلحة المشروعة</em> (استفسارات B2B، أمن الموقع)، أو <em>التزام قانوني</em>.</p><h2>٥. ملفات تعريف الارتباط</h2><p>الملفات الأساسية مفعّلة دائماً. التحليلات والتسويق معطّلة حتى تقبلها من الشريط أو من <strong>إعدادات ملفات تعريف الارتباط</strong> في تذييل الصفحة.</p><h2>٦. الإفصاح</h2><p>لا نبيع البيانات الشخصية. قد نشاركها مع مزودي الاستضافة والبريد ومعالجي IT بعقود سرية، أو مع الجهات الرسمية عند الطلب القانوني.</p><h2>٧. الاحتفاظ</h2><p>نحتفظ ببيانات الطلبات للمدة اللازمة للعلاقة التجارية والالتزامات القانونية ثم نحذفها أو نُخفي هويتها.</p><h2>٨. حقوقك</h2><p>يمكنك طلب الوصول أو التصحيح أو الحذف أو تقييد المعالجة أو الاعتراض أو سحب الموافقة. تواصل معنا عبر صفحة <a href="/ar/contacts">جهات الاتصال</a>. يمكنك التقدم بشكوى إلى جهة الإشراف المختصة.</p><h2>٩. الأمان</h2><p>نطبّق تدابير تنظيمية وتقنية مناسبة. لا يمكن ضمان أمان كامل للنقل عبر الإنترنت.</p><h2>١٠. التحديثات</h2><p>قد نُحدّث هذه السياسة؛ التاريخ أدناه يوضح آخر نسخة.</p>`;

interface PrivacyCopy {
  seoTitle: string;
  seoDescription: string;
  title: string;
  intro: string;
  updatedLabel: string;
  updatedDate: string;
  bodyHtml: string;
}

const COPY: Record<PrivacyLocale, PrivacyCopy> = {
  en: {
    seoTitle: "Privacy policy — Datacom",
    seoDescription:
      "How Datacom processes personal data on datacom.ru: hotel IT integrator, enquiry forms, cookies, and your rights.",
    title: "Privacy policy",
    intro:
      "This policy describes how Datacom LLC processes personal data when you use our website and contact us about hotel equipment and integrations.",
    updatedLabel: "Last updated:",
    updatedDate: "3 June 2026",
    bodyHtml: PRIVACY_BODY_HTML_EN,
  },
  ru: {
    seoTitle: "Политика конфиденциальности — Datacom",
    seoDescription:
      "Обработка персональных данных на сайте Датаком: формы заявок, cookie, 152-ФЗ и права субъекта данных.",
    title: "Политика конфиденциальности",
    intro:
      "Настоящая политика описывает, как ООО «Датаком» обрабатывает персональные данные при использовании сайта и обращениях по оборудованию и интеграциям для отелей.",
    updatedLabel: "Обновлено:",
    updatedDate: "3 июня 2026 г.",
    bodyHtml: PRIVACY_BODY_HTML_RU,
  },
  ar: {
    seoTitle: "سياسة الخصوصية — Datacom",
    seoDescription:
      "كيف تعالج داتاكوم البيانات الشخصية على الموقع: نماذج الطلب، ملفات تعريف الارتباط، وحقوقك.",
    title: "سياسة الخصوصية",
    intro:
      "توضّح هذه السياسة كيف تعالج Datacom LLC البيانات الشخصية عند استخدام الموقع والتواصل بشأن معدات وتكاملات الفنادق.",
    updatedLabel: "آخر تحديث:",
    updatedDate: "٣ يونيو ٢٠٢٦",
    bodyHtml: PRIVACY_BODY_HTML_AR,
  },
};

function entry(key: string, value: string): ContentEntry {
  return { key, value, type: "text" };
}

export function privacyPageSeedEntriesForLang(
  lang: string
): Record<string, ContentEntry> {
  const c = COPY[privacyLocale(lang)];
  return {
    "page.privacy.seo.title": entry("page.privacy.seo.title", c.seoTitle),
    "page.privacy.seo.description": entry(
      "page.privacy.seo.description",
      c.seoDescription
    ),
    "page.privacy.title": entry("page.privacy.title", c.title),
    "page.privacy.intro": entry("page.privacy.intro", c.intro),
    "page.privacy.updatedLabel": entry("page.privacy.updatedLabel", c.updatedLabel),
    "page.privacy.updatedDate": entry("page.privacy.updatedDate", c.updatedDate),
    "page.privacy.bodyHtml": entry("page.privacy.bodyHtml", c.bodyHtml),
  };
}
