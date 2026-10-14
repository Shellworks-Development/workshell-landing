# Options

Everything `Workshell.init` accepts. Only `url` and `key` are required.

```lua
Workshell.init({
	url = "https://workshell.example.com",
	key = "wsk_...",
	signingSecret = "wss_...",
	environment = "production",
	outputLevel = "warn",
	beforeSendError = function(item)
		if item.message:find("HTTP 429") then
			return nil -- drop it
		end
		return item
	end,
})
```

## Connection

| Option | Default | |
| --- | --- | --- |
| `url` | required | Base URL of your Workshell server |
| `key` | required | Project ingest key (`wsk_...`), or a Secret from `HttpService:GetSecret()` |
| `signingSecret` | | Request signing secret (`wss_...`) from **Settings → Security** |
| `enableInStudio` | `false` | Send data while testing in Studio |
| `environment` | `"production"` | Environment name; `"studio"` when running in Studio |
| `release` | detected | Release name. Defaults to the `WorkshellRelease` module written by [`workshell release`](/guide/releases), else `game.PlaceVersion` |

## What to capture

| Option | Default | |
| --- | --- | --- |
| `captureErrors` | `true` | Uncaught server errors |
| `captureOutput` | `true` | Server output as logs |
| `outputLevel` | `"info"` | Minimum output level: `"debug"`, `"info"`, `"warn"` or `"error"` |
| `trackSessions` | `true` | Player sessions |
| `trackGamePasses` | `true` | Game pass purchases |
| `clientReporting` | `true` | Accept errors, events and performance data from clients |

## Timing and limits

| Option | Default | |
| --- | --- | --- |
| `flushInterval` | `5` | Seconds between sends |
| `heartbeatInterval` | `30` | Seconds between server health reports |
| `maxLogsPerMinute` | `600` | Output lines sent per minute |
| `debug` | `false` | Print what the SDK is doing to the output |

The SDK queues at most 10,000 items and sends up to 1,000 per request. If Workshell is unreachable, it backs off and retries; when the queue is full, the oldest items are dropped first.

## Filtering errors

`beforeSendError(item)` runs before each error is queued. Return `nil` to drop the error, or return the item, changed if you like, to send it. Use it to strip personal data from messages or ignore errors you can't act on.
