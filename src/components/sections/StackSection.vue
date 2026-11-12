<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, onScrollVelocity, prefersReducedMotion } from '@/composables/useMotion'
import { marqueeWords, scene, skillGroups } from '@/data/content'

const root = ref<HTMLElement>()
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!root.value || prefersReducedMotion()) return
  ctx = gsap.context(() => {
    const st = { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: 0 }
    gsap.fromTo('.marquee-row--a', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: st })
    gsap.fromTo('.marquee-row--b', { xPercent: -30 }, { xPercent: 0, ease: 'none', scrollTrigger: st })
    // Inércia: as faixas inclinam conforme a velocidade do scroll (receita R13)
    const skew = gsap.quickTo('.marquee-row', 'skewX', { duration: 0.5, ease: 'power3' })
    const off = onScrollVelocity((v) => skew(gsap.utils.clamp(-10, 10, -v * 0.5)))
    gsap.from('.group', { autoAlpha: 0, y: 40, duration: 0.9, stagger: 0.12, ease: 'soft', scrollTrigger: { trigger: '.groups', start: 'top 85%', once: true } })
    return off
  }, root.value)
})
onUnmounted(() => ctx?.revert())
</script>

<template>
  <section id="stack" ref="root" class="stack section" data-theme="light" :data-bg="scene.paper" aria-label="Stack">
    <div class="container head">
      <p class="label muted">// 03 — Tecnologias</p>
      <h2 class="title" data-reveal="block">Ferramentas que eu uso <em>todo dia</em></h2>
    </div>

    <div class="marquee" aria-hidden="true">
      <p v-for="row in ['a', 'b']" :key="row" class="marquee-row" :class="`marquee-row--${row}`">
        <template v-for="n in 2" :key="n">
          <span v-for="(w, i) in marqueeWords" :key="`${n}-${w}`" class="word" :class="{ serif: (i + (row === 'b' ? 1 : 0)) % 2 === 1 }">
            {{ w }}<span class="star">✳</span>
          </span>
        </template>
      </p>
    </div>

    <div class="container groups">
      <div v-for="(g, i) in skillGroups" :key="g.title" class="group">
        <div class="group-head">
          <span class="label accent">0{{ i + 1 }}</span>
          <h3>{{ g.title }}</h3>
          <p class="muted">{{ g.note }}</p>
        </div>
        <ul>
          <li v-for="item in g.items" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
@layer components {
  .title { max-inline-size: 14ch; margin-block: var(--space-8) var(--space-12); font-size: var(--text-3xl); font-weight: 600; }
  .title em { color: var(--color-accent-text); }

  .marquee { display: grid; gap: var(--space-2); padding-block: var(--space-8); overflow: clip; rotate: -2deg; margin-inline: -2vw; }
  .marquee-row {
    display: flex;
    gap: var(--space-6);
    inline-size: max-content;
    max-inline-size: none;
    font: 600 var(--text-3xl) / 1 var(--font-display);
    letter-spacing: var(--tracking-display);
    white-space: nowrap;
  }
  /* color fica com a cor do texto (contraste correto para leitores); o preenchimento some via text-fill */
  .marquee-row--b { -webkit-text-fill-color: transparent; -webkit-text-stroke: 1px var(--color-text); }
  .word { display: inline-flex; align-items: center; gap: var(--space-6); }
  .word.serif { font-family: var(--font-serif); font-style: italic; font-weight: 400; letter-spacing: -0.02em; }
  .star { font-size: 0.45em; color: var(--signal-500); -webkit-text-stroke: 0; }

  .groups { display: grid; gap: var(--space-12); margin-block-start: var(--space-16); }
  .group { display: grid; gap: var(--space-6); align-content: start; padding-block-start: var(--space-6); border-block-start: 1px solid var(--color-text); }
  .group-head { display: grid; gap: var(--space-2); }
  .group h3 { font-size: var(--text-xl); font-weight: 500; letter-spacing: -0.03em; }
  .group ul { display: grid; }
  .group li {
    position: relative;
    padding-block: var(--space-3);
    border-block-end: var(--line);
    font-size: var(--text-lg);
    transition: padding var(--dur-base) var(--ease-soft), color var(--dur-fast) var(--ease-ui);
  }
  .group li::before {
    content: "→";
    position: absolute;
    inset-inline-start: 0;
    color: var(--color-accent-text);
    opacity: 0;
    transition: opacity var(--dur-fast) var(--ease-ui);
  }
  @media (hover: hover) {
    .group li:hover { padding-inline-start: var(--space-8); }
    .group li:hover::before { opacity: 1; }
  }
  @media (width >= 48rem) {
    .groups { grid-template-columns: repeat(3, 1fr); gap: var(--gutter); }
  }
}
</style>
