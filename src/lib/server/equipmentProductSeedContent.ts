import type { EquipmentProductImage } from "@/types/site";
import { serializeEquipmentProductImages } from "@/lib/equipmentProductUtils";
import type { EquipmentSpecItem } from "@/types/site";

const TILDA = "https://static.tildacdn.com";

const GAUDI_IMAGES: EquipmentProductImage[] = [
  {
    imageUrl: `${TILDA}/tild6165-3139-4662-b863-613765643262/smarteq-main.jpg`,
    alt: "Omnitec GAUDI FIT-IN",
  },
  {
    imageUrl: `${TILDA}/tild3535-3830-4533-b539-373061386432/01.jpg`,
  },
  {
    imageUrl: `${TILDA}/tild3130-3566-4634-a361-336639386264/02.jpg`,
  },
  {
    imageUrl: `${TILDA}/tild3035-3432-4233-b766-303664376665/3.jpg`,
  },
];

const GAUDI_SPECS_EN: EquipmentSpecItem[] = [
  {
    title: "Memory",
    desc: "Stores the last 400 events including user, date and time of each opening.",
  },
  {
    title: "Access control",
    desc: "Multiple access levels help prevent unauthorized check-ins.",
  },
  {
    title: "Portable programmer",
    desc: "Configure locks and read audit logs in the field.",
  },
  {
    title: "Integration",
    desc: "Works with major PMS platforms: TravelLine, Opera, Fidelio, Logus, 1C and others.",
  },
];

const GAUDI_SPECS_RU: EquipmentSpecItem[] = [
  {
    title: "Память",
    desc: "Сохраняет информацию о последних 400 событиях, включая пользователя, дату и время открытия.",
  },
  {
    title: "Контроль доступа",
    desc: "Различные уровни доступа для разных категорий пользователей.",
  },
  {
    title: "Портативный программатор",
    desc: "Конфигурирование замков и считывание журнала регистрации.",
  },
  {
    title: "Интеграция",
    desc: "Интеграция с TravelLine, Opera, Fidelio, Logus, 1C, Shelter и другими системами.",
  },
];

type Lang = "en" | "ru";

interface ProductSeed {
  categorySlug: string;
  productSlug: string;
  en: Record<string, string>;
  ru: Record<string, string>;
}

const PRODUCT_SEEDS: ProductSeed[] = [
  {
    categorySlug: "electronic-locks",
    productSlug: "omnitec-gaudi-fit-in",
    en: {
      title: "Omnitec GAUDI FIT-IN",
      subtitle:
        "Surface-mounted lock for easy upgrades of existing door hardware.",
      images: serializeEquipmentProductImages(GAUDI_IMAGES),
      highlights: JSON.stringify([
        "Compatible with most mortise locks and latches",
        "4× AA batteries — up to 20,000 cycles (3–4 years)",
        "MIFARE 13.56 MHz open-standard cards",
        "Indoor-side batteries; outdoor doors possible — ask our team",
        "Optional BLE smartphone opening",
        "Optional PIN code opening",
      ]),
      bodyHtml:
        "<h2>Electronic locks Omnitec</h2><p>Surface-mounted lock that lets you modernize an existing locking system without replacing the entire door.</p>",
      specsTitle: "Technical specifications",
      specs: JSON.stringify(GAUDI_SPECS_EN),
      orderLabel: "Order",
      orderHref: "contacts",
      ctaLabel: "Request a quote",
      ctaHref: "contacts",
      pdfLabel: "↓ Omnitec hotel lock catalog [pdf]",
      pdfHref: "",
      "seo.title": "Omnitec GAUDI FIT-IN — Datacom",
      "seo.description":
        "Surface-mounted electronic hotel lock Omnitec GAUDI FIT-IN — MIFARE, BLE, PMS integration.",
    },
    ru: {
      title: "Omnitec GAUDI FIT-IN",
      subtitle:
        "Замок-накладка, позволяющий легко обновить замковую систему.",
      images: serializeEquipmentProductImages(GAUDI_IMAGES),
      highlights: JSON.stringify([
        "Совместимы с большинством врезных замков и защелок",
        "Стандартные батарейки 4× AA (LR04). Срок службы: 20 000 операций (3–4 года)",
        "Карты открытого стандарта MIFARE 13,56 МГц",
        "Батарейки с внутренней стороны; допускается использование на уличные двери*",
        "Опция: открытие с помощью мобильного телефона (BLE)",
        "Опция: открытие с помощью кода",
      ]),
      bodyHtml:
        "<h2>Электронные замки Omnitec</h2><p>Замок-накладка для обновления существующей системы без замены всей двери.</p>",
      specsTitle: "Технические характеристики",
      specs: JSON.stringify(GAUDI_SPECS_RU),
      orderLabel: "Заказать",
      orderHref: "contacts",
      ctaLabel: "Запросить стоимость",
      ctaHref: "contacts",
      pdfLabel: "↓ Каталог замков для гостиниц Omnitec [pdf]",
      pdfHref: "",
      "seo.title": "Omnitec GAUDI FIT-IN — Datacom",
      "seo.description":
        "Электронный замок-накладка Omnitec GAUDI FIT-IN для гостиниц — MIFARE, BLE, интеграция с PMS.",
    },
  },
];

/** Flat `ContentEntry`-style map keys per language for product detail pages. */
export function equipmentProductSeedEntriesForLang(
  lang: Lang
): Record<string, { key: string; value: string; type: "text" | "json" }> {
  const out: Record<string, { key: string; value: string; type: "text" | "json" }> =
    {};
  const pick = lang === "ru" ? "ru" : "en";

  for (const seed of PRODUCT_SEEDS) {
    const fields = pick === "ru" ? seed.ru : seed.en;
    for (const [field, value] of Object.entries(fields)) {
      const key = `equipment.product.${seed.categorySlug}.${seed.productSlug}.${field}`;
      const type =
        field === "images" || field === "highlights" || field === "specs"
          ? "json"
          : "text";
      out[key] = { key, value, type };
    }
  }
  return out;
}

export const EQUIPMENT_PRODUCT_ROUTE_SEEDS = PRODUCT_SEEDS.map((s) => ({
  categorySlug: s.categorySlug,
  productSlug: s.productSlug,
}));
