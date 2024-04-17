<script setup lang="ts">
import { TresCanvas, useSeek } from '@tresjs/core'
import { BasicShadowMap, SRGBColorSpace, NoToneMapping, Vector3 } from 'three'
import { OrbitControls, Stars, GLTFModel, CameraControls } from '@tresjs/cientos'
import { ref, shallowRef, watch, onMounted, watchEffect } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useControls, TresLeches } from '@tresjs/leches'
import '@tresjs/leches/dist/style.css'

/* const color = ref('#00f')
const intensity = ref(1) */

const { intensity, color, positionn } = useControls({
  intensity: {
    value: 5.1,
    min: 0,
    max: 10,
    step: 0.01
  },
  color: '#fff36b',
  positionn: new Vector3(3, 1, -4)
})
const { intensity2, color2, positionn2 } = useControls({
  intensity2: {
    value: 5.5,
    min: 0,
    max: 10,
    step: 0.01
  },
  color2: '#ff42a7',
  positionn2: new Vector3(-3, 2, 3)
})

/* const { cameraPos } = useControls({
  cameraPos: new Vector3(-3, 2, 3)
}) */

watchEffect(() => {
  console.log(intensity.value.value)
  console.log(color.value.value)
  console.log('position', positionn.value)
})

gsap.registerPlugin(ScrollTrigger)

const gl = {
  shadows: true,
  alpha: true,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping
}

const cameras = [
  { x: 5, y: 6, z: 6 },
  { x: -5, y: 3, z: 3 },
  { x: 3, y: 4, z: 6 },
  { x: 5, y: 3, z: -4 },
  { x: 6, y: 3, z: -1 }
]

const looktAts = [
  { x: 0, y: 4, z: 0 },
  { x: -1, y: 4.5, z: -2 },
  { x: 2, y: 3.5, z: 0 },
  { x: 0, y: 3, z: 3 },
  { x: 0, y: 4.7, z: 0 }
]
const lookAtAux = { x: 0, y: 4, z: 0 }

const backgrounds = [
  'linear-gradient( 89.7deg,  rgba(0,0,0,1) -10.7%, rgba(53,92,125,1) 88.8% )',
  'linear-gradient( 189.7deg,  rgba(0,0,0,1) -10.7%, rgba(53,92,125,1) 88.8% )',
  'linear-gradient( 270deg, #0f2027, #203a43, #2c5364)',
  'linear-gradient( 109.6deg,  rgba(30,10,10,1) -11.2%, rgba(36,163,190,1) 102% )',
  'radial-gradient( circle farthest-corner at 10% 20%,  rgba(0,152,155,1) 0.1%, rgba(0,94,120,1) 104% )',
  'radial-gradient( circle 939px at 94.7% 50%,  rgba(0,178,169,1) 0%, rgba(0,106,101,1) 76.9% )'
]

const cameraRef = ref()
let sections: Element[]
function aa() {
  console.log('cameraRef', cameraRef.value)
}

const modelRef = shallowRef<THREE.Object3D>()
watch(modelRef, (model) => {
  loadAnimation()

  console.log('modelRef', modelRef.value.value)
  const { seekByName } = useSeek()
  const nimbus001 = seekByName(model.value, 'nimbus001')
  const nimbus002 = seekByName(model.value, 'nimbus002')
  const nimbus003 = seekByName(model.value, 'nimbus003')
  gsap.to(nimbus002.rotation, { z: Math.PI * 2, duration: 28, ease: 'none', repeat: -1 })
  gsap.to(nimbus001.rotation, { z: -Math.PI * 2, duration: 40, ease: 'none', repeat: -1 })
  gsap.to(nimbus003.rotation, { z: -Math.PI * 2, duration: 60, ease: 'none', repeat: -1 })
  gsap.to(nimbus002.rotation, { y: 0.2, duration: 5, ease: 'none', repeat: -1, yoyo: true })
  gsap.to(nimbus001.rotation, { y: -0.2, duration: 5, ease: 'none', repeat: -1, yoyo: true })
})

const loadAnimation = () => {
  console.log('loadanimation', sections, modelRef.value.value)

  sections.forEach((element, index) => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: element,
          markers: false,
          start: 'top center',
          end: 'bottom 60%',
          toggleActions: 'play complete  reverse complete '
        },
        defaults: {
          duration: 1.5,
          ease: 'power3'
        }
      })
      .to(cameraRef.value.position, {
        ...cameras[index]
        /* onUpdate: () => {
          //cameraRef.value.lookAt(...looktAts[index])
        } */
      })
      .to(
        lookAtAux,
        {
          x: looktAts[index].x,
          y: looktAts[index].y,
          z: looktAts[index].z,
          onUpdate: () => {
            cameraRef.value.lookAt(...Object.values(lookAtAux))
          }
        },
        '<'
      )
      .to(
        '.daback',
        {
          background: backgrounds[index]
        },
        '<'
      )
  })
}

onMounted(() => {
  sections = gsap.utils.toArray('section')
  console.log(`sections`, sections)
})
</script>

<template>
  <div class="w-full h-screen">
    <!--  <TresLeches /> -->
    <TresCanvas v-bind="gl" id="mycanvas">
      <TresPerspectiveCamera ref="cameraRef" :position="[1, 5, 6]" :look-at="[0, 4, 0]" />
      <!--  <OrbitControls /> -->
      <!--  <CameraControls /> -->
      <Stars />
      <Suspense>
        <GLTFModel path="/models/alterado.glb" draco ref="modelRef" />
      </Suspense>

      <!-- <TresGridHelper :position="[0, 0, 0]" /> -->
      <TresDirectionalLight :intensity="intensity.value" :color="color.value" :position="positionn.value.toArray()" />
      <TresDirectionalLight :intensity="intensity2.value" :color="color2.value" :position="positionn2.value.toArray()" />
    </TresCanvas>
    <!-- <button @click="aa">log</button> -->
    <!--  <pre>
      {{ intensity }}
    </pre> -->
    <!-- <div class="as"></div> -->
  </div>
</template>

<style>
canvas#mycanvas {
  position: fixed !important;
  z-index: 1;
  top: 0;
  pointer-events: none !important;
}
.tl-absolute {
  top: 100px !important;
}
</style>
