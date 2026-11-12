<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import SitePreloader from '@/components/layout/SitePreloader.vue'
import { gsap, initReveals, initSceneColors, lockScroll, ScrollTrigger, startSmoothScroll } from '@/composables/useMotion'

const ready = ref(false)
const progress = ref<HTMLElement>()

onMounted(() => {
  lockScroll(true)
  history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
})

async function onLoaded() {
  ready.value = true
  document.documentElement.classList.add('is-ready')
  startSmoothScroll()
  lockScroll(false)
  await nextTick()
  initReveals()
  initSceneColors()
  gsap.to(progress.value!, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })
  ScrollTrigger.refresh()
}
</script>

<template>
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <SitePreloader @done="onLoaded" />
  <div ref="progress" class="progress-bar" aria-hidden="true" />
  <div class="grain" aria-hidden="true" />
  <main id="conteudo">
  </main>
</template>
