<template>
  <!--   <section class="h-screen section-carousel"> -->
  <div id="carousel-weapper" class="flex items-start justify-center relative">
    <!-- <div class="absolute top-[22%] flex gap-8">
      <button class="" @click="rotation += rotateConst" id="girar">
        <img class="h-20" src="/arrow.svg" style="transform: scaleX(-1)" alt="" />
      </button>
      <button @click="rotation -= rotateConst" id="girar">
        <img class="h-20" src="/arrow.svg" alt="" />
      </button>
    </div> -->

    <div class="scene">
      <h2 class="text-center font-black text-6xl text-gradient mx-auto relative -top-14">SKILLS</h2>
      <div class="carousel vue" ref="carousel">
        <div
          class="carousel_cell"
          :class="`_${index + 1}`"
          v-for="(card, index) in groups"
          :key="index"
          :style="{
            transform: `rotateX(0deg) rotateY(${rotateConst * index}deg) rotateZ(0deg) translate3d(0px, 0px, var(--space)) `,
          }"
        >
          <h4 class="absolute font-bold text-xl text-slate-800 top-2">{{ card.title || card.img }}</h4>
          <img v-for="el in card.elements" :src="el.img" loading="lazy" width="83" :alt="el.text" class="image" />
        </div>
      </div>
    </div>
  </div>
  <!--   </section> -->
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.carousel-section',
      start: 'top 20%',
      end: 'bottom 102%',
      pin: '.scene',
    },
  })

  gsap.to('#carousel-weapper', {
    scrollTrigger: {
      trigger: '.carousel-section',
      scrub: true,
      //markers: true,
    },
    '--rotation': '460deg',
    '--space': '420px',
    '--inclination': '8deg',
    ease: 'none',
  })
})

//const carousel = ref()
//const rotation = ref(0)

const groups = [
  {
    title: 'UI ',
    elements: [
      { img: '/logos/figma.png', text: '' },
      { img: '/logos/vuetify.png', text: '' },
      { img: '/logos/tailwind.png', text: '' },
    ],
  },
  {
    title: 'Basic Web Development',
    elements: [
      { img: '/logos/css.png', text: '' },
      { img: '/logos/html5.png', text: '' },
      { img: '/logos/javascript.png', text: '' },
      { img: '/logos/webpack.png', text: '' },
    ],
  },

  {
    title: 'Javascript ',
    elements: [
      { img: '/logos/typescript.png', text: '' },
      { img: '/logos/vue.js.png', text: '' },
      { img: '/logos/astrogpt.png', text: '' },
      { img: '/logos/react.png', text: '' },
      { img: '/logos/vitejs.png', text: '' },
    ],
  },
  {
    title: '3D',
    elements: [
      { img: '/logos/three js.png', text: '' },
      { img: '/logos/webgl.png', text: '' },
      { img: '/logos/vitejs.png', text: '' },
      { img: '/logos/tresjs.png', text: '' },
      { img: '/logos/spline.png', text: '' },
    ],
  },
  {
    title: 'Backend',
    elements: [
      { img: '/logos/firebase.png', text: '' },
      { img: '/logos/graphql.png', text: '' },
      { img: '/logos/python.png', text: '' },
      { img: '/logos/strapi.png', text: '' },
    ],
  },

  {
    title: 'DevOps',
    elements: [
      { img: '/logos/firebase.png', text: '' },
      { img: '/logos/gitlab.png', text: '' },
      { img: '/logos/docker.png', text: '' },
    ],
  },
]
const cards = [
  { img: '/logos/astrogpt.png', text: '' },
  { img: '/logos/css.png', text: '' },
  { img: '/logos/docker.png', text: '' },
  { img: '/logos/figma.png', text: '' },
  { img: '/logos/firebase.png', text: '' },
  { img: '/logos/gitlab.png', text: '' },
  { img: '/logos/graphql.png', text: '' },
  { img: '/logos/html5.png', text: '' },
  { img: '/logos/javascript.png', text: '' },
  { img: '/logos/midudev.png', text: '' },
  { img: '/logos/python.png', text: '' },
  { img: '/logos/react.png', text: '' },
  { img: '/logos/spline.png', text: '' },
  { img: '/logos/strapi.png', text: '' },
  { img: '/logos/tailwind.png', text: '' },
  { img: '/logos/three js.png', text: '' },
  { img: '/logos/typescript.png', text: '' },
  { img: '/logos/vitejs.png', text: '' },
  { img: '/logos/vue.js.png', text: '' },
  { img: '/logos/vuetify.png', text: '' },
  { img: '/logos/webgl.png', text: '' },
]

const rotateConst = 360 / groups.length
const space = 446
</script>

<style lang="scss">
#carousel-weapper {
  --card-size: 260px;
  --rotation: 0deg;
  --rotateX: -8deg;
  --space: 580px;
  --inclination: -10deg;
}

.scene {
  position: relative;
  width: calc(var(--card-size) * 1.5);
  height: var(--card-size);
  perspective: 800px;
  perspective-origin: 50% 50%;
}
.carousel {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: translateZ(-120px) rotateX(var(--rotateX)) rotateZ(var(--inclination)) rotateY(var(--rotation));
}
.carousel_cell {
  position: absolute;

  width: calc(var(--card-size) * 1.5);
  height: var(--card-size);

  padding: 2.5rem 1rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  border-style: solid;
  border-width: 2px;
  border-color: rgba(14, 255, 235, 0.13);
  border-radius: 40px;
  background-image: radial-gradient(circle farthest-corner at 50% 100%, #69ccb3b6, #b9cadd);
  box-shadow: inset 0 -4px 20px 7px hsla(204, 11%, 54%, 0.432);
  transition: box-shadow 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
  transform-style: preserve-3d;
}
</style>
