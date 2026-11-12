import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
// Uma curva para o site inteiro (nk.studio) e uma para cortinas (landonorris.com)
CustomEase.create('soft', '.18,1,.32,1')
CustomEase.create('curtain', '.65,.05,0,1')

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

let lenis: Lenis | null = null

export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    anchors: { offset: 0 },
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis?.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

/** Chama `cb` com a velocidade do scroll (px por frame). Devolve a função que desliga. */
export function onScrollVelocity(cb: (velocity: number) => void) {
  if (!lenis) return () => {}
  return lenis.on('scroll', (l: Lenis) => cb(l.velocity))
}

function smoothScroll(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { duration: 1.4, easing: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) })
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

let curtain: HTMLElement | null = null
let curtainBusy = false
const NAV_ORDER = ['topo', 'sobre', 'projetos', 'stack', 'trajetoria', 'contato']

function buildCurtain() {
  const node = Object.assign(document.createElement('div'), { className: 'curtain' })
  node.setAttribute('aria-hidden', 'true')
  node.innerHTML = `
    <div class="curtain-a"></div>
    <div class="curtain-b">
      <p class="curtain-top"><span class="curtain-num"></span><span>Paulo Artur — Portfólio</span></p>
      <p class="curtain-name"></p>
      <p class="curtain-foot"><span>Carregando seção</span><span class="curtain-bar"><i></i></span></p>
    </div>`
  document.body.appendChild(node)
  return node
}

/**
 * Leva até a seção. Longe da posição atual, cobre a tela com duas cortinas
 * (laranja e grafite, receitas R5b/R11), mostra número e nome da seção letra a letra,
 * pula e descobre de baixo para cima. Perto, só rola suave.
 */
export function scrollToTarget(target: string | HTMLElement, label = '') {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!el) return
  const far = Math.abs(el.getBoundingClientRect().top) > window.innerHeight * 1.5
  if (!far || !lenis || prefersReducedMotion() || curtainBusy) return smoothScroll(el)

  curtain ??= buildCurtain()
  const c = curtain
  const name = label || el.getAttribute('aria-label') || ''
  const section = el.closest<HTMLElement>(NAV_ORDER.map((id) => `#${id}`).join(','))
  const index = Math.max(0, NAV_ORDER.indexOf(section?.id ?? ''))
  c.querySelector('.curtain-num')!.textContent = String(index).padStart(2, '0')
  const nameEl = c.querySelector<HTMLElement>('.curtain-name')!
  nameEl.innerHTML = [...name].map((ch) => `<span>${ch === ' ' ? '&nbsp;' : ch}</span>`).join('')
  const chars = nameEl.querySelectorAll('span')
  const panels = c.querySelectorAll('.curtain-a, .curtain-b')
  const details = c.querySelectorAll('.curtain-top, .curtain-foot')
  const closed = 'ellipse(150% 0% at 50% 100%)'
  const open = 'ellipse(150% 160% at 50% 100%)'

  curtainBusy = true
  gsap
    .timeline({ onComplete: () => { curtainBusy = false } })
    .set(c, { autoAlpha: 1 })
    .set(panels, { clipPath: closed })
    .set(chars, { yPercent: 110 })
    .set(details, { autoAlpha: 0, y: 14 })
    .set('.curtain-bar i', { scaleX: 0 })
    .to(panels, { clipPath: open, duration: 0.7, ease: 'curtain', stagger: 0.12 })
    .to(details, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'soft', stagger: 0.06 }, 0.45)
    .to(chars, { yPercent: 0, duration: 0.75, ease: 'soft', stagger: 0.03 }, 0.5)
    .to('.curtain-bar i', { scaleX: 1, duration: 0.75, ease: 'power2.inOut' }, 0.5)
    .add(() => {
      lenis?.scrollTo(el, { immediate: true, force: true })
      ScrollTrigger.update()
    }, 1.25)
    .to(chars, { yPercent: -110, duration: 0.4, ease: 'power2.in', stagger: 0.015 }, 1.3)
    .to(details, { autoAlpha: 0, y: -14, duration: 0.3, ease: 'power2.in' }, 1.3)
    .to([...panels].reverse(), { clipPath: 'ellipse(150% 0% at 50% 0%)', duration: 0.8, ease: 'curtain', stagger: 0.1 }, 1.5)
    .set(c, { autoAlpha: 0 })
}

export function lockScroll(locked: boolean) {
  if (lenis) locked ? lenis.stop() : lenis.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

/**
 * Cor de fundo contínua: ao entrar na tela, cada [data-bg] mistura a cor da seção
 * anterior até a própria, preso à rolagem. Parado, cada seção tem o fundo dela
 * (contraste sempre certo). A troca para a cor anterior acontece com 0px visível.
 */
export function initSceneColors() {
  if (prefersReducedMotion()) return
  const scenes = gsap.utils.toArray<HTMLElement>('[data-bg]')
  scenes.forEach((el, i) => {
    if (i === 0) return
    gsap.fromTo(
      el,
      { backgroundColor: scenes[i - 1].dataset.bg },
      {
        backgroundColor: el.dataset.bg,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 35%', scrub: true },
      },
    )
  })
}

const MASK = { overflow: 'visible', clipPath: 'inset(0 -100vw)', paddingBottom: '0.12em', marginBottom: '-0.12em', verticalAlign: 'top' }

/** Linha por linha com um bloco laranja que cobre e sai (receita R5, landonorris.com). */
function blockReveal(el: HTMLElement) {
  SplitText.create(el, {
    type: 'lines',
    autoSplit: true,
    onSplit(self) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
      self.lines.forEach((line, i) => {
        const node = line as HTMLElement
        node.style.position = 'relative'
        const block = Object.assign(document.createElement('span'), { className: 'line-block' })
        node.appendChild(block)
        tl.fromTo(node, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power2.out' }, i * 0.08)
          .fromTo(block, { scaleX: 1 }, { scaleX: 0, duration: 0.6, ease: 'power2.inOut' }, i * 0.08 + 0.3)
      })
      return tl
    },
  })
}

/**
 * Revela por linhas tudo que tiver [data-reveal] (receita R1 do nk.studio),
 * com bloco de cor em [data-reveal="block"], e faz fade curto em [data-fade].
 */
export function initReveals(scope: Element | Document = document) {
  const mm = gsap.matchMedia()
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      if (el.dataset.reveal === 'block') return blockReveal(el)
      const delay = Number(el.dataset.delay ?? 0)
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          gsap.set(self.masks, MASK)
          return gsap.from(self.lines, {
            yPercent: 110,
            rotation: 6,
            transformOrigin: '0% 100%',
            duration: el.dataset.reveal === 'slow' ? 1.1 : 0.85,
            ease: 'soft',
            stagger: 0.08,
            delay,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        },
      })
    })
    scope.querySelectorAll<HTMLElement>('[data-fade]').forEach((el) => {
      gsap.from(el, {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: 'soft',
        delay: Number(el.dataset.delay ?? 0),
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      })
    })
  })
  return mm
}

export { gsap, ScrollTrigger, SplitText }
