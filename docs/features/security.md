# Security and exploits

Exploiters can only reach Workshell through your game's clients, and they will try. Workshell assumes it, and gives you tools to catch them.

## Record detections

When your anti-cheat catches something, flag the player:

```lua
Workshell.flag(player, "speed", { speed = 90, max = 32 }, {
	severity = "high",   -- "low" | "medium" (default) | "high"
	action = "kicked",   -- what you did about it
})
```

Detections appear on the **Security** page, on the player's page and on their session timeline. Detections can only come from the server; clients can't forge them.

## Protect remotes

`Workshell.protect` wraps a RemoteEvent handler with a per-player rate limit and argument validation:

```lua
Workshell.protect(remotes.BuyItem, function(player, itemId)
	-- your handler
end, {
	rate = 5,   -- calls per second per player (default 10)
	burst = 10, -- default 2 × rate
	validate = function(player, itemId)
		return typeof(itemId) == "string"
	end,
})
```

A call over the limit is dropped and the player is flagged for `remote_spam` (at most once per 30 seconds). A call that fails validation is dropped and flagged for `invalid_remote_args`, recording the argument types. Errors inside your handler are reported as issues with the remote's name.

## Floods are contained

- **In the SDK**, client reports go through one RemoteEvent with a token bucket per player.
- **On the server**, client data is capped per player (60 items per minute by default). A player who exceeds it gets an automatic `client_flood` detection, and their client-only errors are quarantined for 24 hours so they can't bury real issues.
- **Per project**, an ingest limit (2,000 items per second by default) protects the database. Both limits are under **Settings → Security → Abuse limits**.
- **Per issue**, only 20 full events are stored per release; the rest are counted. See [Issues](/features/issues#bad-updates-don-t-flood-the-dashboard).

## Signed requests

With a signing secret, each batch is signed with HMAC-SHA256 over a timestamp and the body. Turn on **Require signed requests** and a leaked ingest key alone can't be used to send data. Requests older than five minutes are refused, and a signed request seen twice is rejected as a replay.

## Safe rendering

Everything a game sends is shown as text, never as HTML. The dashboard runs under a strict Content-Security-Policy with no inline or third-party scripts. Control and bidirectional-override characters are stripped at ingest, and alerts can't ping `@everyone`.

## Secrets and accounts

Webhook URLs, GitHub tokens and signing secrets are encrypted at rest with AES-256-GCM. Logins are throttled, session cookies are HttpOnly and SameSite, and sensitive changes are written to the project's **audit log**.
