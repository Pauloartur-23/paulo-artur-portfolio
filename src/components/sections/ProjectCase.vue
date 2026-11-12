<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import DeviceFrame from '@/components/ui/DeviceFrame.vue'
import { gsap, onScrollVelocity, prefersReducedMotion } from '@/composables/useMotion'
import { profile, type Project } from '@/data/content'

const props = defineProps<{ project: Project; flip: boolean }>()

const root = ref<HTMLElement>()
// Sem domínio inventado: só o nome do projeto na barra do navegador
const address = computed(() => props.project.name.toLowerCase().replace(' ', ' / '))
const strip = computed(() => [props.project.desktop[2], props.project.desktop[3]])
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!root.value || prefersReducedMotion()) return
  ctx = gsap.context(() => {
    const scrub = (trigger: string) => ({ trigger, start: 'top bottom', end: 'bottom top', scrub: true })
    // Colagem em camadas: cada aparelho anda numa velocidade (profundidade)
    gsap.fromTo('.layer--back', { yPercent: 18 }, { yPercent: -12, ease: 'none', scrollTrigger: scrub('.stage') })
    gsap.fromTo('.layer--main', { yPercent: 6 }, { yPercent: -6, ease: 'none', scrollTrigger: scrub('.stage') })
    gsap.fromTo('.layer--phone', { yPercent: 35 }, { yPercent: -25, ease: 'none', scrollTrigger: scrub('.stage') })
    gsap
      .timeline({ scrollTrigger: { trigger: '.stage', start: 'top 75%', once: true } })
      .from('.layer--main', { clipPath: 'inset(100% 0% 0% 0% round 0.75rem)', duration: 1.2, ease: 'curtain' })
      .from('.layer--back', { autoAlpha: 0, x: props.flip ? -60 : 60, duration: 1, ease: 'soft' }, 0.3)
      .from('.layer--phone', { autoAlpha: 0, rotation: props.flip ? -8 : 8, duration: 1, ease: 'soft' }, 0.45)
    // Faixa horizontal ligada ao scroll (receita R13, landonorris.com)
    gsap.fromTo('.strip-track', { xPercent: props.flip ? -18 : 4 }, { xPercent: props.flip ? 4 : -18, ease: 'none', scrollTrigger: scrub('.strip') })
    // A faixa de telas inclina com a velocidade do scroll
    const skew = gsap.quickTo('.strip-track', 'skewX', { duration: 0.5, ease: 'power3' })
    const off = onScrollVelocity((v) => skew(gsap.utils.clamp(-8, 8, -v * 0.35)))
    gsap.from('.feature', { autoAlpha: 0, x: -20, duration: 0.7, stagger: 0.08, ease: 'soft', scrollTrigger: { trigger: '.features', start: 'top 85%', once: true } })
    return off
  }, root.value)
})
onUnmounted(() => ctx?.revert())
</script>

<template>
  <article :id="project.id" ref="root" class="case" :data-flip="flip ? '' : undefined" :aria-labelledby="`${project.id}-title`">
    <div class="container">
      <header class="head">
        <span class="big-index" aria-hidden="true">{{ project.index }}</span>
        <div class="head-text">
          <p class="label accent">{{ project.kind }}</p>
          <h3 :id="`${project.id}-title`" class="name" data-reveal>{{ project.name }}</h3>
          <p class="tagline" data-fade>{{ project.tagline }}</p>
        </div>
      </header>

      <div class="stage">
        <DeviceFrame class="layer layer--back" :shot="project.desktop[1]" :address="address" />
        <DeviceFrame class="layer layer--main" :shot="project.desktop[0]" :address="address" />
        <DeviceFrame class="layer layer--phone" :shot="project.mobile[0]" device="phone" />
      </div>

      <div class="details grid">
        <div class="summary">
          <p class="lead" data-fade>{{ project.summary }}</p>
          <ul class="chips" aria-label="Tecnologias">
            <li v-for="tech in project.stack" :key="tech">{{ tech }}</li>
          </ul>
          <a class="repo" :href="profile.github" target="_blank" rel="noopener noreferrer" data-cursor="GitHub">
            Código no GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
        <ol class="features" aria-label="Principais funcionalidades">
          <li v-for="(f, i) in project.features" :key="f" class="feature">
            <span class="label muted">{{ String(i + 1).padStart(2, '0') }}</span>
            <span>{{ f }}</span>
          </li>
        </ol>
      </div>
    </div>

    <div class="strip" aria-label="Mais telas do projeto">
      <div class="strip-track">
        <DeviceFrame v-for="shot in strip" :key="shot.src" class="strip-item" :shot="shot" :address="address" />
        <DeviceFrame class="strip-item strip-item--phone" :shot="project.mobile[1]" device="phone" />
      </div>
    </div>
  </article>
</template>

<style scoped>
@layer components {
  .case {
    position: relative;
    padding-block: var(--space-section) calc(var(--space-section) * 0.8);
    border-block-start: var(--line);
    overflow: clip;
    isolation: isolate;
  }

  .head { display: grid; gap: var(--space-4); align-items: end; }
  .big-index {
    font: 700 var(--text-display) / 0.75 var(--font-display);
    font-stretch: 80%;
    letter-spacing: -0.06em;
    color: transparent;
    -webkit-text-stroke: 1px oklch(68% 0.2 38 / 0.6);
  }
  .head-text { display: grid; gap: var(--space-4); }
  .name { font-size: var(--text-3xl); font-weight: 600; }
  .tagline { font: 400 var(--text-lg) / 1.3 var(--font-text); color: var(--color-text-muted); }
  @media (width >= 64rem) {
    .head { grid-template-columns: auto 1fr; gap: var(--space-12); }
    .case[data-flip] .head { grid-template-columns: 1fr auto; }
    .case[data-flip] .big-index { order: 2; }
  }

  .stage {
    position: relative;
    margin-block: var(--space-16) var(--space-12);
    aspect-ratio: 16 / 12;
  }
  .stage .layer { position: absolute; }
  .layer--main { inset-inline-start: 0; inset-block-start: 14%; z-index: 2; inline-size: 82%; }
  .layer--back { inset-inline-end: 0; inset-block-start: 0; z-index: 1; inline-size: 62%; filter: brightness(0.75); }
  .layer--phone { inset-inline-end: 3%; inset-block-end: -6%; z-index: 3; inline-size: 24%; }
  .case[data-flip] .layer--main { inset-inline: auto 0; }
  .case[data-flip] .layer--back { inset-inline: 0 auto; }
  .case[data-flip] .layer--phone { inset-inline: 3% auto; }
  @media (width >= 48rem) {
    .stage { aspect-ratio: 16 / 10; margin-block: var(--space-24) var(--space-16); }
    .layer--main { inline-size: 70%; }
    .layer--phone { inline-size: 17%; inset-inline-end: 6%; }
    .case[data-flip] .layer--phone { inset-inline: 6% auto; }
  }

  .details { row-gap: var(--space-12); }
  .summary { grid-column: 1 / -1; display: grid; gap: var(--space-6); align-content: start; }
  .lead { font-size: var(--text-lg); line-height: 1.4; }
  .chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }
  .chips li {
    padding: var(--space-1) var(--space-3);
    border: var(--line);
    border-radius: var(--radius-full);
    font: 400 var(--text-xs) / 1.6 var(--font-mono);
  }
  .repo {
    justify-self: start;
    display: inline-flex;
    gap: var(--space-2);
    padding-block: var(--space-2);
    border-block-end: 1px solid currentColor;
    font-weight: 500;
    transition: color var(--dur-fast) var(--ease-ui), gap var(--dur-base) var(--ease-soft);
  }
  @media (hover: hover) {
    .repo:hover { color: var(--signal-500); gap: var(--space-4); }
  }
  .features { grid-column: 1 / -1; border-block-start: var(--line); }
  .feature {
    display: grid;
    grid-template-columns: 2.5rem 1fr;
    gap: var(--space-4);
    padding-block: var(--space-4);
    border-block-end: var(--line);
  }
  @media (width >= 64rem) {
    .summary { grid-column: 1 / span 6; }
    .features { grid-column: 8 / -1; }
    .case[data-flip] .summary { grid-column: 7 / -1; grid-row: 1; }
    .case[data-flip] .features { grid-column: 1 / span 5; grid-row: 1; }
  }

  .strip { margin-block-start: var(--space-section); overflow: clip; }
  .strip-track { display: flex; align-items: center; gap: var(--gutter); inline-size: max-content; padding-inline: var(--gutter); }
  .strip-item { inline-size: clamp(17rem, 46vw, 44rem); flex: none; }
  .strip-item--phone { inline-size: clamp(8rem, 13vw, 13rem); }
}
</style>
