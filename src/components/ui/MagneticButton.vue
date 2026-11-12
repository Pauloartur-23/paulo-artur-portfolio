<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import RollText from '@/components/ui/RollText.vue'
import { canHover, gsap, prefersReducedMotion } from '@/composables/useMotion'

// Botão em pílula com seta: preenche da esquerda no hover, a seta sai e volta, e o botão é levemente magnético.
interface Props {
  href?: string
  label: string
  external?: boolean
}
const props = withDefaults(defineProps<Props>(), { external: false })
const emit = defineEmits<{ click: [event: MouseEvent] }>()

const el = ref<HTMLElement>()
let cleanup = () => {}

onMounted(() => {
  if (!canHover() || prefersReducedMotion() || !el.value) return
  const target = el.value
  const mx = gsap.quickTo(target, 'x', { duration: 0.8, ease: 'elastic.out(1, .5)' })
  const my = gsap.quickTo(target, 'y', { duration: 0.8, ease: 'elastic.out(1, .5)' })
  const move = (e: PointerEvent) => {
    const r = target.getBoundingClientRect()
    mx((e.clientX - r.left - r.width / 2) * 0.18)
    my((e.clientY - r.top - r.height / 2) * 0.3)
  }
  const leave = () => { mx(0); my(0) }
  target.addEventListener('pointermove', move)
  target.addEventListener('pointerleave', leave)
  cleanup = () => {
    target.removeEventListener('pointermove', move)
    target.removeEventListener('pointerleave', leave)
  }
})
onUnmounted(() => cleanup())
</script>

<template>
  <component
    :is="props.href ? 'a' : 'button'"
    ref="el"
    class="pill"
    :href="props.href"
    :type="props.href ? undefined : 'button'"
    :target="props.external ? '_blank' : undefined"
    :rel="props.external ? 'noopener noreferrer' : undefined"
    @click="emit('click', $event)"
  >
    <span class="pill-fill" aria-hidden="true" />
    <span class="pill-label"><RollText :text="props.label" /></span>
    <span class="pill-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M5 12h14m0 0-6-6m6 6-6 6" /></svg>
      <svg viewBox="0 0 24 24"><path d="M5 12h14m0 0-6-6m6 6-6 6" /></svg>
    </span>
  </component>
</template>

<style scoped>
@layer components {
  .pill {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--space-6);
    padding: 0.45rem 0.45rem 0.45rem var(--space-8);
    overflow: clip;
    border: var(--line);
    border-radius: var(--radius-full);
    font: 500 var(--text-md) / 1 var(--font-text);
    isolation: isolate;
    transition: color var(--dur-slow) var(--ease-curtain), border-color var(--dur-slow) var(--ease-curtain);
  }
  .pill-fill {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: var(--signal-500);
    border-radius: inherit;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--dur-slow) var(--ease-curtain);
  }
  .pill-icon {
    position: relative;
    display: grid;
    overflow: clip;
    inline-size: 3.25rem;
    aspect-ratio: 1;
    border-radius: var(--radius-full);
    background: var(--signal-500);
    color: var(--ink-950);
    transition: background-color var(--dur-slow) var(--ease-curtain), color var(--dur-slow) var(--ease-curtain), rotate var(--dur-slow) var(--ease-soft);
  }
  .pill-icon svg {
    grid-area: 1 / 1;
    place-self: center;
    inline-size: 1.25rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    transition: translate var(--dur-slow) var(--ease-soft);
  }
  .pill-icon svg + svg { translate: -260% 0; }
  @media (hover: hover) {
    .pill:hover { color: var(--ink-950); border-color: var(--signal-500); }
    .pill:hover .pill-fill { transform: scaleX(1); }
    .pill:hover .pill-icon { background: var(--ink-950); color: var(--paper-100); }
    .pill:hover .pill-icon svg:first-child { translate: 260% 0; }
    .pill:hover .pill-icon svg + svg { translate: 0 0; }
  }
  .pill:focus-visible .pill-fill { transform: scaleX(1); }
  .pill:focus-visible { color: var(--ink-950); }
}
</style>
