import { existsSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import { icons } from 'lucide'
import { defineConfig, type Plugin } from 'vite'

const pascal = (s: string) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase())
const attrs = (a: Record<string, string | number>) =>
  Object.entries(a)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ')

// GitHub's mark isn't in Lucide (no brand icons), so it's inlined here.
const github =
  '<path fill="currentColor" stroke="none" d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"/>'

const svgIcon = (name: string, cls = '') => {
  const body =
    name === 'github'
      ? github
      : (icons[pascal(name) as keyof typeof icons] as unknown as [string, Record<string, string>][] | undefined)
          ?.map(([tag, a]) => `<${tag} ${attrs(a)}/>`)
          .join('')
  if (!body) throw new Error(`Unknown icon: ${name}`)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cls}" aria-hidden="true">${body}</svg>`
}

/**
 * Inlines Lucide icons at build time: `<icon name="bug" class="size-5"></icon>`
 * becomes an <svg>, so icons are in the HTML and no icon JS ships.
 */
function lucideIcons(): Plugin {
  return {
    name: 'lucide-icons',
    transformIndexHtml(html) {
      return (
        html
          .replace(/<icon name="([a-z0-9-]+)"(?: class="([^"]*)")?><\/icon>/g, (_, name: string, cls = '') => svgIcon(name, cls))
          // <shot name="x" …>: the dashboard screenshot in the visitor's theme.
          .replace(
            /<shot name="([a-z-]+)" width="(\d+)" height="(\d+)" alt="([^"]*)"><\/shot>/g,
            (_, n: string, w: string, h: string, alt: string) => {
              // A tighter crop for phones, when one exists (public/screens/<name>-m-<theme>.webp).
              const phone = existsSync(`public/screens/${n}-m-light.webp`)
                ? `<source srcset="/screens/${n}-m-dark.webp" media="(max-width: 520px) and (prefers-color-scheme: dark)" /><source srcset="/screens/${n}-m-light.webp" media="(max-width: 520px)" />`
                : ''
              return `<picture>${phone}<source srcset="/screens/${n}-dark.webp" media="(prefers-color-scheme: dark)" /><img src="/screens/${n}-light.webp" width="${w}" height="${h}" alt="${alt}" loading="lazy" decoding="async" /></picture>`
            },
          )
          .replace(
            /<copy-btn target="([a-z-]+)"><\/copy-btn>/g,
            (_, id: string) =>
              `<button class="copy-btn" data-copy="${id}" type="button"><span class="copy-icons" aria-hidden="true"><span class="copy-icon icon-copy">${svgIcon('copy')}</span><span class="copy-icon icon-check">${svgIcon('check')}</span></span><span class="copy-label" aria-live="polite">Copy</span></button>`,
          )
      )
    },
  }
}

export default defineConfig({
  plugins: [tailwindcss(), lucideIcons()],
  build: {
    rollupOptions: { input: { main: 'index.html', notFound: '404.html' } },
  },
})
