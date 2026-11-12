<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import RollText from '@/components/ui/RollText.vue'
import { gsap, onScrollVelocity, prefersReducedMotion, scrollToTarget, SplitText } from '@/composables/useMotion'
import { profile, scene } from '@/data/content'

const links = [
  { label: 'E-mail', detail: profile.email, href: `mailto:${profile.email}`, external: false },
  { label: 'LinkedIn', detail: '/in/paulo-artur-pereira', href: profile.linkedin, external: true },
  { label: 'GitHub', detail: `@${profile.githubUser}`, href: profile.github, external: true },
]

const root = ref<HTMLElement>()
const time = ref('')
const copied = ref(false)
let ctx: gsap.Context | null = null
let clock = 0

function tick() {
  time.value = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }).format(new Date())
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    window.location.href = `mailto:${profile.email}`
  }
}

onMounted(() => {
  tick()
  clock = window.setInterval(tick, 15000)
  if (!root.value || prefersReducedMotion()) return
  const el = root.value
  ctx = gsap.context(() => {
    // E-mail gigante: letras sobem em onda quando entra na tela
    const chars = new SplitText('.email-text', { type: 'chars', mask: 'chars', aria: 'none' }).chars
    gsap.from(chars, { yPercent: 110, duration: 0.9, ease: 'soft', stagger: { amount: 0.5 }, scrollTrigger: { trigger: '.email', start: 'top 90%', once: true } })
    // Linhas dos links se desenham e o conteúdo entra em sequência
    gsap.from('.link-row', { '--line': 0, duration: 1.2, ease: 'curtain', stagger: 0.12, scrollTrigger: { trigger: '.links', start: 'top 88%', once: true } })
    gsap.from('.link-row > *', { yPercent: 100, opacity: 0, duration: 0.8, ease: 'soft', stagger: 0.05, scrollTrigger: { trigger: '.links', start: 'top 88%', once: true } })
    // Nome gigante correndo com a rolagem e inclinando com a velocidade (R13)
    gsap.fromTo('.giant-track', { xPercent: 0 }, { xPercent: -35, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: 0.4 } })
    const skew = gsap.quickTo('.giant-track', 'skewX', { duration: 0.5, ease: 'power3' })
    const off = onScrollVelocity((v) => skew(gsap.utils.clamp(-12, 12, -v * 0.5)))
    gsap.from('.bar > *', { autoAlpha: 0, y: 16, duration: 0.7, ease: 'soft', stagger: 0.08, scrollTrigger: { trigger: '.bar', start: 'top 98%', once: true } })
    return off
  }, el)
})
onUnmounted(() => { ctx?.revert(); clearInterval(clock) })
</script>

<template>
  <footer id="contato" ref="root" class="contact" data-theme="dark" :data-bg="scene.ink" aria-label="Contato">
    <div class="container">
      <div class="top">
        <p class="label muted">// 05 — Contato</p>
        <p class="label"><span class="pulse" aria-hidden="true" />Disponível para projetos</p>
      </div>

      <h2 class="title" data-reveal="slow">Vamos <em>conversar?</em></h2>

      <div class="email">
        <a class="email-link" :href="`mailto:${profile.email}`" data-cursor="Escrever">
          <span class="email-text">{{ profile.email }}</span>
        </a>
        <button type="button" class="copy label" data-cursor="Copiar" @click="copyEmail">
          {{ copied ? 'Copiado ✓' : 'Copiar e-mail' }}
        </button>
        <p class="visually-hidden" aria-live="polite">{{ copied ? 'E-mail copiado para a área de transferência' : '' }}</p>
      </div>

      <ul class="links">
        <li v-for="link in links" :key="link.label">
          <a
            class="link-row"
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
          >
            <span class="link-label"><RollText :text="link.label" /></span>
            <span class="link-detail">{{ link.detail }}</span>
            <span class="link-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
      </ul>
    </div>

    <div class="giant" aria-hidden="true">
      <p class="giant-track">
        <span v-for="n in 3" :key="n">Paulo Artur Pereira<i>✳</i><em>Full Stack</em><i>✳</i></span>
      </p>
    </div>

    <div class="container bar">
      <span>2026 © {{ profile.name }}</span>
      <span><span class="muted">Horário local</span> <time>{{ time }}</time> GMT-3</span>
      <a href="#topo" class="to-top" @click.prevent="scrollToTarget('#topo')"><RollText text="Voltar ao topo ↑" /></a>
    </div>
  </footer>
</template>

<style scoped>
@layer components {
  .contact { position: relative; padding-block: var(--space-section) var(--space-6); overflow: clip; }
  .top { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--space-2) var(--space-6); }
  .pulse {
    display: inline-block;
    inline-size: 0.5rem;
    block-size: 0.5rem;
    margin-inline-end: var(--space-2);
    border-radius: var(--radius-full);
    background: oklch(78% 0.18 150);
  }

  .title {
    margin-block: var(--space-8) var(--space-12);
    font-size: var(--text-display);
    font-weight: 700;
    font-stretch: 80%;
    line-height: 0.85;
    letter-spacing: -0.055em;
  }
  .title em { font-weight: 400; color: var(--signal-500); }

  /* E-mail como a peça principal: grande, com sublinhado que se desenha no hover */
  .email { display: flex; flex-wrap: wrap; align-items: end; gap: var(--space-4) var(--space-8); }
  .email-link {
    position: relative;
    max-inline-size: 100%;
    padding-block-end: var(--space-2);
    font: 500 clamp(1.6rem, 0.6rem + 4.6vw, 5.5rem) / 1.05 var(--font-display);
    letter-spacing: -0.04em;
    overflow-wrap: anywhere;
    transition: color var(--dur-base) var(--ease-ui);
  }
  .email-link::after {
    content: "";
    position: absolute;
    inset: auto 0 0;
    block-size: 2px;
    background: var(--signal-500);
    transform: scaleX(0.15);
    transform-origin: left;
    transition: transform var(--dur-slow) var(--ease-curtain);
  }
  .copy {
    min-block-size: 2.75rem;
    padding-inline: var(--space-4);
    border: var(--line);
    border-radius: var(--radius-full);
    transition: background-color var(--dur-base) var(--ease-ui), color var(--dur-base) var(--ease-ui);
  }
  @media (hover: hover) {
    .email-link:hover { color: var(--signal-500); }
    .email-link:hover::after { transform: scaleX(1); }
    .copy:hover { background: var(--paper-100); color: var(--ink-950); }
  }

  /* Links grandes em linhas */
  .links { margin-block-start: var(--space-16); }
  .link-row {
    --line: 1;
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: var(--space-2) var(--space-6);
    padding-block: var(--space-6);
    overflow: clip;
    isolation: isolate;
    --roll-hover: var(--ink-950);
  }
  .link-row::before {
    content: "";
    position: absolute;
    inset: auto 0 0;
    block-size: 1px;
    background: var(--color-line);
    transform: scaleX(var(--line));
    transform-origin: left;
  }
  .link-row::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: var(--signal-500);
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform var(--dur-slow) var(--ease-curtain);
  }
  .link-label { font: 600 var(--text-2xl) / 1 var(--font-display); letter-spacing: var(--tracking-display); transition: translate var(--dur-slow) var(--ease-soft); }
  .link-detail { grid-column: 1; color: var(--color-text-muted); font: 400 var(--text-sm) / 1.3 var(--font-mono); transition: color var(--dur-base) var(--ease-ui); }
  .link-arrow { grid-row: 1 / span 2; grid-column: 2; font-size: var(--text-2xl); transition: rotate var(--dur-slow) var(--ease-soft), color var(--dur-base) var(--ease-ui); }
  @media (width >= 48rem) {
    .link-row { grid-template-columns: 1fr auto auto; padding-inline: var(--space-4); }
    .link-detail { grid-column: 2; grid-row: 1; }
    .link-arrow { grid-column: 3; grid-row: 1; }
  }
  @media (hover: hover) {
    .link-row:hover { color: var(--ink-950); }
    .link-row:hover::after { transform: scaleY(1); }
    .link-row:hover .link-label { translate: var(--space-4) 0; }
    .link-row:hover .link-detail { color: var(--ink-950); }
    .link-row:hover .link-arrow { rotate: 45deg; }
  }

  /* Nome gigante na base */
  .giant { margin-block: var(--space-section) var(--space-8); overflow: clip; }
  .giant-track {
    display: flex;
    inline-size: max-content;
    max-inline-size: none;
    font: 700 clamp(4rem, 1rem + 13vw, 15rem) / 0.9 var(--font-display);
    font-stretch: 80%;
    letter-spacing: -0.055em;
    white-space: nowrap;
  }
  .giant-track > span { display: inline-flex; align-items: center; gap: 0.25em; padding-inline-end: 0.25em; }
  .giant-track i { font-style: normal; font-size: 0.35em; color: var(--signal-500); }
  .giant-track em { font-weight: 400; -webkit-text-fill-color: transparent; -webkit-text-stroke: 1px var(--paper-300); }

  .bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--space-3) var(--space-8);
    padding-block-start: var(--space-6);
    border-block-start: var(--line);
    font-size: var(--text-sm);
  }
  .to-top { --roll-hover: var(--signal-500); }
}
</style>
