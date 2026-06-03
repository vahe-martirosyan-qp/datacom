export interface NavItem {
  label: string;
  href: string;
  /** Short line on /equipment category cards */
  desc?: string;
  /** Category image on /equipment (and optional nav use) */
  imageUrl?: string;
}

/** Top-level nav entry; optional `children` powers the desktop mega-menu. */
export interface NavMegaItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface NavMegaMenuDocument {
  items: NavMegaItem[];
}

export interface FeatureCard {
  title: string;
  desc: string;
}

/** Large promo link cards under the stats row. */
export interface SpotlightCard {
  title: string;
  desc: string;
  href: string;
  /** Optional illustration (e.g. integrations hub cards). */
  imageUrl?: string;
}

export interface BlogTeaserPost {
  title: string;
  href: string;
  /** Optional line, e.g. date or category */
  meta?: string;
  /** Cover image for list cards */
  imageUrl?: string;
}

/** Homepage project teaser card (image + title + location). */
export interface ProjectCardItem {
  title: string;
  location: string;
  imageUrl: string;
  /** Optional link; whole card is clickable when set */
  href?: string;
}

export interface StepItem {
  title: string;
  desc: string;
}

/** Client logo in the «Trusted by» block (`home.clients.brands`). */
export interface ClientLogoItem {
  /** Stable id for admin reorder (optional in stored JSON). */
  id?: string;
  imageUrl: string;
  alt?: string;
}

export interface FooterColumn {
  title: string;
  links: NavItem[];
}

/** Stat card on the company page (`page.company.stats`). */
export interface CompanyStatItem {
  value: string;
  label: string;
}

/** Office block on the contacts page (`page.contacts.offices`). */
export interface ContactOfficeItem {
  title: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  mapLabel?: string;
  mapHref?: string;
}

/** Spec row on equipment category pages (`equipment.{slug}.specs`). */
export interface EquipmentSpecItem {
  title: string;
  desc: string;
}

/** Sub-block under a feature section title (`equipment.{slug}.featureSections`). */
export interface EquipmentFeatureGroup {
  subtitle: string;
  /** Lines shown with «+» (chip style). */
  chips: string[];
  /** Plain lines below chips (no «+»). */
  lines: string[];
}

/** Mid-page block with H2 + grouped chips (`equipment.{slug}.featureSections`). */
export interface EquipmentFeatureSection {
  title: string;
  /** Illustration beside the points (right column on desktop). */
  imageUrl?: string;
  groups: EquipmentFeatureGroup[];
}

/** Gallery image on equipment product pages (`equipment.product.*.*.images`). */
export interface EquipmentProductImage {
  imageUrl: string;
  alt?: string;
}

/** Product / solution card on equipment category pages (`equipment.{slug}.products`). */
export interface EquipmentProductItem {
  title: string;
  desc?: string;
  imageUrl: string;
  /** URL segment for `/equipment/{category}/{slug}` when set. */
  slug?: string;
  href?: string;
}
