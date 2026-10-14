// VitePress inlines a small script (the dark-mode check) into every page.
// Hash each inline script in the built docs and give /docs/* its own
// Content-Security-Policy that allows exactly those, instead of 'unsafe-inline'.
import { createHash } from 'node:crypto'
import { appendFileSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = 'dist/docs'
const hashes = new Set()
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (p.endsWith('.html')) {
      for (const [, body] of readFileSync(p, 'utf8').matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
        if (body.trim()) hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`)
      }
    }
  }
}
walk(root)

const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].join(' ')}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join('; ')

appendFileSync(
  'dist/_headers',
  `\n/docs/*\n  ! Content-Security-Policy\n  Content-Security-Policy: ${csp}\n\n/docs/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n`,
)
console.log(`docs CSP: ${hashes.size} inline script hash(es)`)
