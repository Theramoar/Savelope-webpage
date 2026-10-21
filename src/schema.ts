import { SITE } from './config';

/**
 * Stable @id values for the site-wide entities, so any page can point at them
 * instead of restating them.
 */
export function schemaIds(site: URL | undefined) {
  const home = new URL('/', site).href;
  return { home, org: `${home}#org`, website: `${home}#website` };
}

/**
 * The site-wide entity graph, emitted on every page by BaseLayout.
 *
 * The App Store lists the app as "Saving Money Challenge" while the brand and
 * this site are "Savelope". A model has no reason to connect the two on its own,
 * and a recommendation for "Savelope" that lands on a store search for a name
 * that doesn't exist is a dead end. `sameAs` on the organisation and
 * `alternateName` on the app state the identity outright rather than leaving it
 * to be inferred.
 */
export function siteSchemas(site: URL | undefined) {
  const ids = schemaIds(site);

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ids.org,
    name: SITE.name,
    url: ids.home,
    email: SITE.supportEmail,
    description:
      'Maker of Savelope, an iOS savings-challenge tracker built around the 100 envelope challenge.',
    logo: {
      '@type': 'ImageObject',
      url: new URL('/images/icons/icon-default.png', site).href,
    },
    sameAs: [SITE.appStoreUrl],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': ids.website,
    name: SITE.name,
    alternateName: `${SITE.name} — ${SITE.tagline}`,
    url: ids.home,
    inLanguage: 'en',
    publisher: { '@id': ids.org },
  };

  return [organization, website];
}
