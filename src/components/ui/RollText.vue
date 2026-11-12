<script setup lang="ts">
import { computed } from 'vue'

// Texto com duas cópias por letra: no hover do link/botão pai, a de cima sai na
// diagonal e a de baixo entra (receita R2, nk.studio), em CSS puro.
const props = defineProps<{ text: string }>()
const chars = computed(() => [...props.text].map((c) => (c === ' ' ? ' ' : c)))
</script>

<template>
  <span class="roll">
    <span class="visually-hidden">{{ text }}</span>
    <span class="roll-chars" aria-hidden="true">
      <span v-for="(c, i) in chars" :key="i" class="roll-char" :style="{ '--i': i }">
        <span class="roll-top">{{ c }}</span>
        <span class="roll-bottom">{{ c }}</span>
      </span>
    </span>
  </span>
</template>

<style>
@layer components {
  .roll { display: inline-block; }
  .roll-chars { display: inline-flex; white-space: pre; }
  .roll-char {
    position: relative;
    display: inline-block;
    clip-path: inset(-0.05em -0.6em -0.12em -0.6em);
  }
  .roll-top,
  .roll-bottom { display: inline-block; transition: translate 0.52s var(--ease-soft) calc(var(--i) * 22ms); }
  .roll-bottom { position: absolute; inset: 0; translate: -40% 110%; color: var(--roll-hover, currentColor); }
  @media (hover: hover) {
    :is(a, button, .roll-host):hover .roll-top { translate: 40% -110%; }
    :is(a, button, .roll-host):hover .roll-bottom { translate: 0 0; }
  }
  :is(a, button):focus-visible .roll-top { translate: 40% -110%; }
  :is(a, button):focus-visible .roll-bottom { translate: 0 0; }
}
</style>
