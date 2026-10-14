# Sessions and players

A session is one player's visit, from join to leave. Workshell puts everything that happened to them on one timeline, so "it broke for one player" becomes something you can read.

## The timeline

For each session you see, in order:

- join and leave,
- custom events and purchases,
- logs and errors tagged with the player,
- trace spans (a slow `player.join`, a DataStore load),
- exploit detections,
- client frame rate, ping and memory, charted over the session.

Sessions record the player's country, account age and membership, the server they were on, the release it ran, and, when the client reports it, their platform. Add your own attributes with `setUser`:

```lua
Workshell.setUser(player, { level = 12, guild = "Red" })
```

## Players

The player page collects every session a player has had: when they first and last played, total playtime, Robux spent, detections, issues they hit, and recent activity across sessions. In projects that store [pseudonymous ids](/features/privacy#pseudonymous-player-ids), you can still look a player up by their Roblox id.

## Linking your own data

`Workshell.sessionId(player)` returns the current session id. Put it in your own logs or support tickets to jump straight to the session later.
