# Performance and traces

Time the operations that make a game feel slow, such as joining, loading data or matchmaking, and see where the time goes.

## Spans

The simplest way is `Workshell.trace`. It times a function, returns its results, and marks the span as an error (and reports the error) if the function throws:

```lua
local data = Workshell.trace("datastore.load", function()
	return store:GetAsync(key)
end, player)
```

For work that spans callbacks, start and finish a span by hand:

```lua
local span = Workshell.startSpan("matchmaking.find", { player = player, attrs = { mode = "ranked" } })
-- ...
span:setAttribute("candidates", #candidates)
span:finish()          -- or span:finish("error")
```

## Traces

Children of a span share its trace, so one player's join can be broken into its parts:

```lua
local join = Workshell.startSpan("player.join", { player = player })

local load = join:child("datastore.load")
local profile = store:GetAsync(key)
load:setAttribute("store", "PlayerData")
load:finish()

local spawn = join:child("character.spawn")
player:LoadCharacter()
spawn:finish()

join:finish()
```

The **Performance** page lists each span name with its count, p50, p95 and error rate. Open a slow run to see it as a waterfall of nested spans, or send it to a [whiteboard](/features/whiteboards), where it's drawn as a node graph with each span's duration.

## Client and server health

The same page shows client frame rate, ping and memory by platform, including the share of time spent under 30 FPS. The **Servers** page shows each server's players, FPS, heartbeat time, memory, ping and network traffic, reported every 30 seconds.

## Metrics

For numbers that aren't a duration of one operation:

```lua
Workshell.increment("shop.opened")            -- counters are summed across servers
Workshell.gauge("matchmaking.queue", #queue)   -- gauges chart avg, min and max
Workshell.timing("ai.tick", ms)
local result = Workshell.time("pathfind", function()
	return path:ComputeAsync(a, b)
end)
```

Metrics are charted on the **Metrics** page.
