<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import ProjectCase from '@/components/sections/ProjectCase.vue'
import RollText from '@/components/ui/RollText.vue'
import { canHover, gsap, prefersReducedMotion, scrollToTarget } from '@/composables/useMotion'
import { projects, scene } from '@/data/content'

const list = ref<HTMLElement>()
const preview = ref<HTMLElement>()
const activeIndex = ref(-1)
const previewOn = ref(false)
let cleanup = () => {}

// Troca de projeto dentro do cartão: o novo entra por uma cortina de baixo e a imagem desce de um zoom
watch(activeIndex, (i, prev) => {
  if (!preview.value || i < 0) return
  const slides = preview.value.querySelectorAll<HTMLElement>('.slide')
  const next = slides[i]
  if (!next) return
  gsap.set(slides, { zIndex: 0 })
  if (prev !== undefined && prev >= 0 && slides[prev]) gsap.set(slides[prev], { zIndex: 1 })
  gsap.set(next, { zIndex: 2 })
  gsap.fromTo(next, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'curtain', overwrite: true })
  gsap.fromTo(next.querySelector('img'), { scale: 1.3, yPercent: 8 }, { scale: 1, yPercent: 0, duration: 1.1, ease: 'soft', overwrite: true })
})

onMounted(() => {
  if (!canHover() || prefersReducedMotion() || !list.value || !preview.value) return
  const box = preview.value
  previewOn.value = true
  // Cartão flutuante que segue o mouse com atraso (receita R14) e inclina/estica com a velocidade
  const xTo = gsap.quickTo(box, 'x', { duration: 0.9, ease: 'power3' })
  const yTo = gsap.quickTo(box, 'y', { duration: 0.9, ease: 'power3' })
  const rot = gsap.quickTo(box, 'rotation', { duration: 0.8, ease: 'power3' })
  const skew = gsap.quickTo(box, 'skewX', { duration: 0.8, ease: 'power3' })
  gsap.set(box, { xPercent: -50, yPercent: -50, clipPath: 'circle(0% at 50% 50%)' })
  let lastX = 0
  const move = (e: PointerEvent) => {
    const dx = e.clientX - lastX
    lastX = e.clientX
    xTo(e.clientX)
    yTo(e.clientY)
    rot(gsap.utils.clamp(-10, 10, dx * 0.5))
    skew(gsap.utils.clamp(-8, 8, -dx * 0.35))
  }
  const enter = () => gsap.to(box, { clipPath: 'circle(75% at 50% 50%)', duration: 0.8, ease: 'soft', overwrite: 'auto' })
  const leave = () => {
    gsap.to(box, { clipPath: 'circle(0% at 50% 50%)', duration: 0.5, ease: 'power2.in', overwrite: 'auto' })
    activeIndex.value = -1
  }
  window.addEventListener('pointermove', move, { passive: true })
  list.value.addEventListener('pointerenter', enter)
  list.value.addEventListener('pointerleave', leave)
  const el = list.value
  cleanup = () => {
    window.removeEventListener('pointermove', move)
    el.removeEventListener('pointerenter', enter)
    el.removeEventListener('pointerleave', leave)
  }
})
onUnmounted(() => cleanup())
</script>

<template>
  <section id="projetos" class="work" data-theme="dark" aria-label="Projetos">
    <div class="intro container section" :data-bg="scene.ink">
      <div class="intro-head">
        <p class="label muted">// 02 — Projetos selecionados</p>
        <p class="label muted">( {{ String(projects.length).padStart(2, '0') }} )</p>
      </div>
      <h2 class="title" data-reveal="block">Coisas que eu <em>construí</em> de ponta a ponta</h2>

      <ul ref="list" class="index" aria-label="Índice de projetos">
        <li v-for="(p, i) in projects" :key="p.id" @pointerenter="activeIndex = i">
          <a :href="`#${p.id}`" class="row" data-cursor="Abrir" @click.prevent="scrollToTarget(`#${p.id}`, p.name)">
            <span class="row-index label">{{ p.index }}</span>
            <span class="row-name"><RollText :text="p.name" /></span>
            <span class="row-kind">
              <span class="muted">{{ p.kind }}</span>
              <span class="row-stack" aria-hidden="true">{{ p.stack.slice(0, 3).join(' · ') }}</span>
            </span>
            <span class="row-arrow" aria-hidden="true">↘</span>
          </a>
        </li>
      </ul>
    </div>

    <div v-show="previewOn" ref="preview" class="preview" aria-hidden="true">
      <div v-for="p in projects" :key="p.id" class="slide">
        <img :src="p.cover.src" alt="" width="1440" height="900" loading="lazy" decoding="async" />
        <span class="slide-tag label">{{ p.index }} · {{ p.name }}</span>
      </div>
    </div>

    <ProjectCase v-for="(p, i) in projects" :key="p.id" :project="p" :flip="i % 2 === 1" />
  </section>
</template>

<style scoped>
@layer components {
  .intro { padding-block-end: var(--space-12); }
  .intro-head { display: flex; justify-content: space-between; }
  .title {
    max-inline-size: 16ch;
    margin-block: var(--space-8) var(--space-16);
    font-size: var(--text-3xl);
    font-weight: 600;
  }
  .title em { color: var(--signal-500); }

  .index { border-block-start: var(--line); }
  .index li { border-block-end: var(--line); }
  .row { --roll-hover: var(--signal-500); }
  .row {
    position: relative;
    display: grid;
    grid-template-columns: 2.5rem 1fr auto;
    align-items: center;
    gap: var(--space-2) var(--space-4);
    padding-block: var(--space-6);
    isolation: isolate;
    transition: color var(--dur-fast) var(--ease-ui);
  }
  /* Faixa com o tom do projeto que sobe por trás da linha */
  .row::before {
    content: "";
    position: absolute;
    inset: 0 calc(var(--gutter) * -0.5);
    z-index: -1;
    background: oklch(100% 0 0 / 0.05);
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform var(--dur-slow) var(--ease-curtain);
  }
  .row-name {
    font: 600 var(--text-xl) / 1 var(--font-display);
    letter-spacing: -0.035em;
    transition: translate var(--dur-slow) var(--ease-soft);
  }
  /* Tipo do projeto que dá lugar às tecnologias no hover */
  .row-kind { position: relative; display: grid; grid-column: 2; overflow: clip; font-size: var(--text-sm); }
  .row-kind > * { grid-area: 1 / 1; transition: translate var(--dur-slow) var(--ease-soft); }
  .row-stack { translate: 0 110%; color: var(--signal-500); font-family: var(--font-mono); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.06em; align-self: center; }
  .row-arrow { grid-row: 1; grid-column: 3; font-size: var(--text-lg); transition: rotate var(--dur-slow) var(--ease-soft), color var(--dur-fast) var(--ease-ui); }
  @media (width >= 48rem) {
    .row { grid-template-columns: 4rem 1fr auto 3rem; padding-block: var(--space-8); }
    .row-name { font-size: var(--text-2xl); }
    .row-kind { grid-column: 3; grid-row: 1; justify-items: end; text-align: end; }
    .row-arrow { grid-column: 4; justify-self: end; }
  }
  @media (hover: hover) {
    .index:hover .row { color: var(--color-text-muted); }
    .index .row:hover { color: var(--color-text); }
    .row:hover::before { transform: scaleY(1); }
    .row:hover .row-name { translate: var(--space-8) 0; }
    .row:hover .row-kind > :first-child { translate: 0 -110%; }
    .row:hover .row-stack { translate: 0 0; }
    .row:hover .row-arrow { rotate: -45deg; color: var(--signal-500); }
  }

  /* Cartão flutuante com a capa do projeto */
  .preview {
    position: fixed;
    inset-block-start: 0;
    inset-inline-start: 0;
    z-index: var(--z-raised);
    display: grid;
    inline-size: clamp(22rem, 32vw, 34rem);
    aspect-ratio: 16 / 11;
    border-radius: var(--radius-lg);
    box-shadow: 0 3rem 6rem -2rem oklch(0% 0 0 / 0.7);
    pointer-events: none;
    visibility: hidden;
  }
  @media (hover: hover) and (pointer: fine) {
    .preview { visibility: visible; }
  }
  .slide {
    grid-area: 1 / 1;
    background: var(--ink-800);
    display: grid;
    padding: var(--space-4) var(--space-4) 0;
    overflow: clip;
    border-radius: inherit;
  }
  .slide img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    object-position: top;
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  }
  .slide-tag {
    position: absolute;
    inset-inline-start: var(--space-6);
    inset-block-end: var(--space-4);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-full);
    background: oklch(13% 0.008 270 / 0.75);
    backdrop-filter: blur(10px);
    color: var(--paper-100);
  }
}
</style>
