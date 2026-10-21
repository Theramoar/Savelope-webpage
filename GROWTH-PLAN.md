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

### App Store Connect — submitted with 2.1.11, in review

**Version 2.1.11 went to review on 2026-10-21 carrying the rename.** All three edits
turned out to be version-level metadata, so they ship together when 2.1.11 is
approved — nothing propagates before that. Re-checked after submission; the public
listing still shows the old values, which is exactly right for an app in review:

| Field | Public value (2.1.10) | Ships with 2.1.11 |
|---|---|---|
| App name | `Saving Money Challenge` | `Savelope: Saving Money Challenge` |
| Marketing URL (`sellerUrl`) | *none* | `https://savelopeapp.com/` |
| Privacy policy | `savelope.flycricket.io/privacy.html` | `https://savelopeapp.com/privacy/` |

- [~] Marketing URL, rename and privacy policy — **all in review with 2.1.11**
- [ ] **If the version is set to manual release, remember to release it** once
      approved. Approval alone changes nothing public.
- [ ] Once live, re-verify all three (ask me — it is one lookup call) and expect a
      few hours of CDN lag on the rendered store page even after the API updates.

When it lands, three things change at once: the store page starts linking to
`savelopeapp.com`, the privacy policy stops pointing at flycricket, and "Savelope"
becomes a distinctly recommendable token instead of a generic phrase. The
`alternateName` aliases already shipped on the site stay correct either way — they
list both the old and new store names.

### Webmaster tools — next up

DNS for `savelopeapp.com` is on **Cloudflare** (`rommy`/`veda` nameservers), with A
records pointed straight at GitHub Pages and no TXT records present. So the
verification record is a two-minute edit in the Cloudflare dashboard.

- [x] Google Search Console: `savelopeapp.com` added as a **Domain** property,
      verified 2026-10-21 via Cloudflare (`google-site-verification=u_NOGZ3p…`,
      confirmed resolving). **Do not delete that TXT record.**
- [x] Sitemap submitted 2026-10-21 as the **full URL** —
      `https://savelopeapp.com/sitemap-index.xml`. A Domain property prefills no
      domain, so a bare filename is rejected as "Недопустимый адрес".
      Shows "Не получено" — **expected before the first fetch, not a fault.**
      Verified independently: robots.txt allows Googlebot with no `Disallow`, and
      the file returns 200 `application/xml` to a Googlebot UA with no redirects.
      Do not resubmit; it resets the queue position.
- [ ] URL-Inspect `https://savelopeapp.com/` and request indexing to force a first
      crawl. Homepage only — the rest is reachable by links, and the daily request
      quota is small.
- [x] **Bing Webmaster Tools — verified 2026-10-21.** The outage cleared. The
      Search Console import does **not** work for a Domain property, so this was
      verified by the XML-file method instead: `public/BingSiteAuth.xml`, served
      from the site root. Keyword Research then supplied the Phase 2 figures.
      *Not* needed from there: an IndexNow key — see Phase 5.
- [x] **Sitemap submitted to Bing 2026-10-21** — `sitemap-index.xml`, status
      Success, crawled the same day, no errors or warnings.
- [x] **Six URLs submitted** under URL Submission at 18:54: home, hub, calculator,
      support, privacy, terms.
- [ ] **Submit `/savings-challenge-printables/` too.** It did not exist at 18:54,
      so it is the one page missing from that list. It *was* pushed to Bing by
      IndexNow when it deployed — a different surface from the manual list — but
      submitting it costs nothing against a 10,000/day quota.
- [ ] **Watch "Total URLs discovered" on the Sitemaps page.** It currently reads
      **1**, not 7. That is Bing counting the one child sitemap inside
      `sitemap-index.xml`; the seven page URLs live in `sitemap-0.xml`, which it
      has not walked through to yet. If it still reads 1 in a day or two, submit
      `https://savelopeapp.com/sitemap-0.xml` directly alongside the index.
- [ ] Check **AI Performance** (left nav, BETA) in a week or two. It reports how
      pages do on Copilot and Bing's AI answers, separately from ordinary search —
      which is the exact signal Phase 6 assumed was unobtainable without parsing
      crawler logs. Free, and already switched on.

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

- [~] Pull volumes for the candidates below
- [ ] Cut everything at zero; keep the best 8 (see Deviation in Phase 3)

### First data, 2026-10-21 — Bing Webmaster Tools

Verified via the XML-file method (`public/BingSiteAuth.xml`); the Search Console
import does not work for a Domain property. Figures are **Bing impressions over
three months** (21 Jul – 18 Oct 2026, all countries), not monthly search volume.

| Term | Impressions | Note |
|---|---|---|
| `savings challenges` (plural) | **371** | highest single term found |
| `100 envelope challenge` | **358** | US 256 · UK 17 · CA 17 · AU 11 |
| `saving challenge printable` | **307** | |
| `savings challenge printable free` | **278** | |
| `money saving challenge` | **263** | US 191 · IN 14 · UK 10 · CA 7 |
| `saving challenge` | 166 | |
| `savings challenge` | 46 | |
| `savings challenge app` | *no data* | below Bing's reporting threshold |
| `envelope savings challenge` | *no data* | below Bing's reporting threshold |

**Three findings that change the plan.**

1. **Printables are the biggest cluster found so far.** `saving challenge
   printable` and `savings challenge printable free` together total 585, ahead of
   `100 envelope challenge` at 358. The printable chart generator was parked in
   Phase 3 as "if Phase 2 shows demand". It has. It moves to the front.
2. **App-intent queries are too thin to measure.** Both `savings challenge app`
   and `envelope savings challenge` returned no data at all. That weakens the
   case for the listicles, which were pencilled in for Days 6–10 — people search
   for the *challenge* and for *printables*, not for apps to run it with.
3. **The plural outranks the singular 8 : 1** (371 vs 46). Worth preferring
   "savings challenges" in headings and titles where it reads naturally.

**Reading these numbers honestly.** Bing carries a small share of search, so
these are a relative ranking, not a forecast. The order between terms transfers
to Google reasonably well; the absolute figures do not, and multiplying them up
by a guessed share would be exactly the invented-volume problem this phase
exists to avoid. US share is ~72% on both measurable head terms, which supports
leaving localization in Phase 7.

### Twelve-month figures and the null results, 2026-10-21

Re-run over 21 Oct 2025 – 20 Oct 2026:

| Term | 12 months | 3 months | Earlier 9 months |
|---|---|---|---|
| `100 envelope challenge` | **703** (US 512 · UK 33 · CA 27) | 358 | 345 |
| `saving challenge printable` | **570** (US 439 · UK 10 · CA 8) | 307 | 263 |

**Everything else tested returned "not enough data"**: `100 envelope challenge
chart`, `50 envelope challenge`, `52 week savings challenge`,
`100 envelope challenge calculator`, `Qapital alternatives`,
`Goodbudget alternatives` — on top of `savings challenge app` and
`envelope savings challenge` from the first pass.

> **⚠ The null results need re-checking before they are trusted.**
> Later the same day, driving the tool directly, **every** lookup returned
> "Bing doesn't have enough data to show trend here" — including
> `100 envelope challenge`, which had returned 703 an hour earlier. The page
> also showed "Invalid request" and "This might be a momentary issue, please
> try again or check back later", so the tool was erroring rather than
> reporting absence.
>
> Later still, the whole of Bing Webmaster Tools returned its outage page
> again ("It's not you, it's us"), which is almost certainly what the keyword
> errors were the leading edge of.
>
> That means a "not enough data" response from this tool is **not** reliable
> evidence of no demand. The two positive figures stand — a number returned is
> a number measured — but every null above was collected in the same session
> and could be the same fault. Re-run each on a different day before treating
> any of them as settled. The decisions below were taken on this evidence and
> are provisional until that re-check happens.

**Correction to the seasonality guess.** The earlier note assumed a Jul–Oct
window caught an off-season trough before a January spike. The twelve-month data
says otherwise: the most recent quarter carries about half of each term's annual
total (119/month against 38/month earlier for the challenge term, 102 against 29
for printables). Both terms roughly tripled, and the twelve-month window includes
January 2026 with no visible spike. This is a rising trend, not a seasonal dip —
though a platform-wide change in Bing's traffic or reporting would look identical
from here, so do not treat the trebling as demand growth alone.

### What this means: build fewer pages, not eight

Phase 3 assumed Phase 2 would rank twenty-odd candidates so the best eight could
be picked. It has instead found a **two-term niche**: the challenge itself and
printables, plus the paraphrase cluster around them (`savings challenges` 371,
`money saving challenge` 263, `saving challenge` 166).

There is no measurable demand for the variant spokes, the alternatives pages or
the app listicles. Building eight pages against this evidence would manufacture
exactly the doorway pages Deviation 1 exists to prevent, and would dilute two
hub pages that are already live and good. **Three or four strong pages is what
the data supports.** The effort freed up belongs in Phase 4, which was always
the part that decides whether a model names us.

Note for honesty: `100 envelope challenge calculator` is below threshold too, so
the calculator page was not built on search demand. That was never its argument —
the plan's case was that a tool earns links an article does not. It stands or
falls on that, and should be judged on referring domains, not impressions.

### Still to pull

- [ ] The **Question keywords** tab for both head terms — the highest-value one
      left. Question phrasings are what an assistant matches against, and they
      feed FAQ blocks directly.
- [ ] **Download all** on the related-keywords lists, rather than the 5 rows shown.
- [ ] `best savings challenge apps` — still unchecked. The last term that could
      revive the listicle tranche.

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
>
> **Revised 2026-10-21, now that the data is in: three or four, not eight.**
> Phase 2 found measurable demand for two terms and nothing else. Eight pages
> against that evidence would be the doorway-page failure this deviation was
> written to avoid — just arrived at from the other direction. The gate did its
> job; the answer it gave was "fewer".

Hub and spoke, as an Astro content collection so adding posts stays cheap.

> **Note, 2026-10-21.** The hub was built as a plain `.astro` page, not a
> collection entry. It is one-off structured content — computed tables and a
> generated chart, not prose — and a collection would have fought it. Introduce
> the collection with the first listicle spokes, which *are* article-shaped and
> repetitive; that is where it pays for itself.

- [x] **`/100-envelope-challenge/` — the hub.** Done 2026-10-21, ahead of Phase 2
      as planned. Answer-first lede, the $5,050 arithmetic shown as 50 pairs of
      $101 plus the general rule n(n+1)/2, a five-row pacing table, totals for
      seven envelope counts from 25 to 200, a reverse table (goal → envelope
      count), the four orderings, a printable $1–$100 chart and eight FAQs.
      **Every figure derives from one `triangular()` helper in the frontmatter**,
      so the prose and the tables cannot drift apart. `Article` + `HowTo` +
      `FAQPage` + `BreadcrumbList`, with `datePublished`/`dateModified`. Linked
      from the header, the footer and the home page, and listed in `llms.txt`.
      Fully static — no JavaScript, so every AI crawler sees the whole thing.
- [~] **The free tools.** A calculator earns links articles don't.
      - [x] `/100-envelope-challenge-calculator/` — done 2026-10-21. Goal,
        envelope count and pace in; every envelope amount, the spread, the
        duration and a finish date out. The math lives in `src/lib/envelopes.ts`
        and is imported by **both** the server render and the browser script, so
        the page cannot show one set of numbers before hydration and another
        after. Amounts are computed in whole cents and the rounding remainder
        goes on the largest envelope, so any goal sums exactly — checked against
        $2,000/100, $777.77/37 and $10,000/200.
        The classic challenge renders in full as static HTML, including all 100
        amounts, so a crawler that runs no JavaScript still gets a complete page;
        only the finish date is client-side, deliberately, so no deployed page
        carries a date that went stale.
      - [x] **`/savings-challenge-printables/` — done 2026-10-21.** Phase 2
        showed the demand: `saving challenge printable` (307) and
        `savings challenge printable free` (278) total 585 impressions, ahead of
        `100 envelope challenge` (358). Printable charts for the classic 100, the
        50, the 52-week and a custom count, each printing on its own page. The
        hub already proves the mechanism — its chart prints clean, with
        everything else dropped by a `@media print` rule.
        Built with four charts: 100 envelope ($5,050), 50 envelope ($1,275),
        52 week ($1,378) and 26 week ($351), every total computed from
        `triangular()` rather than typed. Each chart has its own print button
        that prints that chart alone; printing the page gives all four, one per
        sheet. The buttons are progressive enhancement — without JavaScript the
        charts are all there and browser print still works. `Article` +
        `ItemList` + `FAQPage` + `BreadcrumbList`. "Free, no email, no download"
        is said plainly, because `savings challenge printable free` was 278 of
        the 585.
      - [ ] A "how long to save $X" planner. Mostly covered by the calculator
        already; revisit only if a spot-check shows separate demand.
- [ ] **The listicles — demoted 2026-10-21, pending a spot-check.** Honest ones
      that name MWM's app, Goodbudget and Qapital alongside Savelope. A listicle
      naming only us gets discounted by Google and by the models.
      **But `savings challenge app` and `envelope savings challenge` both came
      back below Bing's reporting threshold.** People search for the challenge
      and for printables, not for apps to run it with. Do not build these until
      `best savings challenge apps` has been checked directly — if it is also
      flat, the whole listicle tranche is a worse bet than more challenge-and-
      printable pages, and the eight slots should go elsewhere.
- [ ] **Alternatives pages and the variant spokes — cut 2026-10-21.**
      `Qapital alternatives`, `Goodbudget alternatives`, `50 envelope challenge`,
      `52 week savings challenge` and `100 envelope challenge chart` all came back
      below Bing's reporting threshold. The variants are already covered as
      sections of the hub, which is where they belong when nobody searches for
      them separately. Reinstate only if another volume source contradicts this.
      **Provisional:** this cut rests on null results the tool may have returned
      in error — see the warning in Phase 2. Re-check before treating it as
      final. Nothing is lost by the delay: the printables page comes first
      either way.

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

- [x] **`Organization` + `WebSite` schema with `sameAs`** — done 2026-10-21 in
      `src/schema.ts`, emitted on **every** page by `BaseLayout`, since a crawler
      may fetch one page and no other. `Organization.sameAs` points at the App
      Store listing, and `SoftwareApplication` gained
      `alternateName: ["Savelope — Daily Envelope Tracker", "Saving Money
      Challenge", "Savelope: Saving Money Challenge"]` plus its own `sameAs` and a
      `publisher` reference to the org. That alias list is the actual fix for
      finding #1: it names the string someone will really search the App Store for.
- [x] **IndexNow** — done 2026-10-21 in `.github/workflows/deploy.yml`. **No Bing
      account was needed:** an IndexNow key is any 8–128 hex characters you
      generate yourself, proven by hosting it at `/<key>.txt`. Key
      `4041eca60d21a66592aadd9d08ddab93`, file in `public/`. The step verifies the
      live key file matches before posting, reads the URL list from the sitemap,
      and is `continue-on-error` so a ping failure never fails a good deploy.
      Reaches Bing, Yandex, Seznam and Naver — not Google.
      **Confirmed working 2026-10-21:** a manual POST of all four sitemap URLs
      returned `HTTP 200` (key validated; `202` would have meant validation still
      pending). `api.indexnow.org` answered while Bing Webmaster Tools itself was
      down, so that outage was the frontend, not the indexing side.
- [~] `BreadcrumbList`, `datePublished`, `dateModified` on the Phase 3 pages. Done
      on the hub; repeat it on each new page as it is written. Dates
      disproportionately help on AI surfaces, which lean on freshness.
- [x] `src/pages/404.astro` — done 2026-10-21. `noindex, follow`, excluded from
      the sitemap, links to all four real pages.
- [ ] **[you]** Tick **Enforce HTTPS** in the repo's Settings → Pages. `http://`
      currently serves 200 rather than redirecting; the canonical tag covers the
      SEO risk, so this is hygiene, not urgent.

**Explicitly not doing:** title-tag CTR tuning and SERP-snippet copywriting (models
don't click), keyword-density tooling, link-building packages, performance work.

---

## Phase 6 — measurement · **[agent]** + **[you]** · ~20 min

- [ ] Cloudflare free tier in front of GitHub Pages. DNS is **already on
      Cloudflare**, but the records are DNS-only — responses still carry
      `server: GitHub.com` and no `cf-ray`, so nothing is proxied and nothing is
      logged. This is one toggle per record, not a migration.
      **Pages logs nothing**, so
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
