<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap, prefersReducedMotion } from '@/composables/useMotion'

const emit = defineEmits<{ done: [] }>()

const lines = [
  { cmd: '$ npm run paulo', out: '' },
  { cmd: '› conectando a API', out: 'ok' },
  { cmd: '› montando a interface', out: 'ok' },
  { cmd: '› polindo os pixels', out: 'ok' },
]
const root = ref<HTMLElement>()
const count = ref(0)
const visible = ref(true)

function finish() {
  visible.value = false
  emit('done')
}

onMounted(async () => {
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 800))])
  let seen = false
  try {
    seen = sessionStorage.getItem('preloader-visto') === '1'
    sessionStorage.setItem('preloader-visto', '1')
  } catch {
    // sessionStorage bloqueado: segue mostrando a abertura
  }
  if (seen || prefersReducedMotion() || !root.value) {
    // Sem animação, ou já vista nesta sessão: some na hora
    finish()
    return
  }
  const el = root.value
  const counter = { v: 0 }
  gsap
    .timeline({ onComplete: () => { visible.value = false } })
    .to(counter, { v: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => (count.value = Math.round(counter.v)) }, 0)
    .from(el.querySelectorAll('.line'), { autoAlpha: 0, y: 8, duration: 0.35, stagger: 0.32, ease: 'soft' }, 0.1)
    .from(el.querySelectorAll('.ok'), { autoAlpha: 0, duration: 0.2, stagger: 0.32 }, 0.45)
    .to(el.querySelector('.inner'), { autoAlpha: 0, y: -30, duration: 0.3, ease: 'power2.in' }, 1.68)
    // A página começa a animar junto com a cortina, sem esperar ela terminar de sair
    .call(() => emit('done'), [], 1.78)
    .to(el, { clipPath: 'ellipse(140% 0% at 50% 0%)', duration: 0.9, ease: 'curtain' }, 1.78)
})
</script>

<template>
  <div v-if="visible" ref="root" class="preloader" data-theme="dark" role="status" aria-label="Carregando o portfólio">
    <div class="inner">
      <ol class="terminal" aria-hidden="true">
        <li v-for="line in lines" :key="line.cmd" class="line">
          <span class="cmd">{{ line.cmd }}</span>
          <span v-if="line.out" class="ok">{{ line.out }}</span>
        </li>
      </ol>
      <p class="count" aria-hidden="true">{{ count }}<span>%</span></p>
      <p class="sign label">Paulo Artur Pereira — Full Stack</p>
    </div>
  </div>
</template>

<style scoped>
@layer components {
  .preloader {
    position: fixed;
    inset: 0;
    z-index: var(--z-preloader);
    display: grid;
    padding: var(--gutter);
    background: var(--ink-950);
    color: var(--paper-100);
    clip-path: ellipse(140% 140% at 50% 0%);
  }
  .inner {
    display: grid;
    grid-template-rows: 1fr auto;
    grid-template-columns: 1fr auto;
    align-items: end;
    gap: var(--space-6);
  }
  .terminal {
    grid-column: 1 / -1;
    align-self: center;
    justify-self: center;
    display: grid;
    gap: var(--space-2);
    inline-size: min(100%, 26rem);
    font: 400 var(--text-sm) / 1.5 var(--font-mono);
  }
  .line { display: flex; justify-content: space-between; gap: var(--space-4); color: var(--color-text-muted); }
  .line:first-child { color: var(--paper-100); }
  .ok { color: var(--signal-500); }
  .count {
    grid-column: 2;
    font: 600 var(--text-3xl) / 0.8 var(--font-display);
    letter-spacing: var(--tracking-display);
    font-variant-numeric: tabular-nums;
  }
  .count span { font-size: 0.4em; color: var(--signal-500); }
  .sign { grid-column: 1; grid-row: 2; color: var(--color-text-muted); }
}
</style>
