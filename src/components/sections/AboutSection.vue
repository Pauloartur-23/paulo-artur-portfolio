<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import MagneticButton from '@/components/ui/MagneticButton.vue'
import { gsap, prefersReducedMotion, scrollToTarget } from '@/composables/useMotion'
import { scene } from '@/data/content'

const principles = [
  { title: 'Ponta a ponta', text: 'Modelo os dados, escrevo a API em Django e construo a interface em Vue ou React. Entendo o caminho inteiro de um clique.' },
  { title: 'Design com intenção', text: 'Tipografia, ritmo e movimento não são enfeite: guiam a pessoa e deixam o produto com cara própria.' },
  { title: 'Feito para durar', text: 'Código tipado, componentes pequenos, testes onde importa e deploy sem susto.' },
]

const root = ref<HTMLElement>()
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!root.value || prefersReducedMotion()) return
  ctx = gsap.context(() => {
    // Linha que se desenha e números grandes que sobem com a rolagem
    gsap.from('.rule', { scaleX: 0, transformOrigin: 'left', duration: 1.4, ease: 'curtain', scrollTrigger: { trigger: '.body', start: 'top 85%', once: true } })
    gsap.fromTo('.aside-word', { yPercent: 30 }, { yPercent: -30, ease: 'none', scrollTrigger: { trigger: '.body', start: 'top bottom', end: 'bottom top', scrub: true } })
    gsap.from('.cta', { autoAlpha: 0, y: 30, duration: 0.9, ease: 'soft', scrollTrigger: { trigger: '.cta', start: 'top 92%', once: true } })
    gsap.from('.principle', { autoAlpha: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'soft', scrollTrigger: { trigger: '.principles', start: 'top 85%', once: true } })
  }, root.value)
})
onUnmounted(() => ctx?.revert())
</script>

<template>
  <section id="sobre" ref="root" class="about section" data-theme="dark" :data-bg="scene.ink" aria-label="Sobre">
    <div class="container">
      <p class="label muted">// 01 — Sobre</p>

      <h2 class="statement" data-reveal="block">
        Gosto de projetos em que a <em>engenharia</em> e o <em>design</em> precisam conversar. Escrevo a API, desenho a interface e cuido
        de tudo o que acontece entre as duas.
      </h2>

      <span class="rule" aria-hidden="true" />
      <div class="body grid">
        <p class="aside" aria-hidden="true"><span class="aside-word serif">Full</span><span class="aside-word">Stack</span></p>

        <div class="text">
          <p class="lead" data-fade>
            Sou desenvolvedor Full Stack formado no técnico do Instituto Federal Catarinense. Comecei pelo front-end, curioso para entender
            por que alguns sites parecem vivos. Fui descendo a pilha até o banco de dados, e hoje construo produtos inteiros.
          </p>
          <p class="muted" data-fade>
            O ecossistema Urban nasceu assim: uma hamburgueria, uma plataforma de gestão de equipes, um app de treino. Cada um com
            identidade própria, API própria e deploy de verdade. É onde eu testo ideias, erro rápido e aprendo mais.
          </p>
          <MagneticButton class="cta" href="#projetos" label="Ver projetos" @click.prevent="scrollToTarget('#projetos', 'Projetos')" />
        </div>
      </div>

      <ol class="principles">
        <li v-for="(p, i) in principles" :key="p.title" class="principle">
          <span class="label accent">0{{ i + 1 }}</span>
          <h3>{{ p.title }}</h3>
          <p class="muted">{{ p.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
@layer components {
  .statement {
    max-inline-size: 22ch;
    margin-block: var(--space-8) var(--space-16);
    font-size: var(--text-2xl);
    font-weight: 500;
    line-height: 1.02;
  }
  .statement em { color: var(--signal-500); }

  .body { align-items: start; row-gap: var(--space-12); }
  .rule { display: block; block-size: 1px; margin-block-end: var(--space-12); background: var(--color-line); }
  /* Palavra gigante vazada ao lado do texto, no lugar da foto */
  .aside {
    grid-column: 1 / -1;
    display: grid;
    font: 700 var(--text-3xl) / 0.85 var(--font-display);
    font-stretch: 80%;
    letter-spacing: var(--tracking-display);
    color: transparent;
    -webkit-text-stroke: 1px oklch(68% 0.2 38 / 0.7);
  }
  .aside .serif { font-weight: 400; -webkit-text-stroke: 0; color: var(--signal-500); }
  .text { grid-column: 1 / -1; display: grid; gap: var(--space-6); }
  .lead { font-size: var(--text-lg); line-height: 1.4; }
  .cta { justify-self: start; margin-block-start: var(--space-4); }

  .principles {
    display: grid;
    gap: var(--space-8);
    margin-block-start: var(--space-section);
    padding-block-start: var(--space-8);
    border-block-start: var(--line);
  }
  .principle { display: grid; gap: var(--space-3); align-content: start; }
  .principle h3 { font-size: var(--text-xl); font-weight: 500; letter-spacing: -0.03em; }

  @media (width >= 48rem) {
    .aside { grid-column: 1 / span 5; }
    .text { grid-column: 7 / -1; }
    .principles { grid-template-columns: repeat(3, 1fr); }
  }
  @media (width >= 64rem) {
    .text { grid-column: 7 / span 5; }
  }
}
</style>
