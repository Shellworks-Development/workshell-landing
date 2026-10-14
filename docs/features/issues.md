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

Each issue has an activity thread: comments with Markdown and `@mentions`, assignment, status changes, and when it was first seen.

Resolving an issue plays a small confetti burst. You earned it.

## GitHub

Connect a repository under **Settings → Integrations** to:

- open a GitHub issue from a Workshell issue in one click, filled in with the event and player counts, the releases it was seen in, the latest message and stack trace, and a link back to Workshell,
- see that GitHub issue's comments in the Workshell activity thread,
- post a Workshell comment to the linked GitHub issue as well (tick the option when commenting),
- link stack frames to your files at the exact commit, when a [release sourcemap](/guide/releases) exists. These links need no token.

### Token permissions

Use a **fine-grained personal access token** scoped to the one repository:

| Setting | Value |
| --- | --- |
| Resource owner | The account or organization that owns the repository |
| Repository access | Only select repositories → your game's repository |
| Issues | Read and write |
| Metadata | Read-only (GitHub adds this automatically) |

Workshell needs nothing else: no Contents, Pull requests or Administration access. It only calls GitHub's issue endpoints: create an issue, read it, list its comments and add a comment.

The **Create a token on GitHub** button in the settings opens GitHub's form with the name, owner and Issues permission already filled in; you still pick the repository yourself. If the repository belongs to an organization that requires approval, the token stays pending until an owner approves it.

A classic token also works (`public_repo` for a public repository, `repo` for a private one), but it can reach every repository you can, so prefer a fine-grained one. Tokens are stored encrypted, and **Remove token** deletes it.

## Exploiters can't bury real bugs

Errors from clients are treated as untrusted. If a player is flagged (a client flood, or any high-severity detection), their client-only errors for the next 24 hours are quarantined: new issues they create start as ignored, so they never reach the unresolved list. See [Security](/features/security).
