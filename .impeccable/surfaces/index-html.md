---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Landing page (index.html)

Mode: Persuade. Audience: anyone running a live Roblox game, solo to studio. Job: understand what Workshell catches and self-host it (or watch releases until the hosted version ships). Proof: real dashboard screenshots from a simulated demo game, labelled as demo data. Constraints: PRODUCT.md (no invented proof, "source available" not "open source", no hosted pricing, no gradients, match the dashboard's Workshell Light/Dark).

## Direction contract

THESIS: The page is one player's session, Player 1438290 on server ae9f, read top to bottom along a timestamped spine; every capability appears as the moment it happened to them. It refuses the centred hero over a screenshot followed by a row of equal feature cards.

OWN-WORLD: Workshell Light (#f6f6f3 ground, #fff panels, #e4e3de hairlines, #1d1d20 ink) and Workshell Dark (#18181b, #1f1f23, #2c2c32, #e6e6ea), switching with the system. Violet marks the live head of the spine; event dots use the dashboard's success/danger/warning. Geist display at -0.035em; Geist Mono only for timestamps, paths and code. Event cards are dashboard panels (14px radius, 1px hairline). Screenshots swap light/dark with the scheme. No eyebrows, no pill badges, no gradients.

STORY: The visitor recognises a session they have lived (slow DataStore join, a nil error, an exploiter), believes Workshell records all of it down to the Rojo path, and self-hosts or watches releases.

FIRST VIEWPORT: Left five columns: H1 "Watch one player's whole session." about 76px, one-sentence lead, primary "Self-host Workshell", secondary GitHub, a quiet "demo data" line. Right seven columns: the spine begins with a mono timestamp gutter and a 2px rail: server start with Workshell.init, Player 1438290 joined, the player.join trace (2.22 s, three GetAsync retries), then the 'Ammo' error with its resolved src/ path.

FORM: session-spine, position 3 of 7 on my ordered list. seed: none (concept-seed printed no SEED REFERENCE line; seed key 925becba dealt 3, 2, 1 and index 3 led). Signature interaction: a sticky session clock (Player 1438290 · 18:21:07) that advances as each event scrolls under it, and events land as the clock reaches them. Motion grammar: one heartbeat, once per event, exponential ease-out.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- How visitors register interest in the hosted version: until a waitlist backend is approved, link to GitHub releases (watch).
