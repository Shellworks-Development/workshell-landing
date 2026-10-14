# SDK reference

Every function is on the module you `require`. Functions marked **client** also work in LocalScripts; the rest are server-only and do nothing on a client.

```lua
local Workshell = require(game.ReplicatedStorage.Workshell)
```

## Setup

### `init(options)`

Starts the SDK on the server. Call it once, early, from a server Script. See [Options](/sdk/options).

### `flush()`

Sends everything queued now instead of waiting for the next interval. The SDK already flushes when the server shuts down.

### `isEnabled()` <Badge type="info" text="client" />

Whether the SDK is sending data (false in Studio unless `enableInStudio` is set).

### `sessionId(player)` <Badge type="info" text="client" />

The current session id for a player (on a client, the local player's), to put in your own logs or support tickets.

## Errors

### `captureError(err, options?)` <Badge type="info" text="client" />

Reports a handled error. `err` can be a string or any value.

```lua
Workshell.captureError(err, {
	player = player,
	level = "warning",                -- "error" (default) | "warning" | "fatal"
	tags = { store = "PlayerData" },
	context = { attempt = 3 },
	fingerprint = "datastore-throttled", -- optional custom grouping
})
```

### `try(fn, ...)` <Badge type="info" text="client" />

Like `pcall`, but reports the error if `fn` fails.

```lua
local ok, data = Workshell.try(loadData, player)
```

### `wrap(fn)` <Badge type="info" text="client" />

Returns a function that runs `fn` and reports any error it throws, then rethrows it.

### `addBreadcrumb(message, category?, data?)` <Badge type="info" text="client" />

Records something that happened, shown on the next error. Servers keep the last 30, clients the last 20.

```lua
Workshell.addBreadcrumb("Opened shop", "ui")
```

### `setTag(key, value)` and `setContext(key, value)`

Attach a tag or a context table to every error from this server.

```lua
Workshell.setTag("map", "Desert")
Workshell.setContext("round", { number = 4, mode = "ranked" })
```

## Logs

### `debug`, `info`, `warn`, `error(message, attrs?, player?)`

Structured logs with optional attributes and player. `log(level, message, attrs?, player?)` takes the level as a string.

```lua
Workshell.info("Round started", { map = "Desert" })
Workshell.warn("DataStore budget low", { budget = 3 }, player)
```

## Sessions and analytics

### `setUser(player, attrs)`

Adds attributes to the player's current session.

```lua
Workshell.setUser(player, { level = 12, guild = "Red" })
```

### `track(name, props?, player?, value?)` <Badge type="info" text="client" />

Records a custom event. On a client, it's `track(name, props?, value?)` and the player is implied.

```lua
Workshell.track("level_up", { level = 5 }, player)
```

### `trackPurchase(player, robux, props?)`

Records a developer product purchase. Game pass purchases are tracked automatically.

## Performance

### `trace(name, fn, player?, ...)`

Times `fn(...)` as a span and returns its results. If `fn` throws, the span is marked as an error and the error is reported and rethrown.

### `startSpan(name, options?)`

Starts a span you finish yourself. Options: `player`, `attrs`.

```lua
local span = Workshell.startSpan("player.join", { player = player })
local load = span:child("datastore.load")
load:setAttribute("store", "PlayerData")
load:finish()
span:finish()           -- or span:finish("error")
```

| Method | |
| --- | --- |
| `span:child(name)` | Starts a child span in the same trace |
| `span:setAttribute(key, value)` | Adds an attribute |
| `span:finish(status?)` | Ends the span; `status` is `"ok"` (default) or `"error"` |

### Metrics

| Function | |
| --- | --- |
| `increment(name, amount?)` | Adds to a counter (default 1); summed across servers |
| `gauge(name, value)` | Records a value; charted as avg, min and max |
| `timing(name, ms)` | Records a duration in milliseconds |
| `time(name, fn)` | Runs `fn`, records how long it took, and returns its results |

## Security

### `flag(player, kind, details?, options?)`

Records an exploit detection. Server only, so clients can't forge one.

```lua
Workshell.flag(player, "speed", { speed = 90, max = 32 }, { severity = "high", action = "kicked" })
```

### `protect(remote, handler, options?)`

Connects a RemoteEvent handler with a per-player rate limit and argument validation. Returns the connection. See [Protect remotes](/features/security#protect-remotes).

| Option | Default | |
| --- | --- | --- |
| `rate` | `10` | Calls per second allowed per player |
| `burst` | `2 × rate` | Burst size |
| `validate` | | `function(player, ...)` that returns `false` to reject the call |
| `severity` | `"medium"` | Severity of the detections it raises |

## Client only

### `platform()`

The local device type, as Workshell reports it: for example `Desktop`, `Phone`, `Tablet`, `Console` or `VR`.
