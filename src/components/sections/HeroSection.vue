<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
// Ficam em /public para o index.html pré-carregar a imagem do LCP
const portrait = '/images/paulo-retrato.webp'
const portraitSm = '/images/paulo-retrato-sm.webp'
import { canHover, gsap, onScrollVelocity, prefersReducedMotion, scrollToTarget, SplitText } from '@/composables/useMotion'
import { profile, scene } from '@/data/content'

const props = defineProps<{ ready: boolean }>()

const root = ref<HTMLElement>()
const words = ['último pixel', 'deploy', 'detalhe']
const word = ref(words[0])
const time = ref('')
let ctx: gsap.Context | null = null
let clock = 0
let rotator = 0

function tick() {
  time.value = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }).format(new Date())
}

function playIntro() {
  if (!root.value || prefersReducedMotion()) return
  const el = root.value
  ctx = gsap.context(() => {
    // Entrada: "Paulo Artur" abre numa elipse com as letras subindo do centro (R1b, landonorris.com);
    // "Pereira" vazado tomba letra por letra; a foto sobe saindo do desfoque.
    const lineA = el.querySelector<HTMLElement>('.name-line--a')!
    const charsA = new SplitText(lineA, { type: 'chars', aria: 'none' }).chars
    const charsB = new SplitText('.name-line--b', { type: 'chars', aria: 'none' }).chars
    gsap
      .timeline({ defaults: { ease: 'power2.inOut' }, onComplete: () => gsap.set(lineA, { clearProps: 'clipPath' }) })
      .fromTo(lineA, { clipPath: 'ellipse(20% 0% at 50% 100%)' }, { clipPath: 'ellipse(100% 140% at 50% 100%)', duration: 1.5 }, 0)
      .from(charsA, { yPercent: 45, duration: 1.5, stagger: { amount: 0.02 * charsA.length, from: 'center' } }, 0)
      .from(charsB, { yPercent: 70, rotationX: -90, autoAlpha: 0, transformOrigin: '50% 100% -20px', duration: 1.1, stagger: 0.06, ease: 'soft' }, 0.45)
      .from('.portrait img', { yPercent: 18, scale: 1.08, autoAlpha: 0, duration: 1.8, ease: 'soft' }, 0.15)
      .from('.hero-meta > *, .role > *', { clipPath: 'inset(0 0 100% 0)', yPercent: 60, duration: 0.9, stagger: 0.07, ease: 'soft' }, 0.8)
      .from('.badge', { scale: 0, rotation: -120, duration: 1.1, ease: 'back.out(1.4)' }, 1)
      .from('.mark', { scale: 0, transformOrigin: 'center', duration: 0.7, stagger: 0.05, ease: 'back.out(2)' }, 0.7)
      .from('.grid-bg', { autoAlpha: 0, scale: 1.1, duration: 1.6, ease: 'soft' }, 0)

    // Selo "role para conhecer" gira sem parar e acelera com a rolagem
    const spin = gsap.to('.badge-text', { rotation: 360, duration: 14, ease: 'none', repeat: -1, transformOrigin: '50% 50%' })
    const off = onScrollVelocity((v) => gsap.to(spin, { timeScale: 1 + Math.min(Math.abs(v) * 0.4, 6), duration: 0.3, overwrite: true }))

    const mm = gsap.matchMedia()
    // Computador: o Hero trava, o nome se abre, a foto se afasta e no fim tudo vira um cartão
    mm.add('(width >= 48rem)', () => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top top', end: '+=100%', pin: true, scrub: 0.6, refreshPriority: 1 } })
        .to('.name-line--a', { xPercent: -22, ease: 'none', duration: 1 }, 0)
        .to('.name-line--b', { xPercent: 22, ease: 'none', duration: 1 }, 0)
        .to('.portrait', { scale: 0.82, yPercent: 8, transformOrigin: '50% 100%', ease: 'none', duration: 1 }, 0)
        .to('.hero-meta, .hero-foot, .mark', { autoAlpha: 0, y: -30, ease: 'none', duration: 0.6 }, 0)
        .to('.grid-bg', { scale: 1.25, autoAlpha: 0, ease: 'none', duration: 0.8 }, 0)
        .fromTo(el, { clipPath: 'inset(0% 0% 0% 0% round 0rem)' }, { clipPath: 'inset(3% 2.5% 3% 2.5% round 2rem)', ease: 'power1.inOut', duration: 0.5 }, 0.7)
        .to('.hero-inner', { scale: 0.94, ease: 'power1.inOut', duration: 0.5 }, 0.7)
    })
    // Celular: sem travar, só o parallax leve
    mm.add('(width < 48rem)', () => {
      const st = { trigger: el, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.name-line--a', { xPercent: -12, ease: 'none', scrollTrigger: st })
      gsap.to('.portrait', { yPercent: 10, scale: 0.94, transformOrigin: '50% 100%', ease: 'none', scrollTrigger: st })
    })

    // Mouse: só o nome e a grade andam em camadas; a foto fica parada
    let offMouse = () => {}
    if (canHover()) {
      const to = (sel: string, prop: string, d = 1.2) => gsap.quickTo(sel, prop, { duration: d, ease: 'power3' })
      const layers = [
        { x: to('.name-line--a', 'x'), y: to('.name-line--a', 'y'), d: -34 },
        { x: to('.name-line--b', 'x'), y: to('.name-line--b', 'y'), d: 34 },
        { x: to('.grid-bg', 'x'), y: to('.grid-bg', 'y'), d: -10 },
      ]
      const move = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        layers.forEach((l) => { l.x(nx * l.d); l.y(ny * l.d * 0.5) })
      }
      el.addEventListener('pointermove', move)
      offMouse = () => el.removeEventListener('pointermove', move)
    }
    return () => { off(); offMouse() }
  }, el)

  rotator = window.setInterval(() => {
    const target = el.querySelector('.rotating')
    if (!target) return
    gsap
      .timeline()
      .to(target, { yPercent: -60, autoAlpha: 0, duration: 0.35, ease: 'power2.in' })
      .call(() => { word.value = words[(words.indexOf(word.value) + 1) % words.length] })
      .fromTo(target, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'soft' })
  }, 2800)
}

watch(() => props.ready, (r) => r && playIntro())
onMounted(() => { tick(); clock = window.setInterval(tick, 15000) })
onUnmounted(() => { ctx?.revert(); clearInterval(clock); clearInterval(rotator) })
</script>

<template>
  <section id="topo" ref="root" class="hero" data-theme="light" :data-bg="scene.ink" aria-label="Início">
    <!-- data-bg = ink: o Sobre já nasce escuro, emendando com o "cartão" da saída -->
    <div class="grid-bg" aria-hidden="true" />
    <span class="mark mark--tl" aria-hidden="true" />
    <span class="mark mark--tr" aria-hidden="true" />
    <span class="mark mark--bl" aria-hidden="true" />
    <span class="mark mark--br" aria-hidden="true" />

    <div class="hero-inner">
      <div class="hero-meta">
        <p class="label"><span class="pulse" aria-hidden="true" />Disponível para novos projetos</p>
        <p class="label muted">{{ profile.location }} · <time>{{ time }}</time></p>
      </div>

      <h1 class="name">
        <span class="name-line name-line--a" aria-hidden="true">Paulo Artur</span>
        <span class="name-line name-line--b" aria-hidden="true">Pereira</span>
        <span class="visually-hidden">{{ profile.name }}, {{ profile.role }}</span>
      </h1>

      <figure class="portrait">
        <img
          :src="portrait"
          :srcset="`${portraitSm} 600w, ${portrait} 1100w`"
          sizes="(width >= 48rem) 40vw, 60vw"
          width="1100"
          height="1575"
          alt="Paulo Artur sorrindo, de óculos e braços cruzados, com camiseta preta"
          decoding="async"
          fetchpriority="high"
        />
      </figure>

      <div class="hero-foot">
        <p class="role">
          <span class="label accent">( Desenvolvedor Full Stack )</span>
          <span class="statement">Do banco de dados ao <span class="rotating serif">{{ word }}</span>.</span>
        </p>
        <a class="badge" href="#sobre" data-cursor="Rolar" @click.prevent="scrollToTarget('#sobre')">
          <span class="visually-hidden">Role para conhecer</span>
          <svg class="badge-text" viewBox="0 0 120 120" aria-hidden="true">
            <defs><path id="badge-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs>
            <text textLength="286" lengthAdjust="spacing"><textPath href="#badge-circle" textLength="286" lengthAdjust="spacing">Role para conhecer ·</textPath></text>
          </svg>
          <svg class="badge-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14m0 0-6-6m6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
@layer components {
  .hero {
    position: relative;
    min-block-size: 100svh;
    overflow: clip;
    isolation: isolate;
  }
  /* Grade de "prancheta": a assinatura de engenharia do site */
  .grid-bg {
    position: absolute;
    inset: 0;
    z-index: -1;
    background-image:
      linear-gradient(to right, var(--color-line) 1px, transparent 1px),
      linear-gradient(to bottom, var(--color-line) 1px, transparent 1px);
    background-size: calc((100% - 2 * var(--gutter)) / 6) 6rem;
    background-position: var(--gutter) 0;
    opacity: 0.45;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, black, transparent);
  }
  .mark { position: absolute; inline-size: 0.9rem; block-size: 0.9rem; border-color: var(--color-text); border-style: solid; border-width: 0; }
  .mark--tl { inset: calc(var(--header-h) + var(--space-2)) auto auto var(--gutter); border-block-start-width: 1px; border-inline-start-width: 1px; }
  .mark--tr { inset: calc(var(--header-h) + var(--space-2)) var(--gutter) auto auto; border-block-start-width: 1px; border-inline-end-width: 1px; }
  .mark--bl { inset: auto auto var(--space-4) var(--gutter); border-block-end-width: 1px; border-inline-start-width: 1px; }
  .mark--br { inset: auto var(--gutter) var(--space-4) auto; border-block-end-width: 1px; border-inline-end-width: 1px; }

  .hero-inner {
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-block-size: 100svh;
    padding: calc(var(--header-h) + var(--space-8)) var(--gutter) var(--space-12);
  }
  .hero-meta { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--space-2) var(--space-6); }
  .pulse {
    display: inline-block;
    inline-size: 0.5rem;
    block-size: 0.5rem;
    margin-inline-end: var(--space-2);
    border-radius: var(--radius-full);
    background: var(--signal-500);
  }

  .name {
    display: grid;
    align-content: start;
    margin-block: var(--space-8) var(--space-6);
    font-size: var(--text-display);
    font-weight: 700;
    font-stretch: 80%;
    line-height: 0.82;
    letter-spacing: -0.055em;
    pointer-events: none;
  }
  .name-line { position: relative; display: block; white-space: nowrap; }
  .name-line--a { z-index: 1; }
  .name-line--b { z-index: 3; justify-self: end; color: transparent; -webkit-text-stroke: 1.5px var(--color-text); }

  /* Recorte sem fundo saindo da base da tela: nome atrás, sobrenome vazado na frente */
  .portrait {
    position: absolute;
    z-index: 2;
    inset-block-end: 0;
    inset-inline-start: 50%;
    block-size: min(56svh, 34rem);
    aspect-ratio: 1100 / 1575;
    translate: -50% 0;
    pointer-events: none;
  }
  .portrait img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: contain;
    object-position: bottom;
    filter: drop-shadow(0 2rem 3rem oklch(17% 0.008 270 / 0.18));
  }

  .hero-foot {
    position: relative;
    z-index: 3;
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    justify-content: space-between;
    gap: var(--space-6);
  }
  .role { display: grid; gap: var(--space-3); max-inline-size: 30rem; }
  .statement { font: 500 var(--text-xl) / 1.05 var(--font-display); letter-spacing: -0.03em; }
  .rotating { display: inline-block; color: var(--color-accent-text); }

  /* Selo circular "role para conhecer" */
  .badge {
    position: relative;
    display: grid;
    place-items: center;
    inline-size: 7.5rem;
    aspect-ratio: 1;
    border-radius: var(--radius-full);
    transition: background-color var(--dur-base) var(--ease-ui), color var(--dur-base) var(--ease-ui);
  }
  .badge-text { position: absolute; inset: 0; font: 500 0.6rem / 1 var(--font-mono); letter-spacing: 0.24em; text-transform: uppercase; fill: currentColor; }
  .badge-arrow { inline-size: 1.4rem; animation: nudge 2.4s var(--ease-soft) infinite; }
  @media (hover: hover) {
    .badge:hover { background: var(--ink-900); color: var(--paper-100); }
  }
  @keyframes nudge { 0%, 60%, 100% { translate: 0 0; } 30% { translate: 0 0.35rem; } }

  /* Celular: nome e frase em cima, foto ocupando a base sem cobrir o texto */
  @media (width < 48rem) {
    .hero-inner { grid-template-rows: auto auto auto 1fr; }
    .hero-foot { order: 2; }
    .badge { display: none; }
    .name-line--b { justify-self: start; }
  }
  @media (width >= 48rem) {
    .portrait { block-size: min(84svh, 58rem); }
    .name { align-content: center; margin-block: var(--space-12) var(--space-8); }
  }
}
</style>
