<script setup lang="ts">
import { withBase } from 'vitepress'
/* A numbered path through the docs: a rail with a dot per step, the same
   spine the landing page uses for a player's session. */
defineProps<{ steps: { title: string; text: string; link: string; time?: string }[] }>()
</script>

<template>
  <ol class="ws-steps">
    <li v-for="(s, i) in steps" :key="s.link" :style="{ '--i': i }">
      <a :href="withBase(s.link)">
        <span class="ws-step-time">{{ s.time ?? `0${i + 1}` }}</span>
        <span class="ws-step-title">{{ s.title }}</span>
        <span class="ws-step-text">{{ s.text }}</span>
      </a>
    </li>
  </ol>
</template>
