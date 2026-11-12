<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import RollText from '@/components/ui/RollText.vue'
import { gsap, lockScroll, prefersReducedMotion, ScrollTrigger, scrollToTarget } from '@/composables/useMotion'
import { profile } from '@/data/content'

const links = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#stack', label: 'Stack' },
  { href: '#trajetoria', label: 'Trajetória' },
  { href: '#contato', label: 'Contato' },
]

const open = ref(false)
const current = ref(0)
const counter = ref<HTMLElement>()
let sectionTriggers: ScrollTrigger[] = []
const compact = ref(false)
const panel = ref<HTMLElement>()
const toggle = ref<HTMLButtonElement>()
let tl: gsap.core.Timeline | null = null
let trigger: ScrollTrigger | null = null

function buildTimeline() {
  if (!panel.value) return
  const items = panel.value.querySelectorAll('.menu-link')
  const extras = panel.value.querySelectorAll('.menu-extra')
  // Menu elíptico (receita R3, landonorris.com)
  tl = gsap
    .timeline({ paused: true })
    .fromTo(panel.value, { clipPath: 'ellipse(120% 0% at 100% 0%)' }, { clipPath: 'ellipse(150% 150% at 100% 0%)', duration: 0.9, ease: 'power3.out' })
    .from(items, { yPercent: 110, duration: 0.7, stagger: 0.06, ease: 'back.out(1.2)' }, 0.2)
    .from(extras, { autoAlpha: 0, y: 12, duration: 0.5, stagger: 0.05, ease: 'soft' }, 0.4)
}

async function setOpen(value: boolean) {
  open.value = value
  lockScroll(value)
  await nextTick()
  if (prefersReducedMotion()) {
    gsap.set(panel.value!, { clipPath: value ? 'none' : 'ellipse(120% 0% at 100% 0%)' })
  } else {
    if (!tl) buildTimeline()
    value ? tl?.timeScale(1).play() : tl?.timeScale(1.6).reverse()
  }
  if (value) panel.value?.querySelector<HTMLElement>('.menu-link a')?.focus()
  else toggle.value?.focus()
}

function go(href: string, label = '') {
  setOpen(false)
  scrollToTarget(href, label)
}

// Contador "02 / 05": troca o número com um pequeno giro quando a seção muda
function setCurrent(i: number) {
  if (i === current.value) return
  const dir = i > current.value ? 1 : -1
  if (!counter.value || prefersReducedMotion()) { current.value = i; return }
  gsap.timeline()
    .to(counter.value, { yPercent: -100 * dir, autoAlpha: 0, duration: 0.2, ease: 'power2.in' })
    .call(() => { current.value = i })
    .fromTo(counter.value, { yPercent: 100 * dir, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'soft' })
}

function onKey(e: KeyboardEvent) {
  if (!open.value) return
  if (e.key === 'Escape') setOpen(false)
  if (e.key === 'Tab' && panel.value) {
    const nodes = [toggle.value, ...panel.value.querySelectorAll<HTMLElement>('a, button')].filter(Boolean) as HTMLElement[]
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
  }
}

onMounted(() => {
  trigger = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => (compact.value = self.scroll() > window.innerHeight * 0.6) })
  // Espera as seções existirem (o header monta antes do <main>)
  requestAnimationFrame(() => {
    sectionTriggers = links.map((link, i) =>
      ScrollTrigger.create({
        trigger: link.href,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => setCurrent(self.isActive ? i + 1 : self.direction < 0 && i === 0 ? 0 : current.value),
      }),
    )
  })
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  trigger?.kill()
  sectionTriggers.forEach((t) => t.kill())
  tl?.kill()
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <header class="header" :data-compact="compact ? '' : undefined">
    <a href="#topo" class="brand" @click.prevent="go('#topo')">
      <span class="brand-mark" aria-hidden="true">&lt;/&gt;</span>
      <span class="brand-roll">
        <span>Paulo Artur</span>
        <span aria-hidden="true">Full Stack Dev</span>
      </span>
      <span class="visually-hidden">, voltar ao topo</span>
    </a>
    <p class="count label" aria-hidden="true">
      <span class="count-clip"><span ref="counter" class="count-now">{{ String(current).padStart(2, '0') }}</span></span>
      <span>/ {{ String(links.length).padStart(2, '0') }}</span>
      <span class="count-name">{{ current ? links[current - 1].label : 'Início' }}</span>
    </p>
    <nav class="nav" aria-label="Seções">
      <ul>
        <li v-for="link in links" :key="link.href">
          <a :href="link.href" @click.prevent="go(link.href, link.label)"><RollText :text="link.label" /></a>
        </li>
      </ul>
    </nav>
  </header>

  <button
    ref="toggle"
    class="menu-toggle"
    type="button"
    :data-visible="compact || open ? '' : undefined"
    :aria-expanded="open"
    aria-controls="menu"
    @click="setOpen(!open)"
  >
    <span class="visually-hidden">{{ open ? 'Fechar menu' : 'Abrir menu' }}</span>
    <span class="bars" :data-open="open ? '' : undefined" aria-hidden="true"><i /><i /></span>
  </button>

  <div id="menu" ref="panel" class="menu" data-theme="dark" :inert="!open" :aria-hidden="!open">
    <div class="menu-inner">
      <p class="label muted menu-extra">Navegação</p>
      <ul class="menu-list">
        <li v-for="(link, i) in links" :key="link.href" class="menu-link">
          <a :href="link.href" @click.prevent="go(link.href, link.label)">
            <span class="menu-index label">0{{ i + 1 }}</span><RollText :text="link.label" />
          </a>
        </li>
      </ul>
      <div class="menu-foot">
        <a class="menu-extra" :href="`mailto:${profile.email}`">{{ profile.email }}</a>
        <a class="menu-extra" :href="profile.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a class="menu-extra" :href="profile.github" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
@layer components {
  .header {
    position: fixed;
    inset-inline: 0;
    inset-block-start: 0;
    z-index: var(--z-header);
    display: flex;
    align-items: center;
    justify-content: space-between;
    block-size: var(--header-h);
    padding-inline: var(--gutter);
    color: var(--paper-50);
    mix-blend-mode: difference;
    pointer-events: none;
  }
  .header > * { pointer-events: auto; }
  .brand { display: flex; align-items: center; gap: var(--space-2); font: 500 var(--text-sm) / 1 var(--font-text); }
  .brand-mark {
    display: inline-block;
    font-size: 1.15em;
    transition: rotate var(--dur-slow) var(--ease-soft);
  }
  .brand-roll { position: relative; display: grid; overflow: clip; }
  .brand-roll > span { grid-area: 1 / 1; transition: translate var(--dur-slow) var(--ease-soft); }
  .brand-roll > span + span { translate: 0 110%; }
  .count { display: none; align-items: center; gap: var(--space-2); margin-inline-end: auto; margin-inline-start: var(--space-12); }
  .count-clip { display: inline-block; overflow: clip; }
  .count-now { display: inline-block; }
  .count-name { margin-inline-start: var(--space-2); opacity: 0.6; }
  @media (width >= 64rem) {
    .count { display: flex; }
  }
  .nav ul { display: none; gap: var(--space-8); font-size: var(--text-sm); }
  .nav a { position: relative; padding-block: var(--space-2); }
  .nav a::after {
    content: "";
    position: absolute;
    inset-inline-start: 50%;
    inset-block-end: -0.2rem;
    inline-size: 0.32rem;
    block-size: 0.32rem;
    border-radius: var(--radius-full);
    background: currentColor;
    translate: -50% 0;
    scale: 0;
    transition: scale var(--dur-base) var(--ease-soft);
  }
  .header[data-compact] .nav { opacity: 0; pointer-events: none; }
  .nav { transition: opacity var(--dur-base) var(--ease-ui); }

  @media (hover: hover) {
    .brand:hover .brand-mark { rotate: 360deg; }
    .brand:hover .brand-roll > span:first-child { translate: 0 -110%; }
    .brand:hover .brand-roll > span + span { translate: 0 0; }
    .nav a:hover::after { scale: 1; }
  }
  @media (width >= 48rem) {
    .nav ul { display: flex; }
  }

  .menu-toggle {
    position: fixed;
    inset-block-start: calc(var(--space-4) - 0.25rem);
    inset-inline-end: var(--gutter);
    z-index: calc(var(--z-menu) + 1);
    display: grid;
    place-items: center;
    inline-size: 3.5rem;
    block-size: 3.5rem;
    border-radius: var(--radius-full);
    background: var(--ink-950);
    box-shadow: 0 0 0 1px oklch(100% 0 0 / 0.1);
    color: var(--paper-100);
    transition: scale var(--dur-base) var(--ease-soft), background-color var(--dur-fast) var(--ease-ui);
  }
  @media (width >= 48rem) {
    .menu-toggle { inline-size: 4.25rem; block-size: 4.25rem; scale: 0; }
    .menu-toggle[data-visible] { scale: 1; }
  }
  @media (hover: hover) {
    .menu-toggle:hover { background: var(--signal-700); }
  }
  .bars { display: grid; gap: 0.4rem; inline-size: 1.4rem; }
  .bars i { display: block; block-size: 1.5px; background: currentColor; transition: translate var(--dur-base) var(--ease-soft), rotate var(--dur-base) var(--ease-soft); }
  .bars[data-open] i:first-child { translate: 0 0.24rem; rotate: 45deg; }
  .bars[data-open] i:last-child { translate: 0 -0.24rem; rotate: -45deg; }

  .menu {
    position: fixed;
    inset: 0;
    z-index: var(--z-menu);
    display: grid;
    padding: calc(var(--header-h) + var(--space-8)) var(--gutter) var(--gutter);
    clip-path: ellipse(120% 0% at 100% 0%);
  }
  .menu-inner { display: grid; grid-template-rows: auto 1fr auto; gap: var(--space-8); inline-size: min(100%, 60rem); margin-inline-start: auto; }
  .menu-list { display: grid; align-content: center; gap: var(--space-2); }
  .menu-link { overflow: clip; }
  .menu-link a {
    display: flex;
    align-items: baseline;
    gap: var(--space-4);
    font: 600 var(--text-2xl) / 1 var(--font-display);
    letter-spacing: var(--tracking-display);
    transition: color var(--dur-fast) var(--ease-ui), translate var(--dur-base) var(--ease-soft);
  }
  .menu-index { color: var(--signal-500); }
  .menu-link a { --roll-hover: var(--signal-500); }
  @media (hover: hover) {
    .menu-link a:hover { color: var(--signal-500); translate: var(--space-4) 0; }
  }
  .menu-foot { display: flex; flex-wrap: wrap; gap: var(--space-2) var(--space-8); padding-block-start: var(--space-6); border-block-start: var(--line); font-size: var(--text-sm); }
  .menu-foot a { color: var(--color-text-muted); transition: color var(--dur-fast) var(--ease-ui); }
  .menu-foot a:hover, .menu-foot a:focus-visible { color: var(--paper-100); }
}
</style>
