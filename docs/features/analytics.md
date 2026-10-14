# Analytics and alerts

## Analytics

The **Analytics** page charts concurrent players, daily active players, new players, retention, platforms, countries and Robux revenue from the sessions and purchases Workshell already records.

Track your own events with an optional numeric value:

```lua
Workshell.track("level_up", { level = 5 }, player)
Workshell.track("quest_completed", { quest = "Lost Sword" }, player, 1)
```

Record developer product purchases, usually from `ProcessReceipt` (game pass purchases are tracked automatically):

```lua
Workshell.trackPurchase(player, receipt.CurrencySpent, { productId = receipt.ProductId })
```

The **Events** page lists every event name and lets you build funnels from them, such as join → tutorial finished → first purchase. Event names starting with `$` are reserved for Workshell, and clients can't send them.

## Alerts {#alerts}

Alerts tell your team when something needs attention. Set them up under **Alerts**.

**Channels** are where alerts go: a Discord webhook, or any HTTP endpoint, which receives JSON. Webhook URLs are stored encrypted. Each channel has a test button.

**Rules** decide when to send:

| Rule | Fires when |
| --- | --- |
| New issue | A new issue appears |
| Regression | A resolved issue happens again |
| Error spike | Errors in the window exceed a threshold |
| Exploit detections | Detections in the window reach a threshold |
| Players drop | Concurrent players fall below a threshold |
| Low server FPS | Average server FPS falls below a threshold |

Threshold rules are checked every minute over their window, and each rule has a cooldown so a long incident sends one alert, not hundreds. Every alert sent is listed in the alert history.
