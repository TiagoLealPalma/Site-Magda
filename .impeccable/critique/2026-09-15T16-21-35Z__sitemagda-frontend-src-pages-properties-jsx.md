---
target: Properties listing + PropertyDetail page (imóveis flow)
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
target_identity: "file:/home/tiago/Git/Site-Magda/SiteMagda/frontend/src/pages/Properties.jsx"
target_fingerprint: "sha256:4c9364ff5c9627c26123ee990ea092bcf0a6f1372ee871034a7dc11a04baaf39"
target_path: /home/tiago/Git/Site-Magda/SiteMagda/frontend/src/pages/Properties.jsx
timestamp: 2026-09-15T16-21-35Z
slug: sitemagda-frontend-src-pages-properties-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | "A carregar…" is plain text with no skeleton; the 200ms filter debounce gives no pending indicator between a filter change and the updated grid/count. |
| 2 | Match Between System / Real World | 4/4 | Correct PT real-estate vocabulary (T4, Reservado, Brevemente, €), realistic price brackets. |
| 3 | User Control and Freedom | 2/4 | No "limpar filtros" affordance anywhere, including in the zero-result state — confirmed live: filtering to 0 results shows a dead end with no reset action. |
| 4 | Consistency and Standards | 3/4 | Strong, verified adherence to DESIGN.md tokens; one self-flagged drift (`text-red-700` error text instead of `rust`). |
| 5 | Error Prevention | 3/4 | Native `required`/`type=email` validation, submit disables while sending; no client-side format check beyond that (acceptable here). |
| 6 | Recognition Rather Than Recall | 4/4 | Every filter has a persistent mono label above the field — no reliance on placeholder-only memory. |
| 7 | Flexibility and Efficiency of Use | 1/4 | No sort (price/newest), no saved search, filters aren't in the URL — back-navigation from a listing silently wipes all filter state. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Restrained and flat by design, but the detector confirmed real contrast failures undercutting it: gold-on-charcoal eyebrow at 3.8:1 (needs 4.5:1) and stone-on-paper body/spec text at 3.2:1 (needs 4.5:1), plus 10px field labels below an 11px legibility floor. |
| 9 | Help Recognize/Diagnose/Recover from Errors | 1/4 | `getProperties`/`getProperty` calls have no `.catch` — a failed API call leaves the page on "A carregar…" forever, no error state, no retry. |
| 10 | Help and Documentation | 3/4 | Nothing missing that would actually matter for a self-explanatory browse flow. |
| **Total** | | **26/40** | **Acceptable** |

## Design Specificity Verdict

**Design review**: Not a generic real-estate template with a coat of paint. The "Blueprint Ledger" system is enforced with real discipline in the actual component code: `StatusBadge.jsx` implements the documented Absence-as-Status Rule precisely (no badge for available, gold for coming_soon, rust for reserved); `PropertyCard.jsx`/`PropertyDetail.jsx` use the mono "dimension-line" spec grid (Tipologia/Quartos/Área Bruta/Área Útil/Construído em/Morada) that visually encodes Magda's civil-engineer positioning into the product itself, not just the marketing copy. Where it drifts toward generic: the information architecture — search + bedrooms + max-price filter bar → 3-col card grid → detail hero + spec strip + lead form — is the standard real-estate template shape, and nothing in the *interaction* design (no sort, no saved search, no shareable filtered URL) differentiates it functionally from a stock listings page. The specificity lives in the visual/typographic layer, not the interaction layer.

**Deterministic scan**: A static regex scan of the six target files came back clean (nothing to flag without rendering). The live-render scan against `/imoveis` and `/imoveis/1` found 2 genuine accessibility defects the design review didn't surface: gold-on-charcoal eyebrow text at 3.8:1 contrast (needs 4.5:1) and stone-on-paper body/spec-label text at 3.2:1 (needs 4.5:1, hits 6 separate spec labels plus the description paragraph on the detail page), alongside three 10px field labels below an 11px legibility floor. It also flagged 3 false positives caused by scan artifacts (a hero price/back-link read against the wrong ancestor background instead of the actual dark photo behind it, and a scroll-reveal element caught mid-fade) — both cross-checked and cleared against source and a live screenshot.

**Visual overlays**: No persistent browser overlay was left open (browser evidence was gathered directly via screenshots and console reads, then the tab was closed); the findings above are the console/CLI record of what the detector reported.

## Overall Impression

The system genuinely looks and feels authored for a specific person — the blueprint motif isn't decoration bolted onto a stock template, it's structurally present in the status logic and the spec-grid typography. The biggest gap isn't visual, it's operational: the listing flow has no safety net. A failed API call hangs forever, a bad filter combination dead-ends with no way back, and losing your filters by navigating to a property and back is the default, not the exception. For a page whose whole job is helping someone narrow down a six-figure decision, those are the moments that actually cost trust — not the color palette.

## What's Working

1. **Absence-as-status badges** (`StatusBadge.jsx`) — removing the badge entirely for "available" keeps 4 of 5 seeded cards visually quiet, so the eye actually catches "Brevemente"/"Reservado" when it matters, instead of every card shouting a status pill.
2. **Contextual lead-form prefill** — `PropertyDetail.jsx` passes a `presetMessage` like "Tenho interesse em: <property name>" into `LeadForm`, and the textarea auto-grows to fit it. It removes friction at the single highest-intent moment on the site.
3. **The mono "dimension-line" spec grid** — using IBM Plex Mono/uppercase/wide-tracking specifically for prices, specs, and counters (never for prose) is a genuinely on-brand way to make "engineer reading a building" tangible in the UI, not just claimed in copy.

## Priority Issues

- **[P0] Silent infinite loading on API failure.** `Properties.jsx` and `PropertyDetail.jsx` never catch a rejected `getProperties`/`getProperty` promise, so a failed fetch leaves the page on "A carregar…" forever with no error message or retry path.
  **Why it matters**: any backend hiccup (a very real possibility on a single-VPS Docker deploy) silently strands a visitor mid-decision with zero feedback.
  **Fix**: wrap both fetches in try/catch and render a distinct error state with a retry action.
  **Suggested command**: `$impeccable harden`

- **[P1] Confirmed WCAG contrast failures.** The detector confirmed (cross-checked against source, not a false positive) gold-on-charcoal eyebrow text at 3.8:1 and stone-on-paper body/spec-label text at 3.2:1 — both below the 4.5:1 AA floor for normal text — plus three 10px field labels under the 11px legibility floor.
  **Why it matters**: this hits real, verified accessibility failures on core content (the "IMÓVEIS" section eyebrow, the property description, and 6 spec labels per listing), not an edge case.
  **Fix**: deepen the gold used on charcoal for text (reserve the lighter `gold-soft` for that combination) and darken/replace `stone` for body text on paper; bump the 10px labels to at least 11px.
  **Suggested command**: `$impeccable audit`

- **[P1] Filter state isn't persistable.** Filters live in local component state only; there's no URL sync. Refreshing, sharing a link, or navigating to a property detail and back all silently wipe the search/bedroom/price filters — confirmed live: the browser evidence pass had to re-set filters from scratch after visiting a detail page.
  **Why it matters**: for a joint household decision this breaks the natural "look what I found, here's the link" workflow, and punishes exactly the compare-multiple-listings behavior real buyers do.
  **Fix**: mirror `filters` into the URL query string with `useSearchParams`.
  **Suggested command**: `$impeccable harden`

- **[P2] Empty state is ambiguous and dead-ended.** Confirmed live: filtering to "5+ quartos" + "Até 100.000 €" renders "0 imóveis" and the identical "Nenhuma propriedade disponível de momento." used for true zero-inventory, with no "limpar filtros" action and otherwise-empty white space.
  **Why it matters**: a mistyped search or an overly narrow filter combo reads as "this agent has no listings" rather than "adjust your search" — a plausible reason to bounce rather than retry.
  **Fix**: branch the copy on whether any filter is active, and add a one-click reset.
  **Suggested command**: `$impeccable clarify`

- **[P2] Lead form is missing the phone field.** PRODUCT.md defines Lead capture as name/email/phone/message, but `LeadForm.jsx` only collects name, email, and message — there's no phone input in the form at all.
  **Why it matters**: for a solo agent whose stated differentiator is high-touch personal follow-through, this removes her fastest way to actually call a hot lead back.
  **Fix**: add a phone `<input>` into the existing two-column field grid.
  **Suggested command**: `$impeccable harden`

## Persona Red Flags

**Jordan (First-Timer)**: mistypes a location in "Pesquisar" (e.g. "Sintraa") and gets "Nenhuma propriedade disponível de momento." — reads as "this agent has no listings," a plausible reason to bounce rather than retry.

**Riley (Stress-Tester)**: opens a property detail, hits browser back to compare with another listing — confirmed live that Pesquisar/Quartos/Preço reset to blank every time, since filter state isn't in the URL. A comparison-shopping workflow gets punished on the very first back-navigation.

**Sam (Accessibility-Dependent)**: the confirmed 3.8:1 gold-on-charcoal eyebrow and 3.2:1 stone-on-paper body/spec text both fall below WCAG AA's 4.5:1 floor for normal text — a low-vision user reading the property description or the six spec labels (Tipologia/Quartos/Área Bruta/Área Útil/Construído em/Morada) on every single listing hits this repeatedly, not as an edge case.

## Minor Observations

- `PropertyCard.jsx`: a genuine T0 (studio, a common PT listing type) has `bedrooms` falsy and would silently fall back to showing raw `typology` text instead of "T0."
- Detail-page filmstrip thumbnails have no "currently showing" indicator, only a hover-opacity change.
- Price filter tops out at "Até 800.000 €" with no bracket for luxury inventory.
- No sort control (price, newest) anywhere on `/imoveis`.
- Detail-page description paragraph has no `max-width`/`ch` constraint, so longer descriptions will run past ~99 characters/line at desktop width (short seeded descriptions didn't trigger this visually, but nothing prevents it).
- Footer's Comprar/Vender/Arrendar all routing to the same `/imoveis` page is a known, already-tracked gap (see PRODUCT.md), not a new finding here.

## Questions to Consider

1. If the "engineer's eye" is the whole differentiator, where does that technical read (construction quality, defects, orientation) actually show up on the one page where someone is evaluating a specific property — right now the spec grid stops at Tipologia/Área/Construído/Morada?
2. Home purchases are usually a joint decision — why can't a filtered search or a specific listing state be shared via URL, forcing every "look what I found" conversation to happen by re-describing filters out loud?
3. Has anyone actually watched a real visitor sit on "A carregar…" when the Django API hiccups on the VPS — because right now that screen never resolves into anything else?
