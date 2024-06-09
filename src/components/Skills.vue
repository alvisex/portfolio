<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  const finalSpace = window.innerWidth > 1000 ? '420px' : '210px'
  const finalInclination = window.innerWidth > 1000 ? '8deg' : '5deg'

  setTimeout(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.carousel-section',
        start: 'top 7%',
        end: 'bottom 102%',
        pin: '.scene',
        //markers: true,
      },
    })
    gsap.to('#carousel-weapper', {
      scrollTrigger: {
        trigger: '.carousel-section',
        scrub: true,
        //markers: true,
      },
      '--rotation': '460deg',
      '--space': finalSpace,
      '--inclination': finalInclination,
      ease: 'none',
    })
  }, 800)
})

const groups = [
  {
    title: 'Javascript ',
    elements: [
      { img: '/logos/astrogpt.png', text: 'Astro Js' },
      { img: '/logos/vue.js.png', text: 'Vue 3' },
      { img: '/logos/react.png', text: 'React' },
      { img: '/logos/nuxt.png', text: 'Nuxt Js' },
      { img: '/logos/typescript.png', text: 'Typescript' },
      { img: '/logos/vitejs.png', text: 'Vite Js' },
    ],
  },
  {
    title: 'UI/UX',
    elements: [
      { img: '/logos/vuetify.png', text: 'Vuetify' },
      { img: '/logos/gsap.svg', text: 'GSAP' },
      { img: '/logos/tailwind.png', text: 'Tailwind ' },
      { img: '/logos/figma.png', text: 'Figma' },
      { img: '/logos/lottie.png', text: 'LottieFiles' },
    ],
  },
  {
    title: '3D',
    elements: [
      { img: '/logos/three js.png', text: 'three.js' },
      { img: '/logos/webgl.png', text: 'WebGL' },
      { img: '/logos/tresjs.png', text: 'Tres Js' },
      { img: '/logos/spline.png', text: 'Spline' },
      { img: '/logos/blender.png', text: 'blender' },
    ],
  },
  {
    title: 'Backend',
    elements: [
      { img: '/logos/firebase.png', text: 'Firebase' },
      { img: '/logos/nodejs.png', text: 'Node Js' },
      { img: '/logos/graphql.png', text: 'GraphQL' },
      { img: '/logos/strapi.png', text: 'Strapi' },
      { img: '/logos/python.png', text: 'Python' },
    ],
  },

  {
    title: 'DevOps',
    elements: [
      { img: '/logos/gitlab.png', text: 'GitLab' },

      { img: '/logos/concourse.png', text: 'Concourse CI' },
      { img: '/logos/firebase.png', text: 'Firbase' },
      { img: '/logos/launch-darkly.svg', text: 'Launch Darkly' },
      { img: '/logos/docker.png', text: 'Docker' },
    ],
  },
  {
    title: 'Basic Web Development',
    elements: [
      { img: '/logos/css.png', text: 'CSS 3' },
      { img: '/logos/html5.png', text: 'HTML 5' },
      { img: '/logos/javascript.png', text: 'Javascript ES7+' },
      { img: '/logos/webpack.png', text: 'Webpack' },
      { img: '/logos/vitejs.png', text: 'Vite Js' },
    ],
  },
]

const rotateConst = 360 / groups.length
</script>
<template>
  <div id="carousel-weapper" class="flex items-start h-full justify-center">
    <div class="scene">
      <h2 class="text-center font-black text-5xl md:text-6xl text-gradient mx-auto relative">SKILL SET</h2>
      <div class="carousel mt-2 md:mt-[5vh] vue" ref="carousel">
        <div
          class="carousel_cell"
          :class="`_${index + 1}`"
          v-for="(card, index) in groups"
          :key="index"
          :style="{
            transform: `rotateX(0deg) rotateY(${rotateConst * index}deg) rotateZ(0deg) translate3d(0px, 0px, var(--space)) `,
          }"
        >
          <h4 class="absolute font-bold md:text-xl text-teal-100 top-2 text-center">{{ card.title || card.img }}</h4>
          <div class="cell-element relative" v-for="el in card.elements">
            <label
              class="tooltip absolute z-10 text-center mx-auto bg-teal-100 top-0 text-background min-w-full p-1 text-xs rounded-md opacity-0"
              >{{ el.text }}</label
            >
            <img :src="el.img" loading="lazy" :alt="el.text" class="image w-14 md:w-16" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#carousel-weapper {
  --card-width: 390px;
  --card-height: calc(var(--card-width) * 0.7);
  --rotation: -10deg;
  --rotateX: -4deg;
  --space: 580px;
  --inclination: -10deg;
  --perspective: 800px;

  @media (max-width: 768px) {
    --perspective: 900px;
    --space: 400px;
    --card-width: 70vw;
    --card-height: calc(var(--card-width) * 1.4);
    --inclination: -5deg;
  }
}

.scene {
  position: relative;
  width: var(--card-width);
  height: var(--card-height);
  perspective: var(--perspective);
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
  width: var(--card-width);
  height: var(--card-height);
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
  background-image: radial-gradient(circle farthest-corner at 50% 100%, #69ccb3c7, #2e5480);
  box-shadow: inset 0 -4px 20px 7px hsla(204, 11%, 54%, 0.432);
  transition: box-shadow 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
  transform-style: preserve-3d;
}
.cell-element {
  & img {
    transition: transform 200ms ease-out, filter 100ms ease-out;
  }
  .tooltip {
    top: -1rem;
    transition: top 150ms ease-in, opacity 150ms ease-out;
  }
  &:hover {
    .tooltip {
      transition: top 200ms ease-out, opacity 250ms ease-in;
      top: -2.5rem;
      opacity: 1;
    }
    img {
      filter: drop-shadow(0px 0px 0.5rem #cbd2d8);
      transform: scale(1.2);
      transition: transform 200ms ease-out, filter 150ms ease-out;
    }
  }
}
</style>
