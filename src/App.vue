<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import SitePreloader from '@/components/layout/SitePreloader.vue'
import SiteCursor from '@/components/layout/SiteCursor.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import WorkSection from '@/components/sections/WorkSection.vue'
import StackSection from '@/components/sections/StackSection.vue'
import JourneySection from '@/components/sections/JourneySection.vue'
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
  <SiteCursor />
  <SiteHeader />
  <main id="conteudo">
    <HeroSection :ready="ready" />
    <AboutSection />
    <WorkSection />
    <StackSection />
    <JourneySection />
  </main>
</template>
