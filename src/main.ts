import './style.css'

// Nav gets a surface once the page scrolls (a sentinel at the top, no scroll listener).
const nav = document.querySelector<HTMLElement>('.nav')
const sentinel = document.getElementById('top-sentinel')
if (nav && sentinel) {
  new IntersectionObserver(([e]) => nav.toggleAttribute('data-scrolled', !e!.isIntersecting)).observe(sentinel)
}

// Sections reveal once as they enter the viewport.
const reveal = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      e.target.setAttribute('data-visible', '')
      reveal.unobserve(e.target)
    }
  },
  { rootMargin: '0px 0px -80px 0px' },
)
document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el))

// Copy buttons copy the text of the element named in data-copy.
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  let timer: ReturnType<typeof setTimeout> | undefined
  btn.addEventListener('click', async () => {
    const text = document.getElementById(btn.dataset.copy!)?.textContent ?? ''
    try {
      await navigator.clipboard.writeText(text.trim() + '\n')
    } catch {
      return
    }
    btn.setAttribute('data-copied', '')
    btn.querySelector('.copy-label')!.textContent = 'Copied'
    clearTimeout(timer)
    timer = setTimeout(() => {
      btn.removeAttribute('data-copied')
      btn.querySelector('.copy-label')!.textContent = 'Copy'
    }, 1600)
  })
})

const year = document.getElementById('year')
if (year) year.textContent = String(new Date().getFullYear())
