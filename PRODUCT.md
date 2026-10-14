# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static Vite + Tailwind CSS 4 site with vanilla TypeScript, served by Cloudflare Workers static assets (user's choice of Cloudflare Workers; Vite/Tailwind matches the Workshell dashboard's toolchain). pnpm.

## Users

Anyone running a live Roblox game, from solo developers and small teams self-hosting on a cheap VPS or home server to established studios with a live game and someone who handles ops. They arrive wanting to know whether Workshell will show them what their game servers are doing (errors, players, performance, exploiters) and whether it is worth an afternoon to set up.

## Product Purpose

Workshell is self-hosted observability for Roblox games: error tracking with source-mapped stack traces, logs, player sessions and timelines, performance tracing, exploit/anti-cheat detection, releases, analytics, alerts, and shared whiteboards for investigations. The landing page exists to make a Roblox developer understand that in one visit and either self-host it or follow the project until the hosted version launches.

## Positioning

Lead message (user-confirmed): "Find out exactly why your Roblox game broke in production." Error investigation, session reconstruction and release regression detection lead; analytics, exploit monitoring and collaborative whiteboards support that core, they are not the pitch.

Built specifically for Roblox: a Luau SDK, Rojo sourcemap resolution of Roblox instance paths to repo files, Roblox session/player model, exploit detections and protected remotes, and an ingest path designed to survive exploiters spamming it. Runs as one Go binary with SQLite on the developer's own server, so their game's data stays with them and there is no per-event pricing.

## Operating Context

Visitors are Roblox developers (often coming from GitHub, Discord or DevForum links), evaluating on desktop or on a phone. The real product is a dashboard they would run themselves; the SDK is a ModuleScript placed in ReplicatedStorage, often synced with Rojo/Wally.

## Capabilities and Constraints

- Self-hosting is available now: Docker Compose or `make build` from https://github.com/Shellworks-Development/workshell.
- A hosted version ("Workshell Cloud", name not final) is planned but not available. **Open decision:** how visitors register interest. There is no waitlist backend yet; until one is approved, point people to watch the GitHub repo's releases. Do not collect emails without an approved backend.
- Storage is one SQLite database with a single writer. Redis (optional) makes the ingest queue durable and shares live updates across instances; it does not scale the database horizontally. Never imply otherwise.
- **Planned, not built:** an optional ClickHouse backend for analytics-heavy queries at scale. Do not mention it as available.
- License: PolyForm Shield 1.0.0 (source-available, not OSI open source). Free to use and self-host, including commercially, except to build a competing product. Say "source available", never "open source".
- No pricing exists for the hosted version; do not state any.

## Brand Commitments

- Name: Workshell. Copyright holder: Shellworks Development (the user built it; do not credit an individual).
- Logo: a solid violet (#6d4aff) rounded tile with a white "W" and a mint (#5eead4) cursor underscore. Solid colors only; the user explicitly dislikes gradients.
- Must match the real Workshell dashboard: its Workshell Light and Workshell Dark themes, Geist / Geist Mono, violet accent. Dashboard screenshots must use Workshell's own themes (not Catppuccin), light shots in light mode and dark shots in dark mode.
- Inspired by Vercel's dashboard aesthetic but not a copy. Natural, not AMOLED black.
- The user rejected filler that reads as AI-generated (e.g. a pill badge above the hero that carries no information).

## Evidence on Hand

- Real product screenshots captured from a demo project with simulated traffic (mock players, servers, cheaters). They are illustrative, not a customer's data.
- No customers, testimonials, games using it, download counts, benchmarks or community links exist yet. Do not fabricate any.
- Measured facts usable as copy: the server binary is about 16 MB. On an 8-core Ryzen 7 5700X, 100 simulated game servers sent 1.1M items over 9 minutes; ingest kept up (all written within 2 s of the last send), issues/logs/sessions answered in about 11 ms p95, overview about 230 ms, server health about 360 ms, performance about 760 ms p95. Quote these only with that context.
- The landing page's session is a real recorded session from the demo game (sess-e3b27-806); keep any future copy consistent with its data.

## Product Principles

1. Show the real product; the dashboard is the proof.
2. Speak Roblox: name the things Roblox devs actually fight (DataStore throttling, exploiters, remotes, Rojo paths).
3. Honest over impressive: no invented proof, no "open source" claim, no hosted pricing.
4. Self-hosting should look as easy as it is: commands, not marketing promises.
