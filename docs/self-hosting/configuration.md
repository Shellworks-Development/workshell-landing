# Configuration

Workshell is configured with environment variables. Everything else (retention, limits, integrations) is set per project in the dashboard.

| Variable | Default | |
| --- | --- | --- |
| `WORKSHELL_ADDR` | `:8080` | Listen address |
| `WORKSHELL_DATA_DIR` | `./data` | Where the SQLite database and generated secret key live. Back this up. |
| `WORKSHELL_PUBLIC_URL` | | The public URL, used in setup snippets, alert links and webhook URLs |
| `WORKSHELL_SECRET_KEY` | generated | 32-byte key, hex or base64, that encrypts stored secrets. Generate one with `openssl rand -hex 32` |
| `WORKSHELL_REDIS_URL` | | For example `redis://localhost:6379/0`. A durable ingest queue, and live updates shared between instances |
| `WORKSHELL_SECURE_COOKIES` | `false` | Set to `true` when served over HTTPS |
| `WORKSHELL_TRUST_PROXY` | `false` | Trust `X-Forwarded-*` headers from your reverse proxy |
| `WORKSHELL_MAX_INGEST_BYTES` | `8388608` | Largest ingest request accepted, after decompression |
| `WORKSHELL_SESSION_DAYS` | `30` | How long a dashboard login lasts |

::: warning Changing the secret key
If `WORKSHELL_SECRET_KEY` changes, secrets encrypted with the old key can't be read. Workshell logs an error naming the affected project, and you'll need to regenerate or re-enter its webhook URLs, GitHub token and signing secret.
:::

## Per-project settings

| Where | |
| --- | --- |
| **Settings → General** | Name, and [retention](/features/privacy#retention) for logs and for everything else |
| **Settings → SDK setup** | Ingest key, setup snippet and `Workshell.rbxmx` download |
| **Settings → Security** | Signing secret, pseudonymous ids, [Roblox data erasure](/features/privacy#roblox-right-to-erasure), abuse limits |
| **Settings → Integrations** | GitHub repository and token |
| **Settings → Audit log** | Sensitive changes and erasures |
| **Alerts** | Channels and rules |
