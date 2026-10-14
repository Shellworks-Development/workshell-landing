# Quick start

Run the Workshell server, create a project, and see data arrive. You need either Docker, or Go 1.26+, Node 22+ and pnpm.

## Run it with Docker

```sh
git clone https://github.com/Shellworks-Development/workshell
cd workshell
```

Open `docker-compose.yml` and set `WORKSHELL_PUBLIC_URL` to the address your game servers will use, then start it:

```sh
docker compose up -d
```

The Compose file runs Workshell with Redis as a durable ingest queue, and stores data in the `workshell-data` volume.

## Or build from source

```sh
make build        # builds the dashboard into a single binary at bin/workshell
./bin/workshell   # serves on :8080 and stores data in ./data
```

## Create your account and a project

Open `http://localhost:8080`. The first visit asks you to create the admin account. Then create a project; each Roblox experience usually gets its own. The project's **Settings → SDK setup** page has the ingest key and a setup snippet with your URL already filled in.

The dashboard is a progressive web app, so you can open it from your phone at `http://<your-LAN-IP>:8080` and install it to your home screen.

::: warning Roblox can't reach localhost
Game servers run in Roblox's data centres. A live game needs Workshell on a public HTTPS URL. For a quick test, `cloudflared tunnel --url http://localhost:8080` gives you a temporary one. See [Deployment](/self-hosting/deployment) for a permanent setup.
:::

## Look around with simulated traffic

You don't need a game to try it. The simulator sends traffic from mock servers, players and cheaters:

```sh
make sim KEY=wsk_...       # about a week of history, as fast as possible
make sim-live KEY=wsk_...  # mock game servers streaming in real time
```

For the fast backfill, first raise the project's ingest limit under **Settings → Security → Abuse limits**.

## Next

[Install the SDK](/guide/install-sdk) in your game.
