# Ingest API

The SDK is the supported client, but the protocol is plain HTTP and JSON, so you can send data from other places too, such as a matchmaking service or a test harness.

## Request

```http
POST /api/v1/ingest
X-Workshell-Key: wsk_...
Content-Type: application/json
Content-Encoding: gzip
```

The body is optionally gzip-compressed, and at most `WORKSHELL_MAX_INGEST_BYTES` after decompression (8 MiB by default).

```json
{
  "server": { "jobId": "a1b2c3", "placeId": 123, "placeVersion": 42, "release": "4f2a9c1", "environment": "production" },
  "items": [
    { "type": "error", "ts": 1791958155392, "message": "Shop:210: attempt to index nil with 'Price'", "stack": "...", "userId": 100796674, "sessionId": "..." },
    { "type": "log", "ts": 1791958155400, "level": "info", "message": "Round started", "attrs": { "map": "Desert" } }
  ]
}
```

Timestamps are Unix milliseconds. Item types are `error`, `log`, `event`, `session_start`, `session_update`, `session_end`, `heartbeat`, `metric`, `span`, `detection`, `client_perf` and `server_close`. Workshell ignores unknown types, so an older server accepts a newer SDK. The full field list is in [`internal/server/ingest.go`](https://github.com/Shellworks-Development/workshell/blob/master/internal/server/ingest.go).

## Responses

| Status | Meaning |
| --- | --- |
| `202` | Accepted and queued. Retrying the same batch is safe: a batch is only written once. |
| `401` | Bad key, or a missing, wrong or expired signature |
| `409` | A signed request seen before (a replay); safe to treat as delivered |
| `413` | Body too large |
| `429` | Over the project's ingest limit; back off and retry |
| `503` | The ingest queue is full; back off and retry |

## Signing

When the project has a signing secret, add two headers:

```http
X-Workshell-Timestamp: 1791958155
X-Workshell-Signature: v1=<hex HMAC-SHA256 of "<timestamp>.<body>">
```

The timestamp is Unix seconds and must be within five minutes of the server's clock. Sign the JSON body itself, before any gzip compression.

## Roblox webhooks

`POST /api/v1/roblox/<project id>/webhook` receives Roblox webhook notifications. It checks the `roblox-signature` header (`t=<timestamp>,v1=<base64 HMAC-SHA256 of "<timestamp>.<body>">`) against the project's webhook secret, and handles `RightToErasureRequest` and `SampleNotification`. See [Privacy and data erasure](/features/privacy#roblox-right-to-erasure).
