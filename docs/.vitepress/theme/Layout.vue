<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, onMounted, provide } from 'vue'
import { moveIndicator } from './motion'

const { isDark } = useData()

// Place the sidebar indicator once the page has hydrated; route changes move it after that.
onMounted(() => requestAnimationFrame(() => moveIndicator(true)))

// Switching theme reveals the new one as a circle growing from the toggle.
// It's a rare, deliberate action, so it can afford a little delight.
provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  const canAnimate =
    'startViewTransition' in document && !matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!canAnimate) {
    isDark.value = !isDark.value
    return
  }
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready
  document.documentElement.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
    { duration: 420, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', pseudoElement: '::view-transition-new(root)' },
  )
})
</script>

<template>
  <DefaultTheme.Layout>
    <template #sidebar-nav-before>
      <span class="ws-indicator" aria-hidden="true" />
    </template>
  </DefaultTheme.Layout>
</template>
