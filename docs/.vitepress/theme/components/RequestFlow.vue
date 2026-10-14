<script setup lang="ts">
/* How telemetry moves: the game server batches, Workshell writes, the
   dashboard streams. Packets travel each link so the direction reads at a
   glance (explanatory motion; static under reduced motion). */
const nodes = [
  { name: 'Game server', sub: 'Luau SDK', detail: 'Batches errors, logs, sessions and spans.' },
  { name: 'Workshell', sub: 'one Go binary', detail: 'Checks signatures, rate-limits, groups.' },
  { name: 'SQLite', sub: 'one file', detail: 'The only thing to back up.' },
  { name: 'Dashboard', sub: 'browser or PWA', detail: 'Live over server-sent events.' },
]
const links = ['5 s', 'writes', 'live']
</script>

<template>
  <figure class="ws-flow" aria-label="Telemetry flows from the Roblox game server, through Workshell into SQLite, and out to the dashboard.">
    <template v-for="(n, i) in nodes" :key="n.name">
      <div class="ws-flow-node" :style="{ '--i': i }">
        <span class="ws-flow-name">{{ n.name }}</span>
        <span class="ws-flow-sub">{{ n.sub }}</span>
        <span class="ws-flow-detail">{{ n.detail }}</span>
      </div>
      <div v-if="i < links.length" class="ws-flow-link" :style="{ '--i': i }" aria-hidden="true">
        <span class="ws-flow-track"><span class="ws-flow-packet" /><span class="ws-flow-packet" /></span>
        <span class="ws-flow-label">{{ links[i] }}</span>
      </div>
    </template>
  </figure>
</template>
