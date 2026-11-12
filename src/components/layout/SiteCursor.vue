<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { canHover, gsap, prefersReducedMotion } from '@/composables/useMotion'

const dot = ref<HTMLElement>()
const trail = ref<HTMLCanvasElement>()
const label = ref('')
const active = ref(false)
let cleanup = () => {}

onMounted(() => {
  if (!canHover() || prefersReducedMotion() || !dot.value || !trail.value) return
  active.value = true

  // Rastro: guarda os últimos pontos do mouse e desenha uma linha que afina e some em ~0,45s
  const canvas = trail.value
  const g = canvas.getContext('2d')!
  const LIFE = 450
  const points: { x: number; y: number; t: number }[] = []
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = innerWidth * dpr
    canvas.height = innerHeight * dpr
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  const color = '#FF5B2E' // mesmo laranja do --signal-500, em hex para qualquer canvas
  const draw = () => {
    const now = performance.now()
    while (points.length && now - points[0].t > LIFE) points.shift()
    g.clearRect(0, 0, innerWidth, innerHeight)
    g.lineCap = 'round'
    g.strokeStyle = color
    for (let i = 1; i < points.length; i++) {
      const life = 1 - (now - points[i].t) / LIFE
      g.globalAlpha = life * 0.9
      g.lineWidth = 0.5 + life * 2.5
      g.beginPath()
      g.moveTo(points[i - 1].x, points[i - 1].y)
      g.lineTo(points[i].x, points[i].y)
      g.stroke()
    }
  }
  gsap.ticker.add(draw)
  window.addEventListener('resize', resize)

  const xTo = gsap.quickTo(dot.value, 'x', { duration: 0.45, ease: 'power3' })
  const yTo = gsap.quickTo(dot.value, 'y', { duration: 0.45, ease: 'power3' })
  let shown = false
  const move = (e: PointerEvent) => {
    if (!shown) {
      // Só aparece depois do primeiro movimento, já na posição do mouse
      shown = true
      gsap.set(dot.value!, { x: e.clientX, y: e.clientY, autoAlpha: 1 })
    }
    xTo(e.clientX)
    yTo(e.clientY)
    points.push({ x: e.clientX, y: e.clientY, t: performance.now() })
    const el = e.target as Element | null
    const text = el?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? ''
    // Três estados: rótulo (grande), link/botão (anel médio), resto (ponto)
    const state = text ? 'label' : el?.closest('a, button') ? 'link' : 'dot'
    if (text !== label.value || state !== mode) {
      label.value = text
      mode = state
      gsap.to(dot.value!, { scale: state === 'label' ? 1 : state === 'link' ? 0.45 : 0.2, duration: 0.5, ease: 'soft' })
      dot.value!.dataset.mode = state
    }
  }
  let mode = 'dot'
  gsap.set(dot.value, { scale: 0.2, xPercent: -50, yPercent: -50, autoAlpha: 0 })
  window.addEventListener('pointermove', move, { passive: true })
  cleanup = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('resize', resize)
    gsap.ticker.remove(draw)
  }
})
onUnmounted(() => cleanup())
</script>

<template>
  <canvas v-show="active" ref="trail" class="trail" aria-hidden="true" />
  <div v-show="active" ref="dot" class="cursor" :data-labelled="label ? '' : undefined" aria-hidden="true">
    <span class="text">{{ label }}</span>
  </div>
</template>

<style scoped>
@layer components {
  .cursor {
    position: fixed;
    inset-block-start: 0;
    inset-inline-start: 0;
    z-index: var(--z-cursor);
    display: grid;
    place-items: center;
    inline-size: 5.5rem;
    block-size: 5.5rem;
    border-radius: var(--radius-full);
    background: var(--signal-500);
    color: var(--ink-950);
    pointer-events: none;
    will-change: transform;
    transition: background-color var(--dur-base) var(--ease-ui), box-shadow var(--dur-base) var(--ease-ui);
  }
  /* Sobre links: vira um anel vazado que deixa ver o texto */
  .cursor[data-mode="link"] { background: transparent; box-shadow: inset 0 0 0 4px var(--signal-500); }
  .trail { position: fixed; inset: 0; z-index: var(--z-cursor); inline-size: 100%; block-size: 100%; pointer-events: none; }
  .text {
    font: 500 var(--text-xs) / 1 var(--font-mono);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    opacity: 0;
    transition: opacity var(--dur-fast) var(--ease-ui);
  }
  .cursor[data-labelled] .text { opacity: 1; }
}
</style>
