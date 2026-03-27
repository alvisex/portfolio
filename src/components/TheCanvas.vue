<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TresCanvas } from '@tresjs/core'

import CoolStuff from './CoolStuff.vue'

const screenWidth = ref(0)

onMounted(() => {
  screenWidth.value = window.innerWidth
  console.log('screenWidth', screenWidth.value)
})
</script>

<template>
  <div class="h-screen intro" v-if="screenWidth > 768">
      <TresCanvas
        :alpha="true"
        :clear-alpha="0"
        id="mycanvas"
        window-size
      >
     <CoolStuff  />
     <!--  <TheExperiencee  /> -->
    </TresCanvas>
  </div>
  <div v-else class="h-32"></div>
</template>

<style lang="scss">
canvas#mycanvas {
  pointer-events: none !important;
  opacity: 0;
}
</style>