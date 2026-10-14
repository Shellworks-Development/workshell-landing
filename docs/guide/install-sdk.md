# Install the SDK

The SDK is a Luau ModuleScript. It runs on the server, and optionally on clients, and sends gzip-compressed batches to Workshell every 5 seconds.

## 1. Add the module

Download `Workshell.rbxmx` from your project's **Settings → SDK setup** and put it in **ReplicatedStorage**. If you use Rojo or Wally, sync the `sdk/` folder from the Workshell repository instead.

## 2. Allow HTTP requests

In Studio, open **Game Settings → Security** and turn on **Allow HTTP Requests**.

## 3. Start it from a server Script

```lua
local Workshell = require(game.ReplicatedStorage.Workshell)

Workshell.init({
	url = "https://workshell.example.com",
	key = "wsk_...",
	signingSecret = "wss_...", -- optional, see below
})
```

`key` also accepts a Secret, so you can keep the ingest key out of your place file:

```lua
local HttpService = game:GetService("HttpService")

Workshell.init({
	url = "https://workshell.example.com",
	key = HttpService:GetSecret("workshell_key"),
})
```

::: tip Studio
The SDK stays off in Studio unless you pass `enableInStudio = true`. Data sent from Studio is tagged with the `studio` environment.
:::

## 4. Add client reporting (optional)

Require the same module from any LocalScript:

```lua
local Workshell = require(game.ReplicatedStorage.Workshell)
```

Clients then report their errors, device type, and frame rate, ping and memory. Clients can call `track`, `captureError`, `try` and `addBreadcrumb`; everything else is a no-op on the client. Client reports travel through a rate-limited RemoteEvent and are marked `$client = true`, so you can always tell them apart from server data.

## 5. Sign requests (recommended)

Generate a signing secret under **Settings → Security** and pass it as `signingSecret`. Each batch is then signed with HMAC-SHA256 over a timestamp and the body. Once your servers are updated, turn on **Require signed requests**: a leaked ingest key alone can then no longer be used to send data, and captured requests can't be replayed.

## Check it works

Join your game. Within a few seconds the project overview shows a live server and your session. Throw an error to see an issue:

```lua
task.delay(5, function()
	error("Workshell test error")
end)
```

If nothing arrives, pass `debug = true` to `Workshell.init` and watch the server output.

## Next

- [Tag releases](/guide/releases) so stack traces point at your source files.
- Browse the [SDK reference](/sdk/reference) for events, traces and detections.
