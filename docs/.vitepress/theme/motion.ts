import type { Router } from 'vitepress'

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/*
 * Two pieces of motion, both tied to navigation (occasional, never on a
 * keyboard shortcut):
 * - the new page's content settles in (spatial: you moved somewhere),
 * - one indicator slides along the sidebar to the active link (state).
 */
export function installMotion(router: Router) {
  const previous = router.onAfterRouteChange
  let first = true
  router.onAfterRouteChange = (to) => {
    previous?.(to)
    // Wait for Vue to render the new page before measuring or animating.
    requestAnimationFrame(() => {
      moveIndicator()
      if (first) {
        first = false
        return
      }
      enterContent()
    })
  }
  addEventListener('resize', () => moveIndicator(true), { passive: true })
  // Groups opening and closing move the active link without a route change.
  document.addEventListener('click', (e) => {
    if ((e.target as Element).closest?.('.VPSidebarItem .item')) setTimeout(() => moveIndicator(), 260)
  })
}

function enterContent() {
  const el = document.querySelector<HTMLElement>('.VPDoc .content-container, .VPPage')
  if (!el) return
  const r = reduced()
  el.animate(
    r ? [{ opacity: 0.4 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
    { duration: r ? 160 : 260, easing: EASE_OUT },
  )
}

// The indicator element is rendered by Layout.vue (inside Vue's tree, so
// hydration stays consistent); this only positions it.
export function moveIndicator(instant = false) {
  const nav = document.querySelector<HTMLElement>('.VPSidebar nav')
  const bar = nav?.querySelector<HTMLElement>('.ws-indicator')
  if (!nav || !bar) return
  const link = nav.querySelector<HTMLElement>('.VPSidebarItem.is-active > .item')
  if (!link || link.offsetParent === null) {
    bar.style.opacity = '0'
    return
  }
  const navBox = nav.getBoundingClientRect()
  const box = link.getBoundingClientRect()
  const y = box.top - navBox.top + nav.scrollTop
  bar.style.transition = instant || reduced() ? 'none' : ''
  bar.style.height = `${box.height}px`
  bar.style.transform = `translateY(${y}px)`
  bar.style.opacity = '1'
}
