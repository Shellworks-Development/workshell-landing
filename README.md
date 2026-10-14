# workshell-landing

The website for [Workshell](https://github.com/Shellworks-Development/workshell), self-hosted observability for Roblox games.

A static page built with Vite and Tailwind CSS 4, served by Cloudflare Workers (static assets, no Worker script).

```sh
pnpm install
pnpm dev          # http://localhost:5173 (also on your LAN)
pnpm build        # outputs dist/
pnpm preview      # runs the built site locally with wrangler
pnpm deploy       # builds and deploys to Cloudflare (run `pnpm exec wrangler login` once first)
```

- `index.html` is the page. `<icon name="…">` tags are replaced at build time with inline [Lucide](https://lucide.dev) SVGs (see `vite.config.ts`), so no icon JavaScript ships.
- `public/screens/` has the product screenshots, captured from a demo project with simulated traffic.
- `public/_headers` sets the Content-Security-Policy and cache headers on Cloudflare.

Icons are from Lucide (ISC license). © Shellworks Development.
