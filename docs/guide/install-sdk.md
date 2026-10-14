# Install the SDK

The SDK is a Luau ModuleScript. It runs on the server, and optionally on clients, and sends gzip-compressed batches to Workshell every 5 seconds.

## 1. Add the module

Download `Workshell.rbxmx` from your project's **Settings → SDK setup**, or `Workshell.rbxm` from the [latest release](https://github.com/Shellworks-Development/workshell/releases/latest), and put it in **ReplicatedStorage**. If you use Rojo or Wally, sync the `sdk/` folder from the Workshell repository instead.

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

The client has no `init`. Require the module from a LocalScript, for example in **StarterPlayer → StarterPlayerScripts**, and it starts on its own:

```lua
-- StarterPlayerScripts/Workshell.client.luau
local Workshell = require(game.ReplicatedStorage.Workshell)

-- Optional: report handled errors, events and breadcrumbs from the client.
Workshell.addBreadcrumb("Opened shop", "ui")
Workshell.track("shop_opened", { tab = "swords" })
```

Requiring it is enough to capture uncaught client errors and report the device type, frame rate, ping and memory every 30 seconds. Clients can also call `captureError`, `try`, `wrap`, `track` and `addBreadcrumb`; every other function is a harmless no-op on the client, so shared modules can call it without checking where they run.

How it connects: `Workshell.init` on the server creates a RemoteEvent next to the module, and the client sends its reports through it. The client waits up to 60 seconds for that RemoteEvent. If it never appears, client reporting stays off, which happens when:

- the server never calls `Workshell.init`, or calls it more than 60 seconds after the player joins,
- you're in Studio without `enableInStudio = true` (the server SDK stays off, so there's nothing to connect to),
- the server sets `clientReporting = false`.

Client reports are rate-limited per player and marked `$client = true`, so you can always tell them apart from server data.

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
