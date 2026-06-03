/** Seed CMS keys for `/[lang]/company` (`page.company.*`). */

export const COMPANY_HERO_IMAGE_URL =
  "https://static.tildacdn.com/tild6165-3139-4662-b863-613765643262/smarteq-main.jpg";

/**
 * Default copy for a fresh install / empty DB only.
 * After the first save from admin, values live in the CMS store (`page.company.*`)
 * and this file is not read again for those keys.
 */
export const COMPANY_BODY_HTML_EN =
  "<p>For over 15 years we have been a hotel IT systems integrator and television supplier. We specialize in room automation, interactive TV, PBX, electronic locks, safes, minibars, TVs and professional panels.</p><p>We design, supply, install and support turnkey in-room technology for hotels across Russia — from boutique properties to large chains.</p><p>Our team has deep experience outfitting hotel rooms. We value our reputation and work with full responsibility to meet our clients’ expectations.</p>";

export const COMPANY_BODY_HTML_RU =
  "<p>Компания уже более 15 лет является интегратором гостиничных IT-систем и телевидения, а также поставщиком оборудования для гостиниц. Мы специализируемся на технологичных решениях для гостиничного бизнеса: автоматизация номеров, интерактивное телевидение, АТС, электронные замки, сейфы, минибары, телевизоры и профессиональные панели.</p><p>Мы проектируем, поставляем, монтируем и сопровождаем комплексные решения для номерного фонда отелей по всей России — от бутик-отелей до крупных сетей.</p><p>Команда — это квалифицированные специалисты с большим опытом оснащения гостиничных номеров. Мы дорожим репутацией и с полной ответственностью стремимся удовлетворить любые пожелания клиентов.</p>";

export const COMPANY_STATS_EN = JSON.stringify([
  { value: "1000+", label: "properties across Russia" },
  { value: "15 years", label: "successful work in hospitality" },
  { value: "95%", label: "satisfied guests" },
  { value: "98 000+", label: "rooms delivered" },
]);

export const COMPANY_STATS_RU = JSON.stringify([
  { value: "1000+", label: "объектов по всей России" },
  { value: "15 лет", label: "успешной работы на рынке гостеприимства" },
  { value: "95%", label: "довольных гостей" },
  { value: "98 000+", label: "реализованный номерной фонд" },
]);
