export interface NavItem {
  label: string;
  href: string;
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
}

export interface BlogTeaserPost {
  title: string;
  href: string;
  /** Optional line, e.g. date or category */
  meta?: string;
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

export interface FooterColumn {
  title: string;
  links: NavItem[];
}
