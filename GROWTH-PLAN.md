# Savelope growth plan

Goal: **be named when someone asks ChatGPT, Claude or Gemini for a savings-challenge
app.** Google traffic is a slower second prize.

Strategy adapted from a founder-marketing video on building app websites for AI
discoverability, with two deliberate deviations, noted inline as **Deviation**.

Owner key: **[you]** needs an account or login I don't have · **[agent]** I can do it

---

## Current state

Live at https://savelopeapp.com (Astro → GitHub Pages, deploys from `main`).
Four pages: home, support, privacy, terms.

Done as of 2026-10-20 (commit `6e09f91`):

- [x] `@astrojs/sitemap` → `/sitemap-index.xml`, referenced from robots.txt
- [x] `public/robots.txt` — explicit allowlist for OpenAI, Anthropic, Perplexity,
      Google-Extended, Applebot-Extended and others, grouped by whether the token
      governs training, search indexing or user-triggered fetches
- [x] JSON-LD via a `jsonLd` prop on `BaseLayout`: `SoftwareApplication` +
      `FAQPage` on home, `FAQPage` on support
- [x] `public/llms.txt`
- [x] Verified live: all files 200, all three JSON-LD blocks parse

Technical SEO baseline is already passed — single H1, clean H2/H3 nesting, 5.2 KB
gzipped HTML, 0.26 s TTFB, no client JS framework. **There is nothing to win from
performance work on this site.**

---

## Findings that change the order of work

Checked against the real App Store listing (id `1578843165`):

| | |
|---|---|
| App Store name | Saving Money Challenge |
| Subtitle | Daily Envelope Tracker |
| Seller | Mihail Kuznecovs |
| Rating | 4.8 / 442 (matches `src/config.ts`) |
| Marketing URL | **none** |
| Privacy policy | `savelope.flycricket.io/privacy.html` — not our own domain |
| Languages | English only |

1. **The store name and the brand name are different.** The site says "Savelope";
   the store says "Saving Money Challenge". A model that recommends "Savelope" may
   send someone to an App Store search that doesn't resolve. And "Saving Money
   Challenge" is a generic phrase — it cannot be *distinctly* recommended the way
   "YNAB" or "Qapital" can. Good ASO, bad for this channel.
2. **No marketing URL at all**, so the store page doesn't link to the site.
3. **Privacy policy points at flycricket**, wasting a link that could point home.
4. **Direct competitor:** MWM's "100 Envelope Challenge" (id `6779838041`) — free,
   no bank linking, widgets and streaks. This is the "X alternatives" target.
5. **No AlternativeTo listing** for us, though Qapital and Digit have pages.

---

## Phase 1 — fix the store ↔ site disconnect · **[you]** · ~30 min

Everything downstream leaks value until this is done. Start here.

- [ ] Add marketing URL `https://savelopeapp.com/` in App Store Connect
- [ ] Rename the app to keep the keywords *and* gain a distinctive brand token.
      Recommended: `Savelope: Saving Money Challenge`. Renaming is free and does
      not reset reviews.
- [ ] Repoint the privacy policy to `https://savelopeapp.com/privacy/`
- [ ] Google Search Console: add `savelopeapp.com` as a **Domain** property (DNS
      TXT), submit `/sitemap-index.xml`, then URL-Inspect the homepage to force a
      first crawl
- [ ] Bing Webmaster Tools: import from Search Console, submit the same sitemap

---

## Phase 2 — keyword research with real volumes · **[you]** + **[agent]** · ~1 hr

**I have no search-volume API.** I can generate and rank candidates and sanity-check
demand from search results, but I would be *estimating* volume — and estimates are
how you end up with pages nobody searches for. The video's author gates every page
on real volume via DataForSEO; that gate is what makes the tactic work.

Cheapest route: **Bing Webmaster Tools keyword research is free and gives real
volumes**, and Phase 1 already has you creating that account. Google Keyword Planner
is free with an Ads account. DataForSEO is pay-as-you-go if you'd rather I query it
directly.

- [ ] Pull volumes for the candidates below
- [ ] Cut everything at zero; keep the best 8 (see Deviation in Phase 3)

### Candidates

**Challenge mechanics** — highest intent, thinnest competition
`100 envelope challenge` · `100 envelope challenge chart` (printable) ·
`100 envelope challenge app` · `how much is the 100 envelope challenge` ·
`50 envelope challenge` · `biweekly envelope challenge` ·
`100 envelope challenge weekly` · `52 week savings challenge` ·
`$1,000 savings challenge` · `$5,000 savings challenge`

**Listicles** — the format models lift from most
`best savings challenge apps` · `best 100 envelope challenge apps` ·
`best savings apps that don't link your bank` · `best free savings challenge apps` ·
`best savings apps for couples`

**Alternatives**
`100 Envelope Challenge alternatives` (MWM) · `Qapital alternatives` ·
`Goodbudget alternatives` · `Digit alternatives`

**Free tools** — linkable, and cited as useful rather than promotional
100 envelope challenge calculator · printable chart generator ·
"how long to save $X" planner

---

## Phase 3 — build the content · **[agent]** · ~2 weeks

> **Deviation 1 — eight substantial pages, not twenty thin ones.**
> Twenty pages in fourteen days is how you get doorway pages. Google's
> helpful-content systems demote them and LLM retrieval ignores them; worse, a page
> that restates the hub with one keyword swapped dilutes the hub that was working.
> Let Phase 2's volume data pick the eight.

Hub and spoke, as an Astro content collection so adding posts stays cheap.

- [ ] **Days 1–2 · `/100-envelope-challenge/` — the hub.** Definitive: the $5,050
      arithmetic (the sum of 1…100), every variant, a printable chart. The single
      page most likely to be retrieved. Does not depend on Phase 2 to be worth
      writing.
- [ ] **Days 3–5 · the free tools.** A calculator earns links articles don't.
- [ ] **Days 6–10 · the listicles.** Honest ones that name MWM's app, Goodbudget
      and Qapital alongside Savelope. A listicle naming only us gets discounted by
      Google and by the models.
- [ ] **Days 11–14 · alternatives pages and the variant spokes.**

### Implementation constraints

- **Most AI crawlers do not execute JavaScript** (Googlebot does). Every calculator
  must render its explanatory content and a worked example as static HTML, with JS
  only for the interactive math. An empty `<div>` until hydration is invisible to
  every crawler that matters here.
- `Article` + `HowTo` or `ItemList` JSON-LD on each page, through the existing
  `jsonLd` prop on `BaseLayout`.
- Internal links back to the hub from every spoke.
- Short declarative sentences carrying hard numbers — that is what gets quoted.

---

## Phase 4 — off-site corroboration · **[you]** · ongoing

The part that actually decides whether a model names us: recommendations follow what
several independent sources agree on, and one self-published site is weak evidence.
Unlinked mentions count here even though they do nothing for PageRank.

- [ ] AlternativeTo: submit Savelope, position against Qapital / Digit / Goodbudget
- [ ] Product Hunt: one launch, permanently indexed page
- [ ] Reddit: r/personalfinance, r/Frugal, r/povertyfinance — genuine participation
      only; astroturfing gets caught and poisons the brand
- [ ] Pitch "best savings challenge apps" roundup writers. Being in three of those
      beats any amount of on-site tuning.

---

## Phase 5 — SEO additions worth making · **[agent]** · ~1 hr

> **Deviation 2 — SEO is not a separate phase.** Phase 0 was SEO; Phase 3 is SEO.
> The overlap with AI discoverability is ~85%. Only these diverge enough to be
> worth listing separately.

- [ ] **`Organization` + `WebSite` schema with `sameAs`** pointing at the App Store
      URL. Highest-value item here, ~20 lines. It machine-asserts that "Savelope"
      and "Saving Money Challenge" are one entity — finding #1, fixed declaratively
      instead of hoping a model infers it.
- [ ] **IndexNow**, wired into `.github/workflows/deploy.yml` so every deploy pings
      Bing. On a new domain this is days instead of weeks to first crawl.
- [ ] `BreadcrumbList`, `datePublished`, `dateModified` on the Phase 3 pages. Dates
      disproportionately help on AI surfaces, which lean on freshness.
- [ ] `src/pages/404.astro` — GitHub Pages currently serves its generic one.

**Explicitly not doing:** title-tag CTR tuning and SERP-snippet copywriting (models
don't click), keyword-density tooling, link-building packages, performance work.

---

## Phase 6 — measurement · **[agent]** + **[you]** · ~20 min

- [ ] Cloudflare free tier in front of GitHub Pages. **Pages logs nothing**, so
      right now there is no way to tell whether `OAI-SearchBot` or
      `Claude-SearchBot` has ever fetched us — the one signal that says this worked.
- [ ] Weekly: Search Console impressions, and crawler hits by user agent

---

## Phase 7 — compound it · later

- [ ] Reusable skill holding where assets and copy live, once this works for one app
- [ ] Localization. English-only today; each added language is another localized
      marketing URL and another backlink. The `vibe-aso` skill covers this pipeline
      — but not until the English site is pulling traffic.

---

## Expectations

Google is slow and stingy with a new domain; ChatGPT traffic should appear first.
Nothing here moves revenue this week. It compounds monthly, and the whole of Phase 1
is half an hour of work that everything else depends on.
