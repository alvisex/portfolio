<template>
  <section class="h-screen section-carousel">
    <div class="container h-full flex items-center justify-center relative">
      <div class="absolute top-20 flex gap-8">
        <button class="" @click="rotation -= rotateConst" id="girar">Izquierda</button>
        <button class="" @click="rotation += rotateConst" id="girar">Derecha</button>
      </div>

      <div class="scene">
        <div class="carousel vue" ref="carousel" :style="{ transform: `translateZ(-120px) rotateX(-10deg) rotateY(${rotation}deg)` }">
          <div
            class="carousel_cell"
            :class="`_${index + 1}`"
            v-for="(card, index) in cards"
            :key="index"
            :style="{ transform: `rotateX(0deg) rotateY(${rotateConst * index}deg) rotateZ(0deg) translate3d(0px, 0px, ${space}px)` }"
          >
            <img :src="card.img" loading="lazy" width="93" :alt="card.text" class="image" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
//const carousel = ref()
const rotation = ref(0)

const cards = [
  { img: 'https://uploads-ssl.webflow.com/5ff8aa777f54dfb0394abbef/5ff8b5fba59e0a705c503a9a_burger.svg', text: 'Aasdf' },
  { img: 'https://uploads-ssl.webflow.com/5ff8aa777f54dfb0394abbef/5ff8b69166ed904fa3f3db1b_fried-chicken.svg', text: 'Aasdf' },
  { img: 'https://uploads-ssl.webflow.com/5ff8aa777f54dfb0394abbef/5ff8b5fb635b5e1229b8da6d_barbecue.svg', text: 'Aasdf' },
  { img: 'https://uploads-ssl.webflow.com/5ff8aa777f54dfb0394abbef/5ff8b5fb1cf9a0fd06dd9fc5_pizza.svg', text: 'Aasdf' },
  { img: 'https://uploads-ssl.webflow.com/5ff8aa777f54dfb0394abbef/5ff8b5fbe1772658d0143d9b_french-fries.svg', text: 'Aasdf' },
  { img: 'https://uploads-ssl.webflow.com/5ff8aa777f54dfb0394abbef/5ff8b5fb66ed9027d5f3dabb_hot-dog.svg', text: 'Aasdf' },
  { img: 'https://uploads-ssl.webflow.com/5ff8aa777f54dfb0394abbef/5ff8b5fbe177262d7e143d9a_shrimp.svg', text: 'Aasdf' },
  { img: 'https://uploads-ssl.webflow.com/5ff8aa777f54dfb0394abbef/5ff8b5fb635b5e1229b8da6d_barbecue.svg', text: 'Aasdf' },
  { img: 'https://uploads-ssl.webflow.com/5ff8aa777f54dfb0394abbef/5ff8b5fb635b5e1229b8da6d_barbecue.svg', text: 'Aasdf' },
  { img: 'https://uploads-ssl.webflow.com/5ff8aa777f54dfb0394abbef/5ff8b5fb1cf9a0fd06dd9fc5_pizza.svg', text: 'Aasdf' }
]

const rotateConst = 360 / cards.length
const space = 456
</script>

<style>
:root {
  --card-size: 140px;
}
section.section-carousel {
  background: radial-gradient(ellipse at bottom, #52ccda50 0%, #15161650 75%);
}
.scene {
  position: relative;
  width: 210px;
  height: 140px;
  perspective: 800px;
  perspective-origin: 50% 50%;
}
.carousel {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 800ms cubic-bezier(0.68, -0.55, 0.265, 1.55), -webkit-transform 800ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.carousel_cell {
  position: absolute;
  display: flex;
  width: calc(var(--card-size) * 1.5);
  height: var(--card-size);
  margin-top: 10px;
  margin-left: 10px;
  justify-content: center;
  align-items: center;
  border-style: solid;
  border-width: 2px;
  border-color: rgba(228, 173, 7, 0.13);
  border-radius: 40px;
  background-image: radial-gradient(circle farthest-corner at 50% 100%, #ffd293, #f4ebdc);
  box-shadow: inset 0 -4px 20px 7px hsla(0, 0%, 100%, 0.69);
  transition: box-shadow 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
  transform-style: preserve-3d;
}
</style>
