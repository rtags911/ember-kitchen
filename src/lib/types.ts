// Shared, RN-safe types. No DOM or Next imports.

export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface MenuItem {
  id: string;
  name: string;
  /** One short line: what's in it. */
  text: string;
  /** Price in cents. */
  price: number;
  /** Dietary tags shown as small labels, e.g. "V", "VG", "GF". */
  tags?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  note?: string;
  photo: Photo;
  items: MenuItem[];
}

/** "HH:MM" 24h. */
export type Clock = `${number}:${number}`;
/** Index 0 = Sunday … 6 = Saturday; null = closed. */
export type WeekHours = ({ open: Clock; close: Clock } | null)[];

export interface Faq {
  q: string;
  a: string;
}

export interface SiteContent {
  name: string;
  tagline: string;
  headline: string;
  description: string;
  url: string;
  /** IANA zone the café's clock runs on; pickup slots are computed in it. */
  timeZone: string;
  address: { street: string; city: string; mapUrl: string };
  phone: string;
  email: string;
  hours: WeekHours;
  heroPhoto: Photo;
  visitPhoto: Photo;
  menu: MenuCategory[];
  steps: { title: string; text: string }[];
  faqs: Faq[];
}
