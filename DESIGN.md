---
name: Attendify
description: Contactless church attendance and live analytics for ministry leaders.
colors:
  brand-light: "#E0F3FF"
  brand-base: "#90D5FF"
  brand-bright: "#40B7FF"
  primary-action: "#0E6FC2"
  primary-action-hover: "#0B5CA3"
  ink-900: "#0B161E"
  ink-600: "#365261"
  bg: "#F7FAFD"
  surface: "#FFFFFF"
  surface-muted: "#EEF4FA"
  line: "#E2EAF1"
  line-strong: "#CBD7E3"
  success: "#3DBE81"
  success-soft: "#D1EDE0"
  danger: "#FF4B4B"
  danger-soft: "#FFE1DE"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
  metric:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.1
    fontFeature: "tnum"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary-action}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-action-hover}"
    textColor: "{colors.surface}"
  button-disabled:
    backgroundColor: "{colors.line-strong}"
    textColor: "{colors.ink-600}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary-action}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.md}"
    padding: "16px"
  chip:
    backgroundColor: "{colors.brand-light}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.full}"
    padding: "2px 12px"
  nav-link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-900}"
    typography: "{typography.title}"
---

# Design System: Attendify

## 1. Overview

**Creative North Star: "The Clear Ledger"**

Attendify is a record you trust. A ministry leader opens it after service to read the week's attendance, the cells that grew, the VIPs who showed: the interface's only job is to make those numbers legible and honest at a glance. The Clear Ledger is calm, exact, and quiet. Data is the loudest thing on every screen; chrome recedes. Personality comes from precision and a confident sky-blue brand, never from decoration that competes with a chart or a count.

This system is light, cool, and blue-true. Surfaces are near-white tinted faintly toward the brand's own blue (never warm, never the retired green-mint), so the bright sky-blue accent reads as intentional rather than loud. One typeface carries everything from hero to table cell. Layout is structural and dense where leaders need density, breathable where they're scanning.

It explicitly rejects four things, carried from the product's anti-references: the **generic SaaS dashboard** (hero-metric template, gradient text, identical icon-heading-text card grids); **clunky church admin software** (dated, beige, logbook-dense); **sterile enterprise/government** (cold gray, joyless, over-formal); and **childish over-play** (emoji soup, toy UI). The line: professional and trustworthy without being clinical; clean without being cold.

**Key Characteristics:**
- Cool blue-tinted near-white surfaces; blue-true neutrals, never warm or green.
- One family (Inter), hierarchy through weight + scale, tabular figures for all data.
- Flat by default; hairline cool borders carry separation, not shadows.
- One bright brand blue used sparingly as accent; a deeper blue carries actions.
- Numbers first, chrome last, on every screen.

## 2. Colors

A monochromatic blue identity over cool blue-tinted neutrals: one bright sky-blue for brand presence, one deeper blue for action, semantic green/red for state, and nothing warm.

### Primary
- **Action Blue** (#0E6FC2): The single color for primary actions, links, and selected state. Carries white text at ~5.1:1 (AA pass). This is what buttons and active nav use, *not* the bright brand tone.
- **Action Blue Deep** (#0B5CA3): Hover/active state for Action Blue.

### Secondary
- **Brand Bright** (#40B7FF): The identity tone. Focus rings, the primary chart series, small accents, icon highlights, the wordmark. Bright enough that it must never sit behind white text (fails contrast); used as a stroke, fill behind ink, or data color only.
- **Brand Base** (#90D5FF): Pill/badge fills, chart secondary series, soft highlights behind ink text.
- **Brand Light** (#E0F3FF): Tints, hover backgrounds, selected-row wash, the mobile menu surface.

### Neutral
- **Ink** (#0B161E): Headings and primary text. ~16:1 on surfaces.
- **Ink Muted** (#365261): Secondary text, captions, table meta. ~8:1 on surfaces; the floor for body text, never lighter.
- **Background** (#F7FAFD): The app body. Cool near-white, faintly blue (oklch ~98% .006 240). Retires the old green-mint #F8FDF8.
- **Surface** (#FFFFFF): Cards, tables, dialogs, the content layer on top of Background.
- **Surface Muted** (#EEF4FA): Paginators, table headers, inert panels. Replaces the stray pink-tinted #fbf8fd paginator background.
- **Line** (#E2EAF1): Hairline dividers and card borders, cool-tinted.
- **Line Strong** (#CBD7E3): Input strokes, stronger separation, disabled fills.

### Semantic
- **Success** (#3DBE81) / **Success Soft** (#D1EDE0): present/checked-in, positive trend.
- **Danger** (#FF4B4B) / **Danger Soft** (#FFE1DE): absent, destructive actions, errors.

### Named Rules
**The One Voice Rule.** Brand Bright (#40B7FF) is identity, not action. It appears on a small fraction of any screen (focus ring, one chart series, the wordmark). The moment it's carrying a button or a large fill, it's wrong, use Action Blue.

**The Cool Neutral Rule.** Every neutral tints toward the brand's blue hue or stays at chroma 0. Warm or green near-whites are forbidden; the green-mint body background is retired. If a neutral looks beige or mint, it's wrong.

## 3. Typography

**Display / Body / Label Font:** Inter (with system-ui, sans-serif fallback)

**Character:** One well-tuned humanist-grotesque sans carries the entire product, hero headline to dense table cell. Hierarchy comes from weight and scale, not from a second typeface. Replaces the prior Poppins + Hind + Roboto mix; that three-family spread read as indecision in a data tool.

### Hierarchy
- **Display** (700, clamp(2.25rem→3.5rem), 1.05, -0.02em): Marketing hero on `/` and `/about` only (the brand-register surfaces). Never inside the app.
- **Headline** (700, 1.5rem, 1.2): Page titles, dashboard section heads.
- **Title** (600, 1.125rem, 1.3): Card titles, table group heads, nav links.
- **Body** (400, 1rem, 1.5): Default prose and UI text. Cap prose at 65–75ch; data and table text may run denser.
- **Body Small** (400, 0.875rem, 1.45): Captions, helper text, table meta.
- **Label** (500, 0.75rem, +0.01em): Chips, table column headers, button text. Sentence case or short caps (≤4 words); never all-caps sentences.
- **Metric** (600, 1.75rem, tabular): Counts and figures (attendee totals, percentages).

### Named Rules
**The One Family Rule.** Inter only across the UI. Poppins, Hind, and the Material Roboto default are retired. A second family is permitted nowhere in the app.

**The Tabular Figures Rule.** Every number a leader compares, totals, percentages, dates in columns, uses `font-variant-numeric: tabular-nums` so digits align and don't jitter between renders.

## 4. Elevation

Flat by default. Depth comes from the Background/Surface tonal step and hairline cool borders (#E2EAF1), not from shadows. Shadows appear only as a response to state: an overlay lifting above the page, or a card on hover. A resting card is flat with a 1px border, never a drop shadow.

### Shadow Vocabulary
- **Overlay** (`box-shadow: 0 8px 30px rgba(11, 22, 30, 0.14)`): Dialogs, popovers, the mobile menu. Cool-ink based, not pure black; replaces the harsh `rgba(0,0,0,0.2)` modal shadow.
- **Hover lift** (`box-shadow: 0 4px 16px rgba(14, 111, 194, 0.12)`): Interactive cards/tiles on hover only. A faint blue ambient, not a gray box-shadow.

### Named Rules
**The Flat-By-Default Rule.** Surfaces rest flat with a hairline border. If you reach for a shadow on a resting element, use a border or the Surface Muted step instead. The retired blue-glow `shadow-default` (`0 0 12px 4px`) is decorative; do not reintroduce it as a resting state.

## 5. Components

### Buttons
- **Shape:** Gently rounded (6px / `rounded.sm`). Consistent across every button.
- **Primary:** Action Blue (#0E6FC2) background, white text, 8px 16px padding, weight 500–600. The only primary action style.
- **Hover / Focus:** Background to Action Blue Deep (#0B5CA3) (~150ms). Focus-visible: 2px Brand Bright ring, 2px offset.
- **Disabled:** Line Strong (#CBD7E3) background, Ink Muted text, `not-allowed` cursor.
- **Ghost / Secondary:** Transparent/Surface background, Action Blue text, hairline border; for secondary actions only.

### Named Rules
**The One Button Vocabulary Rule.** The app currently mixes a custom `app-button` (`bg-monochromatic-dark` + white) with Material `mat-flat-button color="primary"`. That is two primary buttons; one is wrong. Standardize on a single button (Action Blue) everywhere. If a save button looks different on two screens, fix it.

### Chips / Badges
- **Style:** Brand Light (#E0F3FF) fill, Ink text, full radius, 2px 12px padding. Status chips use Success Soft / Danger Soft with their solid counterpart as text.
- **Forbidden:** the 2px brand-bright bordered pill (`border-monochromatic-dark border-2`) as a default badge; use a soft fill, not a heavy stroke.

### Cards / Containers
- **Corner:** 8px (`rounded.md`).
- **Background:** Surface (#FFFFFF) on Background (#F7FAFD).
- **Border:** 1px Line (#E2EAF1). This is the separation, not a shadow.
- **Shadow:** none at rest; Hover lift only if interactive.
- **Padding:** 16px (`spacing.md`).

### Inputs / Fields
- **Style:** Surface background, 1px Line Strong (#CBD7E3) stroke, 6px radius, 8px 12px padding.
- **Focus:** Border to Action Blue + 2px Brand Bright ring. No glow.
- **Error:** Danger border + Danger Soft hint background; message in Ink, not red-on-red.
- **Placeholder:** Ink Muted (#365261), never a light gray below 4.5:1.

### Navigation
- **Header:** Sticky, Surface background, 1px bottom Line, Inter wordmark (700). Desktop links in Title weight; hover to Action Blue; active route Action Blue + medium weight.
- **Mobile:** Hamburger toggles a full-height Brand Light (#E0F3FF) menu; items in Title size with Lucide icons.

### Data Visualization (ngx-charts)
- **Series order:** Brand Bright (#40B7FF) → Action Blue (#0E6FC2) → Brand Base (#90D5FF) → Success → Ink Muted. Distinguishable for color-vision deficiency.
- **Rule:** never encode meaning in color alone; pair every series with a label or direct annotation.

## 6. Do's and Don'ts

### Do:
- **Do** keep numbers first and chrome last: data is the loudest element on every screen.
- **Do** use Action Blue (#0E6FC2) for actions and Brand Bright (#40B7FF) for identity/accent only.
- **Do** tint every neutral toward blue or keep it chroma-0; surfaces are #F7FAFD / #FFFFFF.
- **Do** set Inter everywhere and `tabular-nums` on all compared figures.
- **Do** rest surfaces flat with hairline #E2EAF1 borders; reserve shadow for overlays and hover.
- **Do** give every interactive component default, hover, focus-visible, active, disabled, and (where relevant) loading and error states.
- **Do** use skeletons for loading content, and empty states that teach the screen.

### Don't:
- **Don't** ship the **generic SaaS dashboard**: no hero-metric template (big number + gradient + supporting stats, exactly what the home stat boxes are today), no identical icon-heading-text card grids, no gradient text.
- **Don't** look like **clunky church admin software**: no dated, beige, logbook-dense layouts.
- **Don't** look **sterile enterprise/government**: no cold all-gray, joyless, over-formal screens.
- **Don't** go **childish/over-playful**: no emoji soup or toy-like controls that undermine leadership's trust in the data.
- **Don't** put white text on Brand Bright (#40B7FF); it fails AA (~1.9:1). Use Action Blue.
- **Don't** use a warm or green near-white; the green-mint #F8FDF8 background is retired.
- **Don't** use `border-left`/`border-right` >1px colored stripes on cards, alerts, or list items.
- **Don't** use gradient text (`background-clip: text`) or decorative glassmorphism.
- **Don't** add tiny uppercase tracked eyebrows above every section, or 01/02/03 numbered section markers as scaffolding.
- **Don't** mix two primary-button styles; one button vocabulary, Action Blue.
- **Don't** reintroduce the blue-glow `shadow-default` as a resting-state decoration.
