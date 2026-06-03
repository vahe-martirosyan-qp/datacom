export interface AdminSectionDef {
  id: string;
  title: string;
  description: string;
  keys: readonly string[];
}

/** Шапка, меню, подвал — на всех страницах публичного сайта. */
export const GLOBAL_ADMIN_SECTIONS: AdminSectionDef[] = [
  {
    id: "header",
    title: "Шапка сайта",
    description: "Логотип (текст), телефон, кнопка «Консультация»",
    keys: [
      "home.header.logoText",
      "home.header.phone",
      "home.header.ctaConsult",
    ],
  },
  {
    id: "nav",
    title: "Меню и мега-меню",
    description:
      "Верхний уровень и подпункты (выпадающий список при наведении на десктопе)",
    keys: ["home.nav.megaMenu", "home.nav.items"],
  },
  {
    id: "footer",
    title: "Подвал",
    description: "Контакты, колонки со ссылками, копирайт",
    keys: [
      "home.footer.tagline",
      "home.footer.phone",
      "home.footer.phoneNote",
      "home.footer.email",
      "home.footer.emailNote",
      "home.footer.columns",
      "home.footer.copyright",
    ],
  },
  {
    id: "cookies",
    title: "Cookie и GDPR",
    description:
      "Баннер согласия при первом визите. «1» в «Включить баннер» — показать; «0» — скрыть. Ссылка политики — путь без языка (privacy-policy, contacts).",
    keys: [
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
    ],
  },
];

/** Только главная страница `/[lang]`. */
export const HOME_PAGE_ADMIN_SECTIONS: AdminSectionDef[] = [
  {
    id: "seo",
    title: "SEO главной",
    description: "Заголовок и описание в поиске для этой страницы",
    keys: ["home.seo.title", "home.seo.description"],
  },
  {
    id: "hero",
    title: "Главный баннер",
    description: "Заголовок, подзаголовок, CTA, фон",
    keys: [
      "home.hero.title",
      "home.hero.subtitle",
      "home.hero.ctaLabel",
      "home.hero.ctaHref",
      "home.hero.imageUrl",
    ],
  },
  {
    id: "stats",
    title: "Две колонки (цифры)",
    description: "Оборудование / Интеграции",
    keys: [
      "home.stats.equipmentTitle",
      "home.stats.equipmentCount",
      "home.stats.equipmentDesc",
      "home.stats.integrationTitle",
      "home.stats.integrationCount",
      "home.stats.integrationDesc",
    ],
  },
  {
    id: "features",
    title: "Карточки направлений",
    description: "Заголовок блока и сетка карточек (заголовок + описание)",
    keys: ["home.features.title", "home.features.items"],
  },
  {
    id: "about",
    title: "О компании",
    description:
      "Текст, шкала лет, счётчик, PDF, ссылка «Подробнее», изображение",
    keys: [
      "home.about.title",
      "home.about.body",
      "home.about.timelineStart",
      "home.about.timelineEnd",
      "home.about.timelineCaption",
      "home.about.counterValue",
      "home.about.counterLabel",
      "home.about.pdfLabel",
      "home.about.pdfHref",
      "home.about.companyCtaLabel",
      "home.about.companyCtaHref",
      "home.about.imageUrl",
    ],
  },
  {
    id: "contactStrip",
    title: "Полоса «Свяжитесь с нами»",
    description: "Тёмный блок с телефоном и кнопкой над формой",
    keys: [
      "home.contactStrip.title",
      "home.contactStrip.subtitle",
      "home.contactStrip.ctaLabel",
      "home.contactStrip.ctaHref",
    ],
  },
  {
    id: "lead",
    title: "Форма заявки",
    description: "Поля, комментарий, согласия, сообщение после отправки",
    keys: [
      "home.lead.title",
      "home.lead.subtitle",
      "home.lead.namePh",
      "home.lead.phonePh",
      "home.lead.emailPh",
      "home.lead.commentsPh",
      "home.lead.privacyLabel",
      "home.lead.agreementLabel",
      "home.lead.submitLabel",
      "home.lead.successMessage",
    ],
  },
  {
    id: "projects",
    title: "Блок «Проекты»",
    description: "Заголовок, карточки (фото, название, город), ссылка «Все проекты»",
    keys: [
      "home.projects.sectionTitle",
      "projects.list",
      "home.projects.ctaLabel",
      "home.projects.ctaHref",
    ],
  },
  {
    id: "clients",
    title: "Клиенты",
    description:
      "Заголовок и подзаголовок — для выбранного языка; логотипы общие для всех языков (загрузка, обрезка, порядок)",
    keys: [
      "home.clients.title",
      "home.clients.subtitle",
      "home.clients.brands",
    ],
  },
  {
    id: "steps",
    title: "Как мы работаем",
    description: "Заголовок блока и шаги (заголовок + описание)",
    keys: ["home.steps.title", "home.steps.items"],
  },
  {
    id: "blog",
    title: "Блок «Новости / блог»",
    description: "Заголовки, карточки статей и ссылка «Все материалы»",
    keys: [
      "home.blog.title",
      "home.blog.subtitle",
      "home.blog.posts",
      "home.blog.ctaLabel",
      "home.blog.ctaHref",
    ],
  },
];

/** Страница «Компания» `/[lang]/company`. */
export const COMPANY_PAGE_ADMIN_SECTIONS: AdminSectionDef[] = [
  {
    id: "seo",
    title: "SEO страницы «Компания»",
    description: "Заголовок и описание в поиске",
    keys: ["page.company.seo.title", "page.company.seo.description"],
  },
  {
    id: "hero",
    title: "Шапка страницы",
    description: "Заголовок H1, вводный текст, шкала лет",
    keys: [
      "page.company.title",
      "page.company.intro",
      "page.company.timelineStart",
      "page.company.timelineEnd",
    ],
  },
  {
    id: "stats",
    title: "Цифры (4 карточки)",
    description: "Сетка статистики под шкалой лет",
    keys: ["page.company.stats"],
  },
  {
    id: "media",
    title: "Крупное фото",
    description: "Изображение перед основным текстом на странице «Компания»",
    keys: ["page.company.heroImageUrl"],
  },
  {
    id: "body",
    title: "Основной текст",
    description: "Статья (TipTap) и ссылка на PDF-бриф",
    keys: [
      "page.company.bodyHtml",
      "page.company.pdfLabel",
      "page.company.pdfHref",
    ],
  },
  {
    id: "clients",
    title: "Блок клиентов",
    description:
      "Заголовки на этой странице; список брендов — в «Клиенты» на главной (home.clients.brands)",
    keys: ["page.company.clientsTitle", "page.company.clientsSubtitle"],
  },
];

/** Страница «Политика конфиденциальности» `/[lang]/privacy`. */
export const PRIVACY_PAGE_ADMIN_SECTIONS: AdminSectionDef[] = [
  {
    id: "seo",
    title: "SEO",
    description: "Заголовок и описание в поиске",
    keys: ["page.privacy.seo.title", "page.privacy.seo.description"],
  },
  {
    id: "hero",
    title: "Шапка страницы",
    description: "H1, вводный текст, дата обновления",
    keys: [
      "page.privacy.title",
      "page.privacy.intro",
      "page.privacy.updatedLabel",
      "page.privacy.updatedDate",
    ],
  },
  {
    id: "body",
    title: "Основной текст (GDPR / 152-ФЗ)",
    description:
      "Полный текст политики на `/[lang]/privacy-policy` — визуальный редактор TipTap (заголовки, списки, ссылки).",
    keys: ["page.privacy.bodyHtml"],
  },
];

/** Страница «Контакты» `/[lang]/contacts`. */
export const CONTACTS_PAGE_ADMIN_SECTIONS: AdminSectionDef[] = [
  {
    id: "seo",
    title: "SEO страницы «Контакты»",
    description: "Заголовок и описание в поиске",
    keys: ["page.contacts.seo.title", "page.contacts.seo.description"],
  },
  {
    id: "hero",
    title: "Заголовок страницы",
    description: "H1 на странице контактов",
    keys: ["page.contacts.title"],
  },
  {
    id: "offices",
    title: "Офисы и поддержка",
    description: "Карточки с телефоном, email, адресом и ссылкой на карту",
    keys: ["page.contacts.offices"],
  },
  {
    id: "form",
    title: "Форма «Напишите нам»",
    description:
      "Заголовки над формой на этой странице; поля формы — в «Форма заявки» на главной (home.lead.*)",
    keys: ["page.contacts.formTitle", "page.contacts.formSubtitle"],
  },
];

/** Страница «Блог» `/[lang]/blog`. */
export const BLOG_PAGE_ADMIN_SECTIONS: AdminSectionDef[] = [
  {
    id: "seo",
    title: "SEO страницы «Блог»",
    description: "Заголовок и описание в поиске",
    keys: ["page.blog.seo.title", "page.blog.seo.description"],
  },
  {
    id: "hero",
    title: "Заголовок страницы",
    description: "H1 и подзаголовок на странице блога",
    keys: ["page.blog.title", "page.blog.subtitle"],
  },
  {
    id: "posts",
    title: "Карточки в списке /blog",
    description:
      "Только превью в сетке (заголовок, картинка, ссылка). Полный текст статьи — в «Блог» → выберите статью → «Текст статьи».",
    keys: ["page.blog.posts"],
  },
  {
    id: "loadMore",
    title: "Кнопка «Показать ещё»",
    description: "Текст кнопки подгрузки (если статей больше 10)",
    keys: ["page.blog.loadMoreLabel"],
  },
];

/** Страница «Интеграции» `/[lang]/integrations`. */
export const INTEGRATIONS_PAGE_ADMIN_SECTIONS: AdminSectionDef[] = [
  {
    id: "seo",
    title: "SEO страницы «Интеграции»",
    description: "Заголовок и описание в поиске",
    keys: [
      "page.integrations.seo.title",
      "page.integrations.seo.description",
    ],
  },
  {
    id: "hero",
    title: "Заголовок страницы",
    description: "H1 и подзаголовок на /integrations",
    keys: ["page.integrations.title", "page.integrations.subtitle"],
  },
  {
    id: "services",
    title: "Карточки услуг",
    description:
      "Список на странице интеграций: заголовок, описание, ссылка (путь без языка)",
    keys: ["page.integrations.items"],
  },
];

/** Страница «Оборудование» `/[lang]/equipment` — только SEO и hero списка. */
export const EQUIPMENT_PAGE_ADMIN_SECTIONS: AdminSectionDef[] = [
  {
    id: "seo",
    title: "SEO страницы «Оборудование»",
    description: "Заголовок и описание в поиске",
    keys: ["page.equipment.seo.title", "page.equipment.seo.description"],
  },
  {
    id: "hero",
    title: "Заголовок страницы",
    description: "H1 и подзаголовок на /equipment",
    keys: ["page.equipment.title", "page.equipment.subtitle"],
  },
];
