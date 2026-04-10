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
    title: "Три колонки (цифры)",
    description: "Оборудование / Hoteza / Интеграции",
    keys: [
      "home.stats.equipmentTitle",
      "home.stats.equipmentCount",
      "home.stats.equipmentDesc",
      "home.stats.hotezaTitle",
      "home.stats.hotezaCount",
      "home.stats.hotezaDesc",
      "home.stats.integrationTitle",
      "home.stats.integrationCount",
      "home.stats.integrationDesc",
    ],
  },
  {
    id: "spotlight",
    title: "Крупные ссылки под цифрами",
    description:
      "Две заметные карточки-ссылки (оборудование / интеграции)",
    keys: ["home.spotlight.items"],
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
    description: "Заголовки и список названий брендов",
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
