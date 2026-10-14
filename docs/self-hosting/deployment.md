# Deployment

Workshell is one binary with the dashboard built in. It needs a disk for its SQLite database and, for a live game, a public HTTPS address that Roblox servers can reach.

## Docker Compose

The repository's `docker-compose.yml` runs Workshell and Redis:

```yaml
services:
  workshell:
    build: .
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - workshell-data:/data
    environment:
      WORKSHELL_PUBLIC_URL: https://workshell.example.com
      WORKSHELL_SECURE_COOKIES: "true"
      WORKSHELL_TRUST_PROXY: "true"
      WORKSHELL_REDIS_URL: redis://redis:6379/0
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - redis-data:/data

volumes:
  workshell-data:
  redis-data:
```

Redis is optional. Without it, the ingest queue lives in memory, and a batch accepted moments before a crash can be lost. With it, accepted batches survive restarts and are retried until they're written.

## HTTPS

Put Workshell behind a reverse proxy that terminates TLS, and set `WORKSHELL_SECURE_COOKIES=true` and `WORKSHELL_TRUST_PROXY=true`.

::: code-group

```text [Caddyfile]
workshell.example.com {
	reverse_proxy localhost:8080
}
```

```nginx [nginx]
server {
	listen 443 ssl;
	server_name workshell.example.com;
	# ssl_certificate ...; ssl_certificate_key ...;

	location / {
		proxy_pass http://127.0.0.1:8080;
		proxy_set_header Host $host;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
		# Live updates are server-sent events: don't buffer them.
		proxy_buffering off;
		proxy_read_timeout 1h;
	}
}
```

```sh [Cloudflare Tunnel]
cloudflared tunnel create workshell
cloudflared tunnel route dns workshell workshell.example.com
cloudflared tunnel run --url http://localhost:8080 workshell
```

:::

Set `WORKSHELL_PUBLIC_URL` to the public address. It's used in the SDK setup snippet, alert links and the Roblox erasure webhook URL.

## Backups

Everything lives in the data directory (`/data` in Docker, `./data` otherwise):

- `workshell.db` (with its `-wal` file while running): all your data,
- `secret.key`: the key that encrypts stored secrets, unless you set `WORKSHELL_SECRET_KEY`.

Back up both. Without the key, encrypted secrets (webhook URLs, GitHub tokens, signing secrets) can't be read, and you'll have to enter them again. To copy a consistent database while Workshell runs, use SQLite's online backup:

```sh
sqlite3 data/workshell.db ".backup 'workshell-backup.db'"
```

## Upgrading

Pull and rebuild (`docker compose up -d --build`, or `git pull && make build`) and restart. Database migrations run automatically on start.

## Hardening checklist

- Serve over HTTPS only, with secure cookies on.
- Generate a signing secret and turn on **Require signed requests** once your servers send signatures.
- Store the ingest key with `HttpService:GetSecret()` rather than in the place file.
- Set `WORKSHELL_SECRET_KEY` from a secret manager, so the key isn't stored next to the database.
- Keep the data directory off any public share, and back it up.
