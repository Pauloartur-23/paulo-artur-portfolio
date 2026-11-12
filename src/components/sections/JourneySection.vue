<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, prefersReducedMotion } from '@/composables/useMotion'
import { milestones, scene } from '@/data/content'

const root = ref<HTMLElement>()
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!root.value || prefersReducedMotion()) return
  ctx = gsap.context(() => {
    gsap.fromTo('.progress', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 70%', scrub: true } })
    gsap.utils.toArray<HTMLElement>('.step').forEach((step) => {
      gsap.from(step, { autoAlpha: 0, y: 40, duration: 0.9, ease: 'soft', scrollTrigger: { trigger: step, start: 'top 85%', once: true } })
      gsap.from(step.querySelector('.dot'), { scale: 0, duration: 0.5, ease: 'back.out(2)', scrollTrigger: { trigger: step, start: 'top 70%', once: true } })
    })
  }, root.value)
})
onUnmounted(() => ctx?.revert())
</script>

<template>
  <section id="trajetoria" ref="root" class="journey section" data-theme="light" :data-bg="scene.paperDeep" aria-label="Trajetória">
    <div class="container grid">
      <div class="aside">
        <p class="label muted">// 04 — Trajetória</p>
        <h2 class="title" data-reveal="block">Como eu cheguei <em>até aqui</em></h2>
        <p class="muted intro" data-fade>Formação, sala de aula e muito projeto pessoal. Em ordem, do começo até agora.</p>
      </div>

      <div class="steps">
        <span class="rail" aria-hidden="true"><span class="progress" /></span>
        <ol class="step-list">
        <li v-for="(m, i) in milestones" :key="m.title" class="step">
          <span class="dot" aria-hidden="true" />
          <div class="step-meta">
            <span class="label accent">{{ String(i + 1).padStart(2, '0') }} · {{ m.tag }}</span>
          </div>
          <h3>{{ m.title }}</h3>
          <p class="place label muted">{{ m.place }}</p>
          <p>{{ m.text }}</p>
        </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
@layer components {
  .journey { background: var(--paper-200); }
  .aside { grid-column: 1 / -1; display: grid; gap: var(--space-6); align-content: start; }
  .title { font-size: var(--text-3xl); font-weight: 600; }
  .title em { color: var(--color-accent-text); }
  .intro { font-size: var(--text-lg); }

  .steps { position: relative; grid-column: 1 / -1; padding-inline-start: var(--space-12); margin-block-start: var(--space-12); }
  .step-list { display: grid; gap: var(--space-12); }
  .rail { position: absolute; inset-block: 0.5rem 0; inset-inline-start: 0.45rem; inline-size: 1px; background: var(--color-line); }
  .progress { position: absolute; inset: 0; background: var(--signal-700); transform-origin: top; }
  .step { position: relative; display: grid; gap: var(--space-3); }
  .dot {
    position: absolute;
    inset-inline-start: calc(var(--space-12) * -1);
    inset-block-start: 0.15rem;
    inline-size: 0.95rem;
    block-size: 0.95rem;
    border: 2px solid var(--signal-700);
    border-radius: var(--radius-full);
    background: var(--paper-200);
  }
  .step h3 { font-size: var(--text-xl); font-weight: 500; letter-spacing: -0.03em; line-height: 1.05; }
  .place { text-transform: none; letter-spacing: 0.02em; }

  @media (width >= 64rem) {
    .aside { grid-column: 1 / span 5; position: sticky; inset-block-start: calc(var(--header-h) + var(--space-8)); align-self: start; }
    .steps { grid-column: 7 / -1; margin-block-start: 0; }
  }
}
</style>
