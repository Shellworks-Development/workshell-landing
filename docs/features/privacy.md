# Privacy and data erasure

Workshell stores player data on your server, so you decide how long it stays and you can delete any player's data on request.

## Retention {#retention}

Each project has two retention periods, under **Settings → General**:

| Setting | Default | Covers |
| --- | --- | --- |
| Logs, traces & health | 14 days | Logs, server health, spans, client performance |
| Errors, events, sessions & detections | 90 days | Error events, custom events, sessions, detections, alert history |

Older data is deleted every hour. An issue stays until its last event ages out. A player's profile is removed once they haven't played for the second period; if they come back after that, they count as a new player. Whiteboard snapshots are kept until you delete them.

## Roblox right to erasure

When a player asks Roblox to delete their data, Roblox sends a **right to erasure request** to each experience's creator. Workshell can receive these as webhooks and delete the player automatically.

1. In Workshell, open **Settings → Security → Roblox data erasure** and copy the webhook URL. It looks like `https://workshell.example.com/api/v1/roblox/<project>/webhook`.
2. Click **Generate secret** and copy it. It is only shown once.
3. In Creator Hub, open **Webhooks**, add a webhook with that URL and secret, and select the **Right to erasure request** trigger.
4. Click **Test response**. The test notification appears in the project's audit log.

Workshell verifies Roblox's `roblox-signature` header on every notification and refuses unsigned or stale ones, so nobody else can erase your players. The endpoint needs to be reachable from the internet over HTTPS; see [Deployment](/self-hosting/deployment).

### What gets deleted

For the player, in that project:

- sessions, and everything tagged with those sessions,
- logs, custom events, error events, spans, client performance and detections,
- their player profile,
- their links to issues (each affected issue's player count goes down by one),
- whiteboard snapshots that show the player or one of their sessions.

Totals that contain no player id, such as an issue's event count or your metrics, stay as they are. The audit log records that an erasure happened and how many records were deleted, never which player.

::: warning Your game's data is separate
This clears Workshell only. Data your game keeps in DataStores, or anywhere else, needs its own erasure.
:::

### Erase a player by hand

On any player's page, **Erase player data** deletes the same data immediately. You type the player's id to confirm.

## Pseudonymous player ids {#pseudonymous-player-ids}

Under **Settings → Security**, you can store a keyed HMAC of each Roblox user id instead of the id itself. The key is per project and encrypted at rest. Lookups by Roblox id, and erasure requests, still work: Workshell hashes the id the same way before searching. Roblox profile links disappear from the dashboard.

Data recorded before you turn this on keeps raw ids, and erasure deletes both forms.
