<script setup>
const props = defineProps(['items'])
const items = props.items
</script>

<template>
  <ul class="list-disc list-inside">
    <li v-for="item in items" v-html="item"></li>
  </ul>
</template>
<style>
strong,
b {
  @apply text-accent;
}
li {
  padding: 0.25rem 0;
}
</style>
