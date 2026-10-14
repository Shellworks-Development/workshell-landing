---
title: Introduction
description: What Workshell is, how data moves through it, and where to start.
---

# Workshell docs

<p class="lead">Workshell is self-hosted error tracking, logging, session timelines, performance tracing and exploit detection for Roblox games. It is one Go binary and one SQLite file, running on a server you control.</p>

When a live game breaks, the question is always the same: what happened, to whom, and since which update? Workshell answers it by recording every error with a readable stack trace, every player session from join to leave, and the release each server was running.

<RequestFlow />

## Start here

<Steps :steps="[
  { title: 'Run the server', text: 'Docker Compose or a single binary. About five minutes.', link: '/guide/quick-start' },
  { title: 'Install the SDK', text: 'A ModuleScript in ReplicatedStorage and three lines in a server Script.', link: '/guide/install-sdk' },
  { title: 'Tag releases', text: 'Map Roblox instance paths back to your Rojo source files and commits.', link: '/guide/releases' },
  { title: 'Go live', text: 'Put Workshell behind HTTPS so Roblox servers can reach it.', link: '/self-hosting/deployment' },
]" />

## What you get without writing code

Once `Workshell.init` runs, the SDK captures:

- uncaught server errors, and client errors if a LocalScript also requires the module,
- server output as logs,
- player sessions with country, account age and membership (and platform, from the client),
- server health (players, FPS, heartbeat time, memory, ping, network) every 30 seconds,
- client frame rate, ping and memory,
- game pass purchases,
- a final flush when the server shuts down.

Everything else (custom events, traces, detections, metrics) is one call away. See the [SDK reference](/sdk/reference).

## Licence

Workshell is source available under [PolyForm Shield 1.0.0](https://github.com/Shellworks-Development/workshell/blob/master/LICENSE). You can use, modify and self-host it for anything, including commercially, except to offer a product that competes with Workshell. A hosted version is planned; watch the [GitHub repository](https://github.com/Shellworks-Development/workshell) for releases.
