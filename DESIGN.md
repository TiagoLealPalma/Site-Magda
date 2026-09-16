---
name: Magda Leal
description: A warm-gold, flat, blueprint-drafting aesthetic for a civil-engineer-turned-real-estate-consultant's personal brand site.
colors:
  ink: "#17181a"
  charcoal: "#142e4f"
  paper: "#f6f4ef"
  paper-dim: "#eeebe3"
  gold: "#b07b1f"
  gold-soft: "#d9b673"
  gold-deep: "#825b17"
  stone: "#6c6860"
  rust: "#9c4a3c"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.25rem, 6vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "normal"
  body:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.3em"
rounded:
  none: "0px"
  sm: "2px"
spacing:
  section-y: "5rem"
  section-y-lg: "7rem"
  container-x: "1.5rem"
  container-x-md: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "12px 32px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.gold}"
    rounded: "{rounded.none}"
    padding: "12px 32px"
  button-outline-hover:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
  badge-coming-soon:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
  badge-reserved:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
---

# Design System: Magda Leal

## Overview

**Creative North Star: "The Blueprint Ledger"**

The system reads as an architect's drafting table crossed with a ledger book: warm, precise, and quietly confident, never decorative for its own sake. It carries Magda Leal's dual identity — twenty years reading buildings as a civil engineer, ten years reading the market as a consultant — into every surface. A single warm gold marks what matters; everything else sits in flat, tonal planes of ink, charcoal, and paper, joined by hairline rules rather than shadows.

The system rejects rounded, soft, "app-like" UI conventions (bubble buttons, card shadows, colorful chips) in favor of hard-cornered rectangles, mono-spaced "dimension line" annotations, and a serif display face for moments that need weight. Depth comes from translucency and tonal contrast, never elevation.

**Key Characteristics:**
- Flat planes, hard corners, hairline dividers — no shadows anywhere.
- One accent color (gold) used sparingly and consistently for interaction and emphasis.
- A recurring "blueprint annotation" language (mono, uppercase, wide-tracked) for data: prices, specs, eyebrows, captions, counters.
- Precise and restrained component personality — the gold accent and typography carry the energy, not ornament.

## Colors

A warm, editorial palette built from near-black ink, warm paper, and a single gold accent, with rust reserved for one status meaning.

### Primary
- **Instrument Gold** (`#b07b1f`, `--color-gold`): the system's only accent. Used on CTAs, focus underlines, the tick-rule motif, and the "Brevemente" (coming soon) status fill. Used sparingly — never as a background at scale, always as a line, fill, or text accent on a flat surface.
- **Soft Brass** (`#d9b673`, `--color-gold-soft`): a lighter companion to Instrument Gold, used for numeric data on dark surfaces (property card prices) and for small mono/uppercase eyebrow text set directly on a flat `charcoal` background, where full-strength Instrument Gold falls below AA contrast (3.8:1) but Soft Brass clears it (7.3:1).
- **Deep Gold** (`#825b17`, `--color-gold-deep`): a darkened companion to Instrument Gold, used for small mono/uppercase eyebrow text set directly on a flat `paper` background, where Instrument Gold itself falls below AA contrast (3.4:1) but Deep Gold clears it (5.5:1).

### Neutral
- **Blueprint Ink** (`#17181a`, `--color-ink`): primary text color on light surfaces; also the darkest scrim/overlay tone (hero gradients, lightbox backdrop, mobile menu never uses this — see Charcoal).
- **Drafting Navy** (`#142e4f`, `--color-charcoal`): the dark surface color — header, footer, property card backgrounds, mobile nav overlay. A deep navy rather than a neutral gray-charcoal, giving the system's dark plane a deliberate cool cast.
- **Vellum Paper** (`#f6f4ef`, `--color-paper`): the primary light background and the text color on dark surfaces.
- **Dimmed Vellum** (`#eeebe3`, `--color-paper-dim`): a slightly deeper paper tone for subtle section-to-section separation on light backgrounds.
- **Pencil Stone** (`#6c6860`, `--color-stone`): muted neutral for secondary/caption text (spec labels, placeholder text, property descriptions) — never used for primary body copy. Clears AA contrast on `paper` (5.0:1).

### Tertiary
- **Reserved Rust** (`#9c4a3c`, `--color-rust`): a single semantic accent, used exclusively for the "Reservado" (reserved) property status badge. Not a general secondary color — introducing it elsewhere would dilute its meaning.

### Named Rules
**The Absence-as-Status Rule.** An available property carries no badge at all — the absence of a badge *is* the "Disponível" signal. Badges exist only to flag an exception (coming soon = gold fill, reserved = rust fill). Never add a neutral/default badge for the available state.

**The One Accent Rule.** Gold is the only color that ever signals interactivity or emphasis. Don't introduce a second "brand" hue for hover states, links, or highlights — invert to ink/charcoal instead (see Components).

**The Background-Matched Gold Rule.** Small mono/uppercase text (eyebrows, labels) never uses base Instrument Gold directly on a flat surface — neither `charcoal` nor `paper` gives it AA contrast at that size. Use Soft Brass on charcoal, Deep Gold on paper. Base Instrument Gold stays reserved for fills, borders, and larger text where its own contrast already clears AA.

## Typography

**Display Font:** Fraunces (with Georgia, serif fallback)
**Body Font:** Poppins (with ui-sans-serif, system-ui, sans-serif fallback)
**Label/Mono Font:** IBM Plex Mono (with ui-monospace, monospace fallback)

**Character:** A warm serif for moments of weight (hero headlines, section titles) paired with a clean geometric sans for reading copy, annotated throughout by a monospace "instrument" voice that marks data and structure — as if a draftsman labeled the page by hand.

### Hierarchy
- **Display** (400, `clamp(2.25rem, 6vw, 4.5rem)` / up to `text-7xl` on the homepage hero, line-height 0.95–1.05): hero headlines, section titles, the wordmark. Fraunces only appears here — never in body copy.
- **Body** (400, `text-sm`–`text-base`, line-height 1.5): paragraph copy, nav links, form labels. Poppins.
- **Label** (400, `text-[11px]`–`text-xs`, letter-spacing `0.3em`, uppercase, IBM Plex Mono): the "blueprint annotation" layer — section eyebrows ("SOBRE", "PROPRIEDADES"), status badges, spec captions, image/lightbox counters (`01 / 08`), and all price/spec numerals.

### Named Rules
**The Mono-Means-Data Rule.** Any numeral or short label that describes the *thing itself* — a price, a spec, a status, a counter, an eyebrow — is set in IBM Plex Mono, uppercase, wide-tracked. Fraunces and Poppins never carry numerals of this kind.

## Layout

Every page shares one container: `max-w-7xl` centered, with `1.5rem` side padding (`2rem` at `md`). Section rhythm is generous and consistent — `5rem` top/bottom padding (`~7rem` at `md`) as the default, stretching to `7rem`–`8rem` for major sections like the Sobre awards/values blocks. Heading blocks sit `3rem`–`5rem` above their content.

Grids are deliberately asymmetric where the content allows it — the homepage's featured-properties grid gives one property a 2×2 span among smaller cards rather than a uniform grid — but fall back to a clean uniform 1/2/3-column grid for the general property listing. Hero sections are full-bleed background images with a bottom-anchored or centered content block and a dark gradient scrim (always through `ink`, never pure black) for legibility, using a slow 8s "Ken Burns" zoom on load (disabled under `prefers-reduced-motion`).

Scroll-triggered reveals (fade + 20px rise, 0.8s ease-out, staggered by 80–150ms per sibling) animate most content into view once, on first intersection at 15% visibility, and are skipped entirely under `prefers-reduced-motion`.

## Elevation & Depth

The system is **entirely flat — no shadows exist anywhere in the codebase.** Depth and hierarchy come from three tools only: solid tonal blocks alternating paper/charcoal/ink between sections, translucency (a scrolled header becomes `charcoal/95` with a backdrop blur; the lightbox scrim is `ink/95`), and low-opacity hairline borders (`ink/10`, `paper/10`, `paper/30`, `gold/40`) used for internal dividers. A modal (the image lightbox) is conveyed purely by darkening the page behind it — never by a raised, bordered, or shadowed panel.

### Named Rules
**The No-Shadow Rule.** Never add `box-shadow` anywhere in this system. If something needs to feel "above" the page, darken what's behind it or add a hairline border instead.

## Shapes

Hard-cornered rectangles are the default everywhere — cards, images, buttons, form fields, badges, hero sections. `rounded-sm` (2px) is a rare, deliberate exception reserved for two moments: a form-success confirmation panel and one backoffice nav item — both meant to read as a brief, gentle "soft landing" against an otherwise sharp system. A single `rounded-full` exists on the testimonial carousel's dot indicators and is not part of the main content vocabulary.

The system's signature shape is the **tick-rule**: a 1px gold hairline with two small perpendicular ticks at each end, reading as an architectural dimension line. It animates in with a left-anchored scale-x draw (1s, `cubic-bezier(0.65,0,0.35,1)`) when scrolled into view.

### Named Rules
**The Sharp Corner Rule.** Radius is the exception, not the default. Reach for `rounded-sm` only for a confirmation/success moment — never for cards, images, buttons, or badges.

**The Sparse Tick Rule.** The tick-rule motif marks a deliberate technical flourish (above a property card's address, beside the Sobre "how I work" values, before the property spec grid) — it is not a general-purpose divider. Everyday section separation uses a plain `border-t` hairline at 10% opacity instead.

## Components

Buttons, badges, and cards share one restrained, precise personality: flat, sharp-cornered, and gold-accented, with hover states that invert fill and text color rather than adding elevation or motion beyond a color transition.

### Buttons
- **Shape:** sharp rectangle, no radius, `px-8 py-3` (32px/12px), `text-sm tracking-wide`.
- **Primary (filled):** Instrument Gold background, Vellum Paper text. Hover inverts the fill to Blueprint Ink.
- **Outline (the more common CTA):** transparent background, gold border and text. Hover fills solid gold and flips text to ink — the outline becomes the filled variant on interaction.
- **Text/tertiary:** no box at all — an underline-only link (`border-b border-gold`) or plain text that shifts to gold on hover. Used for lower-emphasis actions ("Ler mais", "Ver todos →").
- **Disabled:** opacity drops to 60%; no other treatment changes.

### Cards / Containers
- **Corner Style:** none — sharp rectangles throughout.
- **Background:** Drafting Charcoal, with the image filling the frame and a bottom-anchored `ink` gradient scrim for text legibility.
- **Shadow Strategy:** none (see Elevation & Depth) — the only "lift" affordance on hover is a slow 700ms image zoom, not a shadow or border highlight.
- **Border:** none.
- **Internal Padding:** content sits in a `p-6` block pinned to the card's bottom edge.

### Inputs / Fields
- **Style:** no box — bottom-line only (`border-b`, ink/20 on light surfaces or paper/30 on dark), transparent background.
- **Focus:** the underline color shifts to solid gold; no ring, glow, or outline is ever added.
- **Error / Disabled:** error text uses Reserved Rust (`text-rust`), consistent with the system's single status/error accent — never default Tailwind red.

### Navigation
- **Style:** a fixed, full-width header that starts transparent over the hero and becomes translucent charcoal with a blur once scrolled. Links are plain paper text at 90% opacity; the active link turns gold and grows a left-to-right animated gold underline. No nav item ever gets a background pill or box.
- **Mobile treatment:** a two-bar hamburger (no third bar) that rotates into an X, opening a full-screen charcoal overlay with large display-type links, cross-faded in.

### Status Badges (signature component)
Small, sharp-cornered, solid-fill mono labels (`text-[11px] uppercase tracking-widest`) — never an outline or icon-based badge. The available state renders no badge at all (see The Absence-as-Status Rule); "Brevemente" gets a solid gold fill with ink text, "Reservado" a solid rust fill with paper text.

## Do's and Don'ts

### Do:
- **Do** keep gold as the only accent color that signals interactivity — invert to ink/charcoal for hover/active states instead of introducing a second hue.
- **Do** set any price, spec, status, counter, or eyebrow label in IBM Plex Mono, uppercase, wide letter-spacing — that combination is the system's "data" signal.
- **Do** match the gold variant to its background for small text (Soft Brass on charcoal, Deep Gold on paper) — see The Background-Matched Gold Rule.
- **Do** keep corners sharp by default; reach for `rounded-sm` only for a confirmation/success moment.
- **Do** convey depth with flat tonal contrast, translucency, and hairline borders — never a `box-shadow`.
- **Do** use the tick-rule motif sparingly, only at moments meant to feel like a deliberate technical flourish.
- **Do** keep filter/search state mirrored in the URL and give every empty or failed state a concrete recovery action (reset filters, retry) — a dead end is a design defect regardless of how the page looks.

### Don't:
- **Don't** add drop shadows, card elevation, or glow effects anywhere — it breaks the flat "blueprint" language.
- **Don't** give the "Disponível" (available) status its own badge — its signal is the absence of one.
- **Don't** use default Tailwind red (`text-red-700`) for error states — use Reserved Rust so error states stay inside the established palette.
- **Don't** set base Instrument Gold directly as small text color on a flat charcoal or paper surface — it fails AA contrast at that size either way.
- **Don't** round buttons, cards, images, or badges — sharp corners are the system's default, not an oversight to "fix."
- **Don't** use the tick-rule as a general section divider — plain low-opacity hairline borders handle everyday separation.
