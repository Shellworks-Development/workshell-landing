# Logs

Workshell captures your servers' output and any structured logs you send, and lets you search and tail them live.

## Server output

With `captureOutput` on (the default), everything printed on the server becomes a log: `print` as info, `warn` as warn, and errors as error. Lines below `outputLevel` are skipped, and each server sends at most `maxLogsPerMinute` lines (600 by default) so a runaway loop can't drown the rest. Workshell also drops anything beyond 3,000 lines per minute from one server.

## Structured logs

```lua
Workshell.info("Round started", { map = "Desert", players = #Players:GetPlayers() })
Workshell.warn("DataStore budget low", { budget = 3 }, player)
Workshell.error("Purchase failed", { productId = id }, player)
Workshell.debug("Spawn chosen", { spawn = spawn.Name })
```

The attributes table is stored with the log and shown as key-value pairs. Pass a player as the last argument and the log appears on that player's [session timeline](/features/sessions).

## Finding things

The Logs page filters by level, server, player and text, and can stream new lines as they arrive. From a player or server page, **Logs** opens the list already filtered.

Logs are kept for the project's log retention period, 14 days by default. See [Retention](/features/privacy#retention).
