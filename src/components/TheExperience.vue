<script setup lang="ts">
import { TresCanvas, useSeek } from '@tresjs/core'
import { BasicShadowMap, SRGBColorSpace, NoToneMapping, Vector3 } from 'three'
import { OrbitControls, Stars, GLTFModel, CameraControls } from '@tresjs/cientos'
import { ref, shallowRef, watch, onMounted, watchEffect } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
/* import { useControls, TresLeches } from '@tresjs/leches'
import '@tresjs/leches/dist/style.css' */
gsap.registerPlugin(ScrollTrigger)

/* const { intensity, color, positionn } = useControls({
  intensity: {
    value: 5.1,
    min: 0,
    max: 10,
    step: 0.01,
  },
  color: '#fff36b',
  positionn: new Vector3(3, 1, -4),
})
const { intensity2, color2, positionn2 } = useControls({
  intensity2: {
    value: 5.5,
    min: 0,
    max: 10,
    step: 0.01,
  },
  color2: '#ff42a7',
  positionn2: new Vector3(-3, 2, 3),
}) */

const gl = {
  shadows: true,
  alpha: true,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
}

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
function aa() {
  console.log('cameraRef', cameraRef.value)
}

const modelRef = shallowRef<THREE.Object3D>()
watch(modelRef, (model) => {
  setTimeout(() => {
    loadAnimation(model)
  }, 200)
})

const loadAnimation = (model) => {
  console.log('modelRef', model)
  const { seekByName } = useSeek()
  const nimbus001 = seekByName(model.value, 'nimbus001')
  const nimbus002 = seekByName(model.value, 'nimbus002')
  const nimbus003 = seekByName(model.value, 'nimbus003')
  const lentes = seekByName(model.value, 'lentes')
  /*   console.log('lentes', lentes) */

  let canvasel = gsap.utils.toArray('canvas')[0]
  console.log(`canvasel`, canvasel)
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: 'canvas',
      start: 'top 70%',
      end: 'center center',
      markers: true,
      scrub: true,
    },
  })
  tl.from(lentes?.scale, { x: 4, y: 4, z: 4 }, 0)
  tl.from(lentes?.position, { x: 0.2, y: 6, z: 2 }, 0)
  tl.from(lentes?.rotation, { x: -1.6, y: -0.3, z: 7 }, 0)

  gsap.to(nimbus002.rotation, { z: Math.PI * 2, duration: 28, ease: 'none', repeat: -1 })
  gsap.to(nimbus001.rotation, { z: -Math.PI * 2, duration: 40, ease: 'none', repeat: -1 })
  gsap.to(nimbus003.rotation, { z: -Math.PI * 2, duration: 60, ease: 'none', repeat: -1 })
  gsap.to(nimbus002.rotation, { y: 0.2, duration: 5, ease: 'none', repeat: -1, yoyo: true })
  gsap.to(nimbus001.rotation, { y: -0.2, duration: 5, ease: 'none', repeat: -1, yoyo: true })
  sections.forEach((element: Element, index) => {
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
}

const screenWidth = ref(0)
onMounted(() => {
  sections = gsap.utils.toArray('[data-model]')
  screenWidth.value = window.innerWidth
  console.log('screenWidth', screenWidth.value)
})
</script>

<template>
  <!--  <TresLeches class="fixed" /> -->
  <TresCanvas v-bind="gl" id="mycanvas" window-size v-if="screenWidth > 768">
    <TresPerspectiveCamera ref="cameraRef" :position="[1, 5, 6]" :look-at="[0, 4, 0]" />
    <Suspense>
      <GLTFModel path="/models/alterado.glb" draco ref="modelRef" />
    </Suspense>

    <TresAmbientLight :intensity="0" :color="'#fff'" />

    <TresDirectionalLight :intensity="5.1" :color="'#fff36b'" :position="[3, 1, -4]" />
    <TresDirectionalLight :intensity="5.2" :color="'#ff42a7'" :position="[-3, 2, 3]" />
  </TresCanvas>
</template>

<style lang="scss">
canvas#mycanvas {
  position: sticky !important;
  z-index: 0;
  pointer-events: none !important;
}
.tl-absolute {
  top: 100px !important;
  position: fixed;
}
</style>
