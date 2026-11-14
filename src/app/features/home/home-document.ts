export interface HomeStat {
  value: string;
  label: string;
}

export const HOME_STATS: readonly HomeStat[] = [
  { value: '3,100+', label: 'Attendees' },
  { value: '22,000+', label: 'Check-ins' },
  { value: '1', label: 'Church' },
];

export const HOME_TITLE = 'Attendify - Attendance Simplified';

export const HOME_DESCRIPTION =
  'Attendify is how Life Transform Harvest Ministry International checks people in on Sundays and sees who came. I built it in 2024 and rebuilt it in 2025, because you always build it better the second time around.';

export const HOME_CANONICAL_URL = 'https://attendify.acethekawaii.com/';

export const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Attendify',
  url: HOME_CANONICAL_URL,
  description: HOME_DESCRIPTION,
  creator: {
    '@type': 'Person',
    name: 'Ace Gabriel Pasiliao',
    url: 'https://acethekawaii.com',
  },
} as const;

const HOME_HEAD_ATTR = 'data-home-head';

export function syncHomeHead(document: Document, isHome: boolean): void {
  document.head.querySelectorAll(`[${HOME_HEAD_ATTR}]`).forEach((node) => node.remove());
  if (!isHome) {
    return;
  }

  document.title = HOME_TITLE;
  upsertMeta(document, 'name', 'description', HOME_DESCRIPTION);
  upsertMeta(document, 'property', 'og:title', HOME_TITLE);
  upsertMeta(document, 'property', 'og:description', HOME_DESCRIPTION);
  upsertMeta(document, 'property', 'og:url', HOME_CANONICAL_URL);
  upsertMeta(document, 'property', 'og:type', 'website');
  upsertCanonical(document);
  upsertJsonLd(document);
}

function upsertMeta(
  document: Document,
  attribute: 'name' | 'property',
  key: string,
  content: string,
): void {
  const meta = document.createElement('meta');
  meta.setAttribute(HOME_HEAD_ATTR, '');
  meta.setAttribute(attribute, key);
  meta.setAttribute('content', content);
  document.head.appendChild(meta);
}

function upsertCanonical(document: Document): void {
  const link = document.createElement('link');
  link.setAttribute(HOME_HEAD_ATTR, '');
  link.setAttribute('rel', 'canonical');
  link.setAttribute('href', HOME_CANONICAL_URL);
  document.head.appendChild(link);
}

function upsertJsonLd(document: Document): void {
  const script = document.createElement('script');
  script.setAttribute(HOME_HEAD_ATTR, '');
  script.id = 'home-jsonld';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(HOME_JSON_LD);
  document.head.appendChild(script);
}
