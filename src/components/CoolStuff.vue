<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { BasicShadowMap, SRGBColorSpace, NoToneMapping } from 'three'
import { useGLTF } from '@tresjs/cientos'
import { ref, shallowRef, watch, onMounted } from 'vue'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

import type { TresObject } from 'tresjs'


const cameras = [
  { x: -5, y: 3, z: 3.5 },
  { x: 3, y: 4, z: 6 },
  { x: -0.3, y: 3.73, z: 6 },
  { x: 1, y: 4, z: 0 },
  { x: 5, y: 3, z: -4 },
]

const looktAts = [
  { x: -1.5, y: 4, z: -2.5 },
  { x: 3, y: 3.5, z: 0 },
  { x: -3.8, y: 4.4, z: -2 },
  { x: 4, y: 5, z: -6 },
  { x: 0, y: 4.7, z: 0 },
]
const lookAtAux = { x: 0, y: 4, z: 0 }

const cameraRef = ref()
let sections: Element[]


const path = "/models/alterado.glb"

const { state, nodes, isLoading, progress } = useGLTF(path, { draco: true })


watch(isLoading, () => {
  setTimeout(() => {
    haloAnimation(nodes)
    loadAnimation(nodes)
  }, 200)

})

const haloAnimation = (nodes: any) => {
  const nimbus001 = nodes.value?.nimbus001
  const nimbus002 = nodes.value?.nimbus002
  const nimbus003 = nodes.value?.nimbus003

  gsap.to(nimbus002.rotation, { z: Math.PI * 2, duration: 28, ease: 'none', repeat: -1 })
  gsap.to(nimbus001.rotation, { z: -Math.PI * 2, duration: 40, ease: 'none', repeat: -1 })
  gsap.to(nimbus003.rotation, { z: -Math.PI * 2, duration: 60, ease: 'none', repeat: -1 })
  gsap.to(nimbus002.rotation, { y: 0.2, duration: 5, ease: 'none', repeat: -1, yoyo: true })
  gsap.to(nimbus001.rotation, { y: -0.2, duration: 5, ease: 'none', repeat: -1, yoyo: true })
}

const loadAnimation = (nodes: any) => {
  // console.log('load animation', nodes)
  const lentes = nodes.value?.lentes
  const busto = nodes.value?.busto

  /* Intro animation */
  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.intro',
        start: 'top bottom',
        end: 'bottom 80%',
        // markers: true,
        scrub: true,
      },
    })
    .from(lentes?.scale, { x: 4, y: 4, z: 4 }, 0)
    .from(lentes?.position, { x: 0.2, y: 6, z: 2 }, 0)
    .from(lentes?.rotation, { x: -1.6, y: -0.3, z: 7 }, 0)
    .from(busto?.position, { x: -4, y: -5.5, z: 0 }, 0)

  /* Animation per section */
  sections.forEach((element: any, index) => {
    const { endMark } = element.dataset
    gsap
      .timeline({
        scrollTrigger: {
          trigger: element,
          //markers: true,
          start: 'top bottom',
          end: `${endMark || '80%'} bottom`,
          toggleActions: 'play complete  reverse complete ',
          scrub: true,
        },
      })
      .to(cameraRef.value.position, {
        ...cameras[index],
      })
      .to(
        lookAtAux,
        {
          ...looktAts[index],
          onUpdate: () => {
            cameraRef.value.lookAt(...Object.values(lookAtAux))
          },
        },
        '<'
      )
  })

  gsap.set('canvas#mycanvas', { opacity: 1, })

}

onMounted(() => {
  sections = gsap.utils.toArray('[data-model]')
})
</script>

<template>
  <TresPerspectiveCamera ref="cameraRef" :position="[1, 5, 6]" :look-at="[0, 4, 0]" />

  <primitive v-if="state" :object="state?.scene"  />
  
  
  <TresAmbientLight :intensity="0" :color="'#fff'" />
 <!--  <TresGridHelper :args="[10, 10]" /> -->
  <TresDirectionalLight :intensity="5.1" :color="'#fff36b'" :position="[3, 1, -4]" />
  <TresDirectionalLight :intensity="5.2" :color="'#ff42a7'" :position="[-3, 2, 3]" />  
</template>

<style lang="scss">

.tl-absolute {
  top: 100px !important;
  position: fixed;
}
</style>
