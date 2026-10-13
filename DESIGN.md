---
name: Portfólio Jaline Mombach
description: "Traço Capturado: a child's finger stroke, captured with speed and pressure, draws an academic portfolio on an ink-navy capture screen."
colors:
  ink-navy: "#0b1424"
  ink-surface: "#131f35"
  ink-text: "#f2f5fb"
  ink-muted: "#b8c4da"
  ink-border: "#7388ab"
  signal-amber: "#ffb703"
  signal-yellow: "#ffc233"
  trace-pink: "#ff6f9f"
  trace-cyan: "#7fd4ff"
  paper-cool: "#f6f8fc"
  paper-surface: "#e8edf6"
  paper-ink: "#0d1626"
  paper-muted: "#3d4c66"
  paper-border: "#5b6b86"
  paper-blue: "#0a4a9e"
  paper-trace-amber: "#a85200"
  paper-trace-pink: "#be1558"
  paper-trace-cyan: "#0a63a8"
typography:
  hero:
    fontFamily: "Bricolage Grotesque Variable, Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.5rem + 6vw, 6rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.035em"
  display:
    fontFamily: "Bricolage Grotesque Variable, Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.6vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Bricolage Grotesque Variable, Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 1.25rem + 1.4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Bricolage Grotesque Variable, Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(0.9rem, 0.87rem + 0.2vw, 0.975rem)"
    fontWeight: 400
    lineHeight: 1.3
rounded:
  sm: "4px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "56px"
  4xl: "88px"
components:
  button-link:
    backgroundColor: "{colors.signal-amber}"
    textColor: "{colors.ink-navy}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink-text}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "44px"
  badge:
    backgroundColor: "{colors.ink-surface}"
    textColor: "{colors.ink-text}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  card:
    backgroundColor: "transparent"
    textColor: "{colors.ink-text}"
    padding: "16px 0 0"
  nav-link:
    textColor: "{colors.ink-text}"
    padding: "8px 0"
    height: "44px"
---

# Design System: Portfólio Jaline Mombach

## Overview

**Creative North Star: "Traço Capturado"**

The data of the author's thesis becomes the identity: a child's pre-writing finger stroke, recorded with speed and pressure, is what draws the site. The default world is a dark ink-navy capture screen; light theme is its paper-cool counterpart where the same stroke is drawn in ink. Everything the stroke touches is an academic, institutional page: the voice stays scholarly, never a toy, never a cold CV.

One idea carries the system: a short rounded stroke in the trace ramp (amber slow, pink mid, cyan fast) marks the start of things. It opens section titles, grows under a nav link, slides across a card's top edge, and is drawn full-width in the hero. Surfaces are flat and unboxed; hierarchy comes from type scale, that stroke, and 2px rules.

**Key Characteristics:**
- Dark ink-navy by default, light paper-cool counterpart; follows the OS, with a manual toggle.
- One three-stop trace ramp (slow, mid, fast), used only for strokes and state.
- Bricolage Grotesque display over Atkinson Hyperlegible Next body.
- Entries open with a stroke; no boxed cards, no shadows.
- AA contrast checked per token pair; 44px minimum targets; reduced motion shows a static trace.

## Colors

An ink-navy field with warm-to-cool signal colors: one amber-yellow voice for links and the main action, a pink-to-cyan trace for strokes.

### Primary
- **Signal Amber** (#ffb703 dark / #a85200 light): the slow end of the trace ramp. Primary action fill, hover and pressed borders, text selection, form accent and caret.
- **Signal Yellow** (#ffc233 dark) / **Paper Blue** (#0a4a9e light): link and accent color (`--color-link`, `--color-accent`).

### Secondary
- **Trace Pink** (#ff6f9f dark / #be1558 light): the mid stop of the ramp; middle of every stroke gradient.
- **Trace Cyan** (#7fd4ff dark / #0a63a8 light): the fast stop; also the dark-theme focus ring color. Light-theme focus is Paper Blue.

### Neutral
- **Ink Navy** (#0b1424) page; **Ink Surface** (#131f35) badge fill; **Ink Text** (#f2f5fb); **Ink Muted** (#b8c4da) secondary text; **Ink Border** (#7388ab) rules and UI boundaries.
- **Paper Cool** (#f6f8fc) page; **Paper Surface** (#e8edf6); **Paper Ink** (#0d1626) text; **Paper Muted** (#3d4c66); **Paper Border** (#5b6b86).

### Named Rules
**The Trace Ramp Rule.** The three trace colors appear only as strokes, gradients of strokes, and state (hover, pressed, selection, the primary action). They never fill panels or color body text.

**The Paired Theme Rule.** Every color is a theme pair. Never use a dark value on paper or the reverse; the light trace colors are darkened specifically to hold 5:1 or better on paper-cool.

## Typography

**Display Font:** Bricolage Grotesque Variable (fallback Atkinson Hyperlegible Next, system-ui)
**Body Font:** Atkinson Hyperlegible Next (fallback system-ui, Segoe UI, Roboto)

**Character:** A characterful variable grotesque for headings paired with a typeface designed for legibility; expressive on top, plainly readable below. Headings use tight tracking and `text-wrap: balance`.

### Hierarchy
- **Hero** (700, clamp 2.75rem to 6rem, 1.0, -0.035em): the name on the home page only, max 14ch.
- **Display** (700, clamp 2rem to 3.25rem, 1.12): page h1.
- **Headline** (700, clamp 1.6rem to 2.25rem, 1.12): section titles (h2, `.section-title`) and the closing call line.
- **Title** (700, clamp 1.25rem to 1.5rem, 1.12): h3, card titles, lede, site name (800), primary action label.
- **Body** (400, clamp 1.0625rem to 1.1875rem, 1.6): running text, capped at 68ch (`--measure`), shorter (38ch to 42ch) for block paragraphs and the lede.
- **Label** (400, clamp 0.9rem to 0.975rem): badges, figcaption, footer, mobile nav.

### Named Rules
**The Two Voices Rule.** Display face for headings, names, and the call line; Atkinson for everything read at length. Do not set paragraphs in the display face.

## Layout

A single left-aligned column inside a 76rem wide container (`--wide`); inner page content is held to a 68ch measure unless the page is marked wide. Spacing is a 4px-based scale (0.25rem to 5.5rem, `--space-1` to `--space-8`) with large jumps between sections (3.5rem above h2, 5.5rem above the closing call). The home hero is a grid: name and positioning line left, optional portrait right (two columns from 56rem), trace spanning the full width beneath. Content grids go 1 column, then 2 (40rem) for cards, 3 (56rem) for the three work blocks. Header is a slim wrapping row: name, nav, theme toggle; below 40rem the toggle is pinned top-right and the trace is enlarged to 190% and cropped so the loops stay legible.

## Elevation & Depth

Flat. No shadows exist in the build. Depth and separation come from 2px rules in the border color (card top edge, footer top), a surface tint on badges, and the stroke. State is expressed by the stroke growing or by a border turning amber, never by lift.

### Named Rules
**The Flat-By-Default Rule.** Surfaces stay flat; separation is a 2px rule or whitespace. A hovering card extends its stroke, it does not rise.

## Shapes

Two silhouettes only: a small 4px radius for rectangular controls, badges and images, and the 999px pill for strokes (section stroke 6px, nav underline 4px, card stroke 6px) and the primary call button. Rules are 2px; badge borders are 1px, dashed for the alert variant. Focus is a 3px solid ring offset 3px.

## Components

### Buttons
- **Shape:** pill (999px) for the call-to-action link; 4px radius with a 2px border for toggles.
- **Primary (`.button-link`):** amber fill, ink text, display face 700, padding 12px 24px; slides 4px right on hover.
- **Toggle:** transparent with 2px border in the border color; border turns amber on hover and when pressed.
- **Focus:** 3px solid ring in the focus color; minimum target 44px.

### Cards / Containers
- **Corner Style:** none on the container; images 4px.
- **Background:** transparent; no box.
- **Border:** 2px rule on top edge; a 6px amber-to-pink stroke starts at 14% width and extends to full on hover or focus-within (0.45s ease-out).
- **Internal Padding:** 16px top, 8px gap between title, text, badges. Title link is text-color, underline appears on hover or focus.

### Navigation
Bold Atkinson links in text color, no underline, wrapping row with 24px gaps. A 4px three-stop trace stroke scales in from the left on hover and stays under the current page (`aria-current`). Smaller type below 40rem.

### Badges
4px radius, 1px border, surface fill, label size. Info variant uses accent border; alert variant uses a dashed border.

### Trace (signature)
A synthetic pre-writing line of six loops drawn in 3px-segment paths: color by speed (amber slow to pink to cyan fast), width by pressure (2 to 15 units), sample dots at the slowest points, one pen lift and one hesitation. It draws itself once (12ms per segment). On pointer motion over the hero a fading canvas trail uses the same ramp. It is decorative (`aria-hidden`) with a visible caption stating it is illustrative and synthetic; under reduced motion it is static and no trail is created.

### Section title
The headline preceded by a 4.5rem by 6px gradient stroke above its left edge. This is the standard way to open a section.

## Do's and Don'ts

### Do:
- **Do** open sections and entries with a short rounded stroke in the trace ramp.
- **Do** keep every state change (hover, current, pressed) as a stroke growing or a border turning amber.
- **Do** set min 44px targets and 3px focus rings; verify 5:1 on UI boundaries and 4.5:1 on text per theme.
- **Do** read all colors from the theme custom properties so light, dark and manual toggle stay in sync.
- **Do** pair every motion with a reduced-motion static equivalent.

### Don't:
- **Don't** use the trace colors as panel fills or for paragraph text.
- **Don't** box entries in cards with shadows or filled backgrounds; the open entry with a top rule is the form.
- **Don't** use one theme's trace values in the other theme.
- **Don't** make the trace carry information; it is illustrative and must stay `aria-hidden`.
- **Don't** drift toward a childish toy look (primary-color blobs, rounded cartoon type) or a cold institutional CV page; the stroke is the identity, the voice stays academic.
