# Issues

An issue is one bug: every error with the same cause, grouped together, with how often it happens, who it affects and which release introduced it.

## How errors are grouped

Workshell builds a fingerprint from:

- whether the error came from the server or a client,
- the error message, with numbers, GUIDs and hex addresses removed (so `index 3 of nil` and `index 7 of nil` group together),
- the script the error was raised in,
- the top 8 frames of the stack trace.

To group errors yourself, pass a `fingerprint`. Errors with the same fingerprint always become one issue:

```lua
Workshell.captureError(err, {
	fingerprint = "datastore-throttled",
	tags = { store = "PlayerData" },
})
```

The SDK also folds an error thrown every frame into a single item with a count, so a loop doesn't send thousands of copies per batch.

## What an issue shows

- **Stack trace**, resolved to your source files when a [release sourcemap](/guide/releases) exists.
- **Breadcrumbs**: the last 30 things that happened before the error (players joining, logs, your own `addBreadcrumb` calls).
- **Tags and context** from `setTag`, `setContext` and `captureError`.
- **Players affected**, the **server** and **session** each event came from, and links to the player's timeline.
- **Breakdowns** by release, environment and server, and an event histogram.

Step through stored events with the arrows next to the event header.

## Bad updates don't flood the dashboard

A broken release can throw the same error on every server, for every player, many times a second. Workshell keeps **20 full events per issue per release**, each with its stack trace, breadcrumbs and context. After that, further events are only counted: per minute, per server.

Totals, charts, the release and server breakdowns, and alert rules still count every event. In a test, 200 game servers sending 200,000 copies of one crash stored 20 full events and 257 small counter rows, and the issue showed exactly 200,000 events.

When an issue regresses, it gets a fresh set of 20 so you can see the new stack traces. When old events age out under your [retention settings](/features/privacy#retention), new ones are stored in full again.

## Status, regressions and teamwork {#regressions}

Issues are **unresolved**, **resolved** or **ignored**. Resolve an issue when you ship a fix. If it happens again, Workshell reopens it as a **regression**, notes the release it came back in, notifies whoever it's assigned to, and can [alert](/features/analytics#alerts) your team.

Each issue has an activity thread: comments with Markdown and `@mentions`, assignment, status changes, and when it was first seen. Connect a GitHub repository under **Settings → Integrations** to open a linked GitHub issue in one click and see its comments in the thread.

Resolving an issue plays a small confetti burst. You earned it.

## Exploiters can't bury real bugs

Errors from clients are treated as untrusted. If a player is flagged (a client flood, or any high-severity detection), their client-only errors for the next 24 hours are quarantined: new issues they create start as ignored, so they never reach the unresolved list. See [Security](/features/security).
