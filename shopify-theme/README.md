# Zelvox — Shopify Online Store 2.0 Theme

A premium gadget / electronics storefront theme for **Shopify Online Store 2.0**.

Clean white surfaces (`#FFFFFF` / `#F7F6FA`) with a violet accent system
(`#7545E8` primary, `#A478FF` secondary), `#242033` ink, and restrained glass
and gradient effects on a fully responsive, accessible layout.

---

## Live preview

**http://127.0.0.1:8412/**

The theme is verified against a local Liquid render harness that emulates
Shopify's routing and Ajax endpoints.

| | |
| --- | --- |
| Theme source | `C:\Users\Administrator\Downloads\Shopify Store\shopify-theme` |
| Harness | `C:\Users\Administrator\AppData\Local\Temp\opencode\zelvox-verify` |
| Preview output | `<harness>\preview` |

### Start / restart the preview

```powershell
$h = "C:\Users\Administrator\AppData\Local\Temp\opencode\zelvox-verify"
$t = "C:\Users\Administrator\Downloads\Shopify Store\shopify-theme"

Push-Location $h
node render-preview.js $t      # re-render every page into preview/
node serve.js                  # Shopify-style routing on :8412
```

`serve.js` resolves `/collections/<handle>`, `/collections/<handle>/<tag>`,
`/products/<handle>`, `/pages/<handle>` and the account routes exactly as
Shopify does, and stubs `/cart.js`, `/cart/add.js`, `/cart/change.js` and
`/cart/clear.js` in memory.

### Page map

| URL | Template |
| --- | --- |
| `/` | `index` |
| `/collections/all`, `/collections/<handle>` | `collection` |
| `/collections/<handle>/<tag>` | `collection` + tag filter (60 variants rendered) |
| `/products/<handle>` | `product` |
| `/search?q=…` | `search` |
| `/cart` | `cart` |
| `/pages/wishlist` | `page.wishlist` |
| `/pages/about-us`, `/pages/contact-us`, `/pages/faqs` | dedicated page templates |
| `/pages/shipping`, `/pages/returns` | `page` (rich text) |
| `/account`, `/account/login`, `/account/register` | `customers/*` |
| `/checkout` | local stand-in for Shopify checkout |
| `/404` | `404` |
| `/responsive.html` | 390 / 820 / 1280 px iframes for layout QA |

---

## What's included

| Path | Contents |
| --- | --- |
| `layout/theme.liquid` | Fonts, design tokens, cart drawer, quick-view modal, SEO/OG/Twitter meta, money & i18n globals |
| `layout/password.liquid` | Password-page layout |
| `sections/` | `announcement-bar`, `header`, `footer`, `hero-carousel`, `shop-by-category`, `featured-collection`, `promo-banner`, `value-props`, `newsletter`, `main-product`, `main-collection`, `main-cart`, `main-search`, `main-page`, `main-404`, `main-about`, `main-faqs`, `main-contact`, `main-wishlist` |
| `snippets/` | `icon`, `nav-links`, `product-card`, `collection-card`, `price`, `quick-add`, `wishlist-btn`, `variant-picker`, `stock-status`, `cart-drawer`, `quick-view-modal`, `section-head`, `pagination`, `account-nav`, `hero-device-svg`, `hero-device-stage`, `theme-tokens` |
| `templates/` | JSON: `index`, `product`, `collection`, `cart`, `search`, `page`, `page.about-us`, `page.contact-us`, `page.faqs`, `page.wishlist`, `404`. Liquid: `gift_card`, `password`, and 7 `customers/*` templates (login, register, account, order, addresses, reset_password, activate_account) |
| `config/` | `settings_schema.json`, `settings_data.json` |
| `assets/` | `base.css` (design system + components), `theme.js` (vanilla JS, no dependencies) |
| `locales/` | `en.default.json` |

### Homepage section order

1. Announcement bar
2. Header (sticky nav)
3. Hero carousel — 4 slides, floating 3D gadget stage
4. Shop by Category
5. New Arrivals (`featured-collection`)
6. Bestsellers (`featured-collection`)
7. Promo banner
8. Why Shop With Us (`value-props`)
9. Newsletter
10. Footer

---

## Header & navigation

### Brand placement

`Zelvox` sits at the **top-left** at every breakpoint. It is the first grid
column on desktop and stays left-aligned on mobile — the mobile rule is
`justify-self: start`, not `center`.

### Desktop

Full nav with hover/focus dropdowns for parent items. Search, account,
wishlist and cart actions on the right.

### Mobile drawer

Opened by the burger below 990px. Grouped so it is never a bare link list:

| Group | Contents |
| --- | --- |
| **Categories** | Home, Shop All (+ New Arrivals / Bestsellers submenu), Smartphones, Audio, Smart Devices, Gaming, Accessories |
| **Information** | About Zelvox, FAQs, Contact us, Shipping & delivery, Returns & warranty, Search |
| **Your account** | Account, Wishlist, Cart (with live count) |

The Information group uses the merchant's `secondary_menu` link list (header
setting, defaults to `footer`) when one is chosen, and falls back to the
built-in pages when it is empty — so the drawer is populated on a brand-new
store before any menus are configured.

> **Architecture note — the drawer must stay outside `<header>`.**
>
> `.site-header` uses `backdrop-filter: blur(16px) saturate(1.6)`. An element
> with a `backdrop-filter` becomes the containing block for its
> `position: fixed` descendants. `.mobile-nav` is `position: fixed; inset: 0`,
> so nesting it inside `<header>` made `inset: 0` resolve to the header's own
> ~73px box instead of the viewport — collapsing the menu to zero height and
> rendering an empty-looking drawer. `sections/header.liquid` therefore closes
> `</header>` *before* the drawer and emits it as a sibling.
>
> Keep it that way. Moving the drawer back inside the header will silently
> re-break it at every width.

Focus is trapped in the panel, `aria-expanded` is set on the trigger,
`Escape` closes it, and body scroll locks while open.

> **Architecture note — the nav track must be allowed to shrink.**
>
> `.site-header__inner` is a `grid-template-columns: auto 1fr auto` bar. A grid
> item's automatic minimum size is its min-content, so the middle track holding
> the desktop menu could not shrink below ~769px. In the band where the desktop
> nav is still shown but the container is narrower than that (roughly
> 990–1150px of window width), the actions column was pushed past the viewport
> and the whole page scrolled sideways by ~36px.
>
> `.site-header__nav { min-width: 0 }` releases that automatic minimum so the
> `1fr` track absorbs the shortfall. The menu has no internal overflow at any
> tested width, so nothing is clipped.

---

## Hero

Four auto-rotating slides (default 3s, configurable), each with its own
headline, description, CTA and device composition:

| # | Heading | CTA | Composition |
| --- | --- | --- | --- |
| 1 | Technology, Elevated. | Explore Collection | Phone, earbuds & charger |
| 2 | Smarter Living Starts Here | Shop Smart Devices | Watch, headphones, speaker & charger |
| 3 | Built for Your Next Level | Explore Gaming | Headset, keyboard, mouse & controller |
| 4 | Meet What's Next | Shop New Arrivals | Phone on a glowing podium |

**Controls:** previous/next arrows, dots (`role="tablist"`, `aria-current`),
play/pause (`aria-pressed`), keyboard arrows (wrap around), horizontal swipe
on touch. Autoplay pauses on hover, focus, tab-hidden and manual pause.

**Motion:** cinematic crossfade + Ken Burns, staggered content reveal,
CSS ambient glow drift and a full-bleed light sweep on the media layer.
All of it is disabled under `prefers-reduced-motion`.

**3D stage:** rather than shipping a ~600 KB Three.js runtime and GLB assets
into a build-free Liquid theme, the stage uses transparent SVG device renders
animated with CSS 3D — `perspective` + `rotate` transforms, staggered float,
breathing shadows, a masked floor reflection, ambient radial lighting, and
pointer-driven parallax on fine pointers.

---

## Commerce layer

All commerce uses **real Shopify Ajax APIs** — no demo data, fabricated
reviews, fake stock or simulated checkout.

- **Cart drawer** — `/cart.js`, quantity steppers (`/cart/change.js`), remove,
  subtotal, and a header badge that stays in sync.
- **Quick add** — cards add the default variant directly; multi-variant
  products open an inline variant panel. Buttons disable during the request
  and expose a visible success/error status, so double-clicks cannot create
  duplicate lines.
- **Quick view** — modal with the same variant/cart logic.
- **Product page** — variant pickers update URL, price, compare-at, discount
  pill, gallery and availability from real variant data.
- **Buy it now** — posts `/cart/add` and redirects to `/checkout`.
- **Wishlist** — heart toggle on every card and product page, `aria-pressed`
  state, persisted to `localStorage` (`zelvox:wishlist`) and read by
  `/pages/wishlist`. Ready to hand off to a wishlist app.
- **Predictive search** — `/search/suggest.json` dropdown, keyboard
  accessible, with a full search page and empty state as fallback.
- **Collection filtering & sorting** — tag-based filter URLs
  (`/collections/<handle>/<tag>`) and `?sort_by=`, both server-rendered and
  functional without JavaScript.
- **Cart page** — Ajax quantity changes and removals update line prices,
  subtotal, count and the header badge in place.
- **Newsletter** — real `{% form 'customer' %}` tagged `newsletter`.
- **Customer accounts** — full OS 2.0 set: login (with password recovery),
  register, account overview with paginated order history, order detail,
  addresses (add / edit / set-default / delete with confirmation), reset and
  activate.

### Product card layout

Cards are equal height at every breakpoint. The image container is a fixed
aspect-ratio box (no layout shift on hover zoom), and
`.product-card__info { flex: 1 }` with
`.product-card__actions { margin-top: auto }` pins the name / price / rating /
colour swatches / **Quick Add** row to the bottom of the card — so a 1-line
title and a 4-line title in the same row still align their buttons exactly.

---

## Design tokens

`snippets/theme-tokens.liquid` emits every CSS custom property and is included
by both layouts, so the palette is driven entirely by theme settings.

| Token | Value |
| --- | --- |
| `--bg` / `--bg-soft` | `#FFFFFF` / `#F7F6FA` |
| `--surface-2` | `#F3EEFF` |
| `--text` / `--text-muted` | `#242033` / `#777386` |
| `--border` | `#E7E3F2` |
| `--accent` / `--accent-alt` | `#7545E8` / `#A478FF` |
| `--success` / `--error` | `#1FA97A` / `#D6455A` |

---

## Responsive behaviour

| Breakpoint | Header | Product grid | Category grid |
| --- | --- | --- | --- |
| ≥ 1200px | Full nav, arrows visible | 4 cols | 3 cols |
| 990–1199px | Full nav | 3 cols | 3 cols |
| 750–989px | Burger + drawer | 2 cols | 2 cols |
| ≤ 749px | Burger + drawer, stacked CTAs | 2 cols | 2 cols |

Sticky header with scroll state, focus-managed drawer, body scroll lock,
Escape-to-close. Zero horizontal overflow verified at 390 / 820 / 1280 px
**and** across the 990–1150px desktop band where the header is most crowded.

---

## Accessibility & SEO

- **Lighthouse: 100 Accessibility, 100 Best Practices, 100 SEO, zero failures.**
- Keyboard-navigable menu, drawer, carousel, search, filters and forms with
  visible focus rings.
- Collapsed panels (search, drawer) are removed from the tab order and match
  their `aria-hidden` state.
- Semantic `h1 → h2 → h3` order on every page type.
- Contrast: primary buttons darkened via `color-mix` so white text clears
  4.5:1; muted text checked against every surface.
- `aria-expanded` / `aria-pressed` / `aria-current` / `aria-roledescription` /
  live regions on all interactive controls.
- Per-page `<title>` and meta description, Open Graph and Twitter cards.

---

## Merchant-safe fallbacks

The theme renders correctly on a brand-new store before any content exists:

- **Navigation** — uses `main-menu` / `secondary_menu` link lists when present;
  otherwise falls back to built-in category links and the built-in
  About / Contact / FAQs / Shipping / Returns pages. The drawer is never empty.
- **Category tiles** — real collections by handle when they exist, themed
  placeholders when not.
- **Featured collections** — section collection setting, falling back to
  `collections.all`.
- **Images** — product/collection featured image, then a themed gradient
  placeholder. Never a broken image.
- **Dead links** — every `href="#"` fallback resolves to
  `routes.all_products_collection_url`.

---

## Verified QA

Re-run against the live preview:

| Check | Result |
| --- | --- |
| Routes responding | all templates 200 |
| Link crawl (11 seed pages → 45 internal links) | **45 live, 0 dead** |
| Tag-filter URLs (`/collections/<handle>/<tag>`) | 60 variants rendered, all 200, product counts differ per tag |
| Horizontal overflow | **0 px** at 390 / 820 / 1280, and at ~1000px (header band) |
| Lighthouse (index) | Accessibility **100**, Best Practices **100**, SEO **100**, zero failures |
| Card alignment | Quick Add delta **0 px** across all rows at 390 / 820 / 1280 |
| Mobile drawer | opens full-viewport, 20 links, all rendered with non-zero size |
| Quick Add E2E | badge `0 → 1`, success status, submit disabled during request, server cart count 1 |
| Carousel | 4 slides, dot/arrow/pause wiring, `aria-current` updates, autoplay 3000 ms |
| Wishlist | toggle `aria-pressed`, localStorage `{id, url}`, remove restores empty state |
| Console | 0 errors (only the static-preview `/cart.js`, stubbed server-side) |
| Validators | `validate-json` 44 items / 0 errors, `validate-usage` clean, `check-customers` clean, all translation keys resolve |

---

## The preview harness

The theme has no build pipeline (it is plain Liquid + CSS + vanilla JS), so the
harness exists purely to *verify* it:

- `render-preview.js` — LiquidJS-based renderer with mock products,
  collections, link lists, a cart and an icon/snippet resolver. Fails on
  unknown filters, missing snippets, unresolved translation keys and Liquid
  syntax errors.
- `serve.js` — static server with Shopify route mapping and an in-memory
  Cart API stub.
- `validate-json.js`, `validate-usage.js`, `check-customers.js` — schema,
  section-usage and customer-translation checks.

### Known mock artefacts (not theme defects)

- All mock products and collections share generated titles and SVG stand-in
  imagery — real photography is merchant catalogue data.
- `/search` ignores `q` and returns a fixed result set.
- `/checkout` is a local stand-in; on Shopify it is the real checkout.
- Country/province on address forms are plain text inputs (dependency-free).

---

## Remaining Shopify setup

- Create the collections: `smartphones`, `audio`, `wearables`, `gaming`,
  `smart-home`, `accessories`, `smart-devices`, `new-arrivals`, `bestsellers`.
- Add products, images, variants and **tags** (tags drive the collection
  filter pills).
- Create pages and assign the matching alternate template to each
  (Online Store → Pages → Theme template):
  - `about-us` → template `page.about-us`
  - `faqs` → template `page.faqs`
  - `contact-us` → template `page.contact-us`

  Shipping, returns, privacy, terms and refund pages use the default `page`
  template. All are linked from the footer.
- Configure navigation link lists (`main-menu`, and a secondary list for the
  drawer's Information group).
- Set the logo, favicon, social URLs, payment methods and announcement copy.
- Enable customer accounts (Settings → Checkout) if the account templates
  should be reachable.

---

## Known limitations

- Wishlist is `localStorage`-based (no server persistence) pending a wishlist
  app integration.
- The 3D hero is CSS/SVG-based rather than WebGL — deliberate, to keep the
  theme build-free and light.
- Real product photography and true transparent renders are merchant catalogue
  content; the theme provides the layout, aspect-ratio boxes, hover zoom and
  fallbacks, but cannot supply imagery.
- Verified in the local render harness plus Lighthouse; the final visual pass
  should be done on a real Shopify store with actual content.
