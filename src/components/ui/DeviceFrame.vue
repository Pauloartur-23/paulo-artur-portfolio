<script setup lang="ts">
import type { Shot } from '@/data/content'

interface Props {
  shot: Shot
  device?: 'browser' | 'phone'
  address?: string
  eager?: boolean
}
withDefaults(defineProps<Props>(), { device: 'browser', address: '', eager: false })
</script>

<template>
  <figure class="frame" :data-device="device">
    <div v-if="device === 'browser'" class="bar" aria-hidden="true">
      <i /><i /><i />
      <span class="address">{{ address }}</span>
    </div>
    <span v-else class="notch" aria-hidden="true" />
    <img
      :src="shot.src"
      :alt="shot.alt"
      :width="device === 'browser' ? 1440 : 390"
      :height="device === 'browser' ? 900 : 844"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
    />
  </figure>
</template>

<style scoped>
@layer components {
  .frame {
    position: relative;
    overflow: clip;
    background: var(--ink-950);
    box-shadow: 0 2.5rem 5rem -1.5rem oklch(0% 0 0 / 0.55), 0 0 0 1px oklch(100% 0 0 / 0.08);
  }
  .frame img { inline-size: 100%; block-size: auto; }
  .frame[data-device="browser"] { border-radius: var(--radius-md); }
  .bar {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.55rem 0.75rem;
    background: var(--ink-800);
  }
  .bar i { inline-size: 0.5rem; block-size: 0.5rem; border-radius: var(--radius-full); background: var(--ink-700); }
  .address {
    flex: 1;
    max-inline-size: 16rem;
    margin-inline: auto;
    padding: 0.15rem 0.75rem;
    border-radius: var(--radius-full);
    background: var(--ink-900);
    color: var(--paper-300);
    font: 400 0.65rem / 1.4 var(--font-mono);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .frame[data-device="phone"] {
    padding: 0.45rem;
    border-radius: 2.2rem;
    background: var(--ink-950);
  }
  .frame[data-device="phone"] img { border-radius: 1.8rem; }
  .notch {
    position: absolute;
    inset-block-start: 0.85rem;
    inset-inline-start: 50%;
    z-index: 1;
    inline-size: 28%;
    block-size: 0.95rem;
    border-radius: var(--radius-full);
    background: var(--ink-950);
    translate: -50% 0;
  }
}
</style>
