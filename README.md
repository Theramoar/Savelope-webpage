# Savelope — website

Marketing site and legal pages for [Savelope](https://apps.apple.com/app/id1578843165),
the envelope savings challenge app for iOS.

Live at **https://theramoar.github.io/Savelope-webpage/**

## Stack

Astro (static output), no UI framework, hand-written CSS. No build-time data fetching —
everything renders to plain HTML.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321/Savelope-webpage/
npm run build    # outputs to dist/
npm run preview  # serve the built site
```

Note the `/Savelope-webpage/` path — the site is configured for project-path hosting on
GitHub Pages, so the dev server serves it under the base path too.

## Structure

```
src/
  pages/        index, privacy, support, terms
  layouts/      BaseLayout — <head>, meta, header + footer
  components/   SiteHeader, SiteFooter, AppStoreButton, Phone
  styles/       global.css — design tokens and shared classes
  assets/       screenshots (optimized by Astro at build time)
  config.ts     app facts: App Store ID, support email, rating
public/
  images/icons/ the six app icons, lifted from the Xcode asset catalog
```

### Where the content came from

Copy, features and pricing were taken from the app itself (the `Envelopes` Xcode project)
rather than from the App Store listing, which is older and less specific. The screenshots
were captured from the iOS Simulator with the device region set to `en_US`, so amounts
read in dollars.

### Editing gotcha

Astro collapses the newline between text and an inline element, so this renders with no
space before the link:

```astro
<!-- wrong: "governed byApple's privacy policy" -->
It is governed by
<a href="...">Apple's privacy policy</a>.
```

Put `{' '}` at the end of the preceding line, as the existing pages do.

## Images

Screenshots live in `src/assets/`, not `public/`, so Astro runs them through sharp and
emits AVIF/WebP with PNG fallbacks at 1× and 2×. Dropping a new screenshot in and
importing it is all that's needed. Files in `public/` are served as-is with no processing.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
`withastro/action` and publishes to GitHub Pages. Pages must be set to
**Settings → Pages → Source: GitHub Actions**.

### Moving to a custom domain

1. In `astro.config.mjs`, set `site` to the domain and delete the `base` line.
2. Add a `public/CNAME` file containing the bare domain.
3. Point DNS at GitHub Pages and set the domain under Settings → Pages.

## Legal pages

`privacy`, `terms` and `support` are written to match what the app actually does —
including the SDKs it ships (Firebase, TelemetryDeck, RevenueCat, CloudKit, Unsplash).
They have **not** been reviewed by a lawyer. Review before pointing the App Store
privacy URL here.
