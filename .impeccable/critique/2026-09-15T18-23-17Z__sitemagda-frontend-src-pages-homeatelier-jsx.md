---
target: Atelier landing page variant (/landing/atelier)
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
target_identity: "file:/home/tiago/Git/Site-Magda/SiteMagda/frontend/src/pages/HomeAtelier.jsx"
target_fingerprint: "sha256:0e9495eab1e7d723a66727c7b980c769992e3f0eb49816beb3915f14cb4f2939"
target_path: /home/tiago/Git/Site-Magda/SiteMagda/frontend/src/pages/HomeAtelier.jsx
timestamp: 2026-09-15T18-23-17Z
slug: sitemagda-frontend-src-pages-homeatelier-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | No loading skeleton for stats/gallery fetch; no scroll-position indicator on the rail. |
| 2 | Match Between System / Real World | 4/4 | Natural PT-PT copy, correct real-estate terms, real locations. |
| 3 | User Control and Freedom | 2/4 | No way to tell the rail is navigable besides trial; confirmed wheel-trap (see Priority Issues). |
| 4 | Consistency and Standards | 4/4 | Faithfully applies DESIGN.md tokens across every section. |
| 5 | Error Prevention | 2/4 | Only native HTML validation on the lead form; footer Comprar/Vender/Arrendar all route to the same page (known, tracked debt). |
| 6 | Recognition Rather Than Recall | 2/4 | Rail has no counter/progress indicator — browsing back and forth requires remembering what scrolled past. |
| 7 | Flexibility and Efficiency of Use | n/a | Single-visit persuade landing page, no repeat-use power paths to optimize. |
| 8 | Aesthetic and Minimalist Design | 4/4 | Genuinely restrained, generous whitespace, flat system executed cleanly. |
| 9 | Help Recognize/Diagnose/Recover from Errors | 3/4 | Lead form has a proper error message; a failed property fetch is silent with no retry. |
| 10 | Help and Documentation | n/a | Not applicable to a marketing landing page. |
| **Total** | | **23/32** | **Good (72%)** |

## Design Specificity Verdict

**Design review**: Grounded in the Blueprint Ledger system's tokens (type stack, gold-only accent, hairline dividers, tick-rule, absence-as-status badges) and genuinely specific copy (engineer positioning, real testimonial, real stats). But the structural skeleton — oversized-headline-alone About, giant ghost-quote spread, horizontal gallery rail — is a stock editorial/magazine template pattern usable for any brand. The pull-quote's giant serif `"` glyph in particular has zero connection to the blueprint/dimension-line language the rest of the system establishes. Verdict: well-skinned, not yet distinctively composed.

**Deterministic scan**: Static file scan came back clean. Live scans (desktop + mobile) both flagged the same 12/11 findings — the sitewide, already-accepted kicker/cream-palette pattern, plus one genuine catch: a `tight-leading` violation (three headings using `md:leading-tight`, 1.25, below the 1.3 floor for multi-line display type). That's been fixed directly (see below). No contrast or undersized-text findings.

## Overall Impression

The typographic execution is genuinely premium and the emotional pacing (hero → about → trust quote → gallery → form) is well-sequenced. But the gallery rail — the site owner's favorite part — has a real, confirmed interaction bug that undercuts it at the exact moment engagement should peak, and zero affordance signaling that it scrolls at all.

## What's Working

1. **Typographic system execution** — Fraunces + IBM Plex Mono "blueprint annotation" labels read premium and distinct, applied with real discipline everywhere.
2. **Absence-as-status badges** — showing nothing for "available" keeps card faces clean in the rail.
3. **Reduced-motion respect baked into the primitive** — every Reveal/TickRule instance automatically skips animation under `prefers-reduced-motion`.

## Priority Issues

- **[P0] Horizontal rail traps vertical mouse-wheel scroll.** Confirmed live: hovering over the gallery and scrolling down does not advance the page — a desktop visitor can get stuck mid-page. *Fix*: forward vertical wheel deltas to the page scroll unless the gesture is clearly horizontal.
- **[P1] Zero affordance that the gallery scrolls sideways.** Hidden scrollbar, no arrows, no counter, no edge fade. Her favorite feature risks looking like "that's all the listings." *Fix*: persistent edge fade + mono position counter (reusing the lightbox-counter pattern already in DESIGN.md).
- **[P1] Silent failure/loading for the properties + stats fetch.** No skeleton, no error state — a failed fetch makes the gallery (the core conversion asset) vanish with zero explanation. *Fix*: flat placeholder blocks while loading, plain-language fallback + retry on failure.
- **[P2] Footer nav promises features that don't exist** (Comprar/Vender/Arrendar all → `/imoveis`) — known, tracked product debt, still live and user-facing here.
- **[P2] Lead form has no real `<label>` elements**, only placeholders — fails once a field has focus/content, hurts screen-reader users on a high-stakes contact form.

## Gallery Rail — Three Directions to Push It Further

1. **Instrument Rail** — a thin gold scrubber track under the cards, a mono position counter (`02 / 06`), tick marks at card boundaries, slower pacing (2 large cards per view), each card annotated like a spec sheet.
2. **Compact Confidence** — a denser, 2-row horizontal-scroll grid built for a growing catalog (10+ listings), prioritizing scanability over magazine pacing.
3. **Story Scroll** — 1-2 full-bleed spotlight listings immediately after the pull-quote for peak emotional impact, then a compact rail for the rest.

## Persona Red Flags

**Riley (Stress-Tester)**: confirmed live — resting the cursor over the rail and scrolling down traps the page; has to move off the images first to keep going.
**Sam (Accessibility-Dependent)**: the rail has no `role`/`aria-label` and isn't guaranteed keyboard-scrollable; the lead form has no real `<label>` elements.

## Minor Observations

- The pull-quote's ghost `"` glyph is disconnected from the tick-rule/blueprint motif used everywhere else.
- "Ver todos →" is hidden on mobile in the section header and only reappears below the entire rail.
- The hardcoded "250 imóveis vendidos" stat displays with the same visual weight as the two genuinely live counters.
- Sílvia Fernandes' testimonial appears in the pull-quote and again in the Testimonials carousel directly below.
- A single-property edge case would render one small card with a huge empty gap to its right.

## Questions to Consider

1. If the "engineer's eye" is the differentiator, could the gallery rail's annotation style (specs, position counter) become the site's signature motif instead of the borrowed magazine pull-quote?
2. Is the catalog expected to grow past 10 listings soon — which would favor "Compact Confidence" over the slower "Instrument Rail" pacing?
3. Would Magda want to hand-pick 1-2 "spotlight" listings herself for a "Story Scroll" treatment, or should that always be the priciest listing (as today's sort already does)?
