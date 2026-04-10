/** Russian labels for admin form fields (technical keys hidden where possible). */
export const ADMIN_FORM_LABELS: Record<string, string> = {
  "home.seo.title": "Заголовок страницы (SEO title)",
  "home.seo.description": "Описание (meta description)",
  "home.header.logoText": "Название в шапке",
  "home.header.phone": "Телефон",
  "home.header.ctaConsult": "Текст кнопки «Консультация»",
  "home.hero.title": "Заголовок баннера",
  "home.hero.subtitle": "Подзаголовок",
  "home.hero.ctaLabel": "Текст кнопки",
  "home.hero.ctaHref": "Ссылка кнопки (например contacts или #contacts)",
  "home.hero.imageUrl": "URL фонового изображения",
  "home.stats.equipmentTitle": "Колонка 1 — заголовок",
  "home.stats.equipmentCount": "Колонка 1 — число",
  "home.stats.equipmentDesc": "Колонка 1 — описание",
  "home.stats.hotezaTitle": "Колонка 2 — заголовок",
  "home.stats.hotezaCount": "Колонка 2 — число",
  "home.stats.hotezaDesc": "Колонка 2 — описание",
  "home.stats.integrationTitle": "Колонка 3 — заголовок",
  "home.stats.integrationCount": "Колонка 3 — число",
  "home.stats.integrationDesc": "Колонка 3 — описание",
  "home.spotlight.items": "Крупные ссылки (JSON редактируется ниже)",
  "home.features.title": "Заголовок блока услуг",
  "home.about.title": "Заголовок блока",
  "home.about.body": "Текст",
  "home.about.timelineStart": "Год начала (шкала)",
  "home.about.timelineEnd": "Год окончания (шкала)",
  "home.about.timelineCaption": "Подпись под шкалой лет",
  "home.about.counterValue": "Значение счётчика",
  "home.about.counterLabel": "Подпись к счётчику",
  "home.about.pdfLabel": "Текст ссылки на PDF",
  "home.about.pdfHref": "URL PDF",
  "home.about.companyCtaLabel": "Текст ссылки «О компании»",
  "home.about.companyCtaHref": "Ссылка «О компании»",
  "home.about.imageUrl": "URL изображения",
  "home.contactStrip.title": "Заголовок полосы",
  "home.contactStrip.subtitle": "Подзаголовок полосы",
  "home.contactStrip.ctaLabel": "Текст кнопки в полосе",
  "home.contactStrip.ctaHref": "Ссылка кнопки (например #contacts)",
  "home.projects.sectionTitle": "Заголовок блока «Проекты»",
  "projects.list": "Карточки проектов на главной (редактор ниже)",
  "home.projects.ctaLabel": "Текст ссылки «Все проекты»",
  "home.projects.ctaHref": "Ссылка «Все проекты»",
  "home.steps.title": "Заголовок блока шагов",
  "home.clients.title": "Заголовок",
  "home.clients.subtitle": "Подзаголовок",
  "home.lead.title": "Заголовок над формой",
  "home.lead.subtitle": "Подзаголовок под заголовком формы",
  "home.lead.namePh": "Подсказка поля «Имя»",
  "home.lead.phonePh": "Подсказка поля «Телефон»",
  "home.lead.emailPh": "Подсказка поля «Email»",
  "home.lead.commentsPh": "Подсказка поля «Комментарий»",
  "home.lead.privacyLabel": "Текст первого чекбокса (политика ПДн)",
  "home.lead.agreementLabel": "Текст второго чекбокса (согласие на обработку)",
  "home.lead.submitLabel": "Текст кнопки отправки",
  "home.lead.consent": "Устаревшее: одно согласие (если пусты чекбоксы)",
  "home.lead.successMessage": "Сообщение после отправки",
  "home.blog.title": "Заголовок блока «Блог»",
  "home.blog.subtitle": "Подзаголовок блока «Блог»",
  "home.blog.posts": "Список статей (редактор ниже)",
  "home.blog.ctaLabel": "Текст ссылки «Все материалы»",
  "home.blog.ctaHref": "Ссылка «Все материалы»",
  "home.footer.tagline": "Слоган в подвале",
  "home.footer.phone": "Телефон",
  "home.footer.phoneNote": "Подпись к телефону",
  "home.footer.email": "Email",
  "home.footer.emailNote": "Подпись к email",
  "home.footer.copyright": "Копирайт",
};

const PROJECT_FIELD_LABELS: Record<string, string> = {
  title: "Название проекта",
  location: "Локация / город",
  year: "Год",
  heroImage: "URL изображения (герой)",
  bodyHtml: "Текст страницы (HTML, редактор ниже)",
  equipment: "Оборудование (JSON-массив строк)",
};

export function adminFormLabel(key: string): string {
  if (ADMIN_FORM_LABELS[key]) {
    return ADMIN_FORM_LABELS[key];
  }
  const m = key.match(/^project\.[^.]+\.([a-zA-Z]+)$/);
  if (m?.[1] && PROJECT_FIELD_LABELS[m[1]]) {
    return PROJECT_FIELD_LABELS[m[1]];
  }
  return key;
}
