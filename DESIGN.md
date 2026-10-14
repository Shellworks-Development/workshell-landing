---
name: Workshell landing
description: One real player session, told top to bottom along a timestamped spine, in the Workshell dashboard's own light and dark themes.
colors:
  bg: "#f6f6f3"
  surface: "#ffffff"
  surface-2: "#f1f0ec"
  border: "#e4e3de"
  border-strong: "#d2d1cb"
  fg: "#1d1d20"
  muted: "#5f5f66"
  faint: "#8c8c93"
  accent: "#6d4aff"
  accent-fg: "#ffffff"
  danger: "#dc2f3c"
  warning: "#b45309"
  success: "#15803d"
  info: "#2563eb"
  dark-bg: "#18181b"
  dark-surface: "#1f1f23"
  dark-surface-2: "#26262b"
  dark-border: "#2c2c32"
  dark-fg: "#e6e6ea"
  dark-muted: "#a2a2ab"
  dark-accent: "#9d87ff"
typography:
  display:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 3.7vw, 3.3rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  chapter:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  section:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  lead:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18.5px"
    fontWeight: 400
    lineHeight: 1.55
  base:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  ui:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.4
  small:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  micro:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11.5px"
    fontWeight: 500
    lineHeight: 1.4
  mono:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  micro: "2px"
  bar: "4px"
  tag: "6px"
  chip: "8px"
  button: "10px"
  panel: "14px"
  phone: "28px"
spacing:
  pad: "24px"
  pad-phone: "16px"
  gutter: "152px"
  gutter-phone: "28px"
  chapter: "clamp(72px, 12vh, 136px)"
components:
  button-primary:
    backgroundColor: "{colors.fg}"
    textColor: "{colors.bg}"
    rounded: "{rounded.button}"
    height: "44px"
    padding: "0 18px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.fg}"
    rounded: "{rounded.button}"
    height: "44px"
    padding: "0 18px"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "14px 16px"
  tag-danger:
    backgroundColor: "#fdeced"
    textColor: "{colors.danger}"
    rounded: "{rounded.tag}"
    padding: "2px 8px"
---

# Design System: Workshell landing

## Overview

The page is a single player's session, read top to bottom. A 2px rail runs down the page between the copy and the evidence; every chapter is a moment on it, stamped with its real time in a faint mono gutter left of the rail. The world is the product itself: the Workshell dashboard's Light and Dark themes, Geist, and the violet accent, so the site and the dashboard are the same place. Evidence is real (one recorded demo session, sess-e3b27-806) and is shown either as crisp HTML panels built from its values or as tight screenshot crops at natural size.

It refuses the category template: no centred hero over a screenshot, no row of equal feature cards, no eyebrows or badges, no gradients, no invented proof.

**Key Characteristics:**
- One spine, one session, strictly forward in time.
- Times live in the gutter beside their dot, never above headings.
- Light and dark follow the system; screenshots swap with the theme.
- Dashboard panels (white or #1f1f23, 1px hairline, 14px radius) carry every fact.

## Colors

Workshell Light is the default and Workshell Dark applies under `prefers-color-scheme: dark`, exactly as the dashboard ships them. Neutrals do the work; violet marks the live state of the spine (filled rail, reached dots, the session clock dot, code keywords). Danger, warning and success appear only as status: error bars, tags and dots, never as decoration.

- **The One Accent Rule.** Violet is the only accent. It is never a background field.
- **Status is semantic.** Red means an error happened; amber means a flag or a slow thing; green means joined.

## Typography

Geist for everything set as language, Geist Mono only for what is literally code, data or time: timestamps, span names, file paths, ids. Display sizes are tight (-0.035em) and step clearly down to chapter headings and 17px body. Body measure stays under about 32rem in the copy column.

## Layout

A 12-column-like split: copy (5fr), the spine lane (152px; its left half holds times), events (7fr). The rail's x is computed from that grid on every row so it never jogs. Chapter copy is sticky while its evidence scrolls. On screens up to 960px the lane shrinks to 28px at the left edge, copy and evidence stack, and times return to the flow beside their dot. The setup section breaks the spine on purpose: a full-width surface band after "Session ended".

## Elevation & Depth

Flat. Elevation is a 1px hairline (`border`), not shadow. The sticky nav gains a translucent background, a hairline and a 12px backdrop blur only after the page scrolls.

## Shapes

Tags 6px, buttons and code cards 10px, panels and screenshot frames 14px, the phone frame 28px. Rail dots are 12px circles ringed with the page colour; the "Session ended" mark is a 12px rounded square.

## Components

- **Event / chapter dot**: hollow ring in `border-strong`; fills with its tone (`success`, `accent`, `danger`) once the session clock reaches it.
- **Session clock**: a small bordered chip in the nav (dot, player id, mono time) that appears after the opening and ticks to the time of the chapter in view.
- **Panel**: dashboard card for facts: key/value grid, summary row, detection list, trace waterfall, stack frames.
- **Trace row**: mono span name indented by depth, a track with the bar at its real offset and width, duration inside long bars and before short ones (its own column on phones).
- **Shot**: a light/dark `<picture>` with an optional tighter phone crop, framed by a hairline at 14px.
- **Copy button**: icon crossfades with a 2px blur to a check; label reads "Copied".

## Do's and Don'ts

- Do keep every number traceable to the recorded session or a measured benchmark.
- Do put times in the gutter next to their dot.
- Do show evidence at or near natural size; build it as HTML when a crop would shrink text.
- Don't add eyebrows, kickers, pill badges or icon-tile feature cards.
- Don't use gradients (solid colours only) or a second accent.
- Don't move time backwards along the spine.
- Don't claim "open source" (it is source available) or any hosted pricing.
