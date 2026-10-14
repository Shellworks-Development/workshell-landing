import './style.css'

const $ = <T extends Element>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)
const $$ = <T extends Element>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)]

const nav = $<HTMLElement>('[data-nav]')!
const session = $<HTMLElement>('.session')!
const rail = $<HTMLElement>('.rail')!
const fill = $<HTMLElement>('[data-rail-fill]')!
const clock = $<HTMLElement>('[data-clock]')!
const clockTime = $<HTMLElement>('[data-clock-time]')!
const hero = $<HTMLElement>('.hero')!
const heroEvents = $$<HTMLElement>('.hero-events .event')
const chapters = $$<HTMLElement>('.chapter')
const endMark = $<HTMLElement>('.end-mark span')!

/** Every point on the session's timeline, in order: the hero's events, then each chapter. */
type Point = { el: HTMLElement; time: string; y: number }
let points: Point[] = []
let railTop = 0
let railHeight = 0

const pageY = (el: Element) => el.getBoundingClientRect().top + scrollY

// The rail runs from the first event's dot to the "session ended" mark.
function measure() {
  const sessionTop = pageY(session)
  const dotY = (el: HTMLElement) => {
    const before = getComputedStyle(el, '::before')
    return pageY(el) + parseFloat(before.top) + 6
  }
  points = [
    ...heroEvents.map((el) => ({ el, time: el.querySelector('time')?.textContent ?? '', y: dotY(el) })),
    ...chapters.map((el) => ({ el, time: el.dataset.time ?? '', y: dotY(el) })),
  ]
  railTop = points[0]!.y
  const end = pageY(endMark) + 6
  railHeight = Math.max(0, end - railTop)
  rail.style.top = `${railTop - sessionTop}px`
  rail.style.height = `${railHeight}px`
  update()
}

// What "now" is: a line a little below the middle of the screen.
let shown = ''
let tick: ReturnType<typeof setTimeout> | undefined
function update() {
  const now = scrollY + innerHeight * 0.6
  nav.toggleAttribute('data-scrolled', scrollY > 4)
  fill.style.transform = `scaleY(${railHeight ? Math.min(1, Math.max(0, (now - railTop) / railHeight)) : 0})`

  let current: Point | undefined
  for (const p of points) {
    const reached = p.y <= now
    // The hero's events land on their own schedule; chapters land as the clock reaches them.
    if (!heroEvents.includes(p.el)) {
      p.el.toggleAttribute('data-reached', reached)
      // Content reveals once and stays; only the dots follow the clock both ways.
      if (reached) p.el.setAttribute('data-seen', '')
    }
    if (reached) current = p
  }

  // The clock appears once the opening has scrolled away.
  const on = scrollY > hero.offsetHeight * 0.45
  clock.toggleAttribute('data-on', on)
  const t = current?.time ?? points[0]?.time ?? ''
  if (t && t !== shown) {
    shown = t
    clockTime.setAttribute('data-ticking', '')
    clearTimeout(tick)
    tick = setTimeout(() => {
      clockTime.textContent = t
      clockTime.removeAttribute('data-ticking')
    }, 120)
  }
}

let frame = 0
const schedule = () => {
  if (!frame) frame = requestAnimationFrame(() => ((frame = 0), update()))
}
addEventListener('scroll', schedule, { passive: true })
addEventListener('resize', () => requestAnimationFrame(measure))
// Layout settles as fonts and lazy screenshots arrive.
new ResizeObserver(() => requestAnimationFrame(measure)).observe(session)
document.fonts?.ready.then(measure)
measure()

// The opening events light their dots as each one lands (matches the CSS stagger).
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
heroEvents.forEach((el, i) => setTimeout(() => el.setAttribute('data-reached', ''), reduce ? 0 : 160 + i * 260 + 300))

// Copy buttons copy the text of the element named in data-copy.
for (const btn of $$<HTMLButtonElement>('[data-copy]')) {
  let reset: ReturnType<typeof setTimeout> | undefined
  btn.addEventListener('click', async () => {
    const text = document.getElementById(btn.dataset.copy!)?.textContent ?? ''
    try {
      await navigator.clipboard.writeText(text.trim() + '\n')
    } catch {
      return
    }
    const label = btn.querySelector('.copy-label')!
    btn.setAttribute('data-copied', '')
    label.textContent = 'Copied'
    clearTimeout(reset)
    reset = setTimeout(() => {
      btn.removeAttribute('data-copied')
      label.textContent = 'Copy'
    }, 1600)
  })
}

for (const el of $$('[data-year]')) el.textContent = String(new Date().getFullYear())
