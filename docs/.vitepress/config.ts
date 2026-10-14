import { defineConfig } from 'vitepress'

const repo = 'https://github.com/Shellworks-Development/workshell'

// The docs are served from the landing site's /docs/ path (one Worker, one
// domain); `pnpm build` writes them into dist/docs next to the landing page.
export default defineConfig({
  base: '/docs/',
  outDir: '../dist/docs',
  cleanUrls: true,
  lang: 'en',
  title: 'Workshell',
  titleTemplate: ':title · Workshell docs',
  description: 'Install, configure and self-host Workshell, error tracking and session replay for Roblox games.',
  lastUpdated: true,
  // Site data and the page hash map go in a chunk instead of an inline script,
  // which keeps the Content-Security-Policy tight.
  metaChunk: true,
  head: [
    ['link', { rel: 'icon', href: '/docs/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#f6f6f3' }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#18181b' }],
    ['meta', { property: 'og:image', content: 'https://workshell.shellworks.dev/og.png' }],
  ],
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark-dimmed' },
  },
  themeConfig: {
    logo: { src: '/favicon.svg', width: 24, height: 24, alt: '' },
    siteTitle: 'Workshell',
    externalLinkIcon: false,
    nav: [
      { text: 'Guide', link: '/guide/quick-start', activeMatch: '^/guide/' },
      { text: 'Features', link: '/features/issues', activeMatch: '^/features/' },
      { text: 'SDK', link: '/sdk/reference', activeMatch: '^/sdk/' },
      { text: 'Self-hosting', link: '/self-hosting/deployment', activeMatch: '^/self-hosting/' },
      { text: 'Home', link: 'https://workshell.shellworks.dev/', target: '_self' },
    ],
    sidebar: [
      {
        text: 'Get started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Quick start', link: '/guide/quick-start' },
          { text: 'Install the SDK', link: '/guide/install-sdk' },
          { text: 'Releases and Rojo', link: '/guide/releases' },
        ],
      },
      {
        text: 'Features',
        items: [
          { text: 'Issues', link: '/features/issues' },
          { text: 'Logs', link: '/features/logs' },
          { text: 'Sessions and players', link: '/features/sessions' },
          { text: 'Performance and traces', link: '/features/performance' },
          { text: 'Security and exploits', link: '/features/security' },
          { text: 'Analytics and alerts', link: '/features/analytics' },
          { text: 'Whiteboards', link: '/features/whiteboards' },
          { text: 'Privacy and data erasure', link: '/features/privacy' },
        ],
      },
      {
        text: 'SDK',
        items: [
          { text: 'API reference', link: '/sdk/reference' },
          { text: 'Options', link: '/sdk/options' },
        ],
      },
      {
        text: 'Self-hosting',
        items: [
          { text: 'Deployment', link: '/self-hosting/deployment' },
          { text: 'Configuration', link: '/self-hosting/configuration' },
          { text: 'Capacity', link: '/self-hosting/capacity' },
          { text: 'Ingest API', link: '/self-hosting/ingest-api' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: repo, ariaLabel: 'Workshell on GitHub' }],
    editLink: { pattern: 'https://github.com/Shellworks-Development/workshell-landing/edit/main/docs/:path', text: 'Edit this page' },
    search: { provider: 'local' },
    outline: { level: [2, 3], label: 'On this page' },
    footer: {
      message: 'Source available under the <a href="https://github.com/Shellworks-Development/workshell/blob/master/LICENSE">PolyForm Shield 1.0.0</a> license.',
      copyright: '© Shellworks Development',
    },
  },
})
